'use strict';

const { featureOverlays } = require('../features');

// ── CRAB CREATURE (Rust) ──────────────────────────────────────────────────────
// Crustacean metamorphosis arc:
//   0  Eggling    → egg mass on rock substrate
//   1  Glitchling → zoea larva (alien, dorsal spine, huge compound eye)
//   2  Codespawn  → megalopa (shrimp-crab hybrid, proto-claws)
//   3  Synthecyst → juvenile crab (familiar base creature body + claw tips)
//   4  Archetype  → adult crab (wide carapace, stalked eyes, full claws)
//   5  Paradigm   → Ferric Sovereign (transcendent armored crab, runic plates)

function buildCrabCreatureSVG(evoIdx, c, bc, mood, features, xp, foodStr = '') {
  const dim     = mood === 'sleeping' || mood === 'drowsy';
  const happy   = mood === 'happy';
  const playful = mood === 'playful';
  const eating  = mood === 'eating';

  // ── Stage 0: Egg mass on rock ───────────────────────────────────────────────
  const stage0 = `
    <!-- Rock substrate -->
    <path d="M18,82 C22,78 40,76 50,76 C60,76 78,78 82,82 C80,88 62,90 50,90 C38,90 20,88 18,82 Z"
      fill="${c}20" stroke="${c}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M24,83 C28,82 34,82 38,83" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.38" stroke-linecap="round"/>
    <path d="M60,82 C65,81 71,82 75,83" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.38" stroke-linecap="round"/>
    <!-- Egg cluster: tight mass of translucent spheres -->
    <ellipse cx="44" cy="69" rx="4.5" ry="4.5" fill="${c}30" stroke="${c}" stroke-width="1.1"/>
    <ellipse cx="52" cy="67" rx="4.5" ry="4.5" fill="${c}30" stroke="${c}" stroke-width="1.1"/>
    <ellipse cx="59.5" cy="70" rx="4.5" ry="4.5" fill="${c}30" stroke="${c}" stroke-width="1.1"/>
    <ellipse cx="47" cy="75" rx="4.5" ry="4.5" fill="${c}30" stroke="${c}" stroke-width="1.1"/>
    <ellipse cx="55.5" cy="74.5" rx="4.5" ry="4.5" fill="${c}30" stroke="${c}" stroke-width="1.1"/>
    <ellipse cx="63" cy="75.5" rx="4.0" ry="4.0" fill="${c}28" stroke="${c}" stroke-width="1.0"/>
    <ellipse cx="40" cy="75" rx="4.0" ry="4.0" fill="${c}28" stroke="${c}" stroke-width="1.0"/>
    <!-- Egg shine -->
    <circle cx="43" cy="67.5" r="1.1" fill="white" opacity="0.52"/>
    <circle cx="51" cy="65.5" r="1.1" fill="white" opacity="0.52"/>
    <circle cx="58.5" cy="68.5" r="1.1" fill="white" opacity="0.52"/>
    <circle cx="46" cy="73.5" r="1.0" fill="white" opacity="0.48"/>
    <circle cx="54.5" cy="73" r="1.0" fill="white" opacity="0.48"/>
    <!-- Larva shadow inside two eggs (foreshadowing) -->
    <ellipse cx="52" cy="67.5" rx="2.2" ry="2.8" fill="${c}18" stroke="none"/>
    <ellipse cx="55.5" cy="75" rx="2.0" ry="2.5" fill="${c}18" stroke="none"/>
    ${eating ? `<text x="${50 - foodStr.length * 2.4}" y="95" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>` : ''}
    ${dim ? `<text x="64" y="62" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>` : ''}`;

  // ── Stage 1: Zoea larva ─────────────────────────────────────────────────────
  const eye1 = dim
    ? `<path d="M43,47 Q50,44 57,47" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`
    : `<circle cx="50" cy="47" r="7.5" fill="${c}28" stroke="${c}" stroke-width="1.4"/>
       <circle cx="50" cy="47" r="5.5" fill="${c}18" stroke="${c}" stroke-width="0.7" opacity="0.6"/>
       <circle cx="50" cy="47" r="3.0" fill="${c}" opacity="0.9"/>
       <circle cx="48.5" cy="45.5" r="1.1" fill="white" opacity="0.75"/>
       <path d="M44,44 L56,50" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.25"/>
       <path d="M44,50 L56,44" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.25"/>
       <path d="M43,47 L57,47" fill="none" stroke="${c}" stroke-width="0.4" opacity="0.25"/>`;
  const mouth1 = eating
    ? `<circle cx="50" cy="57" r="2.0" fill="${c}" opacity="0.85"/>`
    : `<path d="M47,57 Q50,59 53,57" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>`;

  const stage1 = `
    <!-- Dorsal spine -->
    <path d="M50,28 C50,18 50,12 50,8" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M50,8 C49,5 51,5 50,3" fill="none" stroke="${c}" stroke-width="1.3" stroke-linecap="round" opacity="0.7"/>
    <!-- Rostral spine (forward) -->
    <path d="M50,36 C53,30 56,27 59,24" fill="none" stroke="${c}" stroke-width="1.3" stroke-linecap="round" opacity="0.75"/>
    <!-- Body -->
    <ellipse cx="50" cy="47" rx="13" ry="11" fill="${c}18" stroke="${c}" stroke-width="1.5"/>
    ${eye1}${mouth1}
    <!-- Segmented abdomen -->
    <ellipse cx="50" cy="60" rx="7" ry="6" fill="${c}16" stroke="${c}" stroke-width="1.3"/>
    <ellipse cx="50" cy="69" rx="5.5" ry="5" fill="${c}14" stroke="${c}" stroke-width="1.2"/>
    <ellipse cx="50" cy="77" rx="4" ry="4" fill="${c}12" stroke="${c}" stroke-width="1.1"/>
    <!-- Tail fan -->
    <path d="M46,80 C43,84 42,87 44,88" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M50,81 C50,85 50,88 50,89" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M54,80 C57,84 58,87 56,88" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <!-- Swimming appendages -->
    <path d="M39,47 C34,43 31,42 29,43" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M39,50 C34,50 31,51 29,53" fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="round"/>
    <path d="M61,47 C66,43 69,42 71,43" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M61,50 C66,50 69,51 71,53" fill="none" stroke="${c}" stroke-width="1.1" stroke-linecap="round"/>
    ${eating ? `<text x="${50 - foodStr.length * 2.4}" y="95" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>` : ''}
    ${dim ? `<text x="60" y="20" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>` : ''}`;

  // ── Stage 2: Megalopa (shrimp-crab hybrid) ──────────────────────────────────
  const eyeL2 = dim
    ? `<path d="M37,37 Q40,34 43,37" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`
    : `<circle cx="40" cy="37" r="3.5" fill="${c}28" stroke="${c}" stroke-width="1.0"/>
       <circle cx="40" cy="37" r="2.0" fill="${c}" opacity="0.9"/>
       <circle cx="39" cy="36" r="0.8" fill="white" opacity="0.75"/>`;
  const eyeR2 = dim
    ? `<path d="M57,37 Q60,34 63,37" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`
    : `<circle cx="60" cy="37" r="3.5" fill="${c}28" stroke="${c}" stroke-width="1.0"/>
       <circle cx="60" cy="37" r="2.0" fill="${c}" opacity="0.9"/>
       <circle cx="59" cy="36" r="0.8" fill="white" opacity="0.75"/>`;
  const mouth2 = happy || playful
    ? `<path d="M46,44 Q50,48 54,44" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>`
    : eating
    ? `<circle cx="50" cy="44" r="2.2" fill="${c}" opacity="0.9"/>`
    : `<line x1="47" y1="44" x2="53" y2="44" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>`;

  const stage2 = `
    <!-- Eye stalks -->
    <line x1="40" y1="30" x2="40" y2="37" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>
    <line x1="60" y1="30" x2="60" y2="37" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>
    ${eyeL2}${eyeR2}
    <!-- Antennae (long, thin) -->
    <path d="M44,27 C40,20 35,14 30,9" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M56,27 C60,20 65,14 70,9" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>
    <!-- Carapace (head-shield) -->
    <path d="M38,28 C38,22 62,22 62,28 C62,42 58,46 50,46 C42,46 38,42 38,28 Z"
      fill="${c}20" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${mouth2}
    <!-- Proto-claws (chelipeds, small) -->
    <path d="M39,38 C34,37 30,36 27,37" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M27,37 C24,36 23,38 24,40" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M27,37 C25,35 24,34 25,32" fill="none" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M61,38 C66,37 70,36 73,37" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M73,37 C76,36 77,38 76,40" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M73,37 C75,35 76,34 75,32" fill="none" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>
    <!-- Thorax -->
    <ellipse cx="50" cy="52" rx="10" ry="7" fill="${c}18" stroke="${c}" stroke-width="1.4"/>
    <!-- Walking legs (small, 2 pairs) -->
    <path d="M41,50 C38,55 36,58 35,60" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M41,53 C38,58 36,61 35,63" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M59,50 C62,55 64,58 65,60" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M59,53 C62,58 64,61 65,63" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <!-- Segmented abdomen curling under -->
    <ellipse cx="50" cy="62" rx="9" ry="6.5" fill="${c}16" stroke="${c}" stroke-width="1.3"/>
    <ellipse cx="50" cy="71" rx="7" ry="5.5" fill="${c}14" stroke="${c}" stroke-width="1.2"/>
    <ellipse cx="50" cy="79" rx="5.5" ry="4.5" fill="${c}12" stroke="${c}" stroke-width="1.1"/>
    <!-- Tail fan -->
    <path d="M44,83 C41,87 40,90 43,91" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M50,84 C50,88 50,91 50,92" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    <path d="M56,83 C59,87 60,90 57,91" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>
    ${eating ? `<text x="${50 - foodStr.length * 2.4}" y="96" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>` : ''}
    ${dim ? `<text x="63" y="18" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>` : ''}`;

  // ── Stage 3: Juvenile crab — the familiar base creature body ────────────────
  // Same head / antennae / arms / legs as the base default creature.
  // The arm paths naturally look like stubby claw-arms; pincer tips added.
  const eyeL3 = dim
    ? `<path d="M38.11,45.99 C44.17,45.87 46.55,45.05 47.54,44.63"
        fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`
    : `<path d="M44.25,41.73 C43.64,41.50 42.96,41.47 41.78,41.44 C39.76,42.52 38.97,43.52 38.30,44.38
               C37.87,46.57 38.21,47.51 38.53,48.35 C39.90,49.65 40.70,49.98 41.44,50.26
               C43.48,50.06 44.63,49.71 45.81,49.33 C47.48,47.98 47.86,47.03 48.23,46.06
               C48.08,44.56 47.86,44.18 47.14,42.98 C45.22,41.69 43.92,41.37 41.61,41.56"
        fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  const eyeR3 = dim
    ? `<path d="M52.33,44.80 C54.82,44.73 57.38,44.43 59.94,44.20"
        fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`
    : `<path d="M54.43,41.62 C53.86,41.79 52.48,43.48 52.39,44.31 C52.31,45.34 53.20,46.96 54.46,47.83
               C55.10,48.26 56.39,48.70 57.04,48.72 C57.90,48.71 59.59,47.88 60.54,46.78
               C61.24,45.96 61.54,44.18 61.03,43.31 C60.58,42.56 58.38,41.16 57.59,41.00
               C56.53,40.80 53.83,42.19 53.16,43.49"
        fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
  const mouth3 = happy || playful
    ? `<path d="M49.32,52.84 C49.50,53.47 49.75,53.63 51.09,53.93 C51.91,53.68 52.27,53.50 52.45,53.40"
        fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`
    : eating
    ? `<path d="M51.44,53.05 C50.20,52.71 48.46,52.98 47.23,53.33 C49.82,52.51 51.00,51.96 52.67,52.78"
        fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>`
    : `<path d="M49.46,52.34 C49.16,52.21 49.13,53.32 49.60,53.47 C51.22,53.89 50.02,52.94 50.04,53.04"
        fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;

  const stage3 = `
    <!-- HEAD — same shape as the familiar base creature -->
    <path d="M46.96,34.36 C46.97,34.22 46.22,33.75 40.78,35.52 C37.53,38.41 36.18,39.64 34.79,42.40
             C34.56,44.01 34.37,45.45 34.65,48.58 C35.19,49.99 35.86,51.66 38.11,54.77
             C39.50,55.84 40.81,56.81 44.08,57.91 C47.86,58.54 51.20,59.07 59.59,57.39
             C61.75,56.12 64.42,54.49 66.79,50.70 C66.98,49.29 67.12,47.84 66.27,43.87
             C65.80,42.77 64.91,40.72 59.69,35.84 C56.64,34.96 54.54,34.38 46.76,33.92
             C44.85,34.44 43.66,34.78 41.29,36.01 C40.13,36.89 39.51,37.36 38.23,38.63"
      fill="${c}18" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- ANTENNAE -->
    <path d="M55.66,39.24 C56.16,38.99 58.19,38.19 62.85,33.38 C63.49,30.39 63.70,29.24 63.59,27.40 C63.46,26.09 63.33,24.91 63.33,24.91"
      fill="none" stroke="${c}" stroke-width="2.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M43.75,39.48 C42.43,38.77 41.84,38.04 41.29,37.33 C39.94,34.49 39.48,32.33 38.98,29.86 C39.53,24.16 39.57,23.40 39.57,23.40"
      fill="none" stroke="${c}" stroke-width="2.80" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- EYES -->
    ${eyeL3}${eyeR3}
    <!-- MOUTH -->
    ${mouth3}
    <!-- BODY STUB -->
    <path d="M45.97,59.52 C45.05,59.33 44.03,62.65 45.29,64.84 C46.15,66.26 50.38,68.08 51.77,67.69
             C52.58,67.44 55.34,65.57 56.41,64.19 C56.85,63.60 57.18,61.01 56.54,59.21"
      fill="${c}15" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- CLAW-ARMS (base arm paths + pincer tips) -->
    <path d="M43.44,59.33 C42.84,59.62 41.57,60.44 39.44,61.87 C39.32,62.31 39.50,62.89 39.50,62.89"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38.86,62.99 C39.77,63.33 40.81,62.80 41.82,62.27"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M42.75,60.22 C42.14,60.88 41.49,61.38 40.34,62.39"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Left pincer tip -->
    <path d="M38.86,63.0 C37.5,64.0 36.8,65.2 37.5,66.0" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M38.86,63.0 C37.8,62.0 37.0,62.5 37.5,63.8" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M57.29,58.84 C58.24,58.94 59.38,59.57 61.63,60.49"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M58.49,58.48 C60.45,59.83 61.30,60.43 62.36,62.20 C62.08,62.81 60.77,61.76 60.63,61.15"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M61.02,61.30 C61.78,61.77 62.34,62.39 62.34,62.39"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Right pincer tip -->
    <path d="M62.34,62.39 C63.8,63.2 64.5,64.5 63.8,65.3" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M62.34,62.39 C63.5,61.4 64.2,61.9 63.7,63.2" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <!-- LEGS (base legs) -->
    <path d="M45.96,65.92 C45.40,66.35 46.76,70.48 46.89,71.57"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44.79,64.93 C45.03,65.95 46.35,69.35 46.84,70.79"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44.81,66.82 C45.40,68.91 46.14,70.87 46.98,72.95"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M55.91,65.33 C55.66,65.84 55.33,69.35 55.22,70.60"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M56.06,65.34 C55.64,68.36 55.40,69.59 55.22,70.90"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M56.23,65.76 C55.35,70.55 55.05,71.65 54.66,72.92"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    ${eating ? `<text x="${50 - foodStr.length * 2.4}" y="82" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>` : ''}
    ${dim ? `<text x="65" y="30" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>` : ''}`;

  // ── Stage 4: Adult crab ─────────────────────────────────────────────────────
  const eyeL4 = dim
    ? `<path d="M37,38 Q40,35 43,38" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`
    : `<circle cx="40" cy="38" r="3.2" fill="${c}28" stroke="${c}" stroke-width="1.0"/>
       <circle cx="40" cy="38" r="2.0" fill="${c}" opacity="0.9"/>
       <circle cx="39" cy="37" r="0.85" fill="white" opacity="0.78"/>`;
  const eyeR4 = dim
    ? `<path d="M57,38 Q60,35 63,38" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`
    : `<circle cx="60" cy="38" r="3.2" fill="${c}28" stroke="${c}" stroke-width="1.0"/>
       <circle cx="60" cy="38" r="2.0" fill="${c}" opacity="0.9"/>
       <circle cx="59" cy="37" r="0.85" fill="white" opacity="0.78"/>`;
  const mouth4 = happy || playful
    ? `<path d="M46,53 Q50,57 54,53" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>`
    : eating
    ? `<circle cx="50" cy="53" r="2.2" fill="${c}" opacity="0.9"/>`
    : `<line x1="47" y1="53" x2="53" y2="53" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>`;

  const stage4 = `
    <!-- Eye stalks -->
    <line x1="40" y1="30" x2="40" y2="38" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    <line x1="60" y1="30" x2="60" y2="38" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    ${eyeL4}${eyeR4}
    <!-- Antennae -->
    <path d="M44,29 C38,19 32,13 26,8" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M56,29 C62,19 68,13 74,8" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>
    <!-- Left big claw -->
    <path d="M38,43 C32,40 23,38 17,40" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M17,40 C10,38 7,42 10,47" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M17,40 C12,37 10,33 14,30" fill="none" stroke="${c}" stroke-width="2.0" stroke-linecap="round"/>
    <ellipse cx="14" cy="39" rx="5" ry="4" fill="${c}20" stroke="${c}" stroke-width="1.5"/>
    <!-- Right big claw -->
    <path d="M62,43 C68,40 77,38 83,40" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M83,40 C90,38 93,42 90,47" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M83,40 C88,37 90,33 86,30" fill="none" stroke="${c}" stroke-width="2.0" stroke-linecap="round"/>
    <ellipse cx="86" cy="39" rx="5" ry="4" fill="${c}20" stroke="${c}" stroke-width="1.5"/>
    <!-- Carapace (wide, slightly hexagonal) -->
    <path d="M33,30 C38,24 62,24 67,30 C72,36 72,56 67,62 C62,68 38,68 33,62 C28,56 28,36 33,30 Z"
      fill="${c}22" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Carapace groove lines -->
    <path d="M50,25 C50,30 50,35 50,40" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.35" stroke-linecap="round"/>
    <path d="M38,28 C42,33 50,35 58,33 C62,30 64,28 64,28" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.30" stroke-linecap="round"/>
    <path d="M34,46 C38,48 50,49 62,48 C66,47 68,46 68,46" fill="none" stroke="${c}" stroke-width="0.60" opacity="0.28" stroke-linecap="round"/>
    ${mouth4}
    <!-- Walking legs: 4 per side -->
    <path d="M36,48 C30,52 25,55 22,57" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M35,53 C29,57 24,61 21,63" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M36,58 C30,63 26,67 23,70" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M37,63 C32,68 29,72 28,75" fill="none" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M64,48 C70,52 75,55 78,57" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M65,53 C71,57 76,61 79,63" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M64,58 C70,63 74,67 77,70" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M63,63 C68,68 71,72 72,75" fill="none" stroke="${c}" stroke-width="1.3" stroke-linecap="round"/>
    ${eating ? `<text x="${50 - foodStr.length * 2.4}" y="90" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>` : ''}
    ${dim ? `<text x="67" y="20" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>` : ''}`;

  // ── Stage 5: Ferric Sovereign ───────────────────────────────────────────────
  // Transcendent armored crab — Rust-themed: runic lifetime sigils on the
  // carapace, massive claws with glowing tips, orbiting gear fragments.
  const eyeL5 = dim
    ? `<path d="M34,40 Q38,37 42,40" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`
    : `<circle cx="38" cy="40" r="4.0" fill="${c}30" stroke="${c}" stroke-width="1.2"/>
       <circle cx="38" cy="40" r="2.5" fill="${c}" opacity="0.95"/>
       <circle cx="37" cy="39" r="1.0" fill="white" opacity="0.8"/>`;
  const eyeR5 = dim
    ? `<path d="M58,40 Q62,37 66,40" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>`
    : `<circle cx="62" cy="40" r="4.0" fill="${c}30" stroke="${c}" stroke-width="1.2"/>
       <circle cx="62" cy="40" r="2.5" fill="${c}" opacity="0.95"/>
       <circle cx="61" cy="39" r="1.0" fill="white" opacity="0.8"/>`;
  const mouth5 = happy || playful
    ? `<path d="M46,54 Q50,58 54,54" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>`
    : eating
    ? `<circle cx="50" cy="54" r="2.2" fill="${c}" opacity="0.9"/>`
    : `<line x1="47" y1="54" x2="53" y2="54" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>`;

  const stage5 = `
    <!-- Outer aura ring -->
    <ellipse cx="50" cy="50" rx="47" ry="46" fill="none" stroke="${c}" stroke-width="0.4" stroke-dasharray="1,7" opacity="0.20"/>
    <!-- Eye stalks — armored -->
    <rect x="36" y="24" width="4" height="16" rx="2" fill="${c}20" stroke="${c}" stroke-width="1.2"/>
    <rect x="60" y="24" width="4" height="16" rx="2" fill="${c}20" stroke="${c}" stroke-width="1.2"/>
    ${eyeL5}${eyeR5}
    <!-- Antennae: thick, barbed -->
    <path d="M42,28 C36,17 28,10 20,5" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M35,18 C32,17 30,17 28,19" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.45" stroke-linecap="round"/>
    <path d="M28,12 C25,11 23,11 21,13" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.40" stroke-linecap="round"/>
    <path d="M58,28 C64,17 72,10 80,5" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M65,18 C68,17 70,17 72,19" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.45" stroke-linecap="round"/>
    <path d="M72,12 C75,11 77,11 79,13" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.40" stroke-linecap="round"/>
    <!-- Left mega-claw -->
    <path d="M36,44 C28,40 17,37 9,39" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M9,39 C2,37 -1,44 3,51" fill="none" stroke="${c}" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M9,39 C3,34 1,29 6,25" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="5" cy="39" rx="6.5" ry="5.5" fill="${c}24" stroke="${c}" stroke-width="1.8"/>
    <!-- Left claw glow particles -->
    <circle cx="3" cy="50" r="1.5" fill="${c}" opacity="0.50"/>
    <circle cx="1" cy="43" r="1.2" fill="${c}" opacity="0.40"/>
    <circle cx="2" cy="28" r="1.0" fill="${c}" opacity="0.34"/>
    <!-- Right mega-claw -->
    <path d="M64,44 C72,40 83,37 91,39" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M91,39 C98,37 101,44 97,51" fill="none" stroke="${c}" stroke-width="2.8" stroke-linecap="round"/>
    <path d="M91,39 C97,34 99,29 94,25" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="95" cy="39" rx="6.5" ry="5.5" fill="${c}24" stroke="${c}" stroke-width="1.8"/>
    <!-- Right claw glow particles -->
    <circle cx="97" cy="50" r="1.5" fill="${c}" opacity="0.50"/>
    <circle cx="99" cy="43" r="1.2" fill="${c}" opacity="0.40"/>
    <circle cx="98" cy="28" r="1.0" fill="${c}" opacity="0.34"/>
    <!-- Carapace — armored, angular plates -->
    <path d="M30,27 C36,18 64,18 70,27 C77,36 77,60 70,67 C64,74 36,74 30,67 C23,60 23,36 30,27 Z"
      fill="${c}26" stroke="${c}" stroke-width="2.0" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Plate seam lines -->
    <path d="M50,19 L50,73" fill="none" stroke="${c}" stroke-width="0.8" opacity="0.30" stroke-linecap="round"/>
    <path d="M30,30 L70,30" fill="none" stroke="${c}" stroke-width="0.75" opacity="0.28" stroke-linecap="round"/>
    <path d="M26,46 L74,46" fill="none" stroke="${c}" stroke-width="0.70" opacity="0.26" stroke-linecap="round"/>
    <path d="M28,60 L72,60" fill="none" stroke="${c}" stroke-width="0.65" opacity="0.24" stroke-linecap="round"/>
    <!-- Runic lifetime sigils (Rust &'a, &'b, fn()) inscribed on carapace -->
    <text x="39" y="40" font-size="5" fill="${c}" font-family="monospace" opacity="0.40">&amp;'a</text>
    <text x="52" y="40" font-size="5" fill="${c}" font-family="monospace" opacity="0.40">&amp;'b</text>
    <text x="42" y="56" font-size="4.5" fill="${c}" font-family="monospace" opacity="0.32">fn()</text>
    <text x="54" y="56" font-size="4.5" fill="${c}" font-family="monospace" opacity="0.32">Ok</text>
    ${mouth5}
    <!-- Walking legs: 4 per side, thicker -->
    <path d="M33,49 C24,54 19,57 15,59" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M32,56 C23,61 18,65 14,68" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M33,62 C26,67 22,71 19,75" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M35,68 C30,73 27,77 26,80" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M67,49 C76,54 81,57 85,59" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M68,56 C77,61 82,65 86,68" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/>
    <path d="M67,62 C74,67 78,71 81,75" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M65,68 C70,73 73,77 74,80" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Orbiting gear/gear-fragment ornaments -->
    <circle cx="50" cy="7" r="2.5" fill="${c}" opacity="0.55"/>
    <line x1="50" y1="3" x2="50" y2="5" stroke="${c}" stroke-width="0.9" opacity="0.48"/>
    <line x1="53.5" y1="4" x2="52.5" y2="5.7" stroke="${c}" stroke-width="0.9" opacity="0.44"/>
    <line x1="46.5" y1="4" x2="47.5" y2="5.7" stroke="${c}" stroke-width="0.9" opacity="0.44"/>
    <circle cx="12" cy="22" r="1.8" fill="${c}" opacity="0.42"/>
    <circle cx="88" cy="22" r="1.8" fill="${c}" opacity="0.42"/>
    <circle cx="5" cy="66" r="1.6" fill="${c}" opacity="0.36"/>
    <circle cx="95" cy="66" r="1.6" fill="${c}" opacity="0.36"/>
    <circle cx="50" cy="95" r="2.0" fill="${c}" opacity="0.48"/>
    ${eating ? `<text x="${50 - foodStr.length * 2.4}" y="93" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>` : ''}
    ${dim ? `<text x="68" y="21" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>` : ''}`;

  // ── Assemble ────────────────────────────────────────────────────────────────
  const stages = [stage0, stage1, stage2, stage3, stage4, stage5];
  const body = stages[Math.min(evoIdx, 5)];

  // Feature overlays only on adult stages (4+)
  const overlays = evoIdx >= 4 ? featureOverlays(features, 'crab') : '';

  return `<svg class="creature-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">` +
    `<defs><filter id="glow"><feGaussianBlur stdDeviation="1.5" result="b"/>` +
    `<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>` +
    body + overlays + `</svg>`;
}

module.exports = { buildCrabCreatureSVG };
