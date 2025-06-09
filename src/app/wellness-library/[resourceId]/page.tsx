
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useParams, notFound } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { curatedWellnessResources } from '@/lib/placeholder-data';
import type { WellnessResource, Review } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Star, DownloadCloud, MessageSquare, CheckCircle, BookOpen, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Helper for localStorage
const getReviewsFromStorage = (resourceId: string): Review[] => {
  if (typeof window === 'undefined') return [];
  try {
    const storedReviews = localStorage.getItem(`reviews_${resourceId}`);
    return storedReviews ? JSON.parse(storedReviews) : [];
  } catch (error) {
    console.error("Error parsing reviews from localStorage:", error);
    return [];
  }
};

const saveReviewsToStorage = (resourceId: string, reviews: Review[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`reviews_${resourceId}`, JSON.stringify(reviews));
  } catch (error) {
    console.error("Error saving reviews to localStorage:", error);
  }
};

const getOfflineResourceFromStorage = (resourceId: string): WellnessResource | null => {
  if (typeof window === 'undefined') return null;
  try {
    const storedResource = localStorage.getItem(`offline_${resourceId}`);
    return storedResource ? JSON.parse(storedResource) : null;
  } catch (error) {
    console.error("Error parsing offline resource from localStorage:", error);
    return null;
  }
};

const saveOfflineResourceToStorage = (resource: WellnessResource) => {
  if (typeof window === 'undefined') return;
  try {
    if (resource.type === 'article' && resource.contentMarkdown) {
      const offlineCopy = { ...resource };
      // No need to strip anything for articles, save full needed data.
      localStorage.setItem(`offline_${resource.id}`, JSON.stringify(offlineCopy));
    } else if (resource.type === 'video' && resource.youtubeVideoId) {
      // For videos, save metadata and the video ID/link for bookmarking
      const offlineCopy = { 
        id: resource.id, 
        title: resource.title, 
        description: resource.description, 
        imageUrl: resource.imageUrl, 
        category: resource.category, 
        type: resource.type, 
        youtubeVideoId: resource.youtubeVideoId,
        contentUrl: resource.contentUrl // Save original URL for video
      };
      localStorage.setItem(`offline_${resource.id}`, JSON.stringify(offlineCopy));
    }
  } catch (error) {
    console.error("Error saving offline resource to localStorage:", error);
  }
};


