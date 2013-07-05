

	$(function() {


		var $simeyHeader = 
			$('.simey-header')
				.addClass('enter')
				.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', '.letter-e', function(e) {
					$simeyHeader.find('[class^=letter-]').css('opacity',1);
					$simeyHeader.removeClass('enter')
				});
		var t = "";
		
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
			
			})
		
		
		
		
	});
	
	
	
	
	
	
	$(function() {
		
		var myapikey = 		"dd8e97ef9c1283583dcaf92b9ba80170";
		var photoset = 		"72157634483069405";
		var myset = 		"http://api.flickr.com/services/rest/?format=json&jsoncallback=?&method=flickr.photosets.getPhotos&api_key="+myapikey+"&photoset_id="+photoset;

		$.getJSON( myset , function(set) {
		
			$.each( set.photoset.photo, function(k,v) {
			
				 var getimage = "http://api.flickr.com/services/rest/?format=json&jsoncallback=?&method=flickr.photos.getInfo&api_key="+myapikey+"&photo_id="+v.id;
				 
				 $.getJSON( getimage , function(result) {
				
				 	//$('.flickr-feed').append( $('<img src="http://farm'+result.photo.farm+'.staticflickr.com/'+result.photo.server+'/'+result.photo.id+'_'+result.photo.secret+'_z.jpg">') );

				});
			
			
			});
		
		
		});
		
		
	});
	
	
	
	
	
	
	
	
	
	