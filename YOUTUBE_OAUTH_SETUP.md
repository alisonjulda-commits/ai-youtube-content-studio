# YouTube OAuth Setup Guide

This guide explains how to set up YouTube OAuth integration for the YouTube Content Studio, enabling direct uploads to your YouTube channel.

## Overview

The YouTube Content Studio uses OAuth 2.0 with PKCE (Proof Key for Code Exchange) to securely connect your YouTube account. This is the standard, secure way Google recommends for desktop and web applications.

**Benefits:**
- ✅ Secure token-based authentication
- ✅ No password storage
- ✅ Automatic token refresh
- ✅ Granular permission control
- ✅ Easy disconnect and reconnect

## Prerequisites

1. Google Account (with YouTube channel)
2. Access to Google Cloud Console
3. YouTube Content Studio running locally or deployed

## Step 1: Create a Google Cloud Project

### 1.1 Go to Google Cloud Console
1. Visit https://console.cloud.google.com/
2. Sign in with your Google account
3. Click the project dropdown at the top
4. Click "NEW PROJECT"

### 1.2 Create Project Details
- **Project name:** "YouTube Content Studio" (or your preferred name)
- **Organization:** Leave as default or select your organization
- Click "CREATE"

Wait for the project to be created (usually takes a few seconds).

### 1.3 Enable YouTube API
1. Click the project selector again and select your newly created project
2. In the top search bar, search for "YouTube Data API v3"
3. Click on "YouTube Data API v3"
4. Click "ENABLE"

Wait for the API to be enabled.

## Step 2: Create OAuth Credentials

### 2.1 Open OAuth Consent Screen
1. In the Google Cloud Console, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Click "CREATE"

### 2.2 Configure OAuth Consent Screen

**App Information:**
- **App name:** "YouTube Content Studio"
- **User support email:** Your email address
- **Developer contact:** Your email address

**Scopes:**
1. Click "ADD OR REMOVE SCOPES"
2. Search for and add these scopes:
   - `https://www.googleapis.com/auth/youtube.upload`
   - `https://www.googleapis.com/auth/youtube.readonly`
3. Click "UPDATE"

**Test Users (for development):**
1. Scroll to "Test users" section
2. Click "ADD USERS"
3. Add your Gmail address
4. Click "ADD"

Click "SAVE AND CONTINUE" through all sections.

### 2.3 Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click "CREATE CREDENTIALS" → "OAuth client ID"
3. Select **Desktop application**
4. **Name:** "YouTube Content Studio Desktop Client"
5. Click "CREATE"

### 2.4 Get Your Credentials
1. A popup will show your **Client ID** and **Client Secret**
2. Click "DOWNLOAD JSON" to save a backup (optional but recommended)
3. Keep these credentials safe

**Copy these values for the next step:**
- Client ID: `1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`
- Client Secret: `GOCSPX-1234567890abcdefghijklmno`

## Step 3: Configure YouTube Content Studio

### 3.1 Update Environment Variables

Open `.env.local` and fill in the YouTube OAuth credentials:

```bash
# YouTube OAuth Configuration
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/youtube/auth/callback"

# Token Encryption (change to random string in production)
YOUTUBE_ENCRYPTION_KEY="your-random-32-char-key-here"
```

### 3.2 Generate a Secure Encryption Key

For production, generate a cryptographically secure random string:

```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}) -as [byte[]])
```

Use this as your `YOUTUBE_ENCRYPTION_KEY`.

### 3.3 Restart the Development Server

```bash
npm run dev
```

## Step 4: Connect Your YouTube Account

### 4.1 Open Settings Page
1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3000/settings
3. Scroll to "YouTube Connection" section

### 4.2 Click "Connect YouTube Account"
1. Click the red "Connect YouTube Account" button
2. You'll be redirected to Google's login page
3. Sign in with your Google account
4. Review the requested permissions
5. Click "Allow" to grant access

### 4.3 Verify Connection
After connecting, you should see:
- ✅ "Connected" status
- Your YouTube channel name
- Connection timestamp
- "Disconnect YouTube" button

## Step 5: Configure Production Deployment

### For Vercel, Netlify, or Other Hosting:

1. **Add Environment Variables** to your deployment platform:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI` - Update to your production domain
   - `YOUTUBE_ENCRYPTION_KEY`

2. **Update OAuth Redirect URI** in Google Cloud Console:
   - Go to **Credentials**
   - Click your OAuth client
   - Under "Authorized JavaScript origins", add your domain
   - Under "Authorized redirect URIs", update to:
     - `https://yourdomain.com/api/youtube/auth/callback`
   - Click "SAVE"

### For Docker Deployment:

