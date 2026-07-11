import { getYouTubeStatus } from '@/lib/youtube-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id') || 'default-user';

    const status = await getYouTubeStatus(userId);

    return NextResponse.json(status);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to get YouTube status' },
      { status: 500 }
    );
  }
}
