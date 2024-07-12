import { useGLTF } from "@react-three/drei";
import React, { forwardRef, useEffect, useMemo } from "react";
import { Euler, Group, Mesh, MeshStandardMaterial, Object3DEventMap, Vector2, Vector3 } from "three";
import boatUrl from "./models/boat.glb?url";
import { useFrame } from "@react-three/fiber";

export class BoatController {
  private position = new Vector3(0, -10, 0);

  private direction = new Vector2(1, 1);

  private t = 0

  constructor(private readonly boat: Group<Object3DEventMap>) {
    this.boat.position.copy(this.position);
    this.boat.scale.setScalar(360);
  }

  update(delta: number): void {
    this.t += delta * 0.5
    this.boat.position.add(new Vector3(0, -10, 0));

    const sample = this.direction * this.t;
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

  useFrame((_, delta) => {
    console.log(delta)
  })

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