Pass environment variables to your Docker container:

```bash
docker run \
  -e DATABASE_URL="file:./prisma/dev.db" \
  -e GOOGLE_CLIENT_ID="your-client-id" \
  -e GOOGLE_CLIENT_SECRET="your-client-secret" \
  -e GOOGLE_REDIRECT_URI="https://yourdomain.com/api/youtube/auth/callback" \
  -e YOUTUBE_ENCRYPTION_KEY="your-encryption-key" \
  youtube-studio:latest
```

## Security Best Practices

### 🔐 Development
- ✅ Use `YOUTUBE_ENCRYPTION_KEY` from `.env.local`
- ✅ Never commit real credentials to git
- ✅ Keep `.env.local` in `.gitignore`
- ✅ Use development OAuth app for testing

### 🔐 Production
- ✅ Use environment variables (not .env files)
- ✅ Use strong encryption key (32+ random characters)
- ✅ Enable HTTPS only (OAuth forces this)
- ✅ Rotate encryption keys periodically
- ✅ Monitor token refresh failures
- ✅ Use separate OAuth app for production
- ✅ Implement rate limiting on upload endpoints

### 🔐 Token Management
- ✅ Tokens are encrypted before storage
- ✅ Refresh tokens stored securely in database
- ✅ Access tokens auto-refresh before expiry
- ✅ Tokens cleared on disconnect
- ✅ Failed refresh triggers re-authentication

## Troubleshooting

### "Invalid Client ID" Error
- Verify `GOOGLE_CLIENT_ID` in `.env.local`
- Check you copied the entire ID (should end with `.apps.googleusercontent.com`)
- Restart dev server after changing env vars

### "Redirect URI Mismatch"
- Ensure `GOOGLE_REDIRECT_URI` matches exactly in Google Console
- For development: `http://localhost:3000/api/youtube/auth/callback`
- For production: `https://yourdomain.com/api/youtube/auth/callback`
- Clear browser cache and try again

### "Permission Denied" After Connecting
- Go to https://myaccount.google.com/permissions
- Find "YouTube Content Studio" in connected apps
- Click "Remove access" and reconnect

### "Token Refresh Failed" Message
- Your token has expired
- Go to Settings → YouTube Connection
- Click "Disconnect YouTube"
- Reconnect by clicking "Connect YouTube Account"

### "Scope Missing" Error
- OAuth token wasn't granted all required permissions
- Go to Settings and disconnect
- Check you selected both `youtube.upload` and `youtube.readonly` scopes
- Reconnect and ensure you click "Allow" for all permissions

## API Endpoints

After connecting your YouTube account, these endpoints are available:

### Check Connection Status
```bash
curl -H "x-user-id: default-user" \
  http://localhost:3000/api/youtube/auth/status
```

Response:
```json
{
  "connected": true,
  "channelId": "UCxxxxxxxxx",
  "channelName": "My Channel",
  "profileImage": "https://...",
  "connectedAt": "2026-07-11T10:30:00Z"
}
```

### Disconnect Account
```bash
curl -X POST \
  -H "x-user-id: default-user" \
  http://localhost:3000/api/youtube/auth/disconnect
```

## Testing OAuth Flow

### Development Testing Checklist
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to http://localhost:3000/settings
- [ ] Click "Connect YouTube Account"
- [ ] Google login page appears
- [ ] Grant permissions
- [ ] Redirected back to settings
- [ ] "Connected" status shows
- [ ] Channel name displays correctly
- [ ] Test disconnect
- [ ] Test reconnect

### End-to-End Testing
Once connected, you can:
1. Create a video idea
2. Generate a script
3. Compose video
4. Render MP4
5. Go to Step 8 (Review & Upload)
6. Upload to YouTube with your connected account

## Next Steps

With YouTube OAuth configured, you can:
1. **Upload Videos** - Direct YouTube upload from the studio
2. **Set Metadata** - Title, description, tags, visibility
3. **Schedule Publishing** - Schedule videos for future publish
4. **Manage Visibility** - Private, Unlisted, or Public
5. **Add Thumbnails** - Upload custom thumbnail

See [YouTube Upload Guide](./YOUTUBE_UPLOAD_GUIDE.md) for upload workflow details.

## Support

For issues:
1. Check this troubleshooting section
2. Review Google Cloud Console error messages
3. Check browser console (F12) for errors
4. Check server logs: `tail -f server.log`

## References

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [YouTube Data API Documentation](https://developers.google.com/youtube/v3/docs)
- [OAuth PKCE RFC](https://datatracker.ietf.org/doc/html/rfc7636)
- [Google Cloud Console](https://console.cloud.google.com/)
