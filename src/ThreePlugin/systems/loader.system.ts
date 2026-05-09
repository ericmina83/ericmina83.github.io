import type { ECS } from "@/ecs";
import { ECSSystem } from "@/ecs/system";
import { LoaderComponent } from "../components/loader.component";
import boatModel from '../Assets/Models/boat.glb?url';


export class LoaderSystem extends ECSSystem {
  private loaderComponent!: LoaderComponent;

  public init = (ecs: ECS) => {
    const mainEntity = ecs.getMainEntity();

    this.loaderComponent = new LoaderComponent();
    mainEntity.addComponent(this.loaderComponent);

    this.loaderComponent.loadGLTF(boatModel, 'boat');
  }

  public update = undefined;
}