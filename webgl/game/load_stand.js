var min = -10;
var max = 10;
var coincoin_dx = 10;
var coincoin_dy = 10;
var coincoin_dz = 10;
var id_last_stand = 0;
function load_stand(scene,physicObjects){

      var loader = new THREE.JSONLoader(true);
      loader.load( "../../assets/js/stand.js", function( geometry, materials ) {
      		var mesh = new Physijs.BoxMesh(
	        	geometry, new THREE.MeshFaceMaterial( materials )  );
			
      		mesh.position.y = 0;
      		mesh.position.x = 10;//Math.random()*(max-min)+min;
      		mesh.position.z = 50;//Math.random()*(max-min)+min;
	  		physicObjects["stand."+id_last_stand++] = mesh;
			scene.add(mesh);
      		//console.log(mesh);
	  });
}
