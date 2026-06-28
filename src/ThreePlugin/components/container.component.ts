import { ECSComponent } from "@/ecs/component";

export class ContainerComponent extends ECSComponent {
  constructor(public readonly container: HTMLElement) {
    super();
  }
}