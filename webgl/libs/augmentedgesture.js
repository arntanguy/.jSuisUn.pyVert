//////////////////////////////////////////////////////////////////////////////////
//		Augmented gesture						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Constructor
*/
AugmentedGesture	= function(opts){
	this._opts	= opts || new AugmentedGesture.Options();
	// init usermedia webcam
	// - TODO change this by a exception
	if( !AugmentedGesture.hasUserMedia )	alert('Panic: no UserMedia')
	console.assert( AugmentedGesture.hasUserMedia, "no usermedia available");
	this._video	= this._videoCtor();

	this._frameCount= 0;

	var canvas	= document.createElement('canvas');
	this._canvas	= canvas;
	canvas.width	= this._video.width	/4;
	canvas.height	= this._video.height	/4;

	// gesture recognition
	this._pointersPos		= {};	// to store pointers coordinates
};

/**
 * Destructor
*/
AugmentedGesture.prototype.destroy	= function(){
	this.stop();
	this.domElementRemove();
	this.statsRemove();
	this.disableDatGui();
}

navigator.getUserMedia	= navigator.getUserMedia || navigator.webkitGetUserMedia;
URL			= URL || webkitURL;

/**
 * equal to hasUserMedia
*/
AugmentedGesture.hasUserMedia	= navigator.getUserMedia ? true : false;

//////////////////////////////////////////////////////////////////////////////////
//		MicroEvent							//
//////////////////////////////////////////////////////////////////////////////////

/**
 * microevents.js - https://github.com/jeromeetienne/microevent.js
*/
AugmentedGesture.MicroeventMixin	= function(destObj){
	destObj.bind	= function(event, fct){
		if(this._events === undefined) 	this._events	= {};
		this._events[event] = this._events[event]	|| [];
		this._events[event].push(fct);
		return fct;
	};
	destObj.unbind	= function(event, fct){
		if(this._events === undefined) 	this._events	= {};
		if( event in this._events === false  )	return;
		this._events[event].splice(this._events[event].indexOf(fct), 1);
	};
	destObj.trigger	= function(event /* , args... */){
		if(this._events === undefined) 	this._events	= {};
		if( this._events[event] === undefined )	return;
		var tmpArray	= this._events[event].slice(); 
		for(var i = 0; i < tmpArray.length; i++){
			tmpArray[i].apply(this, Array.prototype.slice.call(arguments, 1))
		}
	}
};

// make it eventable
AugmentedGesture.MicroeventMixin(AugmentedGesture.prototype);


//////////////////////////////////////////////////////////////////////////////////
//		Start/Stop							//
//////////////////////////////////////////////////////////////////////////////////

/**
 * Start monitoring the video
*/
AugmentedGesture.prototype.start	= function(){
	// define the callback
	var updateFn	 = function(){
		this._reqAnimId	= requestAnimationFrame(updateFn);
		this._update();
	}.bind(this);
	// initiate the looping
	updateFn();
	// for chained api
	return this;
}

/**
 * Stop monitoring the video
*/
AugmentedGesture.prototype.stop	= function(){
	cancelAnimationFrame(this._reqAnimId);
	// for chained api
	return this;
};


AugmentedGesture.prototype.opts	= function(){
	return this._opts;
}

//////////////////////////////////////////////////////////////////////////////////
//		domElement injecter						//
// TODO should that be elsewhere ?						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * put the .domElement() fullpage
 * Usefull as feedback to the user
*/
AugmentedGesture.prototype.domElementFullpage	= function(){
	// get domElement
	var domElement	= this.domElement();
	// add it to the body
	document.body.appendChild(domElement);
	// set the style
	domElement.style.position	= 'absolute';
	domElement.style.top		= '0px';
	domElement.style.left		= '0px';
	domElement.style.width		= "100%";
	domElement.style.height		= "100%";
	// for chained API
	return this;
}

/**
 * put the .domElement() as thumbnail.
 * Usefull as feedback to the user
*/
AugmentedGesture.prototype.domElementThumbnail	= function(){
	// get domElement
	var domElement	= this.domElement();
	// add it to the body
	document.body.appendChild(domElement);
	// set the style
	domElement.style.position	= 'absolute';
	domElement.style.top		= '0px';
	domElement.style.left		= '0px';
	domElement.style.width		= "320px";
	domElement.style.height		= "240px";		
	// for chained API
	return this;
}

/**
 * Remove the domElement from the DOM if it is attached
*/
AugmentedGesture.prototype.domElementRemove	= function(){
	// get domElement
	var domElement	= this.domElement();
	// remove domElement from its parent if needed
	domElement.parentNode && domElement.parentNode.removeChild(domElement);
	// for chained API
	return this;
}

