import { useRef, useState } from "react";
import { IBallProps } from "../../common/interfaces/IBallProps";
import * as THREE from "three";
import {
  accelation,
  epslion,
  gravity,
  loseVelocity,
  maxVelocity,
  minVelocity,
  origin,
  pointerCollisionRatio,
  pointerSphereRadius,
} from "../../common/constants/BallsConstants";
import { useFrame, useThree } from "@react-three/fiber";
import { useRecoilState } from "recoil";
import { StepState } from "../../common/interfaces/StepState";
import { atomCrntStep } from "../../atoms/atoms";
import { getScroll } from "../../common/utils/scrollData";
import { AppBarWindowHeight } from "../../common/constants/AppConstants";

export default function Ball(props: IBallProps) {
  const { posVector, radius, color, dirVector, ballIdx } = props.ballOptions;
  const { isDebug } = props.envOptions;
  const { viewport, pointer, camera, size } = useThree();

  const [crntStep] = useRecoilState<StepState>(atomCrntStep);

  const BallRef = useRef<THREE.Mesh>(null);
  const boxBoundaryX = viewport.width / 2;
  const boxBoundaryY = viewport.height / 2;

  const ratio = THREE.MathUtils.mapLinear(
    AppBarWindowHeight,
    0,
    size.height,
    0,
    100
  );
  const upBoundary = THREE.MathUtils.mapLinear(
    ratio,
    0,
    100,
    boxBoundaryY,
    -boxBoundaryY
  );

  const collisionWithPointer = (mesh: THREE.Object3D) => {
    const point: THREE.Vector2 = pointer;

    const pointSpherePos = new THREE.Vector3(point.x, point.y, 0);
    pointSpherePos.unproject(camera);
    pointSpherePos.z = 0;

    const dist = mesh.position.distanceTo(pointSpherePos);

    if (dist + epslion < pointerSphereRadius + radius) {
      const newDirVector = new THREE.Vector3()
        .subVectors(mesh.position, pointSpherePos)
        .normalize();

      dirVector.addVectors(origin, newDirVector);

      const prevPos = mesh.position.clone();
      const newPos = pointSpherePos
        .clone()
        .add(newDirVector.clone().multiplyScalar(pointerSphereRadius + radius));

      const newVelocity = newPos.distanceTo(prevPos) * pointerCollisionRatio;
      props.ballOptions.velocity = Math.max(
        props.ballOptions.velocity,
        newVelocity
      );
    }
  };

  const collisionWithBoundary = (mesh: THREE.Object3D) => {
    const x = mesh.position.x;
    const y = mesh.position.y;

    if (Math.abs(x) > boxBoundaryX - radius - epslion) {
      dirVector.x *= -1;
      props.ballOptions.velocity = Math.max(
        minVelocity,
        props.ballOptions.velocity - loseVelocity
      );
    }

    //responsive App bar에 의한 상한 감축
    if (y > upBoundary - radius - epslion) {
      dirVector.y *= -1;
      props.ballOptions.velocity = Math.max(
        minVelocity,
        props.ballOptions.velocity - loseVelocity
      );
    }

    if (Math.abs(y) > boxBoundaryY - radius - epslion) {
      dirVector.y *= -1;
      props.ballOptions.velocity = Math.max(
        minVelocity,
        props.ballOptions.velocity - loseVelocity
      );
    }

    props.ballOptions.velocity = Math.min(
      props.ballOptions.velocity + accelation,
      maxVelocity
    );

    mesh.position.add(
      dirVector.clone().multiplyScalar(props.ballOptions.velocity)
    );

    mesh.position.x = Math.max(
      -boxBoundaryX + radius,
      Math.min(boxBoundaryX - radius, mesh.position.x)
    );

    mesh.position.y = Math.max(
      -boxBoundaryY + radius,
      Math.min(upBoundary - radius, mesh.position.y)
    );
  };

  const arrowHelperUpdate = (mesh: THREE.Object3D) => {
    if (isDebug) {
      const arrowHelper: THREE.ArrowHelper = mesh
        .children[0] as THREE.ArrowHelper;
      arrowHelper.setDirection(dirVector);
      arrowHelper.setLength(props.ballOptions.velocity * 20);
    }
  };

  const [onlyOne, onlyOneSet] = useState<number>(0);
  const downVector = new THREE.Vector3(0, -1, 0);

  const affectGravity = () => {
    if (crntStep === StepState.STEP_3) {
      dirVector.add(gravity).normalize();

      if (!onlyOne) {
        onlyOneSet(1);
        props.ballOptions.velocity = 0;
        props.ballOptions.velocity += accelation * 15;
        dirVector.addVectors(origin, downVector);
      }
    } else {
      onlyOneSet(0);
    }
  };

  useFrame(() => {
    if (!BallRef.current) return;

    const mesh = BallRef.current;

    collisionWithPointer(mesh);
    collisionWithBoundary(mesh);
    arrowHelperUpdate(mesh);
    affectGravity();
  });

  const ops = THREE.MathUtils.mapLinear(getScroll(), 300, 720, 0, 1);

  return (
    <mesh ref={BallRef} position={posVector} key={"mesh_" + ballIdx}>
      <sphereGeometry args={[radius]} />
      <meshBasicMaterial
        color={props.envOptions.isDebug ? "red" : color}
        transparent
        opacity={ops}
      />

      {
        //
        props.envOptions.isDebug ? (
          <arrowHelper args={[dirVector, undefined, 1, "blue"]} />
        ) : (
          <></>
        )
      }
    </mesh>
  );
}
