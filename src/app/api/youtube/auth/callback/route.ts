import { exchangeCodeForToken, fetchChannelInfo, saveYouTubeAuth } from '@/lib/youtube-auth';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(
          `/settings?youtube_error=${encodeURIComponent(error)}`,
          request.url
        )
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/settings?youtube_error=no_code', request.url)
      );
    }

    const cookieStore = await cookies();
    const storedState = cookieStore.get('youtube_state')?.value;
    const codeVerifier = cookieStore.get('youtube_code_verifier')?.value;
    const userId = cookieStore.get('youtube_user_id')?.value;

    // Validate state to prevent CSRF
    if (!state || state !== storedState) {
      return NextResponse.redirect(
        new URL('/settings?youtube_error=state_mismatch', request.url)
      );
    }

    if (!codeVerifier || !userId) {
      return NextResponse.redirect(
        new URL('/settings?youtube_error=session_expired', request.url)
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForToken(code, codeVerifier);

    // Fetch channel information
    const channelInfo = await fetchChannelInfo(tokens.access_token);

    // Save to database
    await saveYouTubeAuth(userId, tokens, channelInfo);

    // Clear cookies
    cookieStore.delete('youtube_code_verifier');
    cookieStore.delete('youtube_state');
    cookieStore.delete('youtube_user_id');

    return NextResponse.redirect(
      new URL('/settings?youtube_success=true', request.url)
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(
        `/settings?youtube_error=${encodeURIComponent(
          error instanceof Error ? error.message : 'Unknown error'
        )}`,
        request.url
      )
    );
  }
}
