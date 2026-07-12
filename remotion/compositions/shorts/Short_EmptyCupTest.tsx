import React from 'react';
import { AbsoluteFill, Audio, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../../types';
import { ShortLayout } from '../../components/shared/ShortLayout';
import { Cup } from '../../components/shared/Cup';

const EmptyCupVisual: React.FC = () => {
  const frame = useCurrentFrame();

  // Cup drains from full to empty over 15 seconds (450 frames)
  const cupFill = interpolate(
    frame,
    [60, 750],
    [1, 0],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return <Cup fillLevel={cupFill} width={160} height={220} />;
};

export interface Short_EmptyCupTestProps {
  audioUrl?: string;
}

export const Short_EmptyCupTest: React.FC<Short_EmptyCupTestProps> = ({
  audioUrl = 'src/assets/audio/short2.mp3',
}) => {
  return (
    <AbsoluteFill>
      <ShortLayout
        hookText="Snappy with your kids lately?"
        visual={<EmptyCupVisual />}
        ctaText="It's not a flaw. It's an empty cup."
      />
      <Audio src={audioUrl} volume={0.9} />
    </AbsoluteFill>
  );
};
