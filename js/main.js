import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const canvas = document.getElementById("ship-model");
const wrapper = document.getElementById("ship-wrapper");
const scene = new THREE.Scene();
let clock = new THREE.Clock();
let scrollProgress = 0;
let ship;

// ==========================
// CAMERA & RENDERER SETUP
// ==========================
const camera = new THREE.PerspectiveCamera(20, wrapper.clientWidth / wrapper.clientHeight, 1, 2000);
camera.position.set(400, 60, 250);
const target = new THREE.Vector3(100, 20, 0);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
  powerPreference: "high-performance"
});
renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;

// ==========================
// ENTRANCE ANIMATION FUNCTION
// ==========================
const startEntranceAnimation = () => {
  // Check if it already ran to prevent double-firing
  if (window.entranceStarted) return;
  window.entranceStarted = true;

  console.log("Starting Entrance Animation...");
  const tl = gsap.timeline();

  // Reveal hidden containers
  tl.set(["#ship-model", "#right"], { visibility: "visible" })
    .to("#ship-model", { 
      opacity: 1, 
      duration: 1.5, 
      ease: "power2.out" 
    })
    .from("#right h1", {
      opacity: 0,
      x: 100,
      duration: 1,
      stagger: 0.2,
      ease: "power4.out"
    }, "-=1.0")
    .to("#left", {
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    }, "-=0.5");
};

// ==========================
// LOADING MANAGER
// ==========================
const manager = new THREE.LoadingManager();

manager.onStart = (url, itemsLoaded, itemsTotal) => {
  console.log(`Started loading: ${url}. \nLoaded ${itemsLoaded} of ${itemsTotal} files.`);
};

manager.onLoad = () => {
  console.log("All assets loaded by manager.");
  startEntranceAnimation();
};

manager.onError = (url) => {
  console.error('Error loading:', url);
  // Fallback: Show text even if 3D fails
  startEntranceAnimation();
};

// Safety Fallback: If assets take > 5 seconds, show the text anyway
setTimeout(() => {
    if (!window.entranceStarted) {
        console.warn("Loading taking too long, forcing animation...");
        startEntranceAnimation();
    }
}, 5000);

// ==========================
// ASSET LOADING
// ==========================
const hdrLoader = new RGBELoader(manager);
hdrLoader.load("./assets/images/lonely_road_afternoon_4k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;
});

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const loader = new GLTFLoader(manager);
loader.setDRACOLoader(dracoLoader);

loader.load("./assets/3d/container_ship-compressed.glb", (gltf) => {
  ship = gltf.scene;
  ship.traverse((child) => {
    if (child.isMesh) {
      child.material.roughness = 0.15;
      child.material.metalness = 0.8;
      child.material.envMapIntensity = 1.2;
    }
  });

  const box = new THREE.Box3().setFromObject(ship);
  const center = box.getCenter(new THREE.Vector3());
  ship.position.sub(center);
  ship.position.set(0, 0, 0);
  ship.scale.setScalar(4.5);
  ship.rotation.y = Math.PI / 1.5;
  scene.add(ship);
});

const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(200, 100, 100);
scene.add(sunLight);

// ==========================
// RENDER & SCROLL
// ==========================
function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  if (ship) {
    ship.position.y = Math.sin(time * 0.8) * 2.5;
    ship.rotation.z = -0.05 + Math.sin(time * 0.5) * 0.01;
    ship.rotation.x = Math.sin(time * 0.4) * 0.01;
  }
  
  // Smooth FOV update
  const baseFov = 20;
  const maxZoomOut = 5;
  const targetFov = baseFov + (scrollProgress * maxZoomOut);
  camera.fov += (targetFov - camera.fov) * 0.1;
  camera.updateProjectionMatrix();

  camera.lookAt(target);
  renderer.render(scene, camera);
}
animate();

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: "body",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => {
    scrollProgress = self.progress;
  }
});

// Plane Timeline
let planeTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#page3",
    start: "top top",
    end: "+=1500",
    scrub: 1,
    pin: true
  }
});

planeTl.to("#plane-img", {
  x: window.innerWidth * 2.2,
  duration: 3,
  ease: "none"
})
.to(".text1", { opacity: 0, duration: 0.4 }, 1.2)
.to(".text2", { opacity: 1, duration: 0.4 }, 1.4);

// Handle Resize
window.addEventListener("resize", () => {
  camera.aspect = wrapper.clientWidth / wrapper.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
});

window.addEventListener('DOMContentLoaded', () => {
    // Get the hash from URL (e.g., #air)
    const hash = window.location.hash;

    if (hash) {
        // Map the hashes to your IDs
        const tabMap = {
            '#logistic': 'link-logistic',
            '#cargo': 'link-cargo',
            '#air': 'link-air',
            '#lcl': 'link-lcl',
            '#fcl': 'link-fcl'
        };

        const targetId = tabMap[hash];
        const tabButton = document.getElementById(targetId);

        if (tabButton) {
            // This triggers your existing openStory function
            tabButton.click(); 
        }
    }
});