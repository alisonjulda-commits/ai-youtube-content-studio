# Video Generation Integration Guide

## Overview

The YouTube Content Studio now includes full integration with Remotion for automated video production. This pipeline allows you to:

1. Write scripts in the Script Writer
2. Generate TTS voiceovers automatically
3. Add background music
4. Render complete videos with Remotion

## Architecture

### Components

```
Content Studio (Next.js)
├── Video Ideas (planning & ideation)
├── Script Writer (AI-powered writing)
├── Video Generator (this component)
│   ├── TTS Voiceover Generation
│   ├── Background Music Generation
│   └── Remotion Video Composition
└── Exports (final videos)
```

### Technologies

- **Remotion**: Video composition & rendering
- **espeak-ng**: Text-to-speech generation
- **FFmpeg**: Audio processing & mixing
- **Prisma**: Data persistence

## Setup

### 1. Install System Dependencies

```bash
# Ubuntu/Debian
sudo apt-get install espeak-ng ffmpeg ffprobe

# macOS
brew install espeak-ng ffmpeg

# Windows (via chocolatey)
choco install ffmpeg
```

### 2. Verify Installation

```bash
# Check espeak-ng
espeak-ng --list-voices | grep -i "en"

# Check ffmpeg
ffmpeg -version
ffprobe -version
```

### 3. Environment Setup

Create or update `.env.local`:

```env
DATABASE_URL="file:./prisma/dev.db"
ANTHROPIC_API_KEY="your-key-here"
VOICEOVER_DIR="./public/voiceover"
MUSIC_DIR="./public/music"
```

## Usage

### Step 1: Create a Script

1. Go to **Script Writer**
2. Generate a new script with AI or write manually
3. Structure: Hook, Intro, Body, Examples, CTA, Outro

### Step 2: Generate Video

1. Go to **Video Generator**
2. Select your script from the dropdown
3. Click **Generate Video**
4. The system will:
   - Generate TTS voiceover for each section
   - Create background music
   - Compose video with Remotion
   - Render final MP4

### Step 3: Download & Publish

- Preview video in the Video Generator
- Download the rendered MP4
- Upload to YouTube directly from the Content Studio (future feature)

## Voice Configuration

### Current Settings (Filipina Voice)

```typescript
{
  voice: 'en-us+f1',    // Female US English (good for Filipina accent)
  speed: 150,           // Slightly slow for clarity
  pitch: 50             // Neutral pitch
}
```

### Available Voices

List all available voices:
```bash
espeak-ng --list-voices
```

Common high-quality voices:
- `en-us+f1` - Female US English
- `en-gb+f1` - Female British English
- `en+f1` - Female English (general)

### Customizing Voice

Edit `src/lib/tts.ts`:

```typescript
const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  voice: 'en-us+f1',  // Change voice
  speed: 150,         // 50-200 (lower = slower)
  pitch: 50           // 0-100
};
```

## Audio Processing Pipeline

### Voiceover Enhancement

Each voiceover undergoes:
1. **Highpass Filter** - Remove rumble below 85Hz
2. **Treble Boost** - Brighten voice at 3.5kHz (+5dB)
3. **Bass Enhancement** - Add warmth at 200Hz (+2dB)
4. **De-Esser** - Reduce harshness at 6kHz (-2dB)
5. **Compression** - Ensure consistent levels
6. **Reverb** - Add natural spacing (0.4s decay)
7. **Normalization** - Final loudness adjustment (-13 LUFS)

### Background Music

Lo-fi hip-hop inspired instrumental with:
- **Bass Pad** (55Hz) - Foundation (30% volume)
- **Mid Pad** (110Hz, 165Hz) - Warmth (50% volume)
- **High Shimmer** (440Hz) - Brightness (20% volume)
- **Fade In/Out** - 0.5s smooth transitions

### Final Mix

- Background Music: 30% volume
- Voiceover: 80% volume
- Output: 192kbps, 44.1kHz stereo

## File Structure

