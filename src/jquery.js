/*
 ** https://github.com/JamesNimlos/pixel-flow
 **
 ** Developed by
 ** - James Nimlos
 **
 ** Licensed under MIT license
 */

'use strict'
import $ from 'jquery'
import PixelFlow from './pixel-flow.js'

//set up default options
var pluginName = 'PixelFlow',
  defaults = {
    resolution: 16,
    offsetX: 0,
    offsetY: 0
  }

$.fn[pluginName] = function(options) {
  var $cvs
  this.each(function() {
    var r = $.data(this, 'plugin_' + pluginName)
    if (!r) {
      r = new PixelFlow(this, options)
      $.data(r.canvas, 'plugin_' + pluginName, r)
    } else {
      if ('undefined' === typeof o) {
        return $cvs.add(r.canvas)
      } else if ('string' !== typeof o || !r[o]) {
        void jQuery.error(
          'Method ' + o + ' does not exist on jQuery(el).' + pluginName
        )
      } else {
        r[o].apply(r, [].slice.call(a, 1))
      }
    }
    if (typeof $cvs === 'undefined') $cvs = $(r.canvas)
    else $cvs.add(r.canvas)
  })
  return $cvs
}
