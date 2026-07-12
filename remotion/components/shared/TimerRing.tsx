import React from 'react';
import { COLORS } from '../../types';

interface TimerRingProps {
  fillPercentage: number; // 0-100
  width?: number;
  height?: number;
  timeLabel?: string;
}

export const TimerRing: React.FC<TimerRingProps> = ({
  fillPercentage = 0,
  width = 220,
  height = 220,
  timeLabel = '10 min',
}) => {
  const clampedFill = Math.max(0, Math.min(100, fillPercentage));
  const radius = (width / 2) * 0.7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clampedFill / 100);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke={COLORS.cream}
          strokeWidth="4"
          opacity="0.3"
        />

        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke={COLORS.teal}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${width / 2}px ${height / 2}px`, transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>

      {/* Center text */}
      <div
        style={{
          position: 'absolute',
          textAlign: 'center',
          color: COLORS.darkSlate,
          fontFamily: '"Lato", sans-serif',
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 'bold' }}>
          {Math.round(clampedFill)}%
        </div>
        <div style={{ fontSize: 14, marginTop: '4px' }}>{timeLabel}</div>
      </div>
    </div>
  );
};
