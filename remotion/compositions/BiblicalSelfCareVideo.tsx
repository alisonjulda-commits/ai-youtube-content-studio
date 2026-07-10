import React from 'react';
import { AbsoluteFill, Audio, useVideoConfig, interpolate, Easing } from 'remotion';

export interface ScriptSection {
  id: string;
  text: string;
  duration: number;
  startFrame: number;
}

export interface BiblicalSelfCareVideoProps {
  title?: string;
  hook?: string;
  scriptSections?: ScriptSection[];
  musicUrl?: string;
  voiceoverUrls?: Record<string, string>;
}

export const BiblicalSelfCareVideo: React.FC<BiblicalSelfCareVideoProps> = ({
  title = 'Self-Care is I Care',
  hook = 'Your health is a gift from God.',
  scriptSections = [],
  musicUrl = '',
  voiceoverUrls = {},
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  const titleOpacity = interpolate(
    Math.min(60, durationInFrames),
    [0, 30],
    [0, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateRight: 'clamp',
    }
  );

  const titleScale = interpolate(
    Math.min(60, durationInFrames),
    [0, 30],
    [0.8, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Background gradient overlay */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />

      {/* Title and Hook */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          textAlign: 'center',
          color: 'white',
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            margin: '0 0 20px 0',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 48,
            fontWeight: '600',
            margin: 0,
            maxWidth: '80%',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          }}
        >
          {hook}
        </p>
      </div>

      {/* Script sections */}
      {scriptSections.map((section) => (
        <ScriptSection key={section.id} section={section} />
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
    </AbsoluteFill>
  );
};

interface ScriptSectionProps {
  section: ScriptSection;
}

const ScriptSection: React.FC<ScriptSectionProps> = ({ section }) => {
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    durationInFrames,
    [section.startFrame, section.startFrame + 15, section.startFrame + section.duration - 15, section.startFrame + section.duration],
    [0, 1, 1, 0],
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
        }}
      >
        {section.text}
      </div>
    </AbsoluteFill>
  );
};
