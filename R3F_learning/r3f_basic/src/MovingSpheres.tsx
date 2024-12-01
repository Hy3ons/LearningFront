import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const makeRandomColor = (): string => {
  const r = THREE.MathUtils.randInt(0, 255);
  const g = THREE.MathUtils.randInt(0, 255);
  const b = THREE.MathUtils.randInt(0, 255);

  return `rgb(${r},${g},${b})`;
};

export default function MovingSpheres() {
  const ballRadius = 0.2;
  const posVectors: THREE.Vector3[] = [];
  const dirVectors: THREE.Vector3[] = [];
  const velocities: number[] = [];
  const ballCount = 80;
  const boundary = 4;
  const epslion: number = 0.0001;

  const minVelocity = 0.01;
  const maxVelocity = 3;

  const groupRef = useRef<THREE.Group>(null);

  const { viewport } = useThree();

  const box = new THREE.Box3();
  const center = new THREE.Vector3();
  const size = new THREE.Vector3(viewport.width, viewport.height, 0);
  const boxBoundaryX = viewport.width / 2;
  const boxBoundaryY = viewport.height / 2;

  box.setFromCenterAndSize(center, size);

  for (let i = 0; i < ballCount; i++) {
    const BX = boxBoundaryX - epslion;
    const BY = boxBoundaryY - epslion;
    const ballX = THREE.MathUtils.randFloat(-BX, BX);
    const ballY = THREE.MathUtils.randFloat(-BY, BY);

    const posVector = new THREE.Vector3(ballX, ballY);
    posVectors.push(posVector);

    const dirX = THREE.MathUtils.randFloat(-boundary, boundary);
    const dirY = THREE.MathUtils.randFloat(-boundary, boundary);

    const dirVector = new THREE.Vector3(dirX, dirY).divideScalar(10);
    dirVector.normalize();
    dirVectors.push(dirVector);

    velocities.push(THREE.MathUtils.randFloat(minVelocity, 0.03));
  }

  const accelation: number = 0.001;
  const loseVelocity: number = 0.01;
  const collisionRatio: number = 0.6;

  const checkCollision = (index: number, curMesh: THREE.Object3D) => {
    const group = groupRef.current;
    if (!group || !group.children.length) return;

    group.children.forEach((mesh: THREE.Object3D, idx: number) => {
      if (curMesh == mesh) return;

      const distance = mesh.position.distanceTo(curMesh.position);

      if (distance + epslion < ballRadius * 2) {
        const dir1 = new THREE.Vector3()
          .subVectors(curMesh.position, mesh.position)
          .normalize();
        const dir2 = dir1.clone().multiplyScalar(-1);

        dirVectors[index] = dir1;
        dirVectors[idx] = dir2;

        velocities[index] = Math.max(
          velocities[index] * collisionRatio,
          minVelocity
        );
        velocities[idx] = Math.max(
          velocities[idx] * collisionRatio,
          minVelocity
        );

        const middle = new THREE.Vector3()
          .addVectors(mesh.position, curMesh.position)
          .multiplyScalar(0.5);

        mesh.position.addVectors(
          middle,
          dirVectors[idx].clone().multiplyScalar(ballRadius)
        );
        curMesh.position.addVectors(
          middle,
          dirVectors[index].clone().multiplyScalar(ballRadius)
        );
      }
    });
  };

  useFrame(() => {
    const group = groupRef.current;
    if (!group || !group.children.length) return;

    group.children.forEach((mesh: THREE.Object3D, index: number) => {
      const x = mesh.position.x;
      const y = mesh.position.y;

      checkCollision(index, mesh);

      if (Math.abs(x) > boxBoundaryX - ballRadius - epslion) {
        dirVectors[index].x *= -1;
        velocities[index] = Math.max(
          minVelocity,
          velocities[index] - loseVelocity
        );
      }

      if (Math.abs(y) > boxBoundaryY - ballRadius - epslion) {
        dirVectors[index].y *= -1;
        velocities[index] = Math.max(
          minVelocity,
          velocities[index] - loseVelocity
        );
      }

      velocities[index] = Math.min(velocities[index] + accelation, maxVelocity);

      const dirVector = dirVectors[index]
        .clone()
        .multiplyScalar(velocities[index]);
      mesh.position.add(dirVector);

      mesh.position.x = Math.max(
        -boxBoundaryX + ballRadius,
        Math.min(boxBoundaryX - ballRadius, mesh.position.x)
      );

      mesh.position.y = Math.max(
        -boxBoundaryY + ballRadius,
        Math.min(boxBoundaryY - ballRadius, mesh.position.y)
      );

      const arrowHelper: THREE.ArrowHelper = mesh
        .children[0] as THREE.ArrowHelper;
      arrowHelper.setDirection(dirVectors[index]);
      arrowHelper.setLength(velocities[index] * 20);
    });
  });

  return (
    <>
      <box3Helper args={[box, "red"]} />
      <ambientLight args={["0xffffff", 0.8]} />

      <group ref={groupRef}>
        {
          //
          posVectors.length ? (
            posVectors.map((posVector: THREE.Vector3, index: number) => {
              const color = makeRandomColor();

              return (
                <mesh position={posVector} key={"mesh_" + index}>
                  <sphereGeometry args={[ballRadius]} />
                  <meshBasicMaterial color={color} />

                  <arrowHelper
                    args={[dirVectors[index], undefined, 1, "blue"]}
                  />
                </mesh>
              );
            })
          ) : (
            <></>
          )
        }
      </group>

      {/* many lack */}

      {/* <group>
        {
          //
          posVectors.length ? (
            posVectors.map((posVector: THREE.Vector3, index: number) => {
              return (
                <pointLight
                  position={posVector}
                  args={[makeRandomColor(), 0.8]}
                />
              );
            })
          ) : (
            <></>
          )
        }
      </group> */}
    </>
  );
}
