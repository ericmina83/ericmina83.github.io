import { ECSComponent } from "@/ecs/component";
import { Group, Scene, Vector3 } from "three";
import { FloatPoint } from "../floatPoint";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { GerstnerWater } from "../GerstnerWater";


export class BoatComponent extends ECSComponent {
  private readonly boatParent: Group;
  private readonly boatObj: Group;

  private readonly floatPoints: FloatPoint[];

  constructor(scene: Scene, boatGLTF: GLTF) {
    super();

    this.boatParent = new Group();
    this.boatObj = boatGLTF.scene;
    this.boatParent.add(this.boatObj);
    scene.add(this.boatParent);

    this.floatPoints = [
      new FloatPoint({ scene, parent: this.boatParent, offset: new Vector3(1, 0, 2) }),
      new FloatPoint({ scene, parent: this.boatParent, offset: new Vector3(-1, 0, 2) }),
      new FloatPoint({ scene, parent: this.boatParent, offset: new Vector3(1, 0, -2) }),
      new FloatPoint({ scene, parent: this.boatParent, offset: new Vector3(-1, 0, -2) }),
    ];
  }

  public update(water: GerstnerWater): void {
    const normal = new Vector3(0, 0, 0);
    const position = new Vector3(0, 0, 0);

    for (const floatPoint of this.floatPoints) {
      const { normal: floatNormal, position: floatPosition } = floatPoint.getOffsetAndNormal(water);
      normal.add(floatNormal);
      position.add(floatPosition);
    }

    normal.divideScalar(this.floatPoints.length).normalize();
    position.divideScalar(this.floatPoints.length);

    this.boatObj.position.copy(position);
  }
}