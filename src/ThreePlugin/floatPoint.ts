import { Object3D, Vector2, Vector3 } from "three";
import { GerstnerWater } from "./GerstnerWater";

export class FloatPoint {
  private readonly fpObject: Object3D;

  constructor({ parent, offset }: { parent: Object3D, offset: Vector3, }) {
    this.fpObject = new Object3D();
    parent.add(this.fpObject)
    this.fpObject.position.copy(offset);
  }

  public getOffsetAndNormal(water: GerstnerWater) {
    const fpWorldPos = new Vector3()
    this.fpObject.getWorldPosition(fpWorldPos)

    const { normal, offset } = water.getWaveInfo(
      new Vector2(fpWorldPos.x, fpWorldPos.z)
    );

    const worldPos = new Vector3();
    this.fpObject.getWorldPosition(worldPos);

    const position = new Vector3().addVectors(worldPos, offset);

    return { position, normal, offset };
  }
}
