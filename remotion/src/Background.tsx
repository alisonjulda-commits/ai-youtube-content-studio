import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { TOTAL_DURATION_IN_FRAMES } from "./timing";

// Slow, muted gradient drift so the frame never feels static, matching
// the "soft natural light, muted tones" production note in the script.
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [0, TOTAL_DURATION_IN_FRAMES], [0, 40]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${160 + shift}deg, #f3ece1 0%, #e7dcc9 45%, #d9c9ae 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)",
        }}
      />
    </AbsoluteFill>
  );
};
