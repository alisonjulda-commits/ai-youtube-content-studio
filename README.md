# YouTube Content Studio

A comprehensive AI-powered desktop/web application for YouTube creators to manage video ideas, generate scripts, optimize SEO, create videos with voiceovers, and organize content production workflows.

**Demo Channel:** [@juldamariealison78](https://www.youtube.com/@juldamariealison78)

## 🌟 Features

### Core Content Management
- **Video Idea Manager** - Create, organize, and track video concepts with priority/difficulty levels
- **AI Script Generator** - Generate professional scripts using Claude API with multiple tones
- **SEO Optimizer** - Auto-generate titles, descriptions, hashtags, and SEO scores
- **Prompt Library** - Save and reuse prompts for faster content creation
- **Project Management** - Track projects and organize content production workflows

### Video Production
- **Automated Voiceovers** - Text-to-speech with Filipina voice and professional audio processing
- **Background Music** - Auto-generated lo-fi hip-hop inspired instrumentals
- **Remotion Video Composition** - Professional video rendering with animations
- **Frame-Perfect Timing** - Automatic duration calculation and sync

### Developer Features
- **REST API** - Complete API for all resources (videos, scripts, SEO, prompts)
- **TypeScript** - Full type safety throughout the codebase
- **SQLite Database** - Prisma ORM with full schema
- **Dark/Light Theme** - Responsive design with theme support
- **Component Library** - Reusable UI components based on shadcn/ui patterns

## 🚀 Quick Start

### Prerequisites

```bash
# Required
- Node.js 18+ (with npm)
- npm 9+

# For video generation (optional but recommended)
- espeak-ng (TTS engine)
- FFmpeg (audio/video processing)
- ffprobe (media information)

# For API
- Anthropic API key (for AI script generation)
```

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd karauna-guesthouse.index.html
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL="file:./prisma/dev.db"
ANTHROPIC_API_KEY="your-api-key-from-console.anthropic.com"
```

4. **Initialize database**
```bash
npm run db:setup
```

5. **Start development server**
```bash
npm run dev
```

Visit http://localhost:3000

### Installation of System Dependencies

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install espeak-ng ffmpeg
```

#### macOS
```bash
brew install espeak-ng ffmpeg
```

#### Windows
```bash
# Using Chocolatey
choco install ffmpeg

# Using Scoop
scoop install ffmpeg espeak-ng
```

#### Verify Installation
```bash
espeak-ng --version
ffmpeg -version
ffprobe -version
```

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Project Structure](#project-structure)

## 🛠️ Configuration

### Environment Variables

Create `.env.local` with:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# AI/APIs
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY=""  # Optional

# File Paths (optional)
VOICEOVER_DIR="./public/voiceover"
MUSIC_DIR="./public/music"
VIDEO_OUTPUT_DIR="./public/videos"
```

### Anthropic API Setup

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Create a new API key
4. Copy and paste into `.env.local`

### Database Initialization

```bash
# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# View database
npx prisma studio
```

## 🎯 Features Guide

### 1. Video Ideas
**Location:** `/video-ideas`

Manage your video concepts:
- Create new ideas with category, priority, and difficulty
- Filter by category or search by title
- Track status (Idea → Planning → Scripting → Recording → Editing → Published)
- Organize your content pipeline

### 2. Script Writer
**Location:** `/script-writer`

Write and manage scripts:
- Generate scripts with AI (topic, audience, duration, tone)
- Edit 6 sections: Hook, Intro, Body, Examples, CTA, Outro
- Auto-calculate word count, reading time, speaking time
- Copy entire scripts to clipboard
- Link scripts to video ideas

### 3. Video Generator
**Location:** `/video-generator`

Create complete videos:
- Select a script
- Auto-generate TTS voiceovers (one per section)
- Synthesize background music
- Render video with Remotion
- Download MP4 files

**Requirements:**
- espeak-ng installed
- FFmpeg installed
- System permissions for temporary files

### 4. SEO Generator
**Location:** `/seo-generator`

Optimize for YouTube search:
- Enter video title, description, keywords
- Generate 5 optimized titles (50-60 chars)
- Get description variations (155-160 chars)
- Receive 15+ relevant hashtags
- View CTR score (0-100) and SEO score (0-100)
- Copy any result to clipboard

### 5. Prompt Library
**Location:** `/prompt-library`

Manage reusable prompts:
- Organize by category (15+ categories)
- Mark favorites for quick access
- Track usage count
- Search and filter
- Copy to clipboard
- Delete unused prompts

### 6. Settings
**Location:** `/settings`

Configure your workspace:
- Channel name and description
- API keys (Anthropic, OpenAI)
- Brand colors (primary, secondary)
- Theme (Light, Dark, System)
- Data export/import

## 🔌 API Documentation

All API endpoints require the header: `x-user-id: default-user`

### Video Ideas

```bash
# List all video ideas
GET /api/videos
?category=Tutorial&status=planning

# Create new idea
POST /api/videos
{
  "title": "How to Start a Blog",
  "description": "Complete guide...",
  "category": "Tutorial",
  "priority": "high",
  "difficulty": "medium",
  "status": "idea"
}

# Get single idea
GET /api/videos/[id]

# Update idea
PATCH /api/videos/[id]
{ "status": "recording" }

# Delete idea
DELETE /api/videos/[id]
```

### Scripts

```bash
# List all scripts
GET /api/scripts

# Create script
POST /api/scripts
{
  "title": "Blog Intro",
  "hook": "Have you ever...",
  "intro": "Today we'll...",
  "tone": "informative"
}

# Generate script with AI
POST /api/scripts/generate
{
  "topic": "Starting a Blog",
  "targetAudience": "Beginners",
  "duration": 5,
  "tone": "encouraging"
}

# Get/Update/Delete
GET /api/scripts/[id]
PATCH /api/scripts/[id]
DELETE /api/scripts/[id]
```

### SEO

```bash
# Generate SEO data
POST /api/seo/generate
{
  "title": "My Video Title",
  "description": "A detailed description...",
  "keywords": "blog,writing,tips"
}

Response:
{
  "titles": ["5 Blog Writing Tips for Beginners", ...],
  "descriptions": ["Learn the essential...", ...],
  "hashtags": ["#blog", "#writing", ...],
  "ctrScore": 82,
  "seoScore": 78
}
```

### Prompts

```bash
# List prompts
GET /api/prompts?category=Script%20Writing

# Create prompt
POST /api/prompts
{
  "title": "YouTube Hook Generator",
  "content": "Create an engaging hook...",
  "category": "Video Hooks"
}

# Update prompt
PATCH /api/prompts/[id]
{ "isFavorite": true }

# Delete prompt
DELETE /api/prompts/[id]
```

### Video Generation

```bash
# Generate video from script
POST /api/videos/generate
{
  "scriptId": "script-123",
  "title": "My Video Title",
  "sections": [
    { "id": "hook", "text": "Your health is a gift..." },
    { "id": "body", "text": "The three pillars..." }
  ]
}

Response:
{
  "videoId": "video-456",
  "voiceoverUrls": {
    "hook": "/voiceover/script-123/hook.mp3",
    "body": "/voiceover/script-123/body.mp3"
  },
  "frameTiming": {
    "hook": { "from": 0, "durationInFrames": 69 },
    "body": { "from": 77, "durationInFrames": 450 }
  },
  "totalSeconds": 60,
  "composition": { "width": 1080, "height": 1920 }
}
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run start        # Run production build
npm run lint         # Run ESLint

# Database
npm run db:setup     # Initialize database
npm run db:reset     # Reset database
npm run db:seed      # Seed sample data
npx prisma studio   # Open Prisma UI

# Video Generation
npx remotion preview  # Preview Remotion compositions
npx remotion render   # Render video to MP4
```

### Project Structure

```
├── src/
│   ├── app/
│   │   ├── (dashboard)/        # Dashboard pages
│   │   ├── api/                # API routes
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── layout/             # Header, Sidebar
│   │   ├── ui/                 # UI components
│   │   └── providers.tsx       # Theme/toast providers
│   ├── lib/
│   │   ├── anthropic.ts        # Claude API integration
│   │   ├── db.ts               # Prisma client
│   │   ├── tts.ts              # Text-to-speech
│   │   ├── music.ts            # Music generation
│   │   ├── utils.ts            # Utilities
│   │   ├── validations.ts      # Zod schemas
│   │   └── constants.ts        # App constants
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── globals.css             # Global styles
├── remotion/
│   ├── Root.tsx                # Remotion entry point
│   └── compositions/           # Video components
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── public/
│   ├── voiceover/              # Generated TTS files
│   ├── music/                  # Generated music
│   └── videos/                 # Rendered videos
├── VIDEO_GENERATION_GUIDE.md
├── README.md                   # This file
├── USER_GUIDE.md
├── ARCHITECTURE.md
└── package.json
```

## 🎯 Common Workflows

### Workflow 1: Generate a Complete Video

1. **Create Video Idea** → `/video-ideas` → New Idea
2. **Write Script** → `/script-writer` → Generate with AI or write manually
3. **Generate Video** → `/video-generator` → Select script → Generate Video
4. **Download** → Video → Download MP4
5. **Publish** → YouTube (manual or integrate YouTube API)

### Workflow 2: Optimize Content for Search

1. **View Script** → `/script-writer`
2. **Go to SEO** → `/seo-generator`
3. **Generate SEO** → Copy optimized title, description, hashtags
4. **Update Video Ideas** → Add tags and notes from SEO data
5. **Plan Content** → Use SEO data for future scripts

### Workflow 3: Build Content Pipeline

1. **Brainstorm** → `/video-ideas` → Create 10+ ideas
2. **Prioritize** → Filter by priority, organize by status
3. **Script** → Generate scripts for high-priority ideas
4. **Batch Produce** → Generate multiple videos at once
5. **Schedule** → Track progress through production pipeline

## 📚 Detailed Guides

For step-by-step instructions, see **[USER_GUIDE.md](USER_GUIDE.md)**

For technical architecture details, see **[ARCHITECTURE.md](ARCHITECTURE.md)**

For video generation specifics, see **[VIDEO_GENERATION_GUIDE.md](VIDEO_GENERATION_GUIDE.md)**

## 🔍 Database Schema

The application uses SQLite with Prisma ORM. Key models:

- **User** - User account and settings
- **VideoIdea** - Video concepts and planning
- **Script** - Video scripts with multiple sections
- **SEOData** - Optimized titles, descriptions, scores
- **Prompt** - Reusable AI prompts
- **Project** - Content production projects
- **Analytics** - Video performance metrics

Full schema: [prisma/schema.prisma](prisma/schema.prisma)

## 🚨 Troubleshooting

### "npm install fails"
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version: `node --version` (should be 18+)

### "espeak-ng: command not found"
```bash
# Ubuntu/Debian
sudo apt-get install espeak-ng

# macOS
brew install espeak-ng
```

### "ffmpeg: command not found"
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg
```

### "API key not working"
1. Verify key is copied exactly (check for spaces)
2. Check key is from console.anthropic.com
3. Restart dev server after adding key
4. Test in `/settings` page

### "Video generation fails"
1. Ensure espeak-ng and ffmpeg are installed
2. Check `/public/voiceover` directory exists and is writable
3. Check disk space (at least 1GB free)
4. Review browser console for errors

### "Database locked" error
1. Close other instances of the app
2. Delete `prisma/dev.db`
3. Run `npm run db:setup`

### "Build fails with TypeScript errors"
1. Check that all files are saved
2. Run `npm run build` again
3. Clear Next.js cache: `rm -rf .next`

## 📞 Support & Resources

### Documentation
- [USER_GUIDE.md](USER_GUIDE.md) - Step-by-step feature guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture details
- [VIDEO_GENERATION_GUIDE.md](VIDEO_GENERATION_GUIDE.md) - Video production guide

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Remotion Documentation](https://remotion.dev/docs)
- [Prisma ORM Guide](https://www.prisma.io/docs)
- [Anthropic Claude API](https://console.anthropic.com/docs/api)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Technology Docs
- [espeak-ng Manual](http://espeak.sourceforge.net/)
- [FFmpeg Wiki](https://trac.ffmpeg.org/wiki)
- [React 18 Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🤝 Contributing

Contributions are welcome! Please:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request with clear description

## 📄 License

This project is provided as-is for personal use.

## 🎬 About

Built for creators who want to produce quality video content efficiently. This application combines AI-powered content generation with professional video production tools to streamline your YouTube workflow.

**Created for:** [@juldamariealison78](https://www.youtube.com/@juldamariealison78)

---

**Ready to get started?** See [USER_GUIDE.md](USER_GUIDE.md) for step-by-step instructions!
