import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateVoiceover, getVoiceoverDuration } from '@/lib/tts';
import path from 'path';
import fs from 'fs/promises';

interface GenerateVideoRequest {
  scriptId: string;
  title: string;
  sections: Array<{ id: string; text: string }>;
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const body: GenerateVideoRequest = await request.json();

    // Validate script exists
    const script = await db.script.findUnique({
      where: { id: body.scriptId },
    });

    if (!script || script.userId !== userId) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      );
    }

    // Create output directory for voiceovers
    const voiceoverDir = path.join(process.cwd(), 'public', 'voiceover', body.scriptId);
    await fs.mkdir(voiceoverDir, { recursive: true });

    // Generate voiceovers for each section
    const voiceoverUrls: Record<string, string> = {};
    const frameTiming: Record<string, { from: number; durationInFrames: number }> = {};
    let currentFrame = 0;
    const FPS = 30;

    for (const section of body.sections) {
      const outputPath = path.join(voiceoverDir, `${section.id}.mp3`);

      // Generate voiceover
      const result = await generateVoiceover(section.text, outputPath);
      voiceoverUrls[section.id] = `/voiceover/${body.scriptId}/${section.id}.mp3`;

      // Calculate frame timing
      const durationFrames = Math.round(result.duration * FPS);
      frameTiming[section.id] = {
        from: currentFrame,
        durationInFrames: durationFrames,
      };
      currentFrame += durationFrames + 8; // 8 frame spacing between sections
    }

    // Store video generation metadata
    const video = await db.videoIdea.create({
      data: {
        userId,
        title: body.title,
        description: `Generated from script: ${script.title}`,
        category: 'Generated',
        status: 'recording',
      },
    });

    // Return video generation info
    return NextResponse.json(
      {
        videoId: video.id,
        scriptId: body.scriptId,
        voiceoverUrls,
        frameTiming,
        totalFrames: currentFrame,
        totalSeconds: currentFrame / FPS,
        composition: {
          id: 'BiblicalSelfCare',
          width: 1080,
          height: 1920,
          fps: 30,
          durationInFrames: currentFrame,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to generate video:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}
