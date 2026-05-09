import { Vector3, Group, PlaneGeometry, TextureLoader, RepeatWrapping, Vector2, ArrowHelper } from "three";

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
      fog: false,
    });

    this.water.material.onBeforeCompile = (shader) => {
      shader.vertexShader = waterVertAppend;
      shader.fragmentShader = waterFrag;
    };

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

    const eye = this.water.material.uniforms['eye'].value;

    if (!this.getObjectByName("sunHelper")) {
      const sunHelper = new ArrowHelper(
        sun,
        new Vector3(0, 0, 0),
        20,
        0xff0000
      );
      sunHelper.name = "sunHelper";
      console.log("Sun direction:", sun);
      this.add(sunHelper);
    } else {
      const sunHelper = this.getObjectByName("sunHelper") as import("three").ArrowHelper;
      sunHelper.setDirection(sun);
    }

    if (!this.getObjectByName("eyeHelper")) {
      const eyeHelper = new ArrowHelper(
        eye.clone().normalize(),
        new Vector3(0, 0, 0),
        eye.length(),
        0x0000ff
      );
      eyeHelper.name = "eyeHelper";
      this.add(eyeHelper);
    } else {
      const eyeHelper = this.getObjectByName("eyeHelper") as import("three").ArrowHelper;
      eyeHelper.setDirection(eye.clone().normalize());
      eyeHelper.setLength(eye.length());
    }

  }

  public getWaveInfo(coord: Vector2) {
    return getWaveInfo(coord, this.waves, this.time);
  }
}