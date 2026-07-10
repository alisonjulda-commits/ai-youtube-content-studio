import React from 'react';
import { Composition } from 'remotion';
import { BiblicalSelfCareVideo, BiblicalSelfCareVideoProps } from './compositions/BiblicalSelfCareVideo';

const defaultProps: BiblicalSelfCareVideoProps = {
  title: 'Self-Care is I Care',
  hook: 'Your health is a gift from God.',
  scriptSections: [],
  musicUrl: '/music.mp3',
  voiceoverUrls: {},
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BiblicalSelfCare"
        component={BiblicalSelfCareVideo}
        durationInFrames={1800}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
    </>
  );
};
