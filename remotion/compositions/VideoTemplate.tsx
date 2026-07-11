import React from 'react';
import { AbsoluteFill, Audio, useVideoConfig, interpolate, Easing, useCurrentFrame } from 'remotion';
import { Theme } from '../themes';

export interface ScriptSection {
  id: string;
  text: string;
  duration: number;
  startFrame: number;
}

export interface VideoTemplateProps {
  title?: string;
  hook?: string;
  theme: Theme;
  scriptSections?: ScriptSection[];
  musicUrl?: string;
  voiceoverUrls?: Record<string, string>;
  showCategoryIcon?: boolean;
  showBranding?: boolean;
}

export const VideoTemplate: React.FC<VideoTemplateProps> = ({
  title = 'Video Title',
  hook = 'Compelling hook text',
  theme,
  scriptSections = [],
  musicUrl = '',
  voiceoverUrls = {},
  showCategoryIcon = true,
  showBranding = true,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const introFadeIn = interpolate(
    Math.min(frame, 60),
    [0, 60],
    [0, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateRight: 'clamp',
    }
  );

  const titleScale = interpolate(
    Math.min(frame, 60),
    [0, 60],
    [0.8, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateRight: 'clamp',
    }
  );

  const outroFadeOut = interpolate(
    Math.max(0, frame - (durationInFrames - 60)),
    [0, 60],
    [1, 0],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
    }
  );

  const videoOpacity = Math.min(introFadeIn, outroFadeOut);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${theme.gradientStart} 0%, ${theme.gradientEnd} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: videoOpacity,
      }}
    >
      {/* Background gradient overlay */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 100%)',
          zIndex: 0,
        }}
      />

      {/* Category icon */}
      {showCategoryIcon && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            fontSize: '60px',
            zIndex: 5,
            animation: 'float 3s ease-in-out infinite',
          }}
        >
          {theme.emoji}
        </div>
      )}

      {/* Title and Hook */}
      <div
        style={{
          textAlign: 'center',
          color: 'white',
          zIndex: 2,
          transform: `scale(${titleScale})`,
          marginTop: showCategoryIcon ? '80px' : '0',
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            margin: '0 0 20px 0',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            letterSpacing: '-1px',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 48,
            fontWeight: '600',
            margin: 0,
            maxWidth: '85%',
            marginLeft: 'auto',
            marginRight: 'auto',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            color: theme.accentColor,
          }}
        >
          {hook}
        </p>
      </div>

      {/* Branding footer */}
      {showBranding && (
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            textAlign: 'center',
            color: 'white',
            zIndex: 3,
          }}
        >
          <p
            style={{
              fontSize: 24,
              fontWeight: '500',
              margin: 0,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            Julda Marie Alison
          </p>
          <p
            style={{
              fontSize: 16,
              fontWeight: '400',
              margin: '8px 0 0 0',
              opacity: 0.8,
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            YouTube Content Studio
          </p>
        </div>
      )}

      {/* Script sections */}
      {scriptSections.map((section) => (
        <TemplateScriptSection
          key={section.id}
          section={section}
          accentColor={theme.accentColor}
        />
      ))}

      {/* Audio */}
      {musicUrl && (
        <Audio src={musicUrl} volume={0.3} />
      )}

      {/* Voiceovers */}
      {Object.entries(voiceoverUrls).map(([id, url]) => (
        <Audio
          key={id}
          src={url}
          volume={0.8}
          startFrom={0}
        />
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </AbsoluteFill>
  );
};

interface TemplateScriptSectionProps {
  section: ScriptSection;
  accentColor: string;
}

const TemplateScriptSection: React.FC<TemplateScriptSectionProps> = ({
  section,
  accentColor,
}) => {
  const { durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [
      section.startFrame,
      section.startFrame + 15,
      section.startFrame + section.duration - 15,
      section.startFrame + section.duration,
    ],
    [0, 1, 1, 0],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const scale = interpolate(
    frame,
    [section.startFrame, section.startFrame + 15],
    [0.95, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: 48,
          fontWeight: '500',
          textAlign: 'center',
          maxWidth: '85%',
          padding: '40px',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          borderLeft: `6px solid ${accentColor}`,
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {section.text}
      </div>
    </AbsoluteFill>
  );
};
