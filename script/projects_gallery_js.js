
var img = new Image();
img.src = 'img/case.svg';
var galleryBg_width;
img.onload = function() {
  galleryBg_width = this.width;
}

$(window).load(function () {				
	
	//hide the dark backdrop that is shown when an image is zoomed into
	var zoom_cont = $('#zoom_container');
	zoom_cont.hide();
	
	var imgs = $('#gallery img'); 

	var img_array = new Array();
	var totalSlides = 0;
	$('#gallery img').each( function() {
		$(this).css({'width' : '414px'});
		img_array[totalSlides++] = $(this);				
	});					
	
	//The gallery background is scaled down to fit the page by this factor
	var scale_factor = 0.7;				
	var scaledGalleryBG_width = Math.round(galleryBg_width * scale_factor);
	
	// Scale down the gallery container to fit as desired
	$('#gallery_container').css('width', scaledGalleryBG_width + 'px');
	$('#gallery_container').css('opacity', '1');				
	
	var imgBorderWidth = parseInt($(imgs).css("border-left-width"),10);	
	var total_border_width = imgBorderWidth * 2;
	
	//Width of a single image
	var imgWidth = imgs.width();
	
	//Calculate the amount of margin to add to the left and right of each image		
   var gallery_cont = $('#gallery_container');	
	var total_img_margin = (gallery_cont.width() - imgWidth - (imgBorderWidth*2));
	var img_sideMargin = total_img_margin / 2;

	// add calculated left/right margin needed to center them on gallery container
	imgs.each( function(i) {					
		$(imgs[i]).css('margin', '0 ' + img_sideMargin + 'px'); 		
	});
	
	//Calculate pixels each image will slide left/right to show the next image
	var slideDistance = total_border_width + total_img_margin + imgWidth;
	
	var num_imgs = imgs.length;  
	var added_margin = 2*img_sideMargin*num_imgs;
	var added_border_width = 2*imgBorderWidth*num_imgs
	
	// Multiply the actual individual width by the number of images; 
	// this is the width of the container that holds all the images
	var added_images_width = (imgWidth*num_imgs) + added_margin + added_border_width;
	
	var gallery = $('#gallery');	
	gallery.css('width', added_images_width + 'px');
	
	$('#next_right').css('visibility', 'visible');
	
	var bodyWidth = $('body').width()/2;
	var top_offset = $('#gallery_container').position().top;
	var container_height = gallery_cont.height();
	var container_additional_offset = 60;
	var counters_top_position = top_offset + container_height + container_additional_offset;
	
	$('#counters').css('left',  bodyWidth - ($('#counters').width()/2));
	$('#counters').css('top',  counters_top_position); 

	var target;
	var selected_index = 2;
	var direction_right = true;
	var counters = $('#counters img');
				
	//Keyboard key codes
	var leftKeyCode = 37;                 
	var rightKeyCode = 39; 		

	var currentSlide = 0;

	$('#caption').html( img_array[currentSlide].attr('alt') );

	//Attach handlers to slide buttons and keyboard left/right keys to slide images and swipe for mobile devices
	$('#next_left').click( function() {
		animateLeft(slideDistance);
	});

	$('#next_right').click( function() {
		animateRight(slideDistance);
	});
	
	var animating = false;

	$("body").keydown(function(e) {
	
		if(animating == false){
	
			if(e.keyCode == 37) { // left		
				if(canMoveLeft() == true){
				   animating = true;
					animateLeft(slideDistance);
					if(isZoomedIn){
						nextZoomedImg();						
					} else{
						animating = false;
					}
				}
			}
			else if(e.keyCode == 39) { // right			
				if(canMoveRight() == true){
				   animating = true;
					animateRight(slideDistance);
					if(isZoomedIn){
						nextZoomedImg();
					} else{
						animating = false;
					}			
				}	
			}
			
		}	
			
	});	
	
	
	function animateLeft() {
	
		$('#next_right').show();
	
		currentSlide--;
	
		$('#caption').hide().html( img_array[currentSlide].attr('alt') );
	
		gallery.animate({'left':'+='+ slideDistance +'px'}, 550 , function() { $('#caption').fadeIn() } );	
	
		if(currentSlide == 0){
			$('#next_left').hide();
		}
	
	}		

	function canMoveLeft(){
		if(currentSlide == 0){
			return false;
		}
		return true;
	}
	
	var lastElement = imgs.length-1;	

	function animateRight(slideDistance) {   

		$('#next_left').show();
	
		currentSlide++;
	
		$('#caption').hide().html( img_array[currentSlide].attr('alt') );
	
		gallery.animate( {'left':'-='+ slideDistance +'px'} , 550 , function() { $('#caption').fadeIn() } );			
	
		if(currentSlide == lastElement){ 
			$('#next_right').hide();
		}
	
	}
	
	function canMoveRight(){
		if(currentSlide == lastElement) {
			return false;
		}
		return true;	
	}
	
	var imgHtml_added = false;
	
	
	$.each(img_array, function() {
		$(this).click( function() {
		
			if(imgHtml_added == false){
				var htmlToAdd = $( "<img>" );
				htmlToAdd.attr('id', 'zoom_img');				
				htmlToAdd.appendTo($('#zoom_container'));
				$("#zoom_container img").click(function(e) {
					  e.stopPropagation();
				});
				imgHtml_added = true;
			}
			
			showZoomedImage($(this));
			
		});
	});	
	
	var isZoomedIn = false;
	
	function showZoomedImage(image){	   
	
		zoom_cont.show();		
		isZoomedIn=true;
		
		$('#zoom_img').attr( { src: image.attr('src'), alt: image.attr('alt') } );
			
		var newMarginTop = $('#zoom_img').height()/2;
		$('#zoom_img').css("margin-top", "-" + newMarginTop + "px");
		
		var newMarginLeft = $('#zoom_img').width()/2;
		$('#zoom_img').css("margin-left", "-" + newMarginLeft + "px");
	
	}
	
	function nextZoomedImg(){
		
		var imgSrc = img_array[currentSlide].attr('src');
		var imgAlt = img_array[currentSlide].attr('alt');
		
		 $('#zoom_img')
			  .fadeOut(100, function() {
					$('#zoom_img').attr( { src: imgSrc, alt: imgAlt } );
			  })
			  .delay(400)
			  .fadeIn(800, function() { animating = false; } ); 
	
	}
	
	function closeZoomedImage(){
		zoom_cont.hide();
		isZoomedIn = false;
	}
	
	zoom_cont.click( function() {
		closeZoomedImage();
	});	
	
	var escapeKeyCode = 27;
	
	$("body").keydown(function(e) {
		if(e.keyCode == escapeKeyCode) { // escape
			if(zoom_cont.css('display') == 'block'){
				closeZoomedImage();
			}
		}
	});
	
	
});