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
const scrollToElement = e => {
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: e.offsetTop - 90
    });
}

// ----

// Add current page "selected-nav" class, for the Mega Menu "Documentation" Link item
if (document.querySelectorAll('.nav-main .selected-nav').length > 0) {
    document.querySelector('.mega-menu-trigger .nav-item').classList.add('selected-nav');
}
// Add selected nav to the top level parent (second nav)
if (document.querySelectorAll('.nav-main-second .selected-nav').length > 0 && 
        !document.body.classList.contains('template-contribute') && 
        !document.body.classList.contains('template-addons')
    ){
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
        localStorage.q2adocs_notice = 'closed';
    }

} // End handleClick()
document.addEventListener('click', handleClick);

// Show / Hide Notice on the front page
if (localStorage.getItem('q2adocs_notice') === null && noticeContainer != null) {
    noticeContainer.classList.remove('display-none');
}

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
const handleScroll = e => {

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

const sidebarLinkNav = e => {
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



