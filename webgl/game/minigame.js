'use strict';

Physijs.scripts.worker = '../libs/physijs/physijs_worker.js';
Physijs.scripts.ammo = 'examples/js/ammo.js';

/* variables */
var MAX_OBJ = 10;
var points = 0;
var SPAWN_TIME = 500;
var objects = new Array();
var point_text = document.createElement('div');

var mg_initScene, mg_render, mg_applyForce, mg_setMousePosition, mg_mouse_position,
	mg_groundMaterial, mg_boxMaterial, mg_evilBoxMaterial,
	mg_projector, mg_renderer, mg_renderStats, mg_physics_stats, mg_scene, mg_ground, mg_light, mg_camera, mg_box, mg_boxes = [];
var mg_hand;
var mg_backgroundMusic = new Audio('../sounds/minigame_background.ogg');

mg_initScene = function() {
    mg_backgroundMusic.volume = 0.9;
    mg_backgroundMusic.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    mg_backgroundMusic.play();
    
	mg_projector = new THREE.Projector;
	
	mg_renderer = new THREE.WebGLRenderer({ antialias: true });
	mg_renderer.setSize( window.innerWidth, window.innerHeight );
	mg_renderer.shadowMapEnabled = true;
	mg_renderer.shadowMapSoft = true;
	document.getElementById( 'viewport_minigame' ).appendChild( mg_renderer.domElement );
	
	mg_renderStats = new Stats();
	mg_renderStats.domElement.style.position = 'absolute';
	mg_renderStats.domElement.style.top = '1px';
	mg_renderStats.domElement.style.zIndex = 100;
	//document.getElementById( 'viewport_minigame' ).appendChild( mg_renderStats.domElement );

	mg_physics_stats = new Stats();
	mg_physics_stats.domElement.style.position = 'absolute';
	mg_physics_stats.domElement.style.top = '50px';
	mg_physics_stats.domElement.style.zIndex = 100;
	//document.getElementById( 'viewport_minigame' ).appendChild( mg_physics_stats.domElement );
	
	mg_scene = new Physijs.Scene;
	// fog
	mg_scene.fog = new THREE.FogExp2(0x000000, 0.04);
	// gravity
	mg_scene.setGravity(new THREE.Vector3( 0, -8, 0 ));
	mg_scene.addEventListener(
		'update',
		function() {
			mg_scene.simulate( undefined, 1 );
			mg_physics_stats.update();
		}
	);
	
	mg_camera = new THREE.PerspectiveCamera(
		35,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	mg_camera.position.set(0, 2, 6);
	mg_camera.lookAt(new THREE.Vector3(0, 1.5, -1));
	mg_scene.add( mg_camera );
	
	// window resize
    THREEx.WindowResize(mg_renderer, mg_camera);
    // allow 'p' to make screenshot
    THREEx.Screenshot.bindKey(mg_renderer);
    // allow 'f' to go fullscreen where this feature is supported
    if( THREEx.FullScreen.available() ){
        THREEx.FullScreen.bindKey();
    }
	
	// Light
	mg_light = new THREE.DirectionalLight( 0xFFFFFF );
	mg_light.position.set( 20, 40, -15 );
	mg_light.target.position.copy( mg_scene.position );
	mg_light.castShadow = true;
	mg_light.shadowCameraLeft = -30;
	mg_light.shadowCameraTop = -30;
	mg_light.shadowCameraRight = 30;
	mg_light.shadowCameraBottom = 30;
	mg_light.shadowCameraNear = 10;
	mg_light.shadowCameraFar = 100;
	mg_light.shadowBias = -.0001
	mg_light.shadowMapWidth = mg_light.shadowMapHeight = 2048;
	mg_light.shadowDarkness = .7;
	mg_scene.add( mg_light );
	
	// add subtle blue ambient lighting
    var ambientLight = new THREE.AmbientLight(0x333333);
    mg_scene.add(ambientLight);
	
	/***** Materials ********************************/
	mg_groundMaterial = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( '../images/rocks.jpg' ) }),
		.7, // high friction
		.2 // low restitution
	);
	mg_groundMaterial.map.wrapS = mg_groundMaterial.map.wrapT = THREE.RepeatWrapping;
	mg_groundMaterial.map.repeat.set( 7, 7 );
	
	/*mg_boxMaterial = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( '../images/plywood.jpg' ) }),
		.4, // low friction
		.3 // high restitution
	);
	mg_boxMaterial.map.wrapS = mg_groundMaterial.map.wrapT = THREE.RepeatWrapping;
	mg_boxMaterial.map.repeat.set( .1, .1 );
	
	mg_evilBoxMaterial = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( '../images/water.jpg' ) }),
		.4, // low friction
		.3 // high restitution
	);
	mg_evilBoxMaterial.map.wrapS = mg_groundMaterial.map.wrapT = THREE.RepeatWrapping;
	mg_evilBoxMaterial.map.repeat.set( .1, .1 );*/
	/************************************************/
	
	/* Ground */
	mg_ground = new Physijs.BoxMesh(
		new THREE.CubeGeometry(100, 1, 100),
		mg_groundMaterial,
		0 // mass
	);
	mg_ground.receiveShadow = true;
	mg_scene.add( mg_ground );
	
	/* mg_hand */
	mg_hand = new Physijs.BoxMesh(
			new THREE.CylinderGeometry( 0.3, 0.2, 0.2, 80, 5, false ),
			new THREE.MeshNormalMaterial(),
			0
	);
	mg_hand.position.set(0, 1.1, 2);
	mg_hand.castShadow = true;
	mg_scene.add(mg_hand);
	
	
	// handle collisions
	mg_hand.addEventListener('collision', function(object) {
	    // give points
	    if(object.evil) {
	        points--;
	        var falling_audio = new Audio('../sounds/malus.ogg');
            falling_audio.volume = 0.4;
            falling_audio.play();
	    }
	    else {
	        points++;
	        new Audio('../sounds/bonus.ogg').play();
	    }
	    point_text.innerHTML = points+" points";
        // animate mg_hand
        
        //remove object
        object.finished = true;
        mg_scene.remove( object );
        object = null;
    });
    mg_ground.addEventListener('collision', function(object) {
	    // if it is an object lost by the player on the mg_ground
	    if(object.id != mg_hand.id) {
	        object.finished = true;
	    }
    });
	
	/****************** generating objects ********************/
	var i=0;
	
    var spawnObject  = function(){
        // spawn position
        var posx = (Math.random() - Math.random()) * 3;
        var posz = (Math.random() - Math.random()) * 4;
        if(posz >= 2) {
            if(posx < -1.8) posx = -1.8;
            if(posx > 1.8) posx = 1.8;
        }
        else if(posz < 2 && posz > 0) {
            if(posx < -2.3) posx = -2.3;
            if(posx > 2.3) posx = 2.3;
        }
        else if(posz < 0 && posz > -2) {
            if(posx < -3) posx = -3;
            if(posx > 3) posx = 3;
        }
        else {
            if(posx < -4.3) posx = -4.3;
            if(posx > 4.3) posx = 4.3;
        }
		        
        // deciding if the object is evil
        var evil;
        if(i < 50) evil = Math.floor( (Math.random() * (1.5 + (50-i)/8)) );
        else evil = Math.floor( (Math.random() * 1.5) );
		if( evil == 0) { // yes evil
		    var loader = new THREE.JSONLoader(true);
            loader.load( '../assets/js/coffee-mug.js', function( geometry, materials ) {
                objects[i] = new Physijs.CylinderMesh(
                    geometry,
                    new THREE.MeshFaceMaterial( materials ),
                    1
                );
		        objects[i].position.set(posx, 5, posz);
		        objects[i].rotation.set(
			        Math.random() * Math.PI * 2,
			        Math.random() * Math.PI * 2,
			        Math.random() * Math.PI * 2
		        );
		        objects[i].scale.set(0.6, 0.6, 0.6);
		        objects[i].evil = true;
		        objects[i].castShadow = true;
		        objects[i].finished = false;
                mg_scene.add( objects[i] );
            });
		    
		}
		else { // not evil
		    if(Math.floor(Math.random()*2) == 0) {
		        var loader = new THREE.JSONLoader(true);
                loader.load( '../assets/js/coffee-mug.js', function( geometry, materials ) {
                    objects[i] = new Physijs.CylinderMesh(
                        geometry,
                        new THREE.MeshFaceMaterial( materials ),
                        1
                    );
                    objects[i].position.set(posx, 5, posz);
		            objects[i].rotation.set(
			            Math.random() * Math.PI * 2,
			            Math.random() * Math.PI * 2,
			            Math.random() * Math.PI * 2
		            );
		            objects[i].scale.set(0.4, 0.4, 0.4);
		            objects[i].evil = true;
		            objects[i].castShadow = true;
		            objects[i].finished = false;
                    objects[i].evil = false;
                    mg_scene.add( objects[i] );
                });
            }
            else {
		        var loader = new THREE.JSONLoader(true);
                loader.load( '../assets/js/giftbox.js', function( geometry, materials ) {
                    objects[i] = new Physijs.BoxMesh(
                        geometry,
                        new THREE.MeshFaceMaterial( materials ),
                        1
                    );
                    objects[i].position.set(posx, 5, posz);
		            objects[i].rotation.set(
			            Math.random() * Math.PI * 2,
			            Math.random() * Math.PI * 2,
			            Math.random() * Math.PI * 2
		            );
		            objects[i].scale.set(0.2, 0.2, 0.2);
		            objects[i].evil = true;
		            objects[i].castShadow = true;
		            objects[i].finished = false;
                    objects[i].evil = false;
                    mg_scene.add( objects[i] );
                });
            }
		    
		}
		
		// destroying oldest object
        if( i >= MAX_OBJ ) {
            if(objects[i-MAX_OBJ] != null) {
                mg_scene.remove( objects[i-MAX_OBJ] );
                objects[i-MAX_OBJ] = null;
            }
        }
        i++;
        var falling_audio = new Audio('../sounds/falling.ogg');
        falling_audio.volume = 0.5;
        falling_audio.play();
        /********************************************************/
    }

    var spawn_time = SPAWN_TIME;
    (function loop() {
        spawn_time = Math.random()*6000;
        // the game is getting faster and faster...
        if(i > 0)
            spawn_time = spawn_time - i*100;
        if(spawn_time < 0) spawn_time = 0;
        spawn_time = spawn_time + Math.random()*1500;
        // minimal spawn time security
        spawn_time = spawn_time + SPAWN_TIME;
        console.log(spawn_time);
        setTimeout(function() {
                spawnObject();
                loop();  
        }, spawn_time);
    }());


	requestAnimationFrame( mg_render );
	mg_scene.simulate();
};

