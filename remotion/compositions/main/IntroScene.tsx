import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, SCENE_TIMINGS } from '../../types';
import { PlaceholderImage } from '../../components/shared/PlaceholderImage';

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { start, end } = SCENE_TIMINGS.intro;
  const localFrame = frame - start;

  // Three panels fade in sequentially
  const panel1Opacity = interpolate(
    localFrame,
    [0, 60, end - start - 60, end - start],
    [0, 1, 1, 0],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const panel2Opacity = interpolate(
    localFrame,
    [300, 360, end - start - 360, end - start],
    [0, 1, 1, 0],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const panel3Opacity = interpolate(
    localFrame,
    [600, 660, end - start - 60, end - start],
    [0, 1, 1, 0],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '100%',
          padding: '60px 40px',
          gap: '30px',
        }}
      >
        {/* Panel 1: Teacher */}
        <div style={{ opacity: panel1Opacity, flex: 1 }}>
          <PlaceholderImage
            filename="teacher.jpg"
            width="100%"
            height={400}
            style={{
              borderRadius: '12px',
              boxShadow: `0 8px 24px rgba(0,0,0,0.1)`,
            }}
          />
        </div>

        {/* Panel 2: Parent */}
        <div style={{ opacity: panel2Opacity, flex: 1 }}>
          <PlaceholderImage
            filename="parent.jpg"
            width="100%"
            height={400}
            style={{
              borderRadius: '12px',
              boxShadow: `0 8px 24px rgba(0,0,0,0.1)`,
            }}
          />
        </div>

        {/* Panel 3: VA */}
        <div style={{ opacity: panel3Opacity, flex: 1 }}>
          <PlaceholderImage
            filename="va-laptop.jpg"
            width="100%"
            height={400}
            style={{
              borderRadius: '12px',
              boxShadow: `0 8px 24px rgba(0,0,0,0.1)`,
            }}
          />
        </div>
      </div>

      {/* Channel watermark - bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: COLORS.teal,
          padding: '6px 12px',
          borderRadius: '4px',
          color: COLORS.cream,
          fontSize: 12,
          fontWeight: 600,
          fontFamily: '"Lato", sans-serif',
        }}
      >
        Selfcare Is I Care
      </div>
    </AbsoluteFill>
  );
};
