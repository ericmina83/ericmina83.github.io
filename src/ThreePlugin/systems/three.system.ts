import type { ECS } from "@/ecs";
import { ECSSystem } from "@/ecs/system";
import { ContainerComponent } from "../components/container.component";
import { ThreeComponent } from "../components/three.component";
import { ResizeComponent } from "../components/resize.component";
import { TickComponent } from "../components/tick.component";


export class ThreeSystem extends ECSSystem {

  private threeComponent!: ThreeComponent;

  public init = (ecs: ECS) => {
    const mainEntity = ecs.getMainEntity();

    const containerComponent = mainEntity.getComponent(ContainerComponent);

    if (!containerComponent) {
      throw new Error("ThreeSystem: No container entity found.");
    }

    const { container } = containerComponent;


    this.threeComponent = new ThreeComponent(container);
    mainEntity.addComponent(this.threeComponent);

    const tickComponent = mainEntity.getComponent(TickComponent);

    if (!tickComponent) {
      throw new Error("ThreeSystem: No tick component found.");
    }

    const { renderer } = this.threeComponent;
    renderer.setAnimationLoop(tickComponent.tick);
  }

  public update = (ecs: ECS) => {
    const mainEntity = ecs.getMainEntity();

    const threeComponent = mainEntity.getComponent(ThreeComponent);
    const resizeComponent = mainEntity.getComponent(ResizeComponent);

    if (!threeComponent || !resizeComponent) return;

    threeComponent.resizeRenderer(resizeComponent);
  };
}