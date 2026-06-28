import { ECSComponent } from "@/ecs/component";
import { Color, Fog, Scene } from "three";

export class SceneComponent extends ECSComponent {
  public readonly mainScene: Scene

  public readonly fogParams = {
    color: '#C0BBB9',
    near: 100,
    far: 600,
    enabled: true,
  };

  constructor() {
    super();

    this.mainScene = new Scene();
    this.mainScene.fog = new Fog(this.fogParams.color, this.fogParams.near, this.fogParams.far);
  }

  public updateFog() {
    if (!this.fogParams.enabled) {
      this.mainScene.fog = null;
      return;
    }
    const fog = this.mainScene.fog as Fog;
    if (!fog) {
      this.mainScene.fog = new Fog(this.fogParams.color, this.fogParams.near, this.fogParams.far);
    } else {
      fog.color = new Color(this.fogParams.color);
      fog.near = this.fogParams.near;
      fog.far = this.fogParams.far;
    }
  }
}