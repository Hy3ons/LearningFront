import * as THREE from "three";

export function ThreeElement() {
  const vecA = new THREE.Vector3(3, 4, 0);
  const origin = new THREE.Vector3(0, 0, 0);

  vecA.add(new THREE.Vector3(2, 2, 3));

  const dis = origin.distanceTo(vecA);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <mesh rotation={[0, THREE.MathUtils.degToRad(25), 3]} position={vecA}>
        <sphereGeometry args={[0.5]} />
        <meshPhongMaterial color="blue" opacity={0.5} transparent={true} />
      </mesh>

      <gridHelper rotation={[THREE.MathUtils.degToRad(90), 0, 0]} />
      <arrowHelper args={[vecA.clone().normalize(), origin, dis, "blue"]} />
    </>
  );
}
