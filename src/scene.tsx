import React, { useRef, useState } from "react";
import { Sky } from "@react-three/drei";
import Ocean from "./ocean";

import { Vector3 } from "three";
import { Boat, BoatController } from "./boat";
import { button, useControls } from 'leva'
import { useFrame } from "@react-three/fiber";
import { EffectComposer, N8AO } from "@react-three/postprocessing";

export function Scene() {
  const boatRef = useRef<BoatController>(null);

  const [printCameraData, setPrintCameraData] = useState(false)

  useControls("test", {
    button: button(() => { { setPrintCameraData(true) } })
  })

  useFrame(({ camera }) => {
    if (printCameraData) {
      const { position, rotation } = camera;
      console.log({ position, rotation })
      setPrintCameraData(false);
    }
  })

  return (
    <>
      <Sky />

      <directionalLight position={new Vector3(50, 50, 50)}
        castShadow
        intensity={2}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={0.001} />

      <ambientLight intensity={1.5} />

      <Boat ref={boatRef} />

      {/* <Ocean size={2000} /> */}

      <EffectComposer enableNormalPass={false}>
        <N8AO />
      </EffectComposer>
    </>
  );
}
