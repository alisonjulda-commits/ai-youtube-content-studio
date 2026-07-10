import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TextCard } from "../TextCard";
import { Decorations } from "../graphics/Decorations";
import { HeartIcon } from "../graphics/Icons";
import { AccentLine } from "../graphics/Accent";
import { SCENES, voiceoverPath } from "../timing";

const TEXT: Record<string, string> = {
  "app-1": "1. Say no to something that drains you — without guilt.",
  "app-2": "2. Drink the water. Take the walk. Get the sleep.",
  "app-3": "3. Remind yourself: caring for this body is caring for God's temple.",
};

export const Application: React.FC = () => (
  <>
    {SCENES.application.lines.map((line) => (
      <Sequence key={line.id} from={line.from} durationInFrames={line.durationInFrames} layout="none">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90 }}>
          <Decorations duration={line.durationInFrames} />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 25 }}>
            <AccentLine position="top" delay={8} />
            <TextCard fontSize={50} fontWeight={600} maxWidth={820} delay={12}>
              {TEXT[line.id]}
            </TextCard>
            <AccentLine position="bottom" delay={8} />
            <HeartIcon delay={5} scale={1.1} />
          </div>

          <Audio src={staticFile(voiceoverPath(line.id))} />
        </AbsoluteFill>
      </Sequence>
    ))}
  </>
);
