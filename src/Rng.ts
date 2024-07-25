
/**
 * https://stackoverflow.com/questions/424292/seedable-javascript-random-number-generator
 */
export class Rng {

  // LCG using GCC's constants
  private m = 0x80000000; // 2**31;
  private a = 1103515245;
  private c = 12345;
  private state = 0;

  constructor(seed = 0) {
    this.state = (seed > 0) ? seed : Math.floor(Math.random() * (this.m - 1));
  }

  public nextInt(): number {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  }

  public nextFloat(): number {
    // returns in range [0,1]
    return this.nextInt() / (this.m - 1);
  }

  /**
   * Returns a random integer in range [start, end): including start, excluding end
   *
   * @param {number} start - The start of the range.
   * @param {number} end - The end of the range (exclusive).
   * @return {number} A random integer in the specified range.
   */
  public nextRange(start: number, end: number): number {
    // can't modulo nextInt because of weak randomness in lower bits
    const rangeSize = end - start;
    const randomUnder1 = this.nextInt() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
  }
}