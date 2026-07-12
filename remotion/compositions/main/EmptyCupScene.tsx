import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, SCENE_TIMINGS } from '../../types';
import { Cup } from '../../components/shared/Cup';
import { AnimatedText } from '../../components/shared/AnimatedText';

export const EmptyCupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { start, end } = SCENE_TIMINGS.emptyCup;
  const localFrame = frame - start;
  const duration = end - start;

  // Cup drains in three steps
  const cupFill = interpolate(
    localFrame,
    [0, duration * 0.25, duration * 0.5, duration * 0.75, duration],
    [1, 0.67, 0.67, 0.33, 0.33],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const textStartOffset = 300;
  const textDuration = 400;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      {/* Cup - left side */}
      <div
        style={{
          position: 'absolute',
          left: '10%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <Cup fillLevel={cupFill} width={280} height={380} />
      </div>

      {/* Text overlays - right side */}
      <div
        style={{
          position: 'absolute',
          right: '10%',
          top: '50%',
          transform: 'translateY(-50%)',
          maxWidth: '40%',
          display: 'flex',
          flexDirection: 'column',
          gap: '60px',
        }}
      >
        {/* Text 1 */}
        <AnimatedText
          text="Teach a class → pour"
          startFrame={start + textStartOffset}
          duration={textDuration}
          fontSize={32}
          fontWeight="bold"
          color={COLORS.darkSlate}
          fontFamily='"Montserrat", sans-serif'
          style={{ lineHeight: 1.4 }}
        />

        {/* Text 2 */}
        <AnimatedText
          text="Comfort your child → pour"
          startFrame={start + textStartOffset + 500}
          duration={textDuration}
          fontSize={32}
          fontWeight="bold"
          color={COLORS.darkSlate}
          fontFamily='"Montserrat", sans-serif'
          style={{ lineHeight: 1.4 }}
        />

        {/* Text 3 */}
        <AnimatedText
          text="One more client message → pour"
          startFrame={start + textStartOffset + 1000}
          duration={textDuration}
          fontSize={32}
          fontWeight="bold"
          color={COLORS.darkSlate}
          fontFamily='"Montserrat", sans-serif'
          style={{ lineHeight: 1.4 }}
        />
      </div>

      {/* Science card - appears at the end */}
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: COLORS.coral,
          padding: '24px 32px',
          borderRadius: '12px',
          maxWidth: '600px',
          textAlign: 'center',
          opacity: interpolate(
            localFrame,
            [duration * 0.65, duration * 0.75, duration - 60, duration],
            [0, 1, 1, 0],
            {
              easing: Easing.inOut(Easing.ease),
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }
          ),
        }}
      >
        <p
          style={{
            margin: 0,
            color: COLORS.cream,
            fontSize: 20,
            fontWeight: 500,
            fontFamily: '"Lato", sans-serif',
            lineHeight: 1.6,
          }}
        >
          Chronic stress → elevated cortisol → poor sleep, memory, immunity
        </p>
      </div>
    </AbsoluteFill>
  );
};
