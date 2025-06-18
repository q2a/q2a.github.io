
// Days until next fetch for Github repository links
const daysUntilNextFetch = 7;

class githubList {
	constructor() {
		this.pluginList = [];
		this.themeList = [];
	}
	
	addListLink(listType, entry) {
		const formattedEntry = {
			id: entry.id?.toString() || '',
			link: entry.link?.toString() || '',
			date: entry.date?.toString() || '',
			max_q2a: entry.max_q2a?.toString() || '',
			type: entry.type || 'repository'
		};

		if (listType === 'plugins') {
			this.pluginList.push(formattedEntry);
		} else {
			this.themeList.push(formattedEntry);
		}
	}
	
	// Store Repositories locally
	savePluginsList() {
		localStorage.setItem('q2adocs_github_plugins', JSON.stringify(this.pluginList));
	}
	saveThemesList() {
		localStorage.setItem('q2adocs_github_themes', JSON.stringify(this.themeList));
	}
	
	getList(listType) {
		// List param, will contain either: q2adocs_github_plugins or q2adocs_github_themes
		return JSON.parse(localStorage.getItem(listType));
	}
	
}

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
	} else if ( diffYears > 1095 && diffYears <= 1460) {
		yearGap = 4;
	} else if ( diffYears > 1460) {
		yearGap = 5;
	}
	return yearGap;
}

// Checks for Github repository links, and prepends a tag with their date "year-month-day". (fetched from their metadata.js files)
const gitLinks = document.querySelectorAll(`
	.template-addons-plugins .page-content li a[href*="https://github.com/"],
	.template-addons-themes .page-content li a[href*="https://github.com/"]
`);

const pluginLinks = document.querySelectorAll('.template-addons-plugins .page-content li a[href*="https://github.com/"]');
const themeLinks = document.querySelectorAll('.template-addons-themes .page-content li a[href*="https://github.com/"]');

