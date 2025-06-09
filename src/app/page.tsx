"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import ResourceCard from '@/components/ResourceCard';
import { curatedWellnessResources } from '@/lib/placeholder-data';
import type { WellnessResource } from '@/types';
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-recommendations';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  const [personalizedRecs, setPersonalizedRecs] = useState<WellnessResource[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      setIsLoadingRecs(true);
      try {
        // In a real app, userActivity would be dynamically determined
        const userActivity = "User is interested in mindfulness, healthy eating, and light yoga. Prefers short articles and guided meditations.";
        const result = await getPersonalizedRecommendations({ userActivity });
        
        const mappedRecs: WellnessResource[] = result.recommendations.map((recText, index) => ({
          id: `PR${index + 1}`,
          title: recText.length > 60 ? recText.substring(0, 57) + "..." : recText, // Simple title generation
          description: recText,
          imageUrl: `https://placehold.co/600x400.png`, // Placeholder image
          category: 'Personalized',
          type: 'tip', // Assuming recommendations are tips or short content
          'data-ai-hint': 'wellness abstract' // Generic hint for AI images
        }));
        setPersonalizedRecs(mappedRecs);
      } catch (error) {
        console.error("Failed to fetch personalized recommendations:", error);
        // Optionally set some default recommendations or show an error message
      }
      setIsLoadingRecs(false);
    }
    fetchRecommendations();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 p-8 md:p-12 lg:p-16 rounded-xl overflow-hidden">
          <div className="absolute inset-0 opacity-20">
             <Image src="https://placehold.co/1200x400.png" alt="Wellness background" layout="fill" objectFit="cover" data-ai-hint="wellness abstract" />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-4">
              Welcome to Aramiyot
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-6 max-w-2xl">
              Your personal sanctuary for holistic wellness. Discover resources, track your journey, and nurture your wellbeing.
            </p>
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/wellness-library">
                Explore Library <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Personalized Recommendations Section */}
        <section>
          <h2 className="text-3xl font-bold font-headline mb-6 text-gray-800">Personalized For You</h2>
          {isLoadingRecs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border bg-card text-card-foreground shadow-sm rounded-lg p-4 space-y-3 animate-pulse">
                  <div className="h-48 bg-muted rounded"></div>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : personalizedRecs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalizedRecs.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No personalized recommendations available at the moment. Explore our library to get started!</p>
          )}
        </section>

        {/* Curated Content Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold font-headline text-gray-800">Discover Wellness</h2>
            <Button variant="outline" asChild>
              <Link href="/wellness-library">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curatedWellnessResources.slice(0, 3).map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
