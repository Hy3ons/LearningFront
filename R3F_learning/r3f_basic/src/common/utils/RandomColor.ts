import * as THREE from "three";

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
