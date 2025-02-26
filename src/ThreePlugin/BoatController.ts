import * as THREE from 'three'

import { GerstnerWater } from './GerstnerWater'
import boatModel from '../Assets/Models/boat.glb?url';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const floatPointOffsets: THREE.Vector3[] = [
  new THREE.Vector3(0.05, 0, 0),
  new THREE.Vector3(-0.05, 0, 0),
  new THREE.Vector3(0, 0, 0.12),
  new THREE.Vector3(0, 0, -0.12),
];

interface FloatPoint {
  fpObject: THREE.Object3D
  waveNormalHelper: THREE.ArrowHelper
  gravitySlideHelper: THREE.ArrowHelper
}

export default class BoatController {
  private readonly boatPromise: Promise<THREE.Object3D>;
  private readonly floatPointsPromise: Promise<FloatPoint[]>;
  private horizontalPosition = new THREE.Vector3(0, 0, 0);

  constructor(
    loader: GLTFLoader,
    private readonly water: GerstnerWater,
    scene: THREE.Scene,
  ) {
    this.boatPromise = loader.loadAsync(boatModel).then((model) => {
      const boat = model.scene;
      boat.scale.setScalar(40);
      scene.add(boat);
      boat.position.copy(this.horizontalPosition);
      return boat;
    });

    this.floatPointsPromise = this.boatPromise.then((object) => {
      return floatPointOffsets.map((offset) => {
        const fpObject = new THREE.Object3D();

        object.add(fpObject)

        fpObject.position.copy(offset);

        const waveNormalHelper = new THREE.ArrowHelper(
          new THREE.Vector3(),
          new THREE.Vector3(),
          5,
          0xffff00
        );
        waveNormalHelper.position.copy(fpObject.position)
        scene.add(waveNormalHelper);

        const gravitySlideHelper = new THREE.ArrowHelper(
          new THREE.Vector3(0, 1, 0),
          new THREE.Vector3(),
          5,
          0x00ffff
        );
        gravitySlideHelper.position.copy(fpObject.position)
        scene.add(gravitySlideHelper);

        return {
          fpObject,
          waveNormalHelper,
          gravitySlideHelper
        }
      });
    });
  }

  public setHorizontalPosition(x: number, z: number): void {
    this.horizontalPosition.set(x, 0, z);
  }

  public async update() {
    const boat = (await this.boatPromise);

    const accumulatedPosition = new THREE.Vector3(0, 0, 0);
    const accumulatedNormal = new THREE.Vector3(0, 0, 0);

    const floatPoints = (await this.floatPointsPromise);

    floatPoints.forEach(({ fpObject, waveNormalHelper, gravitySlideHelper }) => {
      const fpWorldPos = new THREE.Vector3()

      fpObject.getWorldPosition(fpWorldPos)

      const { normal, offset } = this.water.getWaveInfo(
        new THREE.Vector2(
          fpWorldPos.x,
          fpWorldPos.z)
      );

      const worldPos = new THREE.Vector3()

      fpObject.getWorldPosition(worldPos)

      waveNormalHelper.position.copy(fpWorldPos)
      waveNormalHelper.setDirection(normal)

      const gravitySlideDirection = new THREE.Vector3(0, -1, 0)
        .add(normal)
        .divideScalar(2)
        .normalize()

      gravitySlideHelper.setDirection(gravitySlideDirection)
      gravitySlideHelper.position.copy(fpWorldPos)

      // accumulatedPosition.y += offset.y
      // accumulatedPosition.x += boat.position.x + normal.x;
      // accumulatedPosition.z += boat.position.z + normal.z;

      accumulatedPosition.add(offset);

      accumulatedNormal.add(normal)
    })

    accumulatedPosition.divideScalar(floatPoints.length);
    accumulatedPosition.add(this.horizontalPosition);
    // accumulatedPosition.y -= 1.5; // Sink boat some height...

    accumulatedNormal.normalize();

    boat.position.lerp(accumulatedPosition.add(this.horizontalPosition), 0.25)

    const rotateToUp = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), accumulatedNormal);

    boat.quaternion.slerp(rotateToUp, 0.01);
  }

  private async setDirection(position: THREE.Vector3, up: THREE.Vector3) {
    const boat = await this.boatPromise;
    boat.position.lerp(position, 0.25)

    const rotateToUp = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);

    boat.quaternion.slerp(rotateToUp, 0.001);
  }
}