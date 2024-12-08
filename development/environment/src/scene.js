/*
Code based on:
https://jsfiddle.net/zr8aqheL/1/

Three.js Example
https://threejs.org/examples/#webgl_materials_envmaps
https://github.com/mrdoob/three.js/blob/dev/examples/webgl_materials_envmaps.html
*/

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

import vertexShader from './shader/environment.vert';
import fragmentShader from './shader/environment.frag';

// console.log(vertexShader);
// console.log(fragmentShader);


// Canvas
const canvas = document.querySelector("#canvasThree");
// Helper
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Renderer
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setSize(sizes.width, sizes.height);


// Scene
const scene = new THREE.Scene();



let r = "https://threejs.org/examples/textures/cube/Bridge2/"
let urls = [
r + "posx.jpg",
r + "negx.jpg",
r + "posy.jpg",
r + "negy.jpg",
r + "posz.jpg",
r + "negz.jpg",
]

const textureCube = new THREE.CubeTextureLoader().load(urls)
const materialShader = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
        cubemap: {
        value: textureCube,
        },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
})

// geometry
const geometry = new THREE.OctahedronGeometry(5000, 5)

// mesh
const mesh = new THREE.Mesh(geometry, materialShader);
scene.add(mesh);


// Sphere
const material = new THREE.MeshStandardMaterial( {
    envMap: textureCube,
    roughness: 0.05,
    metalness: 1
} );

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5),
    material
)
sphere.position.set(0,0,0);
scene.add(sphere);


// Window resize management
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
});


// Camera
const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 1, 10000,);
camera.position.set(20, 20, 20)
scene.add(camera);


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


// Scene render loop
const animate = () => {

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call animate again on the next frame
    window.requestAnimationFrame(animate)
}

animate();