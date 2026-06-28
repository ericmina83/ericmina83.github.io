import { Object3D } from "three";

export interface ITickable {
  tick(deltaTime: number): void;
}