/******************************************************************************
*     Copyright (C) 2013 TANGUY Arnaud arn.tanguy@gmail.com                   *
*                        FAVREAU Jean-Dominique                               *
*                                                                             *
* This program is free software; you can redistribute it and/or modify        *
* it under the terms of the GNU General Public License as published by        *
* the Free Software Foundation; either version 2 of the License, or           *
* (at your option) any later version.                                         *
*                                                                             *
* This program is distributed in the hope that it will be useful,             *
* but WITHOUT ANY WARRANTY; without even the implied warranty of              *
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the                *
* GNU General Public License for more details.                                *
*                                                                             *
* You should have received a copy of the GNU General Public License along     *
* with this program; if not, write to the Free Software Foundation, Inc.,     *
* 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.                 *
 ******************************************************************************/

var Game = function() {

    this.start = start;
    this.pause = pause;

    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    var run = false;

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    Physijs.scripts.worker = '../../libs/physijs/physijs_worker.js';
    Physijs.scripts.ammo = '../../libs/physijs/examples/js/ammo.js';

    var container,stats;

    var camera, scene, loaded;
    var physicsObjects;
    var renderer;

    var mesh, zmesh, geometry;

    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    // Mouse/Keyboard control
    var controls, time = Date.now();
    // Object pointed by mouse
    var ray;
    var debug = true;


    /* ======================== INIT POINTERLOCK ==================== */

    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'start' );
    // http://www.html5rocks.com/en/tutorials/pointerlock/intro/
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if ( havePointerLock ) {

        var element = document.getElementById("game");//body;

        var pointerlockchange = function ( event ) {

            if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

                controls.enabled = true;

                blocker.style.display = 'none';

            } else {

                controls.enabled = false;

                blocker.style.display = '-webkit-box';
                blocker.style.display = '-moz-box';
                blocker.style.display = 'box';

                instructions.style.display = '';

            }

        }

        var pointerlockerror = function ( event ) {

            instructions.style.display = '';

        }

        // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

        instructions.addEventListener( 'click', function ( event ) {

                instructions.style.display = 'none';

                // Ask the browser to lock the pointer
                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

                if ( /Firefox/i.test( navigator.userAgent ) ) {

                var fullscreenchange = function ( event ) {

                if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                document.removeEventListener( 'fullscreenchange', fullscreenchange );
                document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                element.requestPointerLock();
                }

                }

                document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                element.requestFullscreen();

                } else {

                    element.requestPointerLock();

                }

        }, false );

    } else {

        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }


    // adding 3D sound to the world
    var Sound = function ( sources, radius, volume ) {

        var audio = document.createElement( 'audio' );

        for ( var i = 0; i < sources.length; i ++ ) {
            var source = document.createElement( 'source' );
            source.src = sources[ i ];

            audio.appendChild( source );
        }

        this.position = new THREE.Vector3();

        this.play = function () {
            audio.play();
        }

        this.update = function ( controls ) {
            var distance = this.position.distanceTo( controls.getPosition() );
            if ( distance <= radius ) {
                audio.volume = volume * ( 1 - distance / radius );
            } else {
                audio.volume = 0;
            }
        }
    }

    var game_sound;


    init();
    animate();

    function $( id ) {

        return document.getElementById( id );

    }

    function handle_update( result, pieces ) {
        refreshSceneView( result );
        //renderer.initWebGLObjects( result.scene );

        var m, material, count = 0;
        for ( m in result.materials ) {
            material = result.materials[ m ];
            if ( ! ( material instanceof THREE.MeshFaceMaterial ) ) {
                if( !material.program ) {
                    renderer.initMaterial( material, result.scene.__lights, result.scene.fog );
                    count += 1;
                    if( count > pieces ) {
                        break;
                    }
                }
            }
        }
    }

    function init() {

        container = document.getElementById( 'game' );

        var loadScene = createLoadScene();

        camera = loadScene.camera;
        scene = loadScene.scene;


        renderer = new THREE.WebGLRenderer();
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        renderer.domElement.style.position = "relative";
        container.appendChild( renderer.domElement );


        controls = new THREE.PointerLockControls( camera );
        scene.add( controls.getObject() );
        console.log(controls);

        ray = new THREE.Raycaster();
        ray.ray.direction.set( 0, -1, 0 );

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.right = '0px';
        stats.domElement.style.zIndex = 100;
        container.appendChild( stats.domElement );

        game_sound = new Sound( [ '../sounds/minigame_background.ogg' ], 50, 1 );
        game_sound.position.set(0, 10, 0);
        game_sound.play();

        $( "start" ).addEventListener( 'click', onStartClick, false );

        var callbackProgress = function( progress, result ) {

            var bar = 250,
                total = progress.total_models + progress.total_textures,
                loaded = progress.loaded_models + progress.loaded_textures;

            if ( total )
                bar = Math.floor( bar * loaded / total );

            $( "bar" ).style.width = bar + "px";

            count = 0;
            for ( var m in result.materials ) count++;

            handle_update( result, Math.floor( count/total ) );

        }

        var callbackFinished = function( result ) {

            console.log(result);

            loaded = result;
            physicsObjects = result.physicsObjects;

            $( "message" ).style.display = "none";
            $( "progressbar" ).style.display = "none";
            $( "start" ).style.display = "block";
            $( "start" ).className = "enabled";

            handle_update( result, 1 );

        }

        $( "progress" ).style.display = "block";


        var loader = new PhysicsSceneLoader();
        loader.callbackProgress = callbackProgress;
        loader.load( "../../assets/js/scene.js", callbackFinished );


        $( "plus_exp" ).addEventListener( 'click', createToggle( "exp" ), false );

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function setButtonActive( id ) {

        $( "start" ).style.backgroundColor = "green";

    }



    /**
     * Start scene
     * Play physics simulation
     **/
    function onStartClick() {

		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        $( "progress" ).style.display = "none";

        camera = loaded.currentCamera;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        scene = loaded.scene;
        scene.setGravity(new THREE.Vector3( 0, -9.8, 0 ));
        console.log("Scene type");
        console.log(scene);
        scene.addEventListener(
                'update',
                function() {
                scene.simulate( undefined, 1 );
                //physics_stats.update();
                }
                );

        /**
         * Get "ground" mesh object, and assign its mass to 0
         */
        console.log("all objects");
        console.log(loaded.objects);
        console.log("physics objects");
        console.log(loaded.physicsObjects);
        var axis = new THREE.AxisHelper(20);
        scene.add(axis);

        scene.remove(controls.getObject());
        camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 1000 )
        camera.position.y = 1.5;
        controls = new THREE.PointerLockControls( camera );
        scene.add( controls.getObject() );

        ray = new THREE.Raycaster();
        ray.ray.direction.set( 0, -1, 0 );
        //load_coincoin(scene,physicsObjects);
        //load_stand(scene,physicsObjects);

        // Run at 60FPS target
        requestAnimationFrame( renderLoadScene );
        // Simulate physics
        scene.simulate();

    }

	
	function onDocumentMouseDown( event ) {
    	direction = controls.getLookDirection().clone();
   		position = controls.getPosition().clone();

		console.log(position);
		console.log(direction);
    	rayCasting(position.clone(), direction.clone());
		//rayCasting();;
	}
    function onDocumentMouseMove(event) {

        mouseX = ( event.clientX - windowHalfX );
        mouseY = ( event.clientY - windowHalfY );

    }

    /**
     * Creates a dummy loading scene full of cubes
     */
    function createLoadScene() {

        var result = {

        scene:  new THREE.Scene,
        camera: new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 1, 1000 )

        };
        result.camera.position.z = 100;

        var object, geometry, material, light, count = 500, range = 200;

        /**
         * Display loading scene: loads of random cubes
         */
        material = new THREE.MeshLambertMaterial( { color:0xffffff } );
        geometry = new THREE.CubeGeometry( 5, 5, 5 );

        for( var i = 0; i < count; i++ ) {

            object = new THREE.Mesh( geometry, material );

            object.position.x = ( Math.random() - 0.5 ) * range;
            object.position.y = ( Math.random() - 0.5 ) * range;
            object.position.z = ( Math.random() - 0.5 ) * range;

            object.rotation.x = Math.random() * 6;
            object.rotation.y = Math.random() * 6;
            object.rotation.z = Math.random() * 6;

            object.matrixAutoUpdate = false;
            object.updateMatrix();

            result.scene.add( object );

        }

        result.scene.matrixAutoUpdate = false;

        light = new THREE.PointLight( 0xffffff );
        result.scene.add( light );

        light = new THREE.DirectionalLight( 0x111111 );
        light.position.x = 1;
        result.scene.add( light );

        return result;

    }


    function animate() {

        requestAnimationFrame( animate );

        render();
        stats.update();
    }

    function renderLoadScene() {
        renderer.render( scene, camera );
    }
    var material = new THREE.LineBasicMaterial({
color: 0x0000ff
});
var line = {};
function render() {
    if(run) {
    /**
     * Check for nearby objects in view direction 
     **/
   // console.log(closestObject());

    direction = controls.getLookDirection().clone();
    position = controls.getPosition().clone();

    rayCasting(position.clone(), direction.clone());

    //// Debug direction
    if(debug) {
        var geometry = new THREE.Geometry();
        //geometry.vertices.push(new THREE.Vector3(0,0,0));
        //geometry.vertices.push(position.add(direction.multiplyScalar(1000)));
        geometry.vertices.push(position.clone());
        geometry.vertices.push(position.clone().add(direction.clone().multiplyScalar(1000)));
        scene.remove(line);
        line = new THREE.Line(geometry, material);
        scene.add(line);
    }

    controls.update( Date.now() - time );

    time = Date.now();

    renderer.render( scene, camera );
    game_sound.update( controls );
    }
};
function start() {
    run = true;
}

