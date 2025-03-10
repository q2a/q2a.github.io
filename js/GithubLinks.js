
// Days until next fetch for Github repository links
const daysUntilNextFetch = 7;

class githubList {
    constructor() {
        this.pluginList = [];
        this.themeList = [];
    }
    
    addListLink(listType, index, linkInfo, dateInfo, q2aVersion) {
        // Push object to array, that later will be saved locally
        if(listType === 'plugins') {
            this.pluginList.push({
                id: index.toString(),
                link: linkInfo.toString(),
                date: dateInfo.toString(),
                max_q2a: q2aVersion.toString()
            });
        } else {
            this.themeList.push({
                id: index.toString(),
                link: linkInfo.toString(),
                date: dateInfo.toString(),
                max_q2a: q2aVersion.toString()
            });
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

if(gitLinks != null && gitLinks.length) {
    
    const pluginsList = new githubList();
    const themesList = new githubList();
    const isPluginsPage = (document.querySelector('.template-addons-plugins') != null ? true : false);
    const isThemesPage = (document.querySelector('.template-addons-themes') != null ? true : false);
    
    // Set outside Fetch, because it will be reused for other functions
    const githubDomain = 'https://github.com/';
    
    // Fetch Links
    // Async would take longer to update the page, due to dozens of broken links.
    // They'd need to wait for the response back from each broken request, to move to the next link.

    // Since most old plugins aren't going to be updated, we store their "bad" information as well for display.
    // Making it faster to update the page, when fetching.
    const fetchLinks = () => {
        
        // Get Q2A version
        let q2aVersion;
        const getQ2aVersion = 'https://raw.githubusercontent.com/q2a/question2answer/master/VERSION.txt';
        let rawFile = new XMLHttpRequest();
        rawFile.open('GET', getQ2aVersion, false);
        rawFile.onreadystatechange = () => {
            if(rawFile.readyState === 4) {
                if(rawFile.status === 200 || rawFile.status == 0) {
                    q2aVersion = rawFile.responseText;
                }
            }
        }
        rawFile.send(null);
        
        // Set list headers
        if(isPluginsPage) {
            pluginsList.addListLink('plugins', 'metadata_list_size', 'List_length', pluginLinks.length, q2aVersion);
            pluginsList.addListLink('plugins', 'metadata_list_updated', 'updated', new Date(), q2aVersion);
        } else if (isThemesPage) {
            themesList.addListLink('themes', 'metadata_list_size', 'List_length', themeLinks.length, q2aVersion);
            themesList.addListLink('themes', 'metadata_list_updated', 'updated', new Date(), q2aVersion);
        }
        
        // Create list
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
                    const getQ2aVersion = (jsonResponse.max_q2a != null) ? jsonResponse.max_q2a : '0';
                    
                    if(isPluginsPage) {
                        pluginsList.addListLink('plugins', [i], gitLinks[i], jsonResponse.date, getQ2aVersion);
                    } else if (isThemesPage) {
                        themesList.addListLink('themes', [i], gitLinks[i], jsonResponse.date, getQ2aVersion);
                    }
                }
            })
            .catch(error => {
                console.log(error)
                // Save Unknowns as well. Prevents null Objects.
                // We can remove the display tag in the createTags() functions instead, 
                // if necessary, by removing the "else" statement.
                if(isRepository) {
                    if(isPluginsPage) {
                        pluginsList.addListLink('plugins', [i], gitLinks[i], 'unknown', '0');
                    } else if (isThemesPage) {
                        themesList.addListLink('themes', [i], gitLinks[i], 'unknown', '0');
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
        
        setTimeout(() => {
            document.querySelector('.page-status-container').innerHTML = `
            <div class="page-status">
                <div>
                    <span class="twbb">This page has been updated.</span>
                    <span class="twbb">Please reload.</span>
                </div>
                <span class="close-page-status material-icons noSelect" title="Reload this page">refresh</span>
            </div>
            `;
        }, 1500);
    }

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
                
                // console.log(`${id} === ${link} === ${date}`);
                
                if(id != null && gitLinks[id].parentElement.innerHTML.includes('➔')){
                    gitLinks[id].closest('li').classList.add('child-repository');
                }
                
                if(id != null && link != null && date != null && max_q2a != null) {
                    // Preppend based on stored id/index, because DOM link order may not be accurate when looping
                    // index order will be updated when information is fetched again
                    
                    const yearGapClass = 'rep-date-' + calcYears(date);
                    
                    if (date != 'unknown') {
                        // if 'max_q2a' key is available
                        if(max_q2a != '0') {
                            gitLinks[id].parentElement.insertAdjacentHTML(
                                'beforeend',
                                `<span class="repository-footer">
                                    <span class="rf-item">
                                        Last updated: 
                                        <span class="rep-date ${yearGapClass}"></span> 
                                        <span class="rep-date-true">${date}</span>
                                    </span>
                                    <span class="rf-item">
                                        <span>Tested with ${max_q2a}
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
                } // close if() null
            });
        }
    } // close createTags()
    
    // Start at zero, in case not fetched yet
    let pluginsListUpdated = currentDate();
    let pluginListLength = 0;
    
    let themesListUpdated = currentDate();
    let themeListLength = 0;
    
    if(localStorage.q2adocs_github_plugins) {
        // Get saved list length for Plugins
        pluginsListUpdated = retrievedPlugins[1].date;
        pluginsListUpdated = new Date(pluginsListUpdated).toISOString().split('T')[0];
        pluginListLength = retrievedPlugins[0].date
    }
    if(localStorage.q2adocs_github_themes) {
        // Get saved list length for Themes
        themesListUpdated = retrievedThemes[1].date;
        themesListUpdated = new Date(themesListUpdated).toISOString().split('T')[0];
        themeListLength = retrievedThemes[0].date;
    }
    
    // ----------------------------
    // Create the tags / badges ---
    // ----------------------------
    
    // Test remaining days
    // console.log('Days passed since Plugins list updated: ' + calcDays(pluginsListUpdated));
    // console.log('Days passed since Themes list updated: ' + calcDays(themesListUpdated));
    const createFooters = () => {
        if(isPluginsPage) {
            // Calculate number of days until next fetch
            // if "N" days have passed, or the number of links no longer matches the number of saved links, request Fetch
            if(retrievedPlugins === null || calcDays(pluginsListUpdated) >= daysUntilNextFetch || pluginLinks.length != pluginListLength) {
                fetchLinks();
            }
            createTags(retrievedPlugins);
            // console.log('retrieved Plugins Object: ', retrievedPlugins);
        } else if (isThemesPage) {
            if(retrievedThemes === null || calcDays(themesListUpdated) >= daysUntilNextFetch || themeLinks.length != themeListLength) {
                fetchLinks();
            }
            createTags(retrievedThemes);
            // console.log('retrieved Themes Object: ', retrievedThemes);
        }
    }
    createFooters();
    
} // End of if gitLinks.length



