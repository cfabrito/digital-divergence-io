import * as THREE from "/js/three/three.module.js";
import { MathUtils } from "/js/three/three.core.js";

import { Line2 } from '/js/three/examples/jsm/lines/Line2.js';
import { LineGeometry } from '/js/three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from '/js/three/examples/jsm/lines/LineMaterial.js';

const CameraZ = 10;
const CameraFOV = 50;

const Walker1Count = 20;
const Walker2Count = 20;

const Walker1Step = 1.0;
const Walker2Step = 0.5;

const Walker1Speed = 2.5;
const Walker2Speed = 2.5;

const WalkerTrails = 50;

const DebugBounds = false;

function wrap(value, min, max)
{
  const range = max-min
  
  if (value <= min)
    value += range
  else if (value >= max)
    value -= range

  return value
}

class Bounds
{
  constructor(minx, maxx, miny, maxy, minz, maxz)
  {
    this.min = new THREE.Vector3(minx, miny, minz);
    this.max = new THREE.Vector3(maxx, maxy, maxz);
  }

  contains(p)
  {
    return (
      p.x > this.min.x && p.x < this.max.x &&
      p.y > this.min.y && p.y < this.max.y &&
      p.z > this.min.z && p.z < this.max.z
    );
  }
}

class Walker
{
  constructor(stepSize, trailCount, color, speed, bounds)
  {
    this.direction = 4;

    this.speed = speed;
    this.stepSize = stepSize;

    this.bounds = bounds;

    this.distance = 0;
    this.currentPos = new THREE.Vector3(
      MathUtils.randFloat(bounds.min.x, bounds.max.x),
      MathUtils.randFloat(bounds.min.y, bounds.max.y),
      MathUtils.randFloat(bounds.min.z, bounds.max.z)
    );
    
    this.positions = [];
    this.colors = [];

    for (let i = 0; i < trailCount; i++)
    {
      let t = i / (trailCount-1);

      this.positions.push(this.currentPos.x, this.currentPos.y, this.currentPos.z);
      this.colors.push(color.r * t, color.g * t, color.b * t);
    }

    this.geometry = new LineGeometry();

    this.geometry.setPositions( this.positions );
    this.geometry.setColors( this.colors );

    this.material = new LineMaterial( { linewidth: 2, vertexColors: true } );
    this.line = new Line2( this.geometry, this.material );
  }

  changeDirection(changeProb = 0.1, dt)
  {
    if (Math.random() < changeProb)
    {
      const validDirs = [];

      for (let i = 0; i < 6; i++)
      {
        const vector = Walker.Directions[i];
        let displacement = this.speed * dt;
        const nextPos = this.currentPos.clone().addScaledVector(vector, displacement);

        if (this.bounds.contains(nextPos) && i != Walker.OpposingDirections[this.direction]) {
          validDirs.push(i);
        }
      }

      if (validDirs.length > 0)
      {
        this.direction = validDirs[Math.floor(Math.random() * validDirs.length)];
      }
      
    }
  }

  static Directions =
  [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1)
  ]

  static OpposingDirections = 
  [
    1,
    0,
    3,
    2,
    5,
    4
  ]

  walk(dt)
  {
    const vector = Walker.Directions[this.direction];
    let displacement = this.speed * dt;
    let nextPos = this.currentPos.clone().addScaledVector(vector, displacement);

    if (!this.bounds.contains(nextPos))
    {
        this.changeDirection(1.0, dt);

        const vector = Walker.Directions[this.direction];
        nextPos = this.currentPos.clone().addScaledVector(vector, displacement);
    }

    if (this.distance >= this.stepSize)
    {
      this.changeDirection(0.8, dt);
      this.distance = 0.0
    }
    else
      this.distance += displacement

    this.currentPos = nextPos;

    this.positions.shift();
    this.positions.shift();
    this.positions.shift();

    this.positions.push(this.currentPos.x);
    this.positions.push(this.currentPos.y);
    this.positions.push(this.currentPos.z);

    this.geometry.setPositions( this.positions );
  }

  onResize(newBounds)
  {
    this.bounds = newBounds;

    this.currentPos.x = THREE.MathUtils.clamp(
      this.currentPos.x,
      this.bounds.min.x,
      this.bounds.max.x
    );

  this.currentPos.y = THREE.MathUtils.clamp(
      this.currentPos.y,
      this.bounds.min.y,
      this.bounds.max.y
    );

  this.currentPos.z = THREE.MathUtils.clamp(
      this.currentPos.z,
      this.bounds.min.z,
      this.bounds.max.z
    );
  }
}


