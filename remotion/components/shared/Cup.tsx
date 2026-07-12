import React from 'react';
import { interpolate } from 'remotion';
import { COLORS } from '../../types';

interface CupProps {
  fillLevel: number; // 0-1
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export const Cup: React.FC<CupProps> = ({
  fillLevel = 0.5,
  width = 200,
  height = 280,
  style = {},
}) => {
  const clampedFill = Math.max(0, Math.min(1, fillLevel));
  const fillHeight = clampedFill * (height * 0.65); // 65% of cup height is fillable

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {/* Cup body */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: 'absolute' }}
      >
        {/* Cup outline */}
        <path
          d={`M ${width * 0.25} ${height * 0.15} L ${width * 0.2} ${height * 0.8} Q ${width * 0.2} ${height * 0.95} ${width * 0.35} ${height * 0.95} L ${width * 0.65} ${height * 0.95} Q ${width * 0.8} ${height * 0.95} ${width * 0.8} ${height * 0.8} L ${width * 0.75} ${height * 0.15} Z`}
          fill="none"
          stroke={COLORS.darkSlate}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Handle */}
        <path
          d={`M ${width * 0.8} ${height * 0.35} Q ${width * 1.05} ${height * 0.35} ${width * 1.05} ${height * 0.65} Q ${width * 1.05} ${height * 0.8} ${width * 0.8} ${height * 0.8}`}
          fill="none"
          stroke={COLORS.darkSlate}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Coffee fill */}
        <defs>
          <clipPath id="cupClip">
            <path
              d={`M ${width * 0.25} ${height * 0.15} L ${width * 0.2} ${height * 0.8} Q ${width * 0.2} ${height * 0.95} ${width * 0.35} ${height * 0.95} L ${width * 0.65} ${height * 0.95} Q ${width * 0.8} ${height * 0.95} ${width * 0.8} ${height * 0.8} L ${width * 0.75} ${height * 0.15} Z`}
            />
          </clipPath>
        </defs>

        {/* Fill area */}
        <rect
          x={width * 0.22}
          y={height * 0.8 - fillHeight}
          width={width * 0.56}
          height={fillHeight}
          fill={COLORS.teal}
          opacity="0.8"
          clipPath="url(#cupClip)"
        />
      </svg>
    </div>
  );
};
