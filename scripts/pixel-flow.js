/*
** Pixel Flow v0.2
** http://devnimlos.com/demos/PixelFlow/
** https://github.com/JamesNimlos/pixel-flow
**
** Developed by
** - James Nimlos http://devnimlos.com/
**
** Licensed under MIT license
*/

;(function( window, document, $, undefined ){

	'use strict';

	// check for canvas support
	var canvas = document.createElement('canvas')
	var isCanvasSupported = canvas.getContext && canvas.getContext('2d')

	// utility functions
	var evenNum  = function( num ) {
		if(typeof num !== 'number') return NaN;
		return ~~num - ( ~~num % 2 );
	};

	var convPerc = function ( perc ) {
		return Number(perc.replace(/[\s%]/g, '')) / 100;
	};

	// don't proceed if canvas is no supported
	if ( !isCanvasSupported ) {
	  return
	}

	//set up default options
	var pluginName = 'PixelFlow'
		, defaults = {
				resolution : 16,
				offsetX : 0,
				offsetY : 0
			};

	/**
	 * @param {HTMLImageElement} img
	 * @param {Object} [options] 
	 */
	function PixelFlow ( img, options ) {
		if( !(img instanceof HTMLImageElement) ) 
			return window.console && console.error( 'The provided element is not an HTMLImageElement.' );
	  
		this.options = $.extend( {}, defaults, options );

	  this.img = img;

	  try {
		  this.setUpCanvas(img);

		  this.drawPixels();

		  // replace image with canvas
		  img.parentNode.replaceChild( this.canvas, img );

		  $.data(this.canvas, 'plugin_' + pluginName, this);

	  } catch (err) {

	  	window.console && console.error( 'PixelFlow could not not be created.' )
	  	window.console && console.error( err );

	  }
	};

	/**
	 * Factory function
	 * @param  {HTMLImageElement} img
	 * @param  {Object} opts
	 * @return {PixelFlow}
	 */
	PixelFlow.build = function ( img, opts ) {
		return new PixelFlow( img, opts );
	}

	/**
	 * Draws a full column on the canvas
	 * @param  {number} left - pixel location of left side of column
	 * @param  {number} colWidth - width of the column being drawn in pixels
	 * @param  {number} [pixHeight] - height of each 'pixel' being drawn
	 * @return {void}
	 */
	PixelFlow.prototype.drawCol = function ( left, colWidth, pixHeight ) {
		if(colWidth <= 2 || pixHeight <= 2) return;
		if(left + colWidth < 0) return;
		//local variables
		var w = this.width
			,	h = this.height
			, ctx = this.ctx
			, imgData = this.imgData
			, options = this.options
			, res = colWidth
			, resH = pixHeight || res
			, size = options.size || res
			, alpha = 1
			, offsetX = options.offestX
			, offsetY = options.offsetY
			, rows = h / resH + 1
			, halfSize = size / 2;

		var row
			, x = left || 0
			, y
			, pixelY
			, pixelX
			, pixelIndex
			, red
			, green
			, blue
			, pixelAlpha;

		if((x + res) <= offsetX) return;
    // normalize y so shapes around edges get color
    pixelX = Math.max( Math.min( x, w-1), 0);

		for ( row = 0; row < rows; row++ ) {

		  y = ( row - 0.5 ) * resH + offsetY;
		  // normalize y so shapes around edges get color
		  pixelY = Math.max( Math.min( y, h-1), 0);

		  pixelIndex = ( pixelX + pixelY * w ) * 4;

		  this.drawPixel( pixelIndex, x, y, res, resH);

		}
	};

	/**
	 * Draws an individual block or 'pixel' on the canvas
	 * @param  {number} pixelIndex - index of the pixel from the image data
	 * @param  {number} x - horizontal position of the 'pixel' from left edge being 0
	 * @param  {number} y - vertical position of the top left corner of the 'pixel' 
	 * @param  {number} w - width of the 'pixel'
	 * @param  {number} h - height of the 'pixel'
	 * @return {this}
	 */
	PixelFlow.prototype.drawPixel = function( pixelIndex, x, y, w, h) {
		var ctx = this.ctx
			, imgData = this.imgData
			, red   = imgData[ pixelIndex + 0 ]
    	, green = imgData[ pixelIndex + 1 ]
    	, blue  = imgData[ pixelIndex + 2 ]
    	, alpha = 1
    	, pixelAlpha = alpha * ( imgData[ pixelIndex + 3 ] / 255);

    // sets the color using pixelIndex reference for the 'pixel'
    ctx.fillStyle = 'rgba(' + red +','+ green +','+ blue +','+ pixelAlpha + ')';

    // draws pixel
    ctx.fillRect( x, y, w, h );

    return this;
	};

	/**
	 * Draws the entire pixelation using the current settings on the 
	 * PixelFlow instance. 'Pixel' size is constant throughout.
	 * @return {this}
	 */
	PixelFlow.prototype.drawPixels = function() {
		//local variables
		var w = this.width
			,	h = this.height
			, ctx = this.ctx
			, imgData = this.imgData
			, options = this.options
			, res = options.resolution
			, size = options.size || res
			, alpha = 1
			, offsetX = options.offsetX
			, offsetY = options.offsetY
			, cols = w / res + 1
			, rows = h / res + 1
			, halfSize = size / 2;

		if(res < 4) return this.rebase();

		var row
			, col
			, x
			, y
			, pixelY
			, pixelX
			, pixelIndex
			, red
			, green
			, blue
			, pixelAlpha;

		for ( row = 0; row < rows; row++ ) {

		  y = ( row - 0.5 ) * res + offsetY;
		  // normalize y so shapes around edges get color
		  pixelY = Math.max( Math.min( y, h-1), 0);

		  for ( col = 0; col < cols; col++ ) {

		    x = ( col - 0.5 ) * res + offsetX;
		    // normalize y so shapes around edges get color
		    pixelX = Math.max( Math.min( x, w-1), 0);
		    pixelIndex = ( pixelX + pixelY * w ) * 4;
		    red   = imgData[ pixelIndex + 0 ];
		    green = imgData[ pixelIndex + 1 ];
		    blue  = imgData[ pixelIndex + 2 ];
	      pixelAlpha = alpha * ( imgData[ pixelIndex + 3 ] / 255);

	      ctx.fillStyle = 'rgba(' + red +','+ green +','+ blue +','+ pixelAlpha + ')'

		    // square
        ctx.fillRect( x - halfSize, y - halfSize, size, size );

		  } // col
		} // row

		return this;
	};

	/**
	 * Draws a linear, vertical gradient using the provided options
	 * Example options object:
	 * var options = {
	 * 		resolution : [ 32, 0 ],
	 * 		location : [ 0, 0.25, 0.75, 1]
	 * }
	 * This will generate a gradient that starts at size 32 pixels on the left
	 * and will be that size until 25% of the way through the image, then it will 
	 * begin decreasing linearly until it should be normal resolution 
	 * (anything less than 4) at or just after 75% of the way throught the image.
	 * 
	 * @param  {Object} options
	 * @return {this}
	 */
	PixelFlow.prototype.linearGradient = function( options ) {

		// TODO: create a better default system.
		var options = $.extend({'location':[0,.25,.75,1],'resolution':[32,0],'rebase':true},options);

		if(options.rebase) this.rebase();

		if(options.location.length < 4 || options.resolution.length < 2) return window.console && console.error('You have not provided the necessary options for a linear gradient.');

		var startRes = evenNum(options.resolution[0])
			, endRes = evenNum(options.resolution[1])
			, startPoint = options.location[0] || 0
			, gradStart = options.location[1] || 0.25
			, gradEnd = options.location[2] || 0.75
			, endPoint = options.location[3] || 1
			, offsetX = this.offsetX || 0;

		if(typeof startPoint === 'string') startPoint = convPerc(startPoint);
		if(typeof gradStart === 'string') gradStart = convPerc(gradStart);
		if(typeof gradEnd === 'string') gradEnd = convPerc(gradEnd);
		if(typeof endPoint === 'string') endPoint = convPerc(endPoint);

		// calculate cols
		var w = this.width
			, h = this.height
			, ctx = this.ctx;

		// points to pixels
		startPoint *= w;
		gradStart *= w;
		gradEnd *= w;
		endPoint *= w;

		var cols = [];
		if(startRes > 0) cols.push(evenNum(startPoint));

		// modify start points for best spacing
		// gradStart -= (gradStart - startPoint) % startRes;
		// gradEnd += endRes - (( endPoint - gradEnd ) % (endRes || 1));

		// TODO: change this to a factory which could return an addColRange function
		// using one of the different types between linear, exponential, bezier
		function addColRange(arr, leftStart, startWidth, endWidth, rightEnd) {

			if(rightEnd < leftStart) return;

			if(startWidth === endWidth) {
				if(startWidth === 0) return;
				// if(leftStart - rightEnd < startWidth) return;
				var place = leftStart;
				while (place <= rightEnd) {
					place += startWidth;
					cols.push(evenNum(place)); // sub even pixels negatively affects presentation
				}
			} else {
				var Rl = startWidth || 4; // in case resolution is zero
				var Rs = endWidth || 4;
				var t = rightEnd - leftStart;
				// var mx = ( t / Rl );
				// var mi = ( t / Rs );

				// var mc = Math.floor( ( mx + mi ) / 2 );
				// var s = 2 * ( t - ( mc * Rs ) ) / ( mc * ( mc + 1 ) );
				var place = leftStart;
				var cWidth = startWidth;
				var exp;

				do {
					// linear regression relationship but could be changed
					// TODO: bezier curve regression
					exp = Rl - ( (Rl - Rs) * ((place - leftStart) / t) ); 
					cWidth = exp;
					place += evenNum(cWidth);
					cols.push(evenNum(place));
				} while( place <= rightEnd && cWidth >= 2 );
			}
			
		};
		//calc cols from gradStart to startPoint
		addColRange(cols, startPoint, startRes, startRes, gradStart);
		addColRange(cols, cols[cols.length-1] || gradStart, startRes, endRes, gradEnd);
		addColRange(cols, cols[cols.length-1], endRes, endRes, endPoint);

		for(var c = 1; c < cols.length; c++) {
			this.drawCol( (cols[c - 1] + offsetX), ( cols[c] - cols[c-1] ) );
		}

		return this;
	};

	/**
	 * Returns the canvas to display the original image
	 * @return {this}
	 */
	PixelFlow.prototype.rebase = function () {

		this.options.resolution = 0;

		this.ctx.drawImage( this.img, 0, 0 );

		return this;
	};

	/**
	 * creates the canvas element and copies the image onto it
	 * also creates a back-up canvas
	 * @param {HTMLImageElement}
	 * @return {this}
	 */
	PixelFlow.prototype.setUpCanvas = function(img) {
		
	  // create canvas
	  var canvas = this.canvas = document.createElement('canvas');
	  this.ctx = canvas.getContext('2d');

	  //make virtual duplicate for safe keeping of picture data
	  this._copyCanvas = document.createElement('canvas');
	  this._copyCtx = this._copyCanvas.getContext('2d');

	  // copy basic attributes from img to canvas
	  canvas.className = img.className;
	  canvas.id = img.id;

	  var w = this.width = this.canvas.width = this._copyCanvas.width = (img.naturalWidth % 2 == 0) ? img.naturalWidth : img.naturalWidth - 1;
	  var h = this.height = this.canvas.height  = this._copyCanvas.height = (img.naturalHeight % 2 == 0) ? img.naturalHeight : img.naturalHeight - 1;

	  // draw on both canvases
  	this.ctx.drawImage( img, 0, 0 );
  	this._copyCtx.drawImage( img, 0, 0 );

    this.imgData = this._copyCtx.getImageData( 0, 0, w, h ).data;

    this.ctx.clearRect( 0, 0, w, h );

    return this;
	};

	/**
	 * @param  {number} endResolution - resolution to stop the animation at
	 * @param  {number} duration - length of the animation
	 * @return {this}
	 */
	PixelFlow.prototype.simpleanimate = function( endResolution, duration ) {

		var er = evenNum(endResolution);
		// if end resolution is the same as the start then exit
		if(this.options.resolution === er) return;
		var startRes = this.options.resolution;
		var res = startRes;
		var startTime = Date.now();
		var elapsed = 0;
		var dur = duration;

		var PixelFlowAnimationLoop = function () {

			var time = Date.now();

			res = startRes + (er - startRes) * ( ( time - startTime ) / duration );

			res = evenNum(res);
			console.log('res : ' + res);

			if(res >= 2){

				// since we only run for even numbers this happens 
				// during long animations
				if(this.options.resolution !== res) {
					console.debug('updated!')
					this.update({'resolution':evenNum(res)});
				}

			} else {

				this.rebase({});

			}

			if(
					( er > startRes && res < er) ||
					( er < startRes && res > er)
				) {
				window.requestAnimationFrame( PixelFlowAnimationLoop );
			}

		}.bind(this);

		window.requestAnimationFrame( PixelFlowAnimationLoop );

		return this;
	};

	/**
	 * updates the canvas with the new options for resolution
	 * @param  {Object} options - options to update the canvas with
	 * @return {this}
	 */
	PixelFlow.prototype.update = function( options ){

		$.extend( this.options, options );
		
		this.options.resolution = evenNum(this.options.resolution);

		this.drawPixels();

		return this;
	};

	$.fn[pluginName] = function () {
	  var a = arguments
	  	, o = a[0]
	  	, $cvs;
	  this.each(function () {
	    var r = $.data(this,'plugin_' + pluginName);
	    if(!r) {
	      r = new PixelFlow( this, o );
	    } else {
	      if('undefined' === typeof o) {
	        return $cvs.add(r.canvas);
	      } else if('string' !== typeof o || !r[o]) {
	        void jQuery.error("Method "+o+" does not exist on jQuery(el)."+pluginName)
	      } else {
	        r[o].apply(r,[].slice.call(a,1));
	      }
	    }
	    if(typeof $cvs === 'undefined') $cvs = $(r.canvas);
	    else $cvs.add(r.canvas);
	  });
	  return $cvs;
	}

})( window, document, jQuery );