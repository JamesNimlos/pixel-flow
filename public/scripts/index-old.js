import $ from 'jquery'
import '../../src/jquery'

// global variables
var funcOpts = [
  {
    linearGradient: { location: [0, 0, 0.65, 1], resolution: [32, 0] },
    drawPixels: { resolution: 16, offsetY: 6 },
    lg: { location: [-1, 0, 0.65, 1] },
    wg: [
      { location: [0.85, 0.9, 1, 1], resolution: [16, 0] },
      { location: [0.7, 0.7, 0.85, 0.85], resolution: [0, 16], rebase: false }
    ]
  },
  {
    linearGradient: { location: [0, 0.1, 0.5, 1], resolution: [32, 0] },
    drawPixels: { resolution: 8 },
    lg: { location: [-1, 0.1, 0.45, 1] },
    wg: [
      { location: [0.85, 0.9, 1, 1], resolution: [16, 0] },
      { location: [0.7, 0.7, 0.85, 0.85], resolution: [0, 16], rebase: false }
    ]
  },
  {
    linearGradient: { location: [0, 0, 0.48, 1], resolution: [32, 0] },
    drawPixels: { resolution: 6 },
    lg: { location: [-1, 0, 0.48, 1] },
    wg: [
      { location: [0.85, 0.9, 1, 1], resolution: [16, 0] },
      { location: [0.7, 0.7, 0.85, 0.85], resolution: [0, 16], rebase: false }
    ]
  },
  {
    linearGradient: { location: [0, 0.5, 0.9, 1], resolution: [0, 32] },
    drawPixels: { resolution: 32 },
    lg: { location: [0, 0.5, 0.9, 1], resolution: [0, 32] },
    wg: [
      { location: [0.85, 0.9, 1, 1], resolution: [16, 0] },
      { location: [0.7, 0.7, 0.85, 0.85], resolution: [0, 16], rebase: false }
    ]
  }
]

// window.load to wait for images
$(document).ready(function() {
  var $imgs = $('.img-wrapper img')
  Promise.all(
    $imgs.map(function(_, img) {
      return waitForImage(img)
    })
  ).then(function() {
    $imgs.PixelFlow({ resolution: 32 })

    $('.btn-wrapper button').on('click', function(ev) {
      var $btn = $(this),
        func = $btn.attr('data-func'),
        id = $btn.closest('.img-wrapper')[0].id.split('_')[1]

      if (func === 'animateGradient') {
        return startGradientAnimation.call(this, ev)
      }

      if (func === 'animateGradient_wave') {
        return startWaveGradientAnimation.call(this, ev)
      }

      $btn
        .closest('.img-wrapper')
        .find('canvas')
        .PixelFlow(func, $.extend({ offsetX: 0 }, funcOpts[id][func] || {}))
    })
  })
})

function startGradientAnimation(ev) {
  var $btn = $(this),
    id = $btn.closest('.img-wrapper')[0].id.split('_')[1],
    pixelFlow = $btn
      .closest('.img-wrapper')
      .find('canvas')
      .data('plugin_PixelFlow')

  pixelFlow.offsetX = pixelFlow.width

  TweenMax.fromTo(
    pixelFlow,
    2,
    {
      offsetX: pixelFlow.width,
      autoCSS: false
    },
    {
      offsetX: 0,
      autoCSS: false,
      onUpdate: tick,
      roundProps: 'offsetX',
      onUpdateParams: ['{self}', pixelFlow, id] // "{self}" is the tween instance
    }
  )

  function tick(tween, pF, key) {
    pF.linearGradient(funcOpts[key].lg)
  }
}

function startWaveGradientAnimation() {
  var $btn = $(this),
    id = $btn.closest('.img-wrapper')[0].id.split('_')[1],
    pixelFlow = $btn
      .closest('.img-wrapper')
      .find('canvas')
      .data('plugin_PixelFlow')

  pixelFlow.offsetX = -pixelFlow.width

  TweenMax.fromTo(
    pixelFlow,
    2,
    {
      offsetX: -pixelFlow.width,
      autoCSS: false
    },
    {
      offsetX: 0,
      autoCSS: false,
      onUpdate: tick,
      yoyo: true,
      repeat: 1,
      roundProps: 'offsetX',
      onUpdateParams: ['{self}', pixelFlow, id] // "{self}" is the tween instance
    }
  )

  function tick(tween, pF, key) {
    pF.linearGradient(funcOpts[key].wg[0])
    pF.linearGradient(funcOpts[key].wg[1])
  }
}

function waitForImage(img) {
  return new Promise(function(resolve, reject) {
    var imgObj = new Image()
    imgObj.onload = function() {
      resolve(img)
    }
    imgObj.onerror = function() {
      reject()
    }
    imgObj.src = img.src
  })
}
