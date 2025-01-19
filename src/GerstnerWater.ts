import { Vector3, Group, PlaneGeometry, TextureLoader, RepeatWrapping, MathUtils, Vector2 } from "three";

import { Water } from "three/examples/jsm/objects/Water";
import waterNormals from "./Assets/Textures/waternormals.jpg?url";

import waterVert from "./Assets/Shaders/water.vert";
import waterFrag from "./Assets/Shaders/water.frag";

export class GerstnerWater extends Group {
  private time = 0;

  private water: Water;


  private waves: Vector3[] = [  // angle, amplitude, waveLength
    new Vector3(MathUtils.degToRad(45), 2.84, 1.5),
    new Vector3(MathUtils.degToRad(105), 1.2, 3.18),
    new Vector3(MathUtils.degToRad(-65), 0.8, 5.67),
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

  public updateSun(sun: Vector3): void {
    this.water.material.uniforms['sunDirection'].value.copy(sun).normalize();
  }

  public getWaveInfo(coord: Vector2) {

    const result = this.waves.reduce((prev, wave) => {

      const angle = wave.x;
      const amplitude = wave.y;
      const waveLength = wave.z;

      const d = new Vector2(Math.cos(angle), Math.sin(angle));
      const omega = 2.0 * Math.PI / waveLength;
      const amp = amplitude / omega;
      const c = Math.sqrt(9.8 / omega);
      const theta = omega * coord.clone().dot(d) + c * this.time;

      const next = {
        offset: prev.offset.clone(),
        tangent: prev.tangent.clone(),
        binormal: prev.binormal.clone(),
        normal: prev.normal.clone(),
      };

      next.offset.x += d.x * amp * Math.cos(theta);
      next.offset.y += amp * Math.sin(theta);
      next.offset.z += d.y * amp * Math.cos(theta);

      // partial derivatives coord.x
      // d(theta) / d(coord.x) = omega * d.x
      // tangent.x = d(d.x * amp * cos(theta)) / d(coord.x) 
      //           = d.x * amp * -sin(theta) * d(theta) / d(coord.x)
      //           = -d.x * d.x * amp * sin(theta) * omega * d.x
      //           = -d.x * d.x * (amplitude / omega) * omega * sin(theta)
      next.tangent.x += -d.x * d.x * amplitude * Math.sin(theta);
      next.tangent.y += d.x * amplitude * Math.cos(theta);
      next.tangent.z += -d.x * d.y * amplitude * Math.sin(theta);

      // partial derivatives coord.y
      // d(theta) / d(coord.y) = omega * d.y
      // binormal.x = d(d.x * amp * cos(theta)) / d(coord.y) 
      //            = d.x * amp * -sin(theta) * d(theta) / d(coord.y)
      //            = -d.x * d.y * amp * Math.sin(theta) * omega * d.y
      next.binormal.x += -d.x * d.y * amplitude * Math.sin(theta);
      next.binormal.y += d.y * amplitude * Math.cos(theta);
      next.binormal.z += -d.y * d.y * amplitude * Math.sin(theta);

      next.normal.add(next.tangent.clone().cross(next.binormal).normalize());

      return next;
    }, {
      offset: new Vector3(),
      tangent: new Vector3(),
      binormal: new Vector3(),
      normal: new Vector3(),
    })

    return result;
  }
}