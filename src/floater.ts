import * as THREE from 'three'
import { GerstnerWater } from './GerstnerWater'

interface FloatPointConfig {
  offset: THREE.Vector3
}

const floatPointsConfig: FloatPointConfig[] = [
  { offset: new THREE.Vector3(0.05, 0, 0) },
  { offset: new THREE.Vector3(-0.05, 0, 0) },
  { offset: new THREE.Vector3(0, 0, 0.12) },
  { offset: new THREE.Vector3(0, 0, -0.12) },
];

interface FloatPoint {
  fpObject: THREE.Object3D
  waveNormalHelper: THREE.ArrowHelper
  gravitySlideHelper: THREE.ArrowHelper
}

export default class Floater {
  private object: THREE.Object3D
  private water: GerstnerWater;
  private floatPoints: FloatPoint[] = []
  down = new THREE.Vector3(0, -1, 0)
  heading = 0
  power = 0
  isPlayerFloater = false
  //sphereMesh
  //boxHelper: THREE.Box3Helper
  lastPosition = new THREE.Vector3()
  velocity = new THREE.Vector3()
  ms = 0
  private forces: THREE.Vector3[] = []

  constructor(
    scene: THREE.Scene,
    object: THREE.Object3D,
    water: GerstnerWater,
    isPlayerFloater = false
  ) {
    this.object = object
    this.water = water;
    this.isPlayerFloater = isPlayerFloater

    this.floatPoints = floatPointsConfig.map((config) => {
      const fpObject = new THREE.Object3D();
      object.add(fpObject)
      fpObject.position.copy(config.offset);

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
      // scene.add(gravitySlideHelper);

      return {
        fpObject,
        waveNormalHelper,
        gravitySlideHelper
      }
    });
  }

  // r = 0
  public update(delta: number): void {
    //this.boxHelper.updateMatrixWorld(true)

    // const t = this.gerstnerWater.water.material.uniforms['time'].value

    const accumulatedPosition = new THREE.Vector3() // this.object.position.clone()

    const accumulatedNormal = new THREE.Vector3(0, 0, 0)

    this.floatPoints.forEach(({ fpObject, waveNormalHelper, gravitySlideHelper }) => {
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

      accumulatedPosition.y += offset.y
      // accumulatedPosition.x += this.object.position.x + normal.x
      // accumulatedPosition.z += this.object.position.z + normal.z

      accumulatedNormal.add(normal)
    })
    accumulatedPosition.y -= 3.5
    //average all floatPoints directions
    accumulatedPosition.divideScalar(this.floatPoints.length)
    accumulatedNormal.normalize();

    //this.object.position.y = accumulatedPosition.y

    // accumulatedPosition.x += Math.sin(this.heading) * this.power
    // accumulatedPosition.z += Math.cos(this.heading) * this.power

    //this.object.position.copy(accumulatedPosition)//
    this.object.position.lerp(accumulatedPosition, 0.25)

    this.velocity = this.lastPosition.clone().sub(accumulatedPosition).negate()

    const dist = accumulatedPosition.distanceTo(this.lastPosition)
    this.ms = dist * 1000 * delta
    this.lastPosition = accumulatedPosition


    // _axis.set(dir.z, 0, - dir.x).normalize();

    // const radians = Math.acos(dir.y);

    const rotateToUp = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), accumulatedNormal);

    this.object.quaternion.slerp(rotateToUp, 0.01);
  }
}