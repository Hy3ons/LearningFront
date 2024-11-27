import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function BearToHoney() {
  const bearTexture = useLoader(THREE.TextureLoader, "/bear.png");
  const honeyTexture = useLoader(THREE.TextureLoader, "/honey.png");

  const bearVec = new THREE.Vector3(-6, 3, 0);
  const honeyVec = new THREE.Vector3(2, 4, 0);

  const bearToHoney = honeyVec.clone().sub(bearVec);
  const bearRef = useRef<THREE.Sprite>(null);
  bearToHoney.normalize().divideScalar(60);

  useFrame((state, delta) => {
    const bearObj = bearRef.current;

    if (bearObj) {
      bearObj.position.add(bearToHoney);
    }
  });

  return (
    <>
      <gridHelper
        args={[30, 30]}
        rotation={[THREE.MathUtils.degToRad(90), 0, 0]}
      />

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
