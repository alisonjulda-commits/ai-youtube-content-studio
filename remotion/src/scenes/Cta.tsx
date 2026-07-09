import React from "react";
import { AbsoluteFill } from "remotion";
import { TextCard } from "../TextCard";

export const Cta: React.FC = () => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      padding: 90,
      gap: 40,
    }}
  >
    <TextCard fontSize={50} fontWeight={600} maxWidth={820}>
      You are not your own — you were bought at a price.
    </TextCard>
    <TextCard fontSize={40} fontWeight={700} delay={45} color="#8a6a3c">
      Follow for more biblical self-care 🙏
    </TextCard>
  </AbsoluteFill>
);
