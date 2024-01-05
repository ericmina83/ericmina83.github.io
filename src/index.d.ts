import { Water } from "three/examples/jsm/objects/Water.js";
import { ReactThreeFiber } from "@react-three/fiber";

extend({ Water });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      water: ReactThreeFiber.Object3DNode<Water, typeof Water>;
    }
  }
}
