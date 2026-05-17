'use strict';

const { featureOverlays } = require('../features');

// ── MOTH CREATURE ─────────────────────────────────────────────────────────────
// Full metamorphosis arc:
//   0  Eggling    → clutch of oval eggs on a leaf
//   1  Glitchling → tiny baby caterpillar, huge eyes, round segments
//   2  Codespawn  → larger caterpillar, proper legs, antennae
//   3a Synthecyst → spinning caterpillar (silk thread visible)
//   3b Synthecyst → cocoon (mid-stage, triggers at COCOON_XP)
//   4  Archetype  → freshly emerged moth, wings still crumpled
//   5  Paradigm   → transcendent moth, wings dissolving into light

const COCOON_XP = 5000; // midpoint of Synthecyst range (3000–6999)

function buildMothCreatureSVG(evoIdx, c, bc, mood, features, xp, foodStr = '') {
  const dim      = mood === 'sleeping' || mood === 'drowsy';
  const happy    = mood === 'happy';
  const playful  = mood === 'playful';
  const eating   = mood === 'eating';
  const cocooned = evoIdx === 3 && xp >= COCOON_XP;

  // ── Stage 0: Egg clutch on a leaf ─────────────────────────────────────────
  const stage0 = `
    <!-- Leaf -->
    <path d="M24,74 C30,57 70,57 76,74 C68,85 32,85 24,74 Z"
      fill="${c}18" stroke="${c}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="50" y1="59" x2="50" y2="83" stroke="${c}" stroke-width="0.9" opacity="0.4" stroke-linecap="round"/>
    <path d="M50,65 C44,67 40,68 37,69" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.3" stroke-linecap="round"/>
    <path d="M50,71 C43,73 39,74 35,75" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.3" stroke-linecap="round"/>
    <path d="M50,65 C56,67 60,68 63,69" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.3" stroke-linecap="round"/>
    <path d="M50,71 C57,73 61,74 65,75" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.3" stroke-linecap="round"/>
    <!-- Silk thread from stem -->
    <path d="M50,59 C50,54 51,49 50,44" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.45" stroke-linecap="round"/>
    <!-- Egg clutch: five small ovals, tightly grouped -->
    <ellipse cx="44" cy="67" rx="3.4" ry="4.1" fill="${c}38" stroke="${c}" stroke-width="1.1"/>
    <ellipse cx="51" cy="65" rx="3.4" ry="4.1" fill="${c}38" stroke="${c}" stroke-width="1.1"/>
    <ellipse cx="57.5" cy="67.5" rx="3.4" ry="4.1" fill="${c}38" stroke="${c}" stroke-width="1.1"/>
    <ellipse cx="47" cy="72.5" rx="3.4" ry="4.1" fill="${c}38" stroke="${c}" stroke-width="1.1"/>
    <ellipse cx="54" cy="72.5" rx="3.4" ry="4.1" fill="${c}38" stroke="${c}" stroke-width="1.1"/>
    <!-- Egg shine -->
    <circle cx="43" cy="65.5" r="0.9" fill="white" opacity="0.55"/>
    <circle cx="50" cy="63.5" r="0.9" fill="white" opacity="0.55"/>
    <circle cx="56.5" cy="66" r="0.9" fill="white" opacity="0.55"/>
    <circle cx="46" cy="71" r="0.9" fill="white" opacity="0.55"/>
    <circle cx="53" cy="71" r="0.9" fill="white" opacity="0.55"/>
    ${eating ? `<text x="${50 - foodStr.length * 2.4}" y="90" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>` : ''}
    ${dim ? `<text x="62" y="40" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>` : ''}`;

  // ── Stage 1: Baby caterpillar ──────────────────────────────────────────────
  const eyeL1 = dim
    ? `<path d="M40,36 Q44,33 48,36" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`
    : `<circle cx="44" cy="36" r="3.8" fill="${c}"/><circle cx="43" cy="35" r="1.3" fill="white" opacity="0.8"/>`;
  const eyeR1 = dim
    ? `<path d="M52,36 Q56,33 60,36" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`
    : `<circle cx="56" cy="36" r="3.8" fill="${c}"/><circle cx="55" cy="35" r="1.3" fill="white" opacity="0.8"/>`;
  const mouth1 = happy || playful
    ? `<path d="M46,43 Q50,47 54,43" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`
    : eating ? `<circle cx="50" cy="43" r="2.5" fill="${c}" opacity="0.9"/>`
    : `<line x1="47" y1="43" x2="53" y2="43" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>`;

  const stage1 = `
    <!-- Antennae nubs (tiny, cute) -->
    <line x1="43" y1="24" x2="43" y2="28" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="43" cy="23" r="2.2" fill="${c}28" stroke="${c}" stroke-width="1.1"/>
    <line x1="57" y1="24" x2="57" y2="28" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="57" cy="23" r="2.2" fill="${c}28" stroke="${c}" stroke-width="1.1"/>
    <!-- Head: big and round (disproportionate) -->
    <circle cx="50" cy="37" r="13.5" fill="${c}20" stroke="${c}" stroke-width="1.7"/>
    ${eyeL1}${eyeR1}${mouth1}
    <!-- Body: three round squishy segments -->
    <ellipse cx="50" cy="53" rx="10.5" ry="7.5" fill="${c}18" stroke="${c}" stroke-width="1.5"/>
    <ellipse cx="50" cy="63.5" rx="9.5" ry="7" fill="${c}18" stroke="${c}" stroke-width="1.4"/>
    <ellipse cx="50" cy="73" rx="8" ry="6" fill="${c}18" stroke="${c}" stroke-width="1.3"/>
    <!-- Nub legs (three pairs) -->
    <path d="M40,53 C37,55 36,57 37,58" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M60,53 C63,55 64,57 63,58" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M41,63 C38,65 37,67 38,68" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M59,63 C62,65 63,67 62,68" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Tail nub -->
    <path d="M50,78 C49,82 51,82 50,83" fill="none" stroke="${c}" stroke-width="2.1" stroke-linecap="round"/>
    ${eating ? `<text x="${50 - foodStr.length * 2.4}" y="92" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>` : ''}
    ${dim ? `<text x="66" y="24" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>` : ''}`;

  // ── Stage 2: Larger caterpillar ────────────────────────────────────────────
  const eyeL2 = dim
    ? `<path d="M39,30 Q43,27 47,30" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`
    : `<circle cx="43" cy="30" r="3.2" fill="${c}"/><circle cx="42" cy="29" r="1.1" fill="white" opacity="0.8"/>`;
  const eyeR2 = dim
    ? `<path d="M53,30 Q57,27 61,30" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`
    : `<circle cx="57" cy="30" r="3.2" fill="${c}"/><circle cx="56" cy="29" r="1.1" fill="white" opacity="0.8"/>`;
  const mouth2 = happy || playful
    ? `<path d="M46,36 Q50,40 54,36" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`
    : eating ? `<circle cx="50" cy="37" r="2.5" fill="${c}" opacity="0.9"/>`
    : `<line x1="47" y1="37" x2="53" y2="37" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>`;

  const stage2 = `
    <!-- Antennae: longer, slightly clubbed -->
    <path d="M44,21 C41,15 38,11 35,8" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="35" cy="8" r="2.1" fill="${c}30" stroke="${c}" stroke-width="1.1"/>
    <path d="M56,21 C59,15 62,11 65,8" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="65" cy="8" r="2.1" fill="${c}30" stroke="${c}" stroke-width="1.1"/>
    <!-- Head -->
    <circle cx="50" cy="27" r="11.5" fill="${c}20" stroke="${c}" stroke-width="1.6"/>
    ${eyeL2}${eyeR2}${mouth2}
    <!-- Four body segments: growing, more defined -->
    <ellipse cx="50" cy="41" rx="11.5" ry="8.5" fill="${c}18" stroke="${c}" stroke-width="1.5"/>
    <ellipse cx="50" cy="52.5" rx="12.5" ry="8.5" fill="${c}18" stroke="${c}" stroke-width="1.5"/>
    <ellipse cx="50" cy="64" rx="11.5" ry="8" fill="${c}18" stroke="${c}" stroke-width="1.4"/>
    <ellipse cx="50" cy="74.5" rx="9.5" ry="7" fill="${c}18" stroke="${c}" stroke-width="1.3"/>
    <!-- Prolegs (three pairs) -->
    <path d="M38.5,41 C34,43 33,46 34,47" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M61.5,41 C66,43 67,46 66,47" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M37.5,52 C33,54 32,57 33,58" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M62.5,52 C67,54 68,57 67,58" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M38.5,64 C34,66 33,69 34,70" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M61.5,64 C66,66 67,69 66,70" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    <!-- Tail point -->
    <path d="M50,80 C49,85 51,86 50,87" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>
    ${eating ? `<text x="${50 - foodStr.length * 2.4}" y="94" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>` : ''}
    ${dim ? `<text x="65" y="18" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>` : ''}`;

  // ── Stage 3a: Spinning caterpillar (early Synthecyst) ─────────────────────
  const stage3a = `
    <!-- Antennae -->
    <path d="M44,19 C41,13 38,10 36,7" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="36" cy="7" r="1.9" fill="${c}28" stroke="${c}" stroke-width="1.0"/>
    <path d="M56,19 C59,13 62,10 64,7" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="64" cy="7" r="1.9" fill="${c}28" stroke="${c}" stroke-width="1.0"/>
    <!-- Head: tilted into spinning posture -->
    <circle cx="50" cy="26" r="11" fill="${c}20" stroke="${c}" stroke-width="1.6"/>
    <!-- Eyes: focused/intent -->
    ${dim
      ? `<path d="M43,26 Q46,23 49,26" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>
         <path d="M51,26 Q54,23 57,26" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`
      : `<circle cx="45" cy="26" r="2.9" fill="${c}"/><circle cx="44" cy="25" r="0.95" fill="white" opacity="0.8"/>
         <circle cx="55" cy="26" r="2.9" fill="${c}"/><circle cx="54" cy="25" r="0.95" fill="white" opacity="0.8"/>`
    }
    <!-- Silk strand from mouth -->
    <path d="M50,36 C50,44 51,54 50,67" fill="none" stroke="${c}" stroke-width="0.9" opacity="0.55" stroke-linecap="round"/>
    <path d="M50,36 C52,45 48,54 50,67" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.35" stroke-linecap="round"/>
    <!-- Body: curling toward the silk -->
    <ellipse cx="50" cy="41" rx="11" ry="7.5" fill="${c}18" stroke="${c}" stroke-width="1.5"/>
    <ellipse cx="49" cy="52" rx="11" ry="7.5" fill="${c}18" stroke="${c}" stroke-width="1.5"/>
    <ellipse cx="47" cy="63" rx="10" ry="7" fill="${c}18" stroke="${c}" stroke-width="1.4"/>
    <!-- Partial silk wrapping starting on body -->
    <path d="M39,41 C38,45 39,49 38,53" fill="none" stroke="${c}" stroke-width="0.75" opacity="0.42" stroke-linecap="round"/>
    <path d="M61,41 C62,45 61,49 62,53" fill="none" stroke="${c}" stroke-width="0.75" opacity="0.42" stroke-linecap="round"/>
    <path d="M39,52 C37,56 38,60 37,64" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.35" stroke-linecap="round"/>
    ${eating ? `<text x="${50 - foodStr.length * 2.4}" y="84" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>` : ''}
    ${dim ? `<text x="64" y="17" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>` : ''}`;

  // ── Stage 3b: Cocoon ───────────────────────────────────────────────────────
  const stage3b = `
    <!-- Silk thread from top -->
    <line x1="50" y1="4" x2="50" y2="23" stroke="${c}" stroke-width="1.0" stroke-linecap="round"/>
    <!-- Cocoon body -->
    <ellipse cx="50" cy="54" rx="17" ry="29" fill="${c}22" stroke="${c}" stroke-width="1.6"/>
    <!-- Silk wrapping bands -->
    <path d="M34,34 C40,31 60,31 66,34" fill="none" stroke="${c}" stroke-width="0.85" opacity="0.48" stroke-linecap="round"/>
    <path d="M33,40 C39,37 61,37 67,40" fill="none" stroke="${c}" stroke-width="0.85" opacity="0.48" stroke-linecap="round"/>
    <path d="M33,46 C39,43 61,43 67,46" fill="none" stroke="${c}" stroke-width="0.85" opacity="0.48" stroke-linecap="round"/>
    <path d="M33,52 C39,49 61,49 67,52" fill="none" stroke="${c}" stroke-width="0.85" opacity="0.48" stroke-linecap="round"/>
    <path d="M33,57 C39,54 61,54 67,57" fill="none" stroke="${c}" stroke-width="0.85" opacity="0.46" stroke-linecap="round"/>
    <path d="M33,63 C39,60 61,60 67,63" fill="none" stroke="${c}" stroke-width="0.85" opacity="0.44" stroke-linecap="round"/>
    <path d="M34,69 C40,66 60,66 66,69" fill="none" stroke="${c}" stroke-width="0.80" opacity="0.42" stroke-linecap="round"/>
    <path d="M36,74 C41,71 59,71 64,74" fill="none" stroke="${c}" stroke-width="0.75" opacity="0.38" stroke-linecap="round"/>
    <path d="M38,79 C43,76 57,76 62,79" fill="none" stroke="${c}" stroke-width="0.70" opacity="0.32" stroke-linecap="round"/>
    <!-- Faint inner creature silhouette -->
    <ellipse cx="50" cy="50" rx="8" ry="15" fill="${c}09" stroke="${c}" stroke-width="0.7" opacity="0.38"/>
    <!-- Subtle cracking at bottom tip (almost-ready feel) -->
    <path d="M48,81 C49,83 51,83 52,81" fill="none" stroke="${c}" stroke-width="1.1" opacity="0.55" stroke-linecap="round"/>
    ${dim ? `<text x="70" y="28" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>` : ''}`;

  // ── Stage 4: Freshly emerged moth — crumpled wings ────────────────────────
  const eyeL4 = dim
    ? `<path d="M40,45 Q43,42 46,45" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`
    : `<circle cx="43" cy="45" r="2.9" fill="${c}"/><circle cx="42" cy="44" r="1.0" fill="white" opacity="0.8"/>`;
  const eyeR4 = dim
    ? `<path d="M54,45 Q57,42 60,45" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`
    : `<circle cx="57" cy="45" r="2.9" fill="${c}"/><circle cx="56" cy="44" r="1.0" fill="white" opacity="0.8"/>`;
  const mouth4 = happy || playful
    ? `<path d="M46,51 Q50,55 54,51" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`
    : eating ? `<circle cx="50" cy="51" r="2.5" fill="${c}" opacity="0.9"/>`
    : `<line x1="47" y1="51" x2="53" y2="51" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>`;

  const stage4 = `
    <!-- Antennae: drooping, not yet erect -->
    <path d="M45,37 C42,31 38,24 34,19" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M34,19 C31,16 29,15 27,14" fill="none" stroke="${c}" stroke-width="1.0" opacity="0.65" stroke-linecap="round"/>
    <path d="M55,37 C58,31 62,24 66,19" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M66,19 C69,16 71,15 73,14" fill="none" stroke="${c}" stroke-width="1.0" opacity="0.65" stroke-linecap="round"/>
    <!-- Left upper wing: crumpled, irregular, folded inward -->
    <path d="M44,42 C37,41 24,44 20,53 C17,60 20,68 27,68 C35,68 42,59 44,53 C44,49 44,45 44,42 Z"
      fill="${bc}20" stroke="${c}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity="0.78"/>
    <!-- Left upper wing crease/fold lines -->
    <path d="M44,44 C37,47 30,51 24,57" fill="none" stroke="${c}" stroke-width="0.75" opacity="0.33" stroke-linecap="round"/>
    <path d="M44,49 C38,52 33,55 28,61" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.27" stroke-linecap="round"/>
    <!-- Left lower wing: small, tucked below -->
    <path d="M44,56 C38,57 28,63 26,72 C24,78 27,82 34,79 C40,76 44,67 44,61 Z"
      fill="${bc}14" stroke="${c}" stroke-width="1.0" stroke-linecap="round" stroke-linejoin="round" opacity="0.62"/>
    <!-- Right upper wing: crumpled -->
    <path d="M56,42 C63,41 76,44 80,53 C83,60 80,68 73,68 C65,68 58,59 56,53 C56,49 56,45 56,42 Z"
      fill="${bc}20" stroke="${c}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" opacity="0.78"/>
    <path d="M56,44 C63,47 70,51 76,57" fill="none" stroke="${c}" stroke-width="0.75" opacity="0.33" stroke-linecap="round"/>
    <path d="M56,49 C62,52 67,55 72,61" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.27" stroke-linecap="round"/>
    <!-- Right lower wing -->
    <path d="M56,56 C62,57 72,63 74,72 C76,78 73,82 66,79 C60,76 56,67 56,61 Z"
      fill="${bc}14" stroke="${c}" stroke-width="1.0" stroke-linecap="round" stroke-linejoin="round" opacity="0.62"/>
    <!-- Body: elongated, slightly wet-looking -->
    <ellipse cx="50" cy="53" rx="7.5" ry="18" fill="${c}24" stroke="${c}" stroke-width="1.6"/>
    <!-- Body segments (faint) -->
    <path d="M43,45 Q50,45 57,45" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.32" stroke-linecap="round"/>
    <path d="M43,51 Q50,51 57,51" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.32" stroke-linecap="round"/>
    <path d="M43,57 Q50,57 57,57" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.28" stroke-linecap="round"/>
    <path d="M44,63 Q50,63 56,63" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.22" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="50" cy="41" r="7.5" fill="${c}24" stroke="${c}" stroke-width="1.6"/>
    ${eyeL4}${eyeR4}${mouth4}
    <!-- Legs: 3 pairs, spindly -->
    <path d="M43,51 C39,54 35,55 32,57" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M43,57 C39,60 35,62 32,64" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M43,63 C39,66 36,68 34,70" fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="round"/>
    <path d="M57,51 C61,54 65,55 68,57" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M57,57 C61,60 65,62 68,64" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M57,63 C61,66 64,68 66,70" fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="round"/>
    ${eating ? `<text x="${50 - foodStr.length * 2.4}" y="86" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>` : ''}
    ${dim ? `<text x="62" y="26" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>` : ''}`;

  // ── Stage 5: Transcendent moth ─────────────────────────────────────────────
  const eyeL5 = dim
    ? `<path d="M39,41 Q43,38 47,41" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`
    : `<circle cx="43" cy="41" r="3.1" fill="${c}"/><circle cx="42" cy="40" r="1.1" fill="white" opacity="0.9"/>`;
  const eyeR5 = dim
    ? `<path d="M53,41 Q57,38 61,41" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`
    : `<circle cx="57" cy="41" r="3.1" fill="${c}"/><circle cx="56" cy="40" r="1.1" fill="white" opacity="0.9"/>`;
  const mouth5 = happy || playful
    ? `<path d="M46,47 Q50,51 54,47" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`
    : eating ? `<circle cx="50" cy="47" r="2.5" fill="${c}" opacity="0.9"/>`
    : `<line x1="47" y1="47" x2="53" y2="47" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>`;

  const stage5 = `
    <!-- Outer shimmer -->
    <ellipse cx="50" cy="50" rx="47" ry="46" fill="none" stroke="${c}" stroke-width="0.3" stroke-dasharray="1,8" opacity="0.18"/>
    <!-- Antennae: long, feathery, spread wide -->
    <path d="M45,34 C40,24 32,14 22,7" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/>
    <!-- Left antenna barbs -->
    <path d="M43,29 C40,27 38,27 36,28" fill="none" stroke="${c}" stroke-width="0.75" opacity="0.48" stroke-linecap="round"/>
    <path d="M43,29 C44,26 44,25 44,23" fill="none" stroke="${c}" stroke-width="0.75" opacity="0.48" stroke-linecap="round"/>
    <path d="M39,23 C36,21 34,21 32,22" fill="none" stroke="${c}" stroke-width="0.70" opacity="0.44" stroke-linecap="round"/>
    <path d="M39,23 C40,20 41,19 41,17" fill="none" stroke="${c}" stroke-width="0.70" opacity="0.44" stroke-linecap="round"/>
    <path d="M34,17 C31,15 29,15 27,16" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.38" stroke-linecap="round"/>
    <path d="M34,17 C35,14 36,13 36,11" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.38" stroke-linecap="round"/>
    <path d="M55,34 C60,24 68,14 78,7" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/>
    <!-- Right antenna barbs -->
    <path d="M57,29 C60,27 62,27 64,28" fill="none" stroke="${c}" stroke-width="0.75" opacity="0.48" stroke-linecap="round"/>
    <path d="M57,29 C56,26 56,25 56,23" fill="none" stroke="${c}" stroke-width="0.75" opacity="0.48" stroke-linecap="round"/>
    <path d="M61,23 C64,21 66,21 68,22" fill="none" stroke="${c}" stroke-width="0.70" opacity="0.44" stroke-linecap="round"/>
    <path d="M61,23 C60,20 59,19 59,17" fill="none" stroke="${c}" stroke-width="0.70" opacity="0.44" stroke-linecap="round"/>
    <path d="M66,17 C69,15 71,15 73,16" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.38" stroke-linecap="round"/>
    <path d="M66,17 C65,14 64,13 64,11" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.38" stroke-linecap="round"/>
    <!-- Left upper wing: fully spread with eye-spot, edges dissolving -->
    <path d="M46,37 C37,29 14,21 5,31 C-1,40 3,61 18,62 C31,63 43,53 46,46 Z"
      fill="${bc}22" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Left upper wing veins -->
    <path d="M46,39 C35,35 20,31 8,35" fill="none" stroke="${c}" stroke-width="0.75" opacity="0.35" stroke-linecap="round"/>
    <path d="M46,44 C37,42 26,40 16,44" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.28" stroke-linecap="round"/>
    <path d="M46,49 C39,50 30,52 22,56" fill="none" stroke="${c}" stroke-width="0.60" opacity="0.24" stroke-linecap="round"/>
    <!-- Left eye-spot -->
    <circle cx="20" cy="44" r="6.5" fill="${c}16" stroke="${c}" stroke-width="1.0" opacity="0.7"/>
    <circle cx="20" cy="44" r="3.8" fill="${c}30" stroke="${c}" stroke-width="0.8" opacity="0.82"/>
    <circle cx="20" cy="44" r="1.6" fill="${c}" opacity="0.92"/>
    <!-- Dissolving edge particles — left upper wing -->
    <circle cx="6" cy="32" r="1.3" fill="${c}" opacity="0.44"/>
    <circle cx="3" cy="40" r="1.0" fill="${c}" opacity="0.34"/>
    <circle cx="4" cy="50" r="1.1" fill="${c}" opacity="0.29"/>
    <circle cx="9" cy="58" r="0.9" fill="${c}" opacity="0.23"/>
    <circle cx="16" cy="63" r="0.8" fill="${c}" opacity="0.18"/>
    <circle cx="11" cy="27" r="0.8" fill="${c}" opacity="0.27"/>
    <!-- Right upper wing -->
    <path d="M54,37 C63,29 86,21 95,31 C101,40 97,61 82,62 C69,63 57,53 54,46 Z"
      fill="${bc}22" stroke="${c}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M54,39 C65,35 80,31 92,35" fill="none" stroke="${c}" stroke-width="0.75" opacity="0.35" stroke-linecap="round"/>
    <path d="M54,44 C63,42 74,40 84,44" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.28" stroke-linecap="round"/>
    <path d="M54,49 C61,50 70,52 78,56" fill="none" stroke="${c}" stroke-width="0.60" opacity="0.24" stroke-linecap="round"/>
    <!-- Right eye-spot -->
    <circle cx="80" cy="44" r="6.5" fill="${c}16" stroke="${c}" stroke-width="1.0" opacity="0.7"/>
    <circle cx="80" cy="44" r="3.8" fill="${c}30" stroke="${c}" stroke-width="0.8" opacity="0.82"/>
    <circle cx="80" cy="44" r="1.6" fill="${c}" opacity="0.92"/>
    <!-- Dissolving edge particles — right upper wing -->
    <circle cx="94" cy="32" r="1.3" fill="${c}" opacity="0.44"/>
    <circle cx="97" cy="40" r="1.0" fill="${c}" opacity="0.34"/>
    <circle cx="96" cy="50" r="1.1" fill="${c}" opacity="0.29"/>
    <circle cx="91" cy="58" r="0.9" fill="${c}" opacity="0.23"/>
    <circle cx="84" cy="63" r="0.8" fill="${c}" opacity="0.18"/>
    <circle cx="89" cy="27" r="0.8" fill="${c}" opacity="0.27"/>
    <!-- Left lower wing -->
    <path d="M46,52 C39,53 22,61 17,73 C14,81 19,87 30,84 C40,81 46,68 46,60 Z"
      fill="${bc}17" stroke="${c}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" opacity="0.84"/>
    <path d="M45,55 C37,61 26,69 20,77" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.30" stroke-linecap="round"/>
    <!-- Dissolving — left lower -->
    <circle cx="16" cy="75" r="1.0" fill="${c}" opacity="0.28"/>
    <circle cx="14" cy="82" r="0.8" fill="${c}" opacity="0.20"/>
    <circle cx="21" cy="86" r="0.7" fill="${c}" opacity="0.16"/>
    <!-- Right lower wing -->
    <path d="M54,52 C61,53 78,61 83,73 C86,81 81,87 70,84 C60,81 54,68 54,60 Z"
      fill="${bc}17" stroke="${c}" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" opacity="0.84"/>
    <path d="M55,55 C63,61 74,69 80,77" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.30" stroke-linecap="round"/>
    <!-- Dissolving — right lower -->
    <circle cx="84" cy="75" r="1.0" fill="${c}" opacity="0.28"/>
    <circle cx="86" cy="82" r="0.8" fill="${c}" opacity="0.20"/>
    <circle cx="79" cy="86" r="0.7" fill="${c}" opacity="0.16"/>
    <!-- Body: semi-translucent -->
    <ellipse cx="50" cy="51" rx="7.5" ry="18.5" fill="${c}26" stroke="${c}" stroke-width="1.5" opacity="0.9"/>
    <path d="M43,43 Q50,43 57,43" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.32" stroke-linecap="round"/>
    <path d="M43,49 Q50,49 57,49" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.32" stroke-linecap="round"/>
    <path d="M43,55 Q50,55 57,55" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.26" stroke-linecap="round"/>
    <path d="M44,61 Q50,61 56,61" fill="none" stroke="${c}" stroke-width="0.60" opacity="0.20" stroke-linecap="round"/>
    <!-- Head -->
    <circle cx="50" cy="37" r="8" fill="${c}30" stroke="${c}" stroke-width="1.6" opacity="0.92"/>
    ${eyeL5}${eyeR5}${mouth5}
    <!-- Legs -->
    <path d="M43,49 C39,52 35,53 32,55" fill="none" stroke="${c}" stroke-width="1.1" opacity="0.82" stroke-linecap="round"/>
    <path d="M43,55 C39,58 35,60 32,62" fill="none" stroke="${c}" stroke-width="1.1" opacity="0.82" stroke-linecap="round"/>
    <path d="M43,61 C39,64 36,66 33,68" fill="none" stroke="${c}" stroke-width="1.0" opacity="0.78" stroke-linecap="round"/>
    <path d="M57,49 C61,52 65,53 68,55" fill="none" stroke="${c}" stroke-width="1.1" opacity="0.82" stroke-linecap="round"/>
    <path d="M57,55 C61,58 65,60 68,62" fill="none" stroke="${c}" stroke-width="1.1" opacity="0.82" stroke-linecap="round"/>
    <path d="M57,61 C61,64 64,66 67,68" fill="none" stroke="${c}" stroke-width="1.0" opacity="0.78" stroke-linecap="round"/>
    <!-- Orbiting glow particles -->
    <circle cx="50" cy="7" r="2.1" fill="${c}" opacity="0.58"/>
    <circle cx="80" cy="17" r="1.6" fill="${c}" opacity="0.48"/>
    <circle cx="20" cy="17" r="1.6" fill="${c}" opacity="0.48"/>
    <circle cx="90" cy="52" r="1.9" fill="${c}" opacity="0.42"/>
    <circle cx="10" cy="52" r="1.9" fill="${c}" opacity="0.42"/>
    <!-- Geometric hexagonal overlay on body (sacred geometry feeling) -->
    <path d="M50,28 L55.5,31.5 L55.5,38.5 L50,42 L44.5,38.5 L44.5,31.5 Z"
      fill="none" stroke="${c}" stroke-width="0.55" stroke-dasharray="1.5,2.5" opacity="0.28"/>
    ${eating ? `<text x="${50 - foodStr.length * 2.4}" y="86" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>` : ''}
    ${dim ? `<text x="63" y="24" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>` : ''}`;

  // ── Assemble ───────────────────────────────────────────────────────────────
  const stages = [stage0, stage1, stage2, cocooned ? stage3b : stage3a, stage4, stage5];
  const body = stages[Math.min(evoIdx, 5)];

  // Feature overlays only on emerged stages (4+) — overlays on a caterpillar look odd
  const overlays = evoIdx >= 4 ? featureOverlays(features, 'moth') : '';

  return `<svg class="creature-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">` +
    `<defs><filter id="glow"><feGaussianBlur stdDeviation="1.5" result="b"/>` +
    `<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>` +
    `<g filter="url(#glow)">${body}${overlays}</g></svg>`;
}

module.exports = { buildMothCreatureSVG, COCOON_XP };
