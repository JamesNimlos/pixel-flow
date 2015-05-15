// global variables
var funcOpts = [
		{
			'linearGradient' : {'location' : [0,0,.65,1], 'resolution' : [32,0]},
			'drawPixels' : {'resolution' : 16, 'offsetY' : 6},
			'lg' : {'location' : [-1,0,.65,1]},
			'wg' : [
				{'location' : [.85,.9,1,1], 'resolution' : [16,0]},
				{'location' : [.7,.7,.85,.85], 'resolution' : [0,16], 'rebase' : false}
			]
		},
		{
			'linearGradient' : {'location' : [0,.1,.5,1], 'resolution' : [32,0]},
			'drawPixels' : {'resolution' : 8},
			'lg' : {'location' : [-1,.1,.45,1]},
			'wg' : [
				{'location' : [.85,.9,1,1], 'resolution' : [16,0]},
				{'location' : [.7,.7,.85,.85], 'resolution' : [0,16], 'rebase' : false}
			]
		},
		{
			'linearGradient' : {'location' : [0,0,.48,1], 'resolution' : [32,0]},
			'drawPixels' : {'resolution' : 6},
			'lg' : {'location' : [-1,0,.48,1]},
			'wg' : [
				{'location' : [.85,.9,1,1], 'resolution' : [16,0]},
				{'location' : [.7,.7,.85,.85], 'resolution' : [0,16], 'rebase' : false}
			]
		},
		{
			'linearGradient' : {'location' : [0,.5,.9,1],'resolution' : [0,32]},
			'lg' : {'location' : [0,.5,.9,1], 'resolution' : [0,32]},
			'wg' : [
				{'location' : [.85,.9,1,1], 'resolution' : [16,0]},
				{'location' : [.7,.7,.85,.85], 'resolution' : [0,16], 'rebase' : false}
			]
		}
	];

// window.load to wait for images
$(window).load(function(){

	var $imgs = $('.img-wrapper img')
	  , resolution = 32
	  , delay = 200;

	var $cvs = $imgs.PixelFlow({'resolution': 32});

	$('.btn-wrapper button').on('click', function(ev){
		var $btn = $(this)
			, func = $btn.attr('data-func')
			, id = $btn.closest('.img-wrapper')[0].id.split('_')[1];

		if(func === 'animateGradient') return startGradientAnimation.call(this, ev);
		if(func === 'animateGradient_wave') return startWaveGradientAnimation.call(this, ev);
		$btn.closest('.img-wrapper').find('canvas').PixelFlow(func, funcOpts[id][func] || {} );
	});

});

function startGradientAnimation(ev) {
	var $btn = $(this)
		, id = $btn.closest('.img-wrapper')[0].id.split('_')[1]
		, pixelFlow = $btn.closest('.img-wrapper').find('canvas').data('plugin_PixelFlow');

	pixelFlow.offsetX = pixelFlow.width;

	TweenMax.fromTo(pixelFlow, 2,
    { 
    	'offsetX': pixelFlow.width, 
      'autoCSS': false
   	}, 
   	{ 
     	'offsetX': 0, 
     	'autoCSS': false, 
     	'onUpdate': tick, 
     	'roundProps' : 'offsetX',
     	'onUpdateParams': ["{self}", pixelFlow, id] // "{self}" is the tween instance
   	}
	);

	function tick(tween, pF, key) {
		pF.linearGradient(funcOpts[key].lg);
	};
};

function startWaveGradientAnimation(){
	var $btn = $(this)
		, id = $btn.closest('.img-wrapper')[0].id.split('_')[1]
		, pixelFlow = $btn.closest('.img-wrapper').find('canvas').data('plugin_PixelFlow');

	pixelFlow.offsetX = -pixelFlow.width;

	TweenMax.fromTo(pixelFlow, 2,
    { 
    	'offsetX': -pixelFlow.width, 
      'autoCSS': false
   	}, 
   	{ 
     	'offsetX': 0, 
     	'autoCSS': false, 
     	'onUpdate': tick,
      'yoyo'   : true,
      'repeat' : 1, 
     	'roundProps' : 'offsetX',
     	'onUpdateParams': ["{self}", pixelFlow, id] // "{self}" is the tween instance
   	}
	);

	function tick(tween, pF, key) {
		pF.linearGradient(funcOpts[key].wg[0]);
		pF.linearGradient(funcOpts[key].wg[1]);

	}
}