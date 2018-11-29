import PixelFlow from './pixel-flow.js'

function domReady() {
  return new Promise(resolve => {
    if (document.readyState === 'interactive' || document.readystate === 'completed') {
  		Promise.resolve().then(resolve)
  	} else {
  		document.addEventListener('DOMContentLoaded', () => resolve());
  	}
  })
}

domReady().then(() => {
  let images = Array.from(document.querySelectorAll('.img-wrapper img'))
  console.log('images', images)
  let pixelFlows = images.map((img, index) => new PixelFlow(img, { resolution: 32 }))
})
