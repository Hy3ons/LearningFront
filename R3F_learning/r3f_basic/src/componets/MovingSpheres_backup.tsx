import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const makeRandomColor = (): string => {
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

export default function MovingSpheres() {
  const ballRadius = 0.2;
  const posVectors: THREE.Vector3[] = [];
  const dirVectors: THREE.Vector3[] = [];
  const ballRadiuses: number[] = [];
  const velocities: number[] = [];
  const ballCount = 70;
  const boundary = 4;
  const epslion: number = 0.0001;

  const debugMode: boolean = false;
  const mouseSphereVisualization: boolean = true;

  const pointSphereRadius = 0.8;
  const collisionAccelation = 1.4;

  const minVelocity = 0.01;
  const maxVelocity = 10;

  const groupRef = useRef<THREE.Group>(null);
  const pointerSphereRef = useRef<THREE.Mesh>(null);

  const { viewport, scene, pointer, camera } = useThree();

  const box = new THREE.Box3();
  const center = new THREE.Vector3();
  const size = new THREE.Vector3(viewport.width, viewport.height, 0);
  const boxBoundaryX = viewport.width / 2;
  const boxBoundaryY = viewport.height / 2;

  //중력가속도의 역할을 하는 백터
  const gravity = new THREE.Vector3(0, -0.003, 0);

  box.setFromCenterAndSize(center, size);

  for (let i = 0; i < ballCount; i++) {
    const BX = boxBoundaryX - epslion;
    const BY = boxBoundaryY - epslion;
    const ballX = THREE.MathUtils.randFloat(-BX, BX);
    const ballY = THREE.MathUtils.randFloat(-BY, BY);
    const randomRadius = THREE.MathUtils.randFloat(
      ballRadius,
      ballRadius + 0.2
    );

    const posVector = new THREE.Vector3(ballX, ballY);
    posVectors.push(posVector);

    const dirX = THREE.MathUtils.randFloat(-boundary, boundary);
    const dirY = THREE.MathUtils.randFloat(-boundary, boundary);

    const dirVector = new THREE.Vector3(dirX, dirY).divideScalar(10);
    dirVector.normalize();
    dirVectors.push(dirVector);

    velocities.push(THREE.MathUtils.randFloat(minVelocity, 0.03));
    ballRadiuses.push(randomRadius);
  }

  const accelation: number = 0.001;
  const loseVelocity: number = 0.01;
  const collisionRatio: number = 0.6;

  const checkCollision = (index: number, curMesh: THREE.Object3D) => {
    const group = groupRef.current;
    if (!group || !group.children.length) return;

    if (pointerSphereRef.current) {
      const point: THREE.Vector2 = pointer;
      const unprojectedPoint = new THREE.Vector3(point.x, point.y, 0);
      unprojectedPoint.unproject(camera);

      unprojectedPoint.z = 0;

      if (pointerSphereRef.current) {
        pointerSphereRef.current.position.set(
          unprojectedPoint.x,
          unprojectedPoint.y,
          unprojectedPoint.z
        );
      }

      const pointSphere: THREE.Mesh = pointerSphereRef.current;

      group.children.forEach((mesh: THREE.Object3D, idx: number) => {
        const dist = mesh.position.distanceTo(pointSphere.position);

        if (dist + epslion < pointSphereRadius + ballRadiuses[idx]) {
          const newDirVector = new THREE.Vector3().subVectors(
            mesh.position,
            pointSphere.position
          );
          newDirVector.normalize();

          dirVectors[idx] = newDirVector;

          const prevPos = mesh.position.clone();
          const newPos = pointSphere.position
            .clone()
            .add(
              newDirVector
                .clone()
                .multiplyScalar(pointSphereRadius + ballRadiuses[idx])
            );

          const newVelocity = newPos.distanceTo(prevPos) * collisionAccelation;
          velocities[idx] = Math.max(velocities[idx], newVelocity);
        }
      });
    }

    group.children.forEach((mesh: THREE.Object3D, idx: number) => {
      if (curMesh == mesh) return;

      const distance = mesh.position.distanceTo(curMesh.position);

      if (distance + epslion < ballRadiuses[idx] + ballRadiuses[index]) {
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

        // 볼이 겹쳤을 때, 절때로 그럴 일이 없게 미세하게 조정하는 부분./

        //curMesh -> mesh 로 가는 백터
        const dirVec = new THREE.Vector3().subVectors(
          mesh.position,
          curMesh.position
        );
        dirVec.normalize();

        const sub_vec1 = new THREE.Vector3().addVectors(
          mesh.position,
          dirVec.clone().multiplyScalar(-ballRadiuses[idx])
        );

        const sub_vec2 = new THREE.Vector3().addVectors(
          curMesh.position,
          dirVec.clone().multiplyScalar(ballRadiuses[index])
        );

        const middle = new THREE.Vector3()
          .addVectors(sub_vec1, sub_vec2)
          .multiplyScalar(0.5);

        mesh.position.addVectors(
          middle,
          dirVectors[idx].clone().multiplyScalar(ballRadiuses[idx])
        );
        curMesh.position.addVectors(
          middle,
          dirVectors[index].clone().multiplyScalar(ballRadiuses[index])
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

      const ballRadius = ballRadiuses[index];

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

      dirVectors[index].add(gravity).normalize();

      if (debugMode) {
        const arrowHelper: THREE.ArrowHelper = mesh
          .children[0] as THREE.ArrowHelper;
        arrowHelper.setDirection(dirVectors[index]);
        arrowHelper.setLength(velocities[index] * 20);
      }
    });
  });

  return (
    <>
      <box3Helper args={[box, "red"]} />
      <ambientLight args={[0xffffff, 0.8]} />

      <group ref={groupRef}>
        {
          //
          posVectors.length ? (
            posVectors.map((posVector: THREE.Vector3, index: number) => {
              const color = makeHSLRandomColor();

              return (
                <mesh position={posVector} key={"mesh_" + index}>
                  <sphereGeometry args={[ballRadiuses[index]]} />
                  <meshBasicMaterial color={debugMode ? "red" : color} />

                  {
                    //
                    debugMode ? (
                      <arrowHelper
                        args={[dirVectors[index], undefined, 1, "blue"]}
                      />
                    ) : (
                      <></>
                    )
                  }
                </mesh>
              );
            })
          ) : (
            <></>
          )
        }
      </group>

      <mesh ref={pointerSphereRef}>
        <sphereGeometry args={[pointSphereRadius]} />
        <meshBasicMaterial
          color={"hotpink"}
          transparent
          opacity={mouseSphereVisualization ? 1 : 0}
        />
      </mesh>
    </>
  );
}
