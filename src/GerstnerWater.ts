import { Vector3, Group, PlaneGeometry, TextureLoader, RepeatWrapping, MathUtils, Vector2, DepthTexture } from "three";

import { Water } from "three/examples/jsm/objects/Water";
import waterNormals from "./Assets/Textures/waternormals.jpg?url";
import { getWaveInfo } from "./GerstnerWater.utility";

import waterVert from "./Assets/Shaders/water.vert";
import waterFrag from "./Assets/Shaders/water.frag";

export class GerstnerWater extends Group {
  private time = 0;

  private water: Water;

  private waves: Vector3[] = [  // angle, amplitude, waveLength
    new Vector3(MathUtils.degToRad(0), 0.15, 15),
    new Vector3(MathUtils.degToRad(30), 0.15, 25),
    new Vector3(MathUtils.degToRad(60), 0.15, 30),
  ];

  constructor() {
    super();

    const waterGeometry = new PlaneGeometry(4096, 4096, 256, 256)

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
      shader.vertexShader = waterVert;
      shader.fragmentShader = waterFrag;
    };


    // for (let i = 0; i < 3; i++) {
    //   const wave = new Vector3();
    //   wave.x = Math.random() * 2 * Math.PI; // angle in degrees
    //   wave.y = MathUtils.lerp(0.6, 2.0, Math.random()); // amplitude
    //   wave.z = MathUtils.lerp(0.5, 2.5, Math.random()); // wavelength
    //   this.waves.push(wave);
    // }

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