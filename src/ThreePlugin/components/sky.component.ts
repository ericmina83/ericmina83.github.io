import { ECSComponent } from "@/ecs/component";
import { MathUtils, PMREMGenerator, RenderTarget, Scene, Vector3 } from "three";
import { Sky } from "three/examples/jsm/objects/Sky";

export class SkyComponent extends ECSComponent {

  private readonly sky = new Sky();

  public sun = new Vector3();

  private elevation = 90;

  private azimuth = 0;

  private renderTarget: RenderTarget | null = null;

  private readonly sceneEnv = new Scene();

  constructor(private readonly scene: Scene, private readonly pmremGenerator: PMREMGenerator) {
    super();
    this.sky.scale.setScalar(10000);

    this.setSkyUniforms(10, 2, 0.005, 0.8);

    scene.add(this.sky);
    this.sceneEnv.add(this.sky);

    this.sceneEnv.add(this.sky);
    this.scene.add(this.sky);

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

    if (this.renderTarget !== null) this.renderTarget.dispose();
    this.renderTarget = this.pmremGenerator.fromScene(this.sceneEnv);

    this.scene.environment = this.renderTarget.texture;
  }
}