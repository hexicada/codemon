'use strict';

const { buildGhostCreatureSVG } = require('./ghost');

// ── Creature router ───────────────────────────────────────────────────────────
// To add a new creature:
//   1. Create creatures/yourcreature.js  (export buildYourCreatureSVG)
//   2. require it here
//   3. Add one line to the if-chain below

function buildCreatureForLang(state, evoIdx, c, bc, mood, features, extTraits, foodStr) {
  if (state.unlockedGhost) {
    return buildGhostCreatureSVG(evoIdx, c, bc, mood, features, foodStr);
  }
  return null;
}

module.exports = { buildCreatureForLang };
