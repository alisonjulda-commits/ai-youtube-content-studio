import {
  getThumbnailDesign,
  updateThumbnailDesign,
  deleteThumbnailDesign,
  exportThumbnailSVG,
} from '@/lib/thumbnail-generator';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { designId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { designId } = params;

    const design = await getThumbnailDesign(designId, userId);

    return NextResponse.json(design);
  } catch (error) {
    console.error('Get design error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to get design',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { designId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { designId } = params;
    const updates = await request.json();

    const design = await updateThumbnailDesign(designId, userId, updates);

    return NextResponse.json(design);
  } catch (error) {
    console.error('Update design error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to update design',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { designId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { designId } = params;

    await deleteThumbnailDesign(designId, userId);

    return NextResponse.json({ success: true, message: 'Design deleted' });
  } catch (error) {
    console.error('Delete design error:', error);
    const isUnauthorized =
      error instanceof Error && error.message === 'Unauthorized';
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to delete design',
      },
      { status: isUnauthorized ? 403 : 500 }
    );
  }
}
