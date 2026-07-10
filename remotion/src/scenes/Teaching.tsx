import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TextCard } from "../TextCard";
import { Decorations } from "../graphics/Decorations";
import { LightIcon } from "../graphics/Icons";
import { AccentLine } from "../graphics/Accent";
import { SCENES, voiceoverPath } from "../timing";

const TEXT: Record<string, string> = {
  "teach-1": "Stewardship means taking care of what God has entrusted to you.",
  "teach-2": "Your time. Your energy. Your body. Your peace.",
  "teach-3": "When you rest, you're not being lazy — you're maintaining the temple.",
  "teach-4":
    "Self-care rooted in scripture is about honoring the vessel God is using for His purpose.",
};

export const Teaching: React.FC = () => (
  <>
    {SCENES.teaching.lines.map((line) => (
      <Sequence key={line.id} from={line.from} durationInFrames={line.durationInFrames} layout="none">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
          <Decorations duration={line.durationInFrames} />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 25 }}>
            <AccentLine position="top" delay={8} />
            <TextCard fontSize={60} fontWeight={600} maxWidth={860} delay={12}>
              {TEXT[line.id]}
            </TextCard>
            <AccentLine position="bottom" delay={8} />
            <LightIcon delay={5} scale={0.9} />
          </div>

          <Audio src={staticFile(voiceoverPath(line.id))} />
        </AbsoluteFill>
      </Sequence>
    ))}
  </>
);
