import { NextRequest, NextResponse } from 'next/server';
import { generateTTSAudio, generateBatchTTS, getVoicePreset } from '@/lib/tts';

interface TTSRequest {
  texts: string[];
  voicePreset?: string;
  provider?: 'openai' | 'elevenlabs' | 'mock';
  scriptId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TTSRequest = await request.json();
    const { texts, voicePreset, provider } = body;

    if (!texts || texts.length === 0) {
      return NextResponse.json(
        { error: 'No texts provided' },
        { status: 400 }
      );
    }

    const voiceOptions: any = voicePreset ? getVoicePreset(voicePreset) : {};
    if (provider) {
      voiceOptions.provider = provider;
    }

    const audioSegments = await generateBatchTTS(texts, voiceOptions);
    const totalDuration = audioSegments.reduce((sum, seg) => sum + seg.duration, 0);

    return NextResponse.json({
      status: 'success',
      audioSegments,
      totalDuration,
      count: audioSegments.length,
    });
  } catch (error) {
    console.error('Failed to generate audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
