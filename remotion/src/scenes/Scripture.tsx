import React from "react";
import { AbsoluteFill } from "remotion";
import { TextCard } from "../TextCard";

export const Scripture: React.FC = () => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      padding: 90,
      gap: 36,
    }}
  >
    <TextCard fontSize={54} fontWeight={500} maxWidth={840}>
      "Do you not know that your bodies are temples of the Holy Spirit... You
      were bought at a price. Therefore honor God with your bodies."
    </TextCard>
    <TextCard fontSize={38} fontWeight={700} delay={45} color="#8a6a3c">
      1 Corinthians 6:19–20
    </TextCard>
  </AbsoluteFill>
);
