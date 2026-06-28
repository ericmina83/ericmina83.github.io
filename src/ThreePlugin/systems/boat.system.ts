import { ECS } from "@/ecs";
import { ECSSystem } from "@/ecs/system";
import { BoatComponent } from "../components/boat.component";
import { LoaderComponent } from "../components/loader.component";
import { SceneComponent } from "../components/scene.component";
import { WaterComponent } from "../components/water.component";

export class BoatSystem extends ECSSystem {
  private boatComponent: BoatComponent | null = null;

  public init = undefined;

  public update = (ecs: ECS) => {
    const mainEntity = ecs.getMainEntity();

    if (!this.boatComponent) {
      const loaderComponent = mainEntity.getComponent(LoaderComponent);
      if (!loaderComponent) return;

      const boatGLTF = loaderComponent.modelMap['boat'];
      if (!boatGLTF) return;

      const sceneComponent = mainEntity.getComponent(SceneComponent);
      if (!sceneComponent) return;

      const boatEntity = ecs.createEntity("boat");
      this.boatComponent = new BoatComponent(sceneComponent.mainScene, boatGLTF);
      boatEntity.addComponent(this.boatComponent);
    }

    const [waterEntity] = ecs.getEntities([WaterComponent]);
    if (!waterEntity) return;

    const waterComponent = waterEntity.getComponent(WaterComponent);
    if (!waterComponent) return;

    this.boatComponent.update(waterComponent.gerstnerWater);
  }
}
