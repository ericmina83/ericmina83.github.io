import { ECSComponent } from "@/ecs/component";
import { Camera, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { ResizeComponent } from "./resize.component";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class MainCameraComponent extends ECSComponent {
  public readonly mainCamera: Camera;

  constructor() {
    super();

    this.mainCamera = this.createCamera();
  }

  private createCamera() {
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

  public resizeCamera = (resizeComponent: ResizeComponent) => {
    if (!resizeComponent.needsResize) return;

    const { width, height } = resizeComponent.size;

    if ((this.mainCamera as PerspectiveCamera).isPerspectiveCamera) {
      const perspectiveCamera = this.mainCamera as PerspectiveCamera;

      perspectiveCamera.aspect = width / height;
      perspectiveCamera.updateProjectionMatrix();
    }
  }

  public render = (scene: Scene, renderer: WebGLRenderer) => {
    renderer.render(scene, this.mainCamera);
  }

  public createOrbitControls(canvas: HTMLCanvasElement) {
    const controls = new OrbitControls(this.mainCamera, canvas);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    return controls;
  }
}