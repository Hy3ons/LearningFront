import * as THREE from "three";

export interface IBallProps {
  ballOptions: {
    posVector: THREE.Vector3;
    radius: number;
    color: string;
    dirVector: THREE.Vector3;
    ballIdx: number;
    velocity: number;
  };

  envOptions: {
    isDebug: boolean;
  };
}
