
"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import ResourceCard from '@/components/ResourceCard';
import { freeOnlineLibraries } from '@/lib/placeholder-data';
import { BookMarked } from 'lucide-react';

export default function FreeOnlineLibraryPage() {
  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="pb-6 border-b">
          <div className="flex items-center space-x-3">
            <BookMarked className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">Free Online Libraries</h1>
              <p className="text-lg text-muted-foreground mt-1">
                Discover and access a world of knowledge with these free digital libraries.
              </p>
            </div>
          </div>
        </header>

        {freeOnlineLibraries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {freeOnlineLibraries.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookMarked className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No online libraries listed at the moment.</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later for new additions.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
