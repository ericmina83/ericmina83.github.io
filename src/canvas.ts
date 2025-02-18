import boatModel from './Assets/Models/boat.glb?url';

import { ACESFilmicToneMapping, Clock, DepthFormat, DepthTexture, Fog, MathUtils, NearestFilter, PerspectiveCamera, PMREMGenerator, Scene, UnsignedShortType, Vector3, WebGLRenderer, WebGLRenderTarget } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Sky } from "three/examples/jsm/objects/Sky";
// import { Water } from "three/examples/jsm/objects/Water";
import { GerstnerWater } from "./GerstnerWater";
import Floater from './Floater';

const root = document.getElementById('canvas');

if (!root) {
  throw new Error('No root element found');
}

const clock = new Clock();

const renderer = new WebGLRenderer({ antialias: true });
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.25;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.autoClear = false;
const canvas = renderer.domElement;
root.appendChild(canvas);

const camera = new PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  1,
  1024
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
scene.fog = new Fog(0xC0BBB9, 0, 300);

const fbxLoader = new GLTFLoader();

let floater: Floater | null = null;

fbxLoader.loadAsync(boatModel).then((model) => {
  const { scene: boat } = model;
  boat.scale.setScalar(40);
  scene.add(boat);

  floater = new Floater(scene, boat, water, true)
});

const sun = new Vector3();

const water = new GerstnerWater()
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
  elevation: 15,
  azimuth: 45
};

const pmremGenerator = new PMREMGenerator(renderer);
const sceneEnv = new Scene();

let renderTarget: WebGLRenderTarget | undefined = undefined;

function updateSun() {

  const phi = MathUtils.degToRad(90 - parameters.elevation);
  const theta = MathUtils.degToRad(parameters.azimuth);

  sun.setFromSphericalCoords(1, phi, theta);

  sky.material.uniforms['sunPosition'].value.copy(sun);
  water.updateSun(sun);

  if (renderTarget !== undefined) renderTarget.dispose();

  sceneEnv.add(sky);
  renderTarget = pmremGenerator.fromScene(sceneEnv);
  scene.add(sky);

  scene.environment = renderTarget.texture;
  // waterScene.environment = renderTarget.texture;
  // waterScene.add(sky)
}

updateSun();

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.495;
controls.target.set(0, 10, 0);
controls.minDistance = 40.0;
controls.maxDistance = 200.0;
controls.update();


const animate = () => {

  const delta = clock.getDelta();
  water.updateDeltaTime(delta);
  floater?.update(delta);

  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);
