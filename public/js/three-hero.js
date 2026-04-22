import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const canvas=document.getElementById('bg-canvas');

const scene=new THREE.Scene();

const camera=new THREE.PerspectiveCamera(
75,
canvas.clientWidth/canvas.clientHeight,
0.1,
1000
);

const renderer=new THREE.WebGLRenderer({canvas});
renderer.setSize(canvas.clientWidth,canvas.clientHeight);

const cube=new THREE.Mesh(
new THREE.BoxGeometry(),
new THREE.MeshNormalMaterial()
);

scene.add(cube);
camera.position.z=3;

let mx=0;
let my=0;

window.addEventListener('mousemove',(e)=>{
mx=(e.clientX/window.innerWidth)-0.5;
my=(e.clientY/window.innerHeight)-0.5;
});

function animate(){
requestAnimationFrame(animate);

cube.rotation.y += 0.01;
cube.rotation.x += 0.01;

cube.rotation.y += mx*0.02;
cube.rotation.x += my*0.02;

renderer.render(scene,camera);
}

animate();