export default function ResourceDetailPage() {
  const params = useParams();
  const resourceId = params.resourceId as string;
  const [resource, setResource] = useState<WellnessResource | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ userName: '', rating: 0, comment: '' });
  const [currentRating, setCurrentRating] = useState(0);
  const [isOffline, setIsOffline] = useState(false);
  const [isSavedForOffline, setIsSavedForOffline] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check online status
    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  useEffect(() => {
    if (resourceId) {
      let foundResource: WellnessResource | undefined | null = null;
      if (isOffline) {
        foundResource = getOfflineResourceFromStorage(resourceId);
        if (foundResource) {
          toast({ title: "Offline Mode", description: "Displaying saved version of this resource." });
        } else {
           toast({ title: "Offline Mode", description: "This resource is not saved for offline viewing.", variant: "destructive"});
        }
      } else {
        foundResource = curatedWellnessResources.find(r => r.id === resourceId);
      }
      
      if (foundResource) {
        setResource(foundResource);
        setReviews(getReviewsFromStorage(resourceId));
        setIsSavedForOffline(!!getOfflineResourceFromStorage(resourceId));
      } else if (!isOffline) {
        // If online and not found in curated, then it's a 404 (unless we fetch from an API later)
        // For now, with static data, if not found it's a notFound.
        // notFound(); // This would throw a 404
      }
    }
  }, [resourceId, isOffline, toast]);

  const handleRatingChange = (rate: number) => {
    setCurrentRating(rate);
    setNewReview({ ...newReview, rating: rate });
  };

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newReview.comment.trim() === '' || newReview.rating === 0 || newReview.userName.trim() === '') {
      toast({ title: "Review Incomplete", description: "Please provide your name, a rating, and a comment.", variant: "destructive" });
      return;
    }
    const reviewToAdd: Review = {
      id: Date.now().toString(),
      resourceId,
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      timestamp: new Date().toISOString(),
    };
    const updatedReviews = [...reviews, reviewToAdd];
    setReviews(updatedReviews);
    saveReviewsToStorage(resourceId, updatedReviews);
    setNewReview({ userName: '', rating: 0, comment: '' });
    setCurrentRating(0);
    toast({ title: "Review Submitted", description: "Thank you for your feedback!" });
  };

  const handleSaveForOffline = () => {
    if (resource) {
      saveOfflineResourceToStorage(resource);
      setIsSavedForOffline(true);
      toast({ title: "Saved for Offline", description: `"${resource.title}" is now available offline.` });
    }
  };
  
  if (!resource && !isOffline) {
     // Still loading or not found yet while online
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-muted-foreground">Loading resource...</p>
        </div>
      </AppLayout>
    );
  }
  
  if (!resource && isOffline) {
    // Offline and resource not in storage
     return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
           <Alert variant="destructive" className="mb-6">
            <BookOpen className="h-4 w-4" />
            <AlertTitle>Offline & Unavailable</AlertTitle>
            <AlertDescription>
              You are currently offline, and this resource has not been saved for offline access. Please connect to the internet to view it or save it when online.
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
     );
  }
  
  // If resource is null after checks, it implies it truly wasn't found
  // For now, this handles the case where it might still be null
  if (!resource) {
    notFound(); // Trigger Next.js 404
  }


  const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {isOffline && !isSavedForOffline && (
          <Alert variant="destructive" className="mb-6">
            <BookOpen className="h-4 w-4" />
            <AlertTitle>Offline & Not Saved</AlertTitle>
            <AlertDescription>
              You are currently offline. This resource is not saved for offline viewing. Some content or functionality might be limited.
            </AlertDescription>
          </Alert>
        )}
         {isOffline && isSavedForOffline && (
          <Alert variant="default" className="mb-6 bg-secondary">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Viewing Offline Version</AlertTitle>
            <AlertDescription>
              You are currently viewing a saved offline version of this resource.
            </AlertDescription>
          </Alert>
        )}
        <article>
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:gap-6">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                     <Image
                        src={resource.imageUrl}
                        alt={resource.title}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover rounded-lg shadow-md"
                        data-ai-hint={resource['data-ai-hint'] || 'wellness resource detail'}
                        priority
                    />
                </div>
                <div className="w-full md:w-2/3">
                    <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="capitalize">{resource.category}</Badge>
                        {resource.duration && <Badge variant="outline">{resource.duration}</Badge>}
                         <Badge variant={resource.type === 'article' ? "default" : resource.type === 'video' ? "destructive" : "outline"} className="capitalize flex items-center gap-1">
                            {resource.type === 'article' && <BookOpen className="h-3 w-3" />}
                            {resource.type === 'video' && <Video className="h-3 w-3" />}
                            {resource.type}
                        </Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary mb-3">{resource.title}</h1>
                    <p className="text-lg text-muted-foreground mb-4">{resource.description}</p>
                     <div className="flex items-center space-x-1 mb-4">
                        {reviews.length > 0 && (
                            <>
                                {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={`h-5 w-5 ${averageRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                                ))}
                                <span className="ml-1 text-sm text-muted-foreground">({averageRating.toFixed(1)} from {reviews.length} reviews)</span>
                            </>
                        )}
                    </div>
                    {!isOffline && !isSavedForOffline && (
                        <Button onClick={handleSaveForOffline} variant="outline">
                        <DownloadCloud className="mr-2 h-4 w-4" />
                        Save for Offline
                        </Button>
                    )}
                    {isSavedForOffline && (
                         <div className="flex items-center text-green-600">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            <span>Saved for Offline Access</span>
                        </div>
                    )}
                </div>
            </div>
          </header>

          <Separator className="my-8" />

          <section className="prose prose-lg dark:prose-invert max-w-none mb-12">
            {resource.type === 'article' && resource.contentMarkdown && (
              <div dangerouslySetInnerHTML={{ __html: resource.contentMarkdown.replace(/\n/g, '<br />') }} />
            )}
            {resource.type === 'video' && resource.youtubeVideoId && (
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${resource.youtubeVideoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="rounded-lg shadow-md"
                ></iframe>
              </div>
            )}
            {resource.type === 'audio' && (
              <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertTitle>Audio Content</AlertTitle>
                <AlertDescription>
                  This is an audio resource. In-app playback for audio is not yet implemented. You can find the original source at: <a href={resource.contentUrl || '#'} target="_blank" rel="noopener noreferrer" className="underline">{resource.contentUrl || 'N/A'}</a>
                </AlertDescription>
              </Alert>
            )}
             {resource.type === 'tip' && resource.contentMarkdown && (
                <Card className="bg-accent/10 border-accent">
                    <CardHeader>
                        <CardTitle className="text-accent">Wellness Tip</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div dangerouslySetInnerHTML={{ __html: resource.contentMarkdown.replace(/\n/g, '<br />') }} />
                    </CardContent>
                </Card>
            )}
          </section>

          <Separator className="my-8" />

          <section id="reviews">
            <h2 className="text-2xl font-bold font-headline text-primary mb-6 flex items-center">
                <MessageSquare className="mr-3 h-6 w-6"/> Reviews ({reviews.length})
            </h2>
            
            {!isOffline && (
            <Card className="mb-8 p-6 shadow-lg">
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <h3 className="text-lg font-semibold">Leave a Review</h3>
                 <div>
                  <Label htmlFor="userName" className="mb-1 block">Your Name</Label>
                  <Input 
                    id="userName" 
                    value={newReview.userName} 
                    onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })} 
                    placeholder="Enter your name" 
                    required 
                  />
                </div>
                <div>
                  <Label className="mb-1 block">Your Rating</Label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-7 w-7 cursor-pointer ${currentRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground hover:text-yellow-300'}`}
                        onClick={() => handleRatingChange(star)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment" className="mb-1 block">Your Comment</Label>
                  <Textarea
                    id="comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your thoughts..."
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit">Submit Review</Button>
              </form>
            </Card>
            )}
            {isOffline && (
                 <Alert className="mb-6">
                    <MessageSquare className="h-4 w-4" />
                    <AlertTitle>Offline Mode</AlertTitle>
                    <AlertDescription>
                    Review submission is disabled while offline.
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.slice().reverse().map((review) => ( // Show newest first
                  <Card key={review.id} className="p-4 shadow-md">
                    <CardHeader className="p-0 mb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-md font-semibold">{review.userName}</CardTitle>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`h-4 w-4 ${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                          ))}
                        </div>
                      </div>
                      <CardDescription className="text-xs text-muted-foreground">
                        {new Date(review.timestamp).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-sm">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No reviews yet. Be the first to leave one!</p>
              )}
            </div>
             {reviews.length < 3 && Array(3 - reviews.length).fill(null).map((_, index) => (
                 <Card key={`placeholder-${index}`} className="p-4 shadow-md mt-6 border-dashed opacity-60">
                     <CardHeader className="p-0 mb-2">
                         <div className="flex justify-between items-center">
                             <div className="h-4 bg-muted rounded w-1/3"></div> {/* Placeholder for name */}
                             <div className="flex items-center">
                                 {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 text-muted/50"/>)}
                             </div>
                         </div>
                         <div className="h-3 bg-muted rounded w-1/4 mt-1"></div> {/* Placeholder for date */}
                     </CardHeader>
                     <CardContent className="p-0 space-y-1">
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-5/6"></div>
                     </CardContent>
                 </Card>
             ))}
          </section>
        </article>
      </div>
    </AppLayout>
  );
}
