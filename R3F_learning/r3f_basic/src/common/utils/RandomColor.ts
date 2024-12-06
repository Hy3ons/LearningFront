import * as THREE from "three";
import { StepState } from "../interfaces/StepState";

export const makeRandomColor = (): string => {
  const r = THREE.MathUtils.randInt(0, 255);
  const g = THREE.MathUtils.randInt(0, 255);
  const b = THREE.MathUtils.randInt(0, 255);

  return `rgb(${r},${g},${b})`;
};

export const makeHSLRandomColor = (): string => {
  const h = THREE.MathUtils.randInt(200, 240);
  const s = THREE.MathUtils.randInt(60, 100);
  const l = THREE.MathUtils.randInt(20, 100);

  return `hsl(${h},${s}%,${l}%)`;
};

export const stepToString = (step: StepState): string => {
  return ["NONE", "STEP_1", "STEP_1_AND_2", "STEP_2", "STEP_2_AND_3", "STEP_3"][
    step
  ];
};
