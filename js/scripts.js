
// Days until next fetch for Github repository links
const daysUntilNextFetch = 90; // 3 months

class githubList {
    constructor() {
        this.pluginList = [];
		this.themeList = [];
    }

	addListLink(listType, index, linkInfo, dateInfo) {
        // Push object to array, that later will be saved locally
		if(listType === 'plugins') {
			this.pluginList.push({id: index.toString(), link: linkInfo.toString(), date: dateInfo.toString()});
		} else {
			this.themeList.push({id: index.toString(), link: linkInfo.toString(), date: dateInfo.toString()});
		}
    }
	
	// Store Repositories locally
	savePluginsList() {
		localStorage.setItem('q2adocs_gitHub_plugins', JSON.stringify(this.pluginList));
	}
	
	saveThemesList() {
		localStorage.setItem('q2adocs_gitHub_themes', JSON.stringify(this.themeList));
	}
}

// --------------------------------
// Common functions, Reusable STUFF
// --------------------------------

// Check for Parents
const hasParent = (element, ...parents) => parents.some((parent) => parent.includes(element));

// Loop add class
const loopAddClass = (targetClass, addClass) => {
	document.querySelectorAll(targetClass).forEach(element => {
		element.classList.add(addClass);
	});
}

// Loop remove class
const loopRemoveClass = (targetClass, removeClass) => {
	document.querySelectorAll(targetClass).forEach(element => {
		element.classList.remove(removeClass);
	});
}

// Scroll to Elements
scrollToElement = (element) => {
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: element.offsetTop - 90
    });
}

// ----

// Add current page "selected-nav" class, for the Mega Menu "Documentation" Link item
if (document.querySelectorAll('.nav-main .selected-nav').length > 0) {
	document.querySelector('.mega-menu-trigger .nav-item').classList.add('selected-nav');
}
// Add selected nav to the top level parent (second nav)
if (
	document.querySelectorAll('.nav-main-second .selected-nav').length > 0 && 
	!document.body.classList.contains('template-contribute') && 
	!document.body.classList.contains('template-addons')) {
	document.querySelector('.nav-main-second .selected-nav').closest('.sub-nav').previousElementSibling.classList.add('selected-nav');
}

// toggle menu children
let opened = null;
const toggleVisibility = e => e.classList.toggle('display-none');

const handleDropdown = e => {
	const clickedItem = e.parentElement.lastChild.previousSibling;

	toggleVisibility(clickedItem);

	if (!opened) {
		opened = clickedItem;
	} else if (opened == clickedItem) {
		opened = null;
	} else {
		toggleVisibility(opened);
		opened = clickedItem;
	}
}

const navContainer = document.querySelector('.nav-container');
const backgroundSheet = document.querySelector('.darkPane');
const navMain = document.querySelector('.nav-main');
const noticeContainer = document.querySelector('.notice-container');

// Handle Click
const handleClick = e => {
	
	// Menu Trigger
	if (e.target.id === 'main-nav-trigger') {
		if (navContainer.classList.contains('active')) {
			navContainer.classList.remove('active');
			backgroundSheet.classList.remove('active');
		} else {
			navContainer.classList.add('active');
			backgroundSheet.classList.add('active');
		}
	}
	
	// Mega Menu
	if (e.target.parentElement.className.includes('mega-menu-trigger')) {
		navMain.classList.toggle('display-none');
	} else if (!hasParent(e.target, '.nav-main')) {
		navMain.classList.add('display-none');
	}
	
	// Nav Menu Children
	if (e.target.className.includes('toggleChildren')) {
		handleDropdown(e.target);
	} else if (opened) {
		toggleVisibility(opened);
		opened = null;
	}
	
	// Scroll to section on Sidebar navigation click
	if (e.target.className.includes('docs-nav-item')) {
		const targetDataId = e.target.getAttribute('data-attr-scroll');
		scrollToElement(document.getElementById(targetDataId));
	}
	
	// Go Top
	if (e.target.className.includes('jump-top')) {
		window.scrollTo({top: 0, behavior: 'smooth'});
	}
	
	// Close dark sheet
	if (e.target.className.includes('darkPane')) {
		if (backgroundSheet.classList.contains('active')) {
			navContainer.classList.remove('active');
			backgroundSheet.classList.remove('active');
		}
	}
	
	// Needs Page refresh after fetching
	if (e.target.className.includes('close-page-status')) {
		location.reload();
	}
	
	// Notice
	if (e.target.className.includes('close-notice') || e.target.className.includes('close-sheet')) {
		noticeContainer.classList.add('display-none');
		// set Notice localStorage
		localStorage.q2adocsNotice = 'closed';
	}
	
} // End handleClick()
document.addEventListener('click', handleClick);


