import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../../types';

interface ShortLayoutProps {
  hookText: string;
  visual: React.ReactNode;
  ctaText: string;
  children?: React.ReactNode;
}

export const ShortLayout: React.FC<ShortLayoutProps> = ({
  hookText,
  visual,
  ctaText,
  children,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.cream,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 20px',
      }}
    >
      {/* Hook text - top third */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: COLORS.darkSlate,
            margin: 0,
            lineHeight: 1.2,
            fontFamily: '"Montserrat", sans-serif',
          }}
        >
          {hookText}
        </h2>
      </div>

      {/* Visual - middle */}
      <div
        style={{
          flex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 0',
        }}
      >
        {visual}
      </div>

      {/* CTA - bottom */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '16px',
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.teal,
            padding: '12px 24px',
            borderRadius: '8px',
            color: COLORS.cream,
            fontSize: 18,
            fontWeight: 600,
            textAlign: 'center',
            fontFamily: '"Lato", sans-serif',
          }}
        >
          {ctaText}
        </div>
        {children && (
          <div
            style={{
              fontSize: 14,
              color: COLORS.darkSlate,
              textAlign: 'center',
            }}
          >
            {children}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
