import { ECSSystem } from "@/ecs/system";
import { DepthTexture, NearestFilter, WebGLRenderTarget } from "three";

export class DepthRenderSystem extends ECSSystem {
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
}