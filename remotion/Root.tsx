import React from 'react';
import { Composition } from 'remotion';
import {
  MAIN_VIDEO_DURATION,
  MAIN_VIDEO_FPS,
  MAIN_VIDEO_WIDTH,
  MAIN_VIDEO_HEIGHT,
  SHORT_VIDEO_DURATION,
  SHORT_VIDEO_FPS,
  SHORT_VIDEO_WIDTH,
  SHORT_VIDEO_HEIGHT,
} from './types';
import { SelfCareNotSelfish_Main, SelfCareNotSelfishProps } from './compositions/main/SelfCareNotSelfish_Main';
import { Short_OilChange, Short_OilChangeProps } from './compositions/shorts/Short_OilChange';
import { Short_EmptyCupTest, Short_EmptyCupTestProps } from './compositions/shorts/Short_EmptyCupTest';
import { Short_SayNoChallenge, Short_SayNoChallengeProps } from './compositions/shorts/Short_SayNoChallenge';
import { Short_TenMinutes, Short_TenMinutesProps } from './compositions/shorts/Short_TenMinutes';
import { Short_TheVerse, Short_TheVerseProps } from './compositions/shorts/Short_TheVerse';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main video composition */}
      <Composition<SelfCareNotSelfishProps>
        id="SelfCareNotSelfish_Main"
        component={SelfCareNotSelfish_Main}
        durationInFrames={MAIN_VIDEO_DURATION}
        fps={MAIN_VIDEO_FPS}
        width={MAIN_VIDEO_WIDTH}
        height={MAIN_VIDEO_HEIGHT}
        defaultProps={{
          voiceoverUrl: 'src/assets/audio/voiceover.mp3',
        }}
      />

      {/* Short 1: Oil Change */}
      <Composition<Short_OilChangeProps>
        id="Short_OilChange"
        component={Short_OilChange}
        durationInFrames={SHORT_VIDEO_DURATION}
        fps={SHORT_VIDEO_FPS}
        width={SHORT_VIDEO_WIDTH}
        height={SHORT_VIDEO_HEIGHT}
        defaultProps={{
          audioUrl: 'src/assets/audio/short1.mp3',
        }}
      />

      {/* Short 2: Empty Cup Test */}
      <Composition<Short_EmptyCupTestProps>
        id="Short_EmptyCupTest"
        component={Short_EmptyCupTest}
        durationInFrames={SHORT_VIDEO_DURATION}
        fps={SHORT_VIDEO_FPS}
        width={SHORT_VIDEO_WIDTH}
        height={SHORT_VIDEO_HEIGHT}
        defaultProps={{
          audioUrl: 'src/assets/audio/short2.mp3',
        }}
      />

      {/* Short 3: Say No Challenge */}
      <Composition<Short_SayNoChallengeProps>
        id="Short_SayNoChallenge"
        component={Short_SayNoChallenge}
        durationInFrames={750}
        fps={SHORT_VIDEO_FPS}
        width={SHORT_VIDEO_WIDTH}
        height={SHORT_VIDEO_HEIGHT}
        defaultProps={{
          audioUrl: 'src/assets/audio/short3.mp3',
        }}
      />

      {/* Short 4: Ten Minutes */}
      <Composition<Short_TenMinutesProps>
        id="Short_TenMinutes"
        component={Short_TenMinutes}
        durationInFrames={1050}
        fps={SHORT_VIDEO_FPS}
        width={SHORT_VIDEO_WIDTH}
        height={SHORT_VIDEO_HEIGHT}
        defaultProps={{
          audioUrl: 'src/assets/audio/short4.mp3',
        }}
      />

      {/* Short 5: The Verse */}
      <Composition<Short_TheVerseProps>
        id="Short_TheVerse"
        component={Short_TheVerse}
        durationInFrames={SHORT_VIDEO_DURATION}
        fps={SHORT_VIDEO_FPS}
        width={SHORT_VIDEO_WIDTH}
        height={SHORT_VIDEO_HEIGHT}
        defaultProps={{
          audioUrl: 'src/assets/audio/short5.mp3',
        }}
      />
    </>
  );
};
