import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, SCENE_TIMINGS } from '../../types';
import { AnimatedText } from '../../components/shared/AnimatedText';

const BULLET_POINTS = [
  'Your cup empties daily',
  'Self-care is the refill, not the reward',
  'Rest multiplies your service',
  '10 minutes is enough to start',
];

export const RecapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { start, end } = SCENE_TIMINGS.recap;
  const duration = end - start;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          padding: '60px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: COLORS.darkSlate,
            marginBottom: '60px',
            fontFamily: '"Montserrat", sans-serif',
          }}
        >
          The key shifts
        </h2>

        <div
          style={{
            maxWidth: '700px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          {BULLET_POINTS.map((point, index) => {
            const bulletStart = index * 150;
            return (
              <BulletPoint
                key={index}
                text={point}
                index={index}
                startFrame={start + bulletStart}
                duration={200}
                totalDuration={duration}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

interface BulletPointProps {
  text: string;
  index: number;
  startFrame: number;
  duration: number;
  totalDuration: number;
}

const BulletPoint: React.FC<BulletPointProps> = ({
  text,
  index,
  startFrame,
  duration,
  totalDuration,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 30, startFrame + totalDuration - 60, startFrame + totalDuration],
    [0, 1, 1, 0],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const slideIn = interpolate(
    frame,
    [startFrame - 30, startFrame],
    [-40, 0],
    {
      easing: Easing.out(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '20px',
        opacity,
        transform: `translateX(${slideIn}px)`,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div
        style={{
          fontSize: 36,
          fontWeight: 'bold',
          color: COLORS.coral,
          marginTop: '8px',
          minWidth: '36px',
        }}
      >
        •
      </div>
      <p
        style={{
          fontSize: 24,
          fontWeight: 500,
          color: COLORS.darkSlate,
          margin: 0,
          textAlign: 'left',
          lineHeight: 1.4,
          fontFamily: '"Lato", sans-serif',
        }}
      >
        {text}
      </p>
    </div>
  );
};
