import { Vector3, Mesh, BufferGeometry, Camera, Group, Material, Scene, WebGLRenderer, RGBAFormat } from "three";
import {
  LinearFilter,
  MathUtils,
  Matrix4,
  PerspectiveCamera,
  Plane,
  Vector4,
  WebGLRenderTarget,
} from "three";
import { WaterMaterial, WaterOptions } from "./WaterMaterial";

export class Water extends Mesh<BufferGeometry, WaterMaterial> {
  private time = 0;

  private mirrorPlane = new Plane();
  private normal = new Vector3();
  private mirrorWorldPosition = new Vector3();
  private cameraWorldPosition = new Vector3();
  private rotationMatrix = new Matrix4();
  private lookAtPosition = new Vector3(0, 0, -1);
  private clipPlane = new Vector4();
  private view = new Vector3();
  private target = new Vector3();
  private q = new Vector4();
  private mirrorCamera = new PerspectiveCamera();

  private readonly textureMatrix: Matrix4;
  private readonly renderTarget: WebGLRenderTarget;

  private readonly clipBias: number;

  constructor(
    geometry: BufferGeometry,
    options?: {
      textureWidth?: number,
      textureHeight?: number,
      clipBias?: number,
    } & WaterOptions) {

    const newOptions = options || {};

    const textureWidth = newOptions.textureWidth !== undefined ? newOptions.textureWidth : 512;
    const textureHeight = newOptions.textureHeight !== undefined ? newOptions.textureHeight : 512;

    const renderTarget = new WebGLRenderTarget(textureWidth, textureHeight, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      stencilBuffer: false
    });

    if (!MathUtils.isPowerOfTwo(textureWidth) || !MathUtils.isPowerOfTwo(textureHeight))
      renderTarget.texture.generateMipmaps = false;

    const textureMatrix = new Matrix4();

    super(
      geometry,
      new WaterMaterial({
        renderTarget,
        textureMatrix,
      }, options)
    );

    this.clipBias = newOptions.clipBias !== undefined ? newOptions.clipBias : 0.0;
    this.renderTarget = renderTarget;
    this.textureMatrix = textureMatrix;

    this.rotateX(-Math.PI / 2);
  }

  public updateDeltaTime(deltaTime: number) {
    this.time += deltaTime;
    this.material.setTime(this.time);
  }

  public onBeforeRender(renderer: WebGLRenderer, scene: Scene, camera: Camera, geometry: BufferGeometry, material: Material, group: Group): void {
    this.mirrorWorldPosition.setFromMatrixPosition(this.matrixWorld);
    this.cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
    this.rotationMatrix.extractRotation(this.matrixWorld);
    this.normal.set(0, 0, 1);
    this.normal.applyMatrix4(this.rotationMatrix);
    this.view.subVectors(this.mirrorWorldPosition, this.cameraWorldPosition);

    // Avoid rendering when mirror is facing away
    if (this.view.dot(this.normal) > 0) return;

    this.view.reflect(this.normal).negate();
    this.view.add(this.mirrorWorldPosition);
    this.rotationMatrix.extractRotation(camera.matrixWorld);
    this.lookAtPosition.set(0, 0, -1);
    this.lookAtPosition.applyMatrix4(this.rotationMatrix);
    this.lookAtPosition.add(this.cameraWorldPosition);
    this.target.subVectors(this.mirrorWorldPosition, this.lookAtPosition);
    this.target.reflect(this.normal).negate();
    this.target.add(this.mirrorWorldPosition);

    this.mirrorCamera.position.copy(this.view);
    this.mirrorCamera.up.set(0, 1, 0);
    this.mirrorCamera.up.applyMatrix4(this.rotationMatrix);
    this.mirrorCamera.up.reflect(this.normal);
    this.mirrorCamera.lookAt(this.target);
    this.mirrorCamera.far = (camera as PerspectiveCamera).far; // Used in WebGLBackground
    this.mirrorCamera.updateMatrixWorld();
    this.mirrorCamera.projectionMatrix.copy(camera.projectionMatrix);

    // Update the texture matrix
    this.textureMatrix.set(
      0.5, 0.0, 0.0, 0.5,
      0.0, 0.5, 0.0, 0.5,
      0.0, 0.0, 0.5, 0.5,
      0.0, 0.0, 0.0, 1.0
    );
    this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix);
    this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse);

    // Oblique clipping (is it useful on deformed geometries?)
    this.mirrorPlane.setFromNormalAndCoplanarPoint(this.normal, this.mirrorWorldPosition);
    this.mirrorPlane.applyMatrix4(this.mirrorCamera.matrixWorldInverse);
    this.clipPlane.set(this.mirrorPlane.normal.x, this.mirrorPlane.normal.y, this.mirrorPlane.normal.z, this.mirrorPlane.constant);
    const projectionMatrix = this.mirrorCamera.projectionMatrix;
    this.q.x = (Math.sign(this.clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
    this.q.y = (Math.sign(this.clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
    this.q.z = -1.0;
    this.q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];
    this.clipPlane.multiplyScalar(2.0 / this.clipPlane.dot(this.q));
    projectionMatrix.elements[2] = this.clipPlane.x;
    projectionMatrix.elements[6] = this.clipPlane.y;
    projectionMatrix.elements[10] = this.clipPlane.z + 1.0 - this.clipBias;
    projectionMatrix.elements[14] = this.clipPlane.w;
    this.material.eye.setFromMatrixPosition(camera.matrixWorld);

    const currentRenderTarget = renderer.getRenderTarget();
    // Save
    const currentXrEnabled = renderer.xr.enabled;
    const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;
    this.visible = false;
    renderer.xr.enabled = false; // Avoid camera modification and recursion
    renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

    renderer.setRenderTarget(this.renderTarget);
    if (renderer.autoClear === false) renderer.clear();
    renderer.render(scene, this.mirrorCamera);

    // Restore
    this.visible = true;
    renderer.xr.enabled = currentXrEnabled;
    renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
    renderer.setRenderTarget(currentRenderTarget);

    // Restore viewport
    const viewport = (camera as PerspectiveCamera).viewport;
    if (viewport !== undefined) {
      renderer.state.viewport(viewport);
    }
  }
}