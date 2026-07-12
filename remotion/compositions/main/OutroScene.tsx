import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, SCENE_TIMINGS } from '../../types';
import { Cup } from '../../components/shared/Cup';

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { start, end } = SCENE_TIMINGS.outro;
  const localFrame = frame - start;
  const duration = end - start;

  // Cup fills up and overflows
  const cupFill = interpolate(
    localFrame,
    [0, duration * 0.6, duration],
    [0, 1, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Golden light glow effect (opacity of overflow indicator)
  const glowOpacity = interpolate(
    localFrame,
    [duration * 0.5, duration * 0.6, duration],
    [0, 1, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Tagline fade in
  const taglineOpacity = interpolate(
    localFrame,
    [duration * 0.3, duration * 0.4],
    [0, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Subscribe button pop in
  const subscribeScale = interpolate(
    localFrame,
    [duration * 0.5, duration * 0.55],
    [0.8, 1],
    {
      easing: Easing.out(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const subscribeOpacity = interpolate(
    localFrame,
    [duration * 0.45, duration * 0.55],
    [0, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.cream,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* Cup with overflow glow */}
      <div
        style={{
          position: 'relative',
          marginBottom: '40px',
        }}
      >
        <Cup fillLevel={cupFill} width={240} height={320} />

        {/* Overflow glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '220px',
            height: '60px',
            background: `radial-gradient(ellipse at center, rgba(232, 147, 124, 0.6) 0%, transparent 70%)`,
            borderRadius: '50%',
            opacity: glowOpacity,
            filter: 'blur(8px)',
          }}
        />

        {/* Light sparkles */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '6px',
              height: '6px',
              backgroundColor: COLORS.coral,
              borderRadius: '50%',
              opacity: glowOpacity * 0.8,
              top: `-10px`,
              left: `${30 + i * 80}px`,
              boxShadow: `0 0 12px ${COLORS.coral}`,
            }}
          />
        ))}
      </div>

      {/* Tagline */}
      <h2
        style={{
          fontSize: 48,
          fontWeight: 'bold',
          color: COLORS.darkSlate,
          margin: '20px 0 40px 0',
          opacity: taglineOpacity,
          textAlign: 'center',
          fontFamily: '"Montserrat", sans-serif',
        }}
      >
        Self-care is I care
      </h2>

      {/* Subscribe button */}
      <div
        style={{
          backgroundColor: COLORS.teal,
          padding: '16px 36px',
          borderRadius: '28px',
          color: COLORS.cream,
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '60px',
          transform: `scale(${subscribeScale})`,
          opacity: subscribeOpacity,
          boxShadow: '0 8px 24px rgba(62, 142, 126, 0.3)',
          fontFamily: '"Montserrat", sans-serif',
        }}
      >
        ▶ Subscribe
      </div>

      {/* End screen safe zones placeholders */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          right: '30px',
          width: '200px',
          height: '200px',
          border: `2px dashed ${COLORS.teal}`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          color: COLORS.teal,
          fontFamily: '"Lato", sans-serif',
          opacity: 0.5,
        }}
      >
        End Screen Zone 1
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '30px',
          width: '200px',
          height: '200px',
          border: `2px dashed ${COLORS.teal}`,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          color: COLORS.teal,
          fontFamily: '"Lato", sans-serif',
          opacity: 0.5,
        }}
      >
        End Screen Zone 2
      </div>
    </AbsoluteFill>
  );
};
