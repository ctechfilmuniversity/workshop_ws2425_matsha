// https://jsfiddle.net/zr8aqheL/1/

var mesh, renderer, scene, camera, controls
var cubemap

init()
animate()

function init() {
  // renderer
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  // scene
  scene = new THREE.Scene()

  // camera
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000,
  )
  camera.position.set(20, 20, 20)

  // controls
  controls = new THREE.OrbitControls(camera, renderer.domElement)

  // axes
  scene.add(new THREE.AxesHelper(20))

  // geometry
  var geometry = new THREE.OctahedronGeometry(5000, 5)

  var r = "https://threejs.org/examples/textures/cube/Bridge2/"
  var urls = [
    r + "posx.jpg",
    r + "negx.jpg",
    r + "posy.jpg",
    r + "negy.jpg",
    r + "posz.jpg",
    r + "negz.jpg",
  ]

  textureCube = new THREE.CubeTextureLoader().load(urls)

  // material
  var material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      cubemap: {
        value: textureCube,
      },
    },
    vertexShader: document.getElementById("vertexshader").textContent,
    fragmentShader: document.getElementById("fragmentshader").textContent,
  })

  // mesh
  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
}

function animate() {
  requestAnimationFrame(animate)

  //controls.update();

  renderer.render(scene, camera)
}
