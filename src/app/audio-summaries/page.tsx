
"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import ResourceCard from '@/components/ResourceCard';
import { audioBookSummaries as importedAudioBookSummaries } from '@/lib/placeholder-data';
import type { WellnessResource } from '@/types';
import { Headphones, Loader2 } from 'lucide-react';

export default function AudioSummariesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [audioBookSummaries, setAudioBookSummaries] = useState<WellnessResource[]>([]);

  useEffect(() => {
    // Set data after component has mounted to ensure client-side context
    setAudioBookSummaries(importedAudioBookSummaries);
    setIsLoading(false);
  }, []);

  const pageHeader = (
    <header className="pb-6 border-b">
      <div className="flex items-center space-x-3">
        <Headphones className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">Audio Book Summaries</h1>
          <p className="text-lg text-muted-foreground mt-1">
            Listen to key insights from popular books to learn on the go.
          </p>
        </div>
      </div>
    </header>
  );

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          {pageHeader}
          <div className="text-center py-12">
            <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin mb-4" />
            <p className="text-xl text-muted-foreground">Loading resources...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {pageHeader}
        {audioBookSummaries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {audioBookSummaries.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Headphones className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No audio summaries available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-1">Check back later for new content.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
