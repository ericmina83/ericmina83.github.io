import { MathUtils, PMREMGenerator, RenderTarget, Scene, Vector3 } from "three";
import { Sky } from "three/examples/jsm/objects/Sky";
import { GerstnerWater } from "./GerstnerWater";

export class SkyController {
  private readonly sky = new Sky();

  private sun = new Vector3();

  private elevation = 15;

  private azimuth = 45;

  private renderTarget: RenderTarget | null = null;

  private readonly sceneEnv = new Scene();

  constructor(private readonly scene: Scene, private readonly water: GerstnerWater, private readonly pmremGenerator: PMREMGenerator) {
    this.sky.scale.setScalar(10000);

    this.setSkyUniforms(10, 2, 0.005, 0.8);

    scene.add(this.sky);
    this.sceneEnv.add(this.sky);
  }

  private setSkyUniforms(turbidity: number, rayleigh: number, mieCoefficient: number, mieDirectionalG: number) {
    const skyUniforms = this.sky.material.uniforms;

    skyUniforms['turbidity'].value = turbidity;
    skyUniforms['rayleigh'].value = rayleigh;
    skyUniforms['mieCoefficient'].value = mieCoefficient;
    skyUniforms['mieDirectionalG'].value = mieDirectionalG;
  }

  public updateSun() {

    const phi = MathUtils.degToRad(90 - this.elevation);
    const theta = MathUtils.degToRad(this.azimuth);

    this.sun.setFromSphericalCoords(1, phi, theta);

    this.sky.material.uniforms['sunPosition'].value.copy(this.sun);
    this.water.updateSun(this.sun);

    if (this.renderTarget !== null) this.renderTarget.dispose();

    this.sceneEnv.add(this.sky);
    this.renderTarget = this.pmremGenerator.fromScene(this.sceneEnv);
    this.scene.add(this.sky);


    this.scene.environment = this.renderTarget.texture;
  }
}