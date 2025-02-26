import { MathUtils, Vector2, Vector3 } from "three";
import { getWaveInfo as getWaveInfoTarget } from "../ThreePlugin/GerstnerWater.utility";
import { describe, expect, test } from '@jest/globals';

// function from https://sbedit.net/utils/gerstnerWater.js
const getWaveInfo = (x: number, z: number, time: number, waves: {
  direction: number;
  steepness: number;
  wavelength: number;
}[]) => {
  const pos = new Vector3()
  const tangent = new Vector3(1, 0, 0)
  const binormal = new Vector3(0, 0, 1)
  waves.forEach((w) => {
    const k = (Math.PI * 2.0) / w.wavelength
    const c = Math.sqrt(9.8 / k)
    const d = new Vector2(
      Math.cos((w.direction * Math.PI) / 180),
      Math.sin((w.direction * Math.PI) / 180),
    )
    const f = k * (d.dot(new Vector2(x, z)) - c * time)
    const a = w.steepness / k

    pos.x += d.x * (a * Math.cos(f))
    pos.y += a * Math.sin(f)
    pos.z += d.y * (a * Math.cos(f))

    tangent.x += -d.x * d.x * (w.steepness * Math.sin(f))
    tangent.y += d.x * (w.steepness * Math.cos(f))
    tangent.z += -d.x * d.y * (w.steepness * Math.sin(f))

    binormal.x += -d.x * d.y * (w.steepness * Math.sin(f))
    binormal.y += d.y * (w.steepness * Math.cos(f))
    binormal.z += -d.y * d.y * (w.steepness * Math.sin(f))
  })

  const normal = binormal.cross(tangent).normalize()
  return { position: pos, normal: normal }
}

const dotTest1 = (x: number, z: number, angle: number) => {
  const d = new Vector2(
    Math.cos((angle * Math.PI) / 180),
    Math.sin((angle * Math.PI) / 180)
  )
  return d.dot(new Vector2(x, z));
}

const dotTest2 = (coord: Vector2, angle: number) => {
  const d = new Vector2(
    Math.cos((angle * Math.PI) / 180),
    Math.sin((angle * Math.PI) / 180)
  )
  return coord.dot(d);
}

describe('sum module', () => {
  test("vector3.x angle testing", () => {
    const wave = new Vector3(45, 0, 0)
    expect(wave.x).toBe(45);
  })
  test("degree match", () => {
    expect(MathUtils.degToRad(45)).toBe((45 * Math.PI) / 180);
  });
  test("dot testing", () => {
    expect(dotTest2(new Vector2(1, 1), 45)).toBe(dotTest1(1, 1, 45));
  })
  test('test getWaveInfo', () => {
    const targetPos = new Vector2(40, 40)
    const waves = [
      new Vector3(MathUtils.degToRad(45), 2.84, 1.5),
      new Vector3(MathUtils.degToRad(105), 1.2, 3.18),
      new Vector3(MathUtils.degToRad(-65), 0.8, 5.67),
      // new Vector3(45, 2.84, 1.5),
      // new Vector3(105, 1.2, 3.18),
      // new Vector3(-65, 0.8, 5.67),
    ]
    const waveInfoTarget = getWaveInfoTarget(targetPos, waves, 13245.12345)
    const answer = getWaveInfo(targetPos.x, targetPos.y, 13245.12345, [
      {
        direction: 45,
        steepness: 2.84,
        wavelength: 1.5
      },
      {
        direction: 105,
        steepness: 1.2,
        wavelength: 3.18
      },
      {
        direction: -65,
        steepness: 0.8,
        wavelength: 5.67
      }
    ])

    expect(waveInfoTarget.normal.x).toBe(answer.normal.x);
    expect(waveInfoTarget.normal.y).toBe(answer.normal.y);
    expect(waveInfoTarget.normal.z).toBe(answer.normal.z);
  });
});