//////////////////////////////////////////////////////////////////////////////////
//		stat.js injecter						//
// TODO should that be elsewhere ?						//
//////////////////////////////////////////////////////////////////////////////////

/**
 * put the .domElement() as thumbnail.
 * Usefull as feedback to the user
*/
AugmentedGesture.prototype.statsInsert	= function(){
	var stats	= this._stats	= new Stats();
	// Align top-left
	stats.getDomElement().style.position	= 'absolute';
	stats.getDomElement().style.left	= '0px';
	stats.getDomElement().style.top		= '0px';
	document.body.appendChild( stats.getDomElement() );
	// for chained API
	return this;
}

/**
 * Remove the domElement from the DOM if it is attached
*/
AugmentedGesture.prototype.statsRemove	= function(){
	// return now if this._stats isnt init
	if( !this._stats )	return this;
	// get domElement
	var domElement	= this._stats.getDomElement();
	// remove domElement from its parent if needed
	domElement.parentNode && domElement.parentNode.removeChild(domElement);
	// mark the object as removed
	this._stats	= null;
	// for chained API
	return this;
}

/**
 * Remove the domElement from the DOM if it is attached
*/
AugmentedGesture.prototype._statsUpdate	= function(){
	if( !this._stats )	return;
	this._stats.update();
}

//////////////////////////////////////////////////////////////////////////////////
//		AddPointer							//
//////////////////////////////////////////////////////////////////////////////////

AugmentedGesture.prototype.addPointer	= function(pointerId, pointerOpts){
	console.assert( !this._pointersPos[pointerId] );
	this._pointersPos[pointerId]	= { x : this._canvas.width/2, y : this._canvas.height/2	};

	console.assert( !this._opts.pointers[pointerId] );
	this._opts.pointers[pointerId]	= pointerOpts;

	this._datgui && this._addDatGuiPointer(pointerId);
}

//////////////////////////////////////////////////////////////////////////////////
//		Options								//
//////////////////////////////////////////////////////////////////////////////////

AugmentedGesture.Options	= function(){
	this.general	= {
		video	: {
			w		: 320/4,
			h		: 240/4,
			frameRate	: 1
		}
	};
	this.pointers	= {};	// each element of class AugmentedGesture.OptionPointer
};

AugmentedGesture.OptionPointer	= function(){
	this.pointer	= {
		display		: true,
		coordSmoothV	: 0.3,
		coordSmoothH	: 0.3,
		crossColor	: {r: 0, g: 255, b: 255}
	};
	this.disp	= {
		enable	: false,
		VHist	: false,
		HHist	: false,
		VLine	: false,
		HLine	: false
	};
	this.colorFilter	= {
		r	: {
			min	:   0,
			max	: 255
		},
		g	: {
			min	:   0,
			max	: 255
		},
		b	: {
			min	:   0,
			max	: 255
		},
		minHist	: {
			h	: 5,
			v	: 5
		}
	};
	this.smooth	= {
		vWidth	: 9,
		hWidth	: 9
	};
};

//////////////////////////////////////////////////////////////////////////////////
//		Dat.gui								//
//////////////////////////////////////////////////////////////////////////////////

AugmentedGesture.prototype.enableDatGui	= function(){
	var guiOpts	= this._opts;
	// wait for the page to load before initializing it
	window.addEventListener('load', function(){
		var gui		= this._datgui	= new dat.GUI();
		// General folder
		var folder	= gui.addFolder('General');
		folder.add(guiOpts.general.video, 'w', 0, 320).step(40).name('videoW');
		folder.add(guiOpts.general.video, 'h', 0, 240).step(30).name('videoH');
		folder.add(guiOpts.general.video, 'frameRate', 1, 30).step(1);

		// init all the pointer already init
		Object.keys(this._pointersPos).forEach(function(pointerId){
			this._addDatGuiPointer(pointerId);
		}.bind(this));

		// try to save value but doesnt work
		//gui.remember(guiOpts);		
	}.bind(this));
	return this;	// for chained API
};
AugmentedGesture.prototype.disableDatGui	= function(){
	this._datgui && this._datgui.destroy();
}

