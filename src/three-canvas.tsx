import React from "react";
import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./scene";

export function ThreeCanvas() {
  return (
    <Canvas>
      <CameraControls />
      <Scene />
    </Canvas>
  );
}
