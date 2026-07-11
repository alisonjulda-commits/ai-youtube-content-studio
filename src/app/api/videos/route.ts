import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { videoIdeaSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const where: any = { userId };
    if (category) where.category = category;
    if (status) where.status = status;

    const videos = await db.videoIdea.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Failed to fetch video ideas:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const body = await request.json();

    const validated = videoIdeaSchema.parse(body);

    // Ensure user exists
    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@localhost`,
        name: 'Default User',
      },
    });

    const video = await db.videoIdea.create({
      data: {
        ...validated,
        userId,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Failed to create video idea:', error);
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
