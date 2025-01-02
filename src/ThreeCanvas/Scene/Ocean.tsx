import { useFrame, useThree } from "@react-three/fiber";
import waterVertex from "@/Assets/Shaders/water.vert";
import waterFragment from "@/Assets/Shaders/water.frag";

import { useDepthBuffer, useFBO } from "@react-three/drei";
import { DataTexture, Vector2, RepeatWrapping, RGBAFormat, NearestFilter, RawShaderMaterial } from "three";
import { useMemo, useRef } from "react";

let time = 0;

function getWave(j: number, jMax: number) {
  const amp = 1.5 / Math.pow(j, 2.0);
  const frq = (0.002 + ((j - 1) / jMax) * 0.18) / 0.06;
  return {
    steepness: (j + 2) / (jMax + 2),
    speed: 2.0 * (j + 1) / jMax,
    angle: j * Math.PI * 2.0 / jMax,
    frequency: frq,
    amplitude: amp
  };
}

export const Ocean: React.FC<{ size: number }> = ({ size }) => {
  const materialRef = useRef<RawShaderMaterial>(null!)

  const dataTexture = useMemo(() => {
    const width = 8;
    const height = 8;
    const size = width * height;
    const data = new Uint8Array(4 * size);

    for (let i = 0; i < 16; i++) {
      const w = getWave(i, size);
      data[i * 8 + 0] = 255 * w.steepness;
      data[i * 8 + 1] = 255 * w.speed;
      data[i * 8 + 2] = 0.0;
      data[i * 8 + 3] = 0.0;
      data[i * 8 + 4] = 255.0 * w.angle;
      data[i * 8 + 5] = 255.0 * w.frequency;
      data[i * 8 + 6] = 255.0 * w.amplitude;
      data[i * 8 + 7] = 0.0;

    }

    const tex = new DataTexture(data, width, height, RGBAFormat);
    tex.generateMipmaps = false;
    tex.minFilter = NearestFilter;
    tex.magFilter = NearestFilter;
    tex.wrapT = RepeatWrapping; // should not be useful
    tex.wrapS = RepeatWrapping;
    return tex;

  }, [])


  const db = useDepthBuffer({
    size: 2048,
  });
  const rt = useFBO()

  const { camera } = useThree();

  useFrame(({ gl, camera, scene }, delta) => {
    gl.setRenderTarget(rt);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    time += delta;

    const material = materialRef.current;
    material.uniforms.time.value = time;
  });

  return (
    <mesh
      rotation-x={-Math.PI / 2}
      scale={[1, 1, 1]}
    // geometry={new PerlinNoiseGeometry(size, 256)}
    >
      <planeGeometry args={[size, size, size * 2 / 5, size * 2 / 5]} />
      {/* <bufferGeometry onUpdate={self => self.computeVertexNormals()}>
        <bufferAttribute
          attach='attributes-position' // 'attributes-position'
          array={new Float32Array(positions)}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="index"
          array={new Uint32Array(indices)}
          count={indices.length}
          itemSize={1}
        />
      </bufferGeometry> */}
      {/* <meshNormalMaterial /> */}
      <rawShaderMaterial
        ref={materialRef}
        uniforms={{
          direction: { value: (new Vector2(1, 1)).normalize() },
          waveData: { value: dataTexture },
          time: { value: 0 },
          // map: { value: rt.texture },
          cameraNear: { value: camera.near },
          cameraFar: { value: camera.far },
          tDepth: { value: db },
        }}
        vertexShader={waterVertex}
        fragmentShader={waterFragment}
      />
    </mesh>
  );
}