AugmentedGesture.prototype._addDatGuiPointer	= function(pointerId){
	console.assert( this._datgui );
	var gui		= this._datgui;
	var guiOpts	= this._opts;
	var pointerOpts	= guiOpts.pointers[pointerId];
	var mainFolder	= gui.addFolder("Pointer: "+pointerId);
	// pointer folder
	var folder	= mainFolder.addFolder('Main');
	folder.add(pointerOpts.pointer			, 'display');
	folder.add(pointerOpts.pointer			, 'coordSmoothV', 0, 1);
	folder.add(pointerOpts.pointer			, 'coordSmoothH', 0, 1);
	folder.add(pointerOpts.pointer.crossColor	, 'r', 0, 255).name('Cross ColorR');
	folder.add(pointerOpts.pointer.crossColor	, 'g', 0, 255).name('Cross ColorG');
	folder.add(pointerOpts.pointer.crossColor	, 'b', 0, 255).name('Cross ColorB');
	// display folder
	var folder	= mainFolder.addFolder('Display');
	//folder.open();
	folder.add(pointerOpts.disp	, 'enable');
	folder.add(pointerOpts.disp	, 'HHist');
	folder.add(pointerOpts.disp	, 'VHist');
	folder.add(pointerOpts.disp	, 'HLine');
	folder.add(pointerOpts.disp	, 'VLine');
	// Threshold folder
	var folder	= mainFolder.addFolder('Threshold');
	folder.open();
	folder.add(pointerOpts.colorFilter.r	, 'min', 0, 255).name('red min');
	folder.add(pointerOpts.colorFilter.r	, 'max', 0, 255).name('red max');
	folder.add(pointerOpts.colorFilter.g	, 'min', 0, 255).name('green min');
	folder.add(pointerOpts.colorFilter.g	, 'max', 0, 255).name('green max');
	folder.add(pointerOpts.colorFilter.b	, 'min', 0, 255).name('blue min');
	folder.add(pointerOpts.colorFilter.b	, 'max', 0, 255).name('blue max');
	folder.add(pointerOpts.colorFilter.minHist	, 'h', 0, 20).name('minHistH');
	folder.add(pointerOpts.colorFilter.minHist	, 'v', 0, 20).name('minHistV');
	folder.add(pointerOpts.smooth		, 'hWidth', 0, 20).step(1);
	folder.add(pointerOpts.smooth		, 'vWidth', 0, 20).step(1);
}

//////////////////////////////////////////////////////////////////////////////////
//		Getter								//
//////////////////////////////////////////////////////////////////////////////////

AugmentedGesture.prototype.domElement	= function(){
	return this._canvas;
}

