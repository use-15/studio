
"use client";

import React from 'react';
import { useBoards, type useBoards as UseBoardsType } from '@/hooks/useBoards'; // Correctly import the hook and its type
import { ThemeProvider } from 'next-themes';

type BoardsContextType = ReturnType<UseBoardsType> | null;

export const BoardsContext = React.createContext<BoardsContextType>(null);

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const boardsApi = useBoards();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <BoardsContext.Provider value={boardsApi}>
        {children}
      </BoardsContext.Provider>
    </ThemeProvider>
  );
}

export function useBoardsContext() {
  const context = React.useContext(BoardsContext);
  if (context === null) {
    throw new Error("useBoardsContext must be used within a BoardsProvider");
  }
  return context;
}
