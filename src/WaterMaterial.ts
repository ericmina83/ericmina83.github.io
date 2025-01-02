import { Color, FrontSide, Matrix4, ShaderMaterial, Side, Texture, UniformsLib, UniformsUtils, Vector3, WebGLRenderTarget } from "three";

import waterVertex from "@/Assets/Shaders/water.vert";
import waterFragment from "@/Assets/Shaders/water.frag";

export type WaterOptions = {
  alpha?: number,
  fog?: boolean
  direction?: number,
  frequency?: number,
  amplitude?: number,
  steepness?: number,
  speed?: number,
  manyWaves?: boolean,
  time?: number,
  waterNormals?: Texture,
  sunDirection?: Vector3,
  sunColor?: number,
  waterColor?: number,
  distortionScale?: number,
  eye?: Vector3,
  side?: Side,
}

export class WaterMaterial extends ShaderMaterial {

  public readonly textureMatrix: Matrix4;

  public readonly eye: Vector3;

  constructor(requirements: {
    renderTarget: WebGLRenderTarget,
    textureMatrix: Matrix4,
  }, options?: WaterOptions) {
    const newOptions = options || {};

    const alpha = newOptions.alpha !== undefined ? newOptions.alpha : 1.0;
    const time = newOptions.time !== undefined ? newOptions.time : 0.0;
    const normalSampler = newOptions.waterNormals !== undefined ? newOptions.waterNormals : null;
    const sunDirection = newOptions.sunDirection !== undefined ? newOptions.sunDirection : new Vector3(0.70707, 0.70707, 0.0);
    const sunColor = new Color(newOptions.sunColor !== undefined ? newOptions.sunColor : 0xffffff);
    const waterColor = new Color(newOptions.waterColor !== undefined ? newOptions.waterColor : 0x7F7F7F);
    const distortionScale = newOptions.distortionScale !== undefined ? newOptions.distortionScale : 0.5;

    const eye = newOptions.eye !== undefined ? newOptions.eye : new Vector3(0, 0, 0);
    const side = newOptions.side !== undefined ? newOptions.side : FrontSide;
    const fog = newOptions.fog !== undefined ? newOptions.fog : false;

    const direction = newOptions.direction !== undefined ? newOptions.direction : 0.0;
    const frequency = newOptions.frequency !== undefined ? newOptions.frequency : 0.05;
    const amplitude = newOptions.amplitude !== undefined ? newOptions.amplitude : 20.0;
    const steepness = newOptions.steepness !== undefined ? newOptions.steepness : 1.0;
    const speed = newOptions.speed !== undefined ? newOptions.speed : 1.0;
    const manyWaves = newOptions.manyWaves !== undefined ? newOptions.manyWaves : false;

    const { renderTarget, textureMatrix } = requirements;

    const uniforms = UniformsUtils.merge([
      UniformsLib.fog,
      UniformsLib.lights,
      {
        normalSampler: { value: null },
        mirrorSampler: { value: null },
        alpha: { alpha },
        time: { time },
        size: { value: 2.7 },
        textureMatrix: { value: textureMatrix },
        sunColor: { value: sunColor },
        sunDirection: { value: sunDirection },
        eye: { value: eye },
        waterColor: { value: waterColor },
        distortionScale: { value: distortionScale },

        direction: { value: direction },
        frequency: { value: frequency },
        amplitude: { value: amplitude },
        steepness: { value: steepness },
        speed: { value: speed },

        wavesToAdd: { value: manyWaves },
        // coefficientSampler: { value: coefficientTexture },
      }
    ]);

    super({
      vertexShader: waterVertex,
      fragmentShader: waterFragment,
      uniforms: UniformsUtils.clone(uniforms),
      side: side,
      fog: fog,
      lights: true
    })

    this.uniforms.mirrorSampler.value = renderTarget.texture;
    this.uniforms.textureMatrix.value = textureMatrix;
    this.uniforms.alpha.value = alpha;
    this.uniforms.time.value = time;
    this.uniforms.normalSampler.value = normalSampler;
    this.uniforms.sunColor.value = sunColor;
    this.uniforms.waterColor.value = waterColor;
    this.uniforms.sunDirection.value = sunDirection;
    this.uniforms.eye.value = eye;

    this.textureMatrix = textureMatrix;
    this.eye = eye;
  }

  public setTime(time: number) {
    this.uniforms.time.value = time;
  }
}