window.addEventListener('load', stickyHeader);
window.addEventListener('scroll', stickyHeader, {passive: true});

// Get the offset position of the navbar
var header = document.querySelector('header.header');
var stickyPos = header ? header.offsetTop : 0;

function stickyHeader() {
	if (window.scrollY > stickyPos) {
		header.classList.add('sticky');
	} else {
		header.classList.remove('sticky');
	}
}

// toggle sub-menu
var menuToggle = document.querySelector('.page-sidebar-toggle');
menuToggle.addEventListener('click', function(ev) {
	var nav = this.nextElementSibling;
	if (nav.classList.contains('expanded'))
		nav.classList.remove('expanded');
	else
		nav.classList.add('expanded');
});
