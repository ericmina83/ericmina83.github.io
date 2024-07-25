import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SceneManagerHelper } from "./scene-manager-helper";
import { Sky } from "three/examples/jsm/objects/Sky";

export class SceneManager {
  private readonly renderer: WebGLRenderer;
  private readonly camera: PerspectiveCamera;
  private readonly scene: Scene;
  private readonly sky: Sky;
  private readonly sun: Vector3;
  private readonly controls: OrbitControls;

  public constructor() {
    this.scene = new Scene();
    this.renderer = SceneManagerHelper.setRenderer();
    this.camera = SceneManagerHelper.setCamera();
    this.controls = SceneManagerHelper.setOrbitControls(
      this.camera,
      this.renderer
    );
    this.sky = SceneManagerHelper.setSky(this.scene);
    this.sun = SceneManagerHelper.setSun(this.sky, this.scene, this.renderer);
  }

  public resizeWindow(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  public update(): void {
    this.renderer.render(this.scene, this.camera);
  }
}
