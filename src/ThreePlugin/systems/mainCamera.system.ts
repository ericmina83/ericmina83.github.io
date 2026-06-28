import type { ECS } from "@/ecs";
import { ECSSystem } from "@/ecs/system";
import { MainCameraComponent } from "../components/mainCamera.component";
import { ResizeComponent } from "../components/resize.component";
import { SceneComponent } from "../components/scene.component";
import { ThreeComponent } from "../components/three.component";

export class MainCameraSystem extends ECSSystem {
  private mainCameraComponent!: MainCameraComponent;

  public init = (ecs: ECS) => {
    const mainEntity = ecs.getMainEntity();

    this.mainCameraComponent = new MainCameraComponent();
    mainEntity.addComponent(this.mainCameraComponent);

    const threeComponent = mainEntity.getComponent(ThreeComponent);

    if (!threeComponent) {
      throw new Error("MainCameraSystem: No three entity found.");
    }

    this.mainCameraComponent.createOrbitControls(threeComponent.canvas);
  }

  public update = (ecs: ECS): void => {
    const mainEntity = ecs.getMainEntity();

    const resizeComponent = mainEntity.getComponent(ResizeComponent);

    if (resizeComponent) {
      this.mainCameraComponent.resizeCamera(resizeComponent);
    }

    const sceneComponent = mainEntity.getComponent(SceneComponent);
    const threeComponent = mainEntity.getComponent(ThreeComponent);

    if (sceneComponent && threeComponent) {
      const { mainScene } = sceneComponent;
      const { renderer } = threeComponent;

      this.mainCameraComponent.render(mainScene, renderer);
    }
  };
}