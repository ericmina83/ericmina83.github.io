import { ECS } from "@/ecs";
import { ECSSystem } from "@/ecs/system";
import { BoatComponent } from "../components/boat.component";
import { LoaderComponent } from "../components/loader.component";

export class BoatSystem extends ECSSystem {
  public init = (ecs: ECS) => {
    const mainEntity = ecs.getMainEntity();

    const loaderComponent = mainEntity.getComponent(LoaderComponent);

    if (!loaderComponent) {
      throw new Error('No loader component in main entity');
    }

    const boatGLTF = loaderComponent.modelMap['boat'];

    if (!boatGLTF) {
      throw new Error('No boat gltf');
    }

    const boatEntity = ecs.createEntity("boat");

    boatEntity.addComponent(new BoatComponent());

  }

  public update = (ecs: ECS, delta: number) => {


  }
}