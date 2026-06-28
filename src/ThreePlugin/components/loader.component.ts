import { ECSComponent } from "@/ecs/component";
import { LoadingManager } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class LoaderComponent extends ECSComponent {

  private manager: LoadingManager;

  private readonly gltfLoader: GLTFLoader;

  private finish = false;

  private progress = 0;

  private loadingUrl?: string = undefined;

  public readonly modelMap: Record<string, GLTF> = {}

  constructor() {
    super();

    this.manager = new LoadingManager(() => {
      this.finish = true;
    }, (url, loaded, total) => {
      this.loadingUrl = url;
      this.progress = loaded / total;
      this.finish = false;
    })

    this.gltfLoader = new GLTFLoader(this.manager);
  }

  public loadGLTF(url: string, key: string) {
    this.gltfLoader.load(url, (data: GLTF) => {
      this.modelMap[key] = data;
    })
  }
}