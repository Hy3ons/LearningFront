import "./App.css";
import { Canvas } from "@react-three/fiber";
import BearToHoney from "./BearToHoney";
import { CameraControls } from "@react-three/drei";

function App() {
  return (
    <>
      <Canvas orthographic camera={{ zoom: 60, position: [0, 0, 100] }}>
        <BearToHoney />
        <CameraControls />
      </Canvas>
    </>
  );
}

export default App;
