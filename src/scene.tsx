import React, { useRef } from "react";
import { Box, Sky } from "@react-three/drei";
import Ocean from "./ocean";

import { Vector3 } from "three";
import { Boat, BoatController } from "./boat";

export function Scene() {
  const boatRef = useRef<BoatController>(null);

  return (
    <>
      <Sky />

      <directionalLight position={new Vector3(50, 50, 50)} />
      <hemisphereLight intensity={0.5} />

      <Boat ref={boatRef} />

      <Box args={[1, 1, 1, 1, 1, 1]} position={[3, -2, 3]} />

      <Ocean size={200} />
    </>
  );
}
