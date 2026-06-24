import { Clock } from "three";
import { ECS } from "@/ecs";
import { ThreeSystem } from "./systems/three.system";
import { ContainerComponent } from "./components/container.component";
import { MainCameraSystem } from "./systems/mainCamera.system";
import { TickComponent } from "./components/tick.component";
import { SceneSystem } from "./systems/scene.system";
import { ResizeSystem } from "./systems/resize.system";
import { WaterSystem } from "./systems/water.system";
import { SkySystem } from "./systems/sky.system";
import { LoaderSystem } from "./systems/loader.system";
import { BoatSystem } from "./systems/boat.system";
import { GuiSystem } from "./systems/gui.system";


export class ThreePlugin extends ECS {
  private readonly clock = new Clock();

  constructor(container: HTMLElement | null) {
    if (container === null) {
      throw new Error('No root element found');
    }

    super();

    const mainEntity = this.getMainEntity();

    mainEntity.addComponent(new ContainerComponent(container));
    mainEntity.addComponent(new TickComponent(this.animate.bind(this)));

    this.addSystem(new ResizeSystem(1000));
    this.addSystem(new ThreeSystem(1001));
    this.addSystem(new MainCameraSystem(1002));
    this.addSystem(new SceneSystem(1003));
    this.addSystem(new SkySystem(1004));
    this.addSystem(new WaterSystem(1005));
    this.addSystem(new LoaderSystem(1006));
    this.addSystem(new BoatSystem(1007));
    this.addSystem(new GuiSystem(9999));

    this.init();
  }

  public animate() {
    const delta = this.clock.getDelta();
    this.update(delta);
  }
}
