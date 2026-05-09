import { MathUtils, Vector3 } from "three";

export const getWaveParameters = (waveCount: number) => {
  let steepnessAdd = 0;

  const steepnessMin = 1 / waveCount / 5;

  const waves: Vector3[] = [];

  for (let i = 0; i < waveCount; i++) {
    const wave = new Vector3();
    wave.x = Math.random() * 2 * Math.PI; // angle in degrees
    if (i === waveCount - 1) {
      wave.y = 1 - steepnessAdd; // steepness
    } else {
      wave.y = MathUtils.lerp(steepnessMin, 1 - steepnessAdd - (steepnessMin * (waveCount - i - 1)), Math.random()); // steepness
    }
    steepnessAdd += wave.y;
    wave.z = MathUtils.lerp(20, 30, Math.random()); // wavelength
    waves.push(wave);
  }

  return waves;
}
