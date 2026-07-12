import React from 'react';
import { AbsoluteFill, Audio, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../../types';
import { ShortLayout } from '../../components/shared/ShortLayout';

const VerseVisual: React.FC = () => {
  const frame = useCurrentFrame();

  // Highlight animation - "as yourself" gets highlighted
  const highlightStart = 120;
  const highlightEnd = 600;

  const highlightOpacity = interpolate(
    frame,
    [highlightStart, highlightStart + 60, highlightEnd - 60, highlightEnd],
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
        textAlign: 'center',
        maxWidth: '80%',
        padding: '20px',
      }}
    >
      <p
        style={{
          fontSize: 36,
          fontWeight: 500,
          color: COLORS.darkSlate,
          margin: 0,
          lineHeight: 1.6,
          fontFamily: '"Lato", sans-serif',
        }}
      >
        Love your neighbor{' '}
        <span
          style={{
            position: 'relative',
          }}
        >
          as yourself
          <span
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: 0,
              right: 0,
              height: '12px',
              backgroundColor: COLORS.coral,
              opacity: highlightOpacity * 0.4,
              borderRadius: '4px',
              zIndex: -1,
            }}
          />
        </span>
        .
      </p>
      <p
        style={{
          fontSize: 14,
          color: COLORS.darkSlate,
          margin: '12px 0 0 0',
          fontFamily: '"Lato", sans-serif',
          opacity: 0.7,
        }}
      >
        Mark 12:31
      </p>
    </div>
  );
};

export interface Short_TheVerseProps {
  audioUrl?: string;
}

export const Short_TheVerse: React.FC<Short_TheVerseProps> = ({
  audioUrl = 'src/assets/audio/short5.mp3',
}) => {
  return (
    <AbsoluteFill>
      <ShortLayout
        hookText="There's a part of this verse everyone skips."
        visual={<VerseVisual />}
        ctaText="Rest without guilt."
      />
      <Audio src={audioUrl} volume={0.9} />
    </AbsoluteFill>
  );
};
