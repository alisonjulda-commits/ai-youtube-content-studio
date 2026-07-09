import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Background } from "./Background";
import { SCENES } from "./timing";
import { Hook } from "./scenes/Hook";
import { Scripture } from "./scenes/Scripture";
import { Teaching } from "./scenes/Teaching";
import { Application } from "./scenes/Application";
import { Cta } from "./scenes/Cta";

// Each scene component places its own per-line Sequences relative to its
// own start (see SCENES.*.lines[].from in timing.ts), so it must be
// wrapped here at its scene-level absolute start frame.
export const Script04: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />

      <Sequence from={SCENES.hook.from} durationInFrames={SCENES.hook.durationInFrames} layout="none">
        <Hook />
      </Sequence>
      <Sequence
        from={SCENES.scripture.from}
        durationInFrames={SCENES.scripture.durationInFrames}
        layout="none"
      >
        <Scripture />
      </Sequence>
      <Sequence
        from={SCENES.teaching.from}
        durationInFrames={SCENES.teaching.durationInFrames}
        layout="none"
      >
        <Teaching />
      </Sequence>
      <Sequence
        from={SCENES.application.from}
        durationInFrames={SCENES.application.durationInFrames}
        layout="none"
      >
        <Application />
      </Sequence>
      <Sequence from={SCENES.cta.from} durationInFrames={SCENES.cta.durationInFrames} layout="none">
        <Cta />
      </Sequence>

      <Audio src={staticFile("music.mp3")} />
    </AbsoluteFill>
  );
};
