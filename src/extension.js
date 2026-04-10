const vscode = require('vscode');
const { exec } = require('child_process');
const { DEBUG_PUZZLES, LORE_ENTRIES, ACHIEVEMENTS, PATTERN_COMMENTS, COMMIT_COMMENTS, PROCESS_COMMENTS, CPU_COMMENTS } = require('./data');

// ── LANG / HYBRID / EXT DEFINITIONS ──────────────────────────────────────────

const LANG_TRAITS = {
  python:     { element:'serpent', color:'#4b8bbe', features:{ 50:{id:'scales_light',label:'faint scales',desc:'Python whispers. Faint diamond scales appear along the spine.'}, 150:{id:'scales_full',label:'scale plates',desc:'Full serpentine scale plating. The body moves with a sinuous flow.'}, 400:{id:'forked_tongue',label:'forked tongue',desc:'A forked tongue flickers. It tastes the air for errors.'}, 800:{id:'snake_tail',label:'coiled tail',desc:'A coiled serpent tail. Patient. Precise.'} }},
  rust:       { element:'iron',    color:'#ce422b', features:{ 50:{id:'rust_flecks',label:'rust flecks',desc:'Oxidised iron crusts over the outer skin.'}, 150:{id:'iron_plates',label:'iron plating',desc:'Segmented iron plates lock into place. Nothing gets through.'}, 400:{id:'claws',label:'iron claws',desc:'Iron claws. Grip is ownership.'}, 800:{id:'exoskeleton',label:'full exoskeleton',desc:'A complete exoskeleton. Fearless. Borrow-checked.'} }},
  javascript: { element:'electric',color:'#f7df1e', features:{ 50:{id:'spark_static',label:'static sparks',desc:'Static sparks jump off the skin at random. Unpredictable.'}, 150:{id:'arc_trail',label:'arc trail',desc:'A crackling arc trail follows movement. Asynchronous.'}, 400:{id:'yellow_corona',label:'electric corona',desc:'A yellow corona pulses around the head. Prototype chain visible.'}, 800:{id:'lightning_fin',label:'lightning fin',desc:'A jagged lightning fin erupts from the back. undefined is defined.'} }},
  typescript: { element:'order',   color:'#3178c6', features:{ 50:{id:'blue_lattice',label:'type lattice',desc:'A faint blue lattice marks the skin. Every surface typed.'}, 150:{id:'rigid_spine',label:'rigid spine',desc:'The spine straightens. Strictly typed.'}, 400:{id:'interface_wings',label:'interface wings',desc:'Small translucent wings. Purely decorative? Or contractual.'}, 800:{id:'halo',label:'strict halo',desc:'A pale blue halo. noImplicitAny. Peace.'} }},
  r:          { element:'data',    color:'#276dc3', features:{ 50:{id:'data_spots',label:'data spots',desc:'Irregular spots mottle the skin like a scatter plot.'}, 150:{id:'histogram_ridge',label:'histogram ridge',desc:'A stepped ridge runs down the back. Distribution: bimodal.'}, 400:{id:'chart_eyes',label:'chart eyes',desc:'The eyes become circular charts. P < 0.05.'}, 800:{id:'data_tendrils',label:'data tendrils',desc:'Long statistical tendrils trail from the limbs. Regression lines.'} }},
  go:         { element:'wind',    color:'#00add8', features:{ 50:{id:'stream_lines',label:'streamlines',desc:'Streamlines trace the body like wind tunnel visualization.'}, 150:{id:'channel_gills',label:'channel gills',desc:'Gill-like channels on the sides. Goroutines breathe.'}, 400:{id:'phased_limbs',label:'phased limbs',desc:'Limbs phase slightly out of sync. Concurrent.'}, 800:{id:'gopher_ears',label:'gopher ears',desc:'Rounded ears appear. Simple. Opinionated. Fast.'} }},
  haskell:    { element:'void',    color:'#5e5086', features:{ 50:{id:'void_shimmer',label:'void shimmer',desc:'The surface shimmers between states. Lazy evaluation.'}, 150:{id:'monad_rings',label:'monad rings',desc:'Rings orbit the body slowly. Functors. Monads.'}, 400:{id:'lambda_mark',label:'lambda mark',desc:'A lambda symbol is burned into the forehead.'}, 800:{id:'category_wings',label:'category wings',desc:'Wings that fold through higher dimensions. Pure.'} }},
  cpp:        { element:'fire',    color:'#f34b7d', features:{ 50:{id:'heat_shimmer',label:'heat shimmer',desc:'Heat distortion around the body. Undefined behavior radiates.'}, 150:{id:'pointer_horns',label:'pointer horns',desc:'Small horns like pointer arrows. Memory is yours to manage.'}, 400:{id:'flame_mane',label:'flame mane',desc:'A mane of low fire. Segfault-born. Veteran.'}, 800:{id:'template_tail',label:'template tail',desc:'A tail that branches into multiple types. Generic.'} }},
  lua:        { element:'moon',    color:'#7b86b8', features:{ 50:{id:'lunar_glow',label:'lunar glow',desc:'A faint lunar glow. Embedded everywhere, seen nowhere.'}, 150:{id:'table_shell',label:'table shell',desc:'A shell of interlocking tables. The only data structure needed.'}, 400:{id:'metatail',label:'metatail',desc:'A tail with metamethods. Indexing is recursive.'}, 800:{id:'coroutine_fins',label:'coroutine fins',desc:'Fins that yield and resume independently.'} }},
  ruby:       { element:'gem',     color:'#cc342d', features:{ 50:{id:'gem_flecks',label:'gem flecks',desc:'Crystalline gem flecks catch the light. Matz is nice.'}, 150:{id:'ruby_spine',label:'ruby spine',desc:'A spine of deep red rubies. Convention over configuration.'}, 400:{id:'facet_eyes',label:'facet eyes',desc:'Faceted gem eyes. Everything is an object. Everything.'}, 800:{id:'crystal_wings',label:'crystal wings',desc:'Crystalline wings. Beautiful. Slow when needed. Fast enough.'} }},
};

const HYBRIDS = [
  { id:'data_serpent',      requires:{python:100,r:100},       name:'Data Serpent',       desc:'Scales arranged in statistical distributions. The tail is a confidence interval.', color:'#5ba0c8', featureId:'hybrid_datascale',  featureLabel:'data-mapped scales' },
  { id:'serpentine_circuit',requires:{python:150,javascript:150},name:'Serpentine Circuit', desc:'Scales flicker with electric current. Snake logic, chaotic energy.',               color:'#a8d8a8', featureId:'hybrid_scale_spark', featureLabel:'electric scales' },
  { id:'iron_serpent',      requires:{python:150,rust:150},     name:'Iron Serpent',       desc:'Iron plates over serpent scales. Ownership enforced. Memory safe.',                color:'#8b7f6f', featureId:'hybrid_ironscale',  featureLabel:'ironscale plating' },
  { id:'analyst_beast',     requires:{r:150,python:150},        name:'Analyst Beast',      desc:'Tidyverse veins. NumPy spine. The ultimate data creature.',                        color:'#4e9af1', featureId:'hybrid_analyst',    featureLabel:'data lattice skin' },
  { id:'void_circuit',      requires:{haskell:100,javascript:100},name:'Void Circuit',     desc:'Pure functions crackling with side effects. Contradiction embodied.',              color:'#9b72cf', featureId:'hybrid_voidarc',    featureLabel:'void arcs' },
  { id:'moon_serpent',      requires:{lua:100,python:100},      name:'Moon Serpent',       desc:'Embedded serpent. Runs inside other creatures. Lightweight. Recursive.',           color:'#b8c4e8', featureId:'hybrid_moonscale',  featureLabel:'lunar scales' },
  { id:'flame_iron',        requires:{cpp:150,rust:150},        name:'Flame Iron',         desc:'Ancient fire meets modern ownership. Terrifying. Correct.',                       color:'#e06030', featureId:'hybrid_flameirn',   featureLabel:'burning iron hide' },
];

const EXT_TRAITS = {
  'ms-python.python':                      {modifier:'serpent mark',    visualId:'ext_python'},
  'rust-lang.rust-analyzer':               {modifier:'armored shell',   visualId:'ext_rust'},
  'esbenp.prettier-vscode':                {modifier:'groomed sheen',   visualId:'ext_prettier'},
  'eamodio.gitlens':                       {modifier:'ancient eyes',    visualId:'ext_gitlens'},
  'ms-vscode.cpptools':                    {modifier:'war paint',       visualId:'ext_cpp'},
  'streetsidesoftware.code-spell-checker': {modifier:'rune script',     visualId:'ext_spell'},
  'vscodevim.vim':                         {modifier:'silent stance',   visualId:'ext_vim'},
  'ms-vscode-remote.remote-ssh':           {modifier:'ghost trail',     visualId:'ext_ssh'},
  'github.copilot':                        {modifier:'twin pupils',     visualId:'ext_copilot'},
  'tidalcycles.vscode-tidalcycles':        {modifier:'pulsing gills',   visualId:'ext_tidal'},
  'formulahendry.code-runner':             {modifier:'restless shimmer',visualId:'ext_runner'},
  'ms-toolsai.jupyter':                    {modifier:'notebook wings',  visualId:'ext_jupyter'},
  'justusadam.language-haskell':           {modifier:'void mark',       visualId:'ext_haskell'},
  'reditorsupport.r':                      {modifier:'data sigil',      visualId:'ext_r'},
};

