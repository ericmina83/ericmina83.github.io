import { ACESFilmicToneMapping, Clock, DepthTexture, Fog, NearestFilter, PerspectiveCamera, PMREMGenerator, Scene, WebGLRenderer, WebGLRenderTarget } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import BoatController from "./BoatController";
import { GerstnerWater } from "./GerstnerWater";
import { SkyController } from "./SkyController";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ECS } from "@/ecs";
import { ThreeSystem } from "./systems/three.system";
import { ThreeComponent } from "./components/three.component";
import { ContainerComponent } from "./components/container.component";
import { MainCameraSystem } from "./systems/mainCamera.system";
import { TickComponent } from "./components/tick.component";
import { SceneSystem } from "./systems/scene.system";
import { ResizeSystem } from "./systems/resize.system";
import { WaterSystem } from "./systems/water.system";
import { SkySystem } from "./systems/sky.system";


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

    this.init();
  }


  private createScene(): Scene {
    const scene = new Scene();
    scene.fog = new Fog(0xC0BBB9, 0, 300);
    return scene;
  }


  // private createWater() {
  //   const water = new GerstnerWater(this.depthRenderTarget?.depthTexture)
  //   this.scene.add(water);
  //   return water;
  // }

  public animate() {
    const delta = this.clock.getDelta();
    // this.water.updateDeltaTime(delta);
    // this.boatController?.update();

    this.update(delta)

    // this.renderer.setRenderTarget(this.depthRenderTarget);
    // this.scene.remove(this.water);
    // this.renderer.render(this.scene, this.camera);

    // this.renderer.setRenderTarget(null);
    // this.scene.add(this.water);
  }
}