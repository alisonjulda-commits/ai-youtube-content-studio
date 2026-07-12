# Selfcare Is I Care - Remotion Video Project

A complete Remotion project for "Selfcare Is I Care" YouTube channel featuring a 9-minute main video and 5 short-form compositions (Reels/Shorts).

## 📁 Project Structure

```
remotion/
├── index.tsx                    # Entry point (registerRoot)
├── Root.tsx                     # Composition registry
├── types/
│   └── index.ts                # Brand colors, timing constants, config
├── components/
│   └── shared/
│       ├── PlaceholderImage.tsx # Fallback for missing images
│       ├── Cup.tsx              # Signature cup animation (reused across scenes)
│       ├── TimerRing.tsx        # 10-minute timer ring visual
│       ├── Checklist.tsx        # Task checklist component
│       ├── ShortLayout.tsx      # Shared layout for all shorts
│       └── AnimatedText.tsx     # Text fade in/out utility
├── compositions/
│   ├── main/
│   │   ├── SelfCareNotSelfish_Main.tsx  # Main video composition
│   │   ├── HookScene.tsx                # Scene 1: Hook (0-450 frames)
│   │   ├── IntroScene.tsx               # Scene 2: Intro (450-1800)
│   │   ├── EmptyCupScene.tsx            # Scene 3: Empty Cup (1800-4950)
│   │   ├── ShiftCardsScene.tsx          # Scene 4: Cards (4950-9000)
│   │   ├── StoryScene.tsx               # Scene 5: Story (9000-11700)
│   │   ├── SystemScene.tsx              # Scene 6: System (11700-14400)
│   │   ├── RecapScene.tsx               # Scene 7: Recap (14400-15300)
│   │   └── OutroScene.tsx               # Scene 8: Outro (15300-16200)
│   └── shorts/
│       ├── Short_OilChange.tsx          # Short 1: Car oil change analogy
│       ├── Short_EmptyCupTest.tsx       # Short 2: Empty cup test
│       ├── Short_SayNoChallenge.tsx     # Short 3: Say NO challenge
│       ├── Short_TenMinutes.tsx         # Short 4: 10-minute system
│       └── Short_TheVerse.tsx           # Short 5: Bible verse

src/
├── assets/
│   ├── audio/
│   │   ├── voiceover.mp3        # Main video voiceover (to record)
│   │   ├── short1.mp3           # Short 1 audio
│   │   ├── short2.mp3           # Short 2 audio
│   │   ├── short3.mp3           # Short 3 audio
│   │   ├── short4.mp3           # Short 4 audio
│   │   └── short5.mp3           # Short 5 audio
│   └── images/
│       ├── teacher.jpg          # Intro panel 1
│       ├── parent.jpg           # Intro panel 2
│       ├── va-laptop.jpg        # Intro panel 3
│       ├── window.jpg           # Story scene background
│       ├── journal.jpg          # (Optional) Ken Burns image
│       └── coastline.jpg        # (Optional) Ken Burns image
```

## 🎨 Brand Constants

All colors and timings are defined in `remotion/types/index.ts`:

- **Teal** (Primary): `#3E8E7E`
- **Cream** (Background): `#F5F1E8`
- **Coral** (Accent): `#E8927C`
- **Dark Slate** (Text): `#2C3E50`

Fonts: Montserrat Bold (headlines), Lato (body)

## ⚡ Quick Start

### 1. Preview in Remotion Studio

```bash
npx remotion studio
```

This opens http://localhost:3000 where you can:
- Select and preview each composition
- Adjust playback speed
- Test all animations

### 2. Create Your Audio Files

You need to record/provide these audio files:

- `src/assets/audio/voiceover.mp3` (Main video, ~9 minutes)
- `src/assets/audio/short1.mp3` through `short5.mp3` (30-35 seconds each)

All compositions are built with **placeholder audio tracks** so you can preview the visuals while recording voiceovers separately.

### 3. Add Your Images

Replace the placeholder images in `src/assets/images/`:

| Image | Used in | Dimensions | Notes |
|-------|---------|-----------|-------|
| `teacher.jpg` | Intro panel 1 | 1:1 ratio | Your profile or representative image |
| `parent.jpg` | Intro panel 2 | 1:1 ratio | Life role imagery |
| `va-laptop.jpg` | Intro panel 3 | 1:1 ratio | Work/business imagery |
| `window.jpg` | Story scene | Landscape | Ken Burns pan background |
| `journal.jpg` | (Optional) Story | Landscape | Alternative Ken Burns image |
| `coastline.jpg` | (Optional) Story | Landscape | Alternative Ken Burns image |

