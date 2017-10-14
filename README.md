# pixel-flow
an image pixelating filter jquery plugin

#### [Demo](http://devnimlos.com/projects/PixelFlow/)
The demo uses Green Sock Tween in order to animate the pixelating effect, see the documentation for more information.

#### [Documentation](http://devnimlos.com/professional/pixelflow)
The documentation also includes a write up of the build process and logic throughout

-------
```javascript
	// Converts the image to a pixelated image at 32 pixel resolution
	var $pixel = $('img').first().PixelFlow({resolution : 32});

	// Runs animation on that same image to return to base image.
	// Notice I'm selecting the canvas that replaced the image.
	$('canvas').first().PixelFlow('simpleanimate', 0, 2000);

	// You should use the original returned reference since the
	// element is no longer an img element but a canvas
	$pixel.PixelFlow('update', {resolution : 32});

	// or you can access the instance directly by fetching it from 
	// the jQuery data on the $pixel
	var pixel = $pixel.data('plugin_PixelFlow');
	pixel.rebase();
```
