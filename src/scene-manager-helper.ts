import {
  PMREMGenerator,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Sky } from "three/examples/jsm/objects/Sky";

export class SceneManagerHelper {
  public static setRenderer(): WebGLRenderer {
    const renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    return renderer;
  }

  public static setCamera(): PerspectiveCamera {
    const camera = new PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(30, 30, 100);
    return camera;
  }

  public static setOrbitControls(
    camera: PerspectiveCamera,
    renderer: WebGLRenderer
  ): OrbitControls {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 10, 0);
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();
    return controls;
  }

  public static setSky(scene: Scene): Sky {
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);
    return sky;
  }

  public static setSun(
    sky: Sky,
    scene: Scene,
    renderer: WebGLRenderer
  ): Vector3 {
    const pmremGenerator = new PMREMGenerator(renderer);
    const sun = new Vector3();

    // const sceneEnv = new Scene();
    // sceneEnv.add(sky);

    const theta = Math.PI * (0.49 - 0.5);
    const phi = 2 * Math.PI * (0.205 - 0.5);

    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms["sunPosition"].value.copy(sun);

    scene.environment = pmremGenerator.fromScene(
      sky as unknown as Scene
    ).texture;

    return sun;
  }
}
