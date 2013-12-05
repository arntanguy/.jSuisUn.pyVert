/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var isOnObject = false;
	var canJump = false;

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 90: // up
			case 122: // z
				moveForward = true;
				break;

			case 81: // left
			case 113: // q
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 10;
				canJump = false;
				break;

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 90: // up
			case 122: // w
				moveForward = false;
				break;

			case 81: // left
			case 113: // q
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();

	this.update = function ( delta ) {

		if ( scope.enabled === false ) return;

		delta *= 0.1;

		velocity.x += ( - velocity.x ) * 0.08 * delta;
		velocity.z += ( - velocity.z ) * 0.08 * delta;

		velocity.y -= 0.25 * delta;

		if ( moveForward ) velocity.z -= 0.12 * delta;
		if ( moveBackward ) velocity.z += 0.12 * delta;

		if ( moveLeft ) velocity.x -= 0.12 * delta;
		if ( moveRight ) velocity.x += 0.12 * delta;

		if ( isOnObject === true ) {

			velocity.y = Math.max( 0, velocity.y );

		}

		yawObject.translateX( velocity.x );
		yawObject.translateY( velocity.y ); 
		yawObject.translateZ( velocity.z );

		if ( yawObject.position.y < 10 ) {

			velocity.y = 0;
			yawObject.position.y = 10;

			canJump = true;

		}

	};

    this.getPosition = function() {
        return yawObject.position;
    };

    this.getLookDirection = function() {

        var pitch = pitchObject.rotation.x + Math.pi;
        var yaw = yawObject.rotation.y;
        //var yaw = pitchObject.rotation.x;
        //var pitch = yawObject.rotation.y;

        //xzLen = Math.cos(pitch);
        //x = xzLen * Math.cos(yaw);
        //y = Math.sin(pitch/2);
        //z = xzLen * Math.sin(-yaw);
        //console.log(pitch);
        //console.log(yaw);

        var sinPitch = Math.sin(pitch);
        var cosPitch = Math.cos(pitch);
        var sinYaw = Math.sin(yaw);
        var cosYaw = Math.cos(yaw);
       
        x = cosPitch * cosYaw; 
        z = - cosPitch * sinYaw; 
        y = sinPitch;

       // var x = Math.cos(yaw)*Math.cos(pitch);
       // var y = Math.sin(yaw)*Math.cos(pitch);
       // var z = Math.sin(pitch);

        //var x = cosPitch * sinYaw;
        //var y = sinPitch;
        //var z = sinPitch*sinYaw;

        return new THREE.Vector3(x, y, z);
    

// pitch and yaw are in degrees
   //var pitchRadians = Math.toRadians(pitch);
   //var yawRadians = Math.toRadians(yaw);

   //var sinPitch = Math.sin(pitchRadians);
   //var cosPitch = Math.cos(pitchRadians);
   //var sinYaw = Math.sin(yawRadians);
   //var cosYaw = Math.cos(yawRadians);

   //return new Vector3D(-cosPitch * sinYaw, sinPitch, -cosPitch * cosYaw);
    };

};