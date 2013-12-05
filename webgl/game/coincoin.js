var min = -10;
var max = 10;
var coincoin_dx = 10;
var coincoin_dy = 10;
var coincoin_dz = 10;
var id_last_coincoin = 0;
function load_coincoin(scene,physicObjects){

      var loader = new THREE.JSONLoader(true);
      loader.load( "../../assets/js/RubberDuck.js", function( geometry, materials ) {
      		var mesh = new Physijs.BoxMesh(
	        	geometry, new THREE.MeshFaceMaterial( materials )  );
			handleCollision = function( collided_with, linearVelocity, angularVelocity ) {
				if(collided_with.name == "Plane"||collided_with.name == "ground")
	  			{//XXX -> enlever first condition
	  				//this.applyCentralImpulse(new THREE.Vector3(Math.random()*4,
					//	Math.random()*20+5,Math.random()*4));
	  				//this.applyCentralImpulse(new THREE.Vector3(0,
					//	Math.random()*20+5,0));
				}
	  				this.applyCentralImpulse(
						new THREE.Vector3(Math.random()*coincoin_dx-coincoin_dx/2,
									      Math.random()*coincoin_dy+coincoin_dy/2,
										  Math.random()*coincoin_dz-coincoin_dz/2));
	  				this.setAngularVelocity(new THREE.Vector3(0,0,0));
			}
			mesh.addEventListener('collision', handleCollision);
			mesh.mass=1;
      		mesh.position.y = 10;
      		mesh.position.x = Math.random()*(max-min)+min;
      		mesh.position.z = Math.random()*(max-min)+min;
	  		physicObjects["CoinCoin."+id_last_coincoin++] = mesh;
			scene.add(mesh);
      		console.log(mesh);
	  });
}
