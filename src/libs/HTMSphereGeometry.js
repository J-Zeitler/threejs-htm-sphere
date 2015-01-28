/**
 * Hierarchical Triangular Mesh Sphere Geometry
 * @param float radius        sphere raduis
 * @param int   subdivisions  subdivision level >= 0
 */
THREE.HTMSphereGeometry = function (radius, subdivisions) {

  THREE.Geometry.call(this);

  this.type = 'HTMSphereGeometry';

  this.parameters = {
    radius: radius,
    subdivisions: subdivisions
  };

  radius = radius || 50;
  subdivisions = subdivisions || 0;

  L0_HEIGHT_SEGS = 2;
  L0_WIDTH_SEGS = 4;
  var baseGeometry = new THREE.SphereGeometry(radius, L0_WIDTH_SEGS, L0_HEIGHT_SEGS);

  // Base octahedron with 6 verts/8 faces
  this.vertices = [];
  this.vertices.push(new THREE.Vector3( 0,  1,  0)); //  y
  this.vertices.push(new THREE.Vector3( 1,  0,  0)); //  x
  this.vertices.push(new THREE.Vector3(-1,  0,  0)); // -x
  this.vertices.push(new THREE.Vector3( 0,  0,  1)); //  z
  this.vertices.push(new THREE.Vector3( 0,  0, -1)); // -z
  this.vertices.push(new THREE.Vector3( 0, -1,  0)); // -y (split)
  this.vertices.push(new THREE.Vector3( 0, -1,  0)); // -y (split)
  this.vertices.push(new THREE.Vector3( 0, -1,  0)); // -y (split)
  this.vertices.push(new THREE.Vector3( 0, -1,  0)); // -y (split)

  this.faces = [];
  // upper hemisphere
  this.faces.push(new THREE.Face3(0, 3, 1));
  this.faces.push(new THREE.Face3(0, 1, 4));
  this.faces.push(new THREE.Face3(0, 4, 2));
  this.faces.push(new THREE.Face3(0, 2, 3));

  // lower hemisphere
  this.faces.push(new THREE.Face3(5, 1, 3));
  this.faces.push(new THREE.Face3(6, 4, 1));
  this.faces.push(new THREE.Face3(7, 2, 4));
  this.faces.push(new THREE.Face3(8, 3, 2));

  // TOAST uvs
  var vertexUvs = [];
  vertexUvs.push(new THREE.Vector2(0.5, 0.5)); //  y
  vertexUvs.push(new THREE.Vector2(0.5, 1.0)); //  x
  vertexUvs.push(new THREE.Vector2(0.5, 0.0)); // -x
  vertexUvs.push(new THREE.Vector2(1.0, 0.5)); //  z
  vertexUvs.push(new THREE.Vector2(0.0, 0.5)); // -z

  vertexUvs.push(new THREE.Vector2(1.0, 1.0)); // -y
  vertexUvs.push(new THREE.Vector2(0.0, 1.0)); // -y
  vertexUvs.push(new THREE.Vector2(0.0, 0.0)); // -y
  vertexUvs.push(new THREE.Vector2(1.0, 0.0)); // -y

  this.updateUvs = function(newVertexUvs) {
    var faceUvs = [];
    this.faces.forEach(function (f) {
      faceUvs.push([newVertexUvs[f.a], newVertexUvs[f.b], newVertexUvs[f.c]]);
    });

    this.faceVertexUvs = [];
    this.faceVertexUvs.push(faceUvs);
  }

  this.updateUvs(vertexUvs);

  /**
   *          a
   *          *
   *        /   \
   *    c' * --- * b'
   *      /  \ /  \
   *     * -- * -- *
   *   b      a'     c
   */
  while (subdivisions--) {
    var newFaces = [];
    var newVerts = [];
    var newVertUvs = [];

    this.faces.forEach(function (f, fIdx) {
      var a = this.vertices[f.a].clone();
      var b = this.vertices[f.b].clone();
      var c = this.vertices[f.c].clone();

      // midpoints of each side
      var aPrime = b.clone().add(c).divideScalar(2);
      var bPrime = a.clone().add(c).divideScalar(2);
      var cPrime = a.clone().add(b).divideScalar(2);

      // offset to sphere radius
      aPrime = aPrime.normalize().multiplyScalar(radius);
      bPrime = bPrime.normalize().multiplyScalar(radius);
      cPrime = cPrime.normalize().multiplyScalar(radius);

      // 6 verts
      var aIdx = newVerts.push(a) - 1;
      var bIdx = newVerts.push(b) - 1;
      var cIdx = newVerts.push(c) - 1;
      var aPrimeIdx = newVerts.push(aPrime) - 1;
      var bPrimeIdx = newVerts.push(bPrime) - 1;
      var cPrimeIdx = newVerts.push(cPrime) - 1;

      // 4 faces
      newFaces.push(new THREE.Face3(aIdx, cPrimeIdx, bPrimeIdx));
      newFaces.push(new THREE.Face3(bIdx, aPrimeIdx, cPrimeIdx));
      newFaces.push(new THREE.Face3(cIdx, bPrimeIdx, aPrimeIdx));
      newFaces.push(new THREE.Face3(aPrimeIdx, bPrimeIdx, cPrimeIdx));

      // lerp 6 uvs
      var aUv = this.faceVertexUvs[0][fIdx][0].clone();
      var bUv = this.faceVertexUvs[0][fIdx][1].clone();
      var cUv = this.faceVertexUvs[0][fIdx][2].clone();

      var aPrimeUv = bUv.clone().add(cUv).divideScalar(2);
      var bPrimeUv = aUv.clone().add(cUv).divideScalar(2);
      var cPrimeUv = aUv.clone().add(bUv).divideScalar(2);

      newVertUvs.push(aUv);
      newVertUvs.push(bUv);
      newVertUvs.push(cUv);
      newVertUvs.push(aPrimeUv);
      newVertUvs.push(bPrimeUv);
      newVertUvs.push(cPrimeUv);
    }, this);

    this.vertices = newVerts;
    this.faces = newFaces;
    this.updateUvs(newVertUvs);
  }

  // quick and dirty way of reducing complexity
  // this.mergeVertices();

  this.computeFaceNormals();

  this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);

};

THREE.HTMSphereGeometry.prototype = Object.create(THREE.Geometry.prototype);
THREE.HTMSphereGeometry.prototype.constructor = THREE.HTMSphereGeometry;