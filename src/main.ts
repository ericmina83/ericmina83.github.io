// ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
import boatModel from './Assets/Models/boat.glb?url';

import { BoxGeometry, Clock, DirectionalLight, Fog, MathUtils, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, PMREMGenerator, RepeatWrapping, Scene, TextureLoader, Vector3, WebGLRenderer, WebGLRenderTarget } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Sky } from "three/examples/jsm/objects/Sky";
// import { Water } from "three/examples/jsm/objects/Water";
import { Water } from "./Water";
import waterNormals from "./Assets/Textures/waternormals.jpg?url";

const root = document.getElementById('root');

if (!root) {
  throw new Error('No root element found');
}

const clock = new Clock();

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const canvas = renderer.domElement;
root.appendChild(canvas);

const camera = new PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  500
)

camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const resizeHandler = (container: HTMLElement, renderer: WebGLRenderer) => {
  return () => {
    // look up the size the canvas is being displayed
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

const observer = new ResizeObserver(resizeHandler(root, renderer))
observer.observe(root)

const scene = new Scene();
// scene.fog = new Fog(0x000000, 0, 300);

const fbxLoader = new GLTFLoader();

fbxLoader.loadAsync(boatModel).then((model) => {
  const { scene: boat } = model;
  boat.scale.setScalar(40);
  scene.add(boat);
});

const cube = new Mesh(
  new BoxGeometry(1, 1, 1),
  new MeshStandardMaterial() 
);
scene.add(cube);

const sun = new Vector3();

const water = new Water(
  new PlaneGeometry(500, 500, 500, 500),
  {
    textureWidth: 512,
    textureHeight: 512,
    distortionScale: 3.7,
    fog: true,
    alpha: 1.0,
    waterNormals: new TextureLoader().load(waterNormals, (texture) => {
      texture.wrapS = texture.wrapT = RepeatWrapping;
    }),
    sunDirection: sun.clone().normalize(),
    sunColor: 0xffffff,
    waterColor: 0x00eeff,
  }
)
water.rotation.x = -Math.PI / 2;
scene.add(water);

const sky = new Sky();
sky.scale.setScalar(10000);
scene.add(sky);

const skyUniforms = sky.material.uniforms;

skyUniforms['turbidity'].value = 10;
skyUniforms['rayleigh'].value = 2;
skyUniforms['mieCoefficient'].value = 0.005;
skyUniforms['mieDirectionalG'].value = 0.8;

const parameters = {
  elevation: 90,
  azimuth: 180
};

const pmremGenerator = new PMREMGenerator(renderer);
const sceneEnv = new Scene();

let renderTarget: WebGLRenderTarget | undefined = undefined;

function updateSun() {

  const phi = MathUtils.degToRad(90 - parameters.elevation);
  const theta = MathUtils.degToRad(parameters.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  sky.material.uniforms['sunPosition'].value.copy(sun);
  water.material.uniforms['sunDirection'].value.copy(sun).normalize();

  if (renderTarget !== undefined) renderTarget.dispose();

  sceneEnv.add(sky);
  renderTarget = pmremGenerator.fromScene(sceneEnv);
  scene.add(sky);

  scene.environment = renderTarget.texture;
}

updateSun();

// 
const controls = new OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI * 0.495;
controls.target.set( 0, 10, 0 );
controls.minDistance = 40.0;
controls.maxDistance = 200.0;
controls.update();

const animate = () => {
  const delta = clock.getDelta();
  water.updateDeltaTime(delta);
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);
