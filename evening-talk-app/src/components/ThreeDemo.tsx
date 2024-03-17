import * as THREE from "three";

class Cube extends THREE.Mesh {
  constructor() {
    super();

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial();
    // material.color.set("blue");s

    this.geometry = geometry;
    this.material = material;
  }

  update() {
    this.rotation.x += 0.01;
    this.rotation.y += 0.01;
  }

  dispose() {
    this.geometry.dispose();
  }
}

// Create "Canvas"
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;

// Add elements
const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

const pointLight = new THREE.PointLight();

pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const cube = new Cube();
scene.add(cube);

// Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const container = document.getElementById("__next");

if (container) {
  container.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  cube.update();
}

animate();
