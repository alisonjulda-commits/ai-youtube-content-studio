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
    durationInFrames: 59,
    lines: [{ id: "hook", from: 0, durationInFrames: 59 }],
  },
  scripture: {
    from: 77,
    durationInFrames: 484,
    lines: [
      { id: "scripture-quote", from: 0, durationInFrames: 308 },
      { id: "scripture-ref", from: 320, durationInFrames: 164 },
    ],
  },
  teaching: {
    from: 579,
    durationInFrames: 711,
    lines: [
      { id: "teach-1", from: 0, durationInFrames: 157 },
      { id: "teach-2", from: 169, durationInFrames: 141 },
      { id: "teach-3", from: 322, durationInFrames: 166 },
      { id: "teach-4", from: 500, durationInFrames: 211 },
    ],
  },
  application: {
    from: 1308,
    durationInFrames: 543,
    lines: [
      { id: "app-1", from: 0, durationInFrames: 158 },
      { id: "app-2", from: 170, durationInFrames: 163 },
      { id: "app-3", from: 345, durationInFrames: 198 },
    ],
  },
  cta: {
    from: 1869,
    durationInFrames: 216,
    lines: [
      { id: "cta-1", from: 0, durationInFrames: 121 },
      { id: "cta-2", from: 133, durationInFrames: 83 },
    ],
  },
};

export const TOTAL_DURATION_IN_FRAMES = 2103; // ~70s

export const voiceoverPath = (id: string) => `voiceover/${id}.mp3`;
