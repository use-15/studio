
"use client";

import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Mail, MapPin, Loader2 } from 'lucide-react';
import { useAuthContext } from '@/components/AppProviders';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  location: z.string().optional(),
  avatarUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  updatedAt: z.instanceof(Timestamp).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Initial default values if no profile exists in Firestore
const initialProfileValues = {
  name: 'Boss Willis', // This can be a generic placeholder or an empty string
  email: '', // Email should ideally be from auth provider or empty
  location: '',
  avatarUrl: 'https://placehold.co/128x128/E5F5E0/228B22.png?text=BW',
};

const USER_PROFILES_COLLECTION = 'userProfiles';

export default function ProfilePage() {
  const { toast } = useToast();
  const { userId, currentUser, loadingAuth } = useAuthContext();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialProfileValues, // Initial defaults
  });

  useEffect(() => {
    if (loadingAuth || !userId) {
      if (!loadingAuth && !userId) setIsLoadingProfile(false);
      return;
    }

    const fetchProfile = async () => {
      setIsLoadingProfile(true);
      const profileDocRef = doc(db, USER_PROFILES_COLLECTION, userId);
      try {
        const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileFormData;
          // Populate form with Firestore data
          form.reset({
            name: data.name || initialProfileValues.name,
            email: data.email || (currentUser?.email || initialProfileValues.email), // Prioritize Firebase Auth email if available
            location: data.location || initialProfileValues.location,
            avatarUrl: data.avatarUrl || initialProfileValues.avatarUrl,
          });
        } else {
          // No profile yet, use initial defaults, potentially pre-fill email from auth
          form.reset({
            ...initialProfileValues,
            email: currentUser?.email || initialProfileValues.email,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Could not load your profile. Please try again.",
          variant: "destructive",
        });
        // Fallback to initial defaults on error
        form.reset({
            ...initialProfileValues,
            email: currentUser?.email || initialProfileValues.email,
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [userId, currentUser, loadingAuth, form, toast]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (!userId) {
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
      return;
    }

    const profileDocRef = doc(db, USER_PROFILES_COLLECTION, userId);
    try {
      await setDoc(profileDocRef, { ...data, updatedAt: Timestamp.now() }, { merge: true });
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved to Firestore.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Could not save your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const watchedAvatarUrl = form.watch('avatarUrl');
  const displayedName = form.watch('name') || initialProfileValues.name;

  if (loadingAuth || isLoadingProfile) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="ml-4 text-lg text-muted-foreground">Loading profile...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="pb-6 border-b">
          <div className="flex items-center space-x-3">
            <UserCircle className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">My Profile</h1>
              <p className="text-lg text-muted-foreground mt-1">
                View and update your personal information.
              </p>
            </div>
          </div>
        </header>

        <Card className="max-w-2xl mx-auto shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4 ring-4 ring-primary/50">
                  <AvatarImage src={watchedAvatarUrl || initialProfileValues.avatarUrl} alt={displayedName} data-ai-hint="user avatar large" />
                  <AvatarFallback>
                    {displayedName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-sm">
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/avatar.png" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} 
                          // Optionally make email read-only if managed by Firebase Auth and not meant to be changed here
                          // readOnly={!!currentUser?.email} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" />Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" className="ml-auto" disabled={form.formState.isSubmitting || isLoadingProfile}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
    