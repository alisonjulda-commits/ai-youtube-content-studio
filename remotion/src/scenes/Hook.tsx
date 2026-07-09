import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TextCard } from "../TextCard";
import { SCENES, voiceoverPath } from "../timing";

const [line] = SCENES.hook.lines;

export const Hook: React.FC = () => (
  <Sequence from={line.from} durationInFrames={line.durationInFrames} layout="none">
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
      <TextCard fontSize={88} fontWeight={700}>
        Self-care isn't selfish.
      </TextCard>
      <Audio src={staticFile(voiceoverPath(line.id))} />
    </AbsoluteFill>
  </Sequence>
);
