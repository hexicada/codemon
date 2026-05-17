'use strict';

const { buildGhostCreatureSVG } = require('./ghost');
const { buildMothCreatureSVG }  = require('./moth');

// ── Language → creature family map ───────────────────────────────────────────
// Moth is the current default while other families are developed.
// Add entries here when a new family file is ready.
const LANG_FAMILY = {
  // Moth (Lua — esoteric, nocturnal, drawn to the light)
  lua:         'moth',
  // Snake (Python — obviously)
  python:      'snake',
  // Crab (Rust — already beloved)
  rust:        'crab',
  // Arachnid (scripty/webby)
  ruby:        'arachnid',
  php:         'arachnid',
  shellscript: 'arachnid',
  // Cat (elegant, typed, void-coded — Haskell = void cat)
  swift:       'cat',
  kotlin:      'cat',
  haskell:     'cat',
  // Capybara (chill, workhorse)
  go:          'capybara',
  java:        'capybara',
  r:           'capybara',
  // Cicada (C-family + JS/TS + default fallback — developed next)
  javascript:  'cicada',
  typescript:  'cicada',
  html:        'cicada',
  css:         'cicada',
  c:           'cicada',
  cpp:         'cicada',
  csharp:      'cicada',
};

// ── Creature router ───────────────────────────────────────────────────────────
// To add a new creature family:
//   1. Create creatures/yourfamily.js  (export buildYourFamilyCreatureSVG)
//   2. require it here
//   3. Add a case to the switch below
//   4. Map languages in LANG_FAMILY above

function buildCreatureForLang(dominantLang, evoIdx, c, bc, mood, features, extTraits, foodStr, unlockedGhost, xp = 0) {
  if (unlockedGhost) return buildGhostCreatureSVG(evoIdx, c, bc, mood, features, foodStr);

  const family = LANG_FAMILY[dominantLang] || 'moth'; // moth is the default

  switch (family) {
    // Families not yet implemented fall through to moth until their file is built
    case 'moth':
    case 'snake':
    case 'crab':
    case 'arachnid':
    case 'cat':
    case 'capybara':
    case 'cicada':
    default:
      return buildMothCreatureSVG(evoIdx, c, bc, mood, features, xp, foodStr);
  }
}

module.exports = { buildCreatureForLang, LANG_FAMILY };