// Quick fix to close Mega Menu, when clicking secondary nav items
document.querySelectorAll('.nav-main-second .toggleChildren').forEach(element => {
	element.addEventListener('click', (e) => {
		navMain.classList.add('display-none');
	});
});


// On Scroll
const header = document.querySelector('header.header');
const stickyPos = header ? header.offsetTop : 0;

const jumpTopContainer = document.querySelector('.jump-top-container');
const jumpTop = document.getElementById('jump-top');

// Handle Scroll
const handleScroll = (e) => {
	
	// Sticky Topbar
	if (window.scrollY > stickyPos) {
		header.classList.add('sticky');
	} else {
		header.classList.remove('sticky');
	}
	
	if(window.screen.width > 900) {
		// Get the offset position of the scroll-to-top button
		const stickyJumpPos = 700;

		const jtRect = jumpTopContainer.getBoundingClientRect().top;
		const jtOH = ( window.pageYOffset || jumpTopContainer.scrollTop ) - ( jumpTopContainer.clientTop || 0 );
		const winHeight = window.innerHeight - jumpTopContainer.offsetHeight;
		const stopStickyJump = (jtRect + jtOH - winHeight);
		
		if (window.scrollY > stickyJumpPos && window.scrollY < stopStickyJump) {
			jumpTop.classList.add ('active');
		} else if (window.scrollY > stopStickyJump) {
			jumpTop.classList.remove('active');
		} else {
			jumpTop.classList.remove('active');
		}
	}
	
}
handleScroll();
window.addEventListener('scroll', handleScroll);


// ----------------------------
// Single page ----------------
// ----------------------------

// Docs Navigation
const articleHeaders = document.querySelectorAll('\
	.page-content h1, .page-content h2, .page-content h3, .page-content h4, .page-content h5, .page-content h6\
');
const docsNav = document.querySelector('.docs-nav');

articleHeaders.forEach(element => {
	element.classList.add('sectionTitle');
	let dataId = element.getAttribute('id');
	const html = '<li class="docs-nav-item" data-attr-scroll="'+ dataId +'">' + element.innerHTML +'</li>';
	docsNav.insertAdjacentHTML('beforeend', html);
});


const sidebarDocslinks = document.querySelectorAll('.docs-nav-item');
const docsSection = document.querySelectorAll('.sectionTitle');

function sidebarLinkNav() {
    if(!document.body.classList.contains('template-homepage') && sidebarDocslinks != null && docsSection != null) {
		let index = docsSection.length;

		while (--index && window.scrollY + 200 < docsSection[index].offsetTop) {}

		// add the active class if within visible height of the element
		if (scrollY - docsSection[index].offsetHeight < docsSection[index].offsetTop) {
			sidebarDocslinks.forEach((link) => link.classList.remove('active'));
			sidebarDocslinks[index].classList.add('active');
		}
	}
}
sidebarLinkNav();
window.addEventListener('scroll', sidebarLinkNav);

const currentDate = () => {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = today.getMonth() + 1; // Months start at 0!
	const dd = today.getDate();
	
	return new Array(yyyy, mm, dd);
}

