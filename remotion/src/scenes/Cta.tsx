import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TextCard } from "../TextCard";
import { SCENES, voiceoverPath } from "../timing";

const [statement, follow] = SCENES.cta.lines;

export const Cta: React.FC = () => (
  <>
    <Sequence from={statement.from} durationInFrames={statement.durationInFrames} layout="none">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
        <TextCard fontSize={50} fontWeight={600} maxWidth={820}>
          You are not your own — you were bought at a price.
        </TextCard>
        <Audio src={staticFile(voiceoverPath(statement.id))} />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={follow.from} durationInFrames={follow.durationInFrames} layout="none">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
        <TextCard fontSize={40} fontWeight={700} color="#8a6a3c">
          Follow for more biblical self-care 🙏
        </TextCard>
        <Audio src={staticFile(voiceoverPath(follow.id))} />
      </AbsoluteFill>
    </Sequence>
  </>
);
