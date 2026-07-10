import { z } from 'zod';

export const videoIdeaSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  status: z.enum(['idea', 'planning', 'scripting', 'recording', 'editing', 'published']).default('idea'),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

export type VideoIdeaInput = z.infer<typeof videoIdeaSchema>;

export const scriptSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  hook: z.string().optional(),
  intro: z.string().optional(),
  body: z.string().optional(),
  examples: z.string().optional(),
  cta: z.string().optional(),
  outro: z.string().optional(),
  tone: z.string().default('informative'),
  videoIdeaId: z.string().optional(),
});

export type ScriptInput = z.infer<typeof scriptSchema>;

export const seoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  keywords: z.string().min(1, 'Keywords are required'),
});

export type SEOInput = z.infer<typeof seoSchema>;

export const thumbnailSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  design: z.string().optional(),
  colors: z.string().optional(),
});

export type ThumbnailInput = z.infer<typeof thumbnailSchema>;

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  status: z.enum(['planning', 'in-progress', 'review', 'completed']).default('planning'),
  dueDate: z.date().optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;

export const promptSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
});

export type PromptInput = z.infer<typeof promptSchema>;

export const settingsSchema = z.object({
  channelName: z.string().optional(),
  channelDescription: z.string().optional(),
  anthropicApiKey: z.string().optional(),
  openaiApiKey: z.string().optional(),
  brandPrimaryColor: z.string().optional(),
  brandSecondaryColor: z.string().optional(),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
