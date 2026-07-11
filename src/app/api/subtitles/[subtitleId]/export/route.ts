import { exportSubtitles } from '@/lib/subtitle-manager';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { subtitleId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { subtitleId } = params;
    const format = (request.nextUrl.searchParams.get('format') ||
      'srt') as 'srt' | 'vtt';

    if (format !== 'srt' && format !== 'vtt') {
      return NextResponse.json(
        { error: 'Format must be srt or vtt' },
        { status: 400 }
      );
    }

    const { content, filename, mimeType } = await exportSubtitles(
      subtitleId,
      userId,
      format
    );

    return new NextResponse(content, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export subtitle error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to export subtitle',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}
