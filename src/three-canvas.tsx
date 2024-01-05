import { CameraControls, Sky } from "@react-three/drei";
import { extend, Canvas } from "@react-three/fiber";
import React from "react";

import { Water } from "three/examples/jsm/objects/Water.js";
import Ocean from "./ocean";

extend({ Water });

export function ThreeCanvas() {
  return (
    <Canvas>
      <CameraControls />
      <Sky />

      <mesh>
        <boxGeometry args={[1, 1, 1, 1, 1, 1]} />
        <meshStandardMaterial color={"#ff0000"} />
      </mesh>

      <Ocean />
    </Canvas>
  );
}
