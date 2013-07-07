
	
	$.fn.randomSimey = function() {
		
		var simeys = [
			"eats pizza (without mushrooms)",
			"builds websites",
			"writes jQuery plugins",
			"takes photos",
			"climbs mountains",
			"just bought a TT",
			"plays on the internet",
			"is the king of the north",
			"sik gong jat di gwong dung waa",
			"was born in Canada",
			"&hearts;s Hong Kong",
			"has flipped a dodgem",
			"makes a mean French Toast"
		];
		
		return $(this).each( function( key, element ) {
		
			var index = Math.floor( Math.random() * simeys.length );
			
			$(element).removeClass( "flipInX" ).addClass( "animated short fadeOutDown" );
			
			setTimeout( function() { $(element).html( "&hellip;" + simeys[ index ] ); }, 500 );
			setTimeout( function() { $(element).show().removeClass( "fadeOutDown short" ).addClass( "flipInX" ); }, 500 );
			
		});
	
	};
	
	
	function setUpWaypoints() {
		
		$('.flickr-wrapper').waypoint({
			
			offset: 100,
			triggerOnce: true,
			
			handler: function(direction) {
				loadFlickr(15);
			}
			
		});	
	
	}
	
	
	$(function() {
		
		setTimeout( function() {
			$('.simey-is-doing').randomSimey();
			$('.body').fadeIn( 2000 , function() {
				setUpWaypoints();	
			});
		}, 3000 );
		
		$('.simey-is-doing').on('click' , function() {
			$('.simey-is-doing').randomSimey();
		});
		
	});
	
	
	
	
	
	
	
	$(function() {
		
		if( Modernizr.cssanimations ) {
		
			// start the animation for entering the site, 
			// and then allow for "hover" effect after the "e" has finished animating.
			
			var $simeyHeader = 
				$('.simey-header')
					.addClass('enter')
					.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', '.letter-i', function(e) {
						$simeyHeader.find('[class^=letter-]').css('opacity',1);
						$simeyHeader.removeClass('enter')
					});
					
			// variable used for timer.
			var t;
			
			// for every letter in the header,
			// start the "reveal" animation when clicked.
			$simeyHeader
				.find('[class^=letter-]')
				.on('click', function(e) { 
					
					if( !$simeyHeader.hasClass('enter') ) {
						
						$simeyHeader.addClass( 'hover' ); 
						
						clearTimeout(t);
						t = window.setTimeout( function() {
							$simeyHeader.removeClass( 'hover' );
						}, 700 ); 
						
					}
					
					e.preventDefault();
				
				});
				
		} else {
		
			$('.simey-header [class^=letter-]').css('opacity',1).hide().fadeIn();
			
		}
		
	});
	
	
	
	
	
	
	function loadFlickr( imageCount ) {
		
		// store some variables used for pulling in flickr.
		var positionTimer;
		var imageCount = imageCount || 12;

		var myapikey = 		"dd8e97ef9c1283583dcaf92b9ba80170";
		var photoset = 		"72157634483069405";
		var myset = 		"http://api.flickr.com/services/rest/?format=json&jsoncallback=?&method=flickr.photosets.getPhotos&per_page="+imageCount+"&api_key="+myapikey+"&photoset_id="+photoset;
		
		var $feed = 		$('.flickr-feed');
		var $inner = 		$('.flickr-feed-inner');
		var $overlay = 		$('.flickr-overlay').hide();
		var $mask = 		$('.flickr-mask').hide();
		var $spinner = 		$('.flickr-preloader').hide();
		var $close = 		$('.flickr-close');
		
		
		
		$spinner.fadeIn();
		
		$.getJSON( myset , function(set) {
			
			$.each( set.photoset.photo.reverse(), function(k,v) {
			
				 var getimage = "http://api.flickr.com/services/rest/?format=json&jsoncallback=?&method=flickr.photos.getInfo&api_key="+myapikey+"&photo_id="+v.id;
				 
				 $.getJSON( getimage , function(result) {
					
					var ismall = 'http://farm'+result.photo.farm+'.staticflickr.com/'+result.photo.server+'/'+result.photo.id+'_'+result.photo.secret+'_q.jpg';
					var ilarge = 'http://farm'+result.photo.farm+'.staticflickr.com/'+result.photo.server+'/'+result.photo.id+'_'+result.photo.secret+'_z.jpg';
					var ihuge = 'http://farm'+result.photo.farm+'.staticflickr.com/'+result.photo.server+'/'+result.photo.id+'_'+result.photo.secret+'_h.jpg';
					
					var $iwrapper = $('<div class="image-wrapper" />');
					var $ilink = $('<a href="#"/>');
					var $iimg = $('<img src="'+ ismall +'"/>');
					
					$iwrapper.append( $ilink.append( $iimg ) );
				 	$inner.append( $iwrapper );
					
					$iimg.on('load', function() {
						$iwrapper.addClass('animated flipInX');
						setTimeout( function() {
							$iimg.addClass('fade')
						}, 1000 );
					});
					

					$ilink.on('click', function(e) {
						
						if( !$(this).closest( $inner ).hasClass('dragging') ) { 
							
							$overlay.hide();
							$spinner.fadeIn();
													
							var $overlayimg = 
								$('<img src="'+ ilarge +'"/>')
								.css({ left: "-9999px", top: "-9999px", display: "block", position: "absolute" })
								.appendTo( $overlay.find('.flickr-overlay-image').empty() )
								.load( function(e) {
									
									var $this = $(this);
									
									clearTimeout( positionTimer );
									positionTimer = setTimeout( function() {
										
										$this.css({ left: "", top: "", display: "block", position: "" });
										$overlay.css({ left: "-9999px", top: "-9999px", display: "block", position: "absolute" });
										$overlay.css({ "margin-left": "-"+($this.width()*0.5 +30)+"px", "margin-top": "-"+($this.height()*0.5 +30)+"px" });
										$overlay.css({ left: "", top: "", display: "", position: "" }).fadeIn();
										$mask.fadeTo( 300, 0.3 );
										$spinner.fadeOut();
										
									}, 1500 );
									
								});
							
						}
						
						e.preventDefault();
						
					});

				});
			
			});
			
			$spinner.fadeOut();
		
		});
				
		$close.add( $mask ).on( 'click' , function(e) {
			$overlay.add( $mask ).fadeOut(); 
			e.preventDefault();
		});
		
	};
	
	
	
	
	$(function() {
		
		
		
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	