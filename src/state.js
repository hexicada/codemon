const { DEBUG_PUZZLES } = require('./data');

const STORAGE_KEY    = 'codemonState_v4';
const STORAGE_KEY_V3 = 'codemonState_v3';

const PATTERN_COMMENT_TTL_MS              = 10000;
const PATTERN_COMMENT_DISMISS_COOLDOWN_MS = 30000;

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function loadState(context) {
  const saved = context.globalState.get(STORAGE_KEY)
    || (() => { const v3 = context.globalState.get(STORAGE_KEY_V3); return v3 ? { ...v3, _migratedFromV3: true } : null; })();
  if (saved) {
    saved.xp                             = Number.isFinite(saved.xp) ? saved.xp : 0;
    saved.hunger                         = Number.isFinite(saved.hunger) ? saved.hunger : 100;
    saved.mood                           = Number.isFinite(saved.mood) ? saved.mood : 80;
    saved.langCounts                     = (saved.langCounts && typeof saved.langCounts === 'object') ? saved.langCounts : {};
    saved.unlockedFeatures               = Array.isArray(saved.unlockedFeatures) ? saved.unlockedFeatures : [];
    saved.activeHybrids                  = Array.isArray(saved.activeHybrids) ? saved.activeHybrids : [];
    saved.installedExtTraits             = Array.isArray(saved.installedExtTraits) ? saved.installedExtTraits : [];
    saved.dominantLang                   = saved.dominantLang || null;
    saved.dominantColor                  = saved.dominantColor || '#888888';
    saved.blendColor                     = saved.blendColor || saved.dominantColor || '#888888';
    saved.lastActive                     = Number.isFinite(saved.lastActive) ? saved.lastActive : Date.now();
    saved.name                           = (typeof saved.name === 'string' && saved.name.trim()) ? saved.name : 'Unnamed';
    saved.lastMorningFeedDate            = saved.lastMorningFeedDate   || null;
    saved.lastAfternoonFeedDate          = saved.lastAfternoonFeedDate || null;
    saved.bugsFound                      = saved.bugsFound    || 0;
    saved.bugsAttempted                  = saved.bugsAttempted || 0;
    saved.achievements                   = saved.achievements || [];
    saved.unlockedLore                   = saved.unlockedLore || [];
    saved.unlockedGhost                  = saved.unlockedGhost || false;
    saved.patternComment                 = saved.patternComment || null;
    saved.patternCommentExpiresAt        = Number.isFinite(saved.patternCommentExpiresAt) ? saved.patternCommentExpiresAt : null;
    saved.patternCommentDismissedUntil   = Number.isFinite(saved.patternCommentDismissedUntil) ? saved.patternCommentDismissedUntil : null;
    saved.codedPastMidnight              = saved.codedPastMidnight  || false;
    saved.codedOnWeekend                 = saved.codedOnWeekend     || false;
    saved.longestSessionMinutes          = saved.longestSessionMinutes || 0;
    saved.sessionStartTime               = saved.sessionStartTime   || null;
    saved.feedStreak                     = saved.feedStreak         || 0;
    saved.lastFeedDate                   = saved.lastFeedDate       || null;
    saved.activePuzzle                   = saved.activePuzzle       || null;
    saved.puzzleState                    = saved.puzzleState        || 'idle'; // idle | active | solved | failed
    saved.puzzleLang                     = saved.puzzleLang         || null;  // null = auto (dominant lang)
    saved.totalCommits                   = saved.totalCommits       || 0;
    saved.lastProcessComment             = saved.lastProcessComment || null;
    saved.cpuTemp                        = saved.cpuTemp     != null ? saved.cpuTemp : null;
    saved.cpuTempAvailable               = saved.cpuTempAvailable   || false;
    saved.generation                     = saved.generation         || 0;
    saved.generations                    = saved.generations        || [];
    saved.inheritedFrom                  = saved.inheritedFrom      || null;
    saved.inheritedFeature               = saved.inheritedFeature   || null;
    saved.starvedSince                   = saved.starvedSince  != null ? saved.starvedSince : null;
    saved.isEatingRam                    = saved.isEatingRam        || false;
    saved.feralSince                     = saved.feralSince    != null ? saved.feralSince : null;
    saved._playful                       = false;
    return saved;
  }
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

function saveState(context, state) {
  context.globalState.update(STORAGE_KEY, state);
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
  loadState,
  saveState,
  canShowPatternComment,
  getPuzzleForState,
};
