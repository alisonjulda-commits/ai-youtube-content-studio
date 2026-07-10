import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TextCard } from "../TextCard";
import { Decorations } from "../graphics/Decorations";
import { PrayerIcon } from "../graphics/Icons";
import { SCENES, voiceoverPath } from "../timing";

const [line] = SCENES.hook.lines;

export const Hook: React.FC = () => (
  <Sequence from={line.from} durationInFrames={line.durationInFrames} layout="none">
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <Decorations duration={line.durationInFrames} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        <PrayerIcon delay={5} scale={1.2} />
        <TextCard fontSize={88} fontWeight={700} delay={10}>
          Self-care isn't selfish.
        </TextCard>
      </div>

      <Audio src={staticFile(voiceoverPath(line.id))} />
    </AbsoluteFill>
  </Sequence>
);
