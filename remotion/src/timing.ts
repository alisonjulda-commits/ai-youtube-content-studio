export const FPS = 30;

// Frame ranges mirror the beat timestamps in
// scripts/script-04-self-care-isnt-selfish-stewardship.md
export const SCENES = {
  hook: { from: 0, durationInFrames: 3 * FPS }, // 0:00–0:03
  scripture: { from: 3 * FPS, durationInFrames: 9 * FPS }, // 0:03–0:12
  teaching: { from: 12 * FPS, durationInFrames: 23 * FPS }, // 0:12–0:35
  application: { from: 35 * FPS, durationInFrames: 15 * FPS }, // 0:35–0:50
  cta: { from: 50 * FPS, durationInFrames: 8 * FPS }, // 0:50–0:58
};

export const TOTAL_DURATION_IN_FRAMES =
  SCENES.cta.from + SCENES.cta.durationInFrames; // 58s
