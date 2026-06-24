import { ECSSystem } from "@/ecs/system";
import type { ECS } from "@/ecs";
import { GuiComponent } from "../components/gui.component";
import { SkyComponent } from "../components/sky.component";
import { ThreeComponent } from "../components/three.component";
import { SceneComponent } from "../components/scene.component";

export class GuiSystem extends ECSSystem {

  private threeComponent!: ThreeComponent;

  public init = (ecs: ECS) => {
    const entity = ecs.getMainEntity();

    const threeComponent = entity.getComponent(ThreeComponent);
    if (!threeComponent) throw new Error("GuiSystem: No ThreeComponent found.");
    this.threeComponent = threeComponent;

    const skyComponent = entity.getComponent(SkyComponent);
    if (!skyComponent) throw new Error("GuiSystem: No SkyComponent found.");

    const sceneComponent = entity.getComponent(SceneComponent);
    if (!sceneComponent) throw new Error("GuiSystem: No SceneComponent found.");
    const guiComponent = new GuiComponent();
    entity.addComponent(guiComponent);

    const { gui } = guiComponent;

    const rendererFolder = gui.addFolder('Renderer');
    rendererFolder.add(threeComponent.params, 'toneMappingExposure', 0, 2, 0.01);

    const skyFolder = gui.addFolder('Sky');
    skyFolder.add(skyComponent.params, 'turbidity', 0, 20, 0.1);
    skyFolder.add(skyComponent.params, 'rayleigh', 0, 4, 0.001);
    skyFolder.add(skyComponent.params, 'mieCoefficient', 0, 0.1, 0.001);
    skyFolder.add(skyComponent.params, 'mieDirectionalG', 0, 1, 0.001);
    skyFolder.add(skyComponent.params, 'elevation', 0, 90, 0.1);
    skyFolder.add(skyComponent.params, 'azimuth', -180, 180, 0.1);

    const fogFolder = gui.addFolder('Fog');
    fogFolder.add(sceneComponent.fogParams, 'enabled').name('Enabled').onChange(() => sceneComponent.updateFog());
    fogFolder.addColor(sceneComponent.fogParams, 'color').name('Color').onChange(() => {
      sceneComponent.updateFog();
      skyComponent.skyFogParams.color = sceneComponent.fogParams.color;
      skyComponent.updateSkyFog();
    });
    fogFolder.add(sceneComponent.fogParams, 'near', 0, 1000, 1).name('Near').onChange(() => sceneComponent.updateFog());
    fogFolder.add(sceneComponent.fogParams, 'far', 0, 2000, 1).name('Far').onChange(() => sceneComponent.updateFog());

    const skyFogFolder = gui.addFolder('Sky Fog');
    skyFogFolder.add(skyComponent.skyFogParams, 'enabled').name('Enabled').onChange(() => skyComponent.updateSkyFog());
    skyFogFolder.add(skyComponent.skyFogParams, 'height', -0.2, 0.5, 0.01).name('Height').onChange(() => skyComponent.updateSkyFog());
    skyFogFolder.add(skyComponent.skyFogParams, 'heightScale', 1, 30, 0.1).name('Height Scale').onChange(() => skyComponent.updateSkyFog());
  };

  public update = () => {
    this.threeComponent.setToneMappingExposure(this.threeComponent.params.toneMappingExposure);
  };
}
