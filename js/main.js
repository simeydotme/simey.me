

	$(function() {

		// start the animation for entering the site, 
		// and then allow for "hover" effect after the "e" has finished animating.
		
		var $simeyHeader = 
			$('.simey-header')
				.addClass('enter')
				.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', '.letter-e', function(e) {
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
		
	});
	
	
	
	
	
	
	$(function() {
		
		// store some variables used for pulling in flickr.
		
		var myapikey = 		"dd8e97ef9c1283583dcaf92b9ba80170";
		var photoset = 		"72157634483069405";
		var myset = 		"http://api.flickr.com/services/rest/?format=json&jsoncallback=?&method=flickr.photosets.getPhotos&api_key="+myapikey+"&photoset_id="+photoset;
		
		var $inner = $('.flickr-feed-inner');
		var $overlay = $('.flickr-overlay').hide();
		var $spinner = $('.flickr-preloader').hide();
		
		var $iclose = $('.flickr-close').on('click', function(e) {
			$overlay.fadeOut(); e.preventDefault();
		});
		
		$.getJSON( myset , function(set) {
			
			$.each( set.photoset.photo, function(k,v) {
			
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
									setTimeout( function() {
										
										$this.css({ left: "", top: "", display: "block", position: "" });
										$overlay.css({ left: "-9999px", top: "-9999px", display: "block", position: "absolute" });
										$overlay.css({ "margin-left": "-"+($this.width()*0.5 +30)+"px" });
										$overlay.css({ left: "", top: "", display: "", position: "" }).fadeIn();
										$spinner.fadeOut();
										
									}, 1500 );
									
								});
							
							
							//$overlay.find('.flickr-overlay-image').html( $overlayimg.hide() ); 
							//$overlay.find('.flickr-preloader').show().delay(1000).fadeOut( function() {
								
							//	$overlayimg.css({ left: "-9999px", top: "-9999px", display: "block", position: "absolute" });
							//	var x = { w: $overlayimg.width() , h: $overlayimg.height() };
							//	console.log( $overlayimg );
							//	$overlayimg.fadeIn();
							//});
							
						}
						
						e.preventDefault();
						
					});

				});
			
			});
			
			$inner.width( set.photoset.photo.length * 170 );
		
		
		});
		
		
	});
	
	
	
	
	$(function() {
		
		var $inner = $('.flickr-feed-inner');
		var t;
		
		var myScroll = new iScroll('flickr-feed', { 
			hScroll: true, 
			vScroll: false,
			scrollbarClass: 'flickr-scrollbar',
			
			onScrollMove: function () { $inner.addClass('dragging'); },
			onScrollEnd: function () { 
				clearTimeout(t);
				t = setTimeout( function() {
					$inner.removeClass('dragging'); 
				}, 200 );
			}
		});
		
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	