import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateReadingTime, calculateSpeakingTime, wordCount } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const script = await db.script.findUnique({
      where: { id: params.id },
      include: { seoData: true },
    });

    if (!script) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(script);
  } catch (error) {
    console.error('Failed to fetch script:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const fullText = [body.hook, body.intro, body.body, body.examples, body.cta, body.outro]
      .filter(Boolean)
      .join(' ');

    const script = await db.script.update({
      where: { id: params.id },
      data: {
        ...body,
        wordCount: wordCount(fullText),
        readingTime: calculateReadingTime(fullText),
        speakingTime: calculateSpeakingTime(fullText),
      },
    });

    return NextResponse.json(script);
  } catch (error) {
    console.error('Failed to update script:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.script.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete script:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
