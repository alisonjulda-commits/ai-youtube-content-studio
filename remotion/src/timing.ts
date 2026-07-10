export const FPS = 30;

// Frame ranges below are derived directly from the generated voiceover clip
// durations in public/voiceover/ (see remotion/README.md "Regenerating the
// voiceover" section) so on-screen text and narration stay in sync. Each
// line's `from` is relative to its parent scene's `from`.

export type LineTiming = {
  id: string;
  from: number;
  durationInFrames: number;
};

export type SceneTiming = {
  from: number;
  durationInFrames: number;
  lines: LineTiming[];
};

export const SCENES: Record<
  "hook" | "scripture" | "teaching" | "application" | "cta",
  SceneTiming
> = {
  hook: {
    from: 0,
    durationInFrames: 56,
    lines: [{ id: "hook", from: 0, durationInFrames: 56 }],
  },
  scripture: {
    from: 74,
    durationInFrames: 392,
    lines: [
      { id: "scripture-quote", from: 0, durationInFrames: 290 },
      { id: "scripture-ref", from: 302, durationInFrames: 90 },
    ],
  },
  teaching: {
    from: 484,
    durationInFrames: 648,
    lines: [
      { id: "teach-1", from: 0, durationInFrames: 160 },
      { id: "teach-2", from: 172, durationInFrames: 108 },
      { id: "teach-3", from: 292, durationInFrames: 135 },
      { id: "teach-4", from: 439, durationInFrames: 209 },
    ],
  },
  application: {
    from: 1150,
    durationInFrames: 499,
    lines: [
      { id: "app-1", from: 0, durationInFrames: 138 },
      { id: "app-2", from: 150, durationInFrames: 170 },
      { id: "app-3", from: 332, durationInFrames: 167 },
    ],
  },
  cta: {
    from: 1667,
    durationInFrames: 175,
    lines: [
      { id: "cta-1", from: 0, durationInFrames: 103 },
      { id: "cta-2", from: 115, durationInFrames: 60 },
    ],
  },
};

export const TOTAL_DURATION_IN_FRAMES = 1860; // ~62s

export const voiceoverPath = (id: string) => `voiceover/${id}.mp3`;
