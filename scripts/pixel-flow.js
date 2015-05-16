/*
** Pixel Flow v0.1
** http://devnimlos.com/demos/PixelFlow/
**
** Developed by
** - James Nimlos http://devnimlos.com/
**
** Inspired by Close Pixelate {
** 	Close Pixelate v2.0.00 beta
** 	http://desandro.com/resources/close-pixelate/
** 
** 	Developed by
** 	- David DeSandro  http://desandro.com
** 	- John Schulz  http://twitter.com/jfsiii
** }
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

	function PixelFlow( img, options ) {
		if( !(img instanceof HTMLImageElement) ) 
			return console.error( 'The provided element is not an HTMLImageElement.' );
	  
		this.options = $.extend( {}, defaults, options );

	  this.img = img;

	  try {
		  this.setUpCanvas(img);

		  this.drawPixels();

		  // replace image with canvas
		  img.parentNode.replaceChild( this.canvas, img );

		  $.data(this.canvas, 'plugin_' + pluginName, this);

	  } catch (err) {

	  	console.log( 'PixelFlow could not not be created.' )
	  	console.error( err );

	  }
	};

	PixelFlow.prototype.drawCol = function( left, colWidth, pixHeight ) {
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

	PixelFlow.prototype.drawPixel = function( pixelIndex, x, y, w, h) {
		var ctx = this.ctx
			, imgData = this.imgData
			, red   = imgData[ pixelIndex + 0 ]
    	, green = imgData[ pixelIndex + 1 ]
    	, blue  = imgData[ pixelIndex + 2 ]
    	, alpha = 1
    	, pixelAlpha = alpha * ( imgData[ pixelIndex + 3 ] / 255);

    ctx.fillStyle = 'rgba(' + red +','+ green +','+ blue +','+ pixelAlpha + ')';

    // square
    ctx.fillRect( x, y, w, h );
	};

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
	};

	PixelFlow.prototype.linearGradient = function( options ) {

		var options = $.extend({'location':[0,.25,.75,1],'resolution':[32,0],'rebase':true},options);

		if(options.rebase) this.rebase();

		if(options.location.length < 4 || options.resolution.length < 2) return console.error('You have not provided to necessary options for a linear gradient.');

		var startRes = evenNum(options.resolution[0])
			, endRes = evenNum(options.resolution[1])
			, startPoint = options.location[0] || 0
			, gradStart = options.location[1] || 0.25
			, gradEnd = options.location[2] || 0.75
			, endPoint = options.location[3] || 1
			, offsetX = this.offsetX || 0;


		//TODO: handle percentages

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
	};

	PixelFlow.prototype.rebase = function( options ) {

		this.ctx.drawImage( this.img, 0, 0 );

	};

	PixelFlow.prototype.setUpCanvas = function(img) {
		
	  // create canvas
	  var canvas = this.canvas = document.createElement('canvas');
	  this.ctx = canvas.getContext('2d');

	  //make virtual duplicate for safe keeping of picture data
	  this.copyCanvas = document.createElement('canvas');
	  this.copyCtx = this.copyCanvas.getContext('2d');

	  // copy attributes from img to canvas
	  canvas.className = img.className;
	  canvas.id = img.id;

	  var w = this.width = this.canvas.width = this.copyCanvas.width = (img.naturalWidth % 2 == 0) ? img.naturalWidth : img.naturalWidth - 1;
	  var h = this.height = this.canvas.height  = this.copyCanvas.height = (img.naturalHeight % 2 == 0) ? img.naturalHeight : img.naturalHeight - 1;

  	this.ctx.drawImage( img, 0, 0 );
  	this.copyCtx.drawImage( img, 0, 0 );

    this.imgData = this.copyCtx.getImageData( 0, 0, w, h ).data;

    this.ctx.clearRect( 0, 0, w, h );

	};

	PixelFlow.prototype.simpleanimate = function( endResolution, duration ) {

		(function( pixelFlow, endRes, dr ){

			if(pixelFlow.options.resolution === endRes) return;
			var startRes = pixelFlow.options.resolution;
			var res = startRes;
			var	delay = 100;
			var step = (startRes - endRes) / ( dr / delay );
			var elapsed = 0;
			var er = endRes;
			var dur = dr;

			function PixelFlowAnimationLoop(){
							
				res -= step;

				if(res >= 2){

					pixelFlow.update({'resolution':evenNum(res)});
					if(res > endRes) {
						setTimeout(PixelFlowAnimationLoop,delay);
					}

				} else {

					pixelFlow.rebase({});

				}

			}

			setTimeout(PixelFlowAnimationLoop, delay);
			
		})(this, evenNum(endResolution), duration);
		
	};

	PixelFlow.prototype.update = function( options ){

		$.extend( this.options, options );
		
		this.options.resolution = evenNum(this.options.resolution);

		this.drawPixels();

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