/*
Code based on:
https://github.com/mrdoob/three.js/blob/dev/docs/scenes/material-browser.html
https://github.com/mrdoob/three.js/blob/dev/examples/webgl_marchingcubes.html
*/

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import phongVertexShader from './shader/phong.vert';
import phongFragmentShader from './shader/phong.frag';
import { MeshPhongMaterial } from 'three/src/Three.js';
import { MeshLambertMaterial } from 'three/src/Three.js';
import { MeshToonMaterial } from 'three/src/Three.js';
import { MeshStandardMaterial } from 'three/src/Three.js';

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

// Env map

const textureLoader = new THREE.TextureLoader();

let textureEquirec = textureLoader.load( 'envmap.jpg' );
textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
textureEquirec.colorSpace = THREE.SRGBColorSpace;


function generateMaterials() {

    const materials = {
        'MeshStandardMaterial': new THREE.MeshStandardMaterial( { color: 0x049ef4 } ),
        'MeshLambertMaterial': new THREE.MeshLambertMaterial({ color: 0x049ef4 }),
        'MeshPhongMaterial': new THREE.MeshPhongMaterial({color: 0x049ef4, shininess: 100}),
        'MeshToonMaterial': new THREE.MeshToonMaterial({color: 0x049ef4})
    };

    return materials;
}

// MATERIALS

materials = generateMaterials();
current_material = 'MeshStandardMaterial';

// SCENE OBJECTS

const current_objects = [];


// Torus Knot
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(2.2, 1, 128, 32),
    materials[current_material]
)
torusKnot.position.set(0,0,0);
torusKnot.name = "torusknot";

// GLTF Models
const loader = new GLTFLoader().setPath( './objects/' );

// Duck
let duck;
loader.load( 'Duck.glb', async function ( gltf ) {
    gltf.scene.scale.set(3*gltf.scene.scale.x, 3*gltf.scene.scale.y, 3* gltf.scene.scale.z);
    gltf.scene.traverse((object) => {
        if (object.isMesh) object.material = materials[current_material];
    });
    duck = gltf.scene;
    duck.name = "duckobject";
} );


//// Gui Functions
function guiLighting(gui, scene) {

    const folder = gui.addFolder( 'Scene' );

    const data = {
        'Ambient Light': ambientLight.color.getHex(),
        'Directional Light Top': directionalLightTop.color,
        'Directional Light Right': directionalLightRight.color,
        'Directional Light Bottom': directionalLightBottom.color,
        "Envivronemt Map": false
    };

    folder
        .addColor(data, 'Ambient Light' )
        .onChange(() =>
        {
            ambientLight.color.set(data['Ambient Light']);
            // shaderMaterial.uniforms.uAmbientLight.value.set(data['Ambient Light']);
        });
    folder
        .addColor(data, 'Directional Light Top' )
        .onChange(() =>
        {
            directionalLightTop.color.set(data['Directional Light Top']);
            // shaderMaterial.uniforms.uDirectionalLightTop.value.set(data['Directional Light Top']);
        });
    folder
        .addColor(data, 'Directional Light Right' )
        .onChange(() =>
        {
            directionalLightRight.color.set(data['Directional Light Right']);
            // shaderMaterial.uniforms.uDirectionalLightRight.value.set(data['Directional Light Right']);
        });
    folder
        .addColor(data, 'Directional Light Bottom' )
        .onChange(() =>
        {
            directionalLightBottom.color.set(data['Directional Light Bottom']);
            // shaderMaterial.uniforms.uDirectionalLightBottom.value.set(data['Directional Light Bottom']);
        });
    folder.add(data, "Envivronemt Map")
        .onChange(() => 
        {
            if(data["Envivronemt Map"]) {
                scene.background = textureEquirec;
                for ( const material in materials ) {
                    materials[material].envMap = textureEquirec;
                    materials[material].needsUpdate = true;
                }

            }
            else {
                for ( const material in materials ) {
                    material.envMap = null;
                    material.needsUpdate = true;
                }
            }
        })
}