**Placeholder images show dashed borders with filenames**, so you'll know exactly which asset goes where.

## 🎬 Main Video Composition: `SelfCareNotSelfish_Main`

**Duration:** 9 minutes (16,200 frames @ 30fps)  
**Resolution:** 1920×1080 (Full HD)  
**Default audio:** `src/assets/audio/voiceover.mp3`

### Scenes at a Glance

| Scene | Frames | Duration | Content |
|-------|--------|----------|---------|
| **Hook** | 0–450 | 15s | Cup animation + kinetic text |
| **Intro** | 450–1,800 | 45s | Three-panel montage (fade in sequentially) |
| **Empty Cup** | 1,800–4,950 | 105s | Cup drains in 3 steps; text overlays + science card |
| **Shift Cards** | 4,950–9,000 | 135s | Three cards slide in (1. Maintenance, 2. Rest, 3. Verse) |
| **Story** | 9,000–11,700 | 90s | Ken Burns pan over image with "Small daily deposits" |
| **System** | 11,700–14,400 | 90s | 10-min timer + checklist: Be still, Move, Pour in |
| **Recap** | 14,400–15,300 | 30s | Four bullet points stagger in |
| **Outro** | 15,300–16,200 | 30s | Cup overflows with glow + tagline + subscribe button + end-screen zones |

### Customization

Each scene is a separate component with props. To adjust timings:

1. Edit the frame ranges in `remotion/types/index.ts` → `SCENE_TIMINGS`
2. Adjust scene component props (font sizes, colors, animation durations)
3. Preview in studio to verify timing matches your voiceover

## 📱 Short Compositions

All shorts are **1080×1920 (vertical)**, **30fps**, **30–35 seconds**.

### Short 1: Oil Change
- **ID:** `Short_OilChange`
- **Duration:** 30s (900 frames)
- **Visuals:** Wrench icon morphs to heart; heart beats
- **Hook:** "You'd never skip your car's oil change. So why do you skip yours?"
- **CTA:** "Self-care = maintenance, not reward"

### Short 2: Empty Cup Test
- **ID:** `Short_EmptyCupTest`
- **Duration:** 30s (900 frames)
- **Visuals:** Cup drains from full to empty
- **Hook:** "Snappy with your kids lately?"
- **CTA:** "It's not a flaw. It's an empty cup."

### Short 3: Say No Challenge
- **ID:** `Short_SayNoChallenge`
- **Duration:** 25s (750 frames)
- **Visuals:** Big "NO" flips to reveal "YES"
- **Hook:** "Say NO to ONE thing this week."
- **CTA:** "YES to the people you love"

### Short 4: Ten Minutes
- **ID:** `Short_TenMinutes`
- **Duration:** 35s (1,050 frames)
- **Visuals:** 10-minute timer ring + 3-item checklist
- **Hook:** "Self-care in 10 minutes. No spa required."
- **CTA:** "Your daily refill starts here"

### Short 5: The Verse
- **ID:** `Short_TheVerse`
- **Duration:** 30s (900 frames)
- **Visuals:** Bible verse "Love your neighbor as yourself" with highlight animation
- **Hook:** "There's a part of this verse everyone skips."
- **CTA:** "Rest without guilt."

## 📤 Rendering Commands

Once your assets and audio are in place, use these commands:

### Render Main Video

```bash
npx remotion render SelfCareNotSelfish_Main out/2026-07-12_SelfCareNotSelfish_v1.mp4 \
  --codec h264 \
  --audio-bitrate 192k \
  --audio-codec aac
```

### Render All Shorts

```bash
# Short 1
npx remotion render Short_OilChange out/2026-07-12_Short_OilChange_v1.mp4

# Short 2
npx remotion render Short_EmptyCupTest out/2026-07-12_Short_EmptyCupTest_v1.mp4

# Short 3
npx remotion render Short_SayNoChallenge out/2026-07-12_Short_SayNoChallenge_v1.mp4

# Short 4
npx remotion render Short_TenMinutes out/2026-07-12_Short_TenMinutes_v1.mp4

# Short 5
npx remotion render Short_TheVerse out/2026-07-12_Short_TheVerse_v1.mp4
```

