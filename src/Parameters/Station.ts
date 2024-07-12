import { Quaternion, Vector3 } from "three";

interface CameraState {
  position: Vector3
  rotation: Quaternion
}


interface Station {
  cameraState: CameraState
}

export const stations: Station[] = [
  {
    cameraState: {
      position: new Vector3(
        -20.23217645443832,
        33.55518420302253,
        20.2148765689307
      ),
      rotation: new Quaternion(
        -0.1729770499307376,
        -0.4083047358074556,
        -0.06926355695035077,
      )
    }
  }
]