/* Most of my translation will be done by using the Javascript
library and the Elvish Tengwar font, the dictionary below can 
be used to override and display if needed. */
  
//Translation Dictionary below
   const translations = {
    english: {
        welcome: "Welcome to my website!!",
        navAbout: "About Me",
        navPortfolio: "Portfolio",
        navPlan: "Personal Siteplan",
        navHome: "Home"
    },
    
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
    // Used querySelectorAll to find every tagged element at once.
    const elements = document.querySelectorAll('[data-i18n]');

    // 2. Loop through each element found
    elements.forEach(element => {
        // Get the specific key for this element (e.g., "welcome" or "navAbout")
        const key = element.getAttribute('data-i18n');
        
        // 3. Update the text if the language and key exist in dictionary
        // Ensures the site doesn't break if a translation is missing.
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
        if (lang === 'elvish') {
            element.classList.add('elvish-text');
        } else {
            element.classList.remove('elvish-text');
        }
    });

    // 4. Persistence: Save the user's choice to their browser.
    // This uses localStorage so the choice stays even after a refresh.
    localStorage.setItem('selectedLanguage', lang);
}

// This waits for the HTML to fully load before running the script.
document.addEventListener("DOMContentLoaded", () => {
    
    // A. SET INITIAL LANGUAGE
    // Check if there is a saved language in the browser; otherwise, default to 'english'.
    const savedLang = localStorage.getItem('selectedLanguage') || 'english';
    changeLanguage(savedLang);

    // B. HOOK UP THE BUTTONS
    // Select the buttons by their IDs and tell them to run changeLanguage when clicked.
    document.getElementById('en-btn').addEventListener('click', () => changeLanguage('english'));
    
    document.getElementById('el-btn').addEventListener('click', () => changeLanguage('elvish'));
    
    // Note: If using Klingon later, uncomment in your dictionary later, don't forget hook up its button here:
    // document.getElementById('kl-btn').addEventListener('click', () => changeLanguage('klingon'));
});

// 1. Create the invisible overlay box dynamically.
const overlay = document.createElement('div');
overlay.id = 'translation-overlay';
document.body.appendChild(overlay);

// 2. Select items with 'data-english' and add the hover logic.
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


// --- EXTRA CREDIT PROTOCOL: MATRIX OVERLAY, UI BADGE & EXCEPTION SYSTEM ---
const secretCode = ['c', 'y', 'b', 'e', 'r'];
let inputSequence = [];
let matrixCanvas = null;
let terminalBadge = null; // Holds dynamically created corner box
let animationFrameId = null;

window.addEventListener('keydown', (event) => {
    inputSequence.push(event.key.toLowerCase());
    inputSequence.splice(-secretCode.length - 1, inputSequence.length - secretCode.length);
    
    // Triggering the code combo: "cyber"
    if (inputSequence.join('') === secretCode.join('')) {
        inputSequence = []; // Clear sequence
        
        if (!matrixCanvas) {
            initiateMatrixRain();
        } else {
            stopMatrixRain();
        }
    }

    // Force escape route: pressing 'Escape' kills the system instantly
    if (event.key === 'Escape' && matrixCanvas) {
        stopMatrixRain();
    }

    // --- RUBRIC STRETCH CHALLENGE: EXCEPTION HANDLING ---
    // Throws a controlled exception if an unauthorized interrupt key 'x' is logged
    try {
        if (event.key.toLowerCase() === 'x') {
            throw new Error("System Intercept: Unauthorized 'X' keystroke detected.");
        }
    } catch (error) {
        console.warn(`[SANDBOX EXCEPTION CAUGHT] ${error.message}`);
    }
});

// Main initialization logic for the falling code canvas stream and UI Box
function initiateMatrixRain() {
    console.log("Matrix mode activated.");
    
    // 1. Programmatically inject full screen canvas wrapper into DOM
    matrixCanvas = document.createElement('canvas');
    matrixCanvas.style.position = 'fixed';
    matrixCanvas.style.top = '0';
    matrixCanvas.style.left = '0';
    matrixCanvas.style.width = '100vw';
    matrixCanvas.style.height = '100vh';
    matrixCanvas.style.zIndex = '99998'; // Floating right beneath the notification badge
    matrixCanvas.style.background = 'rgba(0, 0, 0, 0.9)';
    document.body.appendChild(matrixCanvas);

    // 2. Programmatically inject the hacker terminal easter egg box into the corner
    terminalBadge = document.createElement('div');
    terminalBadge.style.position = 'fixed';
    terminalBadge.style.top = '20px';
    terminalBadge.style.right = '20px';
    terminalBadge.style.background = 'rgba(0, 0, 0, 0.85)';
    terminalBadge.style.color = '#00ff00';
    terminalBadge.style.border = '2px dashed #00ff00';
    terminalBadge.style.padding = '15px';
    terminalBadge.style.borderRadius = '6px';
    terminalBadge.style.fontFamily = "'Courier New', monospace";
    terminalBadge.style.fontSize = '14px';
    terminalBadge.style.zIndex = '99999'; // Highest layer on the screen
    terminalBadge.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
    terminalBadge.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">🔒 SECURE PROTOCOL INITIATED</div>
        <div style="color: #888;">Easter Egg Mode Enabled</div>
        <div style="margin-top: 10px; font-size: 11px; color: #ff3333;">Type 'cyber' or press ESC to exit</div>
    `;
    document.body.appendChild(terminalBadge);

    const ctx = matrixCanvas.getContext('2d');
    
    // Scale canvas grid metrics dynamically based on cross-device monitor display sizes
    const resizeCanvas = () => {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Configuration arrays for streams
    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890XYZ';
    const alphabet = katakana.split('');
    const fontSize = 16;
    const columns = matrixCanvas.width / fontSize;
    const rainDrops = Array.from({ length: columns }).fill(1);

    // 3. Continuous loop utilizing context rendering mechanics
    const draw = () => {
        // Translucent background sweep creates trailing fade animations
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        ctx.fillStyle = '#0f0'; // Cyber neon green stream font
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            // Send standard drops resetting randomly to the top boundary lines
            if (rainDrops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
        animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resizeCanvas);
}

// Memory safety routine: stops rendering frames and deletes all created overlay components
function stopMatrixRain() {
    console.log("Matrix mode deactivated.");
    
    // Terminate animation loop
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Remove canvas sheet from screen
    if (matrixCanvas && matrixCanvas.parentNode) {
        matrixCanvas.parentNode.removeChild(matrixCanvas);
    }
    
    // Remove floating easter egg box badge from screen
    if (terminalBadge && terminalBadge.parentNode) {
        terminalBadge.parentNode.removeChild(terminalBadge);
    }
    
    // Reset object pointers for memory garbage collection
    matrixCanvas = null;
    terminalBadge = null;
}