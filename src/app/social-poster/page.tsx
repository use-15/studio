
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
import { 
  Facebook, 
  Instagram, 
  Image as ImageIcon, 
  VideoIcon, 
  UserCircle, 
  Loader2, 
  Send,
  Heart,
  MessageCircle,
  MessageSquare, // For Facebook comment
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  Share2,
  Globe
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type Platform = 'facebook' | 'instagram';

export default function SocialPosterPage() {
  const [platform, setPlatform] = useState<Platform>('instagram');
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
    const formElement = event.currentTarget; 

    if (!postText && !mediaFile) {
      toast({
        title: "Cannot create empty post",
        description: "Please add some text or media.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
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

    setPostText('');
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    
    if (formElement) {
      const fileInput = formElement.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
    setIsPosting(false);
  };
  
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
                    value={platform}
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
          <Card className={cn(
            "shadow-lg sticky top-24",
            platform === 'instagram' ? "bg-neutral-900 text-white border-neutral-700" : "bg-card text-card-foreground"
          )}>
            <CardHeader className={cn(
              "border-b",
              platform === 'instagram' ? "border-neutral-700" : "border-border"
            )}>
              <CardTitle className={cn(
                platform === 'instagram' ? "text-white" : "text-card-foreground"
              )}>
                Post Preview ({platform === 'instagram' ? 'Instagram' : 'Facebook'} Style)
              </CardTitle>
            </CardHeader>
            
            {platform === 'instagram' && (
              <CardContent className="p-0">
                <div className="w-full max-w-md mx-auto bg-black rounded-b-lg overflow-hidden">
                  <div className="flex items-center justify-between p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/40x40/ffffff/000000.png?text=AW" alt="User Avatar" data-ai-hint="user avatar" />
                        <AvatarFallback className="bg-neutral-700 text-white">AW</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-sm">Aramiyot Wellness</span>
                    </div>
                    <MoreHorizontal className="h-5 w-5 text-neutral-400" />
                  </div>

                  <div className="bg-black">
                    {mediaPreview && mediaType === 'image' && (
                      <Image src={mediaPreview} alt="Media preview" width={480} height={480} className="w-full h-auto object-contain max-h-[500px]" />
                    )}
                    {mediaPreview && mediaType === 'video' && (
                      <video src={mediaPreview} controls className="w-full h-auto max-h-[500px] bg-black" />
                    )}
                    {!mediaPreview && (
                      <div className="w-full aspect-square bg-neutral-800 flex items-center justify-center">
                         <ImageIcon className="h-16 w-16 text-neutral-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4">
                        <Heart className="h-6 w-6 hover:text-red-500 cursor-pointer" />
                        <MessageCircle className="h-6 w-6 hover:text-neutral-400 cursor-pointer" />
                        <Send className="h-6 w-6 hover:text-neutral-400 cursor-pointer" />
                      </div>
                      <Bookmark className="h-6 w-6 hover:text-neutral-400 cursor-pointer" />
                    </div>
                    <p className="font-semibold">1,234 likes</p>
                    {(postText || (!postText && !mediaPreview)) && (
                      <div className="whitespace-pre-wrap">
                        <span className="font-semibold">Aramiyot Wellness</span>{' '}
                        {postText || (!mediaPreview ? <span className="text-neutral-500 italic">Your post content will appear here...</span> : '')}
                      </div>
                    )}
                    <p className="text-xs text-neutral-500 cursor-pointer hover:underline">View all 42 comments</p>
                    <p className="text-xs text-neutral-500">1 DAY AGO</p>
                  </div>
                </div>
              </CardContent>
            )}

            {platform === 'facebook' && (
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://placehold.co/40x40/1877F2/FFFFFF.png?text=AW" alt="User Avatar" data-ai-hint="brand logo" />
                    <AvatarFallback className="bg-primary text-primary-foreground">AW</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">Aramiyot Wellness</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      Just now · <Globe className="h-3 w-3 ml-1" />
                    </p>
                  </div>
                </div>

                {postText && (
                  <p className="text-sm whitespace-pre-wrap">{postText}</p>
                )}
                 {!postText && !mediaPreview && (
                    <p className="text-sm text-muted-foreground italic">Your post content will appear here...</p>
                )}


                {mediaPreview && mediaType === 'image' && (
                  <Image src={mediaPreview} alt="Media preview" width={500} height={300} className="w-full h-auto object-contain rounded-md border max-h-[400px]" />
                )}
                {mediaPreview && mediaType === 'video' && (
                  <video src={mediaPreview} controls className="w-full h-auto rounded-md border max-h-[400px]" />
                )}
                {!mediaPreview && postText && ( /* Show image icon placeholder if text exists but no media */
                    <div className="w-full aspect-video bg-muted/50 rounded-md flex items-center justify-center border">
                       <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                    </div>
                  )}


                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>1.2K Likes</span>
                  <span>345 Comments · 123 Shares</span>
                </div>

                <div className="flex justify-around border-t border-b py-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                    <ThumbsUp className="mr-2 h-4 w-4" /> Like
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                    <MessageSquare className="mr-2 h-4 w-4" /> Comment
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </div>
              </CardContent>
            )}

            <CardFooter className={cn(
                "text-xs border-t pt-3",
                platform === 'instagram' ? "text-neutral-400 border-neutral-700" : "text-muted-foreground border-border"
              )}>
                This is a simulated preview. Actual appearance may vary on the platform.
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

// Minimal Avatar component for preview
const Avatar: React.FC<{className?: string, children: React.ReactNode}> = ({className, children}) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

const AvatarImage: React.FC<{src: string, alt: string, className?: string, 'data-ai-hint'?: string} & React.ImgHTMLAttributes<HTMLImageElement>> = ({src, alt, className, ...props}) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} className={`aspect-square h-full w-full ${className}`} {...props} />
);

const AvatarFallback: React.FC<{className?: string, children: React.ReactNode}> = ({className, children}) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}>
    {children}
  </div>
);

