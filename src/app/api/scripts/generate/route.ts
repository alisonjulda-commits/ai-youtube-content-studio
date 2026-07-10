import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateScript } from '@/lib/anthropic';
import { calculateReadingTime, calculateSpeakingTime, wordCount } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { topic, targetAudience, duration, tone, title } = await request.json();

    const scriptContent = await generateScript(topic, targetAudience, duration, tone);

    const wc = wordCount(scriptContent);
    const rt = calculateReadingTime(scriptContent);
    const st = calculateSpeakingTime(scriptContent);

    const script = await db.script.create({
      data: {
        userId,
        title: title || `${topic} Script`,
        body: scriptContent,
        tone,
        wordCount: wc,
        readingTime: rt,
        speakingTime: st,
      },
    });

    return NextResponse.json(script, { status: 201 });
  } catch (error) {
    console.error('Failed to generate script:', error);
    return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 });
  }
}
