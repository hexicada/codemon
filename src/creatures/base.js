'use strict';

const { featureOverlays } = require('../features');

// ── BASE CREATURE ─────────────────────────────────────────────────────────────
// Hand-drawn modular creature. Head is always the same; body extension
// swaps based on dominant language. All strokes driven by c / bc.

function buildBaseCreatureSVG(evoIdx, c, bc, mood, features, extTraits, dominantLang, foodStr = '') {
  const dim     = mood === 'sleeping' || mood === 'drowsy';
  const happy   = mood === 'happy';
  const playful = mood === 'playful';
  const eating  = mood === 'eating';

  // ── Head ───────────────────────────────────────────────────────────────────
  const head = `
    <path d="M46.96,34.36 C46.97,34.22 46.22,33.75 40.78,35.52 C37.53,38.41 36.18,39.64 34.79,42.40 C34.56,44.01 34.37,45.45 34.65,48.58 C35.19,49.99 35.86,51.66 38.11,54.77 C39.50,55.84 40.81,56.81 44.08,57.91 C47.86,58.54 51.20,59.07 59.59,57.39 C61.75,56.12 64.42,54.49 66.79,50.70 C66.98,49.29 67.12,47.84 66.27,43.87 C65.80,42.77 64.91,40.72 59.69,35.84 C56.64,34.96 54.54,34.38 46.76,33.92 C44.85,34.44 43.66,34.78 41.29,36.01 C40.13,36.89 39.51,37.36 38.23,38.63"
      fill="${c}18" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>`;

  // ── Antennae ───────────────────────────────────────────────────────────────
  const antennae = `
    <path d="M55.66,39.24 C56.16,38.99 58.19,38.19 62.85,33.38 C63.49,30.39 63.70,29.24 63.59,27.40 C63.46,26.09 63.33,24.91 63.33,24.91"
      fill="none" stroke="${c}" stroke-width="2.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M43.75,39.48 C42.43,38.77 41.84,38.04 41.29,37.33 C39.94,34.49 39.48,32.33 38.98,29.86 C39.53,24.16 39.57,23.40 39.57,23.40"
      fill="none" stroke="${c}" stroke-width="2.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M62.33,31.28 C61.84,32.46 61.68,32.75 59.93,35.54 C59.27,36.40 58.79,36.97 58.79,36.97"
      fill="none" stroke="${c}" stroke-width="2.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M61.93,26.29 C62.02,26.96 62.68,30.21 62.67,31.07 C61.56,33.10 60.38,34.89 60.38,34.89"
      fill="none" stroke="${c}" stroke-width="2.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M42.54,38.70 C41.69,38.84 40.08,35.60 39.80,34.45 C39.38,32.85 38.90,30.93 38.90,30.93"
      fill="none" stroke="${c}" stroke-width="2.80" stroke-linecap="round" stroke-linejoin="round"/>`;

  // ── Eyes ───────────────────────────────────────────────────────────────────
  const eyesOpen = `<g class="eyes-open">
    <path d="M44.25,41.73 C43.64,41.50 42.96,41.47 41.78,41.44 C39.76,42.52 38.97,43.52 38.30,44.38 C37.87,46.57 38.21,47.51 38.53,48.35 C39.90,49.65 40.70,49.98 41.44,50.26 C43.48,50.06 44.63,49.71 45.81,49.33 C47.48,47.98 47.86,47.03 48.23,46.06 C48.08,44.56 47.86,44.18 47.14,42.98 C45.22,41.69 43.92,41.37 41.61,41.56"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M54.43,41.62 C53.86,41.79 52.48,43.48 52.39,44.31 C52.31,45.34 53.20,46.96 54.46,47.83 C55.10,48.26 56.39,48.70 57.04,48.72 C57.90,48.71 59.59,47.88 60.54,46.78 C61.24,45.96 61.54,44.18 61.03,43.31 C60.58,42.56 58.38,41.16 57.59,41.00 C56.53,40.80 53.83,42.19 53.16,43.49"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44.15,42.52 C42.22,42.18 40.55,42.86 39.04,44.10 C38.36,45.47 38.50,46.15 38.71,47.05 C39.95,48.46 40.78,48.79 42.73,49.52 C46.34,48.28 46.86,46.82 47.36,45.18 C45.22,42.32 44.08,42.34 42.65,42.40 C40.47,43.51 39.78,44.34 39.18,45.09 C39.07,46.68 39.53,47.54 40.05,48.44 C42.01,49.84 42.37,49.87 42.37,49.87"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M55.52,41.89 C54.83,41.77 53.82,42.97 53.55,43.94 C52.41,48.28 57.97,48.70 58.58,48.50 C59.27,48.28 60.53,47.47 60.53,47.47"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M45.35,43.22 C46.53,44.64 46.97,46.55 46.33,47.64 C45.82,48.45 44.19,49.50 42.55,49.87 C41.15,50.09 40.62,50.12 40.62,50.12"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;

  const eyesHalf = `<g class="eyes-half">
    <path d="M38.11,45.99 C44.17,45.87 46.55,45.05 47.54,44.63"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M46.56,45.72 C46.65,46.99 46.25,48.29 45.69,48.77 C45.05,49.28 42.75,49.95 41.64,49.98 C40.40,50.01 39.14,49.17 38.49,47.07"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M52.33,44.80 C54.82,44.73 57.38,44.43 59.94,44.20 C60.39,44.18 61.82,44.20 61.82,44.20"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M53.73,45.70 C53.65,46.54 54.11,47.52 54.41,47.78 C55.08,48.31 56.99,48.64 57.99,48.39 C60.24,47.77 60.99,44.90 60.99,44.90"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;

  const eyesClosed = `<g class="eyes-closed">
    <path d="M37.69,48.14 C38.10,48.99 39.51,49.61 40.81,50.15 C43.86,49.32 45.02,48.46 46.80,46.64 C47.06,46.39 47.06,46.39 47.06,46.39"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M53.01,45.91 C55.70,48.15 57.61,48.23 60.02,48.30 C62.49,46.41 63.36,45.59 63.36,45.59"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
  </g>`;

  const eyeState = dim ? 'dim' : eating ? 'eating' : 'normal';
  const eyes = `<g class="eye-container ${eyeState}">${eyesOpen}${eyesHalf}${eyesClosed}</g>`;

  // ── Mouth ──────────────────────────────────────────────────────────────────
  const mouthNeutral = `
    <path d="M49.46,52.34 C49.16,52.21 49.13,53.32 49.60,53.47 C51.22,53.89 50.02,52.94 50.04,53.04"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M50.17,53.03 C49.48,53.01 49.34,53.06 49.44,53.37 C49.75,53.43 50.11,53.49 50.11,53.49"
      fill="none" stroke="${c}" stroke-width="2.00" stroke-linecap="round" stroke-linejoin="round"/>`;

  const mouthHappy = `
    <path d="M49.32,52.84 C49.50,53.47 49.75,53.63 51.09,53.93 C51.91,53.68 52.27,53.50 52.45,53.40"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M51.80,53.90 C51.98,53.88 52.45,52.93 52.45,52.93"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>`;

  const mouthEating = `
    <path d="M51.44,53.05 C50.20,52.71 48.46,52.98 47.23,53.33 C49.82,52.51 51.00,51.96 52.67,52.78 C51.84,51.71 50.96,51.48 49.94,51.22 C45.59,53.49 46.50,53.89 52.29,51.83 C55.25,53.06 56.70,53.38 55.57,54.05 C54.06,54.72 51.83,55.26 51.14,55.51"
      fill="none" stroke="${c}" stroke-width="3.00" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;

  const mouth = eating           ? mouthEating
              : happy || playful ? mouthHappy
              :                    mouthNeutral;

  // ── Body stub (connects head to limbs) ─────────────────────────────────────
  const bodyStub = `
    <path d="M45.97,59.52 C45.05,59.33 44.03,62.65 45.29,64.84 C46.15,66.26 50.38,68.08 51.77,67.69 C52.58,67.44 55.34,65.57 56.41,64.19 C56.85,63.60 57.18,61.01 56.54,59.21"
      fill="${c}15" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44.41,61.40 C44.64,60.78 45.25,60.26 46.32,59.38 C54.91,58.42 57.08,59.99 57.63,60.98 C57.92,62.78 57.92,62.78 57.92,62.78"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>`;

  // ── Egg body (evoIdx 0) ────────────────────────────────────────────────────
  const eggBody = `
    <ellipse cx="50" cy="71" rx="21" ry="15" fill="${c}14" stroke="${c}" stroke-width="1.70" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M33.5,66.5 C34.2,64.8 35.1,63.6 35.1,63.6 C35.6,64.9 34.9,66.2 34.9,66.2"
      fill="none" stroke="${c}" stroke-width="1.70" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
    <path d="M65.0,67.0 C64.1,65.1 63.5,63.9 63.5,63.9 C62.9,65.3 63.7,66.5 63.7,66.5"
      fill="none" stroke="${c}" stroke-width="1.70" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
    <path d="M29.0,69.5 C27.2,69.8 26.4,70.2 26.2,70.6"
      fill="none" stroke="${c}" stroke-width="1.70" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M71.2,69.8 C72.8,70.1 73.6,70.5 73.9,70.9"
      fill="none" stroke="${c}" stroke-width="1.70" stroke-linecap="round" stroke-linejoin="round"/>`;

  // ── Glitch body (evoIdx 1) ─────────────────────────────────────────────────
  const glitchBody = `
    <path d="M45.97,59.52 C45.05,59.33 44.03,62.65 45.29,64.84 C46.15,66.26 50.38,68.08 51.77,67.69 C52.58,67.44 55.34,65.57 56.41,64.19 C56.85,63.60 57.18,61.01 56.54,59.21"
      fill="${c}15" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M43.44,59.33 C42.84,59.62 41.57,60.44 39.44,61.87 C39.32,62.31 39.50,62.89 39.50,62.89"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38.86,62.99 C39.77,63.33 40.81,62.80 41.82,62.27"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M42.75,60.22 C41.80,61.10 40.80,61.80 39.80,62.60"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M57.29,58.84 C58.24,58.94 59.38,59.57 61.63,60.49"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M58.49,58.48 C60.10,59.60 61.00,60.30 61.80,61.50"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M45.96,65.92 C45.40,66.35 45.80,68.50 46.00,70.00"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44.79,64.93 C45.03,65.95 45.60,68.00 46.00,70.00"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M55.91,65.33 C55.66,65.84 55.40,67.80 55.30,70.00"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M56.06,65.34 C55.64,67.50 55.40,68.60 55.30,70.00"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>`;

  // ── Default arms ───────────────────────────────────────────────────────────
  const arms = `
    <path d="M43.44,59.33 C42.84,59.62 41.57,60.44 39.44,61.87 C39.32,62.31 39.50,62.89 39.50,62.89"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38.86,62.99 C39.77,63.33 40.81,62.80 41.82,62.27"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M42.75,60.22 C42.14,60.88 41.49,61.38 40.34,62.39"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M39.49,62.55 C38.74,62.95 38.02,63.48 37.80,63.62"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M57.29,58.84 C58.24,58.94 59.38,59.57 61.63,60.49"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M58.49,58.48 C60.45,59.83 61.30,60.43 62.36,62.20 C62.08,62.81 60.77,61.76 60.63,61.15"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M61.02,61.30 C61.78,61.77 62.34,62.39 62.34,62.39"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M63.22,62.80 C63.84,62.47 64.61,62.47 64.61,62.47"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>`;

  // ── Default legs ───────────────────────────────────────────────────────────
  const legs = `
    <path d="M45.96,65.92 C45.40,66.35 46.76,70.48 46.89,71.57"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44.79,64.93 C45.03,65.95 46.35,69.35 46.84,70.79"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44.81,66.82 C45.40,68.91 46.14,70.87 46.98,72.95"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M45.80,68.78 C46.42,70.55 47.19,72.69 47.43,73.59"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M55.91,65.33 C55.66,65.84 55.33,69.35 55.22,70.60"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M56.06,65.34 C55.64,68.36 55.40,69.59 55.22,70.90"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M56.23,65.76 C55.35,70.55 55.05,71.65 54.66,72.92"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M54.93,72.44 C54.54,73.83 54.54,73.83"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>`;

  // ── Archetype body (evoIdx 3+) ─────────────────────────────────────────────
  const archetypeBody = `
    <!-- Bug wings (cicada/bee style) — two pairs, upper larger -->
    <!-- Upper left wing -->
    <path d="M45.0,61.0 C38.0,54.0 24.0,50.0 18.0,55.0 C13.0,59.0 16.0,68.0 26.0,68.0 C33.0,68.0 40.0,65.0 44.0,63.0 Z"
      fill="${bc}18" stroke="${c}" stroke-width="1.40" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <!-- Upper left wing veins -->
    <path d="M44.0,62.0 C36.0,59.0 27.0,57.0 20.0,58.0"
      fill="none" stroke="${c}" stroke-width="0.70" stroke-linecap="round" stroke-linejoin="round" opacity="0.40"/>
    <path d="M42.0,64.0 C35.0,63.5 28.0,63.0 22.0,64.5"
      fill="none" stroke="${c}" stroke-width="0.60" stroke-linecap="round" stroke-linejoin="round" opacity="0.30"/>
    <path d="M40.0,61.5 C34.0,57.5 26.0,54.5 19.5,56.5"
      fill="none" stroke="${c}" stroke-width="0.55" stroke-linecap="round" stroke-linejoin="round" opacity="0.25"/>
    <!-- Upper right wing -->
    <path d="M55.0,61.0 C62.0,54.0 76.0,50.0 82.0,55.0 C87.0,59.0 84.0,68.0 74.0,68.0 C67.0,68.0 60.0,65.0 56.0,63.0 Z"
      fill="${bc}18" stroke="${c}" stroke-width="1.40" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
    <!-- Upper right wing veins -->
    <path d="M56.0,62.0 C64.0,59.0 73.0,57.0 80.0,58.0"
      fill="none" stroke="${c}" stroke-width="0.70" stroke-linecap="round" stroke-linejoin="round" opacity="0.40"/>
    <path d="M58.0,64.0 C65.0,63.5 72.0,63.0 78.0,64.5"
      fill="none" stroke="${c}" stroke-width="0.60" stroke-linecap="round" stroke-linejoin="round" opacity="0.30"/>
    <path d="M60.0,61.5 C66.0,57.5 74.0,54.5 80.5,56.5"
      fill="none" stroke="${c}" stroke-width="0.55" stroke-linecap="round" stroke-linejoin="round" opacity="0.25"/>
    <!-- Lower left wing (smaller, angled down) -->
    <path d="M44.5,65.0 C38.0,64.0 27.0,67.0 24.0,73.0 C22.0,77.0 25.5,80.0 32.0,77.0 C37.0,75.0 42.0,70.0 44.5,67.0 Z"
      fill="${bc}12" stroke="${c}" stroke-width="1.10" stroke-linecap="round" stroke-linejoin="round" opacity="0.70"/>
    <!-- Lower left wing vein -->
    <path d="M43.5,66.0 C37.0,67.0 29.0,70.5 25.5,75.0"
      fill="none" stroke="${c}" stroke-width="0.55" stroke-linecap="round" stroke-linejoin="round" opacity="0.28"/>
    <!-- Lower right wing (smaller, angled down) -->
    <path d="M55.5,65.0 C62.0,64.0 73.0,67.0 76.0,73.0 C78.0,77.0 74.5,80.0 68.0,77.0 C63.0,75.0 58.0,70.0 55.5,67.0 Z"
      fill="${bc}12" stroke="${c}" stroke-width="1.10" stroke-linecap="round" stroke-linejoin="round" opacity="0.70"/>
    <!-- Lower right wing vein -->
    <path d="M56.5,66.0 C63.0,67.0 71.0,70.5 74.5,75.0"
      fill="none" stroke="${c}" stroke-width="0.55" stroke-linecap="round" stroke-linejoin="round" opacity="0.28"/>
    <!-- Vestigial back arms (left) -->
    <path d="M43.0,62.0 C38.0,63.0 32.0,64.5 29.0,65.0"
      fill="none" stroke="${c}" stroke-width="1.40" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
    <path d="M29.0,65.0 C28.5,66.0 29.5,67.5 30.0,68.0"
      fill="none" stroke="${c}" stroke-width="1.20" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>
    <!-- Vestigial back arms (right) -->
    <path d="M57.0,62.0 C62.0,63.0 68.0,64.5 71.0,65.0"
      fill="none" stroke="${c}" stroke-width="1.40" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
    <path d="M71.0,65.0 C71.5,66.0 70.5,67.5 70.0,68.0"
      fill="none" stroke="${c}" stroke-width="1.20" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>
    <!-- Chest/torso -->
    <path d="M39.0,60.5 C38.5,63.0 38.0,68.0 38.5,72.5 C39.5,75.5 42.0,77.5 50.0,77.5 C58.0,77.5 60.5,75.5 61.5,72.5 C62.0,68.0 61.5,63.0 61.0,60.5 C59.5,58.5 55.0,57.5 50.0,57.5 C45.0,57.5 40.5,58.5 39.0,60.5 Z"
      fill="${c}20" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M40.0,64.0 C44.0,64.5 56.0,64.5 60.0,64.0"
      fill="none" stroke="${c}" stroke-width="1.10" stroke-linecap="round" stroke-linejoin="round" opacity="0.35"/>
    <path d="M40.5,68.0 C44.0,68.5 56.0,68.5 59.5,68.0"
      fill="none" stroke="${c}" stroke-width="1.00" stroke-linecap="round" stroke-linejoin="round" opacity="0.25"/>
    <!-- Neck connectors -->
    <path d="M44.5,58.0 C44.0,56.0 44.5,59.0 44.5,59.0"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
    <path d="M55.5,58.0 C56.0,56.0 55.5,59.0 55.5,59.0"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
    <!-- Left arm: upper -->
    <path d="M39.5,62.0 C35.0,61.5 29.5,61.5 26.0,62.0"
      fill="none" stroke="${c}" stroke-width="1.90" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Left elbow -->
    <circle cx="26.0" cy="62.0" r="1.6" fill="none" stroke="${c}" stroke-width="1.20" opacity="0.6"/>
    <!-- Left arm: forearm -->
    <path d="M26.0,62.0 C24.5,63.5 23.0,65.5 22.0,68.0"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Left hand -->
    <path d="M22.0,68.0 C21.0,69.5 20.5,71.0 20.5,71.0"
      fill="none" stroke="${c}" stroke-width="1.70" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22.0,68.0 C20.5,68.5 19.5,69.5 19.5,69.5"
      fill="none" stroke="${c}" stroke-width="1.40" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22.5,68.5 C22.0,70.0 21.5,70.5 21.5,70.5"
      fill="none" stroke="${c}" stroke-width="1.40" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Right arm: upper -->
    <path d="M60.5,62.0 C65.0,61.5 70.5,61.5 74.0,62.0"
      fill="none" stroke="${c}" stroke-width="1.90" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Right elbow -->
    <circle cx="74.0" cy="62.0" r="1.6" fill="none" stroke="${c}" stroke-width="1.20" opacity="0.6"/>
    <!-- Right arm: forearm -->
    <path d="M74.0,62.0 C75.5,63.5 77.0,65.5 78.0,68.0"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Right hand -->
    <path d="M78.0,68.0 C79.0,69.5 79.5,71.0 79.5,71.0"
      fill="none" stroke="${c}" stroke-width="1.70" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M78.0,68.0 C79.5,68.5 80.5,69.5 80.5,69.5"
      fill="none" stroke="${c}" stroke-width="1.40" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M77.5,68.5 C78.0,70.0 78.5,70.5 78.5,70.5"
      fill="none" stroke="${c}" stroke-width="1.40" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Left leg: upper -->
    <path d="M44.0,76.5 C42.0,76.5 39.5,76.5 37.0,77.0"
      fill="none" stroke="${c}" stroke-width="1.90" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Left knee -->
    <circle cx="37.0" cy="77.0" r="1.5" fill="none" stroke="${c}" stroke-width="1.20" opacity="0.6"/>
    <!-- Left leg: lower -->
    <path d="M37.0,77.0 C36.0,79.5 35.5,81.5 35.0,84.0"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Left foot -->
    <path d="M35.0,84.0 C32.5,84.5 30.5,84.5 29.5,84.0"
      fill="none" stroke="${c}" stroke-width="1.70" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M34.0,84.0 C33.5,85.5 33.5,85.5"
      fill="none" stroke="${c}" stroke-width="1.40" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Right leg: upper -->
    <path d="M56.0,76.5 C58.0,76.5 60.5,76.5 63.0,77.0"
      fill="none" stroke="${c}" stroke-width="1.90" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Right knee -->
    <circle cx="63.0" cy="77.0" r="1.5" fill="none" stroke="${c}" stroke-width="1.20" opacity="0.6"/>
    <!-- Right leg: lower -->
    <path d="M63.0,77.0 C64.0,79.5 64.5,81.5 65.0,84.0"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Right foot -->
    <path d="M65.0,84.0 C67.5,84.5 69.5,84.5 70.5,84.0"
      fill="none" stroke="${c}" stroke-width="1.70" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M66.0,84.0 C66.5,85.5 66.5,85.5"
      fill="none" stroke="${c}" stroke-width="1.40" stroke-linecap="round" stroke-linejoin="round"/>`;

  // ── Crab extension (Rust) ──────────────────────────────────────────────────
  const crabLegs = `
    <path d="M43.86,62.52 C42.72,62.94 41.45,63.57 39.21,65.77 C38.58,66.84 37.35,69.03 37.30,73.92"
      fill="none" stroke="${c}" stroke-width="1.90" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M46.30,65.12 C45.44,64.84 43.89,65.89 43.14,67.66 C42.71,68.72 42.53,72.82 42.83,75.93"
      fill="none" stroke="${c}" stroke-width="1.90" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M55.42,67.25 C56.71,67.47 57.86,69.27 58.42,71.70 C57.88,74.83 57.64,75.56 57.64,75.56"
      fill="none" stroke="${c}" stroke-width="1.90" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M57.72,62.67 C58.52,62.99 61.71,65.49 62.54,66.83 C63.26,68.06 64.16,73.92 64.16,73.92"
      fill="none" stroke="${c}" stroke-width="1.90" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M41.96,59.22 C38.47,59.64 37.92,59.83 36.90,60.26"
      fill="none" stroke="${c}" stroke-width="1.90" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M57.72,60.09 C58.92,59.94 60.77,59.65 62.33,60.27"
      fill="none" stroke="${c}" stroke-width="1.90" stroke-linecap="round" stroke-linejoin="round"/>`;

  const crabClaws = `
    <path d="M36.79,62.23 C34.50,61.13 30.51,62.49 30.75,63.05 C31.61,63.60 33.15,64.27 34.03,64.24"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M36.93,62.82 C36.14,64.60 33.84,67.29 31.19,69.51 C27.90,70.56 24.90,70.53 20.86,65.79 C20.06,63.84 20.06,63.84"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M29.12,66.60 C25.78,69.20 22.09,67.92 20.83,66.69"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M27.36,63.95 C29.93,62.07 33.75,61.75 34.91,62.13 C35.49,62.33 36.66,63.09 36.66,63.09"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M64.53,62.14 C65.55,64.05 68.87,65.36 71.48,64.81 C74.98,63.43 75.76,62.76 77.55,60.74 C78.03,59.95 78.03,59.95"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M75.60,62.78 C77.89,60.13 78.29,59.22 78.85,57.64"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M67.36,60.34 C70.31,61.56 73.78,61.37 75.87,60.35 C77.50,58.10 77.75,57.30 77.75,57.30"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M66.00,60.28 C67.36,59.30 67.92,59.10 69.47,58.85"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>`;

  // ── Pick body extension based on evo stage / dominant language ───────────
  const bodyExt = evoIdx === 0
    ? eggBody
    : evoIdx === 1
      ? glitchBody
      : evoIdx >= 3 && dominantLang !== 'rust'
        ? archetypeBody
        : dominantLang === 'rust'
          ? `${crabLegs}${crabClaws}`
          : `${arms}${legs}`;

  // ── Body stub only rendered for evoIdx 2 (archetype has own chest) ─────────
  const activeBodyStub = evoIdx >= 2 && evoIdx < 3 ? bodyStub : '';

  // ── Eating food label ──────────────────────────────────────────────────────
  const eatingSvg = eating && foodStr
    ? `<text class="eating-food" x="${50 - foodStr.length * 2.4}" y="82" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>`
    : '';

  // ── Sleep z ────────────────────────────────────────────────────────────────
  const sleepZ = dim
    ? `<text x="68" y="32" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>`
    : '';

  // ── Evolution extras ───────────────────────────────────────────────────────
  const evoRing = evoIdx >= 2
    ? `<ellipse cx="50" cy="48" rx="36" ry="30" fill="none" stroke="${c}" stroke-width="0.4" stroke-dasharray="2,6" opacity="0.15"/>`
    : '';
  const evoShimmer = evoIdx >= 4
    ? `<ellipse cx="50" cy="48" rx="44" ry="38" fill="none" stroke="${bc}" stroke-width="0.3" stroke-dasharray="1,8" opacity="0.10"/>`
    : '';

  // Render order: shimmer → evo ring → body extension (behind head) →
  //               body stub → head → feature overlays → antennae → eyes → mouth → extras
  return `<svg class="creature-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">` +
    `<defs><filter id="glow"><feGaussianBlur stdDeviation="1.5" result="b"/>` +
    `<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>` +
    `<g filter="url(#glow)">` +
    `${evoShimmer}${evoRing}` +
    `${bodyExt}` +
    `${activeBodyStub}` +
    `${head}` +
    `${featureOverlays(features)}` +
    `${antennae}` +
    `${eyes}` +
    `${mouth}` +
    `${eatingSvg}${sleepZ}` +
    `</g></svg>`;
}

module.exports = { buildBaseCreatureSVG };