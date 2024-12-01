import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import Background from "three/src/renderers/common/Background.js";

export default function MovingSphere() {
  const vecA = new THREE.Vector3(3, 2, 0);
  const vecB = new THREE.Vector3(-4, 6, 0);

  const vecC = new THREE.Vector3();
  vecC.subVectors(vecB, vecA);

  vecC.normalize();

  const ballA = useRef<THREE.Mesh>(null);
  const ballB = useRef<THREE.Mesh>(null);

  const dirVec = vecC.clone();
  dirVec.normalize();

  dirVec.divideScalar(10);

  const box = new THREE.Box3();
  const center = new THREE.Vector3();

  const size = new THREE.Vector3(10, 10, 0);

  box.setFromCenterAndSize(center, size);

  useFrame((state, delta) => {
    if (ballA.current) {
      const posA = ballA.current.position;
      const dist = posA.distanceTo(vecB);

      if (dist > 0.1) {
        ballA.current.position.add(dirVec);
      }
    }
  });

  return (
    <>
      <mesh ref={ballA} position={vecA}>
        <sphereGeometry args={[0.5]} />
        <meshBasicMaterial color={"red"} />
      </mesh>
      <mesh ref={ballB} position={vecB}>
        <sphereGeometry args={[0.5]} />
        <meshBasicMaterial color={"green"} />
      </mesh>

      <box3Helper args={[box, "red"]} />
    </>
  );
}
