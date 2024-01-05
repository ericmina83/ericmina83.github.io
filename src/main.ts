import { SceneManager } from "./scene-manager";

const sceneManager = new SceneManager();

window.addEventListener("resize", () => {
  sceneManager.resizeWindow();
});

const animate = () => {
  requestAnimationFrame(animate);

  sceneManager.update();
};

animate();
