import * as fs from 'fs';
import * as path from 'path';
import { db } from './db';
import { getValidAccessToken } from './youtube-auth';

export interface UploadMetadata {
  title: string;
  description?: string;
  tags?: string[];
  category?: string;
  language?: string;
  visibility: 'private' | 'unlisted' | 'public';
  madeForKids?: boolean;
  license?: 'creativeCommon' | 'standard';
  publishAt?: Date;
  thumbnailPath?: string;
}

export interface UploadProgress {
  jobId: string;
  status: 'draft' | 'uploading' | 'processing' | 'published' | 'failed';
  progress: number;
  youtubeVideoId?: string;
  youtubeUrl?: string;
  errorMessage?: string;
}

// YouTube category IDs mapping
const YOUTUBE_CATEGORIES: Record<string, string> = {
  '1': 'Film & Animation',
  '2': 'Autos & Vehicles',
  '10': 'Music',
  '15': 'Pets & Animals',
  '17': 'Sports',
  '18': 'Short Movies',
  '19': 'Travel & Events',
  '20': 'Gaming',
  '21': 'Videoblogging',
  '22': 'People & Blogs',
  '23': 'Comedy',
  '24': 'Entertainment',
  '25': 'News & Politics',
  '26': 'Howto & Style',
  '27': 'Education',
  '28': 'Science & Technology',
  '29': 'Nonprofits & Activism',
  '30': 'Movies',
  '31': 'Anime/Animation',
  '32': 'Action/Adventure',
  '33': 'Classics',
  '34': 'Comedies',
  '35': 'Documentaries',
  '36': 'Dramas',
  '37': 'Family',
  '38': 'Foreign',
  '39': 'Horror',
  '40': 'Sci-Fi/Fantasy',
  '41': 'Thrillers',
};

