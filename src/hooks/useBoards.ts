
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { WellnessResource, Board } from '@/types';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
  writeBatch,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { useAuthContext } from '@/components/AppProviders';

const BOARDS_COLLECTION = 'userBoards'; // Collection to store boards for each user

export function useBoards() {
  const { userId, loadingAuth } = useAuthContext();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loadingAuth || !userId) {
      // Wait for auth to complete and userId to be available
      if (!loadingAuth && !userId) { // Auth finished but no user (should not happen with anonymous)
        setIsLoading(false);
        setBoards([]); // Clear boards if no user
      }
      return;
    }

    setIsLoading(true);
    const userBoardsCollectionRef = collection(db, BOARDS_COLLECTION, userId, 'boards');
    
    const unsubscribe = onSnapshot(
      userBoardsCollectionRef,
      (snapshot) => {
        const fetchedBoards: Board[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Board));
        setBoards(fetchedBoards);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching boards from Firestore:", error);
        setIsLoading(false);
        setBoards([]); // Reset boards on error
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount

  }, [userId, loadingAuth]);

  const createBoard = useCallback(async (name: string): Promise<Board> => {
    if (!userId) throw new Error("User not authenticated to create board.");
    const newBoardData = { name, resources: [], createdAt: Timestamp.now() }; // Add createdAt
    const userBoardsCollectionRef = collection(db, BOARDS_COLLECTION, userId, 'boards');
    const docRef = await addDoc(userBoardsCollectionRef, newBoardData);
    const newBoard: Board = { id: docRef.id, ...newBoardData } as Board; // Type assertion might be needed based on exact structure
    // setBoards(prev => [...prev, newBoard]); // Firestore listener will update state
    return newBoard;
  }, [userId]);

  const addResourceToBoard = useCallback(async (boardId: string, resource: WellnessResource) => {
    if (!userId) throw new Error("User not authenticated to add resource.");
    const boardDocRef = doc(db, BOARDS_COLLECTION, userId, 'boards', boardId);
    
    // Ensure resource has a valid ID, otherwise Firestore might reject it in an array
    if (!resource.id) {
        console.error("Resource missing ID, cannot add to board:", resource);
        throw new Error("Resource missing ID.");
    }

    // Sanitize resource object to ensure it's Firestore-compatible (e.g. no undefined values in complex objects)
    const sanitizedResource = JSON.parse(JSON.stringify(resource));

    await updateDoc(boardDocRef, {
      resources: arrayUnion(sanitizedResource) // Use arrayUnion to add resource if not present
    });
    // Firestore listener will update state
  }, [userId]);

  const removeResourceFromBoard = useCallback(async (boardId: string, resourceId: string) => {
    if (!userId) throw new Error("User not authenticated to remove resource.");
    const boardDocRef = doc(db, BOARDS_COLLECTION, userId, 'boards', boardId);
    
    // To remove an item from an array, we need to get the board, filter resources, then update.
    // A more direct way is to find the specific resource object to remove.
    // For simplicity with arrayRemove, we need the exact object.
    // This might be tricky if the object in Firestore has server timestamps or other differences.
    // A common pattern is to store resources with their IDs as keys in a map if frequent removal/update is needed,
    // or fetch the document, modify the array, and then update.

    // Assuming resourceId is enough, we find the board and filter locally first (optimistic)
    // then tell Firestore to remove it. For arrayRemove, we need the exact object.
    // This is tricky if the object in Firestore has slight differences.
    // Let's fetch the current board, find the resource, and then use arrayRemove.
    
    const currentBoard = boards.find(b => b.id === boardId);
    if (currentBoard) {
      const resourceToRemove = currentBoard.resources.find(r => r.id === resourceId);
      if (resourceToRemove) {
        await updateDoc(boardDocRef, {
          resources: arrayRemove(resourceToRemove)
        });
      }
    }
    // Firestore listener will update state
  }, [userId, boards]);
  
  const deleteBoard = useCallback(async (boardId: string) => {
    if (!userId) throw new Error("User not authenticated to delete board.");
    const boardDocRef = doc(db, BOARDS_COLLECTION, userId, 'boards', boardId);
    await deleteDoc(boardDocRef);
    // Firestore listener will update state
  }, [userId]);

  const getBoardById = useCallback((boardId: string) => {
    return boards.find(board => board.id === boardId);
  }, [boards]);

  const updateBoardName = useCallback(async (boardId: string, newName: string) => {
    if (!userId) throw new Error("User not authenticated to update board name.");
    const boardDocRef = doc(db, BOARDS_COLLECTION, userId, 'boards', boardId);
    await updateDoc(boardDocRef, { name: newName });
    // Firestore listener will update state
  }, [userId]);

  // setBoards is not typically exposed if Firestore listeners manage state,
  // but can be useful for optimistic updates or local state management if needed.
  return { boards, isLoading, createBoard, addResourceToBoard, removeResourceFromBoard, deleteBoard, getBoardById, updateBoardName };
}
