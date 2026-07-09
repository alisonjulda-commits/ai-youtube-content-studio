import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TextCard } from "../TextCard";
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
          <TextCard fontSize={50} fontWeight={600} maxWidth={820}>
            {TEXT[line.id]}
          </TextCard>
          <Audio src={staticFile(voiceoverPath(line.id))} />
        </AbsoluteFill>
      </Sequence>
    ))}
  </>
);
