import { ECSSystem } from "@/ecs/system";
import { SkyComponent } from "../components/sky.component";
import type { ECS } from "@/ecs";
import { ThreeComponent } from "../components/three.component";
import { SceneComponent } from "../components/scene.component";


export class SkySystem extends ECSSystem {

  private skyComponent!: SkyComponent;

  public init = (ecs: ECS) => {
    const entity = ecs.getMainEntity();

    const threeComponent = entity.getComponent(ThreeComponent);


    if (!threeComponent) {
      throw new Error("SkySystem: No ThreeComponent found.");
    }

    const sceneComponent = entity.getComponent(SceneComponent);

    if (!sceneComponent) {
      throw new Error("SkySystem: No SceneComponent found.");
    }

    this.skyComponent = new SkyComponent(sceneComponent.mainScene, threeComponent.pmremGenerator);

    entity.addComponent(this.skyComponent);
  }

  public update = () => {
    this.skyComponent.updateSun();
  }
}