// Takes one date parameter, calculates and returns the amount of days between present day
const calcDays = param => {
	const todayDate = currentDate(); 
	const currentYear = new Date(`${todayDate[0]}/${todayDate[1]}/${todayDate[2]}`);
	
	let convertDate = param;
	if (convertDate.indexOf('-') > -1) {
		const arr = convertDate.split('-');
		convertDate = `${arr[0]}/${arr[1]}/${arr[2]}`;
	}
	
	const repositoryYear = new Date(convertDate);
	
	const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
	const diffDays = Math.round(Math.abs((currentYear - repositoryYear) / oneDay));
	
	return diffDays;
}

// Calculate year gap for Github repositories
const calcYears = param => {
	const diffYears = calcDays(param);
	let yearGap = 0;
	
	if ( diffYears <= 365) {
		yearGap = 1;
	} else if ( diffYears > 365 && diffYears <= 730) {
		yearGap = 2;
	} else if ( diffYears > 730 && diffYears <= 1095) {
		yearGap = 3;
	} else if ( diffYears > 1095) {
		yearGap = 4;
	}
	return yearGap;
}

// Checks for Github repository links, and prepends a tag with their date "year-month-day". (fetched from their metadata.js files)
const gitLinks = document.querySelectorAll('\
	.template-addons-plugins .page-content li a[href*="https://github.com/"],\
	.template-addons-themes .page-content li a[href*="https://github.com/"]\
');

const pluginLinks = document.querySelectorAll('.template-addons-plugins .page-content li a[href*="https://github.com/"]');
const themeLinks = document.querySelectorAll('.template-addons-themes .page-content li a[href*="https://github.com/"]');

