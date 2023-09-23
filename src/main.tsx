import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
const scene = new THREE.Scene();

const resizeWindow = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};

resizeWindow();

new OrbitControls(camera, renderer.domElement);

window.addEventListener("resize", resizeWindow);

scene.add(
  new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshNormalMaterial())
);

const animate = () => {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
};

animate();
