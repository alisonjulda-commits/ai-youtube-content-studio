export const CATEGORIES = [
  'Tutorial',
  'Vlog',
  'Educational',
  'Entertainment',
  'Gaming',
  'Music',
  'Art & Design',
  'Technology',
  'Business',
  'Finance',
  'Health & Fitness',
  'Cooking',
  'Travel',
  'Fashion',
  'Beauty',
  'DIY & Craft',
  'Motivation',
  'Comedy',
  'News & Current Events',
];

export const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'high', label: 'High', color: 'bg-red-500' },
];

export const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', color: 'bg-green-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'hard', label: 'Hard', color: 'bg-red-500' },
];

export const STATUSES = [
  { value: 'idea', label: 'Idea', color: 'bg-gray-500' },
  { value: 'planning', label: 'Planning', color: 'bg-blue-500' },
  { value: 'scripting', label: 'Scripting', color: 'bg-purple-500' },
  { value: 'recording', label: 'Recording', color: 'bg-orange-500' },
  { value: 'editing', label: 'Editing', color: 'bg-pink-500' },
  { value: 'published', label: 'Published', color: 'bg-green-500' },
];

export const PROMPT_CATEGORIES = [
  'Script Writing',
  'SEO Optimization',
  'Thumbnail Design',
  'Social Media',
  'Audience Engagement',
  'Content Ideas',
  'Video Hooks',
  'Call to Action',
  'Storytelling',
  'Research',
];

export const DEFAULT_PROMPTS = [
  {
    title: 'Engaging Hook Generator',
    category: 'Video Hooks',
    content: `Create an engaging hook for a YouTube video about {topic}. The hook should be attention-grabbing, clear, and make viewers want to watch more. Keep it to 1-2 sentences maximum.`,
  },
  {
    title: 'SEO Title Generator',
    category: 'SEO Optimization',
    content: `Generate 5 SEO-optimized YouTube titles for a video about {topic}. Each title should be between 50-60 characters, include the main keyword, and be compelling enough to encourage clicks.`,
  },
  {
    title: 'Script Outline',
    category: 'Script Writing',
    content: `Create a detailed outline for a {duration}-minute script about {topic}. Include: Hook, Introduction, Main Points (3-5), Examples/Stories, Call to Action, and Conclusion.`,
  },
];

export const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl/Cmd + S', action: 'Save' },
  { key: 'Ctrl/Cmd + K', action: 'Search' },
  { key: 'Ctrl/Cmd + /', action: 'Command Palette' },
  { key: 'Escape', action: 'Close Modal' },
];
