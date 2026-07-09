# Script #4 — Remotion Video

Renders `../scripts/script-04-self-care-isnt-selfish-stewardship.md` as a
1080×1920 (vertical, YouTube Shorts) video. Scene timing in `src/timing.ts`
mirrors the timestamps in the script file exactly.

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

## Adding a voiceover

Record the script's narration, save it as `public/voiceover.mp3`, then
uncomment the `<Audio />` line at the bottom of `src/Script04.tsx`.

## Structure

- `src/timing.ts` — frame ranges for each beat (hook, scripture, teaching,
  application, CTA), derived from the script's timestamps.
- `src/Background.tsx` — the slow-drifting gradient backdrop.
- `src/TextCard.tsx` — shared fade/rise text animation.
- `src/scenes/*` — one component per beat.
- `src/Script04.tsx` — composes the scenes in sequence.
- `src/Root.tsx` — registers the `Script04` composition (1080×1920, 30fps).
