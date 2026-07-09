import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Background } from "./Background";
import { SCENES } from "./timing";
import { Hook } from "./scenes/Hook";
import { Scripture } from "./scenes/Scripture";
import { Teaching } from "./scenes/Teaching";
import { Application } from "./scenes/Application";
import { Cta } from "./scenes/Cta";

// To add voiceover: drop an audio file at public/voiceover.mp3 (matching
// the spoken lines in scripts/script-04-self-care-isnt-selfish-stewardship.md),
// then uncomment the import and <Audio /> line below.
// import { Audio, staticFile } from "remotion";

export const Script04: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />

      <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.durationInFrames}>
        <Hook />
      </Sequence>
      <Sequence from={SCENES.scripture.from} durationInFrames={SCENES.scripture.durationInFrames}>
        <Scripture />
      </Sequence>
      <Sequence from={SCENES.teaching.from} durationInFrames={SCENES.teaching.durationInFrames}>
        <Teaching />
      </Sequence>
      <Sequence
        from={SCENES.application.from}
        durationInFrames={SCENES.application.durationInFrames}
      >
        <Application />
      </Sequence>
      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.durationInFrames}>
        <Cta />
      </Sequence>

      {/* <Audio src={staticFile("voiceover.mp3")} /> */}
    </AbsoluteFill>
  );
};
