import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

type AccentProps = {
  position?: "top" | "bottom" | "center";
  delay?: number;
  duration?: number;
};

export const AccentLine: React.FC<AccentProps> = ({
  position = "center",
  delay = 0,
  duration = 60,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;

  const scaleX = interpolate(local, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const positionMap = {
    top: "20%",
    center: "50%",
    bottom: "80%",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: positionMap[position],
        left: "50%",
        width: 200,
        height: 2,
        marginLeft: -100,
        marginTop: -1,
        background: "linear-gradient(90deg, transparent, rgba(198, 170, 140, 0.8), transparent)",
        transform: `scaleX(${scaleX})`,
        transformOrigin: "center",
      }}
    />
  );
};

export const DottedDivider: React.FC<AccentProps> = ({ delay = 0 }) => {
  const frame = useCurrentFrame();
  const local = frame - delay;

  const opacity = interpolate(local, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 100,
        marginLeft: -50,
        marginTop: -1,
        display: "flex",
        gap: 6,
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "rgba(198, 170, 140, 0.6)",
        }}
      />
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "rgba(198, 170, 140, 0.6)",
        }}
      />
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: "rgba(198, 170, 140, 0.6)",
        }}
      />
    </div>
  );
};
