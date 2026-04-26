'use strict';

const { buildGhostCreatureSVG } = require('./ghost');
const { buildBaseCreatureSVG } = require('./base');

// ── Creature router ───────────────────────────────────────────────────────────
// To add a new creature:
//   1. Create creatures/yourcreature.js  (export buildYourCreatureSVG)
//   2. require it here
//   3. Add one line to the if-chain below

function buildCreatureForLang(dominantLang, evoIdx, c, bc, mood, features, extTraits, foodStr, unlockedGhost) {
  if (unlockedGhost) return buildGhostCreatureSVG(evoIdx, c, bc, mood, features, foodStr);
  return buildBaseCreatureSVG(evoIdx, c, bc, mood, features, extTraits, dominantLang, foodStr);
}

module.exports = { buildCreatureForLang };
