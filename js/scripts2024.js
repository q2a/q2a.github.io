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
let menuToggle = document.querySelector('.page-sidebar-toggle');
menuToggle.addEventListener('click', function(ev) {
	let nav = this.nextElementSibling;
	if (nav.classList.contains('expanded'))
		nav.classList.remove('expanded');
	else
		nav.classList.add('expanded');
});

// Calculate Github repository year gap, against present year
// The gap year will be appended to a class later
const calcDate = param => {
	const dateObj = new Date();
	const currentYear = dateObj.getUTCFullYear();
	
	const repositoryYear = param.substring(0, param.indexOf('-'));
	
	let yearGap = 0;
	if ( currentYear - repositoryYear === 1){
		yearGap = 1;
	} else if ( currentYear - repositoryYear === 2){
		yearGap = 2;
	} else if ( currentYear - repositoryYear === 3){
		yearGap = 3;
	} else if ( currentYear - repositoryYear >= 4){
		yearGap = 4;
	}
	
	return yearGap;
}

// Checks for Github repository links, and prepends a tag with their date "year-month-day". (fetched from their metadata.js files)
const gitLinks = document.querySelectorAll('.page-content li a[href*="https://github.com/"]');

if(gitLinks.length) {
	for(let i=0; i<gitLinks.length; i++) {
		const getGithubHref = gitLinks[i].getAttribute('href');

		const githubDomain = 'https://github.com/';
		const githubRepository = getGithubHref.slice(getGithubHref.indexOf(githubDomain) + githubDomain.length);
		const githubJSON = 'https://raw.githubusercontent.com/' + githubRepository + '/master/metadata.json';
		
		const getDates = async () => {
			try {
				const response = await fetch(githubJSON);
				
				// Checks if the Link has more than 4 'forward slashes', aka a repository, to escape Github user profiles
				let isRepository = (getGithubHref.match(/\//g) || []).length >= 4;
					
				if(isRepository){
					if(response.ok){
						let jsonResponse = await response.json();
						// Defines class with the calculated Gap Year calcDate()
						const yearGapClass = 'rep-date-' + calcDate(jsonResponse.date);
						// Finally prepend the tag/badge
						gitLinks[i].insertAdjacentHTML(
							'beforebegin',
							`<span class="rep-date ${yearGapClass}">${jsonResponse.date}</span>`,
						);
					} else {
						// If response is 'bad request' or '404', set an "unknown" tag
						gitLinks[i].insertAdjacentHTML(
							'beforebegin',
							`<span class="rep-date rep-date-bad">Unknown</span>`,
						);
					}
				}
			}
			catch(error) {
				console.log(error);
			}
		}
		getDates();
		
	}
}


