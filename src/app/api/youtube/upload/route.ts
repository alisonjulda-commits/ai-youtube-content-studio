import { createUploadJob, validateMetadata } from '@/lib/youtube-upload';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';

    const {
      videoPath,
      videoIdeaId,
      title,
      description,
      tags,
      category,
      language,
      visibility,
      license,
      thumbnailPath,
      madeForKids,
      publishAt,
    } = await request.json();

    // Validate YouTube connection
    const youtubeAuth = await db.youTubeAuth.findUnique({
      where: { userId },
    });

    if (!youtubeAuth) {
      return NextResponse.json(
        { error: 'YouTube account not connected' },
        { status: 401 }
      );
    }

    // Validate metadata
    const validation = validateMetadata({
      title,
      description,
      tags,
      category,
      language,
      visibility,
      license,
      madeForKids,
      publishAt: publishAt ? new Date(publishAt) : undefined,
      thumbnailPath,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Metadata validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Create upload job
    const jobId = await createUploadJob(
      userId,
      videoPath,
      {
        title,
        description,
        tags,
        category,
        language,
        visibility,
        license,
        madeForKids,
        publishAt: publishAt ? new Date(publishAt) : undefined,
        thumbnailPath,
      },
      videoIdeaId
    );

    return NextResponse.json({
      jobId,
      status: 'draft',
      message: 'Upload job created. Call /upload/:jobId/start to begin uploading.',
    });
  } catch (error) {
    console.error('Upload creation error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create upload job',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';

    // List recent uploads for user
    const uploads = await db.youtubeUpload.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        status: true,
        uploadProgress: true,
        youtubeVideoId: true,
        youtubeUrl: true,
        createdAt: true,
        uploadedAt: true,
        errorMessage: true,
      },
    });

    return NextResponse.json(uploads);
  } catch (error) {
    console.error('List uploads error:', error);
    return NextResponse.json(
      { error: 'Failed to list uploads' },
      { status: 500 }
    );
  }
}
