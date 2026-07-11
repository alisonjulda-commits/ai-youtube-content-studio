// Background music management and audio synchronization

export interface MusicTrack {
  id: string;
  name: string;
  category: string;
  genre: string;
  duration: number; // in seconds
  url: string;
  volume?: number; // 0-1
  bpm?: number;
  description: string;
}

// Curated music library for different content types
export const MUSIC_LIBRARY: Record<string, MusicTrack[]> = {
  'ai-tools': [
    {
      id: 'tech-upbeat-1',
      name: 'Tech Innovation',
      category: 'ai-tools',
      genre: 'Electronic',
      duration: 180,
      url: '/music/tech-upbeat-1.mp3',
      volume: 0.5,
      bpm: 120,
      description: 'Energetic electronic track perfect for tech tutorials',
    },
    {
      id: 'tech-minimal-1',
      name: 'Minimal Tech',
      category: 'ai-tools',
      genre: 'Ambient Electronic',
      duration: 180,
      url: '/music/tech-minimal-1.mp3',
      volume: 0.4,
      bpm: 90,
      description: 'Subtle, focused electronic background',
    },
  ],
  'claude-ai': [
    {
      id: 'ai-professional-1',
      name: 'AI Professional',
      category: 'claude-ai',
      genre: 'Corporate Electronic',
      duration: 180,
      url: '/music/ai-professional-1.mp3',
      volume: 0.45,
      bpm: 110,
      description: 'Professional AI/tech background music',
    },
    {
      id: 'ai-minimal-2',
      name: 'AI Minimal',
      category: 'claude-ai',
      genre: 'Ambient',
      duration: 180,
      url: '/music/ai-minimal-2.mp3',
      volume: 0.35,
      bpm: 80,
      description: 'Clean, minimal background for tutorials',
    },
  ],
  'chatgpt': [
    {
      id: 'modern-tech-1',
      name: 'Modern Tech',
      category: 'chatgpt',
      genre: 'Electronic',
      duration: 180,
      url: '/music/modern-tech-1.mp3',
      volume: 0.5,
      bpm: 115,
      description: 'Contemporary tech/AI music',
    },
    {
      id: 'ambient-tech-1',
      name: 'Ambient Tech',
      category: 'chatgpt',
      genre: 'Ambient Electronic',
      duration: 180,
      url: '/music/ambient-tech-1.mp3',
      volume: 0.4,
      bpm: 85,
      description: 'Atmospheric electronic background',
    },
  ],
  'gohighlevel': [
    {
      id: 'business-upbeat-1',
      name: 'Business Upbeat',
      category: 'gohighlevel',
      genre: 'Corporate',
      duration: 180,
      url: '/music/business-upbeat-1.mp3',
      volume: 0.5,
      bpm: 125,
      description: 'Energetic business/marketing track',
    },
    {
      id: 'business-professional-1',
      name: 'Business Professional',
      category: 'gohighlevel',
      genre: 'Corporate',
      duration: 180,
      url: '/music/business-professional-1.mp3',
      volume: 0.45,
      bpm: 100,
      description: 'Professional business background',
    },
  ],
  'canva': [
    {
      id: 'creative-upbeat-1',
      name: 'Creative Upbeat',
      category: 'canva',
      genre: 'Indie Pop',
      duration: 180,
      url: '/music/creative-upbeat-1.mp3',
      volume: 0.5,
      bpm: 130,
      description: 'Upbeat creative/design track',
    },
    {
      id: 'design-ambient-1',
      name: 'Design Ambient',
      category: 'canva',
      genre: 'Ambient',
      duration: 180,
      url: '/music/design-ambient-1.mp3',
      volume: 0.4,
      bpm: 90,
      description: 'Creative ambient background',
    },
  ],
  'teaching': [
    {
      id: 'educational-calm-1',
      name: 'Educational Calm',
      category: 'teaching',
      genre: 'Acoustic',
      duration: 180,
      url: '/music/educational-calm-1.mp3',
      volume: 0.45,
      bpm: 95,
      description: 'Calm, focused educational track',
    },
    {
      id: 'learning-minimal-1',
      name: 'Learning Minimal',
      category: 'teaching',
      genre: 'Ambient',
      duration: 180,
      url: '/music/learning-minimal-1.mp3',
      volume: 0.35,
      bpm: 80,
      description: 'Minimal background for learning',
    },
  ],
  'virtual-assistant': [
    {
      id: 'service-professional-1',
      name: 'Service Professional',
      category: 'virtual-assistant',
      genre: 'Corporate',
      duration: 180,
      url: '/music/service-professional-1.mp3',
      volume: 0.45,
      bpm: 105,
      description: 'Professional service industry track',
    },
    {
      id: 'assistant-calm-1',
      name: 'Assistant Calm',
      category: 'virtual-assistant',
      genre: 'Ambient',
      duration: 180,
      url: '/music/assistant-calm-1.mp3',
      volume: 0.4,
      bpm: 85,
      description: 'Calm, professional background',
    },
  ],
  'productivity': [
    {
      id: 'focus-upbeat-1',
      name: 'Focus Upbeat',
      category: 'productivity',
      genre: 'Electronic',
      duration: 180,
      url: '/music/focus-upbeat-1.mp3',
      volume: 0.5,
      bpm: 120,
      description: 'Energetic focus/productivity track',
    },
    {
      id: 'productivity-flow-1',
      name: 'Productivity Flow',
      category: 'productivity',
      genre: 'Ambient Electronic',
      duration: 180,
      url: '/music/productivity-flow-1.mp3',
      volume: 0.4,
      bpm: 100,
      description: 'Flow-state productivity music',
    },
  ],
  'self-improvement': [
    {
      id: 'motivation-upbeat-1',
      name: 'Motivation Upbeat',
      category: 'self-improvement',
      genre: 'Inspirational',
      duration: 180,
      url: '/music/motivation-upbeat-1.mp3',
      volume: 0.5,
      bpm: 130,
      description: 'Uplifting, motivational track',
    },
    {
      id: 'growth-ambient-1',
      name: 'Growth Ambient',
      category: 'self-improvement',
      genre: 'Ambient',
      duration: 180,
      url: '/music/growth-ambient-1.mp3',
      volume: 0.4,
      bpm: 90,
      description: 'Growth-oriented ambient music',
    },
  ],
  'youtube-growth': [
    {
      id: 'creator-energetic-1',
      name: 'Creator Energetic',
      category: 'youtube-growth',
      genre: 'Electronic',
      duration: 180,
      url: '/music/creator-energetic-1.mp3',
      volume: 0.5,
      bpm: 125,
      description: 'Energetic creator/YouTube track',
    },
    {
      id: 'channel-growth-1',
      name: 'Channel Growth',
      category: 'youtube-growth',
      genre: 'Pop Electronic',
      duration: 180,
      url: '/music/channel-growth-1.mp3',
      volume: 0.45,
      bpm: 115,
      description: 'Growth-focused YouTube music',
    },
  ],
};

