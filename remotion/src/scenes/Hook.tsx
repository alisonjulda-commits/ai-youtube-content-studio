import React from "react";
import { AbsoluteFill } from "remotion";
import { TextCard } from "../TextCard";

export const Hook: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
    <TextCard fontSize={88} fontWeight={700}>
      Self-care isn't selfish.
    </TextCard>
  </AbsoluteFill>
);
