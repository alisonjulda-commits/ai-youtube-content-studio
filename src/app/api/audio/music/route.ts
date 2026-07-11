import { NextRequest, NextResponse } from 'next/server';
import { getMusicForCategory, getMusicTrack, syncAudioTracks, getMusicPreset } from '@/lib/music';

interface MusicRequest {
  categoryId: string;
  trackId?: string;
  totalDurationSeconds: number;
  mixPreset?: 'focus' | 'energetic' | 'calm' | 'balanced';
}

export async function POST(request: NextRequest) {
  try {
    const body: MusicRequest = await request.json();
    const { categoryId, trackId, totalDurationSeconds, mixPreset } = body;

    if (!categoryId || !totalDurationSeconds) {
      return NextResponse.json(
        { error: 'categoryId and totalDurationSeconds are required' },
        { status: 400 }
      );
    }

    // Get music track
    const musicTrack = getMusicTrack(categoryId, trackId);

    // Get audio mix configuration
    const mixConfig = mixPreset ? getMusicPreset(mixPreset) : undefined;

    // Sync audio tracks
    const audioSync = syncAudioTracks(musicTrack, totalDurationSeconds, mixConfig);

    return NextResponse.json({
      status: 'success',
      musicTrack,
      audioSync,
      category: categoryId,
      totalDurationSeconds,
      mixPreset: mixPreset || 'balanced',
    });
  } catch (error) {
    console.error('Failed to configure music:', error);
    return NextResponse.json(
      { error: 'Failed to configure music' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const categoryId = request.nextUrl.searchParams.get('category');

    if (!categoryId) {
      return NextResponse.json(
        { error: 'category parameter is required' },
        { status: 400 }
      );
    }

    const tracks = getMusicForCategory(categoryId);

    return NextResponse.json({
      status: 'success',
      category: categoryId,
      tracks,
      count: tracks.length,
    });
  } catch (error) {
    console.error('Failed to fetch music tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch music tracks' },
      { status: 500 }
    );
  }
}
