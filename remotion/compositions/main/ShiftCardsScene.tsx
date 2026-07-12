import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, SCENE_TIMINGS } from '../../types';

const Card: React.FC<{
  number: string;
  title: string;
  subtitle?: string;
  delay: number;
}> = ({ number, title, subtitle, delay }) => {
  const frame = useCurrentFrame();
  const { start, end } = SCENE_TIMINGS.shiftCards;
  const localFrame = frame - start;

  const cardStart = delay;
  const cardDuration = 800;
  const cardEnd = end - start - 200;

  const slideIn = interpolate(
    localFrame,
    [cardStart - 60, cardStart],
    [-200, 0],
    {
      easing: Easing.out(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const opacity = interpolate(
    localFrame,
    [cardStart, cardStart + 60, cardEnd - 60, cardEnd],
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
        backgroundColor: COLORS.teal,
        padding: '40px 36px',
        borderRadius: '16px',
        maxWidth: '500px',
        marginBottom: '32px',
        transform: `translateX(${slideIn}px)`,
        opacity,
        boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 'bold',
          color: COLORS.cream,
          marginBottom: '12px',
          fontFamily: '"Montserrat", sans-serif',
        }}
      >
        {number}
      </div>
      <h3
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: COLORS.cream,
          margin: '0 0 8px 0',
          fontFamily: '"Montserrat", sans-serif',
        }}
      >
        {title}
      </h3>
      {subtitle && (
        <p
          style={{
            fontSize: 14,
            color: COLORS.cream,
            margin: '12px 0 0 0',
            opacity: 0.9,
            fontFamily: '"Lato", sans-serif',
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export const ShiftCardsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { start } = SCENE_TIMINGS.shiftCards;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.cream,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          number="1"
          title="Maintenance, not reward"
          delay={0}
        />
        <Card
          number="2"
          title="Rest multiplies service"
          delay={500}
        />
        <Card
          number="3"
          title="Love yourself, love others"
          subtitle="Love your neighbor as yourself. — Mark 12:31"
          delay={1000}
        />
      </div>
    </AbsoluteFill>
  );
};