function pause() {
    run = false;
}

function closestObject()
{
    var closest = {};
    var min = 10000000;
    for(obj in physicsObjects) {
        dist = distanceFromObject(physicsObjects[obj]);
        if(dist<min) {
            min = dist; 
            closest=obj;
        }
    }
    return closest;
}

/**
 * Returns the distance at which we are form object (in the sense
 of norm2 
 **/
function distanceFromObject(obj) {
    var cubePos= obj.position.clone();
    var cameraPos = controls.getObject().position.clone();
    var dist =
        Math.sqrt((cubePos.y-cameraPos.x)*(cubePos.x-cameraPos.x),(cubePos.y-cameraPos.y)*(cubePos.y-cameraPos.y),(cubePos.z-cameraPos.z)*(cubePos.z-cameraPos.z));

    return dist;
}

/**
 * Doesn't work
 **/
function rayCasting(origin, direction) {
    ray.ray.origin = origin.clone();
    ray.ray.direction = direction.clone().normalize();


    for (var m in physicsObjects) {
        var intersects = ray.intersectObject( physicsObjects[m] );

        if ( intersects.length > 0 ) {
			name = physicsObjects[m].name;
			if(name.indexOf("coincoin")!=-1)
			{
				physicsObjects[m].position.set( Math.random()*10, 50, Math.random()*10);
    			physicsObjects[m].__dirtyPosition = true;
			}
            // Normal vector of the meshes' face we hit
            //var nV = intersects[0].face.normal;
            // Velocity vector (of the character)
            //var vV = this.velocity.clone();
            //// And calculate the reflection vector
            //var rV = n.multiplyScalar(-2 * vV.dot(nV)).addSelf(vV);;

            console.log("intersect with "+physicsObjects[m].name);
        }
    }
}















