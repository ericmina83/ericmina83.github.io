import type { ECS } from "@/ecs";
import { ECSSystem } from "@/ecs/system";
import { SceneComponent } from "../components/scene.component";

export class SceneSystem extends ECSSystem {
  public init = (ecs: ECS) => {
    const entity = ecs.getMainEntity();

    entity.addComponent(new SceneComponent());
  }


  public update?: undefined;
}