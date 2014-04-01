	


	var APP = {};

	// figure out how many items we would like for the AJAX
	// requests based on window size.

	APP.mobileWidth = 800;
	APP.codepenWidth = 1000;
	APP.isDesktop = $(window).width() > APP.mobileWidth;

	APP.photoCount = ( APP.isDesktop ) ? 15 : 6;
	APP.penCount = ( APP.isDesktop ) ? 12 : 4;
			
	APP.$simeyIsDoing = $(".simey-is-doing");
	APP.$simeyHeader = $(".simey-header");
	APP.$simeyLetters = APP.$simeyHeader.find('[class^=letter-]');
	APP.$spinner = $('.spinner').hide();
		
// ================================================================ //

	$(function() {
		
		// trigger teh route function if hash changes.

		$(window).on('hashchange', function() {
			APP.route();
		});
		
		// when we click on teh simey slogan tagline,
		// refresh it with a new one.

		APP.$simeyIsDoing.on('click' , function() {
			APP.$simeyIsDoing.randomSimey();
		});

		// show spidder on ajax start.

		$(document).ajaxStart( function() {

			APP.$spinner.fadeIn();

		});

		// hide spidder on ajax stop.

		$(document).ajaxStop( function() {

			APP.$spinner.fadeOut();

		});

		// trigger routing.
		// animate the header "SIMEY".
		
		APP.route();
		APP.headerAnimation();
		
		
	});
		
// ================================================================ //
	
	// route the user to the correct area,
	// and show the relevant title text.

	APP.route = function() {
		
		var h = window.location.hash.replace('#','');
		
		if( h === "" || ( h !== "cv" && h !== "resume" )) {
							
			APP.$simeyIsDoing.randomSimey();
			APP.viewContent();
			
		} else {
							
			APP.$simeyIsDoing.randomSimey(true);
			APP.viewResume();

		}
		
	};

// ================================================================ //

	// load the resume in via ajax,
	// I do this because I would prefer it not to be
	// indexable on my home-page.
	// also saves on initial load... albeit marginally.
	
	APP.viewResume = function() {
		
		var resume = $.get('projects/resume.html');
		resume.done( function( response ) {
			
			$('.body')
				.find('#about, #flickr, #github, #codepen')
				.hide()
				.end()
				.append( response );
					
		});
		
	};

	// need to remove the CV if it exists
	// from teh DOM, and show the actual page.

	APP.viewContent = function() {
		
		$('.body')
			.find('#cv, #statement')
			.remove()
			.end()
			.find('#about, #flickr, #github, #codepen')
			.filter(':hidden')
			.show();
		
		APP.setUpWaypoints();
			
	}

// ================================================================ //

	// waypoints (using waypoint plugin) for loading
	// flickr photos and codepen projects lazily.
	// no need to downlaod loads of data if user doesnt
	// ever look at it.

	APP.setUpWaypoints = function() {
		
		$('.flickr-wrapper').waypoint({
			
			offset: 500,
			triggerOnce: true,
			
			handler: function(direction) {

				APP.loadFlickr( APP.photoCount );

			}
			
		});	


		$('.github-wrapper').waypoint({

			offset: -500,
			triggerOnce: true,

			handler: function(direction) {

				// $('#penlist').getPens("simeydotme", { 
				// 	minHearts: 0, 
				// 	maxPens: APP.penCount, 
				// 	orderBy: null 
				// });

				$("#penlist").codepens("simeydotme", {

					minHearts: 0 ,
					minComments: 0 ,
					minViews: 0 ,

					orderBy: "hearts" ,
					reverse: true ,

					maxPens: APP.penCount,
					template: $("#penTemplate").text()

				});

			}

		});
	
	}

