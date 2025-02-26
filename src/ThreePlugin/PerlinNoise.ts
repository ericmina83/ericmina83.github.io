import { Vector2 } from "three";
import { Rng } from "./Rng";
import { lerp } from "three/src/math/MathUtils";

const fadeFunction = (t: number) => {
  return t * (t * (t * (10 + t * (-15 + 6 * t))))
};

export class PerlinNoise {

  private grid: Vector2[][] = []

  constructor(
    private readonly size: number,
    seed = 0
  ) {
    const rng = new Rng(seed);

    for (let x = 0; x < size; x++) {
      const column: Vector2[] = []

      for (let y = 0; y < size; y++) {
        column.push(
          new Vector2(
            rng.nextFloat() * 2 - 1,
            rng.nextFloat() * 2 - 1
          ).normalize()
        )
      }

      this.grid.push(column);
    }

    console.log(this.grid)
  }


  public getNoise(position: Vector2): number {

    const sample = new Vector2(
      position.x % 1,
      position.y % 1
    );

    const sampleInt = new Vector2(
      Math.floor(position.x) % this.size,
      Math.floor(position.y) % this.size
    );

    const pixel: number[][] = [];

    for (let x = 0; x < 2; x++) {
      const row: number[] = []
      pixel.push(row)
      for (let y = 0; y < 2; y++) {
        const distance = sample.clone().sub(new Vector2(x, y));
        const gradient = this.grid[(sampleInt.x + x) % this.size][(sampleInt.y + y) % this.size]
        const dot = distance.dot(gradient);
        row.push(dot)
      }
    }

    return lerp(
      lerp(
        pixel[0][0],
        pixel[1][0],
        fadeFunction(sample.x)
      ),
      lerp(
        pixel[0][1],
        pixel[1][1],
        fadeFunction(sample.x)
      ),
      fadeFunction(sample.y)
    )
  }
}