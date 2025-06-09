export interface WellnessResource {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string; // e.g., 'Mindfulness', 'Nutrition', 'Fitness', 'Article'
  type: 'article' | 'video' | 'audio' | 'link' | 'tip';
  contentUrl?: string; // Link to the full resource
  duration?: string; // e.g., "10 min read", "15 min video"
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
