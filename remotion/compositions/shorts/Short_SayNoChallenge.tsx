import React from 'react';
import { AbsoluteFill, Audio, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../../types';
import { ShortLayout } from '../../components/shared/ShortLayout';

const FlipTextVisual: React.FC = () => {
  const frame = useCurrentFrame();

  // Flip effect - rotates around Y axis
  const flipRotation = interpolate(
    frame,
    [120, 300, 450],
    [0, 180, 180],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Text opacity during flip
  const textOpacity = interpolate(
    frame,
    [120, 180, 300, 360],
    [1, 0, 0, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div
      style={{
        perspective: '1000px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
      }}
    >
      <div
        style={{
          transform: `rotateY(${flipRotation}deg)`,
          fontSize: 120,
          fontWeight: 'bold',
          fontFamily: '"Montserrat", sans-serif',
          minWidth: '220px',
          textAlign: 'center',
          opacity: Math.abs(flipRotation) < 90 ? 1 : 0,
        }}
      >
        <div style={{ color: COLORS.coral }}>NO</div>
      </div>

      {/* "YES" appears on the back of the flip */}
      {flipRotation > 90 && (
        <div
          style={{
            position: 'absolute',
            transform: `rotateY(${flipRotation - 180}deg)`,
            fontSize: 120,
            fontWeight: 'bold',
            fontFamily: '"Montserrat", sans-serif',
            minWidth: '220px',
            textAlign: 'center',
            color: COLORS.teal,
          }}
        >
          YES
        </div>
      )}
    </div>
  );
};

export interface Short_SayNoChallengeProps {
  audioUrl?: string;
}

export const Short_SayNoChallenge: React.FC<Short_SayNoChallengeProps> = ({
  audioUrl = 'src/assets/audio/short3.mp3',
}) => {
  return (
    <AbsoluteFill>
      <ShortLayout
        hookText="Say NO to ONE thing this week."
        visual={<FlipTextVisual />}
        ctaText="YES to the people you love"
      />
      <Audio src={audioUrl} volume={0.9} />
    </AbsoluteFill>
  );
};
