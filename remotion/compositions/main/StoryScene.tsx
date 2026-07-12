import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, SCENE_TIMINGS } from '../../types';
import { PlaceholderImage } from '../../components/shared/PlaceholderImage';
import { AnimatedText } from '../../components/shared/AnimatedText';

export const StoryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { start, end } = SCENE_TIMINGS.story;
  const localFrame = frame - start;
  const duration = end - start;

  // Ken Burns zoom effect - subtle zoom in
  const scale = interpolate(
    localFrame,
    [0, duration],
    [1, 1.15],
    {
      easing: Easing.linear,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Pan effect
  const panX = interpolate(
    localFrame,
    [0, duration],
    [0, -30],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill>
      {/* Background image with Ken Burns effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            transform: `scale(${scale}) translateX(${panX}px)`,
            width: '100%',
            height: '100%',
            transformOrigin: 'left center',
          }}
        >
          <PlaceholderImage
            filename="window.jpg"
            width="100%"
            height="100%"
            style={{
              borderRadius: 0,
            }}
          />
        </div>
      </div>

      {/* Overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      />

      {/* Text overlay */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          maxWidth: '70%',
        }}
      >
        <AnimatedText
          text="Small daily deposits."
          startFrame={start + 60}
          duration={duration - 120}
          fontSize={56}
          fontWeight="bold"
          color={COLORS.cream}
          fontFamily='"Montserrat", sans-serif'
          style={{
            lineHeight: 1.2,
            textShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
