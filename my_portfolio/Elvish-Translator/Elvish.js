/* ============================================================
   elvish.js  —  Elvish Translator page logic
   Placed in: /elvish-translator/elvish.js

   All code is wrapped in an IIFE (immediately-invoked function
   expression) so no variable names leak into the global scope
   and clash with your root script.js.
   ============================================================ */

(function () {
  'use strict';

  // ── Tengwar ASCII map (Tengwar Annatar font mode) ──────────────
  // Each value is the ASCII character that LOOKS like a Tengwar
  // glyph when rendered in the Tengwar Annatar font.
  // Digraphs (two-letter combos) are handled first so "th" → one
  // glyph, not two separate ones.
  const TENGWAR_MAP = {
    // digraphs
    th: '7',  ch: 'k',  sh: '9',  ph: 'f',
    gh: '^',  ng: 'b',  qu: 'p',  nt: 'md', nd: 'mb',
    // vowels
    a: 'D',  e: 'G',  i: 'H',  o: 'J',  u: 'F',
    // consonants
    b: 'w',  c: 'r',  d: '2',  f: 'f',  g: '^',
    h: 'h',  j: '6',  k: 'r',  l: 'j',  m: 'm',
    n: 't',  p: 'q',  r: '4',  s: '8',  t: '1',
    v: 'w',  w: 'e',  x: 'r8', y: 'H',  z: '7',
  };

  // Digraphs listed longest-first so the loop matches greedily
  const DIGRAPHS = ['th','ch','sh','ph','gh','ng','qu','nt','nd'];

  // ── Sindarin word dictionary ────────────────────────────────────
  const SINDARIN = {
    star: 'êl',         stars: 'elin',      moon: 'ithil',
    sun: 'anor',        light: 'galad',     dark: 'dú',
    shadow: 'dae',      water: 'nen',       fire: 'naur',
    earth: 'ceven',     sky: 'menel',       wind: 'gwaewar',
    tree: 'galadh',     forest: 'taur',     river: 'sirith',
    mountain: 'orod',   stone: 'gond',      silver: 'celebrant',
    gold: 'malt',       friend: 'mellon',   love: 'meleth',
    heart: 'hûn',       hope: 'estel',      fate: 'maen',
    journey: 'pân',     road: 'men',        home: 'bar',
    bridge: 'iânt',     king: 'aran',       queen: 'bereth',
    lord: 'hîr',        lady: 'hiril',      warrior: 'maethor',
    sword: 'megil',     shield: 'thand',    arrow: 'pîl',
    bow: 'peng',        elf: 'edhel',       elves: 'edhil',
    man: 'adan',        men: 'edain',       dwarf: 'naug',
    ring: 'corw',       power: 'tûl',       wisdom: 'golwen',
    life: 'cuil',       death: 'gurth',     night: 'dû',
    morning: 'minuial', white: 'nim',       black: 'môr',
    green: 'calen',     blue: 'luin',       red: 'caran',
    grey: 'mith',       beautiful: 'bain',  ancient: 'iaur',
    peace: 'sîdh',      grace: 'melith',    sorrow: 'naer',
    joy: 'glaer',       courage: 'thalion', sea: 'gaear',
    isle: 'tol',        vale: 'nan',        cave: 'groth',
    deep: 'thurin',     secret: 'thurin',   eternal: 'iûl',
    blessed: 'galu',    one: 'er',          rule: 'tur',
    all: 'pan',         they: 'hain',       them: 'hain',
  };

  // ── Quenya word dictionary ──────────────────────────────────────
  const QUENYA = {
    star: 'elen',       stars: 'eleni',     moon: 'Isil',
    sun: 'Anar',        light: 'calma',     dark: 'morë',
    shadow: 'undu',     water: 'nén',       fire: 'nár',
    earth: 'kemen',     sky: 'menel',       wind: 'súrë',
    tree: 'alda',       forest: 'taurelorn',river: 'sírë',
    mountain: 'oron',   stone: 'sarnë',     silver: 'telpë',
    gold: 'laurë',      friend: 'nildo',    love: 'melmë',
    heart: 'hón',       hope: 'estel',      fate: 'maivë',
    journey: 'lendë',   road: 'tië',        home: 'már',
    bridge: 'yanta',    king: 'aran',       queen: 'tári',
    lord: 'heru',       lady: 'heri',       warrior: 'ohtar',
    sword: 'macil',     shield: 'tárma',    arrow: 'pilin',
    bow: 'quinga',      elf: 'elda',        elves: 'eldar',
    man: 'atan',        men: 'atani',       dwarf: 'nauco',
    ring: 'corma',      power: 'túrë',      wisdom: 'nólë',
    life: 'cuivë',      death: 'námo',      night: 'lómë',
    morning: 'amaurëa', white: 'vanya',     black: 'morë',
    green: 'laiquë',    blue: 'luinë',      red: 'carnë',
    grey: 'sindë',      beautiful: 'vanima',ancient: 'yára',
    peace: 'sérë',      grace: 'melmë',     sorrow: 'nainë',
    joy: 'alassë',      courage: 'verya',   sea: 'eär',
    isle: 'tol',        vale: 'nan',        cave: 'undumë',
    deep: 'undu',       secret: 'haloitë',  eternal: 'oialë',
    blessed: 'alcar',   one: 'er',          rule: 'tur',
    all: 'ilye',        them: 'te',         they: 'te',
    darkness: 'mordo',  bind: 'nur',
  };

  // ── Sample phrases per mode ─────────────────────────────────────
  const SAMPLES = {
    english: [
      'one ring to rule them all',
      'not all those who wander are lost',
      'fly you fools',
      'the road goes ever on',
      'speak friend and enter',
      'even the smallest person can change the course of the future',
    ],
    sindarin: ['star','moon','friend','light','shadow','elves','courage','sea'],
    quenya:   ['star','sun','love','heart','ring','wisdom','eternal','blessed'],
  };

  // ── State ───────────────────────────────────────────────────────
  let currentMode = 'english';

  // ── DOM refs ────────────────────────────────────────────────────
  const inputEl      = document.getElementById('ev-input');
  const outputEl     = document.getElementById('ev-output');
  const tengwarEl    = document.getElementById('ev-tengwar-out');
  const phoneticEl   = document.getElementById('ev-phonetic-out');
  const fallbackEl   = document.getElementById('ev-fallback-note');
  const outputLabel  = document.getElementById('ev-output-label');
  const samplesGrid  = document.getElementById('ev-samples-grid');
  const fontNotice   = document.getElementById('ev-font-notice');
  const copyBtn      = document.getElementById('ev-copy-btn');
  const clearBtn     = document.getElementById('ev-clear-btn');
  const translateBtn = document.getElementById('ev-translate-btn');
  const modeBtns     = document.querySelectorAll('.ev-mode-btn');

  // ── Core: English → Tengwar ASCII ──────────────────────────────
  function toTengwar(text) {
    const s = text.toLowerCase().replace(/[^a-z ]/g, '');
    let out = '';
    let i = 0;
    while (i < s.length) {
      if (s[i] === ' ') {
        out += '  ';
        i++;
        continue;
      }
      const digraph = DIGRAPHS.find(d => s.startsWith(d, i));
      if (digraph) {
        out += TENGWAR_MAP[digraph] || digraph;
        i += digraph.length;
      } else {
        out += TENGWAR_MAP[s[i]] || s[i];
        i++;
      }
    }
    return out;
  }

  // ── Core: build phonetic guide ──────────────────────────────────
  function buildPhonetic(text) {
    const vowels = new Set(['a','e','i','o','u']);
    return text
      .toLowerCase()
      .replace(/[^a-z ]/g, '')
      .split(' ')
      .map(word =>
        word.split('').map(c => vowels.has(c) ? c.toUpperCase() : c).join('')
      )
      .join(' · ');
  }

  // ── Check if Tengwar font is loaded ────────────────────────────
  function isTengwarFontLoaded() {
    // Measure a character in Tengwar Annatar vs a known fallback.
    // If the widths match a generic serif, the font is not installed.
    const canvas = document.createElement('canvas').getContext('2d');
    canvas.font = '32px serif';
    const fallbackWidth = canvas.measureText('X').width;
    canvas.font = '32px "Tengwar Annatar", serif';
    const tengwarWidth = canvas.measureText('X').width;
    // If widths differ, Tengwar Annatar changed the rendering → loaded.
    // This is a best-effort check; not 100% reliable across all browsers.
    return tengwarWidth !== fallbackWidth;
  }

  // ── Translate ───────────────────────────────────────────────────
  function translate() {
    const raw = inputEl.value.trim();
    if (!raw) return;

    let tengwar  = '';
    let phonetic = '';
    let fallback = '';

    if (currentMode === 'english') {
      tengwar  = toTengwar(raw);
      phonetic = buildPhonetic(raw);
      fallback = 'Install the Tengwar Annatar font to render these characters as Elvish glyphs.';

    } else {
      const dict = currentMode === 'sindarin' ? SINDARIN : QUENYA;
      const lang = currentMode === 'sindarin' ? 'Sindarin' : 'Quenya';
      const key  = raw.toLowerCase().trim().replace(/[^a-z]/g, '');
      const elvishWord = dict[key];

      if (elvishWord) {
        tengwar  = toTengwar(elvishWord);
        phonetic = elvishWord;
        fallback = `"${elvishWord}" in ${lang}. Install Tengwar Annatar font to render Elvish glyphs.`;
      } else {
        tengwar  = toTengwar(raw);
        phonetic = buildPhonetic(raw);
        fallback = `No ${lang} word known for "${raw}" — showing phonetic Tengwar of English text.`;
      }
    }

    tengwarEl.textContent  = tengwar;
    phoneticEl.textContent = phonetic;
    fallbackEl.textContent = fallback;

    outputEl.classList.remove('ev-output--hidden');
    outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Show font notice if Tengwar Annatar isn't loading
    if (!isTengwarFontLoaded()) {
      fontNotice.classList.add('ev-font-notice--show');
    } else {
      fontNotice.classList.remove('ev-font-notice--show');
    }
  }

  // ── Clear ───────────────────────────────────────────────────────
  function clearAll() {
    inputEl.value          = '';
    tengwarEl.textContent  = '';
    phoneticEl.textContent = '';
    fallbackEl.textContent = '';
    outputEl.classList.add('ev-output--hidden');
    fontNotice.classList.remove('ev-font-notice--show');
    copyBtn.textContent = 'Copy script';
    copyBtn.classList.remove('ev-action-btn--copied');
  }

  // ── Copy to clipboard ───────────────────────────────────────────
  function copyTengwar() {
    const text = tengwarEl.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = 'Copied ✓';
      copyBtn.classList.add('ev-action-btn--copied');
      setTimeout(() => {
        copyBtn.textContent = 'Copy script';
        copyBtn.classList.remove('ev-action-btn--copied');
      }, 2000);
    });
  }

  // ── Mode switching ──────────────────────────────────────────────
  function setMode(mode) {
    currentMode = mode;
    modeBtns.forEach(btn => {
      btn.classList.toggle('ev-mode-btn--active', btn.dataset.mode === mode);
    });

    const placeholders = {
      english:  'Type your words here…',
      sindarin: 'Type an English word to find its Sindarin equivalent…',
      quenya:   'Type an English word to find its Quenya equivalent…',
    };
    const labels = {
      english:  'Tengwar script',
      sindarin: 'Sindarin & Tengwar',
      quenya:   'Quenya & Tengwar',
    };

    inputEl.placeholder    = placeholders[mode];
    outputLabel.textContent = labels[mode];
    renderSamples();
    clearAll();
  }

  // ── Render sample pills ─────────────────────────────────────────
  function renderSamples() {
    samplesGrid.innerHTML = '';
    SAMPLES[currentMode].forEach(phrase => {
      const btn = document.createElement('button');
      btn.className   = 'ev-sample-pill';
      btn.textContent = phrase;
      btn.addEventListener('click', () => {
        inputEl.value = phrase;
        translate();
      });
      samplesGrid.appendChild(btn);
    });
  }

  // ── Event listeners ─────────────────────────────────────────────
  translateBtn.addEventListener('click', translate);
  copyBtn.addEventListener('click', copyTengwar);
  clearBtn.addEventListener('click', clearAll);

  // Translate on Enter (without Shift)
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      translate();
    }
  });

  // Hide output if input is cleared manually
  inputEl.addEventListener('input', () => {
    if (inputEl.value === '') clearAll();
  });

  // Mode buttons
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });

  // ── Init ────────────────────────────────────────────────────────
  renderSamples();

})(); // end IIFE