AugmentedGesture.prototype.pointers	= function(){
	return this._pointersPos;
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

AugmentedGesture.prototype._videoCtor	= function(){
	var video	= document.createElement('video');
	video.width	= 320;
	video.height	= 240;
	video.autoplay	= true;

	navigator.getUserMedia({video: true}, function(stream){
		video.src	= URL.createObjectURL(stream);
		//console.log("pseudo object URL", video.src);
	}, function(error){
		alert('you got no WebRTC webcam');
	});
	return video;
}

/**
 * When the video update
*/
AugmentedGesture.prototype._update	= function()
{
	var guiOpts	= this._opts;
	var canvas	= this._canvas;
	var ctx		= canvas.getContext("2d");
	// rate limiter
	this._frameCount++;
	if( this._frameCount % guiOpts.general.video.frameRate !== 0 )	return;

	// if no data is ready, do nothing
	if( this._video.readyState !== this._video.HAVE_ENOUGH_DATA )	return;

	// update fps stats
	this._statsUpdate();

	// update canvas size if needed
	if( canvas.width  != guiOpts.general.video.w )	canvas.width	= guiOpts.general.video.w;
	if( canvas.height != guiOpts.general.video.h )	canvas.height	= guiOpts.general.video.h;
	
	var canvasW	= canvas.width;
	var canvasH	= canvas.height;
	
	// draw video into a canvas2D
	ctx.drawImage(this._video, 0, 0, canvas.width, canvas.height);

	var imageData	= ctx.getImageData(0,0, canvas.width, canvas.height);
	// flip horizontal 
	ImgProc.fliph(imageData);
	//ImgProc.luminance(imageData);

	
	function imageDataToPointer(imageData, pointerId){
		var tmpImgData	= ImgProc.duplicate(imageData, ctx);
		var pointerOpts	= guiOpts.pointers[pointerId];
		ImgProc.threshold(tmpImgData, pointerOpts.colorFilter.r, pointerOpts.colorFilter.g, pointerOpts.colorFilter.b);
		if( pointerOpts.disp.enable )	ImgProc.copy(tmpImgData, imageData);

		////////////////////////////////////////////////////////////////
		// horizontal coord X discovery
		var hist	= ImgProc.computeHorizontalHistogram(tmpImgData, function(p, i){
			return p[i+1] !== 0 ? true : false;
		});
		ImgProc.windowedAverageHistogram(hist, pointerOpts.smooth.hWidth);
		// keep only value greater than the minHist
		var minHistVal	= pointerOpts.colorFilter.minHist.h;
		ImgProc.filterHistogram(hist, function(val, idx, hist){
			hist[idx]	= hist[idx] >= minHistVal ? hist[idx] : 0;
		});
		// get the maximum value of the histogram
		var maxH	= ImgProc.getMaxHistogram(hist);
		if( pointerOpts.disp.VHist )	ImgProc.displayHorizontalHistogram(imageData, hist);

		////////////////////////////////////////////////////////////////
		// Vertical coord Y discovery
		var hist	= ImgProc.computeVerticalHistogram(tmpImgData, function(p, i){
			return p[i+1] !== 0 ? true : false;
		});
		ImgProc.windowedAverageHistogram(hist, pointerOpts.smooth.vWidth);
		// keep only value greater than the minHist
		var minHistVal	= pointerOpts.colorFilter.minHist.v;
		ImgProc.filterHistogram(hist, function(val, idx, hist){
			hist[idx]	= hist[idx] >= minHistVal ? hist[idx] : 0;
		});
		// get the maximum value of the histogram
		var maxV	= ImgProc.getMaxHistogram(hist);
		if( pointerOpts.disp.HHist )	ImgProc.displayVerticalHistogram(imageData, hist);
		return {
			h	: maxH,
			v	: maxV
		};
	};
	var processPointer	= function(pointerId){
		var pointerOpts	= guiOpts.pointers[pointerId];
		// do the image processing to get immediate pointer position
		var pointerMax	= imageDataToPointer(imageData, pointerId);
		// Display the cross
		if( pointerOpts.disp.HLine )	ImgProc.hline(imageData, pointerMax.h.idx, 0, 255, 0);
		if( pointerOpts.disp.VLine )	ImgProc.vline(imageData, pointerMax.v.idx, 0, 255, 0);

		// is immediate pointer invalid
		var pointerInv	= (pointerMax.h.max === 0 || pointerMax.v.max === 0 ) ? true : false;
		// if immediate pointer is invalid, 
		if( pointerInv ){
			// if it was invalid already, do nothing
			if( this._pointersPos[pointerId] === null )	return;
			// mark the pointer as invalid
			this._pointersPos[pointerId] = null;
			// notify "mouseup"
			this.trigger("mouseup."+pointerId)
			return;
		}
		// from here, the pointer is valid

		// if the pointer was invalid before, notify mousedown, click
		if( !this._pointersPos[pointerId] ){
			this._pointersPos[pointerId]	= { x : pointerMax.h.idx/canvasW, y : pointerMax.v.idx/canvasH	};
			// notify "mouseup"
			this.trigger("mousedown."+pointerId, this._pointersPos[pointerId]);
			// notify "click"
			this.trigger("click."+pointerId, this._pointersPos[pointerId]);
		}

		// update the pointer position
		var pointerPos	= this._pointersPos[pointerId];
		var oldPosX	= pointerPos.x;
		var oldPosY	= pointerPos.y;
		pointerPos.x	+= (pointerMax.h.idx/canvasW - pointerPos.x) * pointerOpts.pointer.coordSmoothH;
		pointerPos.y	+= (pointerMax.v.idx/canvasH - pointerPos.y) * pointerOpts.pointer.coordSmoothV;
		// display the pointer position
		if( pointerOpts.pointer.display ){
			var crossColor	= pointerOpts.pointer.crossColor;
			ImgProc.vline(imageData, Math.floor(pointerPos.x*canvasW), crossColor.r, crossColor.g, crossColor.b);
			ImgProc.hline(imageData, Math.floor(pointerPos.y*canvasH), crossColor.r, crossColor.g, crossColor.b);
		}

		// honor mousemove
		if( oldPosX !== pointerPos.x || oldPosY !== pointerPos.y ){
			this.trigger("mousemove."+pointerId, pointerPos);
		}
	}.bind(this);

	// Process all pointers
	Object.keys(this._pointersPos).forEach(function(pointerId){
		//console.log("pointerId", pointerId)
		processPointer(pointerId);
	});

/*
 * Note on makeing the pointer not always valid
 * - what about the follow algo
 * - if maxVRight.max < guiOpts.pointers['right'].threshold.minVhist then maxVRight.idx is invalid
 * - if maxHRight.max < guiOpts.pointers['right'].threshold.minHhist then maxHRight.idx is invalid
 * - ok but what to do when one is invalid ?
 *   - do i invalid the pointer all together ?
 *   - when pointer is invalid how to put it back
*/
/**
 * what if i do
 * - if maxVRight.max < guiOpts.pointers['right'].threshold.minVhist then pointerR === null
 * - if >= and pointerR then normal update
 * - if >= and pointerR === null then jump direction to maxVRight position
 * - trigger event for pointerUp pointerDown, pointerMove
*/
/**
 * Once you got that you can do $1 gesture recognition
*/
	// update the canvas
	ctx.putImageData(imageData, 0, 0);
}

