import { Vector2, Vector3 } from "three";

export const getWaveInfo = (coord: Vector2, waves: Vector3[], time: number) => {
  const offset = new Vector3();
  const tangent = new Vector3(1, 0, 0);
  const binormal = new Vector3(0, 0, 1);
  waves.forEach((wave) => {
    const { x: angle, y: steepness, z: waveLength } = wave;
    // console.log({ angle, amplitude, waveLength });
    const omega = (Math.PI * 2.0) / waveLength;
    const c = Math.sqrt(9.8 / omega);
    const d = new Vector2(
      Math.cos(angle),
      Math.sin(angle),
    );
    // const d = new Vector2(
    //   Math.cos((angle * Math.PI) / 180),
    //   Math.sin((angle * Math.PI) / 180)
    // )
    const theta = omega * (coord.dot(d) - c * time);
    const amp = steepness / omega;
    // theta = omega * (coord.x * d.x + coord.y * d.y) + c * time

    offset.x += d.x * (amp * Math.cos(theta));
    offset.y += amp * Math.sin(theta);
    offset.z += d.y * (amp * Math.cos(theta));

    // partial derivatives coord.x
    // d(theta) / d(coord.x) = omega * d.x
    // d(cos(theta)) / d(coord.x) = -sin(theta) * d(theta) / d(coord.x) 
    //                            = -sin(theta) * omega * d.x
    // d(amp * cos(theta)) / d(coord.x) = amp * d(cos(theta)) / d(coord.x)
    //                                  = amp * -sin(theta) * omega * d.x
    //                                  = -d.x * (amplitude / omega) * sin(theta) * omega
    //                                  = -d.x * amplitude * sin(theta)
    // tangent.x = d(d.x * amp * cos(theta)) / d(coord.x) 
    //           = d.x * d(amp * cos(theta)) / d(coord.x)
    //           = d.x * -d.x * amplitude * sin(theta)
    tangent.x += -d.x * d.x * (steepness * Math.sin(theta));
    tangent.y += d.x * (steepness * Math.cos(theta));
    tangent.z += -d.x * d.y * (steepness * Math.sin(theta));

    // partial derivatives coord.y
    // d(theta) / d(coord.y) = omega * d.y
    // binormal.x = d(d.x * amp * cos(theta)) / d(coord.y) 
    //            = d.x * amp * -sin(theta) * d(theta) / d(coord.y)
    //            = -d.x * d.y * amp * Math.sin(theta) * omega * d.y
    binormal.x += -d.y * d.x * (steepness * Math.sin(theta));
    binormal.y += d.y * (steepness * Math.cos(theta));
    binormal.z += -d.y * d.y * (steepness * Math.sin(theta));
  })

  const normal = binormal.clone().cross(tangent).normalize();

  return {
    offset,
    tangent,
    binormal,
    normal
  };
}