// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../src/pixel-flow.js":[function(require,module,exports) {
/*
 ** https://github.com/JamesNimlos/pixel-flow
 **
 ** Developed by
 ** - James Nimlos
 **
 ** Licensed under MIT license
 */
'use strict'; // utility functions

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function evenNum(num) {
  if (typeof num !== 'number') return NaN;
  return ~~num - ~~num % 2;
}

function convPerc(percentage) {
  return Number(percentage.replace(/[\s%]/g, '')) / 100;
}

var defaultOptions = {
  resolution: 16,
  offsetX: 0,
  offsetY: 0
  /**
   * @param {HTMLImageElement} img
   * @param {Object} [options]
   */

};

function PixelFlow(img, options) {
  if (!(img instanceof HTMLImageElement)) return window.console && console.error('The provided element is not an HTMLImageElement.');
  this.options = Object.assign({}, defaultOptions, options);
  this.img = img;

  try {
    this.setUpCanvas(img);
    this.drawPixels(); // replace image with canvas

    img.parentNode.replaceChild(this.canvas, img);
  } catch (err) {
    window.console && console.error('PixelFlow could not not be created.');
    window.console && console.error(err);
  }
}
/**
 * Factory function
 * @param  {HTMLImageElement} img
 * @param  {Object} opts
 * @return {PixelFlow}
 */


PixelFlow.build = function (img, opts) {
  return new PixelFlow(img, opts);
};
/**
 * Draws a full column on the canvas
 * @param  {number} left - pixel location of left side of column
 * @param  {number} colWidth - width of the column being drawn in pixels
 * @param  {number} [pixHeight] - height of each 'pixel' being drawn
 * @return {void}
 */


PixelFlow.prototype.drawCol = function (left, colWidth, pixHeight) {
  if (colWidth <= 2 || pixHeight <= 2) return;
  if (left + colWidth < 0) return; //local variables

  var w = this.width;
  var h = this.height;
  var options = this.options;
  var res = colWidth;
  var resH = pixHeight || res;
  var offsetX = options.offestX;
  var offsetY = options.offsetY;
  var rows = h / resH + 1;
  var row;
  var x = left || 0;
  var y;
  var pixelY;
  var pixelX;
  var pixelIndex; // skip if outside canvas

  if (x + res <= 0 || x >= w) return; // normalize x so shapes around edges get color

  pixelX = Math.max(Math.min(x, w - 1), 0);

  for (row = 0; row < rows; row++) {
    y = (row - 0.5) * resH + offsetY; // normalize y so shapes around edges get color

    pixelY = Math.max(Math.min(y, h - 1), 0);
    pixelIndex = (pixelX + pixelY * w) * 4;
    this.drawPixel(pixelIndex, x, y, res, resH);
  }
};
/**
 * Draws an individual block or 'pixel' on the canvas
 * @param  {number} pixelIndex - index of the pixel from the image data
 * @param  {number} x - horizontal position of the 'pixel' from left edge being 0
 * @param  {number} y - vertical position of the top left corner of the 'pixel'
 * @param  {number} w - width of the 'pixel'
 * @param  {number} h - height of the 'pixel'
 * @return {PixelFlow}
 */


PixelFlow.prototype.drawPixel = function (pixelIndex, x, y, w, h) {
  var ctx = this.ctx,
      imgData = this.imgData,
      red = imgData[pixelIndex],
      green = imgData[pixelIndex + 1],
      blue = imgData[pixelIndex + 2],
      alpha = 1,
      pixelAlpha = alpha * (imgData[pixelIndex + 3] / 255); // sets the color using pixelIndex reference for the 'pixel'

  ctx.fillStyle = 'rgba(' + red + ',' + green + ',' + blue + ',' + pixelAlpha + ')'; // draws pixel

  ctx.fillRect(x, y, w, h);
  return this;
};
/**
 * Draws the entire pixelation using the current settings on the
 * PixelFlow instance. 'Pixel' size is constant throughout.
 * @return {PixelFlow}
 */


