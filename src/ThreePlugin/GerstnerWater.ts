import { Vector3, Group, PlaneGeometry, TextureLoader, RepeatWrapping, Vector2 } from "three";

import { Water } from "three/examples/jsm/objects/Water";
import waterNormals from "../Assets/Textures/waterNormals.jpg?url";
import { getWaveInfo } from "./GerstnerWater.utility";

import waterVert from "../Assets/Shaders/water.vert";
import waterFrag from "../Assets/Shaders/water.frag";

export class GerstnerWater extends Group {
  private time = 0;

  private water: Water;

  private readonly waves: Vector3[] = [];

  constructor(waveParameters: Vector3[]) {
    super();

    const waveParametersGLSL =
      `const int waveCount = ${waveParameters.length};\n` +
      `const vec3 waveParameters[${waveParameters.length}] = vec3[](\n` +
      waveParameters
        .map((wave) => `  vec3(${wave.x}, ${wave.y}, ${wave.z})`)
        .join(",\n") +
      "\n);\n\n";

    const waterVertAppend = waveParametersGLSL + waterVert;

    const waterGeometry = new PlaneGeometry(1024, 1024, 256, 256)

    this.water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new TextureLoader().load(waterNormals, (texture) => {
        texture.wrapS = texture.wrapT = RepeatWrapping;
      }),
      sunDirection: new Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 1.5,
      fog: true,
    });

    this.water.material.onBeforeCompile = (shader) => {
      shader.vertexShader = waterVertAppend;
      shader.fragmentShader = waterFrag;
    };
    this.water.material.needsUpdate = true;

    this.waves = waveParameters;

    this.water.rotation.x = -Math.PI / 2;

    this.waves.forEach((wave, index) => {
      this.water.material.uniforms[`wave${index + 1}`] = {
        value: wave
      };
    });

    this.add(this.water);
  }

  public updateDeltaTime(deltaTime: number) {
    this.time += deltaTime;
    this.water.material.uniforms.time.value = this.time;
  }

  public getTime(): number {
    return this.time;
  }

  public updateSun(sun: Vector3): void {
    this.water.material.uniforms['sunDirection'].value.copy(sun).normalize();
  }

  public getWaveInfo(coord: Vector2) {
    return getWaveInfo(coord, this.waves, this.time);
  }
}