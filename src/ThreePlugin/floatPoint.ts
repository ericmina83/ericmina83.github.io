import { ArrowHelper, Object3D, Scene, Vector2, Vector3 } from "three";
import { GerstnerWater } from "./GerstnerWater";

export class FloatPoint {
  private readonly fpObject: Object3D;

  private readonly waveNormalHelper: ArrowHelper;
  private readonly gravitySlideHelper: ArrowHelper;

  constructor({ scene, parent, offset }: { scene: Scene, parent: Object3D, offset: Vector3, }) {

    this.fpObject = new Object3D();
    parent.add(this.fpObject)
    this.fpObject.position.copy(offset);

    this.waveNormalHelper = new ArrowHelper(
      new Vector3(),
      new Vector3(),
      5,
      0xffff00
    );
    scene.add(this.waveNormalHelper);

    this.gravitySlideHelper = new ArrowHelper(
      new Vector3(0, 1, 0),
      new Vector3(),
      5,
      0x00ffff
    );
    scene.add(this.gravitySlideHelper);
  }

  public getOffsetAndNormal(water: GerstnerWater) {
    const fpWorldPos = new Vector3()

    this.fpObject.getWorldPosition(fpWorldPos)

    const { normal, offset } = water.getWaveInfo(
      new Vector2(
        fpWorldPos.x,
        fpWorldPos.z)
    );

    const worldPos = new Vector3();

    this.fpObject.getWorldPosition(worldPos);

    this.waveNormalHelper.position.copy(fpWorldPos);
    this.waveNormalHelper.position.copy(new Vector3(worldPos.x + offset.x, offset.y, worldPos.z + offset.z));
    this.waveNormalHelper.setDirection(normal);

    const gravitySlideDirection = normal.clone().cross(new Vector3(0, -1, 0)).cross(normal).normalize();

    this.gravitySlideHelper.position.copy(fpWorldPos);
    this.gravitySlideHelper.position.copy(new Vector3(worldPos.x + offset.x, offset.y, worldPos.z + offset.z));
    this.gravitySlideHelper.setDirection(gravitySlideDirection);

    const position = new Vector3().addVectors((worldPos), offset);

    return {
      position,
      normal,
      offset,
    }
  }
}