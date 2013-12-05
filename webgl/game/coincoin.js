var min = -10;
var max = 10;
var id_last_coincoin = 0;
function load_coincoin(scene,physicObjects){

      var loader = new THREE.JSONLoader(true);
      loader.load( "../../assets/js/RubberDuck.js", function( geometry, materials ) {
      		var mesh = new Physijs.BoxMesh(
	        	geometry, new THREE.MeshFaceMaterial( materials )  );
			mesh.mass=0.1;
      		mesh.position.y = 10;
      		mesh.position.x = Math.random()*(max-min)+min;
      		mesh.position.z = Math.random()*(max-min)+min;
	  		physicObjects["CoinCoin."+id_last_coincoin++] = mesh;
			scene.add(mesh);
      		console.log(mesh);
	  });
}