/* ================================================================================ 
 * SCENE EXPLORER
 * Just for debug purposes
 * This section is used to display all available objects and
 * properties into an html tree
 *  =============================================================================== */

function toggle( id ) {

    var scn = $( "section_" + id ).style,
        btn = $( "plus_" + id );

    if ( scn.display == "block" ) {

        scn.display = "none";
        btn.innerHTML = "[+]";

    }
    else {

        scn.display = "block";
        btn.innerHTML = "[-]";

    }

}

function createToggle( label ) { return function() { toggle( label ) } };

function refreshSceneView( result ) {

    $( "section_exp" ).innerHTML = generateSceneView( result );

    var config = [ "obj", "geo", "mat", "tex", "lit", "cam" ];

    for ( var i = 0; i < config.length; i++ )
        $( "plus_" + config[i] ).addEventListener( 'click', createToggle( config[i] ), false );

}

/**
 * Add objects into HTML tree
 * Just for debug purposes
 */
function generateSection( label, id, objects ) {

    var html = "";

    html += "<h3><a id='plus_" + id + "' href='#'>[+]</a> " + label + "</h3>";
    html += "<div id='section_" + id + "' class='part'>";

    for( var o in objects ) {

        html += o + "<br/>";

    }
    html += "</div>";

    return html;

}

/**
 * Add objects into HTML tree
 * Just for debug purposes
 */
function generateSceneView( result ) {

    var config = [
        [ "Objects",    "obj", result.objects ],
        [ "Geometries", "geo", result.geometries ],
        [ "Materials",  "mat", result.materials ],
        [ "Textures",   "tex", result.textures ],
        [ "Lights",     "lit", result.lights ],
        [ "Cameras",    "cam", result.cameras ]
            ];

    var html = "";

    for ( var i = 0; i < config.length; i++ )
        html += generateSection( config[i][0], config[i][1], config[i][2] );

    return html;

}
/* ================================================================================ 
 * END SCENE EXPLORER
 *  =============================================================================== */

};
