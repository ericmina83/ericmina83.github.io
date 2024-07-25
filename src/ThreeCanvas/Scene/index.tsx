import React, { useRef, useState } from "react";
import { Sky, useHelper } from "@react-three/drei";

import { DirectionalLight, DirectionalLightHelper, Vector3 } from "three";
import { Boat, BoatController } from "./Boat";
import { button, useControls } from 'leva'
import { useFrame } from "@react-three/fiber";
import { Ocean } from "./Ocean";
// import { EffectComposer, N8AO } from "@react-three/postprocessing";

export const Scene: React.FC = () => {
  const boatRef = useRef<BoatController>(null);

  const [printCameraData, setPrintCameraData] = useState(false)

  useControls("test", {
    button: button(() => { { setPrintCameraData(true) } })
  })

  const lightRef = useRef<DirectionalLight>(null!)

  useHelper(lightRef, DirectionalLightHelper, 5, "red")

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

      <directionalLight position={new Vector3(15, 15, 15)}
        castShadow
        intensity={2}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={0.001}
        ref={lightRef} />

      <ambientLight intensity={1.5} />

      <Boat ref={boatRef} />

      <Ocean size={500} />
    </>
  );
}
