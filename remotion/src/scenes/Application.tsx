import React from "react";
import { AbsoluteFill } from "remotion";
import { TextCard } from "../TextCard";

const STEPS = [
  "1. Say no to something that drains you — without guilt.",
  "2. Drink the water. Take the walk. Get the sleep.",
  "3. Remind yourself: caring for this body is caring for God's temple.",
];

const STEP_DELAY = 35; // frames between each step revealing

export const Application: React.FC = () => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      padding: 90,
      gap: 44,
    }}
  >
    {STEPS.map((step, i) => (
      <TextCard key={step} fontSize={46} fontWeight={600} maxWidth={820} delay={i * STEP_DELAY}>
        {step}
      </TextCard>
    ))}
  </AbsoluteFill>
);
