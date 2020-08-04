![PixelFlow](./pixel-flow.gif)
<br/>
[![npm](https://img.shields.io/npm/l/pixel-flow.svg?maxAge=2592000)](https://www.npmjs.com/package/pixel-flow)
[![npm](https://img.shields.io/npm/v/pixel-flow.svg?maxAge=2592000)](https://www.npmjs.com/package/pixel-flow)
[![npm](https://img.shields.io/npm/dm/pixel-flow.svg?maxAge=2592000)](https://www.npmjs.com/package/pixel-flow)
[![npm](https://img.shields.io/npm/dt/pixel-flow.svg?maxAge=2592000)](https://www.npmjs.com/package/pixel-flow)

an image pixelating JavaScript library

## [Demo](https://jamesnimlos.github.io/pixel-flow/)

The main demo uses vanilla JavaScript and presents a few images with example manipulations using the library.

There is also a [demo using the jQuery plugin](https://jamesnimlos.github.io/pixel-flow/jquery.html) and Green Sock Tween in order to animate the pixelating effect, see the original blog post for more information.

#### [Blog Post](http://devnimlos.com/professional/pixelflow)

The blog post includes a write up of the build process and thought process used for version 1. Version 2 was a full re-factor but the logic used is still the same.

---

## Usage

The library can be installed from npm

```bash
npm install --save pixel-flow
```

```javascript
let images = Array.from(document.querySelectorAll('img'))
let pixelFlows = images.map((img) => new PixelFlow(img, { resolution: 32 }))
// be aware, creating the pixelate images removes the images from the DOM

// then you can manipulate individual PixelFlow instances
// wait 5 seconds
setTimeout(() => {
  pixelFlows.forEach((pixelFlow) => {
    // animate the pixelated images back to normal over 2 seconds
    pixelFlow.simpleanimate(0, 2)
  })
}, 5000)
```

### jQuery plugin

The jQuery plugin can be installed from npm as well.

```bash
npm install --save pixel-flow jquery
```

> This library does not come with jQuery packaged, you must install separately.

```javascript
import $ from 'jquery'
import 'pixel-flow/jquery'
// Converts the image to a pixelated image at 32 pixel resolution
var $pixel = $('img').first().PixelFlow({ resolution: 32 })

// Runs animation on that same image to return to base image.
// Notice I'm selecting the canvas that replaced the image.
$('canvas').first().PixelFlow('simpleanimate', 0, 2000)

// You should use the original returned reference since the
// element is no longer an img element but a canvas
$pixel.PixelFlow('update', { resolution: 32 })

// or you can access the instance directly by fetching it from
// the jQuery data on the $pixel
var pixel = $pixel.data('plugin_PixelFlow')
pixel.rebase()
```
