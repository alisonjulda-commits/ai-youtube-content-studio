import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TextCard } from "../TextCard";
import { Decorations } from "../graphics/Decorations";
import { PrayerIcon, ArrowIcon } from "../graphics/Icons";
import { AccentLine } from "../graphics/Accent";
import { SCENES, voiceoverPath } from "../timing";

const [statement, follow] = SCENES.cta.lines;

export const Cta: React.FC = () => (
  <>
    <Sequence from={statement.from} durationInFrames={statement.durationInFrames} layout="none">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
        <Decorations duration={statement.durationInFrames} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <AccentLine position="top" delay={8} />
          <TextCard fontSize={50} fontWeight={600} maxWidth={820} delay={12}>
            You are not your own — you were bought at a price.
          </TextCard>
          <AccentLine position="bottom" delay={8} />
          <PrayerIcon delay={5} scale={1.1} />
        </div>

        <Audio src={staticFile(voiceoverPath(statement.id))} />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={follow.from} durationInFrames={follow.durationInFrames} layout="none">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
        <Decorations duration={follow.durationInFrames} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <ArrowIcon delay={5} scale={1.2} />
          <TextCard fontSize={40} fontWeight={700} color="#8a6a3c" delay={10}>
            Follow for more biblical self-care
          </TextCard>
          <ArrowIcon delay={15} scale={1} />
        </div>

        <Audio src={staticFile(voiceoverPath(follow.id))} />
      </AbsoluteFill>
    </Sequence>
  </>
);
