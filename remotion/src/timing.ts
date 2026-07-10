export const FPS = 30;

// Frame ranges derived from TTS-generated voiceover clip durations
// Each line's `from` is relative to its parent scene's `from`.

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
    durationInFrames: 77,
    lines: [{ id: "hook", from: 0, durationInFrames: 69 }],
  },
  scripture: {
    from: 77,
    durationInFrames: 362,
    lines: [
      { id: "scripture-quote", from: 0, durationInFrames: 246 },
      { id: "scripture-ref", from: 254, durationInFrames: 100 },
    ],
  },
  teaching: {
    from: 439,
    durationInFrames: 603,
    lines: [
      { id: "teach-1", from: 0, durationInFrames: 135 },
      { id: "teach-2", from: 143, durationInFrames: 133 },
      { id: "teach-3", from: 284, durationInFrames: 134 },
      { id: "teach-4", from: 426, durationInFrames: 169 },
    ],
  },
  application: {
    from: 1042,
    durationInFrames: 495,
    lines: [
      { id: "app-1", from: 0, durationInFrames: 144 },
      { id: "app-2", from: 152, durationInFrames: 148 },
      { id: "app-3", from: 308, durationInFrames: 179 },
    ],
  },
  cta: {
    from: 1537,
    durationInFrames: 200,
    lines: [
      { id: "cta-1", from: 0, durationInFrames: 98 },
      { id: "cta-2", from: 106, durationInFrames: 86 },
    ],
  },
};

export const TOTAL_DURATION_IN_FRAMES = 1737; // ~57.9s

export const voiceoverPath = (id: string) => `voiceover/${id}.mp3`;
