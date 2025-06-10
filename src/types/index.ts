
export interface WellnessResource {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string; // e.g., 'Mindfulness', 'Nutrition', 'Fitness', 'Article'
  type: 'article' | 'video' | 'audio' | 'link' | 'tip' | 'external-library';
  contentUrl?: string; // Link to the full resource OR original source for videos
  duration?: string; // e.g., "10 min read", "15 min video"
  'data-ai-hint'?: string;
  contentMarkdown?: string; // For full article content
  youtubeVideoId?: string; // For YouTube videos
}

export interface Board {
  id: string;
  name: string;
  resources: WellnessResource[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
  'data-ai-hint'?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  services: Service[];
  doctors: Doctor[];
  'data-ai-hint'?: string;
  phone?: string;
  website?: string;
}

export interface Review {
  id: string;
  resourceId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  timestamp: string; // ISO date string
}
