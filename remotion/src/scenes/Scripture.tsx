import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TextCard } from "../TextCard";
import { Decorations } from "../graphics/Decorations";
import { BibleIcon, LightIcon } from "../graphics/Icons";
import { AccentLine } from "../graphics/Accent";
import { SCENES, voiceoverPath } from "../timing";

const [quote, reference] = SCENES.scripture.lines;

export const Scripture: React.FC = () => (
  <>
    <Sequence from={quote.from} durationInFrames={quote.durationInFrames} layout="none">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
        <Decorations duration={quote.durationInFrames} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          <BibleIcon delay={5} scale={1.3} />
          <AccentLine position="top" delay={8} />
          <TextCard fontSize={54} fontWeight={500} maxWidth={840} delay={12}>
            "Do you not know that your bodies are temples of the Holy Spirit...
            You were bought at a price. Therefore honor God with your bodies."
          </TextCard>
          <AccentLine position="bottom" delay={8} />
          <LightIcon delay={5} scale={1} />
        </div>

        <Audio src={staticFile(voiceoverPath(quote.id))} />
      </AbsoluteFill>
    </Sequence>
    <Sequence from={reference.from} durationInFrames={reference.durationInFrames} layout="none">
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
        <Decorations duration={reference.durationInFrames} />

        <TextCard fontSize={38} fontWeight={700} color="#8a6a3c" delay={10}>
          1 Corinthians 6:19–20
        </TextCard>

        <Audio src={staticFile(voiceoverPath(reference.id))} />
      </AbsoluteFill>
    </Sequence>
  </>
);
