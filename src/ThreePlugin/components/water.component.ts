import { ECSComponent } from "@/ecs/component";
import { Vector3 } from "three";
import { GerstnerWater } from "../GerstnerWater";
import { getWaveParameters } from "../waveParameters";

export class WaterComponent extends ECSComponent {

  public readonly waterParameters: Vector3[];

  public readonly gerstnerWater: GerstnerWater;

  constructor() {
    super();

    this.waterParameters = getWaveParameters(20);
    this.gerstnerWater = new GerstnerWater(this.waterParameters);
  }
}