const EVOLUTIONS = [
  {name:'Eggling',    minXP:0,    description:'Just hatched. Watches you code with wide eyes.'},
  {name:'Glitchling', minXP:400,  description:'Flickering with potential. Mimics your keystrokes.'},
  {name:'Codespawn',  minXP:1200, description:'Speaks in fragments of your most-used language.'},
  {name:'Synthecyst', minXP:3000, description:'Its form reflects your stack. Recognizes patterns.'},
  {name:'Archetype',  minXP:7000, description:'Fully evolved. A mirror of your entire coding self.'},
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function esc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function getEvolution(xp) {
  let s = EVOLUTIONS[0];
  for (const e of EVOLUTIONS) { if (xp >= e.minXP) s = e; }
  return s;
}

function blendColors(hexes) {
  if (!hexes.length) return '#888888';
  let r=0,g=0,b=0;
  for (const h of hexes) { const n=parseInt(h.replace('#',''),16); r+=(n>>16)&255; g+=(n>>8)&255; b+=n&255; }
  r=Math.round(r/hexes.length); g=Math.round(g/hexes.length); b=Math.round(b/hexes.length);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

function pickRandom(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

function getPuzzleForState(state) {
  const lang = state.dominantLang;
  const pool = DEBUG_PUZZLES[lang] || DEBUG_PUZZLES.default;
  // Avoid repeating last puzzle (compare by hint as stable key)
  const available = pool.filter(p => p.hint !== state._lastPuzzleHint);
  const chosen = available.length ? pickRandom(available) : pickRandom(pool);
  state._lastPuzzleHint = chosen.hint;
  return chosen;
}

// ── STATE ─────────────────────────────────────────────────────────────────────

function loadState(context) {
  const saved = context.globalState.get('codemonState_v4')
    || (() => { const v3 = context.globalState.get('codemonState_v3'); return v3 ? { ...v3, _migratedFromV3: true } : null; })();
  if (saved) {
    saved.lastMorningFeedDate   = saved.lastMorningFeedDate   || null;
    saved.lastAfternoonFeedDate = saved.lastAfternoonFeedDate || null;
    saved.bugsFound             = saved.bugsFound             || 0;
    saved.bugsAttempted         = saved.bugsAttempted         || 0;
    saved.achievements          = saved.achievements          || [];
    saved.unlockedLore          = saved.unlockedLore          || [];
    saved.patternComment        = saved.patternComment        || null;
    saved.codedPastMidnight     = saved.codedPastMidnight     || false;
    saved.codedOnWeekend        = saved.codedOnWeekend        || false;
    saved.longestSessionMinutes = saved.longestSessionMinutes || 0;
    saved.sessionStartTime      = saved.sessionStartTime      || null;
    saved.feedStreak            = saved.feedStreak            || 0;
    saved.lastFeedDate          = saved.lastFeedDate          || null;
    saved.activePuzzle          = saved.activePuzzle          || null;
    saved.puzzleState           = saved.puzzleState           || 'idle'; // idle | active | solved | failed
    saved.totalCommits          = saved.totalCommits          || 0;
    saved.lastProcessComment    = saved.lastProcessComment    || null;
    saved.cpuTemp               = saved.cpuTemp               != null ? saved.cpuTemp : null;
    saved.cpuTempAvailable      = saved.cpuTempAvailable      || false;
    return saved;
  }
  return {
    xp:0, hunger:100, mood:80,
    langCounts:{}, unlockedFeatures:[], activeHybrids:[],
    installedExtTraits:[], dominantLang:null, dominantColor:'#888888', blendColor:'#888888',
    lastActive:Date.now(), name:'Unnamed',
    lastMorningFeedDate:null, lastAfternoonFeedDate:null,
    bugsFound:0, bugsAttempted:0,
    achievements:[], unlockedLore:[], patternComment:null,
    codedPastMidnight:false, codedOnWeekend:false,
    longestSessionMinutes:0, sessionStartTime:null,
    feedStreak:0, lastFeedDate:null,
    activePuzzle:null, puzzleState:'idle',
    _lastPuzzleHint: null,
    totalCommits:0, lastProcessComment:null, cpuTemp:null, cpuTempAvailable:false,
  };
}

// ── ANALYSIS ──────────────────────────────────────────────────────────────────

function checkFeatureUnlocks(state) {
  const newUnlocks = [];
  for (const [lang, lt] of Object.entries(LANG_TRAITS)) {
    const count = state.langCounts[lang] || 0;
    if (!count) continue;
    for (const [thr, feat] of Object.entries(lt.features)) {
      if (count >= parseInt(thr) && !state.unlockedFeatures.some(f=>f.featureId===feat.id)) {
        state.unlockedFeatures.push({langId:lang, featureId:feat.id, label:feat.label, desc:feat.desc, color:lt.color});
        newUnlocks.push({label:feat.label, loreId:feat.id});
      }
    }
  }
  return newUnlocks;
}

function checkHybrids(state) {
  const newHybrids = [];
  for (const h of HYBRIDS) {
    if (state.activeHybrids.includes(h.id)) continue;
    if (Object.entries(h.requires).every(([l,t])=>(state.langCounts[l]||0)>=t)) {
      state.activeHybrids.push(h.id);
      if (!state.unlockedFeatures.some(f=>f.featureId===h.featureId))
        state.unlockedFeatures.push({langId:'hybrid', featureId:h.featureId, label:h.featureLabel, desc:h.desc, color:h.color});
      newHybrids.push(h);
    }
  }
  return newHybrids;
}

function checkAchievements(state) {
  const newAch = [];
  for (const a of ACHIEVEMENTS) {
    if (!state.achievements.includes(a.id) && a.check(state)) {
      state.achievements.push(a.id);
      newAch.push(a);
    }
  }
  return newAch;
}

function unlockLore(state, loreId) {
  if (LORE_ENTRIES[loreId] && !state.unlockedLore.includes(loreId)) {
    state.unlockedLore.push(loreId);
    return LORE_ENTRIES[loreId];
  }
  return null;
}

function recalcDominance(state) {
  let max=0, dom=null;
  for (const [l,c] of Object.entries(state.langCounts)) { if (c>max){max=c;dom=l;} }
  state.dominantLang = dom;
  const top3 = Object.entries(state.langCounts).sort((a,b)=>b[1]-a[1]).slice(0,3);
  state.blendColor = blendColors(top3.map(([l])=>(LANG_TRAITS[l]||{}).color).filter(Boolean));
  state.dominantColor = (LANG_TRAITS[dom]||{}).color || '#888888';
}

function detectPattern(state, lang, prevLang) {
  const h = new Date().getHours();
  const day = new Date().getDay();
  const totalEdits = Object.values(state.langCounts).reduce((a,b)=>a+b,0);

  // Late night
  if (h >= 23 || h < 4) {
    state.codedPastMidnight = true;
    if (Math.random() < 0.05) return pickRandom(PATTERN_COMMENTS.lateNight);
  }
  // Early morning
  if (h >= 5 && h < 7 && Math.random() < 0.1) return pickRandom(PATTERN_COMMENTS.earlyMorning);
  // Weekend
  if (day === 0 || day === 6) {
    state.codedOnWeekend = true;
    if (Math.random() < 0.04) return pickRandom(PATTERN_COMMENTS.weekend);
  }
  // Language switch
  if (prevLang && prevLang !== lang && Math.random() < 0.15) {
    const tmpl = pickRandom(PATTERN_COMMENTS.languageSwitch);
    return tmpl.replace('{from}', prevLang).replace('{to}', lang);
  }
  // Language-specific
  if (lang === 'rust' && Math.random() < 0.03) return pickRandom(PATTERN_COMMENTS.rust);
  if (lang === 'python' && Math.random() < 0.03) return pickRandom(PATTERN_COMMENTS.python);
  if (lang === 'r' && Math.random() < 0.03) return pickRandom(PATTERN_COMMENTS.r);
  // Many edits
  if (totalEdits % 200 === 0 && totalEdits > 0) return pickRandom(PATTERN_COMMENTS.manyEdits);
  return null;
}

async function analyzeEnvironment(state) {
  const traits = [];
  for (const ext of vscode.extensions.all) {
    const id = ext.id.toLowerCase();
    if (EXT_TRAITS[id]) traits.push({...EXT_TRAITS[id], extId:id});
  }
  state.installedExtTraits = traits;
  return Math.min(traits.length * 15, 150);
}

// ── ACTIVATE ──────────────────────────────────────────────────────────────────

let panel_ref = null;
let creatureState = null;

function activate(context) {
  creatureState = loadState(context);

  const provider = {
    resolveWebviewView(webviewView) {
      panel_ref = webviewView;
      webviewView.webview.options = {enableScripts:true};
      refreshWebview(webviewView.webview, creatureState);

      webviewView.webview.onDidReceiveMessage(msg => {
        switch (msg.type) {
          case 'feed': {
            const today = new Date().toDateString();
            if (creatureState.lastFeedDate !== today) {
              const yesterday = new Date(Date.now()-86400000).toDateString();
              creatureState.feedStreak = creatureState.lastFeedDate === yesterday ? (creatureState.feedStreak||0)+1 : 1;
              creatureState.lastFeedDate = today;
            }
            creatureState.hunger = Math.min(100, creatureState.hunger+20);
            creatureState.mood   = Math.min(100, creatureState.mood+5);
            creatureState.xp    += 5;
            break;
          }
          case 'play':
            creatureState.mood   = Math.min(100, creatureState.mood+15);
            creatureState.hunger = Math.max(0,   creatureState.hunger-5);
            creatureState.xp    += 3;
            break;
          case 'rename':
            creatureState.name = (msg.value||'').slice(0,20) || creatureState.name;
            break;
          case 'start_puzzle': {
            const puzzle = getPuzzleForState(creatureState);
            creatureState.activePuzzle = puzzle;
            creatureState.puzzleState  = 'active';
            creatureState.bugsAttempted++;
            break;
          }
          case 'guess_bug': {
            const p = creatureState.activePuzzle;
            if (!p) break;
            if (msg.lineIndex === p.bugLine) {
              creatureState.puzzleState = 'solved';
              creatureState.bugsFound++;
              creatureState.xp   += p.xp;
              creatureState.mood  = Math.min(100, creatureState.mood + 20);
              // Unlock lore from puzzle
              if (p.loreKey) unlockLore(creatureState, p.loreKey);
              // Store lore fragment in puzzle for display
              if (p.lore && !creatureState.unlockedLore.includes('puzzle_'+creatureState.bugsFound)) {
                creatureState.unlockedLore.push('puzzle_'+creatureState.bugsFound);
              }
            } else {
              creatureState.puzzleState = 'failed';
              creatureState.mood = Math.max(0, creatureState.mood - 10);
            }
            break;
          }
          case 'dismiss_puzzle':
            creatureState.activePuzzle = null;
            creatureState.puzzleState  = 'idle';
            break;
          case 'dismiss_comment':
            creatureState.patternComment = null;
            break;
        }

        const newAch = checkAchievements(creatureState);
        newAch.forEach(a => vscode.window.showInformationMessage(`🏆 Achievement: ${a.label} — ${a.desc}`));
        saveAndRefresh(context);
      });
    }
  };

  context.subscriptions.push(vscode.window.registerWebviewViewProvider('codemon.panel', provider));
  context.subscriptions.push(vscode.commands.registerCommand('codemon.open', () =>
    vscode.commands.executeCommand('workbench.view.extension.codemon-sidebar')));

  let prevLang = null;
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
    const lang = event.document.languageId;
    if (!lang || ['plaintext','log','markdown','json','scminput'].includes(lang)) return;

    // Session tracking
    if (!creatureState.sessionStartTime) creatureState.sessionStartTime = Date.now();
    const sessionMins = (Date.now() - creatureState.sessionStartTime) / 60000;
    if (sessionMins > creatureState.longestSessionMinutes) creatureState.longestSessionMinutes = sessionMins;

    creatureState.langCounts[lang] = (creatureState.langCounts[lang]||0) + 1;
    creatureState.xp += 2;
    creatureState.lastActive = Date.now();

    recalcDominance(creatureState);

    const nf = checkFeatureUnlocks(creatureState);
    const nh = checkHybrids(creatureState);

    nf.forEach(f => {
      vscode.window.showInformationMessage(`🦎 ${creatureState.name} evolved: ${f.label} unlocked!`);
      const lore = unlockLore(creatureState, f.loreId);
      if (lore) vscode.window.showInformationMessage(`📖 New lore: "${lore.title}"`);
    });
    nh.forEach(h => {
      vscode.window.showInformationMessage(`⚡ Hybrid form: ${h.name}! ${h.desc}`);
      const lore = unlockLore(creatureState, 'hybrid_'+h.id.split('_')[0]);
      if (lore) vscode.window.showInformationMessage(`📖 New lore: "${lore.title}"`);
    });

    // Pattern comment (only if none active)
    if (!creatureState.patternComment) {
      const totalEdits = Object.values(creatureState.langCounts).reduce((a,b)=>a+b,0);
      if (totalEdits === 1 && PATTERN_COMMENTS.firstEdit) {
        creatureState.patternComment = pickRandom(PATTERN_COMMENTS.firstEdit);
      } else {
        const comment = detectPattern(creatureState, lang, prevLang);
        if (comment) creatureState.patternComment = comment;
      }
    }
    prevLang = lang;

    // Long file detection
    const lineCount = event.document.lineCount;
    if (lineCount > 500 && Math.random() < 0.01 && !creatureState.patternComment) {
      creatureState.patternComment = pickRandom(PATTERN_COMMENTS.longFile);
    }

    const newAch = checkAchievements(creatureState);
    newAch.forEach(a => vscode.window.showInformationMessage(`🏆 Achievement: ${a.label} — ${a.desc}`));

    saveAndRefresh(context);
  }));

  analyzeEnvironment(creatureState).then(xp => { creatureState.xp += xp; saveAndRefresh(context); });

  // Decay + feeding reminders
  const decay = setInterval(() => {
    const now   = new Date();
    const today = now.toDateString();
    const hm    = now.getHours()*60 + now.getMinutes();

    if (hm >= 9*60+30 && creatureState.lastMorningFeedDate !== today) {
      creatureState.lastMorningFeedDate = today;
      creatureState.hunger = Math.max(0, creatureState.hunger-50);
      vscode.window.showInformationMessage(`🦎 ${creatureState.name} is hungry — morning feed time.`);
    }
    if (hm >= 15*60+30 && creatureState.lastAfternoonFeedDate !== today) {
      creatureState.lastAfternoonFeedDate = today;
      creatureState.hunger = Math.max(0, creatureState.hunger-50);
      vscode.window.showInformationMessage(`🦎 ${creatureState.name} is hungry again — afternoon feed.`);
    }

    creatureState.mood = Math.max(0, creatureState.mood-1);
    const newAch = checkAchievements(creatureState);
    newAch.forEach(a => vscode.window.showInformationMessage(`🏆 Achievement: ${a.label} — ${a.desc}`));
    saveAndRefresh(context);
  }, 5*60*1000);
  context.subscriptions.push({dispose:()=>clearInterval(decay)});

  // ── GIT COMMIT WATCHER ──────────────────────────────────────────────────
  let lastCommitMs = 0;
  function onCommit() {
    const now = Date.now();
    if (now - lastCommitMs < 2000) return; // debounce: FSW + git API may both fire
    lastCommitMs = now;
    creatureState.totalCommits = (creatureState.totalCommits || 0) + 1;
    creatureState.xp   += 20;
    creatureState.mood  = Math.min(100, creatureState.mood + 10);
    if (!creatureState.patternComment) creatureState.patternComment = pickRandom(COMMIT_COMMENTS);
    checkAchievements(creatureState).forEach(a =>
      vscode.window.showInformationMessage(`🏆 Achievement: ${a.label} — ${a.desc}`));
    saveAndRefresh(context);
  }
  // FileSystemWatcher: fires on .git/COMMIT_EDITMSG write (reliable cross-platform)
  const commitWatcher = vscode.workspace.createFileSystemWatcher('**/.git/COMMIT_EDITMSG');
  context.subscriptions.push(commitWatcher.onDidChange(onCommit));
  context.subscriptions.push(commitWatcher.onDidCreate(onCommit));
  context.subscriptions.push(commitWatcher);
  // Also hook into vscode.git extension API if available (richer, same debounce covers overlap)
  {
    const gitExt = vscode.extensions.getExtension('vscode.git');
    if (gitExt) {
      Promise.resolve(gitExt.isActive ? gitExt.exports : gitExt.activate()).then(git => {
        if (!git || !git.getAPI) return;
        const api = git.getAPI(1);
        if (!api) return;
        const watched = new Set();
        const watchRepo = repo => {
          if (watched.has(repo) || !repo.onDidCommit) return;
          watched.add(repo);
          context.subscriptions.push(repo.onDidCommit(onCommit));
        };
        api.repositories.forEach(watchRepo);
        context.subscriptions.push(api.onDidOpenRepository(watchRepo));
      }).catch(() => {});
    }
  }

  // ── PROCESS SCAN ────────────────────────────────────────────────────────
  function runProcessScan() {
    const cmd = process.platform === 'win32' ? 'tasklist /FO CSV /NH' : 'ps aux';
    exec(cmd, {timeout:10000}, (err, stdout) => {
      if (err) { console.log('[codemon] process scan error:', err.message); return; }
      const text = stdout.toLowerCase();
      const matched = Object.keys(PROCESS_COMMENTS).filter(k => text.includes(k.toLowerCase()));
      const now = Date.now();
      const cooldown = 30 * 60 * 1000;
      let chosen = null;
      if (matched.length > 0) {
        const eligible = matched.filter(k =>
          !creatureState.lastProcessComment ||
          creatureState.lastProcessComment.key !== k ||
          now - creatureState.lastProcessComment.timestamp > cooldown
        );
        if (eligible.length > 0) chosen = pickRandom(eligible);
      } else if (!creatureState.lastProcessComment ||
                 now - creatureState.lastProcessComment.timestamp > cooldown) {
        if (Math.random() < 0.3) chosen = '__quiet';
      }
      if (!chosen || creatureState.patternComment) return;
      creatureState.patternComment = chosen === '__quiet'
        ? "Quiet out there. Just us and the editor."
        : PROCESS_COMMENTS[chosen];
      creatureState.lastProcessComment = {key:chosen, timestamp:now};
      saveAndRefresh(context);
    });
  }
  runProcessScan();
  const procScan = setInterval(runProcessScan, 10 * 60 * 1000);
  context.subscriptions.push({dispose:()=>clearInterval(procScan)});

  // ── CPU TEMPERATURE ──────────────────────────────────────────────────────
  function pollCpuTemp() {
    const platform = process.platform;
    let cmd;
    if (platform === 'win32') {
      cmd = 'powershell -NoProfile -Command "Get-CimInstance -Namespace root/wmi -ClassName MSAcpi_ThermalZoneTemperature | Select-Object -ExpandProperty CurrentTemperature -First 1"';
    } else if (platform === 'linux') {
      cmd = 'cat /sys/class/thermal/thermal_zone0/temp';
    } else {
      creatureState.cpuTempAvailable = false;
      return;
    }
    exec(cmd, {timeout:6000}, (err, stdout) => {
      if (err || !stdout.trim()) {
        creatureState.cpuTempAvailable = false;
        console.log('[codemon] cpu temp unavailable');
        return;
      }
      const raw = parseInt(stdout.trim());
      if (isNaN(raw)) { creatureState.cpuTempAvailable = false; return; }
      const temp = Math.round(platform === 'win32' ? (raw / 10) - 273.15 : raw / 1000);
      if (temp < 0 || temp > 120) { creatureState.cpuTempAvailable = false; return; }
      creatureState.cpuTemp          = temp;
      creatureState.cpuTempAvailable = true;
      if (!creatureState.patternComment) {
        if (temp >= 90) {
          creatureState.patternComment = CPU_COMMENTS.critical;
          vscode.window.showWarningMessage(`⚠️ ${creatureState.name} is concerned. CPU at ${temp}°C. Maybe save your work.`);
        } else if (temp >= 80) {
          creatureState.patternComment = CPU_COMMENTS.hot;
        } else if (temp >= 60 && Math.random() < 0.2) {
          creatureState.patternComment = pickRandom(CPU_COMMENTS.warm);
        }
      }
      saveAndRefresh(context);
    });
  }
  pollCpuTemp();
  const cpuPoll = setInterval(pollCpuTemp, 2 * 60 * 1000);
  context.subscriptions.push({dispose:()=>clearInterval(cpuPoll)});
}

