// Brand colors
export const COLORS = {
  teal: '#3E8E7E',
  cream: '#F5F1E8',
  coral: '#E8927C',
  darkSlate: '#2C3E50',
} as const;

// Scene frame timings for main video (9 minutes = 16200 frames @ 30fps)
export const SCENE_TIMINGS = {
  hook: { start: 0, end: 450 },
  intro: { start: 450, end: 1800 },
  emptyCup: { start: 1800, end: 4950 },
  shiftCards: { start: 4950, end: 9000 },
  story: { start: 9000, end: 11700 },
  system: { start: 11700, end: 14400 },
  recap: { start: 14400, end: 15300 },
  outro: { start: 15300, end: 16200 },
} as const;

export const MAIN_VIDEO_DURATION = 16200; // 9 minutes @ 30fps
export const MAIN_VIDEO_FPS = 30;
export const MAIN_VIDEO_WIDTH = 1920;
export const MAIN_VIDEO_HEIGHT = 1080;

export const SHORT_VIDEO_DURATION = 900; // 30 seconds @ 30fps
export const SHORT_VIDEO_FPS = 30;
export const SHORT_VIDEO_WIDTH = 1080;
export const SHORT_VIDEO_HEIGHT = 1920;