PixelFlow.prototype.drawPixels = function (options) {
  //local variables
  options = Object.assign(this.options, options);
  var w = this.width,
      h = this.height,
      ctx = this.ctx,
      imgData = this.imgData,
      res = options.resolution,
      size = options.size || res,
      alpha = 1,
      offsetX = options.offsetX,
      offsetY = options.offsetY,
      cols = w / res + 1,
      rows = h / res + 1,
      halfSize = size / 2;
  if (res < 4) return this.rebase();
  var row, col, x, y, pixelY, pixelX, pixelIndex, red, green, blue, pixelAlpha;

  for (row = 0; row < rows; row++) {
    y = (row - 0.5) * res + offsetY; // normalize y so shapes around edges get color

    pixelY = Math.max(Math.min(y, h - 1), 0);

    for (col = 0; col < cols; col++) {
      x = (col - 0.5) * res + offsetX; // normalize y so shapes around edges get color

      pixelX = Math.max(Math.min(x, w - 1), 0);
      pixelIndex = (pixelX + pixelY * w) * 4;
      red = imgData[pixelIndex + 0];
      green = imgData[pixelIndex + 1];
      blue = imgData[pixelIndex + 2];
      pixelAlpha = alpha * (imgData[pixelIndex + 3] / 255);
      ctx.fillStyle = 'rgba(' + red + ',' + green + ',' + blue + ',' + pixelAlpha + ')'; // square

      ctx.fillRect(x - halfSize, y - halfSize, size, size);
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
 * @return {PixelFlow}
 */


PixelFlow.prototype.linearGradient = function (options) {
  // TODO: create a better default system.
  options = Object.assign({}, this.options, {
    location: [0, 0.25, 0.75, 1],
    resolution: [32, 0],
    rebase: true
  }, options);
  if (options.rebase) this.rebase(); // needs to wait until after a rebase

  this.options = options;

  if (!Array.isArray(options.location) || !Array.isArray(options.resolution) || options.location.length < 4 || options.resolution.length < 2) {
    window.console && console.error('You have not provided the necessary options for a linear gradient.');
    return this;
  }

  var startRes = evenNum(options.resolution[0]),
      endRes = evenNum(options.resolution[1]),
      startPoint = options.location[0] || 0,
      gradStart = options.location[1] || 0.25,
      gradEnd = options.location[2] || 0.75,
      endPoint = options.location[3] || 1,
      offsetX = options.offsetX || this.offsetX || 0;
  if (typeof startPoint === 'string') startPoint = convPerc(startPoint);
  if (typeof gradStart === 'string') gradStart = convPerc(gradStart);
  if (typeof gradEnd === 'string') gradEnd = convPerc(gradEnd);
  if (typeof endPoint === 'string') endPoint = convPerc(endPoint); // calculate cols

  var w = this.width; // points to pixels

  startPoint *= w;
  gradStart *= w;
  gradEnd *= w;
  endPoint *= w;
  var cols = [];
  if (startRes > 0) cols.push(evenNum(startPoint)); // modify start points for best spacing
  // gradStart -= (gradStart - startPoint) % startRes;
  // gradEnd += endRes - (( endPoint - gradEnd ) % (endRes || 1));
  // TODO: change this to a factory which could return an addColRange function
  // using one of the different types between linear, exponential, bezier

  function addColRange(arr, leftStart, startWidth, endWidth, rightEnd) {
    if (rightEnd < leftStart) return;

    if (startWidth === endWidth) {
      if (startWidth === 0) return;
      var place = leftStart;

      while (place <= rightEnd) {
        place += startWidth;
        cols.push(evenNum(place)); // sub even pixels negatively affects presentation
      }
    } else {
      var Rl = startWidth || 4; // in case resolution is zero

      var Rs = endWidth || 4;
      var t = rightEnd - leftStart; // var mx = ( t / Rl );
      // var mi = ( t / Rs );
      // var mc = Math.floor( ( mx + mi ) / 2 );
      // var s = 2 * ( t - ( mc * Rs ) ) / ( mc * ( mc + 1 ) );

      var place = leftStart;
      var cWidth = startWidth;
      var exp;

      do {
        // linear regression relationship but could be changed
        // TODO: bezier curve regression
        exp = Rl - (Rl - Rs) * ((place - leftStart) / t);
        cWidth = exp;
        place += evenNum(cWidth);
        cols.push(evenNum(place));
      } while (place <= rightEnd && cWidth >= 2);
    }
  } //calc cols from gradStart to startPoint


  addColRange(cols, startPoint, startRes, startRes, gradStart);
  addColRange(cols, cols[cols.length - 1] || gradStart, startRes, endRes, gradEnd);
  addColRange(cols, cols[cols.length - 1], endRes, endRes, endPoint);

  for (var c = 1; c < cols.length; c++) {
    this.drawCol(cols[c - 1] + offsetX, cols[c] - cols[c - 1]);
  }

  return this;
};
/**
 * Returns the canvas to display the original image
 * @return {PixelFlow}
 */


PixelFlow.prototype.rebase = function () {
  this.options = {
    resolution: 0,
    offsetX: 0,
    offsetY: 0
  };
  this.ctx.drawImage(this.img, 0, 0);
  return this;
};
/**
 * creates the canvas element and copies the image onto it
 * also creates a back-up canvas
 * @param {HTMLImageElement} img
 * @return {PixelFlow}
 */


PixelFlow.prototype.setUpCanvas = function (img) {
  // create canvas
  var canvas = this.canvas = document.createElement('canvas');
  this.ctx = canvas.getContext('2d'); //make virtual duplicate for safe keeping of picture data

  this._copyCanvas = document.createElement('canvas');
  this._copyCtx = this._copyCanvas.getContext('2d'); // copy basic attributes from img to canvas

  canvas.className = img.className;
  canvas.id = img.id;
  var w = this.width = this.canvas.width = this._copyCanvas.width = img.naturalWidth % 2 === 0 ? img.naturalWidth : img.naturalWidth - 1;
  var h = this.height = this.canvas.height = this._copyCanvas.height = img.naturalHeight % 2 === 0 ? img.naturalHeight : img.naturalHeight - 1; // draw on both canvases

  this.ctx.drawImage(img, 0, 0);

  this._copyCtx.drawImage(img, 0, 0);

  this.imgData = this._copyCtx.getImageData(0, 0, w, h).data;
  this.ctx.clearRect(0, 0, w, h);
  return this;
};
/**
 * @param  {number} endResolution - resolution to stop the animation at
 * @param  {number} duration - length of the animation
 * @return {PixelFlow}
 */


PixelFlow.prototype.simpleanimate = function (endResolution, duration) {
  var er = evenNum(endResolution); // if end resolution is the same as the start then exit

  if (this.options.resolution === er) return;
  var startRes = this.options.resolution;
  var res = startRes;
  var startTime = Date.now();
  var elapsed = 0;
  var dur = duration;

  var PixelFlowAnimationLoop = function () {
    var time = Date.now();
    res = startRes + (er - startRes) * ((time - startTime) / duration);
    res = evenNum(res);

    if (res >= 2) {
      // since we only run for even numbers this happens
      // during long animations
      if (this.options.resolution !== res) {
        this.update({
          resolution: evenNum(res)
        });
      }
    } else {
      this.rebase({});
    }

    if (er > startRes && res < er || er < startRes && res > er) {
      window.requestAnimationFrame(PixelFlowAnimationLoop);
    }
  }.bind(this);

  window.requestAnimationFrame(PixelFlowAnimationLoop);
  return this;
};
/**
 * updates the canvas with the new options for resolution
 * @param  {Object} options - options to update the canvas with
 * @return {PixelFlow}
 */


PixelFlow.prototype.update = function (options) {
  Object.assign(this.options, options);
  this.options.resolution = evenNum(this.options.resolution);
  this.drawPixels();
  return this;
};

var _default = PixelFlow;
exports.default = _default;
},{}],"scripts/index.mjs":[function(require,module,exports) {
"use strict";

var _pixelFlow = _interopRequireDefault(require("../../src/pixel-flow.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function domReady() {
  return new Promise(function (resolve) {
    if (document.readyState === 'interactive' || document.readystate === 'completed') {
      Promise.resolve().then(resolve);
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        return resolve();
      });
    }
  });
}

function waitForImage(img) {
  return new Promise(function (resolve, reject) {
    var imgObj = new Image();

    imgObj.onload = function () {
      resolve(img);
    };

    imgObj.onerror = function () {
      reject();
    };

    imgObj.src = img.src;
  });
}

function runAnimation(tick, duration) {
  duration = duration * 1000;
  var start = Date.now();

  function ticker() {
    var now = Date.now();
    var completionRatio = (now - start) / duration;

    if (completionRatio >= 1) {
      tick(1);
    } else {
      tick(completionRatio);
      window.requestAnimationFrame(ticker);
    }
  }

  window.requestAnimationFrame(ticker);
}

function easeOutQuad(t) {
  return t * (2 - t);
}

function easeInOutQuad(ratio) {
  return ratio < 0.5 ? 2 * ratio * ratio : -1 + (4 - 2 * ratio) * ratio;
}

function runGradientAnimation(pixelFlow, options) {
  var startOffsetX = pixelFlow.width;
  runAnimation(function (ratioComplete) {
    var offsetX = Math.round(startOffsetX - startOffsetX * easeOutQuad(ratioComplete));
    pixelFlow.linearGradient(Object.assign({
      offsetX: offsetX
    }, options));
  }, 2);
} // runs across to right, then back left


function runWaveAnimation(pixelFlow, _ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      optionsLeft = _ref2[0],
      optionsRight = _ref2[1];

  var width = pixelFlow.width;
  runAnimation(function (ratioComplete) {
    var offsetMultiplier = -easeInOutQuad(Math.abs(ratioComplete - 0.5) * 2);
    var offsetX = Math.round(width * offsetMultiplier);
    pixelFlow.linearGradient(Object.assign({
      offsetX: offsetX
    }, optionsLeft));
    pixelFlow.linearGradient(Object.assign({
      offsetX: offsetX
    }, optionsRight));
  }, 4);
}

!function () {
  var pixelFlows;
  var transformOptions = [{
    linearGradient: {
      location: [0, 0, 0.65, 1],
      resolution: [32, 0]
    },
    drawPixels: {
      resolution: 16,
      offsetY: 6
    },
    lg: {
      location: [-1, 0, 0.65, 1]
    },
    wg: [{
      location: [0.85, 0.9, 1, 1],
      resolution: [16, 0]
    }, {
      location: [0.7, 0.7, 0.85, 0.85],
      resolution: [0, 16],
      rebase: false
    }]
  }, {
    linearGradient: {
      location: [0, 0.1, 0.5, 1],
      resolution: [32, 0]
    },
    drawPixels: {
      resolution: 8
    },
    lg: {
      location: [-1, 0.1, 0.45, 1]
    },
    wg: [{
      location: [0.85, 0.9, 1, 1],
      resolution: [16, 0]
    }, {
      location: [0.7, 0.7, 0.85, 0.85],
      resolution: [0, 16],
      rebase: false
    }]
  }, {
    linearGradient: {
      location: [0, 0, 0.48, 1],
      resolution: [32, 0]
    },
    drawPixels: {
      resolution: 6
    },
    lg: {
      location: [-1, 0, 0.48, 1]
    },
    wg: [{
      location: [0.85, 0.9, 1, 1],
      resolution: [16, 0]
    }, {
      location: [0.7, 0.7, 0.85, 0.85],
      resolution: [0, 16],
      rebase: false
    }]
  }, {
    linearGradient: {
      location: [0, 0.5, 0.9, 1],
      resolution: [0, 32]
    },
    drawPixels: {
      resolution: 32
    },
    lg: {
      location: [0, 0.5, 0.9, 1],
      resolution: [0, 32]
    },
    wg: [{
      location: [0.85, 0.9, 1, 1],
      resolution: [16, 0]
    }, {
      location: [0.7, 0.7, 0.85, 0.85],
      resolution: [0, 16],
      rebase: false
    }]
  }];

  function buttonListener(index) {
    return function (event) {
      var button = event.target;
      var pixelFlow = pixelFlows[index];
      var requestedTransform = button.dataset.func;

      if (requestedTransform === 'animateGradient') {
        runGradientAnimation(pixelFlow, transformOptions[index].lg);
      } else if (requestedTransform === 'animateGradient_wave') {
        runWaveAnimation(pixelFlow, transformOptions[index].wg);
      } else {
        pixelFlow[requestedTransform](Object.assign({
          offsetX: 0
        }, transformOptions[index][requestedTransform] || {}));
      }
    };
  }

  domReady().then(function () {
    var images = Array.from(document.querySelectorAll('.img-wrapper img'));
    return Promise.all(images.map(waitForImage));
  }).then(function (images) {
    pixelFlows = images.map(function (img) {
      return new _pixelFlow.default(img, {
        resolution: 32
      });
    });
    var imageWrappers = Array.from(document.querySelectorAll('.img-wrapper'));

    var _loop = function _loop(i) {
      var pixelFlow = pixelFlows[i];
      var imgWrap = imageWrappers[i];
      var buttons = Array.from(imgWrap.getElementsByTagName('button'));
      buttons.forEach(function (b) {
        return b.addEventListener('click', buttonListener(i), false);
      });
    };

    for (var i = 0; i < pixelFlows.length; i++) {
      _loop(i);
    }
  });
}();
},{"../../src/pixel-flow.js":"../src/pixel-flow.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62353" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","scripts/index.mjs"], null)
//# sourceMappingURL=/pixel-flow/scripts.728e2e8f.map