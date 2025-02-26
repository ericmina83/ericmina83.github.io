import { ACESFilmicToneMapping, Clock, DepthTexture, Fog, PerspectiveCamera, PMREMGenerator, RenderTarget, Scene, WebGLRenderer } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import BoatController from "./BoatController";
import { GerstnerWater } from "./GerstnerWater";
import { SkyController } from "./SkyController";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


export class ThreePlugin {
  private readonly clock = new Clock();

  private readonly container: HTMLElement;

  private readonly renderer: WebGLRenderer;

  private readonly canvas: HTMLCanvasElement;

  private readonly camera: PerspectiveCamera;

  private readonly controls: OrbitControls;

  private readonly scene: Scene;

  private readonly depthRenderTarget: RenderTarget;

  private readonly water: GerstnerWater;

  private readonly sky: SkyController;

  private readonly glbLoader: GLTFLoader = new GLTFLoader();

  private readonly boatController: BoatController | null = null;

  constructor(container: HTMLElement | null) {
    if (container === null) {
      throw new Error('No root element found');
    }

    this.container = container;

    this.renderer = this.createRenderer();

    this.canvas = this.renderer.domElement;
    container.appendChild(this.canvas);

    this.camera = this.createCamera();

    this.controls = this.createOrbitControls();

    const observer = new ResizeObserver(this.resizeHandler.bind(this))
    observer.observe(container);

    this.depthRenderTarget = this.createDepthRenderTarget();

    this.scene = this.createScene();

    this.water = this.createWater();

    this.sky = new SkyController(this.scene, this.water, new PMREMGenerator(this.renderer));

    this.boatController = new BoatController(this.glbLoader, this.water, this.scene);

    this.renderer.setAnimationLoop(this.animate.bind(this));
  }

  private createRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.25;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    return renderer;
  }

  private createDepthRenderTarget() {
    const renderTarget = new RenderTarget(1024, 1024);
    renderTarget.depthTexture = new DepthTexture(1024, 1024);

    return renderTarget;
  }

  private createCamera(): PerspectiveCamera {
    const camera = new PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      1024
    );

    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    return camera;
  }

  private resizeHandler() {
    // look up the size the canvas is being displayed
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.renderer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private createScene(): Scene {
    const scene = new Scene();
    scene.fog = new Fog(0xC0BBB9, 0, 300);
    return scene;
  }

  private createOrbitControls() {
    const controls = new OrbitControls(this.camera, this.canvas);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    return controls;
  }

  private createWater() {
    const water = new GerstnerWater(this.depthRenderTarget?.depthTexture)
    water.rotation.x = -Math.PI / 2;
    this.scene.add(water);
    return water;
  }

  public animate() {
    this.sky.updateSun();

    const delta = this.clock.getDelta();
    this.water.updateDeltaTime(delta);
    this.boatController?.update();

    this.scene.remove(this.water);

    this.scene.add(this.water);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }
}