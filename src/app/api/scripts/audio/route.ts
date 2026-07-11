import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateBatchTTS, getVoicePreset, estimateAudioDuration } from '@/lib/tts';

interface ScriptAudioRequest {
  scriptId: string;
  voicePreset?: string;
  provider?: 'openai' | 'elevenlabs' | 'mock';
}

export async function POST(request: NextRequest) {
  try {
    const body: ScriptAudioRequest = await request.json();
    const { scriptId, voicePreset, provider } = body;

    if (!scriptId) {
      return NextResponse.json(
        { error: 'scriptId is required' },
        { status: 400 }
      );
    }

    // Fetch script from database
    const script = await db.script.findUnique({
      where: { id: scriptId },
    });

    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      );
    }

    // Extract script sections
    const sections = [
      { id: 'hook', text: script.hook || '' },
      { id: 'intro', text: script.intro || '' },
      { id: 'body', text: script.body || '' },
      { id: 'examples', text: script.examples || '' },
      { id: 'cta', text: script.cta || '' },
      { id: 'outro', text: script.outro || '' },
    ].filter((s) => s.text.trim());

    if (sections.length === 0) {
      return NextResponse.json(
        { error: 'No script sections found' },
        { status: 400 }
      );
    }

    // Get voice options
    const voiceOptions: any = voicePreset ? getVoicePreset(voicePreset) : {};
    if (provider) {
      voiceOptions.provider = provider;
    }

    // Generate TTS for each section
    const texts = sections.map((s) => s.text);
    const audioSegments = await generateBatchTTS(texts, voiceOptions);

    // Map audio segments back to sections
    const voiceoverUrls: Record<string, string> = {};
    sections.forEach((section, index) => {
      if (audioSegments[index]?.url) {
        voiceoverUrls[section.id] = audioSegments[index].url;
      }
    });

    // Calculate total duration
    const totalDuration = Object.values(voiceoverUrls).length > 0
      ? sections.reduce((sum, section) => sum + estimateAudioDuration(section.text), 0)
      : 0;

    return NextResponse.json({
      status: 'success',
      scriptId,
      sections: sections.map((s, i) => ({
        ...s,
        duration: audioSegments[i]?.duration || 0,
      })),
      voiceoverUrls,
      totalDuration,
    });
  } catch (error) {
    console.error('Failed to generate script audio:', error);
    return NextResponse.json(
      { error: 'Failed to generate script audio' },
      { status: 500 }
    );
  }
}
