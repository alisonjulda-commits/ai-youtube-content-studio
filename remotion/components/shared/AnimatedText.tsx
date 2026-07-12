import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../../types';

interface AnimatedTextProps {
  text: string;
  startFrame: number;
  duration: number;
  fontSize?: number;
  fontWeight?: number | string;
  color?: string;
  fontFamily?: string;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  startFrame,
  duration,
  fontSize = 32,
  fontWeight = 400,
  color = COLORS.darkSlate,
  fontFamily = '"Lato", sans-serif',
  style = {},
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 15, startFrame + duration - 15, startFrame + duration],
    [0, 1, 1, 0],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div
      style={{
        fontSize,
        fontWeight,
        color,
        fontFamily,
        opacity,
        transition: 'opacity 0.3s ease',
        ...style,
      }}
    >
      {text}
    </div>
  );
};
