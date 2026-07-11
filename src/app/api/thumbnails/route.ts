import { saveThumbnailDesign, listThumbnailDesigns } from '@/lib/thumbnail-generator';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { templateId, title, colors, textOverrides, videoIdeaId } = await request.json();

    if (!templateId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: templateId, title' },
        { status: 400 }
      );
    }

    const designId = await saveThumbnailDesign(
      userId,
      {
        templateId,
        title,
        colors: colors || {},
        textOverrides: textOverrides || {},
      },
      videoIdeaId
    );

    return NextResponse.json({
      id: designId,
      templateId,
      title,
      message: 'Thumbnail design created',
    });
  } catch (error) {
    console.error('Create thumbnail error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create thumbnail',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';

    const designs = await listThumbnailDesigns(userId);

    return NextResponse.json(designs);
  } catch (error) {
    console.error('List thumbnails error:', error);
    return NextResponse.json(
      { error: 'Failed to list thumbnails' },
      { status: 500 }
    );
  }
}
