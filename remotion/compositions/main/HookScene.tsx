import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, SCENE_TIMINGS } from '../../types';
import { Cup } from '../../components/shared/Cup';
import { AnimatedText } from '../../components/shared/AnimatedText';

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { start, end } = SCENE_TIMINGS.hook;
  const localFrame = frame - start;

  // Cup drains from full to empty
  const cupFill = interpolate(localFrame, [0, end - start], [1, 0], {
    easing: Easing.inOut(Easing.ease),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      {/* Cup animation */}
      <div
        style={{
          position: 'absolute',
          left: '20%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <Cup fillLevel={cupFill} width={240} height={320} />
      </div>

      {/* Hook text */}
      <div
        style={{
          position: 'absolute',
          right: '15%',
          top: '50%',
          transform: 'translateY(-50%)',
          maxWidth: '45%',
        }}
      >
        <AnimatedText
          text="Self-care isn't selfish."
          startFrame={start + 240}
          duration={180}
          fontSize={56}
          fontWeight="bold"
          color={COLORS.darkSlate}
          fontFamily='"Montserrat", sans-serif'
          style={{ lineHeight: 1.2 }}
        />
      </div>
    </AbsoluteFill>
  );
};
