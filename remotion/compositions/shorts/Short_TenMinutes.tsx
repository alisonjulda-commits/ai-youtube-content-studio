import React from 'react';
import { AbsoluteFill, Audio, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../../types';
import { ShortLayout } from '../../components/shared/ShortLayout';
import { TimerRing } from '../../components/shared/TimerRing';
import { Checklist } from '../../components/shared/Checklist';

const SystemVisual: React.FC = () => {
  const frame = useCurrentFrame();

  // Timer fills from 0 to 100% over 30 seconds
  const timerFill = interpolate(
    frame,
    [150, 900],
    [0, 100],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Checklist items appear
  const checklistItems = [
    {
      label: '3 min: Be still',
      checked: interpolate(
        frame,
        [250, 280],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      ) > 0.5,
    },
    {
      label: '4 min: Move',
      checked: interpolate(
        frame,
        [450, 480],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      ) > 0.5,
    },
    {
      label: '3 min: Pour in',
      checked: interpolate(
        frame,
        [650, 680],
        [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
      ) > 0.5,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
      }}
    >
      <TimerRing
        fillPercentage={timerFill}
        width={140}
        height={140}
        timeLabel="10 min"
      />
      <Checklist
        items={checklistItems}
        style={{
          fontSize: 14,
          gap: '12px',
        }}
      />
    </div>
  );
};

export interface Short_TenMinutesProps {
  audioUrl?: string;
}

export const Short_TenMinutes: React.FC<Short_TenMinutesProps> = ({
  audioUrl = 'src/assets/audio/short4.mp3',
}) => {
  return (
    <AbsoluteFill>
      <ShortLayout
        hookText="Self-care in 10 minutes. No spa required."
        visual={<SystemVisual />}
        ctaText="Your daily refill starts here"
      />
      <Audio src={audioUrl} volume={0.9} />
    </AbsoluteFill>
  );
};
