import "./css/App.css";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import { CameraControls } from "@react-three/drei";
import Curv from "./componets/three/Curv";
import Balls from "./componets/three/Balls";
import Dom from "./componets/Dom";

import { useRecoilState } from "recoil";
import { StepState } from "./common/interfaces/StepState";
import { atomCrntStep } from "./atoms/atoms";
import { useEffect, useRef, useState } from "react";

import CameraControlsType from "camera-controls";
import { CAM_LIMIT } from "./common/constants/AppConstants";
import ResponsiveAppBar from "./componets/ResponsiveAppBar";
import SecondText from "./componets/SecondText";

const isDebug: boolean = false;

function App() {
  const [crntStep] = useRecoilState<StepState>(atomCrntStep);
  const camConRef = useRef<CameraControlsType>(null);
  const [scrollY, setScrollYDelta] = useState<number>(0);

  function camConStart() {
    if (camConRef.current) {
      camConRef.current.mouseButtons.wheel = CameraControlsType.ACTION.NONE;
      camConRef.current.mouseButtons.right = CameraControlsType.ACTION.NONE;
    }
  }

  function wheelControl(e: React.WheelEvent<HTMLDivElement>) {
    setScrollYDelta(e.deltaY);
    camConStart();
  }

  useEffect(() => {
    if (camConRef.current) {
      if (crntStep >= StepState.STEP_1_AND_2) {
        camConRef.current.rotateTo(0, Math.PI / 2, true);
      }

      if (crntStep >= StepState.STEP_2) {
        camConRef.current.rotateTo(0, Math.PI / 2, false);
      }
    }
  }, [crntStep]);

  return (
    <div className="full-wrapper" onContextMenu={(e) => e.preventDefault()}>
      <ResponsiveAppBar />
      <SecondText onWheel={wheelControl} />
      <Dom scrollYDelta={scrollY} />
      <Canvas
        orthographic
        camera={{ zoom: CAM_LIMIT, position: [0, 0, 100] }}
        gl={{ alpha: true }}
        onWheel={wheelControl}
        // onCreated={(state) => {
        //   state.scene.background = new THREE.Color("white");
        // }}
      >
        {
          //
          crntStep <= StepState.STEP_1_AND_2 ? <Curv /> : <></>
        }

        {
          //
          crntStep >= StepState.STEP_1_AND_2 ? <Balls /> : <></>
        }

        <CameraControls
          ref={camConRef}
          minZoom={CAM_LIMIT}
          maxZoom={CAM_LIMIT}
        />

        {
          //
          isDebug ? (
            <gridHelper
              args={[50, 50]}
              rotation={[THREE.MathUtils.degToRad(90), 0, 0]}
            />
          ) : (
            <></>
          )
        }
      </Canvas>
    </div>
  );
}

export default App;
