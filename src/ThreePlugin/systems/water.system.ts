import { ECS } from "@/ecs";
import { ECSSystem } from "@/ecs/system";
import { WaterComponent } from "../components/water.component";
import { SceneComponent } from "../components/scene.component";
import { SkyComponent } from "../components/sky.component";

export class WaterSystem extends ECSSystem {
  private waterComponent!: WaterComponent;

  public init = (ecs: ECS) => {
    const waterEntity = ecs.createEntity("water"); // water entity

    this.waterComponent = new WaterComponent();
    waterEntity.addComponent(this.waterComponent);

    const mainEntity = ecs.getMainEntity();

    const sceneComponent = mainEntity.getComponent(SceneComponent)

    if (!sceneComponent) {
      throw new Error("WaterSystem: No scene component found.");
    }

    const { mainScene } = sceneComponent;

    mainScene.add(this.waterComponent.gerstnerWater);
  }

  public update = (ecs: ECS, deltaTime: number) => {
    this.waterComponent.gerstnerWater.updateDeltaTime(deltaTime);

    const skyComponent = ecs.getMainEntity().getComponent(SkyComponent);

    if (skyComponent) {
      this.waterComponent.gerstnerWater.updateSun(skyComponent.sun);
    }
  }
}