// Validate metadata
export function validateMetadata(metadata: UploadMetadata): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!metadata.title || metadata.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (metadata.title && metadata.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  if (metadata.description && metadata.description.length > 5000) {
    errors.push('Description must be less than 5000 characters');
  }

  if (metadata.tags && metadata.tags.length > 500) {
    errors.push('Too many tags (max 500)');
  }

  if (metadata.category && !YOUTUBE_CATEGORIES[metadata.category]) {
    errors.push(`Invalid category: ${metadata.category}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Create upload job
export async function createUploadJob(
  userId: string,
  videoPath: string,
  metadata: UploadMetadata,
  videoIdeaId?: string
): Promise<string> {
  // Validate metadata
  const validation = validateMetadata(metadata);
  if (!validation.valid) {
    throw new Error(`Metadata validation failed: ${validation.errors.join(', ')}`);
  }

  // Check file exists and get size
  if (!fs.existsSync(videoPath)) {
    throw new Error(`Video file not found: ${videoPath}`);
  }

  const stats = fs.statSync(videoPath);
  const videoSize = stats.size;

  // Check file size (YouTube max 256GB, but we limit to 12GB for practical reasons)
  if (videoSize > 12 * 1024 * 1024 * 1024) {
    throw new Error('Video file too large (max 12GB)');
  }

  // Create upload record
  const upload = await db.youtubeUpload.create({
    data: {
      userId,
      videoIdeaId,
      title: metadata.title,
      description: metadata.description || '',
      tags: JSON.stringify(metadata.tags || []),
      category: metadata.category || '22',
      language: metadata.language || 'en',
      license: metadata.license || 'standard',
      visibility: metadata.visibility,
      scheduledPublishAt: metadata.publishAt,
      thumbnailPath: metadata.thumbnailPath,
      videoPath,
      videoSize,
      status: 'draft',
      restrictions: metadata.madeForKids
        ? JSON.stringify({ madeForKids: true })
        : undefined,
    },
  });

  return upload.id;
}

// Upload video to YouTube
export async function uploadToYouTube(
  jobId: string,
  userId: string
): Promise<UploadProgress> {
  try {
    // Get upload record
    const upload = await db.youtubeUpload.findUnique({
      where: { id: jobId },
    });

    if (!upload) {
      throw new Error('Upload job not found');
    }

    if (upload.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (!upload.videoPath || !fs.existsSync(upload.videoPath)) {
      throw new Error('Video file not found');
    }

    // Get valid access token
    const accessToken = await getValidAccessToken(userId);

    // Update status to uploading
    await db.youtubeUpload.update({
      where: { id: jobId },
      data: { status: 'uploading', uploadProgress: 5 },
    });

    // Build video metadata
    const videoMetadata: Record<string, any> = {
      snippet: {
        title: upload.title,
        description: upload.description || '',
        tags: JSON.parse(upload.tags || '[]'),
        categoryId: upload.category,
        defaultLanguage: upload.language,
        defaultAudioLanguage: upload.language,
      },
      status: {
        privacyStatus: upload.visibility,
        madeForKids: upload.restrictions
          ? JSON.parse(upload.restrictions).madeForKids
          : false,
        selfDeclaredMadeForKids: upload.restrictions
          ? JSON.parse(upload.restrictions).madeForKids
          : false,
      },
      processingDetails: {
        processingStatus: 'processing',
      },
      suggestions: {
        processingStatus: 'processing',
      },
    };

    // Add publishAt only if scheduled
    if (upload.scheduledPublishAt instanceof Date) {
      videoMetadata.status.publishAt = upload.scheduledPublishAt.toISOString();
    }

    // Start resumable upload
    const response = await initiateResumableUpload(
      accessToken,
      upload.videoPath,
      videoMetadata,
      jobId,
      userId
    );

    // After successful upload, update status
    await db.youtubeUpload.update({
      where: { id: jobId },
      data: {
        status: 'processing',
        uploadProgress: 100,
        youtubeVideoId: response.videoId,
        youtubeUrl: `https://www.youtube.com/watch?v=${response.videoId}`,
        uploadedAt: new Date(),
      },
    });

    // Upload thumbnail if provided
    if (upload.thumbnailPath && fs.existsSync(upload.thumbnailPath)) {
      await uploadThumbnail(
        accessToken,
        response.videoId,
        upload.thumbnailPath
      );
    }

    // Update status to published if not scheduled
    if (!upload.scheduledPublishAt) {
      await db.youtubeUpload.update({
        where: { id: jobId },
        data: { status: 'published' },
      });
    }

    return {
      jobId,
      status: upload.scheduledPublishAt ? 'processing' : 'published',
      progress: 100,
      youtubeVideoId: response.videoId,
      youtubeUrl: `https://www.youtube.com/watch?v=${response.videoId}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = extractErrorCode(errorMessage);

    // Update upload with error
    await db.youtubeUpload.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        errorMessage,
        errorCode,
      },
    });

    throw error;
  }
}

// Initiate resumable upload with progress tracking
async function initiateResumableUpload(
  accessToken: string,
  videoPath: string,
  metadata: any,
  jobId: string,
  userId: string
): Promise<{ videoId: string }> {
  // Start resumable upload session
  const startResponse = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status,processingDetails',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
      },
      body: JSON.stringify(metadata),
    }
  );

  if (!startResponse.ok) {
    throw new Error(`Failed to start upload: ${startResponse.statusText}`);
  }

  // Get upload URL from Location header
  const uploadUrl = startResponse.headers.get('location');
  if (!uploadUrl) {
    throw new Error('No upload URL provided by YouTube');
  }

  // Upload video file in chunks
  const fileSize = fs.statSync(videoPath).size;
  const chunkSize = 5 * 1024 * 1024; // 5MB chunks

  let uploadedBytes = 0;
  const readStream = fs.createReadStream(videoPath);

  return new Promise((resolve, reject) => {
    let chunks: Buffer[] = [];
    let currentChunkSize = 0;

    readStream.on('data', async (chunk: string | Buffer) => {
      readStream.pause();

      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      chunks.push(buf);
      currentChunkSize += buf.length;
      uploadedBytes += buf.length;

      if (currentChunkSize >= chunkSize || uploadedBytes === fileSize) {
        const data = Buffer.concat(chunks);
        chunks = [];
        currentChunkSize = 0;

        try {
          const isLastChunk = uploadedBytes === fileSize;
          const response = await uploadChunk(
            uploadUrl,
            data,
            uploadedBytes,
            fileSize,
            isLastChunk
          );

          // Update progress
          const progress = Math.min(
            99,
            Math.floor((uploadedBytes / fileSize) * 95) + 5
          );
          await db.youtubeUpload.update({
            where: { id: jobId },
            data: { uploadProgress: progress },
          });

          if (isLastChunk) {
            const videoId = response.id;
            resolve({ videoId });
          } else {
            readStream.resume();
          }
        } catch (error) {
          readStream.destroy();
          reject(error);
        }
      } else {
        readStream.resume();
      }
    });

    readStream.on('error', reject);
  });
}

// Upload a single chunk
async function uploadChunk(
  uploadUrl: string,
  chunk: Buffer,
  uploadedBytes: number,
  totalBytes: number,
  isLastChunk: boolean
): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/octet-stream',
    'Content-Length': chunk.length.toString(),
  };

  if (isLastChunk) {
    headers['X-Goog-Upload-Command'] = 'upload, finalize';
    headers['Content-Range'] = `bytes ${uploadedBytes - chunk.length}-${uploadedBytes - 1}/${totalBytes}`;
  } else {
    headers['X-Goog-Upload-Command'] = 'upload';
    headers['Content-Range'] = `bytes ${uploadedBytes - chunk.length}-${uploadedBytes - 1}/${totalBytes}`;
  }

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers,
    body: new Uint8Array(chunk),
  });

  if (!response.ok && !isLastChunk) {
    // For non-final chunks, 308 Resume Incomplete is expected
    if (response.status !== 308) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  } else if (!response.ok) {
    throw new Error(`Upload finalization failed: ${response.statusText}`);
  }

  // Parse response on final chunk
  if (isLastChunk) {
    return response.json();
  }

  return {};
}

// Upload thumbnail
async function uploadThumbnail(
  accessToken: string,
  videoId: string,
  thumbnailPath: string
): Promise<void> {
  const fileContent = fs.readFileSync(thumbnailPath);

  const response = await fetch(
    `https://www.googleapis.com/upload/youtube/v3/videos/set?videoId=${videoId}&onBehalfOfContentOwner=&onBehalfOfContentOwnerChannel=`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'image/jpeg',
      },
      body: fileContent,
    }
  );

  if (!response.ok) {
    console.error('Thumbnail upload failed:', response.statusText);
    // Don't throw - thumbnail upload failure shouldn't fail the whole upload
  }
}

