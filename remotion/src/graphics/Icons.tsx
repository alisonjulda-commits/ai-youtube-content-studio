import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type IconProps = {
  delay?: number;
  duration?: number;
  scale?: number;
};

// Prayer hands icon
export const PrayerIcon: React.FC<IconProps> = ({ delay = 0, duration = 300, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const progress = spring({
    frame: local,
    fps,
    config: { damping: 100, stiffness: 100, mass: 0.5 },
  });

  const opacity = interpolate(local, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${0.8 + progress * 0.2 * scale})`,
        fontSize: 64,
      }}
    >
      🙏
    </div>
  );
};

// Bible icon
export const BibleIcon: React.FC<IconProps> = ({ delay = 0, duration = 300, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const progress = spring({
    frame: local,
    fps,
    config: { damping: 100, stiffness: 100, mass: 0.5 },
  });

  const opacity = interpolate(local, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${0.8 + progress * 0.2 * scale})`,
        fontSize: 64,
      }}
    >
      📖
    </div>
  );
};

// Heart icon for application/care
export const HeartIcon: React.FC<IconProps> = ({ delay = 0, duration = 300, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const progress = spring({
    frame: local,
    fps,
    config: { damping: 100, stiffness: 100, mass: 0.5 },
  });

  const opacity = interpolate(local, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = interpolate(
    Math.sin((local / fps) * Math.PI * 2),
    [-1, 1],
    [0.9, 1.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity,
        transform: `scale(${pulse * (0.8 + progress * 0.2 * scale)})`,
        fontSize: 64,
      }}
    >
      ❤️
    </div>
  );
};

// Light/enlightenment icon
export const LightIcon: React.FC<IconProps> = ({ delay = 0, duration = 300, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const progress = spring({
    frame: local,
    fps,
    config: { damping: 100, stiffness: 100, mass: 0.5 },
  });

  const opacity = interpolate(local, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glow = interpolate(local, [0, 30], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: opacity * glow,
        transform: `scale(${0.8 + progress * 0.2 * scale})`,
        fontSize: 64,
      }}
    >
      ✨
    </div>
  );
};

// Follow/arrow icon for CTA
export const ArrowIcon: React.FC<IconProps> = ({ delay = 0, duration = 300, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const progress = spring({
    frame: local,
    fps,
    config: { damping: 100, stiffness: 100, mass: 0.5 },
  });

  const opacity = interpolate(local, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const drift = interpolate(
    Math.sin((local / fps) * Math.PI * 2),
    [-1, 1],
    [-8, 8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        opacity,
        transform: `scale(${0.8 + progress * 0.2 * scale}) translateX(${drift}px)`,
        fontSize: 64,
      }}
    >
      👉
    </div>
  );
};
