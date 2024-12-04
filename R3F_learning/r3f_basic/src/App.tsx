import "./css/App.css";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import { CameraControls } from "@react-three/drei";
import Curv from "./componets/Curv";
import Balls from "./componets/Balls";

const isDebug: boolean = false;

function App() {
  return (
    <>
      <Canvas orthographic camera={{ zoom: 30, position: [0, 0, 100] }}>
        <color attach={"background"} args={["black"]} />
        {/* <CameraControls /> */}
        <Balls />

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
    </>
  );
}

export default App;
