// Remotion composition mapping and utilities

export const CATEGORY_TO_COMPOSITION: Record<string, string> = {
  'ai-tools': 'AITools',
  'claude-ai': 'ClaudeAI',
  'chatgpt': 'ChatGPT',
  'gohighlevel': 'GoHighLevel',
  'canva': 'Canva',
  'teaching': 'Teaching',
  'virtual-assistant': 'VirtualAssistant',
  'productivity': 'Productivity',
  'self-improvement': 'SelfImprovement',
  'youtube-growth': 'YouTubeGrowth',
};

export const CONTENT_CATEGORIES = [
  { id: 'ai-tools', label: 'AI Tools', emoji: '🤖', description: 'AI-focused content' },
  { id: 'claude-ai', label: 'Claude AI', emoji: '🧠', description: 'Claude AI tutorials' },
  { id: 'chatgpt', label: 'ChatGPT', emoji: '💬', description: 'ChatGPT guides' },
  { id: 'gohighlevel', label: 'GoHighLevel', emoji: '📈', description: 'Business automation' },
  { id: 'canva', label: 'Canva', emoji: '🎨', description: 'Design tutorials' },
  { id: 'teaching', label: 'Teaching', emoji: '📚', description: 'Educational content' },
  { id: 'virtual-assistant', label: 'Virtual Assistant', emoji: '🤝', description: 'VA services' },
  { id: 'productivity', label: 'Productivity', emoji: '⏱️', description: 'Productivity hacks' },
  { id: 'self-improvement', label: 'Self Improvement', emoji: '💪', description: 'Personal growth' },
  { id: 'youtube-growth', label: 'YouTube Growth', emoji: '📹', description: 'YouTube strategies' },
];

export interface ScriptSection {
  id: string;
  text: string;
  duration: number;
  startFrame?: number;
}

export interface VideoCompositionProps {
  title: string;
  hook: string;
  scriptSections?: ScriptSection[];
  musicUrl?: string;
  voiceoverUrls?: Record<string, string>;
  showCategoryIcon?: boolean;
  showBranding?: boolean;
}

export function getCompositionId(categoryId: string): string {
  return CATEGORY_TO_COMPOSITION[categoryId] || 'AITools';
}

export function getCategoryLabel(categoryId: string): string {
  const category = CONTENT_CATEGORIES.find((c) => c.id === categoryId);
  return category?.label || categoryId;
}

export function getCategoryEmoji(categoryId: string): string {
  const category = CONTENT_CATEGORIES.find((c) => c.id === categoryId);
  return category?.emoji || '🎬';
}

export function calculateScriptSectionFrames(
  sections: ScriptSection[],
  fps: number = 30
): ScriptSection[] {
  let currentFrame = 60; // Start after intro (60 frames = 2 seconds)

  return sections.map((section) => ({
    ...section,
    startFrame: currentFrame,
    duration: Math.ceil(section.duration),
  }));

  // Note: This calculation is simplified. In production, you'd want to:
  // 1. Generate TTS audio first to get exact duration
  // 2. Calculate frames based on actual audio timing
  // 3. Adjust section durations to match video duration
}

export function getDefaultVideoProps(
  title: string,
  hook: string,
  categoryId: string
): VideoCompositionProps {
  return {
    title,
    hook,
    scriptSections: [],
    musicUrl: '/music.mp3',
    voiceoverUrls: {},
    showCategoryIcon: true,
    showBranding: true,
  };
}

export const REMOTION_CONFIG = {
  fps: 30,
  durationInFrames: 1800, // 60 seconds at 30fps
  width: 1080,
  height: 1920,
  codec: 'h264',
  audioBitrate: '192k',
  audioCodec: 'aac',
};

export interface RemotionRenderJob {
  videoId: string;
  compositionId: string;
  scriptId: string;
  category: string;
  props: VideoCompositionProps;
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  error?: string;
}
