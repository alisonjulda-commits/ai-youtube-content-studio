import {
  getSubtitles,
  updateSubtitles,
  deleteSubtitles,
} from '@/lib/subtitle-manager';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { subtitleId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { subtitleId } = params;

    const subtitle = await getSubtitles(subtitleId, userId);

    return NextResponse.json(subtitle);
  } catch (error) {
    console.error('Get subtitle error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to get subtitle',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { subtitleId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { subtitleId } = params;
    const body = await request.json();

    const { lines, status, title } = body;

    const updated = await updateSubtitles(subtitleId, userId, {
      lines,
      status,
      title,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update subtitle error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to update subtitle',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { subtitleId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { subtitleId } = params;

    await deleteSubtitles(subtitleId, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete subtitle error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to delete subtitle',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}
