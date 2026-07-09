import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type TextCardProps = {
  children: React.ReactNode;
  delay?: number;
  fontSize?: number;
  maxWidth?: number;
  fontWeight?: number;
  color?: string;
};

// Gentle fade + rise entrance, matching the "warm, gentle, affirming" tone
// and "max 6–8 words per card" note from the script's production notes.
export const TextCard: React.FC<TextCardProps> = ({
  children,
  delay = 0,
  fontSize = 72,
  maxWidth = 880,
  fontWeight = 600,
  color = "#3a2f22",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - delay;

  const progress = spring({
    frame: local,
    fps,
    config: { damping: 200, stiffness: 120, mass: 0.6 },
  });

  const opacity = interpolate(local, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(progress, [0, 1], [24, 0]);

  return (
    <div
      style={{
        maxWidth,
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize,
        fontWeight,
        lineHeight: 1.25,
        color,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};
