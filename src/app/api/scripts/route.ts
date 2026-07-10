import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scriptSchema } from '@/lib/validations';
import { calculateReadingTime, calculateSpeakingTime, wordCount } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';

    const scripts = await db.script.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { seoData: true },
    });

    return NextResponse.json(scripts);
  } catch (error) {
    console.error('Failed to fetch scripts:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const body = await request.json();

    const validated = scriptSchema.parse(body);

    const fullText = [validated.hook, validated.intro, validated.body, validated.examples, validated.cta, validated.outro]
      .filter(Boolean)
      .join(' ');

    const script = await db.script.create({
      data: {
        ...validated,
        userId,
        wordCount: wordCount(fullText),
        readingTime: calculateReadingTime(fullText),
        speakingTime: calculateSpeakingTime(fullText),
      },
    });

    return NextResponse.json(script, { status: 201 });
  } catch (error) {
    console.error('Failed to create script:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
