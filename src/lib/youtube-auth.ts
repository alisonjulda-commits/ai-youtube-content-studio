import crypto from 'crypto';
import { db } from './db';

// Encryption for sensitive tokens
const ENCRYPTION_KEY = process.env.YOUTUBE_ENCRYPTION_KEY || 'dev-key-change-in-production-12345678';

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encrypted: string): string {
  const [ivHex, encryptedData] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// OAuth configuration
export const YOUTUBE_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/youtube/auth/callback',
  scopes: [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly',
  ],
};

// Generate OAuth authorization URL with PKCE
export function generateAuthUrl(userId: string): {
  authUrl: string;
  codeVerifier: string;
  state: string;
} {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  const state = crypto.randomBytes(16).toString('hex');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', YOUTUBE_CONFIG.clientId);
  authUrl.searchParams.set('redirect_uri', YOUTUBE_CONFIG.redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', YOUTUBE_CONFIG.scopes.join(' '));
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  return {
    authUrl: authUrl.toString(),
    codeVerifier,
    state,
  };
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export interface ChannelInfo {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

// Exchange authorization code for tokens
export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string
): Promise<TokenResponse> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: YOUTUBE_CONFIG.clientId,
      client_secret: YOUTUBE_CONFIG.clientSecret,
      code,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: YOUTUBE_CONFIG.redirectUri,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(`OAuth token exchange failed: ${response.statusText}`);
  }

  return response.json();
}

// Refresh access token using refresh token
export async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  const decryptedToken = decrypt(refreshToken);

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: YOUTUBE_CONFIG.clientId,
      client_secret: YOUTUBE_CONFIG.clientSecret,
      refresh_token: decryptedToken,
      grant_type: 'refresh_token',
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.statusText}`);
  }

  return response.json();
}

// Fetch YouTube channel info
export async function fetchChannelInfo(accessToken: string): Promise<ChannelInfo> {
  const response = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=snippet,id&mine=true',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch channel info: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.items || data.items.length === 0) {
    throw new Error('No YouTube channel found');
  }

  const channel = data.items[0];
  return {
    id: channel.id,
    title: channel.snippet.title,
    description: channel.snippet.description,
    thumbnail: channel.snippet.thumbnails?.default?.url,
  };
}

// Save YouTube auth to database
export async function saveYouTubeAuth(
  userId: string,
  tokens: TokenResponse,
  channelInfo: ChannelInfo
) {
  const expiryDate = new Date();
  expiryDate.setSeconds(expiryDate.getSeconds() + tokens.expires_in);

  const encryptedAccessToken = encrypt(tokens.access_token);
  const encryptedRefreshToken = tokens.refresh_token
    ? encrypt(tokens.refresh_token)
    : null;

  // Save YouTube auth
  await db.youTubeAuth.upsert({
    where: { userId },
    update: {
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken || undefined,
      tokenExpiry: expiryDate,
      lastRefreshed: new Date(),
      channelId: channelInfo.id,
      channelName: channelInfo.title,
      profileImage: channelInfo.thumbnail,
    },
    create: {
      userId,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken || '',
      tokenExpiry: expiryDate,
      channelId: channelInfo.id,
      channelName: channelInfo.title,
      profileImage: channelInfo.thumbnail,
    },
  });

  // Update settings
  await db.settings.upsert({
    where: { userId },
    update: {
      youtubeConnected: true,
      youtubeChannelId: channelInfo.id,
      youtubeChannelName: channelInfo.title,
    },
    create: {
      userId,
      youtubeConnected: true,
      youtubeChannelId: channelInfo.id,
      youtubeChannelName: channelInfo.title,
    },
  });
}

// Get valid access token (refresh if needed)
export async function getValidAccessToken(userId: string): Promise<string> {
  const auth = await db.youTubeAuth.findUnique({
    where: { userId },
  });

  if (!auth) {
    throw new Error('YouTube account not connected');
  }

  // Check if token is expired or expiring soon (within 5 minutes)
  const now = new Date();
  const bufferTime = new Date(now.getTime() + 5 * 60 * 1000);

  if (auth.tokenExpiry < bufferTime) {
    // Refresh the token
    try {
      const newTokens = await refreshAccessToken(auth.refreshToken);
      const expiryDate = new Date();
      expiryDate.setSeconds(expiryDate.getSeconds() + newTokens.expires_in);

      const encryptedAccessToken = encrypt(newTokens.access_token);
      const encryptedRefreshToken = newTokens.refresh_token
        ? encrypt(newTokens.refresh_token)
        : auth.refreshToken;

      await db.youTubeAuth.update({
        where: { userId },
        data: {
          accessToken: encryptedAccessToken,
          refreshToken: encryptedRefreshToken,
          tokenExpiry: expiryDate,
          lastRefreshed: new Date(),
        },
      });

      return newTokens.access_token;
    } catch (error) {
      // If refresh fails, user needs to reconnect
      await db.youTubeAuth.delete({ where: { userId } });
      await db.settings.update({
        where: { userId },
        data: {
          youtubeConnected: false,
          youtubeChannelId: null,
          youtubeChannelName: null,
        },
      });
      throw new Error('YouTube token refresh failed. Please reconnect your account.');
    }
  }

  return decrypt(auth.accessToken);
}

// Disconnect YouTube account
export async function disconnectYouTube(userId: string) {
  await db.youTubeAuth.delete({ where: { userId } });
  await db.settings.update({
    where: { userId },
    data: {
      youtubeConnected: false,
      youtubeChannelId: null,
      youtubeChannelName: null,
    },
  });
}

// Get YouTube auth status
export async function getYouTubeStatus(userId: string) {
  const auth = await db.youTubeAuth.findUnique({
    where: { userId },
    select: {
      channelId: true,
      channelName: true,
      profileImage: true,
      connectedAt: true,
      lastRefreshed: true,
    },
  });

  return auth
    ? {
        connected: true,
        channelId: auth.channelId,
        channelName: auth.channelName,
        profileImage: auth.profileImage,
        connectedAt: auth.connectedAt,
        lastRefreshed: auth.lastRefreshed,
      }
    : {
        connected: false,
      };
}
