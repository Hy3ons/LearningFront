import "./App.css";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import MovingSpheres from "./MovingSpheres";

const isDebug: boolean = false;

function App() {
  return (
    <>
      <Canvas orthographic camera={{ zoom: 60, position: [0, 0, 100] }}>
        <MovingSpheres />

        {/* <color attach={"background"} args={["gray"]} /> */}
        {/* <CameraControls /> */}

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
