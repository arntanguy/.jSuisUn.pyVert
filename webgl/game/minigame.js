'use strict';

Physijs.scripts.worker = '../libs/physijs/physijs_worker.js';
Physijs.scripts.ammo = 'examples/js/ammo.js';

/* variables */
var MAX_OBJ = 10;
var points = 0;
var SPAWN_TIME = 500;
var objects = new Array();
var point_text = document.createElement('div');

var initScene, render, applyForce, setMousePosition, mouse_position,
	ground_material, box_material, evil_box_material,
	projector, renderer, render_stats, physics_stats, scene, ground, light, camera, box, boxes = [];
var hand;
var background_music = new Audio('../sounds/minigame_background.ogg');

initScene = function() {
    background_music.volume = 0.9;
    background_music.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    background_music.play();
    
	projector = new THREE.Projector;
	
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	document.getElementById( 'viewport' ).appendChild( renderer.domElement );
	
	render_stats = new Stats();
	render_stats.domElement.style.position = 'absolute';
	render_stats.domElement.style.top = '1px';
	render_stats.domElement.style.zIndex = 100;
	//document.getElementById( 'viewport' ).appendChild( render_stats.domElement );

	physics_stats = new Stats();
	physics_stats.domElement.style.position = 'absolute';
	physics_stats.domElement.style.top = '50px';
	physics_stats.domElement.style.zIndex = 100;
	//document.getElementById( 'viewport' ).appendChild( physics_stats.domElement );
	
	scene = new Physijs.Scene;
	// fog
	scene.fog = new THREE.FogExp2(0x000000, 0.04);
	// gravity
	scene.setGravity(new THREE.Vector3( 0, -8, 0 ));
	scene.addEventListener(
		'update',
		function() {
			scene.simulate( undefined, 1 );
			physics_stats.update();
		}
	);
	
	camera = new THREE.PerspectiveCamera(
		35,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	camera.position.set(0, 2, 6);
	camera.lookAt(new THREE.Vector3(0, 1.5, -1));
	scene.add( camera );
	
	// window resize
    THREEx.WindowResize(renderer, camera);
    // allow 'p' to make screenshot
    THREEx.Screenshot.bindKey(renderer);
    // allow 'f' to go fullscreen where this feature is supported
    if( THREEx.FullScreen.available() ){
        THREEx.FullScreen.bindKey();
    }
	
	// Light
	light = new THREE.DirectionalLight( 0xFFFFFF );
	light.position.set( 20, 40, -15 );
	light.target.position.copy( scene.position );
	light.castShadow = true;
	light.shadowCameraLeft = -30;
	light.shadowCameraTop = -30;
	light.shadowCameraRight = 30;
	light.shadowCameraBottom = 30;
	light.shadowCameraNear = 10;
	light.shadowCameraFar = 100;
	light.shadowBias = -.0001
	light.shadowMapWidth = light.shadowMapHeight = 2048;
	light.shadowDarkness = .7;
	scene.add( light );
	
	// add subtle blue ambient lighting
    var ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
	
	/***** Materials ********************************/
	ground_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( '../images/rocks.jpg' ) }),
		.7, // high friction
		.2 // low restitution
	);
	ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
	ground_material.map.repeat.set( 7, 7 );
	
	/*box_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( '../images/plywood.jpg' ) }),
		.4, // low friction
		.3 // high restitution
	);
	box_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
	box_material.map.repeat.set( .1, .1 );
	
	evil_box_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( '../images/water.jpg' ) }),
		.4, // low friction
		.3 // high restitution
	);
	evil_box_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
	evil_box_material.map.repeat.set( .1, .1 );*/
	/************************************************/
	
	/* Ground */
	ground = new Physijs.BoxMesh(
		new THREE.CubeGeometry(100, 1, 100),
		ground_material,
		0 // mass
	);
	ground.receiveShadow = true;
	scene.add( ground );
	
	/* hand */
	hand = new Physijs.BoxMesh(
			new THREE.CylinderGeometry( 0.3, 0.2, 0.2, 80, 5, false ),
			new THREE.MeshNormalMaterial(),
			0
	);
	hand.position.set(0, 1.1, 2);
	hand.castShadow = true;
	scene.add(hand);
	
	
	// handle collisions
	hand.addEventListener('collision', function(object) {
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
        // animate hand
        
        //remove object
        object.finished = true;
        scene.remove( object );
        object = null;
    });
    ground.addEventListener('collision', function(object) {
	    // if it is an object lost by the player on the ground
	    if(object.id != hand.id) {
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
                scene.add( objects[i] );
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
                    scene.add( objects[i] );
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
                    scene.add( objects[i] );
                });
            }
		    
		}
		
		// destroying oldest object
        if( i >= MAX_OBJ ) {
            if(objects[i-MAX_OBJ] != null) {
                scene.remove( objects[i-MAX_OBJ] );
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


	requestAnimationFrame( render );
	scene.simulate();
};

render = function() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	render_stats.update();
	
	// moving the hand through y axis
    var shortest_distance = 1000;
    var shortest_obj = null;
    for(var obj in objects) {
        if(objects[obj] != null && objects[obj].finished == false) {
            if( Math.abs(objects[obj].position.x - hand.position.x) < shortest_distance) {
                shortest_distance = Math.abs(objects[obj].position.x - hand.position.x);
                shortest_obj = objects[obj];
            }
        }
    }
    if(shortest_obj != null &&
      Math.abs(shortest_obj.position.z - hand.position.z) > 0.05) {
          var distanceZ = shortest_obj.position.z - hand.position.z;
          if((shortest_obj.position.z - hand.position.z) > 0.3) distanceZ = 0.3;
          if((shortest_obj.position.z - hand.position.z) < -0.3) distanceZ = -0.3;
          hand.translateZ( distanceZ );
          hand.__dirtyPosition = true;
    }
        
};
	
