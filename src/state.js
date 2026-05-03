const { DEBUG_PUZZLES } = require('./data');

const STORAGE_KEY    = 'codemonState_v4';
const STORAGE_KEY_V3 = 'codemonState_v3';
const STORAGE_SCHEMA = 'multiSlots_v1';
const SLOT_COUNT = 3;
const PARADIGM_XP = 11000;

const PATTERN_COMMENT_TTL_MS              = 10000;
const PATTERN_COMMENT_DISMISS_COOLDOWN_MS = 30000;

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function clampSlotIndex(i) {
  const n = Number.isFinite(i) ? i : 0;
  return Math.max(0, Math.min(SLOT_COUNT - 1, n));
}

function createDefaultCreatureState() {
  return {
    xp:0, hunger:100, mood:80,
    langCounts:{}, unlockedFeatures:[], activeHybrids:[],
    installedExtTraits:[], dominantLang:null, dominantColor:'#888888', blendColor:'#888888',
    lastActive:Date.now(), name:'Unnamed',
    lastMorningFeedDate:null, lastAfternoonFeedDate:null,
    bugsFound:0, bugsAttempted:0,
    achievements:[], unlockedLore:[], unlockedGhost:false, patternComment:null,
    patternCommentExpiresAt:null, patternCommentDismissedUntil:null,
    codedPastMidnight:false, codedOnWeekend:false,
    longestSessionMinutes:0, sessionStartTime:null,
    feedStreak:0, lastFeedDate:null,
    activePuzzle:null, puzzleState:'idle', puzzleLang:null,
    _lastPuzzleHint:null,
    totalCommits:0, lastProcessComment:null, cpuTemp:null, cpuTempAvailable:false,
    generation:0, generations:[], inheritedFrom:null, inheritedFeature:null,
    starvedSince:null, isEatingRam:false, feralSince:null, _playful:false,
  };
}

function normalizeCreatureState(saved) {
  const out = { ...createDefaultCreatureState(), ...(saved || {}) };
  out.xp                             = Number.isFinite(out.xp) ? out.xp : 0;
  out.hunger                         = Number.isFinite(out.hunger) ? out.hunger : 100;
  out.mood                           = Number.isFinite(out.mood) ? out.mood : 80;
  out.langCounts                     = (out.langCounts && typeof out.langCounts === 'object') ? out.langCounts : {};
  out.unlockedFeatures               = Array.isArray(out.unlockedFeatures) ? out.unlockedFeatures : [];
  out.activeHybrids                  = Array.isArray(out.activeHybrids) ? out.activeHybrids : [];
  out.installedExtTraits             = Array.isArray(out.installedExtTraits) ? out.installedExtTraits : [];
  out.dominantLang                   = out.dominantLang || null;
  out.dominantColor                  = out.dominantColor || '#888888';
  out.blendColor                     = out.blendColor || out.dominantColor || '#888888';
  out.lastActive                     = Number.isFinite(out.lastActive) ? out.lastActive : Date.now();
  out.name                           = (typeof out.name === 'string' && out.name.trim()) ? out.name : 'Unnamed';
  out.lastMorningFeedDate            = out.lastMorningFeedDate   || null;
  out.lastAfternoonFeedDate          = out.lastAfternoonFeedDate || null;
  out.bugsFound                      = out.bugsFound    || 0;
  out.bugsAttempted                  = out.bugsAttempted || 0;
  out.achievements                   = out.achievements || [];
  out.unlockedLore                   = out.unlockedLore || [];
  out.unlockedGhost                  = out.unlockedGhost || false;
  out.patternComment                 = out.patternComment || null;
  out.patternCommentExpiresAt        = Number.isFinite(out.patternCommentExpiresAt) ? out.patternCommentExpiresAt : null;
  out.patternCommentDismissedUntil   = Number.isFinite(out.patternCommentDismissedUntil) ? out.patternCommentDismissedUntil : null;
  out.codedPastMidnight              = out.codedPastMidnight  || false;
  out.codedOnWeekend                 = out.codedOnWeekend     || false;
  out.longestSessionMinutes          = out.longestSessionMinutes || 0;
  out.sessionStartTime               = out.sessionStartTime   || null;
  out.feedStreak                     = out.feedStreak         || 0;
  out.lastFeedDate                   = out.lastFeedDate       || null;
  out.activePuzzle                   = out.activePuzzle       || null;
  out.puzzleState                    = out.puzzleState        || 'idle';
  out.puzzleLang                     = out.puzzleLang         || null;
  out.totalCommits                   = out.totalCommits       || 0;
  out.lastProcessComment             = out.lastProcessComment || null;
  out.cpuTemp                        = out.cpuTemp     != null ? out.cpuTemp : null;
  out.cpuTempAvailable               = out.cpuTempAvailable   || false;
  out.generation                     = out.generation         || 0;
  out.generations                    = out.generations        || [];
  out.inheritedFrom                  = out.inheritedFrom      || null;
  out.inheritedFeature               = out.inheritedFeature   || null;
  out.starvedSince                   = out.starvedSince  != null ? out.starvedSince : null;
  out.isEatingRam                    = out.isEatingRam        || false;
  out.feralSince                     = out.feralSince    != null ? out.feralSince : null;
  out._playful                       = false;
  return out;
}

