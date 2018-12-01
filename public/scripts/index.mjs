import PixelFlow from '../../src/pixel-flow.js'

function domReady() {
  return new Promise(resolve => {
    if (
      document.readyState === 'interactive' ||
      document.readystate === 'completed'
    ) {
      Promise.resolve().then(resolve)
    } else {
      document.addEventListener('DOMContentLoaded', () => resolve())
    }
  })
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

function runAnimation(tick, duration) {
  duration = duration * 1000
  const start = Date.now()
  function ticker() {
    const now = Date.now()
    const completionRatio = (now - start) / duration
    if (completionRatio >= 1) {
      tick(1)
    } else {
      tick(completionRatio)
      window.requestAnimationFrame(ticker)
    }
  }
  window.requestAnimationFrame(ticker)
}

function easeOutQuad(t) {
  return t * (2 - t)
}

function easeInOutQuad(ratio) {
  return ratio < 0.5 ? 2 * ratio * ratio : -1 + (4 - 2 * ratio) * ratio
}

function runGradientAnimation(pixelFlow, options) {
  const startOffsetX = pixelFlow.width
  runAnimation(ratioComplete => {
    const offsetX = Math.round(
      startOffsetX - startOffsetX * easeOutQuad(ratioComplete)
    )
    pixelFlow.linearGradient(Object.assign({ offsetX }, options))
  }, 2)
}

// runs across to right, then back left
function runWaveAnimation(pixelFlow, [optionsLeft, optionsRight]) {
  const width = pixelFlow.width
  runAnimation(ratioComplete => {
    const offsetMultiplier = -easeInOutQuad(Math.abs(ratioComplete - 0.5) * 2)
    const offsetX = Math.round(width * offsetMultiplier)
    pixelFlow.linearGradient(Object.assign({ offsetX }, optionsLeft))
    pixelFlow.linearGradient(Object.assign({ offsetX }, optionsRight))
  }, 4)
}

!(function() {
  let pixelFlows
  var transformOptions = [
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

  function buttonListener(index) {
    return event => {
      const button = event.target
      const pixelFlow = pixelFlows[index]
      const requestedTransform = button.dataset.func

      if (requestedTransform === 'animateGradient') {
        runGradientAnimation(pixelFlow, transformOptions[index].lg)
      } else if (requestedTransform === 'animateGradient_wave') {
        runWaveAnimation(pixelFlow, transformOptions[index].wg)
      } else {
        pixelFlow[requestedTransform](
          Object.assign(
            { offsetX: 0 },
            transformOptions[index][requestedTransform] || {}
          )
        )
      }
    }
  }

  domReady()
    .then(() => {
      let images = Array.from(document.querySelectorAll('.img-wrapper img'))
      return Promise.all(images.map(waitForImage))
    })
    .then(images => {
      pixelFlows = images.map(img => new PixelFlow(img, { resolution: 32 }))

      const imageWrappers = Array.from(
        document.querySelectorAll('.img-wrapper')
      )
      for (let i = 0; i < pixelFlows.length; i++) {
        const pixelFlow = pixelFlows[i]
        const imgWrap = imageWrappers[i]
        const buttons = Array.from(imgWrap.getElementsByTagName('button'))
        buttons.forEach(b =>
          b.addEventListener('click', buttonListener(i), false)
        )
      }
    })
})()
