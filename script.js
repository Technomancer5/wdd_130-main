/* This comment
   spans multiple
   lines */
   //Translation Dictionary or Translation Data below

   const translations = {
    english: {
        welcome: "Welcome to my Website!!",
        navAbout: "About Me Page",
        navPortfolio: "Portfolio",
        navPlan: "Personal Siteplan",
        navHome: "Home"
    },
    /*
    klingon: {
        welcome: "tLHIngan maH!",
        navAbout: "gHboH (History)",               // Klingon for history/about
        navPortfolio: "patmey (Systems/Projects)", // Klingon for systems
        navPlan: "He (The Course/Plan)"            // Klingon for route/navigational plan
    },
    */
    elvish: {
        welcome: "Welcome to my website!!",
        navAbout: "Nanyë (About Me)",
        navPortfolio: "Mentur (Project Works)",
        navPlan: "Sardë (The Blueprint/Plan)"
    }
};

//This is the 'translation engine' the Javascript logic that swaps text.
function changeLanguage(lang) {
    // 1. Select all elements that have the 'data-i18n' attribute
    // We use querySelectorAll to find every tagged element at once [3].
    const elements = document.querySelectorAll('[data-i18n]');

    // 2. Loop through each element found [2]
    elements.forEach(element => {
        // Get the specific key for this element (e.g., "welcome" or "navAbout")
        const key = element.getAttribute('data-i18n');
        
        // 3. Update the text if the language and key exist in your dictionary
        // This ensures the site doesn't break if a translation is missing [2].
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
        if (lang === 'elvish') {
            element.classList.add('elvish-text');
        } else {
            element.classList.remove('elvish-text');
        }
    });

    // 4. Persistence: Save the user's choice to their browser [2].
    // This uses localStorage so the choice stays even after a refresh.
    localStorage.setItem('selectedLanguage', lang);
}

// This waits for the HTML to fully load before running the script [2, 5].
document.addEventListener("DOMContentLoaded", () => {
    
    // A. SET INITIAL LANGUAGE
    // Check if there is a saved language in the browser; otherwise, default to 'english' [2].
    const savedLang = localStorage.getItem('selectedLanguage') || 'english';
    changeLanguage(savedLang);

    // B. HOOK UP THE BUTTONS
    // We select the buttons by their IDs and tell them to run changeLanguage when clicked [6, 7].
    document.getElementById('en-btn').addEventListener('click', () => changeLanguage('english'));
    
    // Use 'elvish' for now as you planned to focus there first.
    document.getElementById('el-btn').addEventListener('click', () => changeLanguage('elvish'));
    
    // Note: If you uncomment Klingon in your dictionary later, hook up its button here:
    // document.getElementById('kl-btn').addEventListener('click', () => changeLanguage('klingon'));
});

// 1. Create the invisible overlay box dynamically [10].
const overlay = document.createElement('div');
overlay.id = 'translation-overlay';
document.body.appendChild(overlay);

// 2. Select items with 'data-english' and add the hover logic [11].
const hoverItems = document.querySelectorAll('[data-english]');
hoverItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        // Only show tooltip if the site is NOT currently in English.
        if (localStorage.getItem('selectedLanguage') !== 'english') {
            overlay.textContent = item.getAttribute('data-english');
            overlay.style.display = 'block';
            overlay.style.left = e.pageX + 15 + 'px'; // Offset from mouse cursor
            overlay.style.top = e.pageY + 15 + 'px';
        }
    });

    item.addEventListener('mouseleave', () => {
        overlay.style.display = 'none';
    });
});