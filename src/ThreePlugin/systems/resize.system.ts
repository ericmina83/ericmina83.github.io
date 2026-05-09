import { ECSSystem } from "@/ecs/system";
import type { ECS } from "@/ecs";
import { ContainerComponent } from "../components/container.component";
import { ResizeComponent } from "../components/resize.component";

export class ResizeSystem extends ECSSystem {
  private needsResize = false;

  public size: { width: number; height: number } = { width: 0, height: 0 };

  private resizeComponent!: ResizeComponent;

  public init = (ecs: ECS): void => {

    const mainEntity = ecs.getMainEntity();

    const containerComponent = mainEntity.getComponent(ContainerComponent);

    if (!containerComponent) {
      throw new Error("ResizeSystem: No container entity found.");
    }

    this.resizeComponent = new ResizeComponent();
    mainEntity.addComponent(this.resizeComponent);

    const { container } = containerComponent;

    const observer = new ResizeObserver(this.resizeHandler(container).bind(this))
    observer.observe(container);
  };

  public update = (): void => {
    this.resizeComponent.needsResize = this.needsResize;
    this.resizeComponent.size = { ...this.size };
    this.needsResize = false;
  }

  private resizeHandler(container: HTMLElement) {
    return () => {
      // look up the size the canvas is being displayed
      this.size.width = container.clientWidth;
      this.size.height = container.clientHeight;
      this.needsResize = true;

      // const dpr = this.renderer.getPixelRatio();
      // this.depthRenderTarget.setSize(width * dpr, height * dpr);
    }
  }
}