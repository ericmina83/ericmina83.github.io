import { ECSComponent } from "@/ecs/component";
import { Fog, Scene } from "three";

export class SceneComponent extends ECSComponent {
  public readonly mainScene: Scene

  constructor() {
    super();

    this.mainScene = new Scene();
    this.mainScene.fog = new Fog(0xC0BBB9, 0, 300);
  }
}