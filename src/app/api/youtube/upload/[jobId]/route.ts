import { getUploadProgress, cancelUpload } from '@/lib/youtube-upload';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { jobId } = params;

    const progress = await getUploadProgress(jobId, userId);
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to get progress',
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { jobId } = params;

    await cancelUpload(jobId, userId);

    return NextResponse.json({
      success: true,
      message: 'Upload cancelled',
    });
  } catch (error) {
    console.error('Cancel upload error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to cancel upload',
      },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
    );
  }
}
