import * as THREE from "three";

export const epslion: number = 0.0001;
export const pointerSphereRadius = 1.4;

export const MIN_BALL_RADIUS = 0.2;
export const MAX_BALL_RADIUS = 0.7;

export const BALL_AMOUNT = 70;

export const accelation: number = 0.001;
export const loseVelocity: number = 0.1;

//충돌시, 변화하는 속력 비율
export const collisionRatio: number = 0.6;
export const origin = new THREE.Vector3();

//포인터 원과 충돌시 바뀐 속력
export const pointerCollisionRatio: number = 1.6;

export const minVelocity = 0.01;
export const maxVelocity = 3;

export const gravity = new THREE.Vector3(0, -0.003, 0);
export const boundary = 4;

export const debugMode: boolean = false;
export const mouseSphereVisualization: boolean = true;
