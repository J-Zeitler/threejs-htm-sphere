Three.js HTM/TOAST Sphere extensions
======================

A **H**ierarchical **T**riangular **M**esh variant of the standard Three.js SphereGeometry. The geometry features an implementation of the [TOAST](http://www.worldwidetelescope.org/docs/worldwidetelescopeprojectionreference.html) projection technique.

Complete with examples! [View a demo](http://188.166.32.19/threejs-htm-toast/)

## Usage
```javascript
var myHTMSphereGeometry = new THREE.HTMSphereGeometry(radius, subdivisionLevels);
var toastMaterial = new THREE.MeshPhongMaterial({
  map: THREE.ImageUtils.loadTexture('ref.png')
});
var myHTMSphere = new THREE.Mesh(
  myHTMSphereGeometry,
  toastMaterial
);
```

![ref.png](src/textures/ref.png)

*ref.png*
