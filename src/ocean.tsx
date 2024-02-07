import React from "react";
import { useThree } from "@react-three/fiber";
import waterVertex from "./water.vert";
import waterFragment from "./water.frag";

import { useDepthBuffer } from "@react-three/drei";

function Ocean({ size }: { size: number }) {
  const db = useDepthBuffer({
    size: 2048,
  });

  const { camera } = useThree();

  return (
    <mesh rotation-x={-Math.PI / 2} scale={[1, 1, 1]}>
      <planeGeometry args={[size, size, 1, 1]} />
      <shaderMaterial
        uniforms={{
          cameraNear: { value: camera.near },
          cameraFar: { value: camera.far },
          tDepth: { value: db },
        }}
        vertexShader={waterVertex}
        fragmentShader={waterFragment}
      />
    </mesh>
  );
}

export default Ocean;
