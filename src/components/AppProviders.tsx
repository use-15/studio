
"use client";

import React, { useState, useEffect, useContext, createContext } from 'react';
import { useBoards as useBoardsHook, type useBoards as UseBoardsType } from '@/hooks/useBoards';
import { ThemeProvider } from 'next-themes';
import { auth } from '@/lib/firebase'; // Import Firebase auth instance
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

type BoardsContextType = ReturnType<UseBoardsType> | null;
export const BoardsContext = createContext<BoardsContextType>(null);

interface AuthContextType {
  currentUser: User | null;
  loadingAuth: boolean;
  userId: string | null;
}
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loadingAuth: true,
  userId: null,
});

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const boardsApi = useBoardsHook(); // Renamed to avoid conflict
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setUserId(user.uid);
      } else {
        // If no user, sign in anonymously
        try {
          const userCredential = await signInAnonymously(auth);
          setCurrentUser(userCredential.user);
          setUserId(userCredential.user.uid);
        } catch (error) {
          console.error("Error signing in anonymously:", error);
          // Handle error appropriately, e.g., show an error message
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  if (loadingAuth && boardsApi.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading application...</p>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthContext.Provider value={{ currentUser, loadingAuth, userId }}>
        <BoardsContext.Provider value={boardsApi}>
          {children}
        </BoardsContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export function useBoardsContext() {
  const context = useContext(BoardsContext);
  if (context === null) {
    throw new Error("useBoardsContext must be used within a BoardsProvider");
  }
  return context;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
