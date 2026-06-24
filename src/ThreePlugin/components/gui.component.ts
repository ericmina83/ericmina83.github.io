import { ECSComponent } from "@/ecs/component";
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

export class GuiComponent extends ECSComponent {
  readonly gui = new GUI();
}