```
/public
  /voiceover
    /[scriptId]
      hook.mp3
      intro.mp3
      body.mp3
      ...
  /music
    background-[timestamp].mp3
  /videos
    [videoId].mp4

/remotion
  Root.tsx (main composition)
  /compositions
    BiblicalSelfCareVideo.tsx
```

## API Endpoints

### Generate Video

```bash
POST /api/videos/generate
Content-Type: application/json
x-user-id: default-user

{
  "scriptId": "script-id-123",
  "title": "My Video Title",
  "sections": [
    { "id": "hook", "text": "Your health is..." },
    { "id": "intro", "text": "Welcome everyone..." }
  ]
}

Response:
{
  "videoId": "video-id-123",
  "scriptId": "script-id-123",
  "voiceoverUrls": {
    "hook": "/voiceover/script-id-123/hook.mp3",
    "intro": "/voiceover/script-id-123/intro.mp3"
  },
  "frameTiming": {
    "hook": { "from": 0, "durationInFrames": 69 },
    "intro": { "from": 77, "durationInFrames": 369 }
  },
  "totalFrames": 1800,
  "totalSeconds": 60,
  "composition": {
    "id": "BiblicalSelfCare",
    "width": 1080,
    "height": 1920,
    "fps": 30,
    "durationInFrames": 1800
  }
}
```

## Rendering Videos

### Using Remotion CLI

```bash
# Render video
npx remotion render BiblicalSelfCare output.mp4 \
  --props '{"title":"My Title","scriptSections":[...]}'

# Create sequence
npx remotion still BiblicalSelfCare 0 output.png

# Preview in browser
npx remotion preview
```

### Programmatic Rendering

```typescript
import { renderMedia } from 'remotion';

await renderMedia({
  composition: BiblicalSelfCareVideo,
  fps: 30,
  imageFormat: 'jpeg',
  codec: 'h264',
  crf: 18,
  outputLocation: 'output.mp4',
  concurrency: 4,
  scale: 1,
});
```

## Customization

### Change Video Dimensions

Edit `remotion.config.ts`:

```typescript
Config.setFrameRate(30);
Config.setDurationInFrames(1800); // Change duration
// For YouTube Shorts: 1080x1920
// For YouTube Video: 1920x1080
```

### Add Graphics/Overlays

Edit `remotion/compositions/BiblicalSelfCareVideo.tsx`:

```typescript
<AbsoluteFill>
  {/* Add your graphics here */}
  <Img src="/logo.png" style={{width: 200, height: 100}} />
</AbsoluteFill>
```

### Change Music

Modify `src/lib/music.ts` to use different frequency combinations or pre-recorded tracks.

## Troubleshooting

### "espeak-ng: command not found"

Install espeak-ng:
```bash
# Ubuntu
sudo apt-get install espeak-ng

# macOS
brew install espeak-ng
```

### "ffmpeg: command not found"

Install ffmpeg:
```bash
# Ubuntu
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg
```

### Voiceover quality issues

1. Check voice config in `src/lib/tts.ts`
2. Test voice directly: `espeak-ng -v en-us+f1 "Test message" -w test.wav`
3. Adjust audio filters in the FFmpeg command

### Video rendering fails

1. Check file permissions in `/public/voiceover` and `/public/music`
2. Ensure FFmpeg is installed: `ffmpeg -version`
3. Check disk space for temporary files
4. Review browser console for errors

## Performance Tips

1. **Parallel Processing**: Generate multiple voiceovers concurrently
2. **Caching**: Store background music template
3. **Quality**: Use H.264 codec with CRF 18-23 for good quality/size balance
4. **Encoding**: Enable GPU acceleration if available

## Next Steps

1. Add YouTube API integration for auto-publishing
2. Implement video preview with Remotion Player
3. Add subtitle/caption generation from scripts
4. Create video templates library
5. Add analytics tracking for generated videos

## Support

For issues or questions:
- Check Remotion docs: https://remotion.dev/docs
- espeak-ng docs: http://espeak.sourceforge.net/
- FFmpeg docs: https://ffmpeg.org/documentation.html