function guiSceneObjectPicker(gui, scene) {

    const folder = gui.addFolder( 'Scene Objects' );
    
    const data = {
        "Torus Object": true,
        "Duck Object": false,
        "Suzanne Object": false
    };

    folder.add(data, "Torus Object")
            .onChange(() => 
            {
                if(data["Torus Object"]) scene.add(torusKnot)
                else scene.remove(scene.getObjectByName(torusKnot.name))
            })

    folder.add(data, "Duck Object")
            .onChange(() => 
            {
                if(data["Duck Object"]) scene.add(duck)
                else scene.remove(scene.getObjectByName(duck.name))
            })
}

function guiMaterialPicker(gui, scene) {
    const createHandler = function ( id ) {
        return function () {
            current_material = id;
            torusKnot.material = materials[ id ];
            duck.traverse((object) => {
                if (object.isMesh) object.material = materials[ id ];
            });
        };
    };

    let effectController = {
        dummy: function () {}
    };

    let materialPickerGroup = gui.addFolder( 'Material Picker' );

    for ( const material in materials ) {

        effectController[ material ] = createHandler( material );
        materialPickerGroup.add( effectController, material ).name( material );

    }
}

// Helper Function for Color Changes

function handleColorChange( color ) {

    return function ( value ) {

        if ( typeof value === 'string' ) {

            value = value.replace( '#', '0x' );

        }

        color.setHex( value );

    };

}

function guiMeshLambertMaterial( gui ) {

    const material = materials.MeshLambertMaterial;

    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex()
    };

    const folder = gui.addFolder( 'THREE.MeshLambertMaterial' );

    folder.addColor( data, 'color' ).onChange( handleColorChange( material.color ) );
    folder.addColor( data, 'emissive' ).onChange( handleColorChange( material.emissive ) );

    folder.add( material, 'wireframe' );

    folder.add( material, 'reflectivity', 0, 1 );
    folder.add( material, 'refractionRatio', 0, 1 );

}

function guiMeshPhongMaterial( gui ) {
    
    const material = materials.MeshPhongMaterial;

    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex(),
        specular: material.specular.getHex()
    };

    const folder = gui.addFolder( 'THREE.MeshPhongMaterial' );

    folder.addColor( data, 'color' ).onChange( handleColorChange( material.color ) );
    folder.addColor( data, 'emissive' ).onChange( handleColorChange( material.emissive ) );
    folder.addColor( data, 'specular' ).onChange( handleColorChange( material.specular ) );

    folder.add( material, 'shininess', 0, 100 );
    folder.add( material, 'reflectivity', 0, 1 );
    folder.add( material, 'refractionRatio', 0, 1 );

}

function guiMeshToonMaterial( gui ) {
    
    const material = materials.MeshToonMaterial;

    const data = {
        color: material.color.getHex()
    };

    const folder = gui.addFolder( 'THREE.MeshToonMaterial' );

    folder.addColor( data, 'color' ).onChange( handleColorChange( material.color ) );

}

function guiMeshStandardMaterial( gui ) {
    
    const material = materials.MeshStandardMaterial;

    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex()
    };

    const folder = gui.addFolder( 'THREE.MeshStandardMaterial' );

    folder.addColor( data, 'color' ).onChange( handleColorChange( material.color ) );
    folder.addColor( data, 'emissive' ).onChange( handleColorChange( material.emissive ) );

    folder.add( material, 'roughness', 0, 1 );
    folder.add( material, 'metalness', 0, 1 );
    folder.add( material, 'wireframe' );

}


//// Renderer
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setSize(sizes.width, sizes.height);


//// Scene
const scene = new THREE.Scene();
scene.add(torusKnot);


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
current_material = current_material;
// current_material = 'MeshToonMaterial';

// Build Gui
guiLighting(gui, scene);
guiSceneObjectPicker(gui, scene);
guiMaterialPicker(gui, scene);
guiMeshLambertMaterial(gui);
guiMeshPhongMaterial(gui);
guiMeshStandardMaterial(gui);
guiMeshToonMaterial(gui);



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
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;
    if(duck) { // Because GLB model loads async
        duck.rotation.x -= 0.01;
        duck.rotation.y -= 0.01;
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call animate again on the next frame
    window.requestAnimationFrame(animate)
}

animate()