function saveAndRefresh(context) {
  context.globalState.update('codemonState_v4', creatureState);
  if (panel_ref) refreshWebview(panel_ref.webview, creatureState);
}

// ── SVG FEATURE OVERLAYS ──────────────────────────────────────────────────────
// (Same visual system as before — abbreviated here for space, full version inline)

function featureOverlays(features) {
  const ids = features.map(f=>f.featureId);
  const out = [];
  const scaleColor = ids.includes('hybrid_ironscale')?'#8b7f6f':ids.includes('hybrid_datascale')?'#5ba0c8':ids.includes('hybrid_scale_spark')?'#a8d8a8':ids.includes('hybrid_moonscale')?'#b8c4e8':ids.includes('hybrid_analyst')?'#4e9af1':'#4b8bbe';
  if (ids.some(i=>['scales_full','hybrid_ironscale','hybrid_datascale','hybrid_scale_spark','hybrid_moonscale','hybrid_analyst'].includes(i)))
    out.push(`<g opacity="0.75"><polygon points="45,40 50,36 55,40 50,44" fill="${scaleColor}55" stroke="${scaleColor}" stroke-width="0.6"/><polygon points="37,50 42,46 47,50 42,54" fill="${scaleColor}55" stroke="${scaleColor}" stroke-width="0.6"/><polygon points="53,50 58,46 63,50 58,54" fill="${scaleColor}55" stroke="${scaleColor}" stroke-width="0.6"/><polygon points="41,60 46,56 51,60 46,64" fill="${scaleColor}55" stroke="${scaleColor}" stroke-width="0.6"/><polygon points="55,60 60,56 65,60 60,64" fill="${scaleColor}55" stroke="${scaleColor}" stroke-width="0.6"/><polygon points="47,70 52,66 57,70 52,74" fill="${scaleColor}55" stroke="${scaleColor}" stroke-width="0.6"/></g>`);
  else if (ids.includes('scales_light'))
    out.push(`<g opacity="0.4"><polygon points="45,46 50,42 55,46 50,50" fill="#4b8bbe33" stroke="#4b8bbe" stroke-width="0.5"/><polygon points="43,56 48,52 53,56 48,60" fill="#4b8bbe33" stroke="#4b8bbe" stroke-width="0.5"/><polygon points="53,56 58,52 63,56 58,60" fill="#4b8bbe33" stroke="#4b8bbe" stroke-width="0.5"/></g>`);
  if (ids.includes('forked_tongue')||ids.includes('metatail')) out.push(`<line x1="50" y1="63" x2="50" y2="70" stroke="#4b8bbe" stroke-width="1.2" stroke-linecap="round"/><line x1="50" y1="68" x2="45" y2="76" stroke="#4b8bbe" stroke-width="1" stroke-linecap="round"/><line x1="50" y1="68" x2="55" y2="76" stroke="#4b8bbe" stroke-width="1" stroke-linecap="round"/>`);
  if (ids.includes('snake_tail')) out.push(`<path d="M50,80 Q43,87 47,93 Q53,98 57,93 Q61,87 55,84 Q50,82 50,80" fill="#4b8bbe22" stroke="#4b8bbe" stroke-width="1.2" stroke-linecap="round"/>`);
  if (ids.includes('iron_plates')||ids.includes('exoskeleton')||ids.includes('hybrid_ironscale')||ids.includes('hybrid_flameirn')) { const ic=ids.includes('hybrid_flameirn')?'#e06030':'#ce422b'; out.push(`<rect x="36" y="44" width="11" height="9" rx="1" fill="${ic}25" stroke="${ic}" stroke-width="0.8"/><rect x="53" y="44" width="11" height="9" rx="1" fill="${ic}25" stroke="${ic}" stroke-width="0.8"/><rect x="40" y="55" width="20" height="10" rx="1" fill="${ic}25" stroke="${ic}" stroke-width="0.8"/><rect x="43" y="67" width="14" height="8" rx="1" fill="${ic}25" stroke="${ic}" stroke-width="0.8"/>`); }
  if (ids.includes('rust_flecks')) out.push(`<circle cx="38" cy="47" r="1.5" fill="#ce422b" opacity="0.55"/><circle cx="55" cy="43" r="1" fill="#ce422b" opacity="0.5"/><circle cx="62" cy="52" r="1.5" fill="#ce422b" opacity="0.55"/><circle cx="44" cy="61" r="1" fill="#ff8c42" opacity="0.5"/><circle cx="58" cy="64" r="1.5" fill="#ce422b" opacity="0.5"/>`);
  if (ids.includes('claws')||ids.includes('exoskeleton')) out.push(`<line x1="28" y1="60" x2="20" y2="67" stroke="#ce422b" stroke-width="1.5" stroke-linecap="round"/><line x1="27" y1="57" x2="19" y2="59" stroke="#ce422b" stroke-width="1.5" stroke-linecap="round"/><line x1="72" y1="60" x2="80" y2="67" stroke="#ce422b" stroke-width="1.5" stroke-linecap="round"/><line x1="73" y1="57" x2="81" y2="59" stroke="#ce422b" stroke-width="1.5" stroke-linecap="round"/>`);
  if (ids.includes('lightning_fin')||ids.includes('arc_trail')||ids.includes('hybrid_voidarc')||ids.includes('hybrid_scale_spark')) { const fc=ids.includes('hybrid_voidarc')?'#9b72cf':'#f7df1e'; out.push(`<polygon points="50,16 44,28 48,26 43,40 50,34 57,40 52,26 56,28" fill="${fc}77" stroke="${fc}" stroke-width="0.8"/>`); }
  if (ids.includes('spark_static')) out.push(`<line x1="30" y1="41" x2="25" y2="36" stroke="#f7df1e" stroke-width="0.8" opacity="0.55"/><line x1="27" y1="44" x2="22" y2="44" stroke="#f7df1e" stroke-width="0.8" opacity="0.55"/><line x1="70" y1="41" x2="75" y2="36" stroke="#f7df1e" stroke-width="0.8" opacity="0.55"/><line x1="73" y1="44" x2="78" y2="44" stroke="#f7df1e" stroke-width="0.8" opacity="0.55"/>`);
  if (ids.includes('yellow_corona')) out.push(`<ellipse cx="50" cy="38" rx="18" ry="14" fill="none" stroke="#f7df1e" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.45"/>`);
  if (ids.includes('monad_rings')||ids.includes('category_wings')) out.push(`<ellipse cx="50" cy="50" rx="29" ry="9" fill="none" stroke="#5e5086" stroke-width="0.8" stroke-dasharray="3,2" opacity="0.55" transform="rotate(-20,50,50)"/><ellipse cx="50" cy="50" rx="35" ry="11" fill="none" stroke="#c792ea" stroke-width="0.6" stroke-dasharray="2,3" opacity="0.35" transform="rotate(20,50,50)"/>`);
  if (ids.includes('lambda_mark')) out.push(`<text x="46" y="36" font-size="10" fill="#c792ea" font-family="monospace" opacity="0.9">λ</text>`);
  if (ids.includes('category_wings')||ids.includes('interface_wings')) { const wc=ids.includes('category_wings')?'#5e5086':'#3178c6'; out.push(`<path d="M28,50 Q14,40 16,26 Q20,14 30,24" fill="${wc}22" stroke="${wc}" stroke-width="0.8"/><path d="M72,50 Q86,40 84,26 Q80,14 70,24" fill="${wc}22" stroke="${wc}" stroke-width="0.8"/>`); }
  if (ids.includes('halo')) out.push(`<ellipse cx="50" cy="18" rx="17" ry="4" fill="none" stroke="#93c5fd" stroke-width="1.2" opacity="0.8"/>`);
  if (ids.includes('blue_lattice')) out.push(`<g opacity="0.2" stroke="#3178c6" stroke-width="0.5"><line x1="36" y1="45" x2="64" y2="45"/><line x1="34" y1="55" x2="66" y2="55"/><line x1="35" y1="65" x2="65" y2="65"/><line x1="44" y1="37" x2="41" y2="73"/><line x1="50" y1="34" x2="50" y2="75"/><line x1="56" y1="37" x2="59" y2="73"/></g>`);
  if (ids.includes('rigid_spine')) out.push(`<line x1="50" y1="30" x2="50" y2="78" stroke="#3178c6" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/><line x1="46" y1="40" x2="54" y2="40" stroke="#3178c6" stroke-width="0.7" opacity="0.4"/><line x1="45" y1="52" x2="55" y2="52" stroke="#3178c6" stroke-width="0.7" opacity="0.4"/>`);
  if (ids.includes('chart_eyes')) out.push(`<circle cx="37" cy="44" r="5" fill="#276dc322" stroke="#276dc3" stroke-width="0.8"/><path d="M37,44 L37,40 A4,4 0 0,1 40.5,46.5 Z" fill="#276dc3" opacity="0.8"/><circle cx="63" cy="44" r="5" fill="#276dc322" stroke="#276dc3" stroke-width="0.8"/><path d="M63,44 L63,40 A4,4 0 0,1 66.5,46.5 Z" fill="#276dc3" opacity="0.8"/>`);
  if (ids.includes('data_tendrils')||ids.includes('hybrid_analyst')||ids.includes('hybrid_datascale')) out.push(`<path d="M28,55 Q18,50 14,58 Q12,65 18,67" fill="none" stroke="#276dc3" stroke-width="0.8" stroke-dasharray="2,1.5" opacity="0.7"/><path d="M72,55 Q82,50 86,58 Q88,65 82,67" fill="none" stroke="#276dc3" stroke-width="0.8" stroke-dasharray="2,1.5" opacity="0.7"/><path d="M50,80 Q45,91 41,93" fill="none" stroke="#276dc3" stroke-width="0.8" stroke-dasharray="2,1.5" opacity="0.6"/><path d="M50,80 Q55,91 59,93" fill="none" stroke="#276dc3" stroke-width="0.8" stroke-dasharray="2,1.5" opacity="0.6"/>`);
  if (ids.includes('histogram_ridge')) out.push(`<rect x="41" y="26" width="4" height="7" fill="#276dc344" stroke="#276dc3" stroke-width="0.5"/><rect x="46" y="21" width="4" height="12" fill="#276dc344" stroke="#276dc3" stroke-width="0.5"/><rect x="51" y="23" width="4" height="10" fill="#276dc344" stroke="#276dc3" stroke-width="0.5"/><rect x="56" y="28" width="4" height="5" fill="#276dc344" stroke="#276dc3" stroke-width="0.5"/>`);
  if (ids.includes('data_spots')) out.push(`<circle cx="41" cy="48" r="2" fill="#276dc3" opacity="0.3"/><circle cx="59" cy="46" r="1.5" fill="#276dc3" opacity="0.25"/><circle cx="54" cy="59" r="2.5" fill="#276dc3" opacity="0.3"/><circle cx="39" cy="63" r="1.5" fill="#276dc3" opacity="0.25"/><circle cx="61" cy="61" r="2" fill="#276dc3" opacity="0.3"/>`);
  if (ids.includes('channel_gills')) out.push(`<line x1="28" y1="47" x2="21" y2="51" stroke="#00add8" stroke-width="1.3"/><line x1="28" y1="53" x2="21" y2="57" stroke="#00add8" stroke-width="1.3"/><line x1="28" y1="59" x2="21" y2="63" stroke="#00add8" stroke-width="1.3"/><line x1="72" y1="47" x2="79" y2="51" stroke="#00add8" stroke-width="1.3"/><line x1="72" y1="53" x2="79" y2="57" stroke="#00add8" stroke-width="1.3"/><line x1="72" y1="59" x2="79" y2="63" stroke="#00add8" stroke-width="1.3"/>`);
  if (ids.includes('stream_lines')) out.push(`<path d="M30,38 Q50,33 70,38" fill="none" stroke="#00add8" stroke-width="0.7" opacity="0.45"/><path d="M28,50 Q50,44 72,50" fill="none" stroke="#00add8" stroke-width="0.7" opacity="0.35"/><path d="M30,62 Q50,57 70,62" fill="none" stroke="#00add8" stroke-width="0.7" opacity="0.25"/>`);
  if (ids.includes('phased_limbs')) out.push(`<line x1="29" y1="52" x2="18" y2="60" stroke="#00add8" stroke-width="1" stroke-linecap="round" opacity="0.25" stroke-dasharray="2,2"/><line x1="71" y1="52" x2="82" y2="60" stroke="#00add8" stroke-width="1" stroke-linecap="round" opacity="0.25" stroke-dasharray="2,2"/>`);
  if (ids.includes('gopher_ears')) out.push(`<ellipse cx="38" cy="29" rx="6" ry="7" fill="#00add822" stroke="#00add8" stroke-width="0.9"/><ellipse cx="62" cy="29" rx="6" ry="7" fill="#00add822" stroke="#00add8" stroke-width="0.9"/>`);
  if (ids.includes('flame_mane')||ids.includes('hybrid_flameirn')) { const fc=ids.includes('hybrid_flameirn')?'#e06030':'#f34b7d'; out.push(`<path d="M38,28 Q35,18 40,13 Q38,23 44,20 Q41,28 46,26 Q44,33 50,30 Q56,33 54,26 Q59,28 56,20 Q62,23 60,13 Q65,18 62,28" fill="${fc}66" stroke="${fc}" stroke-width="0.5"/>`); }
  if (ids.includes('pointer_horns')) out.push(`<line x1="40" y1="28" x2="36" y2="16" stroke="#f34b7d" stroke-width="1.5" stroke-linecap="round"/><line x1="60" y1="28" x2="64" y2="16" stroke="#f34b7d" stroke-width="1.5" stroke-linecap="round"/>`);
  if (ids.includes('heat_shimmer')) out.push(`<path d="M34,42 Q37,38 40,42 Q43,46 46,42" fill="none" stroke="#f34b7d" stroke-width="0.7" opacity="0.4"/><path d="M54,42 Q57,38 60,42 Q63,46 66,42" fill="none" stroke="#f34b7d" stroke-width="0.7" opacity="0.4"/>`);
  if (ids.includes('lunar_glow')||ids.includes('hybrid_moonscale')) out.push(`<circle cx="50" cy="50" r="27" fill="none" stroke="#7b86b8" stroke-width="0.5" stroke-dasharray="4,5" opacity="0.35"/>`);
  if (ids.includes('table_shell')) out.push(`<g opacity="0.35" stroke="#7b86b8" stroke-width="0.6" fill="#7b86b811"><rect x="35" y="44" width="12" height="10" rx="1"/><rect x="53" y="44" width="12" height="10" rx="1"/><rect x="38" y="56" width="24" height="10" rx="1"/><rect x="41" y="68" width="18" height="8" rx="1"/></g>`);
  if (ids.includes('coroutine_fins')) out.push(`<path d="M28,44 Q16,41 18,52 Q16,63 28,59" fill="#7b86b822" stroke="#7b86b8" stroke-width="0.9"/><path d="M72,44 Q84,41 82,52 Q84,63 72,59" fill="#7b86b822" stroke="#7b86b8" stroke-width="0.9"/>`);
  if (ids.includes('ruby_spine')||ids.includes('gem_flecks')) out.push(`<circle cx="50" cy="33" r="2.5" fill="#cc342d88" stroke="#cc342d" stroke-width="0.7"/><circle cx="50" cy="43" r="2" fill="#cc342d88" stroke="#cc342d" stroke-width="0.7"/><circle cx="50" cy="53" r="2" fill="#cc342d88" stroke="#cc342d" stroke-width="0.7"/><circle cx="50" cy="63" r="2.5" fill="#cc342d88" stroke="#cc342d" stroke-width="0.7"/>`);
  if (ids.includes('facet_eyes')) out.push(`<polygon points="37,40 41,44 37,48 33,44" fill="#cc342d22" stroke="#cc342d" stroke-width="0.8"/><polygon points="63,40 67,44 63,48 59,44" fill="#cc342d22" stroke="#cc342d" stroke-width="0.8"/>`);
  if (ids.includes('crystal_wings')) out.push(`<polygon points="28,50 16,42 20,54 14,60 26,58" fill="#cc342d15" stroke="#cc342d" stroke-width="0.8"/><polygon points="72,50 84,42 80,54 86,60 74,58" fill="#cc342d15" stroke="#cc342d" stroke-width="0.8"/>`);
  if (ids.includes('void_shimmer')||ids.includes('hybrid_voidarc')) out.push(`<circle cx="50" cy="50" r="24" fill="none" stroke="#5e5086" stroke-width="0.6" stroke-dasharray="2,6" opacity="0.4"/>`);
  if (ids.includes('template_tail')) out.push(`<line x1="50" y1="80" x2="50" y2="87" stroke="#f34b7d" stroke-width="1.2" stroke-linecap="round"/><line x1="50" y1="87" x2="44" y2="95" stroke="#f34b7d" stroke-width="1" stroke-linecap="round"/><line x1="50" y1="87" x2="56" y2="95" stroke="#f34b7d" stroke-width="1" stroke-linecap="round"/>`);
  return out.join('\n');
}

