"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import ResourceCard from '@/components/ResourceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { PlusCircle, Trash2, Edit3, X, GripVertical, LayoutGrid, List } from 'lucide-react';
import type { Board } from '@/types';
import { useBoardsContext } from '@/components/AppProviders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function MyBoardsPage() {
  const boardsContext = useBoardsContext();
  const [newBoardName, setNewBoardName] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [editingBoardName, setEditingBoardName] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // 'grid' or 'list'

  useEffect(() => {
    // If a board is deleted and it was the selectedBoard, clear selection
    if (selectedBoard && boardsContext && !boardsContext.boards.find(b => b.id === selectedBoard.id)) {
      setSelectedBoard(null);
    }
  }, [boardsContext?.boards, selectedBoard]);


  if (!boardsContext) return <AppLayout><div>Loading...</div></AppLayout>; // Or a proper loader
  const { boards, createBoard, deleteBoard, updateBoardName } = boardsContext;

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      createBoard(newBoardName.trim());
      setNewBoardName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleDeleteBoard = (boardId: string) => {
    deleteBoard(boardId);
    if (selectedBoard?.id === boardId) {
      setSelectedBoard(null);
    }
  };

  const handleEditBoard = (board: Board) => {
    setEditingBoard(board);
    setEditingBoardName(board.name);
  };

  const handleSaveEditBoard = () => {
    if (editingBoard && editingBoardName.trim()) {
      updateBoardName(editingBoard.id, editingBoardName.trim());
      if (selectedBoard?.id === editingBoard.id) {
        setSelectedBoard(prev => prev ? { ...prev, name: editingBoardName.trim() } : null);
      }
      setEditingBoard(null);
    }
  };

  const renderBoardItem = (board: Board) => (
    <Card 
      key={board.id} 
      className={`hover:shadow-lg transition-shadow cursor-pointer ${selectedBoard?.id === board.id ? 'ring-2 ring-primary' : ''}`}
      onClick={() => setSelectedBoard(board)}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-headline">{board.name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
              <GripVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleEditBoard(board)}}>
              <Edit3 className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {e.stopPropagation(); handleDeleteBoard(board.id)}} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{board.resources.length} item(s)</p>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="pb-6 border-b flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold font-headline text-primary">My Boards</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Organize your favorite wellness resources into personalized boards.
            </p>
          </div>
           <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Board
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Board</DialogTitle>
                <DialogDescription>
                  Give your new board a name to start organizing resources.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="E.g., Mindfulness Practices, Healthy Recipes"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button onClick={handleCreateBoard}>Create Board</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        {editingBoard && (
          <Dialog open={!!editingBoard} onOpenChange={() => setEditingBoard(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Board Name</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  value={editingBoardName}
                  onChange={(e) => setEditingBoardName(e.target.value)}
                />
              </div>
              <DialogFooter>
                 <Button variant="outline" onClick={() => setEditingBoard(null)}>Cancel</Button>
                <Button onClick={handleSaveEditBoard}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <h2 className="text-2xl font-semibold">Your Boards</h2>
            {boards.length > 0 ? (
              <div className="space-y-3">
                {boards.map(renderBoardItem)}
              </div>
            ) : (
              <div className="text-center py-8 px-4 border border-dashed rounded-lg">
                <p className="text-muted-foreground">You haven't created any boards yet.</p>
                <Button variant="link" onClick={() => setIsCreateDialogOpen(true)} className="mt-2">Create your first board</Button>
              </div>
            )}
          </div>

          <div className="md:col-span-8 lg:col-span-9">
            {selectedBoard ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold font-headline text-primary">{selectedBoard.name}</h2>
                    <div>
                        <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')} className="mr-2">
                            <LayoutGrid className="h-5 w-5" />
                        </Button>
                        <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                            <List className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                {selectedBoard.resources.length > 0 ? (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                    {selectedBoard.resources.map(resource => (
                       viewMode === 'grid' ? (
                        <ResourceCard
                          key={resource.id}
                          resource={resource}
                          showAddToBoard={false} /* Already on a board */
                          showRemoveFromBoard={true}
                          boardIdForRemoval={selectedBoard.id}
                        />
                      ) : (
                        <Card key={resource.id} className="flex items-center p-4">
                          <img src={resource.imageUrl} alt={resource.title} className="w-16 h-16 object-cover rounded mr-4" {...(resource['data-ai-hint'] ? { 'data-ai-hint': resource['data-ai-hint'] } : {})}/>
                          <div className="flex-grow">
                            <h3 className="font-semibold">{resource.title}</h3>
                            <p className="text-sm text-muted-foreground">{resource.category}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => boardsContext.removeResourceFromBoard(selectedBoard.id, resource.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </Card>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4 border border-dashed rounded-lg">
                    <p className="text-xl text-muted-foreground">This board is empty.</p>
                    <p className="text-sm text-muted-foreground mt-1">Add resources from the <Link href="/wellness-library" className="text-primary hover:underline">Wellness Library</Link>.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8 border border-dashed rounded-lg bg-muted/20">
                <KanbanSquare className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">Select a board to view its content</p>
                <p className="text-sm text-muted-foreground mt-1">or create a new board to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