if(gitLinks != null && gitLinks.length) {
	
	const pluginsList = new githubList();
	const themesList = new githubList();
	const isPluginsPage = (document.querySelector('.template-addons-plugins') != null ? true : false);
	const isThemesPage = (document.querySelector('.template-addons-themes') != null ? true : false);
	
	// Set outside Fetch, because it will be reused for other functions
	const githubDomain = 'https://github.com/';
	
	// Fetch Links
	const fetchLinks = () => {
		
		// Set list headers
		if(isPluginsPage) {
			pluginsList.addListLink('plugins', '1000', 'List_length', pluginLinks.length);
			pluginsList.addListLink('plugins', '1001', 'updated', new Date());
		} else if (isThemesPage) {
			themesList.addListLink('themes', '1000', 'List_length', themeLinks.length);
			themesList.addListLink('themes', '1001', 'updated', new Date());
		}
		
		for(let i=0; i<gitLinks.length; i++) {
			
			const getGithubHref = gitLinks[i].getAttribute('href');
			const githubRepository = getGithubHref.slice(getGithubHref.indexOf(githubDomain) + githubDomain.length);
			const githubJSON = 'https://raw.githubusercontent.com/' + githubRepository + '/master/metadata.json';
			
			// Checks if the Link has more than 4 'forward slashes', AKA a repository, to escape Github user profiles
			let isRepository = (getGithubHref.match(/\//g) || []).length >= 4;
			
			fetch(githubJSON)
			.then(res => res.json())
			.then(jsonResponse => {
				if(isRepository) {
					// Add link to list
					if(isPluginsPage) {
						pluginsList.addListLink('plugins', [i], gitLinks[i], jsonResponse.date);
					} else if (isThemesPage) {
						themesList.addListLink('themes', [i], gitLinks[i], jsonResponse.date);
					}
				}
			})
			.catch(error => {
				console.log(error)
				// Save Unknowns as well. Prevents null Objects.
				// We can remove the display tag in the createPluginTags() functions instead, by removing the "else" statement.
				if(isRepository) {
					if(isPluginsPage) {
						pluginsList.addListLink('plugins', [i], gitLinks[i], 'unknown');
					} else if (isThemesPage) {
						themesList.addListLink('themes', [i], gitLinks[i], 'unknown');
					}
				}
			})
			.finally(result => {
				if(isPluginsPage) {
					pluginsList.savePluginsList();
				} else {
					themesList.saveThemesList();
				}
			});
			
		} // End of for loop
		
		setTimeout(function(){
			document.querySelector('.page-status-container').innerHTML = '\
				<div class="page-status">\
					<div>\
						<span class="twbb">There has been an update to this page.</span>\
						<span class="twbb">Please reload.</span>\
					</div>\
					<span class="close-page-status material-icons noSelect" title="Reload this page">refresh</span>\
				</div>\
			';
		}, 2000);
	}
	
	// Get saved data from LocalStorage
	const retrievedPlugins = JSON.parse(localStorage.getItem('q2adocs_gitHub_plugins'));
	const retrievedThemes = JSON.parse(localStorage.getItem('q2adocs_gitHub_themes'));
	
	// Retrieve single data
	const singleKey = (storage)  => {
		return Object.keys(storage);
	}
	const singleValue = (storage)  => {
		return Object.values(storage);
	}
	
	// Create tags for both - Plugins and Themes
	const createTags = (param) => {
		param.forEach((item, index) => {
			
				const test = param.slice(2); // Remove list header (metadata) indexes
				const id = Object.values(test[index] || {} )[0];
				const link = Object.values(test[index] || {} )[1];
				const date = Object.values(test[index] || {} )[2];
				
				// console.log(`${id} === ${link} === ${date}`);
				
				if(id != null && link != null && date != null) {	
					// Preppend based on stored id/index, because DOM link order may not be accurate when looping
					// index order will be updated when information is stored/fetched again
					if(date != 'unknown') {
						const yearGapClass = 'rep-date-' + calcYears(date);
						gitLinks[id].insertAdjacentHTML(
							'beforebegin',
							`<span class="rep-date rep-date-true ${yearGapClass}" title="Last updated: ${date}">${date}</span>`,
						);
					} else if(date == 'unknown') {
						// If response is 'bad request' or '404', show "unknown" tag
						gitLinks[id].insertAdjacentHTML(
							'beforebegin',
							`<span class="rep-date rep-date-bad" title="Last updated: Unknown">Unknown</span>`,
						);
					}
				}
		});
	}
	
	// Start at zero, in case not fetched yet
	let pluginsListUpdated = currentDate();
	let pluginListLength = 0;
	let themesListUpdated = currentDate();
	let themeListLength = 0;
	
	if(localStorage.q2adocs_gitHub_plugins) {
		// Get saved list length for Plugins
		pluginsListUpdated = singleValue(retrievedPlugins[1])[2];
		pluginsListUpdated = new Date(pluginsListUpdated).toISOString().split('T')[0];
		pluginListLength = singleValue(retrievedPlugins[0])[2];
	}
	if(localStorage.q2adocs_gitHub_themes) {
		// Get saved list length for Themes
		themesListUpdated = singleValue(retrievedThemes[1])[2];
		themesListUpdated = new Date(themesListUpdated).toISOString().split('T')[0];
		themeListLength = singleValue(retrievedThemes[0])[2];
	}
	// ----------------------------
	// Create the tags / badges ---
	// ----------------------------
	
	// Test remaining days
	// console.log('Days passed since Plugins list updated: ' + calcDays(pluginsListUpdated));
	// console.log('Days passed since Themes list updated: ' + calcDays(themesListUpdated));
	const generateTags = () => {
		if(isPluginsPage) {
			// Calculate number of days until next fetch
			// if "N" days have passed, or the number of links no longer matches the number of saved links, request Fetch 
			if(retrievedPlugins === null || calcDays(pluginsListUpdated) >= daysUntilNextFetch || pluginLinks.length != pluginListLength) {
				fetchLinks();
			}
			createTags(retrievedPlugins);
			// console.log('retrieved Plugins Object: ', retrievedPlugins);
			// console.log('github plugin links length: '+ pluginLinks.length +'; saved: ' + pluginListLength);
		} else if (isThemesPage) {
			if(retrievedThemes === null || calcDays(themesListUpdated) >= daysUntilNextFetch || themeLinks.length != themeListLength) {
				fetchLinks();
			}
			createTags(retrievedThemes);
			// console.log('retrieved Themes Object: ', retrievedThemes);
			// console.log('github theme links length: '+ themeLinks.length +'; saved: ' + themeListLength);
		}
	}
	
	generateTags();
	
} // End of if gitLinks.length