function ensureSlotUnlocks(account, active) {
  if ((active.xp || 0) >= PARADIGM_XP) {
    account.unlockedSlots = [true, true, true];
  }
}

function createAccountFromLegacy(legacy) {
  const slot0 = normalizeCreatureState(legacy);
  const account = {
    schema: STORAGE_SCHEMA,
    activeSlotIndex: 0,
    unlockedSlots: [true, false, false],
    slots: [slot0, createDefaultCreatureState(), createDefaultCreatureState()],
    globals: {},
  };
  ensureSlotUnlocks(account, slot0);
  return account;
}

function normalizeAccount(saved) {
  const slotsIn = Array.isArray(saved.slots) ? saved.slots : [];
  const slots = [];
  for (let i = 0; i < SLOT_COUNT; i++) {
    slots.push(normalizeCreatureState(slotsIn[i]));
  }

  const unlockedIn = Array.isArray(saved.unlockedSlots) ? saved.unlockedSlots : [];
  const unlockedSlots = [];
  for (let i = 0; i < SLOT_COUNT; i++) {
    unlockedSlots.push(i === 0 ? true : !!unlockedIn[i]);
  }

  const account = {
    schema: STORAGE_SCHEMA,
    activeSlotIndex: clampSlotIndex(saved.activeSlotIndex),
    unlockedSlots,
    slots,
    globals: (saved.globals && typeof saved.globals === 'object') ? saved.globals : {},
  };

  if (!account.unlockedSlots[account.activeSlotIndex]) {
    account.activeSlotIndex = 0;
  }
  ensureSlotUnlocks(account, account.slots[account.activeSlotIndex]);
  return account;
}

function attachAccountMeta(activeSlot, account) {
  Object.defineProperty(activeSlot, '__account', {
    value: account,
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

function buildPersistableAccount(state) {
  if (state && state.__account && state.__account.schema === STORAGE_SCHEMA) {
    const account = state.__account;
    const idx = clampSlotIndex(account.activeSlotIndex);
    account.activeSlotIndex = account.unlockedSlots[idx] ? idx : 0;
    account.slots[account.activeSlotIndex] = normalizeCreatureState(state);
    ensureSlotUnlocks(account, account.slots[account.activeSlotIndex]);
    return account;
  }

  return createAccountFromLegacy(state);
}

function loadState(context) {
  const saved = context.globalState.get(STORAGE_KEY)
    || (() => {
      const v3 = context.globalState.get(STORAGE_KEY_V3);
      return v3 ? { ...v3, _migratedFromV3: true } : null;
    })();

  const account = saved && saved.schema === STORAGE_SCHEMA
    ? normalizeAccount(saved)
    : createAccountFromLegacy(saved || createDefaultCreatureState());

  const activeIdx = clampSlotIndex(account.activeSlotIndex);
  account.activeSlotIndex = account.unlockedSlots[activeIdx] ? activeIdx : 0;
  const active = account.slots[account.activeSlotIndex];
  attachAccountMeta(active, account);
  return active;
}

function saveState(context, state) {
  const account = buildPersistableAccount(state);
  context.globalState.update(STORAGE_KEY, account);
}

// Switch to targetIndex slot. Persists current slot first, returns new active slot.
// Returns null if the slot is locked or index is out of range.
function switchSlot(context, state, targetIndex) {
  const account = state && state.__account;
  if (!account) return null;

  const idx = clampSlotIndex(targetIndex);
  if (!account.unlockedSlots[idx]) return null;
  if (idx === account.activeSlotIndex) return state;

  // Persist current slot into account
  account.slots[account.activeSlotIndex] = normalizeCreatureState(state);
  account.activeSlotIndex = idx;

  const active = account.slots[idx];
  attachAccountMeta(active, account);
  context.globalState.update(STORAGE_KEY, account);
  return active;
}

function canShowPatternComment(state) {
  return !state.patternCommentDismissedUntil || Date.now() >= state.patternCommentDismissedUntil;
}

function getPuzzleForState(state) {
  const lang = state.puzzleLang || state.dominantLang;
  const pool = DEBUG_PUZZLES[lang] || DEBUG_PUZZLES.default;
  const available = pool.filter(p => p.hint !== state._lastPuzzleHint);
  const chosen = available.length ? pickRandom(available) : pickRandom(pool);
  state._lastPuzzleHint = chosen.hint;
  return chosen;
}

module.exports = {
  STORAGE_KEY,
  PATTERN_COMMENT_TTL_MS,
  PATTERN_COMMENT_DISMISS_COOLDOWN_MS,
  SLOT_COUNT,
  PARADIGM_XP,
  loadState,
  saveState,
  switchSlot,
  canShowPatternComment,
  getPuzzleForState,
};
