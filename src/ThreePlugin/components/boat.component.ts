import { ECSComponent } from "@/ecs/component";
import { ArrowHelper, Group, Mesh, MeshBasicMaterial, Scene, SphereGeometry, Vector3 } from "three";
import { FloatPoint } from "../floatPoint";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { GerstnerWater } from "../GerstnerWater";


export class BoatComponent extends ECSComponent {
  private readonly boatParent: Group;
  private readonly boatObj: Group;

  private readonly floatPoints: FloatPoint[];

  private readonly debugGroup: Group;
  private readonly fpSpheres: Mesh[];
  private readonly centerSphere: Mesh;
  private readonly normalArrow: ArrowHelper;
  private readonly offsetArrows: ArrowHelper[];

  constructor(scene: Scene, boatGLTF: GLTF) {
    super();

    this.boatParent = new Group();
    this.boatObj = boatGLTF.scene;
    this.boatObj.scale.setScalar(40);
    this.boatParent.add(this.boatObj);
    scene.add(this.boatParent);

    this.floatPoints = [
      new FloatPoint({ parent: this.boatParent, offset: new Vector3(1, 0, 2) }),
      new FloatPoint({ parent: this.boatParent, offset: new Vector3(-1, 0, 2) }),
      new FloatPoint({ parent: this.boatParent, offset: new Vector3(1, 0, -2) }),
      new FloatPoint({ parent: this.boatParent, offset: new Vector3(-1, 0, -2) }),
    ];

    this.debugGroup = new Group();
    scene.add(this.debugGroup);

    const fpGeo = new SphereGeometry(0.2);
    const fpMat = new MeshBasicMaterial({ color: 0xff4444 });
    this.fpSpheres = this.floatPoints.map(() => {
      const mesh = new Mesh(fpGeo, fpMat);
      this.debugGroup.add(mesh);
      return mesh;
    });

    const centerGeo = new SphereGeometry(0.35);
    this.centerSphere = new Mesh(centerGeo, new MeshBasicMaterial({ color: 0xffff00 }));
    this.debugGroup.add(this.centerSphere);

    this.normalArrow = new ArrowHelper(new Vector3(0, 1, 0), new Vector3(), 3, 0x4488ff);
    this.debugGroup.add(this.normalArrow);

    this.offsetArrows = this.floatPoints.map(() => {
      const arrow = new ArrowHelper(new Vector3(0, 1, 0), new Vector3(), 1, 0x44ff88);
      this.debugGroup.add(arrow);
      return arrow;
    });
  }

  public update(water: GerstnerWater): void {
    const positions: Vector3[] = [];
    const offsets: Vector3[] = [];

    for (const floatPoint of this.floatPoints) {
      const { position, offset } = floatPoint.getOffsetAndNormal(water);
      positions.push(position);
      offsets.push(offset);
    }

    // 加權質心：以各點 offset.y 相對最低點的差值為權重，避免硬截斷造成不連續
    const minY = Math.min(...offsets.map(o => o.y));
    const weights = offsets.map(o => o.y - minY);
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    const center = new Vector3();

    // x, z：簡單平均，不受波浪權重影響
    for (const p of positions) {
      center.x += p.x;
      center.z += p.z;
    }
    center.x /= positions.length;
    center.z /= positions.length;

    // y：加權平均，波峰貢獻較多
    if (totalWeight > 0.001) {
      for (let i = 0; i < positions.length; i++) {
        center.y += positions[i].y * weights[i];
      }
      center.y /= totalWeight;
    } else {
      for (const p of positions) center.y += p.y;
      center.y /= positions.length;
    }
    center.y -= 1.5;

    // 旋轉：用四個點的對角線 cross product 擬合平面
    // 點的順序: [0]=(+x,+z), [1]=(-x,+z), [2]=(+x,-z), [3]=(-x,-z)
    const d1 = new Vector3().subVectors(positions[3], positions[0]);
    const d2 = new Vector3().subVectors(positions[2], positions[1]);
    const planeNormal = new Vector3().crossVectors(d2, d1).normalize();

    this.boatObj.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), planeNormal);
    this.boatObj.position.copy(center);

    // 更新可視化
    positions.forEach((p, i) => this.fpSpheres[i].position.copy(p));

    this.centerSphere.position.copy(center);

    this.normalArrow.position.copy(center);
    this.normalArrow.setDirection(planeNormal);

    offsets.forEach((offset, i) => {
      const basePos = positions[i].clone().sub(offset);
      this.offsetArrows[i].position.copy(basePos);
      const len = offset.length();
      if (len > 0.001) {
        this.offsetArrows[i].setDirection(offset.clone().divideScalar(len));
        this.offsetArrows[i].setLength(len);
      }
    });
  }
}