function getCameraBounds(camera, planeDistance)
{
  const distance = Math.abs(camera.position.z - planeDistance);

  const vFov = THREE.MathUtils.degToRad(camera.fov);

  const height = 2 * Math.tan(vFov / 2) * distance;
  const width = height * camera.aspect;

  return {
    minx: -width / 2,
    maxx:  width / 2,
    miny: -height / 2,
    maxy:  height / 2
  };
}

function getWalkerBounds(camera, planeDistance)
{
  let cameraBounds = getCameraBounds(camera, planeDistance);

  let margin = 0.95;

  const width = cameraBounds.maxx - cameraBounds.minx;
  const height = cameraBounds.maxy - cameraBounds.miny;

  const cx = cameraBounds.minx + width / 2;
  const cy = cameraBounds.miny + height / 2;

  const halfW = (width * margin) / 2;
  const halfH = (height * margin) / 2;

  return new Bounds(
    cx - halfW,
    cx + halfW,
    cy - halfH,
    cy + halfH,
    -planeDistance,
    planeDistance
  );
}

const canvas = document.getElementById('bg-canvas');

function getSize() {

  return {
    width: canvas.clientWidth,
    height: canvas.clientHeight
  };
}

let debugMesh;


const { width, height } = getSize();

let lastWidth = width;

const scene = new THREE.Scene();
const ratio = canvas.clientWidth/canvas.clientHeight;

const camera = new THREE.PerspectiveCamera(CameraFOV, ratio, 0.1, 100);
camera.position.z = CameraZ;

const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setSize(width, height, false);

if (DebugBounds)
{
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true, // or false for solid
  });

  debugMesh = new THREE.Mesh(geometry, material);

  scene.add(debugMesh);
}

let bounds = getWalkerBounds(camera, 0.5 * CameraZ)

let redWalkers = Array.from({length: Walker1Count}, (e, i) => new Walker(Walker1Step, WalkerTrails, new THREE.Color(1.0, 0, 0), Walker1Speed, bounds))
let blueWalkers = Array.from({length: Walker2Count}, (e, i) => new Walker(Walker2Step, WalkerTrails, new THREE.Color(0.0, 0, 1.0), Walker2Speed, bounds))

redWalkers.forEach(w => scene.add(w.line));
blueWalkers.forEach(w => scene.add(w.line));

handleResize(getSize());

function handleResize(size)
{
  const { width, height } = size;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  let bounds = getWalkerBounds(camera, 0.5 * CameraZ)

  const box = new THREE.Box3(
    bounds.min,
    bounds.max
  );

  if (DebugBounds)
  {
    const size = new THREE.Vector3();
    box.getSize(size);

    debugMesh.scale.x = size.x;
    debugMesh.scale.y = size.y;
    debugMesh.scale.z = size.z;
  }  

  redWalkers.forEach(w => w.onResize(bounds));
  blueWalkers.forEach(w => w.onResize(bounds));

  renderer.setSize(width, height);
}

const timer = new THREE.Timer();

// Animation loop
function animate(now) {
  timer.update();
  const dt = Math.min(timer.getDelta(), 1.0/60.0);

  requestAnimationFrame(animate);

  redWalkers.forEach(w => w.walk(dt));
  blueWalkers.forEach(w => w.walk(dt));

  let targetX = (-mouse.x * 0.5) * 3;
  let targetY = (mouse.y * 0.5) * 3;

  // smooth interpolation (lerp)
  // camera.position.x += (targetX - camera.position.x) * 0.03;
  // camera.position.y += (targetY - camera.position.y) * 0.03;

  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}



function onResize()
{
  const { width, height } = getSize();

  handleResize({width: window.innerWidth, height: window.innerHeight})
}

if (screen.orientation) { // Property doesn't exist on screen in IE11   
    screen.orientation.addEventListener("change", onResize);
}

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (!isMobile) {
  window.addEventListener('resize', onResize);
}

const mouse = { x: 0, y: 0 };

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
});

animate();