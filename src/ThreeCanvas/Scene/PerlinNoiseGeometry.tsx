import { BufferAttribute, BufferGeometry, Vector2 } from "three";

import { PerlinNoise } from "@/ThreePlugin/PerlinNoise";

export class PerlinNoiseGeometry extends BufferGeometry {
  constructor(size: number, resolution: number) {
    super();
    const perlinNoise = new PerlinNoise(resolution);

    const positions: number[] = []
    const indices: number[] = []
    const segment = size / resolution

    for (let x = 0; x <= resolution; x++) {
      for (let y = 0; y <= resolution; y++) {

        const height =
          perlinNoise.getNoise(new Vector2(x * segment, y * segment)) +
          perlinNoise.getNoise(new Vector2(x * segment / 1.5, y * segment / 1.5))

        positions.push(x * segment)
        positions.push(height)
        positions.push(y * segment)

        if (x == resolution || y == resolution)
          continue;

        const pointId = (x + y * (resolution + 1));

        indices.push(pointId + resolution + 1)
        indices.push(pointId)
        indices.push(pointId + 1)

        indices.push(pointId + resolution + 2)
        indices.push(pointId + resolution + 1)
        indices.push(pointId + 1)
      }
    }

    this.setIndex(new BufferAttribute(new Uint32Array(indices), 1))
    this.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
    this.computeVertexNormals();
  }
}