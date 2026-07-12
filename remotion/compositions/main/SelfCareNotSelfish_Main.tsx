import React from 'react';
import { AbsoluteFill, Audio, useVideoConfig } from 'remotion';
import { MAIN_VIDEO_DURATION, MAIN_VIDEO_FPS, MAIN_VIDEO_WIDTH, MAIN_VIDEO_HEIGHT } from '../../types';
import { HookScene } from './HookScene';
import { IntroScene } from './IntroScene';
import { EmptyCupScene } from './EmptyCupScene';
import { ShiftCardsScene } from './ShiftCardsScene';
import { StoryScene } from './StoryScene';
import { SystemScene } from './SystemScene';
import { RecapScene } from './RecapScene';
import { OutroScene } from './OutroScene';

export interface SelfCareNotSelfishProps {
  voiceoverUrl?: string;
}

export const SelfCareNotSelfish_Main: React.FC<SelfCareNotSelfishProps> = ({
  voiceoverUrl = 'src/assets/audio/voiceover.mp3',
}) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* Scene 1: Hook (0-450) */}
      <HookScene />

      {/* Scene 2: Intro (450-1800) */}
      <IntroScene />

      {/* Scene 3: Empty Cup (1800-4950) */}
      <EmptyCupScene />

      {/* Scene 4: Shift Cards (4950-9000) */}
      <ShiftCardsScene />

      {/* Scene 5: Story (9000-11700) */}
      <StoryScene />

      {/* Scene 6: System (11700-14400) */}
      <SystemScene />

      {/* Scene 7: Recap (14400-15300) */}
      <RecapScene />

      {/* Scene 8: Outro (15300-16200) */}
      <OutroScene />

      {/* Voiceover audio track */}
      <Audio
        src={voiceoverUrl}
        volume={0.9}
      />
    </AbsoluteFill>
  );
};
