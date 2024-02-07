import { useGLTF } from "@react-three/drei";
import React, { forwardRef, useEffect, useMemo } from "react";
import { Euler, Group, Object3DEventMap, Vector3 } from "three";
import boatUrl from "./models/boat.glb?url";

export class BoatController {
  constructor(private readonly boat: Group<Object3DEventMap>) {
    this.boat.position.add(new Vector3(0, -10, 0));
    this.boat.scale.setScalar(360);
  }
}

interface Props {
  position?: Vector3;
  rotation?: Euler;
}

export const Boat = forwardRef<BoatController, Props>((props, ref) => {
  const { scene: boat } = useGLTF(boatUrl);

  const boatController = useMemo(() => {
    return new BoatController(boat);
  }, [boat]);

  useEffect(() => {
    if (typeof ref === "function") {
      ref(boatController);
    } else if (ref) {
      ref.current = boatController;
    }
  }, [ref, boatController]);

  useEffect(() => {
    if (props.position) {
      boat.position.copy(props.position);
    }
  }, [props.position]);

  useEffect(() => {
    if (props.rotation) {
      boat.rotation.copy(props.rotation);
    }
  }, [props.rotation]);

  return <primitive object={boat} />;
});
