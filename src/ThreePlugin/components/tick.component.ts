import { ECSComponent } from "@/ecs/component";

export class TickComponent extends ECSComponent {
  constructor(public readonly tick: () => void) {
    super();
  }
}