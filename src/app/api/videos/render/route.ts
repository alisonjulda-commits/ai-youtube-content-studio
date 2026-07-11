import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface ScriptSection {
  id: string;
  text: string;
  duration: number;
}

interface RenderRequest {
  scriptId: string;
  title: string;
  hook: string;
  category: string;
  compositionId: string;
  sections: ScriptSection[];
}

export async function POST(request: NextRequest) {
  try {
    const body: RenderRequest = await request.json();
    const { scriptId, title, hook, category, compositionId, sections } = body;
    const userId = 'default-user';

    // Calculate total duration from sections
    const totalDuration = sections.reduce((sum, section) => sum + section.duration, 0);
    const totalSeconds = Math.ceil(totalDuration / 30); // Convert frames to seconds at 30fps

    // Create video idea for tracking (if it doesn't exist from video ideas page)
    const existingVideo = await db.videoIdea.findFirst({
      where: { scriptId },
    });

    let videoId: string;

    if (existingVideo) {
      videoId = existingVideo.id;
      // Update workflow step to 'video'
      await db.videoIdea.update({
        where: { id: videoId },
        data: {
          workflowStep: 'video',
          description: `Generated from script: ${title}`,
        },
      });
    } else {
      // Create new video idea
      const newVideo = await db.videoIdea.create({
        data: {
          userId,
          title,
          category,
          description: `Generated from script: ${title}`,
          scriptId,
          workflowStep: 'video',
        },
      });
      videoId = newVideo.id;
    }

    // Return job status
    return NextResponse.json({
      videoId,
      scriptId,
      status: 'generating',
      progress: 0,
      voiceoverUrls: {},
      totalSeconds,
      compositionId,
      category,
      sections,
    });
  } catch (error) {
    console.error('Failed to initiate video render:', error);
    return NextResponse.json(
      { error: 'Failed to initiate video render' },
      { status: 500 }
    );
  }
}
