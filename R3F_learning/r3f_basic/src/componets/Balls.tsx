import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import {
  pointerSphereRadius,
  epslion,
  MIN_BALL_RADIUS,
  MAX_BALL_RADIUS,
  BALL_AMOUNT,
  collisionRatio,
  minVelocity,
  origin,
  boundary,
  debugMode,
  mouseSphereVisualization,
} from "../common/constants/BallsConstants";
import Ball from "./Ball";
import { IBallProps } from "../common/interfaces/IBallProps";
import { makeHSLRandomColor } from "../common/utils/RandomColor";

export default function Balls() {
  const ballPropses: IBallProps[] = [];

  const groupRef = useRef<THREE.Group>(null);
  const pointerSphereRef = useRef<THREE.Mesh>(null);

  const { viewport, pointer, camera } = useThree();

  const box = new THREE.Box3();
  const center = new THREE.Vector3();
  const size = new THREE.Vector3(viewport.width, viewport.height, 0);
  const boxBoundaryX = viewport.width / 2;
  const boxBoundaryY = viewport.height / 2;

  //중력가속도의 역할을 하는 백터

  box.setFromCenterAndSize(center, size);

  for (let i = 0; i < BALL_AMOUNT; i++) {
    const BX = boxBoundaryX - epslion;
    const BY = boxBoundaryY - epslion;
    const ballX = THREE.MathUtils.randFloat(-BX, BX);
    const ballY = THREE.MathUtils.randFloat(-BY, BY);
    const posVector = new THREE.Vector3(ballX, ballY);

    const randomRadius = THREE.MathUtils.randFloat(
      MIN_BALL_RADIUS,
      MAX_BALL_RADIUS
    );

    const dirX = THREE.MathUtils.randFloat(-boundary, boundary);
    const dirY = THREE.MathUtils.randFloat(-boundary, boundary);
    const dirVector = new THREE.Vector3(dirX, dirY)
      .divideScalar(10)
      .normalize();

    const element: IBallProps = {
      ballOptions: {
        ballIdx: i,
        color: makeHSLRandomColor(),
        dirVector: dirVector,
        posVector: posVector,
        radius: randomRadius,
        velocity: THREE.MathUtils.randFloat(minVelocity, 0.03),
      },
      envOptions: {
        isDebug: debugMode,
      },
    };

    ballPropses.push(element);
  }

  const pointerSphereUpdate = () => {
    if (!pointerSphereRef.current) return;
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
  };

  const checkCollision = (index: number, curMesh: THREE.Object3D) => {
    const group = groupRef.current;
    if (!group || !group.children.length) return;

    const radius1 = ballPropses[index].ballOptions.radius;

    group.children.forEach((mesh: THREE.Object3D, idx: number) => {
      if (curMesh == mesh) return;

      const distance = mesh.position.distanceTo(curMesh.position);
      const radius2 = ballPropses[idx].ballOptions.radius;

      if (distance + epslion < radius1 + radius2) {
        const dir1 = new THREE.Vector3()
          .subVectors(curMesh.position, mesh.position)
          .normalize();
        const dir2 = dir1.clone().multiplyScalar(-1);

        ballPropses[index].ballOptions.dirVector.addVectors(origin, dir1);
        ballPropses[idx].ballOptions.dirVector.addVectors(origin, dir2);

        ballPropses[index].ballOptions.velocity = Math.max(
          ballPropses[index].ballOptions.velocity * collisionRatio,
          minVelocity
        );

        ballPropses[idx].ballOptions.velocity = Math.max(
          ballPropses[idx].ballOptions.velocity * collisionRatio,
          minVelocity
        );

        // 볼이 겹쳤을 때, 절때로 그럴 일이 없게 미세하게 조정하는 부분./

        //curMesh -> mesh 로 가는 백터
        const dirVec = new THREE.Vector3()
          .subVectors(mesh.position, curMesh.position)
          .normalize();

        const sub_vec1 = new THREE.Vector3().addVectors(
          mesh.position,
          dirVec.clone().multiplyScalar(-radius2)
        );

        const sub_vec2 = new THREE.Vector3().addVectors(
          curMesh.position,
          dirVec.clone().multiplyScalar(radius1)
        );

        //두 원의 중점백터 두 원의 반지름이 다르니, 복잡하게 계산해야함.
        const middle = new THREE.Vector3()
          .addVectors(sub_vec1, sub_vec2)
          .multiplyScalar(0.5);

        mesh.position.addVectors(
          middle,
          ballPropses[idx].ballOptions.dirVector.clone().multiplyScalar(radius2)
        );
        curMesh.position.addVectors(
          middle,
          ballPropses[index].ballOptions.dirVector
            .clone()
            .multiplyScalar(radius1)
        );
      }
    });
  };

  useFrame(() => {
    const group = groupRef.current;
    if (!group || !group.children.length) return;

    pointerSphereUpdate();

    group.children.forEach((mesh: THREE.Object3D, index: number) => {
      checkCollision(index, mesh);
    });
  });

  return (
    <>
      <box3Helper args={[box, "red"]} />
      <ambientLight args={[0xffffff, 0.8]} />

      <group ref={groupRef}>
        {
          //
          ballPropses.length ? (
            ballPropses.map((props: IBallProps) => {
              return (
                <>
                  <Ball
                    envOptions={props.envOptions}
                    ballOptions={props.ballOptions}
                  />
                </>
              );
            })
          ) : (
            <></>
          )
        }
      </group>

      <mesh ref={pointerSphereRef}>
        <sphereGeometry args={[pointerSphereRadius]} />
        <meshBasicMaterial
          color={"hotpink"}
          transparent
          opacity={mouseSphereVisualization ? 1 : 0}
        />
      </mesh>
    </>
  );
}
