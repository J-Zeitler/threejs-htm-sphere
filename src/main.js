"use strict";

var camera, controls, renderer, scene;
var sphere;

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 7);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  scene = new THREE.Scene();

  var light = new THREE.AmbientLight( 0xffffff );
  scene.add(light);

  var worldMapMaterial = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('textures/world.jpg')
  });
  var refMaterial = new THREE.MeshPhongMaterial({
    map: THREE.ImageUtils.loadTexture('textures/ref.png')
  });

  /**
   * Ref spheres
   */
  sphere = new THREE.Mesh(
    new THREE.HTMSphereGeometry(1.0, 0),
    refMaterial
  );
  scene.add(sphere);
  sphere.position.x = -2.5;
  sphere.position.y = 1.5;

  sphere = new THREE.Mesh(
    new THREE.HTMSphereGeometry(1.0, 1),
    refMaterial
  );
  scene.add(sphere);
  sphere.position.x = 0;
  sphere.position.y = 1.5;

  sphere = new THREE.Mesh(
    new THREE.HTMSphereGeometry(1.0, 3),
    refMaterial
  );
  scene.add(sphere);
  sphere.position.x = 2.5;
  sphere.position.y = 1.5;

  /**
   * World map spheres
   */
  sphere = new THREE.Mesh(
    new THREE.HTMSphereGeometry(1.0, 0),
    worldMapMaterial
  );
  scene.add(sphere);
  sphere.position.x = -2.5;
  sphere.position.y = -1.5;

  sphere = new THREE.Mesh(
    new THREE.HTMSphereGeometry(1.0, 1),
    worldMapMaterial
  );
  scene.add(sphere);
  sphere.position.x = 0;
  sphere.position.y = -1.5;

  sphere = new THREE.Mesh(
    new THREE.HTMSphereGeometry(1.0, 3),
    worldMapMaterial
  );
  scene.add(sphere);
  sphere.position.x = 2.5;
  sphere.position.y = -1.5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor(0x333333, 1);

  controls = new THREE.OrbitControls(camera);
  document.body.appendChild(renderer.domElement);
}

function animate() {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
}