function buildCreatureSVG(evoIdx, c, bc, mood, features, extTraits) {
  const dim = mood==='sleeping'||mood==='drowsy';
  const happy = mood==='happy';
  const eyeL = dim?`<line x1="34" y1="44" x2="41" y2="44" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`:happy?`<path d="M33 43 Q37.5 39 42 43" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`:`<circle cx="37" cy="44" r="3" fill="${c}"/>`;
  const eyeR = dim?`<line x1="59" y1="44" x2="66" y2="44" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`:happy?`<path d="M58 43 Q62.5 39 67 43" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`:`<circle cx="63" cy="44" r="3" fill="${c}"/>`;
  const mouth = happy?`<path d="M43 56 Q50 62 57 56" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`:dim?`<line x1="44" y1="58" x2="56" y2="58" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`:`<line x1="44" y1="57" x2="56" y2="57" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`;
  const bodies = [
    `<ellipse cx="50" cy="55" rx="20" ry="26" fill="${c}20" stroke="${c}" stroke-width="1.5"/><ellipse cx="50" cy="55" rx="12" ry="16" fill="${bc}10"/>`,
    `<ellipse cx="50" cy="54" rx="20" ry="24" fill="${c}20" stroke="${c}" stroke-width="1.5"/><rect x="30" y="52" width="8" height="2" fill="${c}44"/><rect x="62" y="58" width="6" height="2" fill="${c}44"/><ellipse cx="50" cy="54" rx="10" ry="14" fill="${bc}10"/>`,
    `<ellipse cx="50" cy="56" rx="22" ry="22" fill="${c}20" stroke="${c}" stroke-width="1.5"/><ellipse cx="28" cy="60" rx="7" ry="5" fill="${bc}20" stroke="${c}" stroke-width="1"/><ellipse cx="72" cy="60" rx="7" ry="5" fill="${bc}20" stroke="${c}" stroke-width="1"/><ellipse cx="50" cy="80" rx="5" ry="8" fill="${c}20" stroke="${c}" stroke-width="1"/>`,
    `<polygon points="50,22 72,38 72,72 50,82 28,72 28,38" fill="${c}20" stroke="${c}" stroke-width="1.5"/><polygon points="50,30 64,40 64,68 50,74 36,68 36,40" fill="${bc}10"/><line x1="28" y1="55" x2="18" y2="65" stroke="${c}" stroke-width="1.5"/><line x1="72" y1="55" x2="82" y2="65" stroke="${c}" stroke-width="1.5"/>`,
    `<polygon points="50,15 68,28 78,50 68,72 50,85 32,72 22,50 32,28" fill="${c}20" stroke="${c}" stroke-width="1.5"/><polygon points="50,24 63,33 70,50 63,67 50,76 37,67 30,50 37,33" fill="${bc}12"/><circle cx="50" cy="50" r="8" fill="${c}20" stroke="${c}" stroke-width="1"/><line x1="22" y1="50" x2="12" y2="44" stroke="${c}" stroke-width="1.5"/><line x1="22" y1="50" x2="12" y2="56" stroke="${c}" stroke-width="1.5"/><line x1="78" y1="50" x2="88" y2="44" stroke="${c}" stroke-width="1.5"/><line x1="78" y1="50" x2="88" y2="56" stroke="${c}" stroke-width="1.5"/><line x1="50" y1="15" x2="50" y2="5" stroke="${c}" stroke-width="1.5"/><circle cx="50" cy="4" r="2" fill="${c}"/>`,
  ];
  const extO = extTraits.map(t=>{
    if(t.visualId==='ext_rust') return `<rect x="36" y="44" width="11" height="8" rx="1" fill="#ce422b22" stroke="#ce422b" stroke-width="0.8"/><rect x="53" y="44" width="11" height="8" rx="1" fill="#ce422b22" stroke="#ce422b" stroke-width="0.8"/><rect x="40" y="54" width="20" height="9" rx="1" fill="#ce422b22" stroke="#ce422b" stroke-width="0.8"/>`;
    if(t.visualId==='ext_gitlens') return `<circle cx="37" cy="44" r="5" fill="none" stroke="#f4a26188" stroke-width="0.8"/><circle cx="37" cy="44" r="2" fill="#f4a261" opacity="0.7"/><circle cx="63" cy="44" r="5" fill="none" stroke="#f4a26188" stroke-width="0.8"/><circle cx="63" cy="44" r="2" fill="#f4a261" opacity="0.7"/>`;
    if(t.visualId==='ext_prettier') return `<path d="M40,34 Q50,30 60,34" fill="none" stroke="white" stroke-width="1" opacity="0.2" stroke-linecap="round"/>`;
    if(t.visualId==='ext_cpp') return `<line x1="30" y1="40" x2="38" y2="52" stroke="#f34b7d" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/><line x1="70" y1="40" x2="62" y2="52" stroke="#f34b7d" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>`;
    if(t.visualId==='ext_spell') return `<text x="46" y="42" font-size="5" fill="${c}" font-family="monospace" opacity="0.55">✦</text><text x="46" y="52" font-size="5" fill="${c}" font-family="monospace" opacity="0.45">✦</text><text x="46" y="62" font-size="5" fill="${c}" font-family="monospace" opacity="0.35">✦</text>`;
    if(t.visualId==='ext_tidal') return `<path d="M26,52 Q19,49 19,55 Q19,61 26,58" fill="none" stroke="#75aadb" stroke-width="1.2"/><path d="M74,52 Q81,49 81,55 Q81,61 74,58" fill="none" stroke="#75aadb" stroke-width="1.2"/>`;
    if(t.visualId==='ext_copilot') return `<circle cx="34" cy="42" r="1.3" fill="white" opacity="0.8"/><circle cx="63" cy="42" r="1.3" fill="white" opacity="0.8"/>`;
    if(t.visualId==='ext_vim') return `<line x1="50" y1="82" x2="50" y2="94" stroke="${c}" stroke-width="1" stroke-dasharray="2,2" opacity="0.4"/>`;
    if(t.visualId==='ext_ssh') return `<circle cx="50" cy="50" r="32" fill="none" stroke="${c}" stroke-width="0.4" stroke-dasharray="1,5" opacity="0.25"/>`;
    if(t.visualId==='ext_jupyter') return `<rect x="42" y="14" width="16" height="10" rx="2" fill="${c}15" stroke="${c}" stroke-width="0.6" opacity="0.6"/>`;
    if(t.visualId==='ext_haskell') return `<text x="46" y="36" font-size="10" fill="#c792ea" font-family="monospace" opacity="0.85">λ</text><circle cx="50" cy="50" r="26" fill="none" stroke="#5e5086" stroke-width="0.5" stroke-dasharray="2,5" opacity="0.35"/>`;
    if(t.visualId==='ext_r') return `<text x="44" y="37" font-size="9" fill="#276dc3" font-family="monospace" opacity="0.75">Σ</text><circle cx="38" cy="49" r="1.5" fill="#276dc3" opacity="0.35"/><circle cx="62" cy="52" r="1.5" fill="#276dc3" opacity="0.35"/>`;
    if(t.visualId==='ext_python') return `<path d="M47,68 Q50,72 53,68" fill="none" stroke="#4b8bbe" stroke-width="1" stroke-linecap="round" opacity="0.6"/>`;
    return '';
  }).join('');
  return `<svg class="creature-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#glow)">${bodies[Math.min(evoIdx,4)]}${featureOverlays(features)}${extO}${eyeL}${eyeR}${mouth}${dim?`<text x="56" y="27" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>`:''}</g></svg>`;
}

