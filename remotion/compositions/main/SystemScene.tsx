import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, SCENE_TIMINGS } from '../../types';
import { TimerRing } from '../../components/shared/TimerRing';
import { Checklist } from '../../components/shared/Checklist';

export const SystemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { start, end } = SCENE_TIMINGS.system;
  const localFrame = frame - start;
  const duration = end - start;

  // Timer fills from 0 to 100%
  const timerFill = interpolate(
    localFrame,
    [0, duration * 0.8, duration],
    [0, 100, 100],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Checklist items appear in sequence
  const checklistItems = [
    {
      label: '3 min: Be still',
      checked: interpolate(
        localFrame,
        [duration * 0.3, duration * 0.35],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      ) > 0.5,
    },
    {
      label: '4 min: Move',
      checked: interpolate(
        localFrame,
        [duration * 0.5, duration * 0.55],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      ) > 0.5,
    },
    {
      label: '3 min: Pour in',
      checked: interpolate(
        localFrame,
        [duration * 0.7, duration * 0.75],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      ) > 0.5,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          padding: '60px 80px',
          gap: '80px',
        }}
      >
        {/* Timer Ring - left */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TimerRing
            fillPercentage={timerFill}
            width={280}
            height={280}
            timeLabel="10 min"
          />
        </div>

        {/* Checklist - right */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <h3
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: COLORS.darkSlate,
              margin: '0 0 20px 0',
              fontFamily: '"Montserrat", sans-serif',
            }}
          >
            Your 10-minute refill
          </h3>
          <Checklist
            items={checklistItems}
            style={{
              gap: '24px',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
