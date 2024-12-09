/*
Code based on:
https://github.com/mrdoob/three.js/blob/dev/docs/scenes/material-browser.html
https://github.com/mrdoob/three.js/blob/dev/examples/webgl_marchingcubes.html
*/

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

import phongVertexShader from './shader/phong_solution.vert';
import phongFragmentShader from './shader/phong_solution.frag';

// console.log(phongVertexShader);
// console.log(phongFragmentShader);


//// GUI
const gui = new GUI();
let materials, current_material;

//// Canvas
const canvas = document.querySelector("#canvasThree");

//// Helper
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};


function generateMaterials() {

    const materials = {
        'MeshLambertMaterial': new THREE.MeshLambertMaterial({ color: 0x049ef4 }),
        'MeshPhongMaterial': new THREE.MeshPhongMaterial({color: 0x049ef4, shininess: 100}),
        'MeshToonMaterial': new THREE.MeshToonMaterial({color: 0x049ef4}),
    };

    return materials;
}



//// Gui Functions
function guiLighting(gui, scene) {

    const folder = gui.addFolder( 'Scene' );

    const data = {
        'Ambient Light': ambientLight.color.getHex(),
        'Directional Light Top': directionalLightTop.color,
        'Directional Light Right': directionalLightRight.color,
        'Directional Light Bottom': directionalLightBottom.color,
    };

    folder
        .addColor(data, 'Ambient Light' )
        .onChange(() =>
        {
            ambientLight.color.set(data['Ambient Light']);
            shaderMaterial.uniforms.uAmbientLight.value.set(data['Ambient Light']);
        })
    folder
        .addColor(data, 'Directional Light Top' )
        .onChange(() =>
        {
            directionalLightTop.color.set(data['Directional Light Top']);
            shaderMaterial.uniforms.uDirectionalLightTop.value.set(data['Directional Light Top']);
        })
    folder
        .addColor(data, 'Directional Light Right' )
        .onChange(() =>
        {
            directionalLightRight.color.set(data['Directional Light Right']);
            shaderMaterial.uniforms.uDirectionalLightRight.value.set(data['Directional Light Right']);
        })
    folder
        .addColor(data, 'Directional Light Bottom' )
        .onChange(() =>
        {
            directionalLightBottom.color.set(data['Directional Light Bottom']);
            shaderMaterial.uniforms.uDirectionalLightBottom.value.set(data['Directional Light Bottom']);
        })
}


function guiMaterials(gui, scene) {

    const folder = gui.addFolder( 'Materials' );

    const data = {
        'Color': materials[current_material].color.getHex(),
        'Shininess': 100.0,
    };

    folder
        .addColor(data, 'Color')
        .onChange(() =>
        {
            materials[current_material].color.set(data['Color']);
            shaderMaterial.uniforms.uColor.value.set(data['Color']);
        })
    folder
        .add(data, 'Shininess', 1.0, 500.0)
        .onChange(() =>
        {
            materials['MeshPhongMaterial'].shininess = data['Shininess'];
            shaderMaterial.uniforms.uShininess.value = data['Shininess'];
        })
}


//// Renderer
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setSize(sizes.width, sizes.height);


//// Scene
const scene = new THREE.Scene();


// Camera
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 10, 100);
camera.position.set(0, 0, 35);
scene.add(camera);


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;


//// Lights
const ambientLight = new THREE.AmbientLight( 0x000000 );
scene.add( ambientLight );

const directionalLightTop = new THREE.DirectionalLight( 0xffffff, 3 );
directionalLightTop.position.set( 0, 20, 0 );
scene.add(directionalLightTop);
const directionalLightTopHelper = new THREE.DirectionalLightHelper(directionalLightTop, 2); 
scene.add(directionalLightTopHelper);

const directionalLightRight = new THREE.DirectionalLight( 0xffffff, 3 );
directionalLightRight.position.set( 10, 20, 10 );
scene.add( directionalLightRight );
const directionalLightRightHelper = new THREE.DirectionalLightHelper(directionalLightRight, 2); 
scene.add(directionalLightRightHelper);

const directionalLightBottom = new THREE.DirectionalLight( 0xffffff, 3 );
directionalLightBottom.position.set( -10, -20, -10 );
scene.add( directionalLightBottom );
const directionalLightBottomHelper = new THREE.DirectionalLightHelper(directionalLightBottom, 2); 
scene.add(directionalLightBottomHelper);




//// NO SHADERS SCENE
//// Materials
materials = generateMaterials();
// current_material = 'MeshLambertMaterial';
current_material = 'MeshPhongMaterial';
// current_material = 'MeshToonMaterial';

//// Geometry & Meshes
// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5),
    materials[current_material]
)
sphere.position.set(0,8,0);
scene.add(sphere);

// Torus Knot
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(2.2, 1, 128, 32),
    materials[current_material]
)
torusKnot.position.set(12,8,0);
scene.add(torusKnot);

// Cube
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(6, 6, 6),
    materials[current_material]
)
cube.position.set(-13,8,0);
scene.add(cube);



//// SHADERS SCENE

//// Materials
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader:phongVertexShader,
    fragmentShader:phongFragmentShader,
    side: THREE.DoubleSide,
    uniforms:
    {
        uColor: new THREE.Uniform(new THREE.Color(materials[current_material].color)),
        uAmbientLight: new THREE.Uniform(new THREE.Color(ambientLight.color)),
        uDirectionalLightTop: new THREE.Uniform(new THREE.Color(directionalLightTop.color)),
        uDirectionalLightRight: new THREE.Uniform(new THREE.Color(directionalLightRight.color)),
        uDirectionalLightBottom: new THREE.Uniform(new THREE.Color(directionalLightBottom.color)),
        uShininess: {value: materials['MeshPhongMaterial'].shininess},
    }
});

//// Geometry & Meshes
// Sphere
const sphereShader = new THREE.Mesh(
    new THREE.SphereGeometry(5),
    shaderMaterial
)
sphereShader.position.set(0,-8,0);
scene.add(sphereShader);

// Torus Knot
const torusKnotShader = new THREE.Mesh(
    new THREE.TorusKnotGeometry(2.2, 1, 128, 32),
    shaderMaterial
)
torusKnotShader.position.set(12,-8,0);
scene.add(torusKnotShader);

// Cube
const cubeShader = new THREE.Mesh(
    new THREE.BoxGeometry(6, 6, 6),
    shaderMaterial
)
cubeShader.position.set(-13,-8,0);
scene.add(cubeShader);



// Build Gui
guiLighting(gui, scene);
guiMaterials(gui, scene);



//// Window resize management
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
});




// Scene render loop
const animate = () => {

    // Animate Meshes
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;
    cubeShader.rotation.x += 0.01;
    cubeShader.rotation.y += 0.01;
    torusKnotShader.rotation.x += 0.01;
    torusKnotShader.rotation.y += 0.01;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call animate again on the next frame
    window.requestAnimationFrame(animate)
}

animate()