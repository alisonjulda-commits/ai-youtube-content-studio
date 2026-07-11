import {
  saveSubtitles,
  listSubtitles,
  generateSubtitlesFromScript,
} from '@/lib/subtitle-manager';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const body = await request.json();

    const { title, language, videoIdeaId, scriptId, autoGenerate } = body;

    if (!title || !language) {
      return NextResponse.json(
        { error: 'Title and language are required' },
        { status: 400 }
      );
    }

    let lines;

    if (autoGenerate && scriptId) {
      // Generate subtitles from script
      lines = await generateSubtitlesFromScript(userId, scriptId, {
        title,
        language,
        videoIdeaId,
        scriptId,
      });
    } else if (!autoGenerate && body.lines) {
      // Use provided subtitle lines
      lines = body.lines;
    } else {
      return NextResponse.json(
        {
          error:
            'Either provide lines array or set autoGenerate=true with scriptId',
        },
        { status: 400 }
      );
    }

    const subtitleId = await saveSubtitles(userId, lines, {
      title,
      language,
      videoIdeaId,
      scriptId,
    });

    return NextResponse.json({ id: subtitleId }, { status: 201 });
  } catch (error) {
    console.error('Create subtitle error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create subtitle',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');

    const subtitles = await listSubtitles(userId, limit);

    return NextResponse.json({
      count: subtitles.length,
      subtitles,
    });
  } catch (error) {
    console.error('List subtitles error:', error);
    return NextResponse.json(
      { error: 'Failed to list subtitles' },
      { status: 500 }
    );
  }
}
