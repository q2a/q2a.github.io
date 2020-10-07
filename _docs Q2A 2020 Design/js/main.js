

$(document).ready(function(){
	
	// Show dropdown list
	$('.nav-item').click(function(e) {
		// $(this).addClass('current-dropdown');
		$('.sub-nav').addClass('display-none');
		$(this).siblings('.sub-nav').removeClass('display-none');
		e.stopPropagation();
	});
	
	// Navigation Hamburguer menu
	$('#navTrigger').click(function(e) {
		$('#mobileNav').toggleClass('activeNav');
		$('#darkPane').toggleClass('activePane');
		$('body').toggleClass('noScroll');
		e.stopPropagation();
	});
	// Close Dark Pane
	$('#darkPane').click(function(e) {
		$('#mobileNav').removeClass('activeNav');
		$('#darkPane').removeClass('activePane');
		$('.sub-nav').addClass('display-none');
		$('body').removeClass('noScroll');
		e.stopPropagation();
	});
	
	// Welcome scroll to Section
	$(document).on('click', '#current-dir-nav', function() {
		$('.page-sub-directories').toggleClass('activeFilter');
	});
	
	// Copy current page sub directory text
	$('#current-dir-nav').text($('.page-sub-directories .selected-nav').text());
	
	if ($(window).width() > 900) {
		// scroll to top button
		$(window).scroll(function() {
			
			if($(this).scrollTop() > 800) {
				$('#jump-top').addClass('show-btt-button');
			} else 	{
				$('#jump-top').removeClass('show-btt-button');
			}
			
			// Remove class when scrolled to parent
			var $jtcOt = $('.jump-top-container').offset().top,
				$jtcOh = $('.jump-top-container').outerHeight(),
				$wH = $(window).height();
			
			if ($(this).scrollTop()> ($jtcOt+$jtcOh-$wH)){
			   $('#jump-top').removeClass('show-btt-button');
			}
			
		});
		
		// Sidebar Documentation Handlers
		$('h1, h2, h3, h4, h5, h6').each(function(index,element) {
			$(this).addClass('sectionTitle');
			// Add Data scroll
			var dataId = $(this).attr('id');
			$('.docs-nav').append('<li class="docs-nav-item" data-attr-scroll="'+ dataId +'">' + $(this).text() +'</li>');
		});
		
		
		// $sections incleudes all container divs that relate to sidebar menu items.
		var $sections = $('.sectionTitle');

		// Detect navigation scroll location 
		$(window).scroll(function(){

			var $currentScroll = $(this).scrollTop();
			
			var $currentSection
			// Check the position of each Doc Title compared to the windows scroll positon
			$sections.each(function(){
		 
				var $titlePosition = $(this).offset().top;
				// Detect div title 200px before hand 
				if( $titlePosition - 200 < $currentScroll ){
					$currentSection = $(this);
				}

				// Uses the currentSection as its source of ID
				var id = $currentSection.attr('id');
				$('.docs-nav-item').removeClass('bold-text');
				$('.docs-nav-item[data-attr-scroll='+id+']').addClass('bold-text');

			});

		});
		
		// Scroll to section on Sidebar navigation click
		$('body').on('click', '.docs-nav-item', function() {
			
			event.preventDefault(); 
			var defaultAnchorOffset = 0;

			var anchor = $(this).attr('data-attr-scroll');

			var anchorOffset = $('#'+anchor).attr('data-scroll');
			if (!anchorOffset)
				anchorOffset = defaultAnchorOffset;

			$('html,body').stop().animate({
				scrollTop: $('#'+anchor).offset().top - anchorOffset - 90
			}, 500);
		});
	
	} // Desktop Only - Sidebar
	
	
	// Jump back to Top
	$('#jump-top').click(function() {
		$('html, body').stop().animate({
		   scrollTop: 0
		}, 500);
	});
	
	// Remove all Opened shenanigans
	$('body,html').click(function(event) {
		// $('.nav-item').removeClass('current-dropdown');
		$('.sub-nav').addClass('display-none');
		$('.page-sub-directories').removeClass('activeFilter');
	});

});