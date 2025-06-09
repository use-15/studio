
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Heart, PlusCircle, Trash2, Edit3, MoreVertical, ExternalLink } from 'lucide-react';
import type { WellnessResource, Board } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useBoardsContext } from '@/components/AppProviders';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';


interface ResourceCardProps {
  resource: WellnessResource;
  className?: string;
  showAddToBoard?: boolean;
  showRemoveFromBoard?: boolean;
  boardIdForRemoval?: string;
}

export default function ResourceCard({ resource, className, showAddToBoard = true, showRemoveFromBoard = false, boardIdForRemoval }: ResourceCardProps) {
  const boardsContext = useBoardsContext();
  const { toast } = useToast();
  const [newBoardName, setNewBoardName] = useState('');
  const [isCreateBoardDialogOpen, setIsCreateBoardDialogOpen] = useState(false);

  if (!boardsContext) {
    // This should ideally not happen if AppProviders wraps the app
    return <div>Loading boards context...</div>;
  }
  const { boards, addResourceToBoard, createBoard, removeResourceFromBoard } = boardsContext;

  const handleAddToBoard = (boardId: string) => {
    addResourceToBoard(boardId, resource);
    const board = boards.find(b => b.id === boardId);
    toast({
      title: "Added to board",
      description: `"${resource.title}" added to "${board?.name}".`,
    });
  };

  const handleCreateAndAddBoard = () => {
    if (newBoardName.trim() === '') {
      toast({ title: "Error", description: "Board name cannot be empty.", variant: "destructive" });
      return;
    }
    const newBoard = createBoard(newBoardName);
    addResourceToBoard(newBoard.id, resource);
    toast({
      title: "Board Created & Resource Added",
      description: `"${resource.title}" added to new board "${newBoard.name}".`,
    });
    setNewBoardName('');
    setIsCreateBoardDialogOpen(false);
  };
  
  const handleRemoveFromBoard = () => {
    if (boardIdForRemoval) {
      removeResourceFromBoard(boardIdForRemoval, resource.id);
      const board = boards.find(b => b.id === boardIdForRemoval);
      toast({
        title: "Removed from board",
        description: `"${resource.title}" removed from "${board?.name}".`,
      });
    }
  };

  return (
    <Card className={cn("flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg", className)}>
      <CardHeader className="p-0 relative">
        <Image
          src={resource.imageUrl}
          alt={resource.title}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
          {...(resource['data-ai-hint'] ? { 'data-ai-hint': resource['data-ai-hint'] } : {})}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="mb-2 capitalize">{resource.category}</Badge>
          {resource.duration && <Badge variant="outline" className="text-xs">{resource.duration}</Badge>}
        </div>
        <CardTitle className="text-lg font-headline mb-1 line-clamp-2">{resource.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-3 mb-3">{resource.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        {resource.contentUrl && resource.contentUrl !== '#' ? (
          <Button asChild variant="link" className="p-0 h-auto text-primary hover:text-primary/80">
            <Link href={resource.contentUrl} target="_blank" rel="noopener noreferrer">
              Learn More <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        ) : (
          <div /> 
        )}

        {(showAddToBoard || showRemoveFromBoard) && (
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {showAddToBoard && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Add to Board</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {boards.length > 0 ? boards.map(board => (
                      <DropdownMenuItem key={board.id} onClick={() => handleAddToBoard(board.id)}>
                        {board.name}
                      </DropdownMenuItem>
                    )) : (
                       <DropdownMenuItem disabled>No boards yet</DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault(); // Prevent DropdownMenu from closing
                        setIsCreateBoardDialogOpen(true); // Open the Dialog
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Create New Board
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
              {showRemoveFromBoard && boardIdForRemoval && (
                 <DropdownMenuItem onClick={handleRemoveFromBoard} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Remove from this board</span>
                </DropdownMenuItem>
              )}
              {/* Example other actions */}
              {/* <DropdownMenuItem><Heart className="mr-2 h-4 w-4" /><span>Favorite</span></DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>

      <Dialog open={isCreateBoardDialogOpen} onOpenChange={setIsCreateBoardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
            <DialogDescription>
              Enter a name for your new board. "{resource.title}" will be added to it automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-board-name" className="text-right">
                Name
              </Label>
              <Input
                id="new-board-name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Morning Routines"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCreateBoardDialogOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleCreateAndAddBoard}>Create & Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