export function getMusicForCategory(categoryId: string): MusicTrack[] {
  return MUSIC_LIBRARY[categoryId] || MUSIC_LIBRARY['ai-tools'];
}

export function getMusicTrack(categoryId: string, trackId?: string): MusicTrack {
  const tracks = getMusicForCategory(categoryId);
  if (trackId) {
    const track = tracks.find((t) => t.id === trackId);
    if (track) return track;
  }
  return tracks[0]; // Return first track as default
}

// Audio mixing utilities
export interface AudioMixConfig {
  voiceoverVolume: number; // 0-1, default 0.8
  musicVolume: number; // 0-1, default 0.4
  fadeInDuration: number; // in frames at 30fps
  fadeOutDuration: number; // in frames at 30fps
  musicStartDelay: number; // in frames
}

export const DEFAULT_MIX_CONFIG: AudioMixConfig = {
  voiceoverVolume: 0.8,
  musicVolume: 0.4,
  fadeInDuration: 30, // 1 second at 30fps
  fadeOutDuration: 60, // 2 seconds at 30fps
  musicStartDelay: 30, // Start music 1 second in
};

export function calculateAudioMix(
  voiceoverDuration: number,
  musicDuration: number,
  config: Partial<AudioMixConfig> = {}
): AudioMixConfig {
  return {
    ...DEFAULT_MIX_CONFIG,
    ...config,
  };
}

// Sync voiceover with music based on total duration
export interface AudioSync {
  voiceoverVolume: number;
  musicVolume: number;
  musicUrl: string;
  musicStartFrame: number;
  musicEndFrame: number;
  totalDurationFrames: number;
}

export function syncAudioTracks(
  musicTrack: MusicTrack,
  totalDurationSeconds: number,
  config: Partial<AudioMixConfig> = {}
): AudioSync {
  const finalConfig = calculateAudioMix(totalDurationSeconds, musicTrack.duration, config);
  const fps = 30;
  const totalFrames = Math.ceil(totalDurationSeconds * fps);

  return {
    voiceoverVolume: finalConfig.voiceoverVolume,
    musicVolume: finalConfig.musicVolume,
    musicUrl: musicTrack.url,
    musicStartFrame: finalConfig.musicStartDelay,
    musicEndFrame: totalFrames,
    totalDurationFrames: totalFrames,
  };
}

// Audio loudness normalization (for balancing levels)
export function calculateAudioLevels(
  voiceoverDuration: number,
  musicDuration: number
): { voiceoverDb: number; musicDb: number } {
  // Standard audio levels in dB
  // Voiceover: -20dB to -16dB (main content)
  // Music: -24dB to -20dB (background)
  return {
    voiceoverDb: -18,
    musicDb: -22,
  };
}

// Get music recommendations based on script tone
export function recommendMusicByTone(tone: string, categoryId: string): MusicTrack {
  const categoryTracks = getMusicForCategory(categoryId);

  switch (tone?.toLowerCase()) {
    case 'professional':
    case 'formal':
    case 'educational':
      // Return calmer, more minimal track
      return categoryTracks.find((t) => t.genre.includes('Ambient')) || categoryTracks[0];
    case 'energetic':
    case 'motivational':
    case 'enthusiastic':
      // Return upbeat track
      return categoryTracks.find((t) => t.name.includes('Upbeat') || t.bpm! > 120) || categoryTracks[0];
    case 'casual':
    case 'friendly':
    case 'conversational':
      // Return balanced track
      return categoryTracks[Math.floor(categoryTracks.length / 2)];
    default:
      return categoryTracks[0];
  }
}

// Music presets for quick selection
export const MUSIC_PRESETS = {
  'focus': {
    voiceoverVolume: 0.85,
    musicVolume: 0.3,
    fadeInDuration: 40,
    fadeOutDuration: 80,
    musicStartDelay: 20,
  },
  'energetic': {
    voiceoverVolume: 0.8,
    musicVolume: 0.5,
    fadeInDuration: 20,
    fadeOutDuration: 40,
    musicStartDelay: 10,
  },
  'calm': {
    voiceoverVolume: 0.85,
    musicVolume: 0.3,
    fadeInDuration: 60,
    fadeOutDuration: 120,
    musicStartDelay: 40,
  },
  'balanced': DEFAULT_MIX_CONFIG,
} as Record<string, AudioMixConfig>;

export function getMusicPreset(presetName: string): AudioMixConfig {
  return MUSIC_PRESETS[presetName] || DEFAULT_MIX_CONFIG;
}
