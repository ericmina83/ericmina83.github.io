import { useGLTF } from "@react-three/drei";
import React, { forwardRef, useEffect, useMemo } from "react";
import { Euler, Group, Mesh, MeshStandardMaterial, Object3DEventMap, Vector2, Vector3 } from "three";

import boatUrl from "@/Assets/Models/boat.glb?url";
import { PerlinNoise } from "@/ThreePlugin/PerlinNoise";

// function easeInOutSine(x: number): number {
//   return -(Math.cos(Math.PI * x) - 1) / 2;
// }

export class BoatController {
  private position = new Vector3(0, -10, 0);

  private direction = new Vector2(1, 1);

  private t = 0

  private perlinNoise = new PerlinNoise(16);

  constructor(private readonly boat: Group<Object3DEventMap>) {
    this.boat.position.copy(this.position);
    this.boat.scale.setScalar(360);
  }
}

interface Props {
  position?: Vector3;
  rotation?: Euler;
}

export const Boat = forwardRef<BoatController, Props>((props, ref) => {
  const gltf = useGLTF(boatUrl);


  const boatController = useMemo(() => {
    return new BoatController(gltf.scene);
  }, [gltf]);

  useEffect(() => {
    gltf.scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      // mesh.castShadow = true;
      // mesh.receiveShadow = true;
      const material = mesh.material as MeshStandardMaterial;
      if (!material.isMeshStandardMaterial) return;
      // material.transparent = false;
    })
  }, [gltf])

  useEffect(() => {
    if (typeof ref === "function") {
      ref(boatController);
    } else if (ref) {
      ref.current = boatController;
    }
  }, [ref, boatController]);

  useEffect(() => {
    if (props.position) {
      gltf.scene.position.copy(props.position);
    }
  }, [props.position]);

  useEffect(() => {
    if (props.rotation) {
      gltf.scene.rotation.copy(props.rotation);
    }
  }, [props.rotation]);

  return <primitive object={gltf.scene} />;
});
