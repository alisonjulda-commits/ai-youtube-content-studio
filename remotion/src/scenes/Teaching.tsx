import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TextCard } from "../TextCard";

const LINES = [
  "Stewardship means taking care of what God has entrusted to you.",
  "Your time. Your energy. Your body. Your peace.",
  "When you rest, you're not being lazy — you're maintaining the temple.",
  "Self-care rooted in scripture is about honoring the vessel God is using for His purpose.",
];

const SLOT = Math.floor((23 * 30) / LINES.length); // 23s teaching beat, evenly split

export const Teaching: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
    {LINES.map((line, i) => (
      <Sequence key={line} from={i * SLOT} durationInFrames={SLOT} layout="none">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <TextCard fontSize={60} fontWeight={600} maxWidth={860}>
            {line}
          </TextCard>
        </AbsoluteFill>
      </Sequence>
    ))}
  </AbsoluteFill>
);
