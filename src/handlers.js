const { getPuzzleForState, PATTERN_COMMENT_DISMISS_COOLDOWN_MS } = require('./state');

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Returns a map of webview message type → handler function.
// Each handler mutates `state` in-place. `prestige` clears and replaces all
// keys on the same object so existing closures always see the current values.
function createHandlers(state, { refresh, stopEatingRam, setChaseRunning, unlockLore, PRESTIGE_NAMES }) {
  return {

    feed() {
      const today      = new Date().toDateString();
      const isSleeping = (Date.now() - state.lastActive) / 60000 > 60;
      if (state.lastFeedDate !== today) {
        const yesterday  = new Date(Date.now() - 86400000).toDateString();
        state.feedStreak = state.lastFeedDate === yesterday ? (state.feedStreak || 0) + 1 : 1;
        state.lastFeedDate = today;
      }
      if (state.isEatingRam) stopEatingRam();
      else if (state.starvedSince) state.starvedSince = null;
      if (state.unlockedGhost) {
        state.unlockedGhost  = false;
        state.feralSince     = null;
        state.patternComment = pickRandom([
          `wow i have to b so melodramatic to get some food around here`,
          `three days. THREE DAYS. and all it took was u clicking a button`,
          `back from the dead specifically to complain about ur feeding schedule`,
          `u let me go full ghost. over. kibble. i have noted this.`,
          `ethereal form: relinquished. resentment: retained.`,
        ]);
      }
      state.hunger = Math.min(100, state.hunger + 20);
      const hitFull = state.hunger >= 100;
      if (!isSleeping) {
        state.mood = Math.min(100, state.mood + 5);
        state.xp  += 5;
      }
      state._eating = true;
      if (hitFull) state._burping = true;
      else if (!isSleeping) state._nomnom = true;
      setTimeout(() => { state._eating  = false; refresh(); }, 1200);
      if (hitFull)        setTimeout(() => { state._burping = false; refresh(); }, 3200);
      else if (!isSleeping) setTimeout(() => { state._nomnom  = false; refresh(); }, 2000);
    },

    play() {
      state.mood   = Math.min(100, state.mood   + 15);
      state.hunger = Math.max(0,   state.hunger  - 5);
      state.xp    += 3;
    },

    chase_start() {
      setChaseRunning(true);
    },

    chase_abort() {
      setChaseRunning(false);
      refresh(true);
    },

    game_catch(msg) {
      const win    = msg.value && msg.value.result === 'win';
      state._playful = true;
      state.mood   = Math.min(100, state.mood   + (win ? 20 : 8));
      state.hunger = Math.max(0,   state.hunger  - 8);
      state.xp    += win ? 12 : 3;
      setTimeout(() => { setChaseRunning(false); refresh(true); },  win ? 3200 : 2700);
      setTimeout(() => { state._playful = false; refresh(); }, 11000);
    },

    rename(msg) {
      state.name = (msg.value || '').slice(0, 20) || state.name;
    },

    start_puzzle() {
      const puzzle        = getPuzzleForState(state);
      state.activePuzzle  = puzzle;
      state.puzzleState   = 'active';
      state.bugsAttempted++;
    },

    guess_bug(msg) {
      const p = state.activePuzzle;
      if (!p) return;
      if (msg.value === p.bugLine) {
        state.puzzleState = 'solved';
        state.bugsFound++;
        state.xp  += p.xp;
        state.mood = Math.min(100, state.mood + 20);
        if (p.loreKey) unlockLore(state, p.loreKey);
        if (p.lore && !state.unlockedLore.includes('puzzle_' + state.bugsFound)) {
          state.unlockedLore.push('puzzle_' + state.bugsFound);
        }
      } else {
        state.puzzleState = 'failed';
        state.mood        = Math.max(0, state.mood - 10);
      }
    },

    dismiss_puzzle() {
      state.activePuzzle = null;
      state.puzzleState  = 'idle';
    },

    set_puzzle_lang(msg) {
      state.puzzleLang = msg.value || null;
    },

    dismiss_comment() {
      state.patternComment              = null;
      state.patternCommentExpiresAt     = null;
      state.patternCommentDismissedUntil = Date.now() + PATTERN_COMMENT_DISMISS_COOLDOWN_MS;
    },

    prestige() {
      if (state.isEatingRam) stopEatingRam();
      const ancestor = {
        name:          state.name,
        generation:    state.generation,
        dominantLang:  state.dominantLang,
        dominantColor: state.dominantColor,
        xp:            state.xp,
        bugsFound:     state.bugsFound,
        totalCommits:  state.totalCommits || 0,
        retiredAt:     Date.now(),
        features:      state.unlockedFeatures.map(f => ({ featureId: f.featureId, label: f.label, color: f.color })),
      };
      const inheritedFeature = state.unlockedFeatures[0] || null;
      const nextName         = pickRandom(PRESTIGE_NAMES);
      const prevGens         = [...state.generations, ancestor];
      const prevGen          = state.generation + 1;
      const prevLore         = [...state.unlockedLore];
      const inheritedTraits  = state.installedExtTraits;
      const hadGhost         = state.unlockedGhost || false;
      const newValues = {
        xp: 0, hunger: 100, mood: 80,
        langCounts: {}, unlockedFeatures: inheritedFeature ? [inheritedFeature] : [], activeHybrids: [],
        installedExtTraits: inheritedTraits, dominantLang: null,
        dominantColor: inheritedFeature ? inheritedFeature.color : '#888888',
        blendColor:    inheritedFeature ? inheritedFeature.color : '#888888',
        lastActive: Date.now(), name: nextName,
        lastMorningFeedDate: null, lastAfternoonFeedDate: null,
        bugsFound: 0, bugsAttempted: 0,
        achievements: [], unlockedLore: prevLore, unlockedGhost: hadGhost,
        patternCommentExpiresAt: null, patternCommentDismissedUntil: null,
        patternComment: `I remember ${ancestor.name}. Something of them remains.`,
        codedPastMidnight: false, codedOnWeekend: false,
        longestSessionMinutes: 0, sessionStartTime: null,
        feedStreak: 0, lastFeedDate: null,
        activePuzzle: null, puzzleState: 'idle', puzzleLang: null, _lastPuzzleHint: null,
        totalCommits: 0, lastProcessComment: null, cpuTemp: null, cpuTempAvailable: false,
        generation: prevGen, generations: prevGens,
        inheritedFrom: ancestor.name, inheritedFeature,
        isEatingRam: false, starvedSince: null, feralSince: null, _playful: false,
      };
      // Replace contents in-place so all existing closures see the new values
      for (const k of Object.keys(state)) delete state[k];
      Object.assign(state, newValues);
    },

  };
}

module.exports = { createHandlers };
