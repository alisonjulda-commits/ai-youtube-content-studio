# YouTube Content Studio - Architecture

Technical documentation covering project structure, database schema, APIs, and system design.

**Table of Contents**
- [System Overview](#system-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Architecture](#api-architecture)
- [Data Flow](#data-flow)
- [Component Architecture](#component-architecture)
- [Video Generation Pipeline](#video-generation-pipeline)
- [Deployment](#deployment)
- [Performance Considerations](#performance-considerations)

---

## System Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Web Browser (User Interface)                 │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP(S)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│          Next.js 14 Application (Server-Side Rendering)         │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (React 18 + TypeScript)                               │
│  ├── Pages (/app)                                               │
│  ├── Components (UI + Layout)                                   │
│  └── Hooks & State Management                                   │
├─────────────────────────────────────────────────────────────────┤
│  Backend (API Routes)                                           │
│  ├── /api/videos - CRUD video ideas                            │
│  ├── /api/scripts - CRUD scripts                               │
│  ├── /api/scripts/generate - AI script generation              │
│  ├── /api/seo/generate - SEO optimization                      │
│  ├── /api/videos/generate - Video generation                   │
│  └── /api/prompts - CRUD prompts                               │
├─────────────────────────────────────────────────────────────────┤
│  Services                                                       │
│  ├── Anthropic SDK (Claude API)                                │
│  ├── TTS Generator (espeak-ng)                                 │
│  ├── Music Generator (FFmpeg)                                  │
│  ├── Remotion (Video Rendering)                                │
│  └── File System (Voiceovers, Music, Videos)                  │
└────────────┬─────────────────────────┬──────────────────────────┘
             │                         │
    ┌────────▼────────┐    ┌──────────▼────────┐
    │  SQLite Database │    │  File Storage     │
    │  (Prisma ORM)   │    │  (/public)        │
    │                 │    │                   │
    │ • VideoIdea     │    │ • /voiceover/     │
    │ • Script        │    │ • /music/         │
    │ • SEOData       │    │ • /videos/        │
    │ • Prompt        │    └───────────────────┘
    │ • User          │
    │ • Settings      │
    │ • Analytics     │
    └─────────────────┘
```

### Key Design Principles

1. **Separation of Concerns**
   - Frontend (UI/UX) separated from backend (API)
   - Business logic in API routes
   - Data access through Prisma ORM

2. **Type Safety**
   - Full TypeScript coverage
   - Zod validation for all inputs
   - Type exports from Prisma schema

3. **Scalability**
   - Stateless API (easy to scale horizontally)
   - Database-centric architecture
   - File-based video storage

4. **User Experience**
   - Responsive design (mobile-first)
   - Real-time UI updates
   - Error handling with user-friendly messages

---

## Technology Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2+ | Full-stack web framework (React + Node.js) |
| React | 18.3+ | UI library |
| TypeScript | 5.4+ | Type safety |
| Node.js | 18+ | Runtime environment |

### Frontend Libraries

| Library | Purpose |
|---------|---------|
| Tailwind CSS 3.4+ | Utility-first CSS styling |
| next-themes | Dark/light theme support |
| Framer Motion | Animation library |
| Lucide Icons | Icon library |
| Recharts | Data visualization (future) |
| react-hook-form | Form state management |
| Zod | Schema validation |

### Backend & Database

| Technology | Purpose |
|------------|---------|
| Prisma 5.15+ | ORM for database access |
| SQLite | Embedded database |
| @anthropic-ai/sdk | Claude API integration |

### Video & Audio

| Technology | Purpose |
|-----------|---------|
| Remotion 4.0+ | Video composition & rendering |
| FFmpeg | Audio/video processing |
| espeak-ng | Text-to-speech synthesis |
| ffprobe | Media information extraction |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting (via ESLint) |
| Git | Version control |

---

## Project Structure

```
karauna-guesthouse.index.html/
│
├── src/                          # Application source code
│   ├── app/                      # Next.js app directory
│   │   ├── (dashboard)/          # Dashboard group routes
│   │   │   ├── video-ideas/page.tsx
│   │   │   ├── script-writer/page.tsx
│   │   │   ├── video-generator/page.tsx
│   │   │   ├── seo-generator/page.tsx
│   │   │   ├── prompt-library/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── layout.tsx        # Dashboard layout with sidebar
│   │   ├── api/                  # API routes
│   │   │   ├── videos/
│   │   │   │   ├── route.ts      # GET /api/videos, POST /api/videos
│   │   │   │   ├── [id]/route.ts # GET/PATCH/DELETE /api/videos/[id]
│   │   │   │   └── generate/route.ts # POST /api/videos/generate
│   │   │   ├── scripts/
│   │   │   │   ├── route.ts      # GET /api/scripts, POST /api/scripts
│   │   │   │   ├── [id]/route.ts # GET/PATCH/DELETE /api/scripts/[id]
│   │   │   │   └── generate/route.ts # POST /api/scripts/generate
│   │   │   ├── seo/
│   │   │   │   └── generate/route.ts # POST /api/seo/generate
│   │   │   ├── prompts/
│   │   │   │   ├── route.ts      # GET /api/prompts, POST /api/prompts
│   │   │   │   └── [id]/route.ts # PATCH/DELETE /api/prompts/[id]
│   │   │   └── videos/
│   │   │       └── generate/route.ts # Video generation
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   │
│   ├── components/               # React components
│   │   ├── layout/
│   │   │   ├── sidebar.tsx       # Navigation sidebar
│   │   │   └── header.tsx        # Top header bar
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── empty-state.tsx
│   │   └── providers.tsx         # Theme + Toast providers
│   │
│   ├── lib/                      # Utility libraries
│   │   ├── db.ts                 # Prisma client singleton
│   │   ├── anthropic.ts          # Claude API wrapper functions
│   │   ├── tts.ts                # Text-to-speech generation
│   │   ├── music.ts              # Background music generation
│   │   ├── utils.ts              # Utility functions
│   │   ├── validations.ts        # Zod validation schemas
│   │   └── constants.ts          # App constants (categories, etc.)
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts              # Interfaces for all models
│   │
│   └── globals.css               # Global CSS & Tailwind setup
│
├── remotion/                      # Video rendering compositions
│   ├── Root.tsx                  # Remotion entry point
│   └── compositions/
│       └── BiblicalSelfCareVideo.tsx # Main video composition
│
├── prisma/                        # Database setup
│   ├── schema.prisma             # Database schema definition
│   ├── migrations/               # Database migrations
│   └── dev.db                    # SQLite database file
│
├── public/                        # Static files
│   ├── voiceover/                # Generated TTS files
│   ├── music/                    # Generated background music
│   └── videos/                   # Rendered video output
│
├── .env.local                    # Environment variables (secrets)
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── remotion.config.ts            # Remotion configuration
├── package.json                  # Dependencies & scripts
├── README.md                     # Getting started guide
├── USER_GUIDE.md                 # Feature guide for users
├── ARCHITECTURE.md               # This file
└── VIDEO_GENERATION_GUIDE.md     # Video generation specifics
```

### File Organization Rationale

**app/**: Next.js App Router structure
- Routes automatically based on file structure
- `/api` directory = API endpoints
- Nested folders = URL segments
- `layout.tsx` = Layout component for route

**components/**: Modular, reusable components
- `ui/` = Base UI components (buttons, inputs, etc.)
- `layout/` = Application layout (sidebar, header)
- Each component file = single component

**lib/**: Business logic and utilities
- Not React components
- Can be imported in any component or API route
- Organized by feature/purpose

**types/**: TypeScript interfaces
- Centralized type definitions
- Matches database models
- Used across app for type safety

**prisma/**: Database configuration
- Schema = database structure
- Migrations = version control for schema
- dev.db = SQLite database file

**public/**: Static and generated files
- Served directly by Next.js
- Video/audio files generated here
- User can download from `/public/videos`

---

## Database Schema

### Models Overview

```
User
├── VideoIdea (many)
├── Script (many)
├── Project (many)
├── Prompt (many)
├── Settings (one)
└── Analytics (many)

Script
├── SEOData (one)
└── VideoIdea (optional)

VideoIdea
└── Scripts (many)
```

### Detailed Schema

#### User
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  videoIdeas VideoIdea[]
  scripts    Script[]
  projects   Project[]
  prompts    Prompt[]
  analytics  Analytics[]
  settings   Settings?
}
```

Stores user account information. Currently one default user per instance.

#### VideoIdea
```prisma
model VideoIdea {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  title       String        // Video title/concept
  description String?       // Detailed description
  category    String        // Tutorial, Vlog, etc.
  priority    String        // low, medium, high
  difficulty  String        // easy, medium, hard
  status      String        // idea, planning, scripting, recording, editing, published
  tags        String?       // Comma-separated tags
  notes       String?       // Additional notes
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  scripts     Script[]
}
```

Represents a video concept being planned or produced.

**Indexes:**
- `userId` - For listing user's videos
- Composite for filtering by userId+status

#### Script
```prisma
model Script {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId])
  videoIdeaId   String?
  videoIdea     VideoIdea? @relation(fields: [videoIdeaId])
  title         String
  hook          String?  // 10-15 second opener
  intro         String?  // Introduction
  body          String?  // Main content
  examples      String?  // Real-world examples
  cta           String?  // Call-to-action
  outro         String?  // Closing remarks
  tone          String   // informative, entertaining, etc.
  wordCount     Int      // Auto-calculated
  readingTime   Int      // Auto-calculated (minutes)
  speakingTime  Int      // Auto-calculated (minutes)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  seoData       SEOData?
}
```

Stores video script with 6 sections and metadata.

**Why 6 sections?**
- Hook (0-15s): Grab attention
- Intro (15-30s): Introduce topic
- Body (main): Teaching/information
- Examples: Real-world application
- CTA (end): Call-to-action
- Outro (end): Closing

#### SEOData
```prisma
model SEOData {
  id            String   @id @default(cuid())
  scriptId      String   @unique
  script        Script   @relation(fields: [scriptId])
  title         String        // Optimized title
  description   String        // Optimized description
  keywords      String        // Comma-separated keywords
  hashtags      String        // Space or comma-separated
  ctrScore      Int           // 0-100 (clickability)
  seoScore      Int           // 0-100 (search optimization)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

Stores SEO-optimized metadata for a script.

**Scores explained:**
- ctrScore: Does the title make people want to click?
- seoScore: Does YouTube understand the content?

#### Prompt
```prisma
model Prompt {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId])
  title     String   // Prompt name
  content   String   // Prompt template
  category  String   // Script Writing, SEO, etc.
  isFavorite Boolean @default(false)
  usageCount Int    @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Stores reusable AI prompts for content generation.

#### Project
```prisma
model Project {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId])
  title       String        // Project name
  description String?       // Project details
  status      String        // planning, in-progress, review, completed
  dueDate     DateTime?     // Due date
  checklistItems String?    // JSON array of checklist items
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Tracks production projects and workflows.

#### Settings
```prisma
model Settings {
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId])
  channelName       String?  // YouTube channel name
  channelDescription String? // Channel tagline
  anthropicApiKey   String?  // Claude API key
  openaiApiKey      String?  // OpenAI API key
  brandPrimaryColor String   @default("#6366f1")
  brandSecondaryColor String  @default("#ec4899")
  theme             String   @default("system")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

Stores user configuration and preferences.

#### Analytics
```prisma
model Analytics {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId])
  videoTitle      String   // Video being tracked
  views           Int      @default(0)
  likes           Int      @default(0)
  comments        Int      @default(0)
  shares          Int      @default(0)
  watchTime       Int      @default(0)  // in minutes
  ctr             Float    @default(0)  // click-through rate
  engagementRate  Float    @default(0)  // percentage
  date            DateTime // Date of measurement
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

Stores video performance metrics (future feature).

### Database Queries

**Common queries used:**

```sql
-- Get all video ideas for user
SELECT * FROM VideoIdea WHERE userId = ?

-- Get scripts for user with SEO data
SELECT s.*, so.* FROM Script s
LEFT JOIN SEOData so ON s.id = so.scriptId
WHERE s.userId = ?

-- Filter ideas by status
SELECT * FROM VideoIdea 
WHERE userId = ? AND status = 'planning'

-- Search ideas
SELECT * FROM VideoIdea 
WHERE userId = ? AND title LIKE '%keyword%'
ORDER BY createdAt DESC

-- Count scripts by category (in code)
SELECT COUNT(*) FROM Script s
JOIN VideoIdea v ON s.videoIdeaId = v.id
WHERE s.userId = ? GROUP BY v.category
```

---

## API Architecture

### Request/Response Pattern

All API endpoints follow REST conventions:

```
Request:
  Method: GET/POST/PATCH/DELETE
  URL: /api/[resource]/[id?]
  Headers: 
    Content-Type: application/json
    x-user-id: default-user
  Body: JSON (POST/PATCH only)

Response:
  Status: 200/201/400/404/500
  Body: JSON
    Success: { data: {...} }
    Error: { error: "message" }
```

### Video Ideas API

**GET /api/videos**
- List all video ideas
- Query params: `category`, `status`
- Returns: Array of VideoIdea objects
- Pagination: None (full list returned)

```typescript
// Request
GET /api/videos?category=Tutorial&status=planning

// Response
[
  {
    id: "cuid-123",
    title: "How to Start a Blog",
    description: "...",
    category: "Tutorial",
    priority: "high",
    difficulty: "medium",
    status: "planning",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }
]
```

**POST /api/videos**
- Create new video idea
- Body: VideoIdea fields (except id, createdAt, updatedAt)
- Returns: Created VideoIdea object

```typescript
// Request
POST /api/videos
{
  title: "How to Start a Blog",
  description: "Complete beginner's guide",
  category: "Tutorial",
  priority: "high",
  difficulty: "medium",
  status: "idea"
}

// Response
{
  id: "cuid-123",
  title: "How to Start a Blog",
  // ... other fields
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

**GET /api/videos/[id]**
- Get single video idea
- Returns: VideoIdea object or 404

**PATCH /api/videos/[id]**
- Update video idea
- Body: Partial VideoIdea fields
- Returns: Updated VideoIdea object

**DELETE /api/videos/[id]**
- Delete video idea
- Returns: { success: true }

### Scripts API

**GET /api/scripts**
- List all scripts
- Returns: Array of Script objects (with seoData)

**POST /api/scripts**
- Create new script
- Body: Script fields
- Calculates: wordCount, readingTime, speakingTime
- Returns: Created Script object

**POST /api/scripts/generate**
- Generate script with Claude AI
- Body: { topic, targetAudience, duration, tone }
- Returns: Generated Script object

```typescript
// Request
POST /api/scripts/generate
{
  topic: "Starting a blog",
  targetAudience: "Beginners",
  duration: 5,
  tone: "informative"
}

// Response (AI-generated)
{
  id: "cuid-456",
  title: "Starting a blog Script",
  hook: "Have you always wanted to start a blog?",
  intro: "Welcome to this guide on starting a blog...",
  body: "First, choose your platform...",
  // ... etc
  wordCount: 2145,
  readingTime: 11,
  speakingTime: 15
}
```

**GET/PATCH/DELETE /api/scripts/[id]**
- Get, update, or delete single script

### SEO API

**POST /api/seo/generate**
- Generate SEO data for content
- Body: { title, description, keywords, scriptId? }
- Returns: SEO data with scores

```typescript
// Request
POST /api/seo/generate
{
  title: "How to Start a Blog",
  description: "Complete guide for beginners...",
  keywords: "blog,writing,tutorial",
  scriptId: "cuid-456" // optional
}

// Response
{
  titles: [
    "How to Start Your First Blog: A Beginner's Guide",
    "Start a Blog in 2024: Step-by-Step Tutorial",
    // ... 3 more
  ],
  descriptions: [
    "Learn how to start a blog in 2024...",
    // ... 2 more
  ],
  hashtags: ["#blogging", "#writing", ...],
  ctrScore: 82,
  seoScore: 78
}
```

### Prompts API

**GET /api/prompts**
- List all prompts
- Query: `category` (filter by category)
- Returns: Array of Prompt objects

**POST /api/prompts**
- Create new prompt
- Body: { title, content, category }
- Returns: Created Prompt object

**PATCH /api/prompts/[id]**
- Update prompt
- Body: Partial Prompt fields
- Returns: Updated Prompt object

**DELETE /api/prompts/[id]**
- Delete prompt
- Returns: { success: true }

### Video Generation API

**POST /api/videos/generate**
- Generate video from script
- Body: { scriptId, title, sections[] }
- Process:
  1. Generate TTS for each section
  2. Create background music
  3. Compose video with Remotion
  4. Calculate frame timing
- Returns: Video generation metadata

```typescript
// Request
POST /api/videos/generate
{
  scriptId: "cuid-456",
  title: "How to Start a Blog",
  sections: [
    { id: "hook", text: "Have you wanted to start a blog?" },
    { id: "body", text: "The first step is choosing a platform..." }
  ]
}

// Response
{
  videoId: "cuid-789",
  scriptId: "cuid-456",
  voiceoverUrls: {
    hook: "/voiceover/cuid-456/hook.mp3",
    body: "/voiceover/cuid-456/body.mp3"
  },
  frameTiming: {
    hook: { from: 0, durationInFrames: 69 },
    body: { from: 77, durationInFrames: 450 }
  },
  totalFrames: 1800,
  totalSeconds: 60,
  composition: {
    id: "BiblicalSelfCare",
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 1800
  }
}
```

### Error Handling

All API endpoints return errors in this format:

```json
{
  "error": "Descriptive error message"
}
```

**Common status codes:**
- 200: OK
- 201: Created
- 400: Bad Request (validation error)
- 404: Not Found
- 500: Server Error

**Example error response:**
```json
HTTP/1.1 400 Bad Request
{
  "error": "Invalid request body"
}
```

---

## Data Flow

### Creating a Complete Video

```
1. User creates Video Idea
   └─> POST /api/videos
   └─> Store in database
   └─> Display in Video Ideas list

2. User generates Script
   └─> POST /api/scripts/generate
   └─> Send topic to Claude API
   └─> Receive generated script
   └─> Calculate: wordCount, readingTime, speakingTime
   └─> Store in database
   └─> Display in Script Writer

3. User optimizes with SEO
   └─> POST /api/seo/generate
   └─> Send title/description to Claude API
   └─> Receive titles, descriptions, hashtags, scores
   └─> Display in SEO Generator

4. User generates video
   └─> POST /api/videos/generate
   └─> Extract script sections
   └─> For each section:
        ├─> Generate TTS voiceover (espeak-ng + FFmpeg)
        ├─> Save to /public/voiceover/[scriptId]/
        └─> Calculate duration
   └─> Generate background music
        ├─> Synthesize lo-fi instrumental (FFmpeg)
        └─> Save to /public/music/
   └─> Compose video with Remotion
        ├─> Create video component
        ├─> Add audio tracks
        └─> Render to MP4
   └─> Return voiceover URLs and timing
   └─> Display in Video Generator (ready to download)

5. User downloads video
   └─> Click Download button
   └─> Browser downloads MP4 from /public/videos/
   └─> Video ready for YouTube upload
```

### Frontend State Management

Each page manages its own state:

```typescript
// Example: Video Ideas page
const [ideas, setIdeas] = useState<VideoIdea[]>([])
const [filteredIdeas, setFilteredIdeas] = useState<VideoIdea[]>([])
const [isLoading, setIsLoading] = useState(false)
const [searchTerm, setSearchTerm] = useState('')
const [categoryFilter, setCategoryFilter] = useState('')

// On mount: fetch ideas
useEffect(() => {
  fetchIdeas()
}, [])

// When filters change: update display
useEffect(() => {
  filterIdeas()
}, [ideas, searchTerm, categoryFilter])

// Handle creation
async function handleSubmit(data) {
  const response = await fetch('/api/videos', { method: 'POST', body })
  const newIdea = await response.json()
  setIdeas([newIdea, ...ideas])
}
```

**State pattern:**
1. Fetch data on component mount
2. Update state when data changes
3. Re-filter/re-render when state changes
4. Send updates to API
5. Optimistically update UI (or refetch)

---

## Component Architecture

### UI Component Pattern

All UI components follow shadcn/ui conventions:

```typescript
// src/components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        // ... more variants
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
)
```

**Benefits:**
- Consistent styling
- Type-safe variants
- Easy to extend
- Works with Tailwind

### Page Components

Each page follows this pattern:

```typescript
'use client'  // Client component (hooks needed)

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function PageName() {
  const [data, setData] = useState<Type[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setIsLoading(true)
    try {
      const response = await fetch('/api/endpoint')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page content */}
    </div>
  )
}
```

---

## Video Generation Pipeline

### Architecture

```
Script → Sections
   ↓
   ├─> TTS Generation (espeak-ng)
   │     ├─> Generate raw audio
   │     └─> Process with FFmpeg
   │        └─> Audio enhancement
   │           ├─> Highpass filter
   │           ├─> Treble boost
   │           ├─> Compression
   │           └─> Normalization
   ├─> Music Generation (FFmpeg)
   │     └─> Synthesize instrumental
   │           ├─> Bass pad
   │           ├─> Mid warmth
   │           └─> High shimmer
   └─> Video Composition (Remotion)
         ├─> Create video component
         ├─> Add audio tracks
         ├─> Compose animations
         └─> Render to MP4
              └─> Save to /public/videos/
```

### TTS Generation (src/lib/tts.ts)

```typescript
export async function generateVoiceover(
  text: string,           // Text to convert
  outputPath: string,     // Where to save MP3
  voiceConfig?: VoiceConfig
): Promise<{ path: string; duration: number }> {
  // 1. Generate raw WAV with espeak-ng
  await execAsync(`espeak-ng -v "${voice}" -s ${speed} -p ${pitch} -w "${raw}" "${text}"`)

  // 2. Process with FFmpeg audio filters
  await execAsync(`ffmpeg ... -af "highpass, treble, compression, ..." "${outputPath}"`)

  // 3. Get and return duration
  const duration = await getVoiceoverDuration(outputPath)
  return { path: outputPath, duration }
}
```

**Voice Configuration:**
```typescript
interface VoiceConfig {
  voice: string    // espeak-ng voice (e.g., 'en-us+f1')
  speed: number    // 50-200 (default 150)
  pitch: number    // 0-100 (default 50)
}
```

### Music Generation (src/lib/music.ts)

```typescript
export async function generateBackgroundMusic(
  durationSeconds: number,
  outputPath: string
): Promise<{ path: string; duration: number }> {
  // Create 4 sine wave layers:
  // - Bass (55Hz, 30% volume)
  // - Mid 1 (110Hz, 30% volume)
  // - Mid 2 (165Hz, 20% volume)
  // - High (440Hz, 20% volume)

  // Apply filters:
  // - Lowpass on bass
  // - EQ on mid
  // - Highpass + treble on high

  // Mix and normalize
  // Add fade in/out
  return { path: outputPath, duration: durationSeconds }
}
```

### Video Composition (remotion/)

**BiblicalSelfCareVideo Component:**
```typescript
interface BiblicalSelfCareVideoProps {
  title: string
  hook: string
  scriptSections: ScriptSection[]
  musicUrl: string
  voiceoverUrls: Record<string, string>
}

export const BiblicalSelfCareVideo: React.FC<Props> = ({
  title,
  hook,
  scriptSections,
  musicUrl,
  voiceoverUrls,
}) => {
  const { fps, durationInFrames } = useVideoConfig()

  return (
    <AbsoluteFill>
      {/* Background gradient */}
      {/* Title with animations */}
      {/* Script sections with fade transitions */}
      {/* Audio tracks (music + voiceovers) */}
    </AbsoluteFill>
  )
}
```

**Rendering:**
```typescript
// Using Remotion CLI
npx remotion render BiblicalSelfCare output.mp4 \
  --props '{"title":"...","scriptSections":[...]}'
```

---

## Deployment

### Development Environment

```bash
npm run dev      # Starts dev server on localhost:3000
```

### Production Build

```bash
npm run build    # Creates optimized build in .next/
npm start        # Runs production server
```

### Environment Setup

**.env.local** (local development):
```env
DATABASE_URL="file:./prisma/dev.db"
ANTHROPIC_API_KEY="sk-ant-..."
```

**.env.production** (production):
```env
DATABASE_URL="your-production-db-url"
ANTHROPIC_API_KEY="sk-ant-..."
```

### Database Migration

```bash
# On new deployment
npx prisma migrate deploy  # Applies all migrations
npx prisma db seed        # Seeds initial data (if seed.ts exists)
```

### System Dependencies

Must be installed on deployment server:

```bash
# Ubuntu/Debian
apt-get install espeak-ng ffmpeg

# macOS
brew install espeak-ng ffmpeg
```

### Scaling Considerations

**Currently optimized for:**
- Single user/instance
- Local SQLite database
- File-based video storage

**To scale to multiple users:**
1. Add authentication system
2. Migrate to PostgreSQL/MySQL
3. Move video storage to S3/cloud storage
4. Add job queue for video generation (Bull, BullMQ)
5. Implement caching layer (Redis)
6. Add CDN for video delivery

---

## Performance Considerations

### Frontend Optimization

1. **Code Splitting**
   - Next.js automatically splits at page level
   - Each page loads only needed code

2. **Image Optimization**
   - Use Next.js Image component (not available for PDF)
   - Automatic WebP conversion
   - Lazy loading

3. **Styling**
   - Tailwind CSS purging removes unused styles
   - CSS-in-JS minimal (only where needed)

### Backend Optimization

1. **Database**
   - Indexes on frequently queried fields
   - Lazy loading of relationships
   - Connection pooling via Prisma

2. **API Routes**
   - Stateless endpoints (scale horizontally)
   - Input validation before processing
   - Error handling prevents cascading failures

3. **Video Generation**
   - Asynchronous processing
   - Progress tracking
   - File cleanup after generation

### Caching Strategies

1. **Frontend**
   - Browser cache for static assets
   - React component memoization for expensive renders

2. **API**
   - No server-side caching currently
   - Add Redis for frequently accessed data

3. **Video Files**
   - Keep generated files for reuse
   - Archive old files after 30 days

### Monitoring & Debugging

```typescript
// Enable query logging
// src/lib/db.ts
const db = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

// Check API performance
console.time('operation-name')
// ... operation ...
console.timeEnd('operation-name')
```

---

## Security Considerations

### Data Protection

1. **Database**
   - Passwords (if added): use bcrypt
   - API keys: stored in .env (never committed)
   - Sensitive data encrypted at rest

2. **API**
   - HTTPS only in production
   - Rate limiting (future)
   - Input validation with Zod
   - SQL injection protected (Prisma ORM)

### File Handling

1. **Uploads**
   - Validate file types
   - Scan for malware (future)
   - Size limits enforced

2. **Generated Files**
   - Store outside web root initially
   - Serve through authenticated endpoint
   - Auto-cleanup old files

### Environment Variables

Never commit:
```env
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
DATABASE_URL=...
```

Always use `.env.local` and add to `.gitignore`

---

## Troubleshooting Performance

### Slow API Responses

1. Check database query performance
   ```bash
   npx prisma studio  # Inspect database
   ```

2. Check API route execution
   ```typescript
   console.time('api-call')
   // ... code ...
   console.timeEnd('api-call')
   ```

3. Monitor system resources
   ```bash
   top  # CPU/memory usage
   df   # Disk usage
   ```

### Slow Video Generation

1. Check TTS generation speed
2. Verify FFmpeg installation and version
3. Monitor disk I/O during generation
4. Check system memory (may need paging)

### High Memory Usage

1. Close background applications
2. Reduce concurrent video generations
3. Clear temporary files regularly
   ```bash
   rm -rf /tmp/remotion-*
   rm -rf ./public/voiceover/*
   ```

---

## Future Architecture Enhancements

1. **Authentication**
   - NextAuth.js for user management
   - OAuth (Google, GitHub)
   - Session management

2. **Database**
   - PostgreSQL for production
   - Read replicas for scaling
   - Connection pooling

3. **Video Generation**
   - Job queue (Bull, BullMQ)
   - WebSocket for progress updates
   - Batch processing

4. **Storage**
   - AWS S3 or similar
   - CDN integration
   - Automatic cleanup policies

5. **Analytics**
   - Video performance tracking
   - User engagement metrics
   - Content recommendations

6. **Features**
   - Collaboration (team accounts)
   - Template library
   - Advanced editing interface
   - YouTube API integration

---

**Need help?** See [README.md](README.md) for support resources.
