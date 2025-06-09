"use client";

import { useState, useEffect, useCallback } from 'react';
import type { WellnessResource, Board } from '@/types';

const LOCAL_STORAGE_KEY = 'armiyot_boards';

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined') {
      try {
        const storedBoards = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedBoards) {
          setBoards(JSON.parse(storedBoards));
        }
      } catch (error) {
        console.error("Failed to load boards from localStorage", error);
        // Potentially clear corrupted storage
        // localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(boards));
      } catch (error) {
        console.error("Failed to save boards to localStorage", error);
      }
    }
  }, [boards, isLoading]);

  const createBoard = useCallback((name: string): Board => {
    const newBoard: Board = { id: Date.now().toString(), name, resources: [] };
    setBoards(prev => [...prev, newBoard]);
    return newBoard;
  }, []);

  const addResourceToBoard = useCallback((boardId: string, resource: WellnessResource) => {
    setBoards(prev =>
      prev.map(board =>
        board.id === boardId
          ? { ...board, resources: [...board.resources.filter(r => r.id !== resource.id), resource] }
          : board
      )
    );
  }, []);

  const removeResourceFromBoard = useCallback((boardId: string, resourceId: string) => {
    setBoards(prev =>
      prev.map(board =>
        board.id === boardId
          ? { ...board, resources: board.resources.filter(r => r.id !== resourceId) }
          : board
      )
    );
  }, []);
  
  const deleteBoard = useCallback((boardId: string) => {
    setBoards(prev => prev.filter(board => board.id !== boardId));
  }, []);

  const getBoardById = useCallback((boardId: string) => {
    return boards.find(board => board.id === boardId);
  }, [boards]);

  const updateBoardName = useCallback((boardId: string, newName: string) => {
    setBoards(prev =>
      prev.map(board =>
        board.id === boardId ? { ...board, name: newName } : board
      )
    );
  }, []);

  return { boards, isLoading, createBoard, addResourceToBoard, removeResourceFromBoard, deleteBoard, getBoardById, updateBoardName, setBoards };
}
