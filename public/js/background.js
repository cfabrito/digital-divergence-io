import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

function createWalker() {
  const position = new THREE.Vector3(0, 0, 0);
  const points = [position.clone()];

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random())
  });

  const line = new THREE.Line(geometry, material);
  scene.add(line);

  return { position, points, geometry, line };
}



const canvas=document.getElementById('bg-canvas');


// Scene setup
const scene = new THREE.Scene();

const camera=new THREE.PerspectiveCamera( 75, canvas.clientWidth/canvas.clientHeight, 0.1, 1000 );
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(canvas.clientWidth, window.innerHeight);

// Line material
const material = new THREE.LineBasicMaterial({ color: 0xffffff });

// Geometry to store path

const walkers = [];

const NUM_WALKERS = 1;

for (let i = 0; i < NUM_WALKERS; i++) {
  walkers.push(createWalker());
}

// Random walk step
function stepWalker(walker) {
  const HALF_SIZE = 4;

  const bounds = {
    min: -HALF_SIZE,
    max: HALF_SIZE
  };

  const stepSize = 0.5;
  const direction = Math.floor(Math.random() * 6);

  switch (direction) {
    case 0: walker.position.x += stepSize; break;
    case 1: walker.position.x -= stepSize; break;
    case 2: walker.position.y += stepSize; break;
    case 3: walker.position.y -= stepSize; break;
    case 4: walker.position.z += stepSize; break;
    case 5: walker.position.z -= stepSize; break;
  }

  // Clamp
  walker.position.x = THREE.MathUtils.clamp(walker.position.x, bounds.min, bounds.max);
  walker.position.y = THREE.MathUtils.clamp(walker.position.y, bounds.min, bounds.max);
  walker.position.z = THREE.MathUtils.clamp(walker.position.z, bounds.min, bounds.max);

  walker.points.push(walker.position.clone());

  if (walker.points.length > 20) {
    walker.points.shift();
  }

  walker.geometry.setFromPoints(walker.points);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  for (const walker of walkers) {
    stepWalker(walker);
  }

  renderer.render(scene, camera);
}

animate();