window.onload = initScene;


/************ Gesture analysis *******************/

var aGesture	= new AugmentedGesture().enableDatGui().start().domElementThumbnail();

// settings for the colour detection
var pointerOpts	= new AugmentedGesture.OptionPointer();
pointerOpts.pointer.crossColor	= {r:   50, g: 255, b:   50};
pointerOpts.colorFilter.r	= {min:   0, max: 60};
pointerOpts.colorFilter.g	= {min: 110, max: 255};
pointerOpts.colorFilter.b	= {min:   0, max: 80};
aGesture.addPointer("hand", pointerOpts);

aGesture.bind("mousemove.hand", function(event){
    // moving the hand through x axis (user controlled)
    if(hand.position.z >= 2) {
	    if(event.x > 0.5) {
            hand.translateX(( ((event.x-0.5)*3) - hand.position.x));
            hand.__dirtyPosition = true;
        }
        else {
            hand.translateX(( ((0.5-event.x)*-3) - hand.position.x));
            hand.__dirtyPosition = true;
        }
	}
	else if(hand.position.z < 2 && hand.position.z > 0) {
	    if(event.x > 0.5) {
            hand.translateX(( ((event.x-0.5)*4) - hand.position.x));
            hand.__dirtyPosition = true;
        }
        else {
            hand.translateX(( ((0.5-event.x)*-4) - hand.position.x));
            hand.__dirtyPosition = true;
        }
	}
    else if(hand.position.z < 0 && hand.position.z > -2) {
	    if(event.x > 0.5) {
            hand.translateX(( ((event.x-0.5)*5.5) - hand.position.x));
            hand.__dirtyPosition = true;
        }
        else {
            hand.translateX(( ((0.5-event.x)*-5.5) - hand.position.x));
            hand.__dirtyPosition = true;
        }
	}
	else {
	    if(event.x > 0.5) {
            hand.translateX(( ((event.x-0.5)*8) - hand.position.x));
            hand.__dirtyPosition = true;
        }
        else {
            hand.translateX(( ((0.5-event.x)*-8) - hand.position.x));
            hand.__dirtyPosition = true;
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
    scene.add( mesh );
    });
}


