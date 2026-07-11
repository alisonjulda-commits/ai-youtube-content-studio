export interface Theme {
  id: string;
  name: string;
  gradientStart: string;
  gradientEnd: string;
  accentColor: string;
  secondaryColor: string;
  icon: string;
  emoji: string;
}

export const CATEGORY_THEMES: Record<string, Theme> = {
  'ai-tools': {
    id: 'ai-tools',
    name: 'AI Tools',
    gradientStart: '#6366f1',
    gradientEnd: '#a855f7',
    accentColor: '#ec4899',
    secondaryColor: '#3b82f6',
    icon: '🤖',
    emoji: '⚡',
  },
  'claude-ai': {
    id: 'claude-ai',
    name: 'Claude AI',
    gradientStart: '#1f2937',
    gradientEnd: '#374151',
    accentColor: '#fbbf24',
    secondaryColor: '#f59e0b',
    icon: '🧠',
    emoji: '💡',
  },
  'chatgpt': {
    id: 'chatgpt',
    name: 'ChatGPT',
    gradientStart: '#10b981',
    gradientEnd: '#059669',
    accentColor: '#ffffff',
    secondaryColor: '#d1fae5',
    icon: '💬',
    emoji: '✨',
  },
  'gohighlevel': {
    id: 'gohighlevel',
    name: 'GoHighLevel',
    gradientStart: '#dc2626',
    gradientEnd: '#991b1b',
    accentColor: '#fbbf24',
    secondaryColor: '#fef3c7',
    icon: '📈',
    emoji: '🚀',
  },
  'canva': {
    id: 'canva',
    name: 'Canva',
    gradientStart: '#2563eb',
    gradientEnd: '#1e40af',
    accentColor: '#f97316',
    secondaryColor: '#fbbf24',
    icon: '🎨',
    emoji: '🎭',
  },
  'teaching': {
    id: 'teaching',
    name: 'Teaching',
    gradientStart: '#8b5cf6',
    gradientEnd: '#6366f1',
    accentColor: '#fbbf24',
    secondaryColor: '#60a5fa',
    icon: '📚',
    emoji: '🎓',
  },
  'virtual-assistant': {
    id: 'virtual-assistant',
    name: 'Virtual Assistant',
    gradientStart: '#06b6d4',
    gradientEnd: '#0891b2',
    accentColor: '#f59e0b',
    secondaryColor: '#fbbf24',
    icon: '🤝',
    emoji: '💼',
  },
  'productivity': {
    id: 'productivity',
    name: 'Productivity',
    gradientStart: '#10b981',
    gradientEnd: '#059669',
    accentColor: '#06b6d4',
    secondaryColor: '#3b82f6',
    icon: '⏱️',
    emoji: '✅',
  },
  'self-improvement': {
    id: 'self-improvement',
    name: 'Self Improvement',
    gradientStart: '#f97316',
    gradientEnd: '#dc2626',
    accentColor: '#fbbf24',
    secondaryColor: '#fed7aa',
    icon: '💪',
    emoji: '🌟',
  },
  'youtube-growth': {
    id: 'youtube-growth',
    name: 'YouTube Growth',
    gradientStart: '#dc2626',
    gradientEnd: '#7c2d12',
    accentColor: '#fbbf24',
    secondaryColor: '#ffffff',
    icon: '📹',
    emoji: '🎬',
  },
};

export const getTheme = (categoryId: string): Theme => {
  return CATEGORY_THEMES[categoryId] || CATEGORY_THEMES['ai-tools'];
};
