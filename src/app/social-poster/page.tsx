
"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Instagram, Image as ImageIcon, VideoIcon, ThumbsUp, MessageSquare, Share2 as ShareIcon, UserCircle, Loader2, Send } from 'lucide-react';
import Image from 'next/image';

type Platform = 'facebook' | 'instagram';

export default function SocialPosterPage() {
  const [platform, setPlatform] = useState<Platform>('facebook');
  const [postText, setPostText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();

  const handleMediaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaType(file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setMediaFile(null);
      setMediaPreview(null);
      setMediaType(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget; // Store currentTarget before any await

    if (!postText && !mediaFile) {
      toast({
        title: "Cannot create empty post",
        description: "Please add some text or media.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log({
      platform,
      postText,
      mediaFileName: mediaFile?.name,
      mediaFileType: mediaFile?.type,
    });

    toast({
      title: "Post Created (Simulated)",
      description: `Your post for ${platform} has been created.`,
    });

    // Reset form
    setPostText('');
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    
    // Use the stored formElement to find the input
    const fileInput = formElement.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    setIsPosting(false);
  };
  
  const PlatformIcon = platform === 'facebook' ? Facebook : Instagram;

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="pb-6 border-b">
          <div className="flex items-center space-x-3">
            <Send className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold font-headline text-primary">Social Media Poster</h1>
              <p className="text-lg text-muted-foreground mt-1">
                Craft and share your content on Facebook or Instagram.
              </p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Creation Form Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
              <CardDescription>Select your platform, write your content, and add media.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="platform" className="text-base font-medium">Platform</Label>
                  <RadioGroup
                    defaultValue="facebook"
                    onValueChange={(value: Platform) => setPlatform(value)}
                    className="flex space-x-4 mt-2"
                    id="platform"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="facebook" id="facebook" />
                      <Label htmlFor="facebook" className="flex items-center gap-2 cursor-pointer">
                        <Facebook className="h-5 w-5 text-[#1877F2]" /> Facebook
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="instagram" id="instagram" />
                      <Label htmlFor="instagram" className="flex items-center gap-2 cursor-pointer">
                        <Instagram className="h-5 w-5 text-[#E4405F]" /> Instagram
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="postText" className="text-base font-medium">Post Content</Label>
                  <Textarea
                    id="postText"
                    placeholder={`What's on your mind, for ${platform}?`}
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="mt-1 min-h-[120px] text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="mediaFile" className="text-base font-medium">Upload Image/Video</Label>
                  <Input
                    id="mediaFile"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    className="mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {mediaFile && <p className="text-xs text-muted-foreground mt-1">Selected: {mediaFile.name}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isPosting}>
                  {isPosting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    `Post to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="shadow-lg sticky top-24">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <PlatformIcon className={`h-6 w-6 ${platform === 'facebook' ? 'text-[#1877F2]' : 'text-[#E4405F]'}`} />
                Post Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-background p-4 rounded-lg border space-y-3">
                {/* User Info */}
                <div className="flex items-center space-x-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>AW</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">Aramiyot Wellness</p>
                    <p className="text-xs text-muted-foreground">Just now · Public</p>
                  </div>
                </div>

                {/* Post Text */}
                {postText && (
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {postText || "Your post content will appear here..."}
                  </p>
                )}
                {!postText && !mediaPreview && (
                   <p className="text-sm text-muted-foreground italic">
                    Your post content will appear here...
                  </p>
                )}


                {/* Media Preview */}
                {mediaPreview && mediaType === 'image' && (
                  <div className="mt-2 rounded-md overflow-hidden border">
                    <Image src={mediaPreview} alt="Media preview" width={600} height={400} className="w-full object-cover aspect-video" />
                  </div>
                )}
                {mediaPreview && mediaType === 'video' && (
                  <div className="mt-2 rounded-md overflow-hidden border">
                    <video src={mediaPreview} controls className="w-full aspect-video bg-muted" />
                  </div>
                )}
                {!mediaPreview && (
                  <div className="mt-2 rounded-md overflow-hidden border bg-muted flex items-center justify-center aspect-video">
                     <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                
                {/* Action Bar Placeholder */}
                <div className="flex justify-around items-center pt-3 mt-3 border-t text-muted-foreground">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs">
                    <ThumbsUp className="h-4 w-4" /> Like
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs">
                    <MessageSquare className="h-4 w-4" /> Comment
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs">
                    <ShareIcon className="h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground">
                This is a simulated preview. Actual appearance may vary on the platform.
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

// Minimal Avatar component for preview to avoid circular dependencies if needed
// For this app structure, direct import from ui/avatar is fine.
const Avatar: React.FC<{className?: string, children: React.ReactNode}> = ({className, children}) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

const AvatarImage: React.FC<{src: string, alt: string, className?: string} & React.ImgHTMLAttributes<HTMLImageElement>> = ({src, alt, className, ...props}) => (
  <img src={src} alt={alt} className={`aspect-square h-full w-full ${className}`} {...props} />
);

const AvatarFallback: React.FC<{className?: string, children: React.ReactNode}> = ({className, children}) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>
    {children}
  </div>
);

