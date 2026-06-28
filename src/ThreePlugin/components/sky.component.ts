import { ECSComponent } from "@/ecs/component";
import { Color, MathUtils, PMREMGenerator, RenderTarget, Scene, ShaderMaterial, Vector3 } from "three";
import { Sky } from "three/examples/jsm/objects/Sky";

export class SkyComponent extends ECSComponent {

  private readonly sky = new Sky();

  public sun = new Vector3();

  public readonly params = {
    turbidity: 10,
    rayleigh: 1,
    mieCoefficient: 0.001,
    mieDirectionalG: 0.4,
    elevation: 90,
    azimuth: 180,
  };

  public readonly skyFogParams = {
    enabled: true,
    color: '#C0BBB9',
    height: 0.0,
    heightScale: 10.0,
  };

  private renderTarget: RenderTarget | null = null;

  private readonly sceneEnv = new Scene();

  constructor(private readonly scene: Scene, private readonly pmremGenerator: PMREMGenerator) {
    super();
    this.sky.scale.setScalar(10000);

    const skyMat = this.sky.material as ShaderMaterial;
    skyMat.uniforms['skyFogColor'] = { value: new Color(this.skyFogParams.color) };
    skyMat.uniforms['skyFogEnabled'] = { value: 1.0 };
    skyMat.uniforms['skyFogHeight'] = { value: this.skyFogParams.height };
    skyMat.uniforms['skyFogHeightScale'] = { value: this.skyFogParams.heightScale };

    // Apply fog AFTER colorspace_fragment so the mix happens in display (sRGB) space.
    // This way skyFogColor white (#ffffff) stays white — it won't be darkened by tone mapping.
    // linearToOutputTexel converts the linear skyFogColor uniform to the renderer's output space.
    // skyFogHeight shifts the threshold: below it → full fog, above it → exponential fade.
    skyMat.fragmentShader =
      'uniform vec3 skyFogColor;\n' +
      'uniform float skyFogEnabled;\n' +
      'uniform float skyFogHeight;\n' +
      'uniform float skyFogHeightScale;\n' +
      skyMat.fragmentShader.replace(
        '#include <colorspace_fragment>',
        '#include <colorspace_fragment>\n' +
        'float _skyFogFactor = exp( -max( 0.0, direction.y - skyFogHeight ) * skyFogHeightScale );\n' +
        'vec3 _skyFogColorOut = linearToOutputTexel( vec4( skyFogColor, 1.0 ) ).rgb;\n' +
        'gl_FragColor.rgb = mix( gl_FragColor.rgb, _skyFogColorOut, skyFogEnabled * _skyFogFactor );'
      );

    scene.add(this.sky);
  }

  public updateSkyFog() {
    const skyMat = this.sky.material as ShaderMaterial;
    skyMat.uniforms['skyFogColor'].value = new Color(this.skyFogParams.color);
    skyMat.uniforms['skyFogEnabled'].value = this.skyFogParams.enabled ? 1.0 : 0.0;
    skyMat.uniforms['skyFogHeight'].value = this.skyFogParams.height;
    skyMat.uniforms['skyFogHeightScale'].value = this.skyFogParams.heightScale;
  }

  public updateSun() {
    const { turbidity, rayleigh, mieCoefficient, mieDirectionalG, elevation, azimuth } = this.params;
    const skyUniforms = this.sky.material.uniforms;
    skyUniforms['turbidity'].value = turbidity;
    skyUniforms['rayleigh'].value = rayleigh;
    skyUniforms['mieCoefficient'].value = mieCoefficient;
    skyUniforms['mieDirectionalG'].value = mieDirectionalG;

    const phi = MathUtils.degToRad(90 - elevation);
    const theta = MathUtils.degToRad(azimuth);

    this.sun.setFromSphericalCoords(1, phi, theta);
    this.sky.material.uniforms['sunPosition'].value.copy(this.sun);

    if (this.renderTarget !== null) this.renderTarget.dispose();
    this.sceneEnv.add(this.sky);
    this.renderTarget = this.pmremGenerator.fromScene(this.sceneEnv);
    this.scene.add(this.sky);

    this.scene.environment = this.renderTarget.texture;
  }
}
