# Script #4 — Remotion Video

Renders `../scripts/script-04-self-care-isnt-selfish-stewardship.md` as a
1080×1920 (vertical, YouTube Shorts) video, complete with a generated
voiceover and background music. Scene/line timing in `src/timing.ts` is
derived from the actual duration of each voiceover clip, so captions and
narration stay in sync.

## Setup

```bash
npm install
```

## Preview (Remotion Studio)

```bash
npm start
```

## Render

```bash
npm run build
```

Outputs to `out/script-04-self-care-isnt-selfish-stewardship.mp4`.

Some sandboxed environments block Remotion's automatic headless-Chrome
download. If so, point at an already-installed Chrome/Chromium via:

```bash
REMOTION_BROWSER_EXECUTABLE=/path/to/chrome npm run build
```

## Voiceover and music

- `public/voiceover/*.mp3` — one clip per spoken line (12 total), generated
  offline with `espeak-ng` (MBROLA `mb-us1` voice). This environment's
  network policy blocks downloading higher-quality neural TTS models (e.g.
  from Hugging Face), so this is a classic diphone-synthesizer voice —
  clear and understandable, but noticeably synthetic, not broadcast-quality
  narration. **Recommended before publishing:** replace these clips with a
  real recording or a cloud TTS service (ElevenLabs, Google Cloud TTS,
  etc.) — see "Regenerating the voiceover" below for exact per-line text
  and the timing this depends on.
- `public/music.mp3` — a soft procedurally-generated ambient pad (four
  sine-wave chords, Am–F–C–G) mixed quietly under the narration. It's a
  placeholder, not a produced track — swap it for a real royalty-free bed
  if you want more polish (same filename, or update the `<Audio>` src in
  `src/Script04.tsx`).

### Regenerating the voiceover

1. Record/generate a new clip per line, named to match the ids in
   `src/timing.ts` (`hook.mp3`, `scripture-quote.mp3`, `scripture-ref.mp3`,
   `teach-1.mp3` … `teach-4.mp3`, `app-1.mp3` … `app-3.mp3`, `cta-1.mp3`,
   `cta-2.mp3`), text for each is the on-screen caption in the matching
   `src/scenes/*.tsx` file.
2. Drop the new files into `public/voiceover/`, overwriting the old ones.
3. Update the `from` / `durationInFrames` values in `src/timing.ts` to
   match each new clip's actual length (in frames at 30fps), so the text
   still lines up with the new narration.

## Structure

- `src/timing.ts` — per-scene and per-line frame ranges, derived from the
  voiceover clip durations.
- `src/Background.tsx` — the slow-drifting gradient backdrop.
- `src/TextCard.tsx` — shared fade/rise text animation.
- `src/scenes/*` — one component per beat; each renders its own lines as
  nested `<Sequence>`s with a matching `<Audio>` clip.
- `src/Script04.tsx` — composes the scenes in sequence, plus the
  background music track.
- `src/Root.tsx` — registers the `Script04` composition (1080×1920, 30fps).
