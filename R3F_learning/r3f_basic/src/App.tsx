import "./App.css";
import { Canvas } from "@react-three/fiber";
import BearToHoney from "./BearToHoney";
import { CameraControls } from "@react-three/drei";
import { ThreeElement } from "./ThreeElement";
import MovingSphere from "./MovingSphere";
import * as THREE from "three";
import MovingSpheres from "./MovingSpheres";

function App() {
  return (
    <>
      <Canvas orthographic camera={{ zoom: 60, position: [0, 0, 100] }}>
        {/* <ThreeElement /> */}
        {/* <BearToHoney /> */}
        {/* <MovingSphere /> */}
        <MovingSpheres />
        <CameraControls />

        {/* <gridHelper
          args={[15, 15]}
          rotation={[THREE.MathUtils.degToRad(90), 0, 0]}
        /> */}
      </Canvas>
    </>
  );
}

export default App;
