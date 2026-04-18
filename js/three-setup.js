import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { UltraHDRLoader } from "three/addons/loaders/UltraHDRLoader.js";


// CANVAS
const canvas = document.getElementById("ship-model");

// SCENE
const scene = new THREE.Scene();
scene.background = null;

// CAMERA
const camera = new THREE.PerspectiveCamera(60, 600 / 400, 0.01, 10000);
camera.position.set(0, 60, 180);
camera.lookAt(0, 20, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(600, 400);
renderer.setPixelRatio(1);

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const keyLight = new THREE.DirectionalLight(0xffffff, 2);
keyLight.position.set(10, 15, 10);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 1);
rimLight.position.set(-10, 5, -10);
scene.add(rimLight);


// HELPERS
// scene.add(new THREE.AxesHelper(100));
// scene.add(new THREE.GridHelper(500, 50));

// LOAD MODEL
const loader = new GLTFLoader();
let ship = null;

loader.load("/assets/3d/container_ship.glb", (gltf) => {
  ship = gltf.scene;

  // CENTER
  const box = new THREE.Box3().setFromObject(ship);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  ship.position.sub(center);

  // LIFT ABOVE GRID
  ship.position.y += size.y / 2;

  // SCALE
  const maxDim = Math.max(size.x, size.y, size.z);
  ship.scale.setScalar(160 / maxDim);
  ship.rotation.y = -0.6;   // left-right turn
  ship.rotation.x = -0.08;  // slight nose-down
  ship.rotation.z = 0.02;   // subtle roll


  scene.add(ship);

  console.log("SHIP FINALLY VISIBLE ✅", size);
});

// 🔁 RENDER LOOP (THIS IS MANDATORY)
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