if (gitLinks != null && gitLinks.length) {
	
	const pluginsList = new githubList();
	const themesList = new githubList();
	const isPluginsPage = (document.querySelector('.template-addons-plugins') != null ? true : false);
	const isThemesPage = (document.querySelector('.template-addons-themes') != null ? true : false);
	
	/**
	 * Adds an entry to the appropriate list (plugins or themes) with repository type.
	 *
	 * @param {string} pageType - Indicates the type of page ('plugins' or 'themes').
	 * @param {string} listType - The type of list the entry should be added to ('plugins' or 'themes').
	 * @param {Object} entry - The entry object containing id, link, date, and max_q2a.
	 */
	const addFetchedLinkToList = (pageType, listType, entry) => {
		const list = pageType === 'plugins' ? pluginsList : themesList;
		list.addListLink(listType, entry);
	}
	
	// Get current Q2A version
	const getQ2aVersion = async () => {
		try {
			const res = await fetch('https://raw.githubusercontent.com/q2a/question2answer/master/VERSION.txt');
			if (res.ok) {
				const text = await res.text();
				return text.trim();
			}
		} catch (e) {
			console.warn('Failed to fetch Q2A version:', e);
		}
		return '0'; // fallback
	};
	
	/**
	 * Fetch Links - Fetches metadata for all GitHub plugin/theme links on the current page.
	 *
	 * - Attempts to retrieve each repository's `metadata.json` file.
	 * - Stores successful and failed responses (with fallback "unknown" values) into localStorage.
	 * - Adds metadata headers for list length and last updated date.
	 * - Immediately calls `createTags()` to render tags based on the fetched data.
	 * - Uses a fast-fail approach for broken URLs to speed up processing.
	 *
	 * This ensures future page loads are faster by caching both good and broken links,
	 * and avoids re-fetching unchanged data.
	 */
	const fetchLinks = async () => {
		const githubDomain = 'https://github.com/';
		const fetchPromises = [];
		const tempList = [];

		const q2aVersion = await getQ2aVersion();

		// Set list headers
		if (isPluginsPage) {
			pluginsList.addListLink('plugins', {
				id: 'metadata_list_size',
				link: 'List_length',
				date: pluginLinks.length,
				max_q2a: q2aVersion,
				type: 'metadata'
			});
			pluginsList.addListLink('plugins', {
				id: 'metadata_list_updated',
				link: 'updated',
				date: new Date().toISOString(),
				max_q2a: q2aVersion,
				type: 'metadata'
			});
		} else if (isThemesPage) {
			themesList.addListLink('themes', {
				id: 'metadata_list_size',
				link: 'List_length',
				date: themeLinks.length,
				max_q2a: q2aVersion,
				type: 'metadata'
			});
			themesList.addListLink('themes', {
				id: 'metadata_list_updated',
				link: 'updated',
				date: new Date().toISOString(),
				max_q2a: q2aVersion,
				type: 'metadata'
			});
		}

		for (let i = 0; i < gitLinks.length; i++) {
			const href = gitLinks[i].getAttribute('href');
			const repoPath = href.slice(href.indexOf(githubDomain) + githubDomain.length);
			const metadataURL = `https://raw.githubusercontent.com/${repoPath}/master/metadata.json`;
			const isRepository = (href.match(/\//g) || []).length >= 4;
			
			// Add a placeholder, while the content is being loaded
			if (gitLinks[i] && gitLinks[i].parentElement) {
				gitLinks[i].parentElement.insertAdjacentHTML(
					'beforeend',
					`<span class="repository-footer loading-placeholder">
						<span class="rf-item">Loading repository data...</span>
					</span>`
				);
			}
			
			const fetchPromise = fetch(metadataURL)
				.then(res => res.ok ? res.json() : Promise.reject('404'))
				.then(data => {
					const maxQ2a = data.max_q2a || '0';
					const entry = {
						id: i.toString(),
						link: href,
						date: data.date || 'unknown',
						max_q2a: maxQ2a
					};
					tempList.push(entry);
					
					// Add to the list to be saved
					if (isPluginsPage) {
						addFetchedLinkToList('plugins', 'plugins', entry);
					} else if (isThemesPage) {
						addFetchedLinkToList('themes', 'themes', entry);
					}
				})
				.catch(() => {
					if (isRepository) {
						const entry = {
							id: i.toString(),
							link: href.toString(),
							date: 'unknown',
							max_q2a: '0',
							type: 'repository'
						};
						tempList.push(entry);
						
						// Add to the list to be saved
						if (isPluginsPage) {
							addFetchedLinkToList('plugins', 'plugins', entry);
						} else if (isThemesPage) {
							addFetchedLinkToList('themes', 'themes', entry);
						}
					}
				});

			fetchPromises.push(fetchPromise);
		}

		Promise.all(fetchPromises).then(() => {
			// Save to localStorage
			if (isPluginsPage) {
				pluginsList.savePluginsList();
				// console.log('Fetched and saved plugin list');
				createTags(pluginsList.pluginList);
			} else if (isThemesPage) {
				themesList.saveThemesList();
				// console.log('Fetched and saved theme list');
				createTags(themesList.themeList);
			}
		});
	};

	// Get saved data from LocalStorage
	const retrievedPlugins = pluginsList.getList('q2adocs_github_plugins');
	const retrievedThemes = themesList.getList('q2adocs_github_themes');
	
	// Create tags for both - Plugins and Themes
	const createTags = (param) => {
		if (param) {
			// Get the stored value for Q2A current version
			const currentQ2aVersion = param[0].max_q2a;

			// Show current Q2A version on the sidebar, for comparison with plugins/themes.
			const currentVersionEl = document.createElement('div');
			currentVersionEl.className = 'docs-nav-q2a-version';
			currentVersionEl.innerHTML = `Q2A current version: <b>${currentQ2aVersion}</b>
			<a href="/q2adocs-preview/install/versions/" target="_blank">
				<svg xmlns="http://www.w3.org/2000/svg" class="qa-svg" width="18px" height="18px" viewBox="0 -960 960 960" fill="#5f6368"><path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z"></path></svg>
			</a>
			`;
			const docsNavEl = document.querySelector('.docs-nav');
			docsNavEl.parentNode.insertBefore(currentVersionEl, docsNavEl.nextSibling);
			
			param.forEach((item, index) => {
				
				const list = param.slice(2); // Remove list header (metadata) indexes
				const id = Object.values(list[index] || {} )[0];
				const link = Object.values(list[index] || {} )[1];
				const date = Object.values(list[index] || {} )[2];
				const max_q2a = Object.values(list[index] || {} )[3];
				
				// Uncomment to check if list is being stored correctly
				// console.log(`${id} === ${link} === ${date}`);
				
				if (id != null && gitLinks[index].parentElement.innerHTML.includes('➔')){
					gitLinks[id].closest('li').classList.add('child-repository');
				}
				
				if (id != null && link != null && date != null && max_q2a != null) {
					
					// Remove Placeholder
					const parentElement = gitLinks[id].parentElement;
					const placeholders = parentElement.querySelectorAll('.loading-placeholder');

					placeholders.forEach(placeholder => placeholder.remove());
					
					// Preppend based on stored id/index, because DOM link order may not be accurate when looping
					// index order will be updated when information is fetched again
					
					const yearGapClass = 'rep-date-' + calcYears(date);
					
					if (date != 'unknown') {
						// if 'max_q2a' key is available
						if (max_q2a != '0') {
							gitLinks[id].parentElement.insertAdjacentHTML(
								'beforeend',
								`<span class="repository-footer">
									<span class="rf-item">
										Last updated: 
										<span class="rep-date ${yearGapClass}"></span> 
										<span class="rep-date-true">${date}</span>
									</span>
									<span class="rf-item">
										<span>Tested with Q2A ${max_q2a}
										<span class="rf-item-info tooltip-wrapper">
											<span class="tooltip">The author of this plugin, maintainer, or its contributors, have tested this plugin's compatibility with Q2A ${max_q2a}.</span>
											<svg class="docs-svg" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 -960 960 960" fill="#1f1f1f"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
										</span>
										</span>
									</span>
								</span>`,
							);
						} else {
							gitLinks[id].parentElement.insertAdjacentHTML(
								'beforeend',
								`<span class="repository-footer">
									<span class="rf-item">
										Last updated: 
										<span class="rep-date rep-date-true ${yearGapClass}"></span> 
										<span>${date}</span>
									</span>
								</span>`,
							);
						}
					} else if (date == 'unknown') {
						// If response is 'bad request' or '404', show "unknown" tag
						gitLinks[id].parentElement.insertAdjacentHTML(
							'beforeend',
							`<span class="repository-footer">
								<span class="rf-item">
									Last updated: 
									<span class="rep-date rep-date-bad"></span> <span>Unknown</span>
								</span>
							</span>`,
						);
					}
				} // close if () null
			});
		}
	} // close createTags()
	
	// Start "ListLength" at zero, in case not fetched yet
	let pluginsListUpdated = currentDate();
	let pluginListLength = 0;
	
	let themesListUpdated = currentDate();
	let themeListLength = 0;
	
	const getMetadataValue = (list, key) => list.find(e => e.type === 'metadata' && e.id === key)?.date;

	if (retrievedPlugins?.length) {
		try {
			const rawDate = getMetadataValue(retrievedPlugins, 'metadata_list_updated');
			const parsedDate = new Date(rawDate);
			pluginsListUpdated = !isNaN(parsedDate) ? parsedDate.toISOString().split('T')[0] : currentDate().join('-');
			pluginListLength = parseInt(getMetadataValue(retrievedPlugins, 'metadata_list_size'), 10) || 0;
		} catch {
			pluginsListUpdated = currentDate().join('-');
			pluginListLength = 0;
		}
	}

	if (retrievedThemes?.length) {
		try {
			const rawDate = getMetadataValue(retrievedThemes, 'metadata_list_updated');
			const parsedDate = new Date(rawDate);
			themesListUpdated = !isNaN(parsedDate) ? parsedDate.toISOString().split('T')[0] : currentDate().join('-');
			themeListLength = parseInt(getMetadataValue(retrievedThemes, 'metadata_list_size'), 10) || 0;
		} catch {
			themesListUpdated = currentDate().join('-');
			themeListLength = 0;
		}
	}
	
	
	// ----------------------------
	// Create the tags / badges ---
	// ----------------------------
	
	/**
	 * Initializes repository tag rendering for plugin or theme pages.
	 *
	 * - Checks if data in localStorage is fresh and matches the number of GitHub links on the page.
	 * - If data is outdated, missing, or the list length has changed, triggers a fresh fetch via `fetchLinks()`.
	 * - Otherwise, uses cached data from localStorage to immediately render tags with `createTags()`.
	 */
	const createFooters = () => {
		if (isPluginsPage) {
			const shouldFetch = (
				retrievedPlugins === null ||
				calcDays(pluginsListUpdated) >= daysUntilNextFetch ||
				pluginLinks.length != pluginListLength
			);
			if (shouldFetch) {
				fetchLinks(); // fetchLinks will handle createTags
			} else {
				createTags(retrievedPlugins); // only use local data if not fetching
			}
		} else if (isThemesPage) {
			const shouldFetch = (
				retrievedThemes === null ||
				calcDays(themesListUpdated) >= daysUntilNextFetch ||
				themeLinks.length != themeListLength
			);
			if (shouldFetch) {
				fetchLinks();
			} else {
				createTags(retrievedThemes);
			}
		}
	};
	
	// Test remaining days
	// console.log('Days passed since Plugins list updated: ' + calcDays(pluginsListUpdated));
	// console.log('Days passed since Themes list updated: ' + calcDays(themesListUpdated));
	createFooters();
	
} // End of if gitLinks.length



