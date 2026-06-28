import { ECSComponent } from "@/ecs/component";

export class ResizeComponent extends ECSComponent {
  public needsResize: boolean = false;

  public size: { width: number; height: number } = { width: 0, height: 0 };

  constructor() {
    super();
  }
}
