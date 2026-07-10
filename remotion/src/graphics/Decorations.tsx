import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const Decorations: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const rotation = interpolate(frame, [0, duration], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cornerOpacity = interpolate(frame, [0, 10, duration - 10, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill pointerEvents="none">
      {/* Top-left corner decoration */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: 60,
          height: 60,
          border: "2px solid rgba(198, 170, 140, 0.3)",
          borderRadius: "50%",
          opacity: cornerOpacity,
        }}
      />

      {/* Top-right corner decoration */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 60,
          height: 60,
          border: "2px solid rgba(198, 170, 140, 0.3)",
          borderRadius: "50%",
          opacity: cornerOpacity,
        }}
      />

      {/* Bottom-left corner decoration */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          width: 60,
          height: 60,
          border: "2px solid rgba(198, 170, 140, 0.3)",
          borderRadius: "50%",
          opacity: cornerOpacity,
        }}
      />

      {/* Bottom-right corner decoration */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          border: "2px solid rgba(198, 170, 140, 0.3)",
          borderRadius: "50%",
          opacity: cornerOpacity,
        }}
      />

      {/* Center rotating circle */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 80,
          height: 80,
          marginLeft: -40,
          marginTop: -40,
          border: "1px solid rgba(198, 170, 140, 0.15)",
          borderRadius: "50%",
          transform: `rotate(${rotation}deg)`,
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};