mg_render = function() {
	requestAnimationFrame( mg_render );
	mg_renderer.render( mg_scene, mg_camera );
	mg_renderStats.update();
	
	// moving the mg_hand through y axis
    var shortest_distance = 1000;
    var shortest_obj = null;
    for(var obj in objects) {
        if(objects[obj] != null && objects[obj].finished == false) {
            if( Math.abs(objects[obj].position.x - mg_hand.position.x) < shortest_distance) {
                shortest_distance = Math.abs(objects[obj].position.x - mg_hand.position.x);
                shortest_obj = objects[obj];
            }
        }
    }
    if(shortest_obj != null &&
      Math.abs(shortest_obj.position.z - mg_hand.position.z) > 0.05) {
          var distanceZ = shortest_obj.position.z - mg_hand.position.z;
          if((shortest_obj.position.z - mg_hand.position.z) > 0.3) distanceZ = 0.3;
          if((shortest_obj.position.z - mg_hand.position.z) < -0.3) distanceZ = -0.3;
          mg_hand.translateZ( distanceZ );
          mg_hand.__dirtyPosition = true;
    }
        
};
	
window.onload = mg_initScene;


/************ Gesture analysis *******************/

var aGesture	= new AugmentedGesture().enableDatGui().start().domElementThumbnail();