// ── HTML ──────────────────────────────────────────────────────────────────────

function refreshWebview(webview, state) {
  const evo    = getEvolution(state.xp);
  const evoIdx = EVOLUTIONS.indexOf(evo);
  const mood   = (() => { const idle=(Date.now()-state.lastActive)/60000; if(idle>60)return'sleeping'; if(idle>15)return'drowsy'; if(state.mood>70)return'happy'; if(state.mood>40)return'neutral'; return'grumpy'; })();
  const nextEvo = EVOLUTIONS.find(e=>e.minXP>state.xp);
  const xpPct   = nextEvo ? Math.round(((state.xp-evo.minXP)/(nextEvo.minXP-evo.minXP))*100) : 100;
  const c  = state.dominantColor||'#888888';
  const bc = state.blendColor||c;
  const moodEmoji = {happy:'◉',neutral:'◎',grumpy:'◌',drowsy:'◍',sleeping:'⊙'}[mood]||'◎';
  const topLangs = Object.entries(state.langCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const currentHybrid = state.activeHybrids.length ? HYBRIDS.find(h=>h.id===state.activeHybrids[state.activeHybrids.length-1]) : null;
  const totalEdits = Object.values(state.langCounts).reduce((a,b)=>a+b,0);

  // Next feature hint
  let hint = '';
  for (const [lang,count] of Object.entries(state.langCounts).sort((a,b)=>b[1]-a[1])) {
    const lt = LANG_TRAITS[lang]; if(!lt) continue;
    for (const [thr,feat] of Object.entries(lt.features)) {
      if (count<parseInt(thr) && !state.unlockedFeatures.some(f=>f.featureId===feat.id)) {
        hint=`<div class="hint">▸ next: <span style="color:${lt.color}">${feat.label}</span> (${parseInt(thr)-count} more ${lang} edits)</div>`; break;
      }
    }
    if (hint) break;
  }

  // Hybrid hint
  let hybridHint = '';
  if (!hint) {
    for (const h of HYBRIDS) {
      if (state.activeHybrids.includes(h.id)) continue;
      const progress = Object.entries(h.requires).map(([l,t])=>{const hv=state.langCounts[l]||0;return hv<t?`${t-hv} more ${l}`:null;}).filter(Boolean);
      if (progress.length < Object.keys(h.requires).length) { hybridHint=`<div class="hint">⚡ hybrid <span style="color:${h.color}">${h.name}</span>: ${progress.join(', ')}</div>`; break; }
    }
  }

  // ── PUZZLE HTML ──
  let puzzleHtml = '';
  if (state.puzzleState === 'idle') {
    puzzleHtml = `<div class="section-box"><div class="sec-title">debug challenge</div><div class="puzzle-prompt">I have a challenge for you. Find the bug, earn XP and lore.</div><button onclick="s('start_puzzle')" style="width:100%;margin-top:6px">◈ Start Challenge</button></div>`;
  } else if (state.puzzleState === 'active' && state.activePuzzle) {
    const p = state.activePuzzle;
    const lines = p.lines.map((line, i) =>
      `<div class="code-line" onclick="s('guess_bug',${i})" title="Click if this is the bug">
        <span class="line-num">${i+1}</span>
        <code>${esc(line)}</code>
      </div>`
    ).join('');
    puzzleHtml = `<div class="section-box"><div class="sec-title">debug challenge <span style="color:${c}">${state.dominantLang||'cs'}</span></div>
      <div class="puzzle-hint">I sense something wrong here. Which line is broken?</div>
      <div class="code-block">${lines}</div>
      <div class="hint" style="margin-top:4px">hint: ${esc(p.hint)}</div>
    </div>`;
  } else if (state.puzzleState === 'solved' && state.activePuzzle) {
    const p = state.activePuzzle;
    puzzleHtml = `<div class="section-box solved"><div class="sec-title" style="color:#4caf50">✓ correct — +${p.xp} xp</div>
      <div class="puzzle-explanation">${esc(p.explanation)}</div>
      <div class="lore-fragment">"${esc(p.lore)}"</div>
      <button onclick="s('dismiss_puzzle')" style="width:100%;margin-top:6px">Continue</button>
    </div>`;
  } else if (state.puzzleState === 'failed' && state.activePuzzle) {
    const p = state.activePuzzle;
    puzzleHtml = `<div class="section-box failed"><div class="sec-title" style="color:#f44336">✗ not quite</div>
      <div class="puzzle-explanation">The bug was on line ${p.bugLine+1}. ${esc(p.explanation)}</div>
      <button onclick="s('dismiss_puzzle')" style="width:100%;margin-top:6px">Try Again Later</button>
    </div>`;
  }

  // ── CODEX HTML ──
  const codexEvo = EVOLUTIONS.map(e => {
    const unlocked = state.xp >= e.minXP;
    return `<div class="codex-entry ${unlocked?'unlocked':'locked'}">
      <span class="codex-glyph" style="${unlocked?`color:${c}`:'color:#333'}">${unlocked?'▲':'?'}</span>
      <div><div class="codex-name">${unlocked?e.name:'???'}</div>
      <div class="codex-sub">${unlocked?e.description+` (${e.minXP} XP)`:'reach '+e.minXP+' XP'}</div></div>
    </div>`;
  }).join('');

  const codexHybrids = HYBRIDS.map(h => {
    const unlocked = state.activeHybrids.includes(h.id);
    const reqStr = Object.entries(h.requires).map(([l,t])=>`${t} ${l}`).join(' + ');
    return `<div class="codex-entry ${unlocked?'unlocked':'locked'}">
      <span class="codex-glyph" style="${unlocked?`color:${h.color}`:'color:#333'}">⚡</span>
      <div><div class="codex-name" style="${unlocked?`color:${h.color}`:''}"> ${unlocked?h.name:'???'}</div>
      <div class="codex-sub">${unlocked?h.desc:reqStr}</div></div>
    </div>`;
  }).join('');

  // ── ACHIEVEMENTS HTML ──
  const achHtml = ACHIEVEMENTS.map(a => {
    const earned = state.achievements.includes(a.id);
    return `<div class="ach-entry ${earned?'earned':''}">
      <span class="ach-glyph" style="${earned?`color:${c}`:'color:#333'}">${a.glyph}</span>
      <div><div class="ach-label">${earned?a.label:'???'}</div>
      <div class="ach-desc">${earned?a.desc:'keep coding'}</div></div>
    </div>`;
  }).join('');

  // ── LORE HTML ──
  const loreHtml = state.unlockedLore.length
    ? state.unlockedLore.filter(id=>id.startsWith('puzzle_')||LORE_ENTRIES[id]).map(id => {
        if (id.startsWith('puzzle_')) {
          const n = parseInt(id.replace('puzzle_',''));
          return `<div class="lore-entry"><div class="lore-title">Field Note #${n}</div><div class="lore-text">Bug found. Something learned. The distinction between what is written and what is meant.</div></div>`;
        }
        const entry = LORE_ENTRIES[id];
        if (!entry) return '';
        return `<div class="lore-entry"><div class="lore-title">${esc(entry.title)}</div><div class="lore-text">${esc(entry.text)}</div></div>`;
      }).filter(Boolean).join('')
    : '<div class="hint" style="text-align:center">Unlock lore by coding and finding bugs.</div>';

  // ── STATS ──
  const langPips = topLangs.map(([l,cnt])=>{const lt=LANG_TRAITS[l]||{color:'#888'};return `<div class="pip" style="background:${lt.color}" title="${esc(l)}: ${cnt} edits"><span>${l.slice(0,2).toUpperCase()}</span></div>`;}).join('');
  const featBadges = state.unlockedFeatures.map(f=>`<span class="fbadge" style="border-color:${f.color}88;color:${f.color}" title="${esc(f.desc)}">${esc(f.label)}</span>`).join('');
  const hybridBox = currentHybrid?`<div class="hbox" style="border-color:${currentHybrid.color}55"><div class="hname" style="color:${currentHybrid.color}">⚡ ${currentHybrid.name}</div><div class="hdesc">${currentHybrid.desc}</div></div>`:'';
  const cpuStr = state.cpuTempAvailable && state.cpuTemp !== null
    ? (() => { const col = state.cpuTemp >= 80 ? '#f44336' : state.cpuTemp >= 60 ? '#f4a261' : 'var(--d)'; return `<span style="color:${col}">cpu: ${state.cpuTemp}°C</span>`; })()
    : '';

  webview.html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--c:${c};--bc:${bc};--bg:#090910;--s:#0e0e1a;--b:#1c1c2a;--t:#b0b0c8;--d:#454560}
body{font-family:'Space Mono',monospace;background:var(--bg);color:var(--t);font-size:11px;overflow-x:hidden}
.w{padding:11px;display:flex;flex-direction:column;gap:9px}
/* Header */
.hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--b);padding-bottom:8px}
.nm{font-family:'VT323',monospace;font-size:22px;color:var(--c);letter-spacing:1px;cursor:pointer;text-shadow:0 0 10px var(--c)55}
.es{font-size:9px;color:var(--d);text-transform:uppercase;letter-spacing:2px;margin-top:2px}
.me{font-family:'VT323',monospace;font-size:24px;color:var(--c);line-height:1}
.mw{font-size:9px;color:var(--d)}
/* Creature */
.cf{background:var(--s);border:1px solid var(--b);border-radius:4px;padding:13px;display:flex;flex-direction:column;align-items:center;gap:7px;position:relative;overflow:hidden}
.cf::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 65%,${c}12 0%,transparent 70%);pointer-events:none}
.creature-svg{width:94px;height:94px;animation:flt 3s ease-in-out infinite}
@keyframes flt{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes bnc{0%,100%{transform:translateY(0) scale(1)}35%{transform:translateY(-7px) scale(1.04)}}
@keyframes slp{0%,100%{transform:rotate(-2deg)}50%{transform:translateY(-3px) rotate(2deg)}}
.mood-happy .creature-svg{animation:bnc 1.5s ease-in-out infinite}
.mood-sleeping .creature-svg,.mood-drowsy .creature-svg{animation:slp 4s ease-in-out infinite}
.ed{font-size:9px;color:var(--d);line-height:1.5;font-style:italic;text-align:center}
.fts{display:flex;flex-wrap:wrap;gap:3px;justify-content:center}
.fbadge{font-size:8px;padding:1px 5px;border:1px solid;border-radius:2px;text-transform:uppercase;letter-spacing:.5px;cursor:default}
.hbox{background:var(--s);border:1px solid;border-radius:3px;padding:7px 9px}
.hname{font-family:'VT323',monospace;font-size:15px;letter-spacing:1px;margin-bottom:3px}
.hdesc{font-size:9px;color:var(--d);line-height:1.5}
/* Stats */
.sts{display:flex;flex-direction:column;gap:5px}
.sr{display:grid;grid-template-columns:46px 1fr 26px;align-items:center;gap:5px}
.sl{font-size:9px;color:var(--d);text-transform:uppercase;letter-spacing:1px}
.sb{height:3px;background:var(--b);border-radius:2px;overflow:hidden}
.sf{height:100%;border-radius:2px;transition:width .5s}
.fh{background:#f4a261}.fm{background:#7fc8f8}.fx{background:var(--c)}
.sv{font-family:'VT323',monospace;font-size:13px;text-align:right;color:var(--d)}
.sub{font-size:9px;color:var(--d);text-align:center;letter-spacing:1px}
.hint{font-size:9px;color:var(--d);text-align:center;margin-top:1px}
/* DNA */
.stl{font-size:9px;color:var(--d);text-transform:uppercase;letter-spacing:2px;margin-bottom:4px}
.lr{display:flex;gap:4px;flex-wrap:wrap}
.pip{width:26px;height:26px;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:#000;cursor:default;opacity:.85}
/* Actions */
.acts{display:grid;grid-template-columns:1fr 1fr;gap:5px}
button{background:var(--s);border:1px solid var(--b);color:var(--t);font-family:'Space Mono',monospace;font-size:9px;padding:7px 5px;cursor:pointer;border-radius:3px;text-transform:uppercase;letter-spacing:1px;transition:all .15s}
button:hover{border-color:var(--c);color:var(--c);background:${c}0f}
button:active{transform:scale(.96)}
/* Rename */
hr{border:none;border-top:1px solid var(--b)}
.rw{display:none;gap:4px}.rw.on{display:flex}
.rw input{flex:1;background:var(--s);border:1px solid var(--c);color:var(--t);font-family:'Space Mono',monospace;font-size:10px;padding:4px 6px;border-radius:3px;outline:none}
/* Pattern comment */
.comment-bubble{background:var(--s);border:1px solid var(--c)44;border-radius:4px;padding:8px 10px;font-size:10px;line-height:1.6;color:var(--t);position:relative}
.comment-bubble::before{content:'◈';position:absolute;top:-1px;left:8px;font-size:9px;color:var(--c);background:var(--bg);padding:0 3px}
.dismiss-btn{font-size:8px;color:var(--d);cursor:pointer;float:right;margin-top:2px;background:none;border:none;padding:0}
.dismiss-btn:hover{color:var(--t)}
/* Puzzle */
.section-box{background:var(--s);border:1px solid var(--b);border-radius:4px;padding:10px}
.section-box.solved{border-color:#4caf5044}
.section-box.failed{border-color:#f4433644}
.sec-title{font-size:9px;color:var(--d);text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}
.puzzle-prompt{font-size:10px;color:var(--t);line-height:1.5}
.puzzle-hint{font-size:9px;color:var(--d);margin-bottom:6px;font-style:italic}
.code-block{display:flex;flex-direction:column;gap:1px}
.code-line{display:flex;gap:8px;align-items:baseline;padding:3px 5px;border-radius:2px;cursor:pointer;border:1px solid transparent;transition:all .12s}
.code-line:hover{background:${c}18;border-color:${c}44}
.line-num{font-size:8px;color:var(--d);min-width:12px;text-align:right;flex-shrink:0}
code{font-family:'Space Mono',monospace;font-size:9px;color:var(--t);white-space:pre;overflow-x:auto}
.puzzle-explanation{font-size:9px;color:var(--t);line-height:1.6;margin-bottom:6px}
.lore-fragment{font-size:9px;color:var(--c);font-style:italic;line-height:1.5;border-left:2px solid ${c}44;padding-left:8px;margin-top:4px}
/* Codex */
.codex-entry{display:flex;gap:8px;align-items:flex-start;padding:5px 0;border-bottom:1px solid var(--b)}
.codex-entry:last-child{border-bottom:none}
.codex-entry.locked{opacity:.45}
.codex-glyph{font-size:14px;flex-shrink:0;margin-top:1px}
.codex-name{font-size:10px;font-weight:bold;color:var(--t)}
.codex-sub{font-size:9px;color:var(--d);line-height:1.4;margin-top:2px}
/* Achievements */
.ach-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px}
.ach-entry{display:flex;gap:6px;align-items:flex-start;padding:5px;border-radius:3px;border:1px solid var(--b)}
.ach-entry.earned{border-color:${c}44;background:${c}08}
.ach-glyph{font-size:14px;flex-shrink:0}
.ach-label{font-size:9px;font-weight:bold;color:var(--t)}
.ach-desc{font-size:8px;color:var(--d);line-height:1.3;margin-top:1px}
/* Lore */
.lore-entry{padding:8px 0;border-bottom:1px solid var(--b)}
.lore-entry:last-child{border-bottom:none}
.lore-title{font-family:'VT323',monospace;font-size:14px;color:var(--c);margin-bottom:3px}
.lore-text{font-size:9px;color:var(--d);line-height:1.6;font-style:italic}
/* Section headers */
.section-header{font-family:'VT323',monospace;font-size:16px;color:var(--c);letter-spacing:1px;margin:4px 0 2px;padding-top:4px;border-top:1px solid var(--b)}
/* Scanlines */
.sl2{position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.02) 2px,rgba(0,0,0,.02) 4px);pointer-events:none;z-index:999}
/* Stats row */
.stat-row-inline{display:flex;justify-content:space-between;font-size:9px;color:var(--d);margin-top:2px}
</style></head><body>
<div class="sl2"></div>
<div class="w mood-${mood}">

  <!-- Header -->
  <div class="hdr">
    <div>
      <div class="nm" onclick="tr()" title="click to rename">${esc(state.name)}</div>
      <div class="es">${evo.name}</div>
    </div>
    <div style="text-align:right"><div class="me">${moodEmoji}</div><div class="mw">${mood}</div></div>
  </div>
  <div class="rw" id="rw"><input id="ri" maxlength="20" value="${esc(state.name)}"/><button onclick="dr()">OK</button></div>

  <!-- Creature -->
  <div class="cf">
    ${buildCreatureSVG(evoIdx,c,bc,mood,state.unlockedFeatures,state.installedExtTraits)}
    ${featBadges?`<div class="fts">${featBadges}</div>`:''}
    <div class="ed">${evo.description}</div>
  </div>

  ${hybridBox}

  <!-- Stats -->
  <div class="sts">
    <div class="sr"><div class="sl">hunger</div><div class="sb"><div class="sf fh" style="width:${state.hunger}%"></div></div><div class="sv">${Math.round(state.hunger)}</div></div>
    <div class="sr"><div class="sl">mood</div><div class="sb"><div class="sf fm" style="width:${state.mood}%"></div></div><div class="sv">${Math.round(state.mood)}</div></div>
    <div class="sr"><div class="sl">xp</div><div class="sb"><div class="sf fx" style="width:${xpPct}%"></div></div><div class="sv">${state.xp}</div></div>
  </div>
  ${nextEvo?`<div class="sub">${nextEvo.minXP-state.xp} xp → ${nextEvo.name}</div>`:'<div class="sub">MAX FORM</div>'}
  ${hint||hybridHint}
  <div class="stat-row-inline"><span>edits: ${totalEdits}</span><span>bugs: ${state.bugsFound}</span><span>commits: ${state.totalCommits||0}</span><span>streak: ${state.feedStreak||0}d</span>${cpuStr}</div>

  <!-- Actions -->
  <div class="acts"><button onclick="s('feed')">◆ Feed</button><button onclick="s('play')">◈ Play</button></div>

  <!-- Pattern comment bubble -->
  ${state.patternComment?`<div class="comment-bubble"><button class="dismiss-btn" onclick="s('dismiss_comment')">✕</button>${esc(state.patternComment)}</div>`:''}

  <hr/>

  <!-- DNA -->
  ${topLangs.length?`<div><div class="stl">DNA</div><div class="lr">${langPips}</div></div>`:'<div class="sub">start coding to shape your creature</div>'}

  <hr/>

  <!-- Debug challenge -->
  <div class="section-header">[ debug ]</div>
  ${puzzleHtml}

  <hr/>

  <!-- Codex -->
  <div class="section-header">[ codex ]</div>
  <div class="section-box">
    <div class="sec-title">evolution stages</div>
    ${codexEvo}
  </div>
  <div class="section-box" style="margin-top:6px">
    <div class="sec-title">hybrid forms</div>
    ${codexHybrids}
  </div>

  <hr/>

  <!-- Achievements -->
  <div class="section-header">[ achievements ]</div>
  <div class="ach-grid">${achHtml}</div>

  <hr/>

  <!-- Lore -->
  <div class="section-header">[ lore ]</div>
  ${loreHtml}

</div>
<script>
const vscode=acquireVsCodeApi();
function s(t,v){vscode.postMessage({type:t,value:v})}
function tr(){const w=document.getElementById('rw');w.classList.toggle('on');if(w.classList.contains('on'))document.getElementById('ri').focus()}
function dr(){const v=document.getElementById('ri').value.trim();if(v)s('rename',v);document.getElementById('rw').classList.remove('on')}
document.getElementById('ri')?.addEventListener('keydown',e=>{if(e.key==='Enter')dr();if(e.key==='Escape')document.getElementById('rw').classList.remove('on')})
</script></body></html>`;
}

function deactivate() {}
module.exports = { activate, deactivate };
