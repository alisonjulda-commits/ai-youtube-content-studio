import { disconnectYouTube } from '@/lib/youtube-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';

    await disconnectYouTube(userId);

    return NextResponse.json({
      success: true,
      message: 'YouTube account disconnected',
    });
  } catch (error) {
    console.error('Disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect YouTube account' },
      { status: 500 }
    );
  }
}
