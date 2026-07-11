// Text-to-Speech service for generating voiceovers

export interface TTSOptions {
  provider: 'openai' | 'elevenlabs' | 'mock';
  voiceId?: string;
  speed?: number;
  pitch?: number;
}

export interface AudioSegment {
  id: string;
  text: string;
  duration: number; // in seconds
  url?: string;
  error?: string;
}

const DEFAULT_OPTIONS: TTSOptions = {
  provider: 'openai',
  voiceId: 'nova',
  speed: 1.0,
  pitch: 1.0,
};

export async function generateTTSAudio(
  text: string,
  options: Partial<TTSOptions> = {}
): Promise<AudioSegment> {
  const config = { ...DEFAULT_OPTIONS, ...options };

  try {
    if (config.provider === 'openai') {
      return await generateOpenAITTS(text, config);
    } else if (config.provider === 'elevenlabs') {
      return await generateElevenLabsTTS(text, config);
    } else if (config.provider === 'mock') {
      return generateMockTTS(text);
    }

    throw new Error(`Unknown TTS provider: ${config.provider}`);
  } catch (error) {
    console.error('TTS generation failed:', error);
    throw error;
  }
}

async function generateOpenAITTS(
  text: string,
  config: TTSOptions
): Promise<AudioSegment> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn('OPENAI_API_KEY not configured, using mock TTS');
    return generateMockTTS(text);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        input: text,
        voice: config.voiceId || 'nova',
        speed: config.speed || 1.0,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI TTS failed: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);

    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = (wordCount / 150) * 60;

    return {
      id: `tts-${Date.now()}`,
      text,
      duration: estimatedDuration,
      url,
    };
  } catch (error) {
    console.error('OpenAI TTS error:', error);
    throw error;
  }
}

async function generateElevenLabsTTS(
  text: string,
  config: TTSOptions
): Promise<AudioSegment> {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    console.warn('ELEVENLABS_API_KEY not configured, using mock TTS');
    return generateMockTTS(text);
  }

  try {
    const voiceId = config.voiceId || 'EXAVITQu4aSCm7NB5ESt';
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs TTS failed: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);

    const wordCount = text.split(/\s+/).length;
    const estimatedDuration = (wordCount / 150) * 60;

    return {
      id: `tts-${Date.now()}`,
      text,
      duration: estimatedDuration,
      url,
    };
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    throw error;
  }
}

function generateMockTTS(text: string): AudioSegment {
  const wordCount = text.split(/\s+/).length;
  const estimatedDuration = (wordCount / 150) * 60;

  return {
    id: `tts-${Date.now()}`,
    text,
    duration: estimatedDuration,
    url: `data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==`,
  };
}

export function estimateAudioDuration(text: string): number {
  const wordCount = text.split(/\s+/).length;
  return (wordCount / 150) * 60;
}

export function calculateScriptDuration(
  sections: Array<{ text: string }>
): number {
  return sections.reduce((total, section) => {
    return total + estimateAudioDuration(section.text);
  }, 0);
}

export async function generateBatchTTS(
  texts: string[],
  options: Partial<TTSOptions> = {}
): Promise<AudioSegment[]> {
  return Promise.all(texts.map((text) => generateTTSAudio(text, options)));
}

export const VOICE_PRESETS: Record<string, TTSOptions> = {
  'professional': {
    provider: 'openai',
    voiceId: 'fable',
    speed: 1.0,
  },
  'friendly': {
    provider: 'openai',
    voiceId: 'shimmer',
    speed: 1.0,
  },
  'energetic': {
    provider: 'openai',
    voiceId: 'alloy',
    speed: 1.1,
  },
  'calm': {
    provider: 'openai',
    voiceId: 'echo',
    speed: 0.9,
  },
  'authoritative': {
    provider: 'openai',
    voiceId: 'onyx',
    speed: 0.95,
  },
};

export function getVoicePreset(contentType: string): TTSOptions {
  const preset = VOICE_PRESETS[contentType];
  return preset || DEFAULT_OPTIONS;
}
