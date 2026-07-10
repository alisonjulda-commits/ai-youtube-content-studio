export interface VideoIdea {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'idea' | 'planning' | 'scripting' | 'recording' | 'editing' | 'published';
  tags?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Script {
  id: string;
  userId: string;
  videoIdeaId?: string;
  title: string;
  hook?: string;
  intro?: string;
  body?: string;
  examples?: string;
  cta?: string;
  outro?: string;
  tone: string;
  wordCount: number;
  readingTime: number;
  speakingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SEOData {
  id: string;
  scriptId: string;
  title: string;
  description: string;
  keywords: string;
  hashtags: string;
  ctrScore: number;
  seoScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  dueDate?: Date;
  checklistItems?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Prompt {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  isFavorite: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Settings {
  id: string;
  userId: string;
  channelName?: string;
  channelDescription?: string;
  anthropicApiKey?: string;
  openaiApiKey?: string;
  brandPrimaryColor: string;
  brandSecondaryColor: string;
  theme: 'light' | 'dark' | 'system';
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  id: string;
  userId: string;
  videoTitle: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  watchTime: number;
  ctr: number;
  engagementRate: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