Or render all in one go:

```bash
mkdir -p out
npx remotion render SelfCareNotSelfish_Main out/2026-07-12_SelfCareNotSelfish_v1.mp4 && \
npx remotion render Short_OilChange out/2026-07-12_Short_OilChange_v1.mp4 && \
npx remotion render Short_EmptyCupTest out/2026-07-12_Short_EmptyCupTest_v1.mp4 && \
npx remotion render Short_SayNoChallenge out/2026-07-12_Short_SayNoChallenge_v1.mp4 && \
npx remotion render Short_TenMinutes out/2026-07-12_Short_TenMinutes_v1.mp4 && \
npx remotion render Short_TheVerse out/2026-07-12_Short_TheVerse_v1.mp4
```

### Rendering Options

Common flags:
- `--codec h264` / `--codec vp8` / `--codec h265` — Video codec
- `--audio-bitrate 192k` / `--audio-bitrate 256k` — Audio quality
- `--audio-codec aac` / `--audio-codec mp3` — Audio format
- `--crf 18` — Quality (lower = better, 18 is default)
- `--concurrency 4` — Parallel workers (speeds up rendering)

See full options: `npx remotion render --help`

## 🔧 Common Edits

### Change a Font Size

Edit the `fontSize` in the relevant scene component, e.g., `ShiftCardsScene.tsx`:

```tsx
<h3 style={{ fontSize: 32, fontWeight: 'bold', ... }}>
```

### Adjust Scene Duration

1. Edit `remotion/types/index.ts`:
   ```tsx
   hook: { start: 0, end: 600 },  // Changed from 450 to 600
   intro: { start: 600, end: 2100 },  // Shifted start
   ```
2. Update the main composition's `durationInFrames` if needed

### Change Cup Fill Animation

Edit `Cup.tsx` `fillLevel` prop or the animation in the scene component:

```tsx
const cupFill = interpolate(
  localFrame,
  [0, end - start],
  [1, 0],  // Start full (1), end empty (0)
  { easing: Easing.inOut(Easing.ease) }
);
```

### Recolor Everything

Edit `remotion/types/index.ts`:

```ts
export const COLORS = {
  teal: '#YOUR_PRIMARY_COLOR',
  cream: '#YOUR_BG_COLOR',
  coral: '#YOUR_ACCENT_COLOR',
  darkSlate: '#YOUR_TEXT_COLOR',
};
```

## ⚙️ Technical Notes

- **Remotion Version:** 4.0.487
- **React:** 18.3.1
- **TypeScript:** Yes
- **All animations:** Frame-based using `useCurrentFrame()` + `interpolate()`
- **No external libraries:** SVG shapes, pure React styling
- **Responsive placeholders:** Missing images show dashed borders with filenames

## 🐛 Troubleshooting

### Preview shows blank screens
- Check browser console for errors
- Ensure audio files exist (or comment out `<Audio>` tags temporarily)

### Audio doesn't play in preview
- Audio playback in studio requires the file to exist
- For preview-only testing, remove audio tags temporarily

### Compositions don't appear in studio
- Make sure all compositions are registered in `Root.tsx`
- Clear browser cache and restart studio

### Version mismatch warnings
- Zod version warning is safe to ignore
- Doesn't affect rendering

## 📝 Next Steps

1. **Record voiceover** for the main video (~9 minutes)
2. **Gather/create images** for the three intro panels and Ken Burns backgrounds
3. **Record/create audio** for the 5 shorts (30–35 seconds each)
4. **Place files** in `src/assets/audio/` and `src/assets/images/`
5. **Preview in studio** (`npx remotion studio`)
6. **Fine-tune timings** if voiceover pacing differs
7. **Render final videos** using the commands above

## 📚 Resources

- [Remotion Docs](https://www.remotion.dev)
- [Composition API](https://www.remotion.dev/docs/composition)
- [interpolate() Function](https://www.remotion.dev/docs/interpolate)
- [Easing Functions](https://www.remotion.dev/docs/easing)

---

**Brand:** Selfcare Is I Care  
**Created:** July 12, 2026  
**Project Type:** Faceless voiceover videos  
**Signature Visual:** The Cup (reused across all key moments)
