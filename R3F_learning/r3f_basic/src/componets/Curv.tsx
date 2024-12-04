import * as THREE from "three";

import { Text, Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function Curv() {
  const textString = "Welcome to Solving Problem World";
  const points: THREE.Vector3[] = [];

  const xDivision = 12;
  const amplitude = 8;
  const MAX_DEGREE = 360;

  const xLength = MAX_DEGREE / xDivision / 2;

  for (let i = 0; i < MAX_DEGREE; i++) {
    const x = i / xDivision;
    const sin = Math.sin(THREE.MathUtils.degToRad(i)) * amplitude;
    const cos = Math.cos(THREE.MathUtils.degToRad(i)) * amplitude;

    const pos = new THREE.Vector3(x, sin, cos);
    points.push(pos);
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const curveCount = 3;
  const curvePointCount = textString.length - 1;
  const curvePoints = curve.getPoints(curvePointCount);

  const curves: THREE.Vector3[][] = [];

  for (let i = 0; i < curveCount; i++) {
    curves.push(curvePoints);
  }

  const curveGroupRef = useRef<THREE.Group>(null);

  const MIN_SIZE = 0.2;
  const MAX_SIZE = 1.7;

  const rotationSpeed = 0.009;

  useFrame(() => {
    if (curveGroupRef.current) {
      curveGroupRef.current.rotation.x += rotationSpeed;

      curveGroupRef.current.children.forEach((group: THREE.Object3D) => {
        group.children.forEach((text: THREE.Object3D) => {
          const pos = new THREE.Vector3();
          text.getWorldPosition(pos);

          const siz = THREE.MathUtils.mapLinear(
            pos.z,
            -amplitude,
            amplitude,
            MIN_SIZE,
            MAX_SIZE
          );

          text.scale.set(siz, siz, siz);
        });
      });
    }
  });

  return (
    <>
      <group ref={curveGroupRef} position={[-xLength, 0, 0]}>
        {
          //
          curves.length ? (
            curves.map((curve: THREE.Vector3[], index: number) => {
              return (
                <group rotation={[(Math.PI * 2 * index) / curveCount, 0, 0]}>
                  {curve.length ? (
                    curve.map((pos: THREE.Vector3, idx: number) => {
                      return (
                        <Billboard position={pos}>
                          <Text color={"white"}>{textString[idx]}</Text>
                        </Billboard>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </group>
              );
            })
          ) : (
            <></>
          )
        }
      </group>
    </>
  );
}