// Get upload progress
export async function getUploadProgress(
  jobId: string,
  userId: string
): Promise<UploadProgress> {
  const upload = await db.youtubeUpload.findUnique({
    where: { id: jobId },
  });

  if (!upload) {
    throw new Error('Upload not found');
  }

  if (upload.userId !== userId) {
    throw new Error('Unauthorized');
  }

  return {
    jobId,
    status: upload.status as
      | 'draft'
      | 'uploading'
      | 'processing'
      | 'published'
      | 'failed',
    progress: upload.uploadProgress,
    youtubeVideoId: upload.youtubeVideoId || undefined,
    youtubeUrl: upload.youtubeUrl || undefined,
    errorMessage: upload.errorMessage || undefined,
  };
}

// Cancel upload job
export async function cancelUpload(
  jobId: string,
  userId: string
): Promise<void> {
  const upload = await db.youtubeUpload.findUnique({
    where: { id: jobId },
  });

  if (!upload) {
    throw new Error('Upload not found');
  }

  if (upload.userId !== userId) {
    throw new Error('Unauthorized');
  }

  if (upload.status !== 'draft' && upload.status !== 'uploading') {
    throw new Error('Cannot cancel upload in current state');
  }

  await db.youtubeUpload.update({
    where: { id: jobId },
    data: {
      status: 'failed',
      errorMessage: 'Cancelled by user',
    },
  });
}

// List uploads for user
export async function listUploads(
  userId: string,
  status?: string,
  limit: number = 50
) {
  return db.youtubeUpload.findMany({
    where: {
      userId,
      ...(status && { status }),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

// Helper: Extract error code from error message
function extractErrorCode(message: string): string {
  if (message.includes('Unauthorized')) return 'UNAUTHORIZED';
  if (message.includes('not found')) return 'NOT_FOUND';
  if (message.includes('quota')) return 'QUOTA_EXCEEDED';
  if (message.includes('invalid')) return 'INVALID_REQUEST';
  return 'UPLOAD_ERROR';
}
