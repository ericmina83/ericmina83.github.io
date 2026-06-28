import { Group, Mesh, BoxGeometry, ShaderMaterial } from "three";
import testVert from "../Assets/Shaders/test.vert";
import waterFrag from "../Assets/Shaders/water.frag";

export class TextCube extends Group {
  private cube: Mesh;

  constructor() {
    super();

    const boxSize = 10;

    const geometry = new BoxGeometry(boxSize, boxSize, boxSize);
    const material = new ShaderMaterial({
      vertexShader: testVert,
      fragmentShader: waterFrag,
    });

    this.cube = new Mesh(geometry, material);
    this.add(this.cube);
  }
}