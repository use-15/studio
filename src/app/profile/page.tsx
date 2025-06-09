
"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Mail, MapPin } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  location: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Placeholder user data, consistent with other parts of the app
const currentUser = {
  name: 'Boss Willis',
  email: 'boss.willis@example.com',
  location: 'California, USA',
  avatarUrl: 'https://placehold.co/128x128/E5F5E0/228B22.png?text=BW',
};

export default function ProfilePage() {
  const { toast } = useToast();
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
      location: currentUser.location,
      avatarUrl: currentUser.avatarUrl,
    },
  });

  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    console.log('Profile data submitted:', data);
    // In a real app, you would send this data to your backend
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved (simulated).",
    });
  };

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
                  <AvatarImage src={form.watch('avatarUrl') || currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="user avatar large" />
                  <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
                        <Input type="email" placeholder="your@email.com" {...field} />
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
                <Button type="submit" className="ml-auto" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
