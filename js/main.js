	
	
	var mobileWidth = 800;
	var codepenWidth = 1000;
	var photoCount = ( $(window).width() > mobileWidth ) ? 15 : 6;
	var penCount = ( $(window).width() > codepenWidth ) ? 12 : 5;
	
	$(function() {
		
		
		
		
		
		// ================================================================ //
		

		function hashy() {
			
			var h = window.location.hash.replace('#','');
			
			if( h === "" ) {
								
				viewContent();
				$('.simey-is-doing').randomSimey();
				
			} else {
				
				if( h === "cv" || h === "resume" ) {
				
					$('.simey-is-doing').randomSimey(true);
					viewResume();
					searchy();
				
				} else {
					
					viewContent();
					
				}
					
			}
			
		};
		
		function searchy() {
		
			var s = window.location.search.replace('?who=',"").replace('+',' ');
			if( s !== "" ) {
				
				var $wrapper = $('<div class="simey-container"/>');
				var $text = $('<h3>Congratulations, '+s+'!!.. Looks like Simey has chosen to share his CV with you! Please enjoy!</h3>');
				
				$wrapper.append( $text ).prependTo( $('.body') );	
				
			}
				
		}
		
		$(window).on('hashchange', function() {
			hashy();
		});
		
		$('.simey-is-doing').on('click' , function() {
			$('.simey-is-doing').randomSimey();
		});

		
		hashy();
		headerAnimation();
		
		
	});
	
	
	
	
	
	
	
	
	function viewResume() {
		
		var resume = $.get('projects/resume.html');
		resume.done( function( response ) {
			
			$('.body')
				.find('#about, #flickr, #github, #codepen')
				.hide()
				.end()
				.append( response );
					
		});
		
	}
		
	function viewContent() {
		
		$('.body')
			.find('#cv, #statement')
			.remove()
			.end()
			.find('#about, #flickr, #github, #codepen')
			.filter(':hidden')
			.show();
		
		setUpWaypoints();
			
	}
		
	$.fn.randomSimey = function( cv ) {
		
		var simeys = [
			"eats pizza (without mushrooms)",
			"builds websites",
			"writes jQuery plugins",
			"improves the internet",
			"climbs mountains",
			"plays on the internet",
			"is the hand of the king",
			"sik gong siu siu gwong dung wa",
			"was born in Canada",
			"&hearts;'s animals",
			"has flipped a dodgem",
			"makes a mean French Toast",
			"takes photographs",
			"messes with photoshop",
			"drinks as much bubble tea as possible"
		];
		
		return $(this).each( function( key, element ) {
		
			var index = Math.floor( Math.random() * simeys.length );
			
			if( window.lastSimey === index ) {
				if( window.lastSimey >= simeys.length ) {
					index = 0;
				} else {
					index++;
				}
			}
			
			var text = simeys[ index ];
			if( cv ) { text = "Simon Goellner"; }
			
			$(element).removeClass( "flipInX" ).addClass( "animated short fadeOutDown" );
			
			setTimeout( function() { $(element).html( text ); }, 500 );
			setTimeout( function() { $(element).show().removeClass( "fadeOutDown short" ).addClass( "flipInX" ); }, 500 );
			
			window.lastSimey = index;
			
		});
	
	};
	
	function setUpWaypoints() {
		
		$('.flickr-wrapper').waypoint({
			
			offset: 500,
			triggerOnce: true,
			
			handler: function(direction) {
				loadFlickr( photoCount );
			}
			
		});	


		$('.github-wrapper').waypoint({

			offset: 500,
			triggerOnce: true,

			handler: function(direction) {

				$('.codepen-loader').fadeIn();
				$('#penlist').getPens("simeydotme", { minHearts: 0, maxPens: penCount, orderBy: null });

			}

		});
	
	}
	
	function headerAnimation() {
		
		// make the header the height of the window
		$('.simey-header')
			.height( $(window).height() );
				
			
		
		if( Modernizr.cssanimations ) {
					
			scrolled = false;
			
			var $simeyHeader = $('.simey-header');
			$simeyHeader.find('[class^=letter-]').css('opacity',0);
			
			if( $.cookie('visited') === undefined && window.location.hash === "" ) {
			
				$simeyHeader
					.addClass('enter')
					.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', '.letter-i', function(e) {
						
						// make sure the letters don't fade out after animation
						$simeyHeader.find('[class^=letter-]').css('opacity',1);
						$simeyHeader.removeClass('enter');
						
						if( !scrolled ) {
							
							// Assign the HTML, Body as a variable...
							var $viewport = $('html, body');
							
							// Some event to trigger the scroll animation...
							$viewport.animate({ scrollTop: $(window).height() }, 1700, "easeOutQuint" );
							
							// Stop the animation if the user scrolls. Defaults on .stop() should be fine
							$viewport.bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e){
								if ( e.which > 0 || e.type === "mousedown" || e.type === "mousewheel"){
									 // This identifies the scroll as a user action, stops the animation, then unbinds the event straight after (optional)
									 $viewport.stop().unbind('scroll mousedown DOMMouseScroll mousewheel keyup'); 
								}
							});
							
							scrolled = true;
							
						}
												
					});
						
			} else {
				
				$simeyHeader.find('[class^=letter-]').css('opacity',1).hide().fadeIn(2000);
				
			}
			
			
			// resets cookie after 10 minutes
			var expires = new Date();
			expires.setMinutes(expires.getMinutes() + 10);
			$.cookie('visited', 'true', { expires: expires, path: '/' });

			
			
					
			// variable used for timer.
			var t;
			var paragon = false;
			
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
					
					
					$.removeCookie('visited', { path: '/' });
					if( !paragon ) {
						e.preventDefault();
						paragon = true;			
					}
				
				});
				
		} else {
		
			$('.simey-header [class^=letter-]').css('opacity',1).hide().fadeIn();
			
		}
		
	};
	
	function loadFlickr( imageCount ) {
		
		// store some variables used for pulling in flickr.
		var imageCount = imageCount || 12;

		var myapikey = 		"dd8e97ef9c1283583dcaf92b9ba80170";
		var photoset = 		"72157634483069405";
		var myset = 		"http://api.flickr.com/services/rest/?format=json&jsoncallback=?&method=flickr.photosets.getPhotos&api_key="+myapikey+"&photoset_id="+photoset;
		
		var $spinner = 		$('.flickr-preloader').hide();
		var $template = 	$('#flickr-feed');
		var cache = [];
		
		
		$spinner.fadeIn();
		
		$.getJSON( myset , function(set) {
			
			var photos = set.photoset.photo.reverse().slice(0, imageCount);
			var allPhotos = set.photoset.photo;
			
			$.each( photos, function(k,v) {
			
				 var getimage = "http://api.flickr.com/services/rest/?format=json&jsoncallback=?&method=flickr.photos.getInfo&api_key="+myapikey+"&photo_id="+v.id;
				 
				 $.getJSON( getimage , function(result) {
					
					var ibgi = 'http://farm'+result.photo.farm+'.staticflickr.com/'+result.photo.server+'/'+result.photo.id+'_'+result.photo.secret+'_n.jpg';
					var ilnk = 'http://farm'+result.photo.farm+'.staticflickr.com/'+result.photo.server+'/'+result.photo.id+'_'+result.photo.secret+'_b.jpg';
					
					var temp = 
						$template
							.text()
							.replace("{{url}}", ilnk )
							.replace("{{image}}", ibgi )
							.replace("{{id}}", result.photo.id );

					$template.before( temp );					

				});
			
			});

			function replaceRandomImage() {
				
				var isnew = false;
				$('.flickr-image-wrapper').removeClass("flip");

				while( !isnew ) {

					var rand = Math.floor(Math.random()*allPhotos.length);
					var id = allPhotos[rand]["id"];
					var ibgi = 'http://farm'+allPhotos[rand].farm+'.staticflickr.com/'+allPhotos[rand].server+'/'+allPhotos[rand].id+'_'+allPhotos[rand].secret+'_n.jpg';
					var ilnk = 'http://farm'+allPhotos[rand].farm+'.staticflickr.com/'+allPhotos[rand].server+'/'+allPhotos[rand].id+'_'+allPhotos[rand].secret+'_b.jpg';

					if( $('.flickr-image-wrapper[data-id='+id+']').length < 1) {
						isnew = true;
					}

					if( isnew ) {

						var randItem = Math.floor(Math.random()*$('.flickr-image-wrapper').length);
						
						$('.flickr-image-wrapper')
							.eq(randItem)
							.attr("data-id",id)
							.attr("href",ilnk)
							.addClass("animated short flip")
							.find(".flickr-image")
								.css("background-image","url("+ibgi+")");

					}

				}

			}


			var interval = 4000;
			setInterval( function() {
				replaceRandomImage();
			}, interval );
			
			$spinner.fadeOut();
		
		});
		
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	