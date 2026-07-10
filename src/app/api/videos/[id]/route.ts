import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { videoIdeaSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const video = await db.videoIdea.findUnique({
      where: { id: params.id },
    });

    if (!video) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Failed to fetch video:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = videoIdeaSchema.partial().parse(body);

    const video = await db.videoIdea.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Failed to update video:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.videoIdea.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete video:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
