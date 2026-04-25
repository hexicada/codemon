'use strict';

let featureOverlays = () => '';
try {
  ({ featureOverlays } = require('../features'));
} catch (err) {
  // Keep ghost rendering even if overlays module is unavailable.
}

// ── GHOST CREATURE ────────────────────────────────────────────────────────────
// Hand-drawn SVG art. All stroke colours are driven by the dynamic creature
// colour (c / bc) so the ghost tints to match the user's dominant language.

function buildGhostCreatureSVG(evoIdx, c, bc, mood, features, foodStr = '{;}') {
  const dim     = mood === 'sleeping' || mood === 'drowsy';
  const happy   = mood === 'happy';
  const playful = mood === 'playful';
  const eating  = mood === 'eating';

  // ── Body ───────────────────────────────────────────────────────────────────
  // Two overlapping hand-drawn outlines; filled with a translucent tint so the
  // ghost looks slightly see-through at all evolution stages.
  const body = `
    <path d="M51.05,15.37 C50.92,15.30 50.67,15.22 50.42,15.22 C49.84,15.22 44.77,16.33 42.95,17.06 C41.02,17.85 38.21,19.72 36.79,21.07 C33.67,24.10 29.62,30.68 27.98,35.33 C26.72,38.91 24.39,50.96 23.35,53.75 C22.76,55.32 16.42,69.46 16.01,70.50 C15.14,72.80 14.67,76.34 15.24,77.95 C15.51,78.68 16.64,79.69 17.20,79.79 C18.31,79.95 21.69,78.85 22.43,78.83 C23.66,78.82 25.85,81.13 25.98,81.27 C26.80,82.15 29.23,83.02 30.41,82.85 C31.28,82.70 34.79,80.44 35.34,80.34 C36.43,80.15 39.85,83.03 41.50,82.94 C43.98,82.76 47.33,79.87 48.53,79.75 C49.59,79.69 53.59,83.29 55.51,83.70 C57.44,84.03 63.19,79.60 64.72,79.57 C65.98,79.59 71.39,83.17 74.01,82.91 C74.84,82.82 77.86,80.06 81.15,79.51 C81.83,79.40 85.00,79.59 85.59,79.40 C86.21,79.18 87.30,78.18 87.54,77.34 C87.78,76.49 87.59,74.48 87.27,73.44 C86.56,71.27 79.64,64.99 77.99,62.66 C75.99,59.80 72.76,50.12 72.59,44.79 C72.56,42.72 73.40,36.74 73.58,34.61 C73.71,32.86 73.26,29.36 72.69,27.80 C72.10,26.23 70.36,23.42 69.11,22.20 C67.32,20.49 60.45,17.33 56.93,16.55 C54.92,16.14 48.84,16.09 46.27,16.59 C42.11,17.46 35.56,22.42 33.77,24.82 C33.43,25.29 31.83,27.59 31.22,28.49"
      fill="${c}18" stroke="${c}" stroke-width="1.50" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M40.16,19.45 C39.53,19.57 39.03,19.72 38.68,20.00 C36.94,21.41 33.10,26.33 30.51,31.94 C28.58,36.21 25.02,51.03 22.94,55.36 C22.49,56.29 15.01,69.80 14.31,72.91 C13.89,74.83 14.03,77.66 14.34,78.49 C14.67,79.33 15.65,79.98 16.49,80.20 C18.97,80.76 24.41,78.80 25.19,79.07 C25.58,79.23 27.94,81.45 28.77,81.89 C30.10,82.58 32.16,82.85 33.03,82.74 C33.70,82.65 37.14,81.28 37.45,81.24 C38.05,81.17 40.04,82.01 40.39,82.15 C41.54,82.60 44.18,82.43 45.64,81.81 C46.30,81.53 49.88,79.53 50.45,79.59 C50.47,79.59 55.12,82.81 58.05,82.84 C59.55,82.84 65.52,79.80 66.62,80.18 C67.21,80.40 70.21,82.90 70.26,82.93 C71.36,83.59 73.57,83.76 74.89,83.39 C76.49,82.90 79.64,80.42 80.08,80.16 C81.23,79.50 86.07,79.98 87.05,79.00 C87.46,78.55 88.08,76.53 87.95,75.45 C87.82,74.50 86.86,72.49 85.60,70.93 C84.92,70.09 83.99,69.02 83.45,68.41"
      fill="none" stroke="${c}" stroke-width="1.50" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>`;

  // ── Eyes ───────────────────────────────────────────────────────────────────
  // Open: hand-drawn spiralling eye detail (left around x=40, right around x=56)
  // Blinked / dim: simple curved lines (arc across each eye region)
  const eyesOpen = `
    <path d="M39.98,26.80 C39.98,26.80 39.98,26.66 39.98,26.66 C41.13,26.56 43.67,28.83 43.90,30.27 C44.07,31.47 43.73,33.79 43.11,34.47 C42.52,35.06 40.69,35.46 39.83,35.14 C39.01,34.82 38.32,33.60 38.38,32.77 C38.56,30.70 40.79,29.44 41.75,29.76 C42.71,30.12 43.26,32.44 43.24,32.81 C43.23,32.93 43.19,33.15 43.10,33.47"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M43.07,32.65 C43.01,32.82 42.84,33.14 42.71,33.30 C42.44,33.63 41.94,34.32 41.31,34.68"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M42.27,33.39 C42.00,33.63 41.32,33.89 41.27,33.41"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M39.91,33.95 C39.87,33.70 39.87,33.44 40.02,33.18 C40.27,32.77 40.51,32.44 40.77,32.17 C40.89,32.04 41.09,31.90 41.36,31.74"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M54.92,25.16 C55.96,25.95 57.12,27.09 58.00,28.34 C58.88,29.62 59.10,32.44 58.01,33.51 C57.48,34.00 56.34,34.34 55.50,34.29 C54.51,34.22 53.61,33.31 53.65,32.38 C53.71,31.52 54.49,30.41 55.03,30.10 C56.37,29.41 58.00,30.54 58.17,30.87"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M57.13,29.28 C57.09,29.23 57.04,29.18 56.98,29.15 C55.76,28.53 54.09,29.64 54.05,29.74 C54.04,29.77 54.03,29.88 54.03,30.06"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M56.20,27.96 C56.16,27.93 56.11,27.93 56.07,27.94 C55.91,27.98 55.50,28.27 55.07,28.61"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M55.60,33.17 C55.58,33.12 55.56,33.07 55.53,33.03 C55.46,32.90 55.37,32.79 55.31,32.66"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M55.32,32.85 C55.38,32.50 55.69,32.12 55.83,32.04 C55.87,32.01 55.94,31.99 56.03,31.98"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M56.86,33.62 C56.77,33.43 56.79,32.96 56.86,31.64 C56.87,31.36 56.89,31.07 56.90,30.78"
      fill="none" stroke="${c}" stroke-width="1.80" stroke-linecap="round" stroke-linejoin="round"/>`;

  const eyesBlinked = `
    <path d="M35.31,30.53 C35.28,30.54 35.55,30.83 35.81,31.03 C37.83,32.59 42.15,33.17 43.65,32.45 C43.75,32.40 43.88,32.32 44.03,32.21"
      fill="none" stroke="${c}" stroke-width="2.30" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M44.37,30.85 C43.84,31.58 43.29,32.29 42.95,32.67 C42.85,32.78 42.68,32.95 42.45,33.18"
      fill="none" stroke="${c}" stroke-width="2.30" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M43.12,32.86 C43.68,33.05 43.89,33.07 44.26,33.09 C44.66,32.83 45.25,32.30 45.45,32.15"
      fill="none" stroke="${c}" stroke-width="2.30" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M55.25,32.79 C55.21,32.93 55.90,33.27 56.57,33.51 C57.69,33.90 60.24,33.78 61.30,33.37 C61.78,33.18 62.50,32.74 62.70,32.62"
      fill="none" stroke="${c}" stroke-width="2.30" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M56.33,33.69 C55.84,33.02 54.84,32.53 54.09,32.44"
      fill="none" stroke="${c}" stroke-width="2.30" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M60.27,33.89 C60.41,33.68 61.38,33.20 61.93,32.93 C63.04,32.15 63.09,32.13 63.17,32.10"
      fill="none" stroke="${c}" stroke-width="2.30" stroke-linecap="round" stroke-linejoin="round"/>`;

  const eyes = dim ? eyesBlinked : eyesOpen;

  // ── Mouth ──────────────────────────────────────────────────────────────────
  // Eating: the hand-drawn spiral/open-mouth path, thick stroke
  // Normal: small hand-drawn mouth with subtle pink tongue detail
  // Happy/playful: wider smile curve
  // Dim: flat line
  const mouthEating = `
    <path d="M47.24,40.17 C47.25,40.03 47.15,39.94 46.93,39.94 C43.76,40.00 42.97,40.07 41.53,40.20 C38.48,41.75 37.22,43.10 36.11,44.30 C34.99,47.18 34.85,49.33 34.64,53.20 C36.93,58.98 38.99,61.17 40.12,62.35 C42.78,64.27 44.05,64.88 46.35,65.94 C53.07,65.81 55.79,64.49 56.93,63.92 C58.98,62.23 59.68,61.37 61.61,58.93 C63.72,54.47 64.00,53.02 64.47,50.38 C63.86,45.90 62.99,44.63 62.47,43.91 C60.54,42.66 58.59,42.13 54.23,40.96 C46.06,41.14 42.96,42.26 40.96,43.01 C38.78,45.72 38.63,47.72 38.55,49.15 C39.15,52.65 40.46,55.19 41.06,56.31 C43.33,58.96 44.36,59.72 46.43,61.21 C51.32,61.56 53.16,60.50 55.10,59.34 C59.39,53.88 59.91,50.56 60.05,49.60 C59.53,47.73 58.80,47.03 57.16,45.53 C51.03,44.53 48.47,44.86 46.83,45.09 C44.46,45.87 43.84,46.54 43.16,47.33 C42.79,49.48 43.08,50.79 43.32,51.79 C44.34,53.87 44.96,54.59 45.69,55.42 C47.61,56.34 48.62,56.37 50.71,56.37 C55.35,53.48 55.61,51.89 55.72,51.03 C54.59,49.59 53.43,49.18 51.44,48.52 C48.73,50.04 48.42,50.85 48.28,51.25 C48.45,52.15 48.93,52.39 49.54,52.67"
      fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`;

  const mouthNormal = `
    <path d="M45.74,39.75 C45.69,39.72 45.57,39.77 45.58,39.95 C45.64,40.97 46.20,41.87 46.81,42.26 C48.05,42.99 50.27,41.37 50.13,40.68"
      fill="none" stroke="${c}" stroke-width="1.90" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M49.92,41.10 C49.99,41.00 50.40,40.48 50.46,40.12 C50.46,40.04 50.46,39.98 50.65,39.99"
      fill="none" stroke="${c}" stroke-width="1.90" stroke-linecap="round" stroke-linejoin="round"/>`;

  const mouthHappy   = `<path d="M42,41 Q50,46 58,41" fill="none" stroke="${c}" stroke-width="1.90" stroke-linecap="round"/>`;
  const mouthPlayful = `<path d="M40,40 Q50,48 60,40" fill="none" stroke="${c}" stroke-width="2.20" stroke-linecap="round"/>`;
  const mouthDim     = `<line x1="45" y1="41" x2="55" y2="41" stroke="${c}" stroke-width="1.50" stroke-linecap="round"/>`;

  const mouth = eating  ? mouthEating
              : dim     ? mouthDim
              : happy   ? mouthHappy
              : playful ? mouthPlayful
              :           mouthNormal;

  // ── Eating food label ──────────────────────────────────────────────────────
  const eatingSvg = eating
    ? `<text class="eating-food" x="${50 - foodStr.length * 2.4}" y="76" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${foodStr}</text>`
    : '';

  // ── Sleep z ────────────────────────────────────────────────────────────────
  const sleepZ = dim
    ? `<text x="68" y="20" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>`
    : '';

  // ── Evolution: ghost gains extra translucency layers as it levels up ───────
  // evoIdx 0-1: bare outline / slight fill
  // evoIdx 2-3: inner glow halo
  // evoIdx 4-5: outer shimmer ring + second inner halo
  const evoExtras = evoIdx >= 2
    ? `<ellipse cx="50" cy="48" rx="34" ry="38" fill="none" stroke="${c}" stroke-width="0.4" stroke-dasharray="2,6" opacity="0.18"/>`
    : '';
  const evoShimmer = evoIdx >= 4
    ? `<ellipse cx="50" cy="48" rx="42" ry="46" fill="none" stroke="${bc}" stroke-width="0.3" stroke-dasharray="1,8" opacity="0.12"/>`
    : '';

  return `<svg class="creature-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">` +
    `<defs><filter id="glow"><feGaussianBlur stdDeviation="1.5" result="b"/>` +
    `<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>` +
    `<g filter="url(#glow)">${evoShimmer}${evoExtras}${featureOverlays(Array.isArray(features) ? features : [])}${body}${eyes}${mouth}${eatingSvg}${sleepZ}</g></svg>`;
}

module.exports = { buildGhostCreatureSVG };