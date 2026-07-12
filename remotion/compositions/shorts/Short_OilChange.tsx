import React from 'react';
import { AbsoluteFill, Audio, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, SHORT_VIDEO_DURATION, SHORT_VIDEO_FPS, SHORT_VIDEO_WIDTH, SHORT_VIDEO_HEIGHT } from '../../types';
import { ShortLayout } from '../../components/shared/ShortLayout';

// Wrench icon morphing to heart
const WrenchToHeartVisual: React.FC = () => {
  const frame = useCurrentFrame();

  // Morph from wrench to heart (0 to 0.5), then heart beating (0.5 to 1)
  const morphProgress = interpolate(
    frame,
    [150, 450],
    [0, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const heartBeat = interpolate(
    (frame % 30) / 30,
    [0, 0.3, 0.6, 1],
    [1, 1.15, 1, 1],
    {
      easing: Easing.inOut(Easing.ease),
    }
  );

  const finalScale = frame > 450 ? heartBeat : 1;

  return (
    <svg
      width="180"
      height="180"
      viewBox="0 0 180 180"
      style={{
        transform: `scale(${finalScale})`,
      }}
    >
      {/* Wrench (visible when morphProgress < 0.5) */}
      {morphProgress < 1 && (
        <g opacity={1 - morphProgress}>
          <path
            d="M 40 120 Q 60 100 90 90 Q 120 80 140 70"
            fill="none"
            stroke={COLORS.teal}
            strokeWidth="12"
            strokeLinecap="round"
          />
          <circle cx="140" cy="70" r="20" fill="none" stroke={COLORS.teal} strokeWidth="12" />
          <circle cx="60" cy="110" r="16" fill="none" stroke={COLORS.teal} strokeWidth="12" />
        </g>
      )}

      {/* Heart (visible when morphProgress > 0.5) */}
      {morphProgress > 0 && (
        <g opacity={morphProgress}>
          <path
            d="M 90 140 C 50 120 20 100 20 70 C 20 50 35 35 50 35 C 65 35 80 45 90 60 C 100 45 115 35 130 35 C 145 35 160 50 160 70 C 160 100 130 120 90 140 Z"
            fill={COLORS.coral}
            opacity="0.8"
          />
        </g>
      )}
    </svg>
  );
};

export interface Short_OilChangeProps {
  audioUrl?: string;
}

export const Short_OilChange: React.FC<Short_OilChangeProps> = ({
  audioUrl = 'src/assets/audio/short1.mp3',
}) => {
  return (
    <AbsoluteFill>
      <ShortLayout
        hookText="You'd never skip your car's oil change. So why do you skip yours?"
        visual={<WrenchToHeartVisual />}
        ctaText="Self-care = maintenance, not reward"
      />
      <Audio src={audioUrl} volume={0.9} />
    </AbsoluteFill>
  );
};
