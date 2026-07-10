# YouTube Content Studio - User Guide

Complete step-by-step guide for using every feature of the application.

**Table of Contents**
- [Getting Started](#getting-started)
- [Video Ideas](#video-ideas)
- [Script Writer](#script-writer)
- [Video Generator](#video-generator)
- [SEO Generator](#seo-generator)
- [Prompt Library](#prompt-library)
- [Settings](#settings)
- [Common Tasks](#common-tasks)
- [Tips & Tricks](#tips--tricks)

---

## Getting Started

### First Time Setup (5 minutes)

1. **Start the application**
   - Run `npm run dev`
   - Open http://localhost:3000
   - You should see the home page with "Get Started" button

2. **Configure your API key**
   - Click "Get Started" or navigate to `/settings`
   - Scroll to "API Keys" section
   - Paste your Anthropic API key from console.anthropic.com
   - Save settings
   - Refresh the page

3. **Explore the dashboard**
   - Click "Get Started" to go to Video Ideas
   - You'll see the main navigation sidebar
   - All sections are now available

### Navigation

The sidebar (left side) has 6 main sections:

```
📍 Video Ideas       → Create and organize video concepts
✍️  Script Writer     → Write and manage scripts
🎬 Video Generator   → Create videos with voiceovers
🔍 SEO Generator     → Optimize for YouTube search
📚 Prompt Library    → Save and reuse prompts
⚙️  Settings         → Configure your workspace
```

On mobile, tap the ☰ (menu) button in the top-left to open the sidebar.

---

## Video Ideas

**Location:** Click "Video Ideas" in sidebar or visit `/video-ideas`

### What is Video Ideas?

The Video Ideas section is your content brainstorming and planning hub. It's where you:
- Brainstorm video concepts
- Organize ideas by category
- Track production status
- Prioritize content

### Creating a Video Idea (2 minutes)

1. **Click "New Idea" button** (blue button with + icon, top-right)

2. **Fill in the form:**
   - **Title** (required): "How to Start a Meditation Practice"
   - **Description** (optional): "A beginner's guide to meditation benefits and techniques"
   - **Category** (required): Choose from 19 categories like Tutorial, Vlog, Educational, etc.
   - **Priority**: Low / Medium / High
   - **Difficulty**: Easy / Medium / Hard
   - **Status**: Idea, Planning, Scripting, Recording, Editing, Published

3. **Click "Create Idea"**

The idea now appears in your ideas grid.

### Viewing Your Ideas

All created ideas appear as cards in a grid format. Each card shows:
- Title
- Description (first 2 lines)
- Category badge
- Status badge (colored)
- Edit and Delete buttons

### Filtering Ideas

**By Category:**
- Use the dropdown menu at the top labeled "All Categories"
- Select a category to see only ideas in that category
- Select "All Categories" to see everything

**By Search:**
- Use the search box at the top
- Type to search by title or description
- Search is real-time (instant results)

**Combine both:**
- Search for "meditation" in category "Tutorial"
- Results update instantly

### Editing an Idea

1. Click "Edit" button on any idea card
2. Form opens in a modal
3. Change any field
4. Click "Save" (shown as form submit button)

Note: Edit functionality is prepared in the modal component.

### Deleting an Idea

1. Click the red trash icon on any idea card
2. Idea is deleted immediately
3. No confirmation dialog (be careful!)

### Best Practices

- **Create in batches**: Generate 10-20 ideas at once during brainstorming sessions
- **Use priority wisely**: Mark high-priority ideas you want to produce soon
- **Track status**: Update status as you move ideas through production
- **Organize by category**: Create ideas by content pillar (e.g., "How-to", "Motivation", "Stories")
- **Use description**: Add enough detail to remember the idea later

### Status Meanings

| Status | Meaning |
|--------|---------|
| **Idea** | Just a concept, not ready for production |
| **Planning** | Researching and planning the content |
| **Scripting** | Writing the script |
| **Recording** | Filming or recording voiceover |
| **Editing** | Post-production and editing |
| **Published** | Live on YouTube |

---

## Script Writer

**Location:** Click "Script Writer" in sidebar or visit `/script-writer`

### What is Script Writer?

The Script Writer helps you:
- Generate professional scripts with AI
- Write scripts manually
- Manage multiple scripts
- Track script statistics

### Generating a Script with AI (3 minutes)

1. **Click "Generate with AI"** button (purple button with wand icon, top-right)

2. **Fill in the generation form:**
   - **Script Title** (required): "Meditation for Beginners"
   - **Topic** (required): "How to start a meditation practice for stress relief"
   - **Target Audience**: "Busy professionals and students"
   - **Duration (minutes)**: "8" (estimated final video length)
   - **Tone**: Select from:
     - Informative (facts and education)
     - Entertaining (humor and engagement)
     - Professional (corporate style)
     - Casual (friend-like, relaxed)
     - Motivational (inspirational)

3. **Click "Generate Script"**

Wait 10-30 seconds for AI to write the script. A new script appears in the left panel.

### Script Structure

Generated scripts have 6 sections:

| Section | Purpose | Example |
|---------|---------|---------|
| **Hook** | First 10-15 seconds, grab attention | "I used to stress about everything until..." |
| **Intro** | Introduce topic and yourself | "Welcome! I'm here to teach you..." |
| **Body** | Main content and teaching | "The first step is to find a quiet place..." |
| **Examples** | Real-world examples | "For instance, when I meditate..." |
| **CTA** | Call-to-action | "Subscribe for more wellness tips!" |
| **Outro** | Closing remarks | "Thanks for watching! See you next time!" |

### Editing a Script

1. **Select a script** from the left panel (click it)

2. **Edit sections:**
   - Click in any text area
   - Type to edit
   - Changes are saved instantly as you type

3. **View statistics** (displayed in the top-right):
   - Word count (total words in script)
   - Reading time (how long to read aloud)
   - Speaking time (estimated video duration)

### Copying a Script

1. Select a script from the left panel
2. Click "Copy" button (with clipboard icon)
3. Script is copied to your clipboard
4. Paste into Google Docs, Notes, or anywhere else

### Creating Multiple Versions

1. Generate a script with AI
2. Click "Copy" to save the original
3. Edit the script to create a variation
4. Save your changes
5. Generate another script from AI
6. Now you have multiple versions to choose from

### Best Practices

- **Use varied tones**: Generate the same topic with different tones, pick the best
- **Edit AI output**: AI-generated scripts are good starting points, personalize them
- **Match your voice**: Adjust language to match your speaking style
- **Test reading times**: Speak it aloud to verify timing is correct
- **Keep sections balanced**: Aim for roughly equal length in each section
- **Make it memorable**: Add your personal stories and examples

### Script Statistics Explained

- **Word Count**: Total words (average: 1500-2500 for 8-10 min video)
- **Reading Time**: Time to read at normal pace (200 words/minute)
- **Speaking Time**: Time speaking on camera (150 words/minute, more natural pacing)

---

## Video Generator

**Location:** Click "Video Generator" in sidebar or visit `/video-generator`

### Prerequisites

Before generating videos, ensure you have installed:
- espeak-ng (TTS engine)
- FFmpeg (audio/video processing)
- ffprobe (media information)

See README.md for installation instructions.

### What is Video Generator?

Video Generator creates complete videos from scripts:
- Generates TTS voiceover (text-to-speech)
- Creates background music
- Renders video composition
- Produces downloadable MP4

### Generating Your First Video (5 minutes)

1. **Select a script:**
   - Dropdown labeled "Select Script"
   - Click it to see list of scripts
   - Choose a script

2. **Review script statistics:**
   - Word count, reading time, speaking time shown below script selector
   - Longer scripts = longer videos

3. **Click "Generate Video"**

The system will:
- Extract script sections
- Generate TTS voiceover for each section (~2 seconds per 10 words)
- Create background music (synthesized instrumental)
- Compose video (1080x1920 vertical format)
- Calculate frame timing

### Generation Process

**Status indicators:**

| Status | Meaning |
|--------|---------|
| ⏳ Generating X% | Creating voiceovers and music |
| ✓ Ready | Complete, ready to download/preview |
| ✗ Error | Failed, check console for details |

**Timeline:**
- Small script (1000 words): ~2-3 minutes
- Medium script (2000 words): ~5-7 minutes
- Large script (3000+ words): ~10+ minutes

### Managing Generation Jobs

All generated videos appear in the "Generation Jobs" section.

For each completed video, you can:
- **Preview** - Watch the video in browser (opens in player)
- **Download** - Download MP4 file to computer

### Troubleshooting Generation

**"Generating... stuck at 0%"**
- Check browser console (F12) for errors
- Ensure espeak-ng and FFmpeg are installed
- Check disk space (need ~500MB free)

**"Audio quality is poor"**
- TTS voice is limited by espeak-ng
- Audio processing adds professional touch
- Listen to sample first

**"Video is too short/long"**
- Duration is based on script content
- Longer script = longer video
- Edit script to adjust length

### Video Specifications

- **Format**: MP4 (H.264 codec)
- **Resolution**: 1080 x 1920 (vertical, YouTube Shorts format)
- **Frame Rate**: 30 fps
- **Audio**: 44.1kHz stereo, 128kbps
- **File Size**: 10-50MB depending on length

### What's In Your Video

1. **Opening Animation** (1 second)
   - Title slide with fade-in

2. **Hook Section** (from script)
   - Attention-grabbing opening

3. **Content Sections** (from script body, examples)
   - Main teaching/information

4. **Call-to-Action** (from script CTA)
   - Subscribe/engagement prompt

5. **Background Audio**
   - Lo-fi hip-hop instrumental (royalty-free)
   - Mixed with voiceover

### Voice Configuration

**Current Voice Settings:**
- Language: English (US)
- Gender: Female
- Speed: 150 (slightly slow for clarity)
- Pitch: 50 (neutral)

This creates a professional Filipina-like voice with perfect English pronunciation.

To customize voice:
1. Edit `src/lib/tts.ts`
2. Change `DEFAULT_VOICE_CONFIG` values
3. Restart dev server
4. Generate new video

### Best Practices

- **Start small**: Generate 1-2 videos to test before batch
- **Backup scripts**: Save scripts before generating
- **Check audio quality**: Listen to generated voiceover first
- **Organize files**: Store MP4s in dedicated folder
- **Test on mobile**: Watch on phone to verify vertical format

---

## SEO Generator

**Location:** Click "SEO Generator" in sidebar or visit `/seo-generator`

### What is SEO Generator?

SEO Generator optimizes your video metadata for YouTube search:
- Generates clickable titles (affects CTR)
- Creates descriptions with keywords
- Suggests relevant hashtags
- Provides SEO and CTR scores

### Generating SEO Data (2 minutes)

1. **Enter content information:**
   - **Video Title**: "How to Start a Meditation Practice for Beginners"
   - **Description**: "Learn meditation basics, benefits, and techniques..."
   - **Keywords**: "meditation,beginner,mindfulness,stress relief,wellness"

2. **Click "Generate Optimization"**

Wait 10-20 seconds for results.

### Understanding SEO Results

**Titles** (5 variations)
- Each 50-60 characters (YouTube optimal length)
- Each includes main keyword
- Each designed for higher CTR (Click-Through Rate)

Example:
- Original: "How to Start a Meditation Practice for Beginners"
- Generated: "Meditation for Beginners: 5-Minute Daily Practice"

**Descriptions** (3 variations)
- Each 155-160 characters (preview length on YouTube)
- Each includes keywords naturally
- Written for search algorithms

**Hashtags** (15+)
- Relevant to your video
- Mix of popular and niche hashtags
- Ready to copy to video description

**Scores:**

| Score | Meaning |
|-------|---------|
| **CTR Score (0-100)** | How clickable your title/thumbnail will be |
| **SEO Score (0-100)** | How well optimized for search |

Aim for both scores above 70.

### Using SEO Results

1. **Copy title** (click the title, then Copy button)
   - Use in YouTube video title
   - Fits in full display

2. **Copy description** (click description, then Copy button)
   - Paste into YouTube description
   - Add timestamps and links below

3. **Copy hashtags** (click the hashtag, Copy button)
   - Add 10-15 hashtags to description
   - Mix popular (#mindfulness) and niche (#meditationforbeginners)

### Best Practices

- **Test multiple keywords**: "meditation" vs "how to meditate" have different results
- **Use all scores**: High CTR + high SEO = maximum views
- **Personalize**: AI results are starting points, edit to match your brand
- **Keep keywords natural**: Don't force keywords if they don't fit
- **Use top 3 titles**: Generate multiple times, pick the 3 best performing titles
- **Monitor what works**: Track which titles get most clicks on YouTube

### CTR vs SEO Explained

**CTR Score** (Click-Through Rate)
- How enticing is your title?
- Does it make people want to click?
- Examples of high-CTR titles:
  - "This 5-Minute Meditation Changed Everything"
  - "Meditation Teachers HATE This Simple Trick"

**SEO Score** (Search Engine Optimization)
- How well does YouTube understand your content?
- Will it rank for relevant searches?
- Factors:
  - Keyword relevance
  - Keyword placement
  - Keyword density (not too much, not too little)

### Improving Scores

**To improve CTR:**
- Use power words: Amazing, Surprising, Secret, Proven
- Ask a question: "How to...", "What is..."
- Add numbers: "5 Ways", "3 Steps"
- Create curiosity: "You Won't Believe What Happened"

**To improve SEO:**
- Use exact keywords in title
- Include keyword in description first sentence
- Use long-tail keywords (4+ words)
- Organize content logically in description

---

## Prompt Library

**Location:** Click "Prompt Library" in sidebar or visit `/prompt-library`

### What is Prompt Library?

Prompt Library saves reusable prompts for faster AI content creation:
- Save templates for common tasks
- Organize by category
- Mark favorites for quick access
- Track usage

### Creating a Prompt (2 minutes)

1. **Click "New Prompt"** button (blue button, top-right)

2. **Fill in the form:**
   - **Title** (required): "YouTube Hook Generator"
   - **Category** (required): Choose from 10+ categories:
     - Script Writing
     - SEO Optimization
     - Thumbnail Design
     - Social Media
     - Audience Engagement
     - Content Ideas
     - Video Hooks
     - Call to Action
     - Storytelling
     - Research

   - **Prompt Content** (required): Enter the prompt text
     ```
     Create an engaging hook for a YouTube video about {topic}.
     The hook should be 15-30 seconds, attention-grabbing, and
     make viewers want to watch more. Include a pattern interrupt
     or surprising statement.
     ```

3. **Click "Create Prompt"**

### Using Placeholders

In your prompt, use curly braces for variables:
- `{topic}` - Video topic
- `{audience}` - Target audience
- `{tone}` - Writing tone
- `{length}` - Content length
- `{format}` - Content format

Example prompt:
```
Write a {length} social media post about {topic}
for {audience} in a {tone} tone. Include a call-to-action.
```

### Managing Prompts

**Search prompts:**
- Use search box at top
- Type keyword to filter

**Filter by category:**
- Dropdown menu "All Categories"
- Select category

**Mark as favorite:**
- Click star icon on prompt
- Star fills in yellow
- Favorites appear first in lists

**Copy prompt:**
- Click copy button
- Prompt text copied to clipboard
- Paste into Claude/ChatGPT

**Delete prompt:**
- Click trash icon
- Prompt is deleted (no undo)

### Built-in Prompts

The app comes with 3 default prompts:
1. **Engaging Hook Generator** - Create video hooks
2. **SEO Title Generator** - Generate YouTube titles
3. **Script Outline** - Create script structure

Modify these or keep as examples.

### Best Practices

- **Create templates**: Make generic prompts that work for multiple topics
- **Use placeholders**: Make prompts reusable with variables
- **Mark favorites**: Star your 5-10 most-used prompts
- **Organize by category**: Group similar prompts together
- **Review monthly**: Delete unused prompts
- **Refine**: Edit prompts based on results

### Prompt Writing Tips

**Good prompt:**
```
Create a 30-second YouTube hook for a video about {topic}
that will appeal to {audience}. The hook should include:
1. A pattern interrupt or surprising statement
2. A benefit or curiosity gap
3. A preview of what's coming
Use a {tone} tone.
```

**Poor prompt:**
```
Write a hook
```

**Make it specific:**
- Include desired length
- Specify format/structure
- Mention key elements
- Set the tone

### Integrating with Claude

1. Copy prompt from library
2. Visit [claude.ai](https://claude.ai)
3. Paste prompt
4. Add specific details (topic, audience, etc.)
5. Get AI-generated result

---

## Settings

**Location:** Click "Settings" in sidebar or visit `/settings`

### Channel Information

Configure your YouTube channel details:

**Channel Name**
- Your YouTube channel name
- Used for reference only

**Channel Description**
- Your channel's tagline
- What your channel is about
- Used for reference

### API Keys

**Anthropic API Key** (required for AI features)
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Create new API key (Claude 3.5 Sonnet)
4. Copy the key
5. Paste in Settings
6. Restart dev server

Key format: `sk-ant-...`

**OpenAI API Key** (optional)
- Future feature for advanced capabilities
- Not currently used

### Branding

**Primary Color**
- Used for buttons, highlights, active states
- Default: Indigo (#6366f1)
- Click color picker to choose

**Secondary Color**
- Used for accents and complementary elements
- Default: Pink (#ec4899)
- Click color picker to choose

### Theme

**Select your preferred theme:**
- **Light** - White background, dark text
- **Dark** - Dark background, light text
- **System** - Follows your computer's setting

Changes apply immediately (no refresh needed).

### Saving Settings

All changes are saved automatically when you change them. No "Save" button needed.

### Best Practices

- **Keep API key secure**: Never share your API key
- **Choose brand colors**: Use colors that match your channel branding
- **Test theme**: Try both light and dark to see which you prefer
- **Update channel info**: Keep details current for reference

---

## Common Tasks

### Task 1: Create a Complete Video from Scratch (15 minutes)

1. **Create Video Idea** (2 min)
   - Go to Video Ideas
   - Click "New Idea"
   - Fill in details
   - Click Create

2. **Generate Script** (5 min)
   - Go to Script Writer
   - Click "Generate with AI"
   - Choose topic, audience, duration, tone
   - Wait for generation
   - Review and edit if needed

3. **Generate Video** (8 min)
   - Go to Video Generator
   - Select script
   - Click Generate Video
   - Wait for completion

4. **Download**
   - Click Download button
   - Save MP4 to computer

### Task 2: Produce 5 Videos This Week

1. **Monday - Brainstorm** (20 min)
   - Create 10 video ideas in bulk
   - Use categories and priorities

2. **Tuesday - Script** (30 min)
   - Generate scripts for top 5 ideas
   - Edit and personalize each one

3. **Wednesday-Thursday - Generate** (run overnight)
   - Generate all 5 videos
   - Leave computer running

4. **Friday - Organize**
   - Download all videos
   - Rename for organization
   - Create folder by week

5. **Weekend - Upload**
   - Optimize titles/descriptions with SEO data
   - Upload to YouTube
   - Schedule posts

### Task 3: Batch Optimize Videos for SEO

1. Have 10 scripts ready
2. Create SEO library document
3. Go through each script:
   - Go to SEO Generator
   - Enter title, description, keywords
   - Generate SEO data
   - Copy results to document
4. Use SEO data when uploading to YouTube

### Task 4: Build Your Prompt Library

1. **Week 1**: Create 5 script writing prompts
2. **Week 2**: Create 5 SEO prompts
3. **Week 3**: Create 5 social media prompts
4. **Ongoing**: Mark favorites, refine based on results

---

## Tips & Tricks

### Speed Up Your Workflow

1. **Use keyboard shortcuts:**
   - `Ctrl/Cmd + S` - Save (in applicable fields)
   - `Escape` - Close modals

2. **Batch operations:**
   - Create 20 ideas at once
   - Generate 5 scripts in parallel
   - Create multiple videos overnight

3. **Copy everything:**
   - Copy scripts to Google Docs for backup
   - Copy SEO data to spreadsheet for tracking
   - Copy prompts for reuse

### Quality Improvements

**Better Scripts:**
- Generate 3 variations with different tones
- Edit to add personal stories
- Test by reading aloud

**Better Videos:**
- Watch generated videos before uploading
- Adjust script if timing is off
- Test audio quality first

**Better SEO:**
- Generate multiple times, pick best titles
- Use top 3 titles for A/B testing
- Track which perform best

### Organizing Your Work

**Use Video Ideas effectively:**
- Status = your content calendar
- Priority = what to produce first
- Category = content pillars

**Folder structure:**
```
My Videos/
├── Week 1/
├── Week 2/
├── Week 3/
└── Archive/
```

**Spreadsheet tracking:**
| Date | Idea | Script | Video | SEO | Status |
|------|------|--------|-------|-----|--------|
| 1/1 | ✓ | ✓ | ✓ | ✓ | Done |
| 1/2 | ✓ | ✗ | | | In Progress |

### Troubleshooting Tips

**If generation is slow:**
- Close other applications
- Restart dev server: `npm run dev`
- Check internet connection (for API calls)

**If scripts are generic:**
- Edit to add personal voice
- Include specific examples
- Add your expertise and stories

**If SEO scores are low:**
- Use different keywords
- Make title more specific
- Add more detail to description

**If video quality is poor:**
- Check espeak-ng and FFmpeg installation
- Generate with shorter script first
- Check audio levels

### Advanced Techniques

1. **Version Control for Scripts:**
   - Copy script before editing
   - Keep "original" and "edited" versions
   - Compare which performs better

2. **Prompt Refinement:**
   - Test prompts multiple times
   - Note which prompts give best results
   - Refine top performers monthly

3. **Content Themes:**
   - Group related ideas
   - Create series (Part 1, Part 2, etc.)
   - Use consistent topic/keywords

4. **Analytics Tracking:**
   - Note video ID and YouTube URL
   - Track views, engagement, CTR
   - Correlate with what worked in generation

---

## Next Steps

Now that you understand all features:

1. **Create 10 video ideas** about your niche
2. **Generate 3 scripts** with different tones
3. **Produce 1 complete video** from script to download
4. **Optimize for SEO** using the SEO Generator
5. **Build your prompt library** with 10+ custom prompts
6. **Upload to YouTube** and track performance

Remember: The more you use the system, the better you'll get at:
- Writing effective scripts
- Choosing good video topics
- Optimizing for search

**Questions?** Check [README.md](README.md) for support resources and technical documentation.

**Ready to create?** Start with Video Ideas and build from there!