// settings for the colour detection
var pointerOpts	= new AugmentedGesture.OptionPointer();
pointerOpts.pointer.crossColor	= {r:   50, g: 255, b:   50};
pointerOpts.colorFilter.r	= {min:   0, max: 60};
pointerOpts.colorFilter.g	= {min: 110, max: 255};
pointerOpts.colorFilter.b	= {min:   0, max: 80};
aGesture.addPointer("mg_hand", pointerOpts);

aGesture.bind("mousemove.mg_hand", function(event){
    // moving the mg_hand through x axis (user controlled)
    if(mg_hand.position.z >= 2) {
	    if(event.x > 0.5) {
            mg_hand.translateX(( ((event.x-0.5)*3) - mg_hand.position.x));
            mg_hand.__dirtyPosition = true;
        }
        else {
            mg_hand.translateX(( ((0.5-event.x)*-3) - mg_hand.position.x));
            mg_hand.__dirtyPosition = true;
        }
	}
	else if(mg_hand.position.z < 2 && mg_hand.position.z > 0) {
	    if(event.x > 0.5) {
            mg_hand.translateX(( ((event.x-0.5)*4) - mg_hand.position.x));
            mg_hand.__dirtyPosition = true;
        }
        else {
            mg_hand.translateX(( ((0.5-event.x)*-4) - mg_hand.position.x));
            mg_hand.__dirtyPosition = true;
        }
	}
    else if(mg_hand.position.z < 0 && mg_hand.position.z > -2) {
	    if(event.x > 0.5) {
            mg_hand.translateX(( ((event.x-0.5)*5.5) - mg_hand.position.x));
            mg_hand.__dirtyPosition = true;
        }
        else {
            mg_hand.translateX(( ((0.5-event.x)*-5.5) - mg_hand.position.x));
            mg_hand.__dirtyPosition = true;
        }
	}
	else {
	    if(event.x > 0.5) {
            mg_hand.translateX(( ((event.x-0.5)*8) - mg_hand.position.x));
            mg_hand.__dirtyPosition = true;
        }
        else {
            mg_hand.translateX(( ((0.5-event.x)*-8) - mg_hand.position.x));
            mg_hand.__dirtyPosition = true;
        }
	}
    
});

/******* display score **********/

point_text.style.position = 'absolute';
point_text.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
point_text.style.fontSize = "40px";
point_text.style.fontWeight = "bold";
point_text.style.textShadow = "0px 0px 10px #aaa, 0px 0px 3px #fff";
point_text.style.id = 'score';
point_text.innerHTML = "0 points";
point_text.style.top = 10 + 'px';
point_text.style.left = 10 + 'px';
document.body.appendChild(point_text);

/****** load model **********/
function loadFromJSON(path) {
    var loader = new THREE.JSONLoader(true);
    loader.load( path, function( geometry, materials ) {
    var mesh = new Physijs.SphereMesh(
        geometry,
        new THREE.MeshFaceMaterial( materials ),
        0
    );
    mesh.position.y = 0;
    mesh.position.x = 0;
    console.log(mesh.id);
    mg_scene.add( mesh );
    });
}