// ================================================================ //

	// Animate the "SIMEY" 

	APP.headerAnimation = function() {
		
		// make the header area the height 
		// of the window.

        var winheight = ( $(window).height() > 800 ) ? 800 : $(window).height();
		APP.$simeyHeader.height( winheight );

		// if we have css animation capability...			
		
		if( Modernizr.cssanimations ) {
			
			// store the header element,
			// and set the letters to opacity: 0;

			APP.$simeyLetters.css('opacity',0);
			
			// if this is the first visit, we want a
			// fancy animation...

			if( $.cookie('visited') === undefined && 
				window.location.hash === "" ) {
				
				// add the animation class, and wait for the animation end
				// to remove the animation class and set the letters to
				// opaque. kind of a workaround for some animation bug.

				APP.$simeyHeader
					.addClass('enter')
					.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', '.letter-i', function(e) {
						
						// make sure the letters don't fade out after animation
						APP.$simeyLetters
							.css('opacity',1);

						APP.$simeyHeader
							.removeClass('enter');
												
					});
			
			// if not first visit, we just fade the title in.
			// no need for lame animations on every refresh.

			} else {
				
				APP.$simeyLetters
					.css('opacity',1)
					.hide()
					.fadeIn(2000);
				
			}
			
			// resets cookie after 10 minutes
			// using hte cookie jquery plugin.

			var expires = new Date();
			expires.setMinutes(expires.getMinutes() + 10);
			$.cookie('visited', 'true', { expires: expires, path: '/' });

			
					
			// variable used for timer.

			var t, paragon = false;
			
			// for every letter in the header,
			// start the "reveal" animation when clicked.

			APP.$simeyLetters.on('click', function(e) { 
				
				// if the header doesnt have class "enter"

				if( !APP.$simeyHeader.hasClass('enter') ) {
					
					// add the class "hover" which is a CSS Animation.

					APP.$simeyHeader.addClass( 'hover' ); 
					
					// and then remove it.

					clearTimeout(t);
					t = window.setTimeout( function() {
						APP.$simeyHeader.removeClass( 'hover' );
					}, 700 ); 
					
				}
				
				// remove the cookie because we want to see the
				// animation again when page loads.

				$.removeCookie('visited', { path: '/' });

				// only prevent the default action the first time.

				if( !paragon ) {
					e.preventDefault();
					paragon = true;			
				}
			
			});
				
		} else {
		
			$('.simey-header [class^=letter-]')
				.css('opacity',1)
				.hide()
				.fadeIn();
			
		}
		
	};




	
	APP.loadFlickr = function( imageCount ) {
		
		// store some variables used for pulling in flickr.
		var imageCount = imageCount || 12;

		var myapikey = 		"dd8e97ef9c1283583dcaf92b9ba80170";
		var photoset = 		"72157634483069405";
		var myset = 		"http://api.flickr.com/services/rest/?format=json&jsoncallback=?&method=flickr.photosets.getPhotos&api_key="+myapikey+"&photoset_id="+photoset;
				
		var $template = 	$('#flickr-feed');
		var cache = [];
		
		$(document).trigger("ajaxStart");

		$.getJSON( myset , function(set) {
			
			var photos = set.photoset.photo.reverse().slice(0, imageCount);
			var allPhotos = set.photoset.photo;
			
			$.each( photos, function(k,v) {
			
				 var getimage = "http://api.flickr.com/services/rest/?format=json&jsoncallback=?&method=flickr.photos.getInfo&api_key="+myapikey+"&photo_id="+v.id;
				 
				 $.getJSON( getimage , function(result) {


					var ibgi = 'http://farm'+result.photo.farm+'.staticflickr.com/'+result.photo.server+'/'+result.photo.id+'_'+result.photo.secret+'_n.jpg';
					var ilnk = result.photo.urls.url[0]._content;
					var temp = 
						$template
							.text()
							.replace("{{url}}", ilnk )
							.replace("{{image}}", ibgi )
							.replace("{{id}}", result.photo.id )
							.replace("{{title}}", result.photo.title._content );

					$template.before( temp );

					$(document).trigger("ajaxStop");				

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
							.addClass("animated long flip")
							.find(".flickr-image")
								.css("background-image","url("+ibgi+")");

					}

				}

			}


			var interval = 4000;
			setInterval( function() {
				replaceRandomImage();
			}, interval );
			
		
		});
		
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	