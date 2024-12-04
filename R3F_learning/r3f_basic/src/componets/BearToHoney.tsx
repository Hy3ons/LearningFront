import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function reflectX(num: number): boolean {
  console.log(num);
  if (Math.abs(num - 6) <= 0.3 || Math.abs(num + 6) <= 0.3) return true;
  return false;
}

export default function BearToHoney() {
  const bearTexture = useLoader(THREE.TextureLoader, "/bear.png");
  const honeyTexture = useLoader(THREE.TextureLoader, "/honey.png");

  const bearVec = new THREE.Vector3(
    THREE.MathUtils.randFloat(-5, 5),
    THREE.MathUtils.randFloat(-5, 5),
    0
  );

  const honeyVec = new THREE.Vector3(
    THREE.MathUtils.randFloat(-5, 5),
    THREE.MathUtils.randFloat(-5, 5),
    0
  );

  const bearToHoney = honeyVec.clone().sub(bearVec);
  const bearRef = useRef<THREE.Sprite>(null);

  const desireTime = 1;
  const desireFrame = desireTime * 60;

  bearToHoney.divideScalar(desireFrame);

  useFrame(() => {
    const bearObj = bearRef.current;

    if (bearObj) {
      if (reflectX(bearObj.position.x)) {
        bearToHoney.x = -bearToHoney.x;
      }
      if (reflectX(bearObj.position.y)) {
        bearToHoney.y = -bearToHoney.y;
      }

      bearObj.position.add(bearToHoney);
    }
  });

  return (
    <>
      <sprite ref={bearRef} position={bearVec}>
        <spriteMaterial />
        <spriteMaterial map={bearTexture} transparent />
      </sprite>

      <sprite position={honeyVec}>
        <spriteMaterial />
        <spriteMaterial map={honeyTexture} transparent />
      </sprite>
    </>
  );
}
