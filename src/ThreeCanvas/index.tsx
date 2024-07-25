import React from "react";
import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";

export function ThreeCanvas() {
  return (
    <Canvas
      shadows
      // gl={{ antialias: false }}
      camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 10000 }}
      // onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
    >
      <color attach={"background"} args={["black"]} />
      <CameraControls />
      <Scene />
    </Canvas>
  );
}
