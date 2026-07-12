import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../../types';

interface PlaceholderImageProps {
  filename: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  filename,
  width = '100%',
  height = '100%',
  style = {},
}) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: COLORS.darkSlate,
        border: `2px dashed ${COLORS.coral}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          color: COLORS.cream,
          fontSize: 16,
          fontWeight: 500,
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <div style={{ marginBottom: '8px' }}>📁</div>
        <div>{filename}</div>
      </div>
    </div>
  );
};
