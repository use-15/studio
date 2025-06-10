
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import AppLayout from '@/components/AppLayout';
import ResourceCard from '@/components/ResourceCard';
import { curatedWellnessResources } from '@/lib/placeholder-data';
import type { WellnessResource } from '@/types';
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-recommendations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Sparkles, BookOpen, UserCheck, Box, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  const [personalizedRecs, setPersonalizedRecs] = useState<WellnessResource[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(true);
  const [userInterestQuery, setUserInterestQuery] = useState('');

  const fetchRecommendations = async (query?: string) => {
    setIsLoadingRecs(true);
    try {
      let activityPrompt = "User is interested in mindfulness, healthy eating, and light yoga. Prefers short articles and guided meditations.";
      if (query && query.trim() !== '') {
        activityPrompt = `User is specifically interested in: ${query}. Please provide wellness resources related to these topics.`;
      }
      
      const result = await getPersonalizedRecommendations({ userActivity: activityPrompt });
      
      const mappedRecs: WellnessResource[] = result.recommendations.slice(0, 3).map((recText, index) => ({
        id: `PR${index + 1}-${query || 'initial'}`, // Ensure unique IDs
        title: recText.length > 60 ? recText.substring(0, 57) + "..." : recText,
        description: recText,
        imageUrl: `https://placehold.co/600x400.png`,
        category: 'Personalized',
        type: 'tip',
        'data-ai-hint': 'wellness abstract'
      }));
      setPersonalizedRecs(mappedRecs);
    } catch (error) {
      console.error("Failed to fetch personalized recommendations:", error);
      setPersonalizedRecs([]); // Clear recommendations on error
    }
    setIsLoadingRecs(false);
  };

  useEffect(() => {
    fetchRecommendations(); // Fetch initial recommendations
  }, []);

  const handleGetInterestRecommendations = (e: FormEvent) => {
    e.preventDefault();
    fetchRecommendations(userInterestQuery);
  };

  return (
    <AppLayout>
      <div className="space-y-16 md:space-y-24">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 lg:py-28 bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-xl overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10">
             <Image src="https://placehold.co/1600x900.png" alt="Background image of people gathering" layout="fill" objectFit="cover" data-ai-hint="people gathering" priority />
          </div>
          <div className="relative z-10 container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-primary mb-6 pt-8">
              Welcome to Aramiyot Wellness Hub
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-3xl mx-auto">
              Your personal sanctuary for holistic wellbeing. Discover resources, track your journey, and cultivate a healthier, happier you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
                <Link href="/wellness-library">
                    Explore Wellness Library <BookOpen className="ml-2 h-5 w-5" />
                </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="shadow-lg transition-transform hover:scale-105">
                <Link href="/my-boards">
                    Create Your Boards <UserCheck className="ml-2 h-5 w-5" />
                </Link>
                </Button>
            </div>
          </div>
        </section>

        {/* Personalized Recommendations Section */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-3">Tailored Just For You</h2>
            <p className="text-md md:text-lg text-muted-foreground max-w-xl mx-auto">AI-powered suggestions to guide your wellness journey. Tell us what you're interested in!</p>
          </div>
          
          <form onSubmit={handleGetInterestRecommendations} className="max-w-xl mx-auto mb-8 flex gap-2">
            <Input
              type="text"
              value={userInterestQuery}
              onChange={(e) => setUserInterestQuery(e.target.value)}
              placeholder="e.g., stress relief, healthy recipes, sleep tips"
              className="flex-grow"
              aria-label="Your wellness interests"
            />
            <Button type="submit" disabled={isLoadingRecs}>
              <Search className="mr-2 h-4 w-4" />
              {isLoadingRecs && userInterestQuery ? 'Fetching...' : 'Get My Recommendations'}
            </Button>
          </form>

          {isLoadingRecs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={`pulse-${i}`} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : personalizedRecs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalizedRecs.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
             <Card className="text-center p-8">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-xl font-semibold mb-2">No Recommendations Found</CardTitle>
                <p className="text-muted-foreground mb-4">We couldn't find specific recommendations for that. Try different keywords or explore our library!</p>
                <Button asChild variant="secondary">
                  <Link href="/wellness-library">Browse Library</Link>
                </Button>
              </Card>
          )}
        </section>
        
        {/* 3D Animation Placeholder Section */}
        <section className="container mx-auto px-4 py-12 md:py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-6">
            Visualize Your Path to Wellness
          </h2>
          <p className="text-md md:text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
            Imagine an interactive 3D animation here, dynamically representing your health progress, goals, and areas of focus. This space is ready for a stunning visual experience.
          </p>
          <div className="aspect-video bg-card/50 backdrop-blur-sm rounded-xl shadow-xl border border-dashed border-primary/30 flex items-center justify-center p-4 ring-1 ring-inset ring-primary/20">
            <div className="text-center p-6 md:p-8 bg-background/70 rounded-lg">
              <Box className="h-16 w-16 md:h-20 md:w-20 text-primary/60 mx-auto mb-4" /> 
              <p className="text-xl font-semibold text-primary/90">
                Future 3D Health Visualization
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                (Developer: Integrate 3D animation component here using libraries like React Three Fiber or Spline.)
              </p>
            </div>
          </div>
        </section>

        {/* Curated Content Section / Features Overview */}
        <section className="container mx-auto px-4">
           <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-3">Discover a World of Wellness</h2>
            <p className="text-md md:text-lg text-muted-foreground max-w-xl mx-auto">Curated articles, calming audios, and practical tips to enhance your life.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {curatedWellnessResources.slice(0, 3).map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          <div className="text-center">
            <Button variant="outline" size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/wellness-library">
                Explore All Resources <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Call to Action / Footer Teaser */}
        <section className="py-12 md:py-16 bg-muted/50">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-2xl md:text-3xl font-bold font-headline text-primary mb-4">Ready to Start Your Journey?</h2>
                <p className="text-md md:text-lg text-foreground/70 mb-8 max-w-xl mx-auto">
                    Join Aramiyot today and take the first step towards a more balanced and fulfilling life.
                </p>
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform hover:scale-105">
                    <Link href="/chatbot">
                        Chat with our AI Assistant <Sparkles className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </section>
      </div>
    </AppLayout>
  );
}

    