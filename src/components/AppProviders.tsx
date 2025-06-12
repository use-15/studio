
"use client";

import React, { useState, useEffect, useContext, createContext } from 'react';
import { useBoards as useBoardsHook, type useBoards as UseBoardsType } from '@/hooks/useBoards';
import { ThemeProvider } from 'next-themes';
import { auth, db } from '@/lib/firebase'; // Import Firebase auth and db instances
import { onAuthStateChanged, signInAnonymously, type User, type AuthError } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Import useToast

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
  const boardsApi = useBoardsHook();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast(); // Initialize toast

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setUserId(user.uid);
        setLoadingAuth(false);
      } else {
        // If no user, sign in anonymously
        try {
          const userCredential = await signInAnonymously(auth);
          setCurrentUser(userCredential.user);
          setUserId(userCredential.user.uid);
        } catch (error) {
          console.error("Error signing in anonymously:", error);
          const authError = error as AuthError;
          if (authError.code === 'auth/api-key-not-valid') {
            toast({
              title: "Firebase Configuration Error",
              description: "Invalid API Key. Please ensure your Firebase configuration in 'src/lib/firebase.ts' is correct.",
              variant: "destructive",
              duration: 10000, // Keep message longer
            });
            console.error("CRITICAL: Firebase API Key is not valid. Please check your 'src/lib/firebase.ts' configuration.");
          } else {
             toast({
              title: "Authentication Error",
              description: "Could not sign in anonymously. Some features may not work.",
              variant: "destructive",
            });
          }
          // Still set loading to false so the app doesn't hang indefinitely
        } finally {
          setLoadingAuth(false);
        }
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [toast]); // Add toast to dependency array

  if (loadingAuth || boardsApi.isLoading) {
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
