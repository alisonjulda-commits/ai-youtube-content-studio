import { uploadToYouTube } from '@/lib/youtube-upload';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';
    const { jobId } = params;

    // Start upload in background (fire and forget)
    // In production, this would be queued to a job processor
    uploadToYouTube(jobId, userId).catch((error) => {
      console.error(`Upload ${jobId} failed:`, error);
    });

    return NextResponse.json({
      success: true,
      message: 'Upload started. Check status via GET /api/youtube/upload/:jobId',
      jobId,
    });
  } catch (error) {
    console.error('Start upload error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to start upload',
      },
      { status: 500 }
    );
  }
}
