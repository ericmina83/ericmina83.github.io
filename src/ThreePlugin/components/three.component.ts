import { ECSComponent } from "@/ecs/component";
import type { ResizeComponent } from "./resize.component";
import { ACESFilmicToneMapping, DepthTexture, NearestFilter, PMREMGenerator, WebGLRenderer, WebGLRenderTarget } from "three";

export class ThreeComponent extends ECSComponent {
  public readonly renderer: WebGLRenderer;

  public readonly canvas: HTMLCanvasElement;

  public readonly pmremGenerator: PMREMGenerator;

  constructor(public readonly container: HTMLElement) {
    super();

    this.renderer = this.createRenderer();
    this.pmremGenerator = new PMREMGenerator(this.renderer)

    this.canvas = this.renderer.domElement;
    this.container.appendChild(this.canvas);
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
    const renderTarget = new WebGLRenderTarget(1024, 1024);
    renderTarget.depthTexture = new DepthTexture(1024, 1024);

    renderTarget.texture.minFilter = NearestFilter;
    renderTarget.texture.magFilter = NearestFilter;
    renderTarget.stencilBuffer = false;
    renderTarget.texture.generateMipmaps = false;
    // renderTarget.samples = 2;

    return renderTarget;
  }

  public resizeRenderer = (resizeComponent: ResizeComponent) => {
    if (!resizeComponent.needsResize) return;
    this.renderer.setSize(resizeComponent.size.width, resizeComponent.size.height);
  }
}