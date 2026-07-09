import React from "react";
import { Composition } from "remotion";
import { Script04 } from "./Script04";
import { TOTAL_DURATION_IN_FRAMES, FPS } from "./timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Script04"
        component={Script04}
        durationInFrames={TOTAL_DURATION_IN_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
