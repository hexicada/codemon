const vscode = require('vscode');
const { exec } = require('child_process');
let buildCreatureForLang = () => null;
try {
  ({ buildCreatureForLang } = require('./creatures/index'));
} catch (err) {
  console.error('[codemon] failed to load creatures/index, using fallback renderer:', err);
}
const { LORE_ENTRIES, ACHIEVEMENTS, PATTERN_COMMENTS, COMMIT_COMMENTS, PROCESS_COMMENTS, CPU_COMMENTS } = require('./data');
const { loadState, saveState, switchSlot, canShowPatternComment, PATTERN_COMMENT_TTL_MS } = require('./state');
const { createHandlers } = require('./handlers');
const { featureOverlays } = require('./features');
const { renderWebview } = require('./render');
const { renderStyles, renderScripts } = require('./webviewAssets');

// ── SETTINGS HELPERS ──────────────────────────────────────────────────────────
function getWorkspaceSettings() {
  const cfg = vscode.workspace.getConfiguration('codemon');
  const difficulty = cfg.get('difficulty', 'Normal');
  const feedTime1 = cfg.get('feedTime1', '09:30');
  const feedTime2 = cfg.get('feedTime2', '15:30');
  const hungerDecayRate = cfg.get('hungerDecayRate', 1);
  const animationSpeed = cfg.get('animationSpeed', 1);
  
  const difficultyMult = difficulty === 'Chill' ? { xp: 1.5, decay: 0.7 } : difficulty === 'Hard' ? { xp: 0.7, decay: 1.5 } : { xp: 1, decay: 1 };
  const finalDecayMult = difficultyMult.decay * hungerDecayRate;
  
  return {
    difficulty,
    feedTime1,
    feedTime2,
    hungerDecayRate,
    animationSpeed,
    xpMult: difficultyMult.xp,
    decayMult: finalDecayMult,
  };
}

// ── LANG / HYBRID / EXT DEFINITIONS ──────────────────────────────────────────

const LANG_TRAITS = {
  python:     { element:'serpent', color:'#06d622', features:{ 50:{id:'scales_light',label:'faint scales',desc:'Python whispers. Faint diamond scales appear along the spine.'}, 150:{id:'scales_full',label:'scale plates',desc:'Full serpentine scale plating. The body moves with a sinuous flow.'}, 400:{id:'forked_tongue',label:'forked tongue',desc:'A forked tongue flickers. It tastes the air for errors.'}, 800:{id:'snake_tail',label:'coiled tail',desc:'A coiled serpent tail. Patient. Precise.'} }},
  rust:       { element:'iron',    color:'#ce422b', features:{ 50:{id:'rust_flecks',label:'rust flecks',desc:'Oxidised iron crusts over the outer skin.'}, 150:{id:'iron_plates',label:'iron plating',desc:'Segmented iron plates lock into place. Nothing gets through.'}, 400:{id:'claws',label:'iron claws',desc:'Iron claws. Grip is ownership.'}, 800:{id:'exoskeleton',label:'full exoskeleton',desc:'A complete exoskeleton. Fearless. Borrow-checked.'} }},
  javascript: { element:'electric',color:'#f7df1e', features:{ 50:{id:'spark_static',label:'static sparks',desc:'Static sparks jump off the skin at random. Unpredictable.'}, 150:{id:'arc_trail',label:'arc trail',desc:'A crackling arc trail follows movement. Asynchronous.'}, 400:{id:'yellow_corona',label:'electric corona',desc:'A yellow corona pulses around the head. Prototype chain visible.'}, 800:{id:'lightning_fin',label:'lightning fin',desc:'A jagged lightning fin erupts from the back.'} }},
  typescript: { element:'order',   color:'#3178c6', features:{ 50:{id:'blue_lattice',label:'type lattice',desc:'A faint blue lattice marks the skin. Every surface typed.'}, 150:{id:'rigid_spine',label:'rigid spine',desc:'The spine straightens. Strictly typed.'}, 400:{id:'interface_wings',label:'interface wings',desc:'Small translucent wings. Purely decorative? Or contractual.'}, 800:{id:'halo',label:'strict halo',desc:'A pale blue halo. noImplicitAny. Peace.'} }},
  r:          { element:'data',    color:'#276dc3', features:{ 50:{id:'data_spots',label:'data spots',desc:'Irregular spots mottle the skin like a scatter plot.'}, 150:{id:'histogram_ridge',label:'histogram ridge',desc:'A stepped ridge runs down the back. Distribution: bimodal.'}, 400:{id:'chart_eyes',label:'chart eyes',desc:'The eyes become circular charts. P < 0.05.'}, 800:{id:'data_tendrils',label:'data tendrils',desc:'Long statistical tendrils trail from the limbs. Regression lines.'} }},
  go:         { element:'wind',    color:'#00add8', features:{ 50:{id:'stream_lines',label:'streamlines',desc:'Streamlines trace the body like wind tunnel visualization.'}, 150:{id:'channel_gills',label:'channel gills',desc:'Gill-like channels on the sides. Goroutines breathe.'}, 400:{id:'phased_limbs',label:'phased limbs',desc:'Limbs phase slightly out of sync. Concurrent.'}, 800:{id:'gopher_ears',label:'gopher ears',desc:'Rounded ears appear. Simple. Opinionated. Fast.'} }},
  haskell:    { element:'void',    color:'#9102ce', features:{ 50:{id:'void_shimmer',label:'void shimmer',desc:'The surface shimmers between states. Lazy evaluation.'}, 150:{id:'monad_rings',label:'monad rings',desc:'Rings orbit the body slowly. Functors. Monads.'}, 400:{id:'lambda_mark',label:'lambda mark',desc:'A lambda symbol is burned into the forehead.'}, 800:{id:'category_wings',label:'category wings',desc:'Wings that fold through higher dimensions. Pure.'} }},
  cpp:        { element:'fire',    color:'#f34b7d', features:{ 50:{id:'heat_shimmer',label:'heat shimmer',desc:'Heat distortion around the body. Undefined behavior radiates.'}, 150:{id:'pointer_horns',label:'pointer horns',desc:'Small horns like pointer arrows. Memory is yours to manage.'}, 400:{id:'flame_mane',label:'flame mane',desc:'A mane of low fire. Segfault-born. Veteran.'}, 800:{id:'template_tail',label:'template tail',desc:'A tail that branches into multiple types. Generic.'} }},
  lua:        { element:'moon',    color:'#7b86b8', features:{ 50:{id:'lunar_glow',label:'lunar glow',desc:'A faint lunar glow. Embedded everywhere, seen nowhere.'}, 150:{id:'table_shell',label:'table shell',desc:'A shell of interlocking tables. The only data structure needed.'}, 400:{id:'metatail',label:'metatail',desc:'A tail with metamethods. Indexing is recursive.'}, 800:{id:'coroutine_fins',label:'coroutine fins',desc:'Fins that yield and resume independently.'} }},
  ruby:       { element:'gem',     color:'#cc342d', features:{ 50:{id:'gem_flecks',label:'gem flecks',desc:'Crystalline gem flecks catch the light. Matz is nice.'}, 150:{id:'ruby_spine',label:'ruby spine',desc:'A spine of deep red rubies. Convention over configuration.'}, 400:{id:'facet_eyes',label:'facet eyes',desc:'Faceted gem eyes. Everything is an object. Everything.'}, 800:{id:'crystal_wings',label:'crystal wings',desc:'Crystalline wings. Beautiful. Slow when needed. Fast enough.'} }},
  shellscript:{ element:'shell',   color:'#4ec94e', features:{ 50:{id:'pipe_marks',label:'pipe marks',desc:'Channels carved along the body. Data flows through, one stream into the next.'}, 150:{id:'shebang_crown',label:'shebang crown',desc:'A #!/bin/bash crown. The shell knows exactly what it is.'}, 400:{id:'fork_tines',label:'fork tines',desc:'Split tines on the tail. Every process can fork. Children inherit everything.'}, 800:{id:'daemon_form',label:'daemon form',desc:'The creature runs in the background now. PID unknown. Detached from the terminal that spawned it.'} }},
  holyc:      { element:'divine',  color:'#f0cc40', features:{ 50:{id:'gill_slits',label:'gill slits',desc:'Faint gill lines trace both sides of the neck. The fish remembers what it was.'}, 150:{id:'fin_limbs',label:'fin-limbs',desc:'The fins have thickened. A suggestion of intention at the ends. Not quite feet. Not quite fins.'}, 400:{id:'radiant_aura',label:'divine radiance',desc:'The creature radiates. The outer air reorganises itself into faint orbital rings. Something is happening.'}, 800:{id:'ophanim_rings',label:'ophanim rings',desc:'Concentric rings orbit now, of their own will. Full of eyes. Do not be afraid. This is what evolution looks like when it is also worship.'} }},
};

const HYBRIDS = [
  { id:'data_serpent',      requires:{python:100,r:100},       name:'Data Serpent',       desc:'Scales arranged in statistical distributions. The tail is a confidence interval.', color:'#5ba0c8', featureId:'hybrid_datascale',  featureLabel:'data-mapped scales' },
  { id:'serpentine_circuit',requires:{python:150,javascript:150},name:'Serpentine Circuit', desc:'Scales flicker with electric current. Snake logic, chaotic energy.',               color:'#a8d8a8', featureId:'hybrid_scale_spark', featureLabel:'electric scales' },
  { id:'iron_serpent',      requires:{python:150,rust:150},     name:'Iron Serpent',       desc:'Iron plates over serpent scales. Ownership enforced. Memory safe.',                color:'#8b7f6f', featureId:'hybrid_ironscale',  featureLabel:'ironscale plating' },
  { id:'analyst_beast',     requires:{r:150,python:150},        name:'Analyst Beast',      desc:'Tidyverse veins. NumPy spine. The ultimate data creature.',                        color:'#4e9af1', featureId:'hybrid_analyst',    featureLabel:'data lattice skin' },
  { id:'void_circuit',      requires:{haskell:100,javascript:100},name:'Void Circuit',     desc:'Pure functions crackling with side effects. Contradiction embodied.',              color:'#9b72cf', featureId:'hybrid_voidarc',    featureLabel:'void arcs' },
  { id:'moon_serpent',      requires:{lua:100,python:100},      name:'Moon Serpent',       desc:'Embedded serpent. Runs inside other creatures. Lightweight. Recursive.',           color:'#b8c4e8', featureId:'hybrid_moonscale',  featureLabel:'lunar scales' },
  { id:'flame_iron',        requires:{cpp:150,rust:150},        name:'Flame Iron',         desc:'Ancient fire meets modern ownership. Terrifying. Correct.',                       color:'#e06030', featureId:'hybrid_flameirn',   featureLabel:'burning iron hide' },
  { id:'shell_serpent',     requires:{shellscript:100,python:100}, name:'Shell Serpent',    desc:'Pipes and imports. Glue code made flesh. Everything is a file.',                  color:'#47a87a', featureId:'hybrid_shellscale', featureLabel:'pipe-scarred scales' },
  { id:'iron_shell',        requires:{shellscript:100,rust:100},   name:'Iron Shell',       desc:'Memory-safe shell scripts. Every exit code checked. The borrow checker approves.', color:'#7a8f6f', featureId:'hybrid_ironshell',  featureLabel:'oxidised carapace' },
  { id:'sacred_iron',       requires:{holyc:100,rust:100},         name:'Sacred Iron',      desc:'Divinely typed and borrow-checked. Zero undefined behaviour. Terry would approve the discipline.', color:'#c8a840', featureId:'hybrid_sacredirn',  featureLabel:'blessed iron plating' },
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
  {name:'Eggling',    minXP:0,    description:'Freshly hatched. Watches you code with wide eyes.'},
  {name:'Glitchling', minXP:400,  description:'Flickering with potential. Keep coding to see your creature evolve.'},
  {name:'Codespawn',  minXP:1200, description:'Try a debug challenge to help your creature grow.'},
  {name:'Synthecyst', minXP:3000, description:'Your creature mirrors your stack.'},
  {name:'Archetype',  minXP:7000, description:'Almost fully realised. Your coding self takes permanent shape.'},
  {name:'Paradigm',   minXP:11000, description:'Beyond form. A living pattern of pure intent.'},
];

const PRESTIGE_NAMES = [
  'Garrison',
  'Pug',
  'Sylvest',
  'Morreth',
  'Larry',
  'Vyvan',
  'Moog',
  'Glindel',
  'Mirrae',
  'Bruce',
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

const FOOD_STRINGS = {
  python:'pass', rust:'&str', javascript:'=>{}', typescript:'type',
  haskell:'\\x->', r:'%>%', lua:'nil;', shellscript:'$()', holyc:'U0;',
  go:'func', cpp:'*ptr', ruby:':sym', c:'NULL', zig:'@src',
  elixir:'|>', java:'void', csharp:'var', swift:'let', kotlin:'fun',
  default:'{;}',
};

function getFoodStr(state) {
  const top = Object.entries(state.langCounts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([l])=>l).filter(l=>FOOD_STRINGS[l]);
  if (!top.length) return FOOD_STRINGS.default;
  const pick = (Math.random() < 0.7 || top.length === 1) ? top[0] : top[Math.floor(Math.random()*top.length)];
  return FOOD_STRINGS[pick] || FOOD_STRINGS.default;
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
  if ((lang === 'shellscript' || lang === 'bash') && Math.random() < 0.03) return pickRandom(PATTERN_COMMENTS.shellscript);
  if (lang === 'holyc' && Math.random() < 0.05) return pickRandom(PATTERN_COMMENTS.holyc);
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
let ramGremlins = [];
let ramGremlinInterval = null;
let statusBarItem = null;
let statusBarFlickerInterval = null;
let chaseRunning = false;

function setupStatusBar(context) {
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -999);
  context.subscriptions.push(statusBarItem);
}

function startEatingRam(context) {
  if (creatureState.isEatingRam) return;
  creatureState.isEatingRam = true;
  creatureState.feralSince = Date.now();
  const feralLines = [
    `ur cpu looks delicious. *crunch*`,
    `found ur heap. eating it now. don't mind me`,
    `no food = ram food. simple math`,
    `*allocating feelings* (feelings = ur memory)`,
    `${creatureState.name} has entered feral mode`,
    `nom nom nom ur buffers`,
    `i found the heap. it's mine now`,
    `u had 50mb u weren't using anyway. right?`,
  ];
  let feralIdx = 0;
  statusBarItem.text = '🔴 CODEMON: HUNGER STRIKE';
  statusBarItem.show();
  statusBarFlickerInterval = setInterval(() => {
    statusBarItem.text = statusBarItem.text.startsWith('🔴')
      ? '⚠️  feed me or else'
      : '🔴 CODEMON: HUNGER STRIKE';
  }, 800);
  ramGremlinInterval = setInterval(() => {
    if (ramGremlins.length < 10) {
      ramGremlins.push(Buffer.alloc(5 * 1024 * 1024));
      creatureState.patternComment = feralLines[feralIdx % feralLines.length];
      feralIdx++;
    } else {
      creatureState.patternComment = `at capacity (50mb) but still hungry. feed. me. NOW.`;
    }
    saveAndRefresh(context);
  }, 30 * 1000);
}

function stopEatingRam() {
  if (!creatureState.isEatingRam) return;
  creatureState.isEatingRam = false;
  creatureState.starvedSince = null;
  creatureState.feralSince = null;
  if (ramGremlinInterval) { clearInterval(ramGremlinInterval); ramGremlinInterval = null; }
  if (statusBarFlickerInterval) { clearInterval(statusBarFlickerInterval); statusBarFlickerInterval = null; }
  ramGremlins = [];
  statusBarItem.hide();
  creatureState.patternComment = pickRandom([
    `oh. FOOD. u do care. *sniffle* ur ram has been released. probably.`,
    `ok ok ok i forgive u. also i definitely ate some memory. it's back now`,
    `u came back!! the ram gremlins have been called off`,
    `*releases 50mb of spite* we r ok now`,
    `oh thank goodness. ur ram has been fully returned`,
  ]);
}

function setupWebviewProvider(context) {
  const provider = {
    resolveWebviewView(webviewView) {
      panel_ref = webviewView;
      webviewView.webview.options = {enableScripts:true};
      refreshWebview(webviewView.webview, creatureState);

      let handlers = createHandlers(creatureState, {
        refresh:         (force) => saveAndRefresh(context, force),
        stopEatingRam,
        setChaseRunning: (v) => { chaseRunning = v; },
        unlockLore,
        PRESTIGE_NAMES,
      });

      webviewView.webview.onDidReceiveMessage(msg => {
        if (msg.type === 'slot_switch') {
          const next = switchSlot(context, creatureState, msg.value);
          if (next && next !== creatureState) {
            creatureState = next;
            // Rebuild handlers bound to the new state object
            Object.assign(handlers, createHandlers(creatureState, {
              refresh:         (force) => saveAndRefresh(context, force),
              stopEatingRam,
              setChaseRunning: (v) => { chaseRunning = v; },
              unlockLore,
              PRESTIGE_NAMES,
            }));
            refreshWebview(webviewView.webview, creatureState);
          }
          return;
        }
        if (handlers[msg.type]) handlers[msg.type](msg);
        const newAch = checkAchievements(creatureState);
        newAch.forEach(a => vscode.window.showInformationMessage(`🏆 Achievement: ${a.label} — ${a.desc}`));
        saveAndRefresh(context);
      });
    }
  };

  context.subscriptions.push(vscode.window.registerWebviewViewProvider('codemon.panel', provider));
  context.subscriptions.push(vscode.commands.registerCommand('codemon.open', () =>
    vscode.commands.executeCommand('workbench.view.extension.codemon-sidebar')));
}

function setupActivityTracker(context) {
  let prevLang = null;
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
    const lang = event.document.languageId;
    if (!lang || ['plaintext','log','markdown','json','scminput'].includes(lang)) return;

    // Session tracking
    if (!creatureState.sessionStartTime) creatureState.sessionStartTime = Date.now();
    const sessionMins = (Date.now() - creatureState.sessionStartTime) / 60000;
    if (sessionMins > creatureState.longestSessionMinutes) creatureState.longestSessionMinutes = sessionMins;

    creatureState.langCounts[lang] = (creatureState.langCounts[lang]||0) + 1;
    const settings = getWorkspaceSettings();
    creatureState.xp += Math.round(2 * settings.xpMult);
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

    // Always evaluate pattern flags (codedPastMidnight/codedOnWeekend),
    // but only display a pattern comment when none is active.
    const patternComment = detectPattern(creatureState, lang, prevLang);
    if (!creatureState.patternComment && canShowPatternComment(creatureState)) {
      const totalEdits = Object.values(creatureState.langCounts).reduce((a,b)=>a+b,0);
      if (totalEdits === 1 && PATTERN_COMMENTS.firstEdit) {
        creatureState.patternComment = pickRandom(PATTERN_COMMENTS.firstEdit);
      } else if (patternComment) {
        creatureState.patternComment = patternComment;
      }
    }

    // Ghost unlock is handled in the decay interval (feral duration check).

    prevLang = lang;

    // Long file detection
    const lineCount = event.document.lineCount;
    if (lineCount > 500 && Math.random() < 0.01 && !creatureState.patternComment && canShowPatternComment(creatureState)) {
      creatureState.patternComment = pickRandom(PATTERN_COMMENTS.longFile);
    }

    const newAch = checkAchievements(creatureState);
    newAch.forEach(a => vscode.window.showInformationMessage(`🏆 Achievement: ${a.label} — ${a.desc}`));

    saveAndRefresh(context);
  }));

  analyzeEnvironment(creatureState).then(xp => { creatureState.xp += xp; saveAndRefresh(context); });
}

function setupDecayLoop(context) {
  const decay = setInterval(() => {
    const settings = getWorkspaceSettings();
    const now   = new Date();
    const today = now.toDateString();
    const hm    = now.getHours()*60 + now.getMinutes();
    
    const [hm1Str, mm1Str] = settings.feedTime1.split(':');
    const [hm2Str, mm2Str] = settings.feedTime2.split(':');
    const feedTime1Mins = parseInt(hm1Str)*60 + parseInt(mm1Str);
    const feedTime2Mins = parseInt(hm2Str)*60 + parseInt(mm2Str);

    if (hm >= feedTime1Mins && creatureState.lastMorningFeedDate !== today) {
      creatureState.lastMorningFeedDate = today;
      creatureState.hunger = Math.max(0, creatureState.hunger-50);
      vscode.window.showInformationMessage(`🦎 ${creatureState.name} is hungry — morning feed time.`);
    }
    if (hm >= feedTime2Mins && creatureState.lastAfternoonFeedDate !== today) {
      creatureState.lastAfternoonFeedDate = today;
      creatureState.hunger = Math.max(0, creatureState.hunger-50);
      vscode.window.showInformationMessage(`🦎 ${creatureState.name} is hungry again — afternoon feed.`);
    }

    creatureState.mood = Math.max(0, creatureState.mood - settings.decayMult);
    const newAch = checkAchievements(creatureState);
    newAch.forEach(a => vscode.window.showInformationMessage(`🏆 Achievement: ${a.label} — ${a.desc}`));

    // ── HUNGER STRIKE STAGES ───────────────────────────────────────────────
    if (creatureState.hunger === 0) {
      if (!creatureState.starvedSince) creatureState.starvedSince = Date.now();
      const starvedMs = Date.now() - creatureState.starvedSince;
      const starvationThreshold = (60 * 60 * 1000) / settings.decayMult;
      if (starvedMs >= starvationThreshold && !creatureState.isEatingRam) {
        startEatingRam(context);
      }
      // Ghost unlock: 72h feral (adjusted by decay multiplier)
      if (!creatureState.unlockedGhost && creatureState.isEatingRam && creatureState.feralSince) {
        const feralMs = Date.now() - creatureState.feralSince;
        const ghostThreshold = (72 * 60 * 60 * 1000) / settings.decayMult;
        if (feralMs >= ghostThreshold) {
          creatureState.unlockedGhost = true;
          stopEatingRam();
          vscode.window.showInformationMessage(`👻 ${creatureState.name} has crossed over...`);
        }
      }
      if (!creatureState.isEatingRam && !creatureState.patternComment) {
        creatureState.patternComment = pickRandom([
          `*stares at u with hollow eyes* feed. me.`,
          `hunger: 0. will: remaining. barely.`,
          `this is fine. i am fine. please send food.`,
          `*collapses dramatically onto ur keyboard* u did this`,
          `ok so. i haven't eaten in a while. just so u know.`,
        ]);
      }
    } else {
      if (creatureState.starvedSince) {
        creatureState.starvedSince = null;
        stopEatingRam();
      }
      if (creatureState.hunger <= 25 && !creatureState.patternComment) {
        creatureState.patternComment = pickRandom([
          `*eyes glow red slightly* hungry. SO hungry.`,
          `getting difficult to maintain composure. feed me soon`,
          `ur code looks edible rn. concerned.`,
          `starvation protocol initiated. assuming ghost form in 3... 2...s`,
        ]);
      } else if (creatureState.hunger <= 50 && !creatureState.patternComment) {
        creatureState.patternComment = pickRandom([
          `hey. hey. hey. u forgot to feed me. just fyi`,
          `passive aggressively rattling my empty bowl`,
          `hunger is a construct. i am constructing it rn. at u.`,
          `this is ur reminder that i exist and am hungry`,
        ]);
      }
    }

    saveAndRefresh(context);
  }, 5*60*1000);
  context.subscriptions.push({dispose:()=>clearInterval(decay)});
}

function setupGitWatcher(context) {
  let lastCommitMs = 0;
  function onCommit() {
    const now = Date.now();
    if (now - lastCommitMs < 2000) return; // debounce: FSW + git API may both fire
    lastCommitMs = now;
    const settings = getWorkspaceSettings();
    creatureState.totalCommits = (creatureState.totalCommits || 0) + 1;
    creatureState.xp   += Math.round(20 * settings.xpMult);
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

function setupSystemPollers(context) {
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

  runProcessScan();
  const procScan = setInterval(runProcessScan, 10 * 60 * 1000);
  context.subscriptions.push({dispose:()=>clearInterval(procScan)});

  pollCpuTemp();
  const cpuPoll = setInterval(pollCpuTemp, 2 * 60 * 1000);
  context.subscriptions.push({dispose:()=>clearInterval(cpuPoll)});
}

function activate(context) {
  creatureState = loadState(context);
  setupStatusBar(context);
  setupWebviewProvider(context);
  setupActivityTracker(context);
  setupDecayLoop(context);
  setupGitWatcher(context);
  setupSystemPollers(context);
}

function saveAndRefresh(context, force=false) {
  const now = Date.now();
  if (creatureState.patternComment) {
    if (!Number.isFinite(creatureState.patternCommentExpiresAt)) {
      creatureState.patternCommentExpiresAt = now + PATTERN_COMMENT_TTL_MS;
    } else if (now >= creatureState.patternCommentExpiresAt) {
      creatureState.patternComment = null;
      creatureState.patternCommentExpiresAt = null;
    }
  } else {
    creatureState.patternCommentExpiresAt = null;
  }
  saveState(context, creatureState);
  if (chaseRunning && !force) return;
  if (panel_ref) {
    try { refreshWebview(panel_ref.webview, creatureState); }
    catch (e) { console.error('[codemon] refreshWebview error:', e); }
  }
}

function buildEggSVG(extTraits, c) {
  // Collect glyph decorations from installed extension traits
  const glyphs = [];
  for (const t of extTraits) {
    if (t.visualId==='ext_haskell') glyphs.push({x:62,y:46,glyph:'λ',color:'#c792ea'});
    else if (t.visualId==='ext_rust')   glyphs.push({x:38,y:58,glyph:'⚙',color:'#ce422b'});
    else if (t.visualId==='ext_python') glyphs.push({x:56,y:62,glyph:'∿',color:'#4b8bbe'});
    else if (t.visualId==='ext_r')      glyphs.push({x:40,y:46,glyph:'Σ',color:'#276dc3'});
    else if (t.visualId==='ext_cpp')    glyphs.push({x:60,y:54,glyph:'+',color:'#f34b7d'});
    else if (t.visualId==='ext_jupyter')glyphs.push({x:46,y:36,glyph:'▦',color:'#f4a261'});
  }
  const glyphSvg = glyphs.slice(0,4).map(g=>`<text x="${g.x}" y="${g.y}" font-size="8" fill="${g.color}" font-family="monospace" opacity="0.65">${g.glyph}</text>`).join('');
  const crack = c !== '#888888' ? `<path d="M50,28 L47,38 L52,44 L48,54" fill="none" stroke="${c}" stroke-width="0.8" stroke-linecap="round" opacity="0.5"/>` : '';
  return `<svg class="creature-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#glow)"><ellipse cx="50" cy="56" rx="22" ry="28" fill="${c}18" stroke="${c}" stroke-width="1.5"/><ellipse cx="50" cy="56" rx="14" ry="18" fill="${c}08"/>${glyphSvg}${crack}</g></svg>`;
}

function buildCreatureSVG(evoIdx, c, bc, mood, features, extTraits, foodStr='{;}') {
  const dim = mood==='sleeping'||mood==='drowsy';
  const happy = mood==='happy';
  const playful = mood==='playful';
  const eyeL = dim?`<line x1="34" y1="44" x2="41" y2="44" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`:playful?`<circle cx="37" cy="43" r="4" fill="${c}"/><circle cx="38.5" cy="41.5" r="1.2" fill="white"/>`:happy?`<path d="M33 43 Q37.5 39 42 43" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`:`<circle cx="37" cy="44" r="3" fill="${c}"/>`;
  const eyeR = dim?`<line x1="59" y1="44" x2="66" y2="44" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`:playful?`<circle cx="63" cy="43" r="4" fill="${c}"/><circle cx="64.5" cy="41.5" r="1.2" fill="white"/>`:happy?`<path d="M58 43 Q62.5 39 67 43" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`:`<circle cx="63" cy="44" r="3" fill="${c}"/>`;
  const eating = mood==='eating';
  const eatingSvg = eating ? `<text class="eating-food" x="${50 - foodStr.length*2.4}" y="76" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${esc(foodStr)}</text>` : '';
  const mouth = eating
    ? `<circle cx="50" cy="57" r="4" fill="${c}" opacity="0.9"/>`
    : playful?`<path d="M41 55 Q50 64 59 55" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`:happy?`<path d="M43 56 Q50 62 57 56" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`:dim?`<line x1="44" y1="58" x2="56" y2="58" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`:`<line x1="44" y1="57" x2="56" y2="57" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`;
  const bodies = [
    `<ellipse cx="50" cy="55" rx="20" ry="26" fill="${c}20" stroke="${c}" stroke-width="1.5"/><ellipse cx="50" cy="55" rx="12" ry="16" fill="${bc}10"/>`,
    `<ellipse cx="50" cy="54" rx="20" ry="24" fill="${c}20" stroke="${c}" stroke-width="1.5"/><rect x="30" y="52" width="8" height="2" fill="${c}44"/><rect x="62" y="58" width="6" height="2" fill="${c}44"/><ellipse cx="50" cy="54" rx="10" ry="14" fill="${bc}10"/>`,
    `<ellipse cx="50" cy="56" rx="22" ry="22" fill="${c}20" stroke="${c}" stroke-width="1.5"/><ellipse cx="28" cy="60" rx="7" ry="5" fill="${bc}20" stroke="${c}" stroke-width="1"/><ellipse cx="72" cy="60" rx="7" ry="5" fill="${bc}20" stroke="${c}" stroke-width="1"/><ellipse cx="50" cy="80" rx="5" ry="8" fill="${c}20" stroke="${c}" stroke-width="1"/>`,
    `<polygon points="50,22 72,38 72,72 50,82 28,72 28,38" fill="${c}20" stroke="${c}" stroke-width="1.5"/><polygon points="50,30 64,40 64,68 50,74 36,68 36,40" fill="${bc}10"/><line x1="28" y1="55" x2="18" y2="65" stroke="${c}" stroke-width="1.5"/><line x1="72" y1="55" x2="82" y2="65" stroke="${c}" stroke-width="1.5"/>`,
    `<polygon points="50,15 68,28 78,50 68,72 50,85 32,72 22,50 32,28" fill="${c}20" stroke="${c}" stroke-width="1.5"/><polygon points="50,24 63,33 70,50 63,67 50,76 37,67 30,50 37,33" fill="${bc}12"/><circle cx="50" cy="50" r="8" fill="${c}20" stroke="${c}" stroke-width="1"/><line x1="22" y1="50" x2="12" y2="44" stroke="${c}" stroke-width="1.5"/><line x1="22" y1="50" x2="12" y2="56" stroke="${c}" stroke-width="1.5"/><line x1="78" y1="50" x2="88" y2="44" stroke="${c}" stroke-width="1.5"/><line x1="78" y1="50" x2="88" y2="56" stroke="${c}" stroke-width="1.5"/><line x1="50" y1="15" x2="50" y2="5" stroke="${c}" stroke-width="1.5"/><circle cx="50" cy="4" r="2" fill="${c}"/>`,
    `<polygon points="50,10 72,24 84,50 72,76 50,90 28,76 16,50 28,24" fill="${c}18" stroke="${c}" stroke-width="1.5"/><polygon points="50,20 66,30 74,50 66,70 50,80 34,70 26,50 34,30" fill="${c}10" stroke="${c}" stroke-width="0.7"/><polygon points="50,30 60,37 64,50 60,63 50,70 40,63 36,50 40,37" fill="${bc}15"/><circle cx="50" cy="50" r="7" fill="${c}25" stroke="${c}" stroke-width="1"/><line x1="16" y1="50" x2="5" y2="44" stroke="${c}" stroke-width="1.5"/><line x1="16" y1="50" x2="5" y2="56" stroke="${c}" stroke-width="1.5"/><line x1="84" y1="50" x2="95" y2="44" stroke="${c}" stroke-width="1.5"/><line x1="84" y1="50" x2="95" y2="56" stroke="${c}" stroke-width="1.5"/><line x1="50" y1="10" x2="50" y2="1" stroke="${c}" stroke-width="1.5"/><circle cx="50" cy="1" r="2.5" fill="${c}"/><line x1="28" y1="24" x2="20" y2="15" stroke="${c}" stroke-width="1"/><line x1="72" y1="24" x2="80" y2="15" stroke="${c}" stroke-width="1"/>`,
  ];
  const extO = extTraits.map(t=>{
    if(t.visualId==='ext_rust') return `<path d="M30,58 L21,60 L14,65" fill="none" stroke="#ce422b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M30,64 L20,67 L13,73" fill="none" stroke="#ce422b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M30,70 L21,74 L15,79" fill="none" stroke="#ce422b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M70,58 L79,60 L86,65" fill="none" stroke="#ce422b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M70,64 L80,67 L87,73" fill="none" stroke="#ce422b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M70,70 L79,74 L85,79" fill="none" stroke="#ce422b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
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
  return `<svg class="creature-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#glow)">${bodies[Math.min(evoIdx,5)]}${featureOverlays(features)}${extO}${eyeL}${eyeR}${mouth}${eatingSvg}${dim?`<text x="56" y="27" font-size="9" fill="${c}" opacity="0.7" font-family="monospace">z</text>`:''}</g></svg>`;
}

function buildHolyCCreatureSVG(evoIdx, c, bc, mood, features, foodStr='{;}') {
  const ids = features.map(f => f.featureId);
  const dim = mood === 'sleeping' || mood === 'drowsy';
  const happy = mood === 'happy';
  const playful = mood === 'playful';
  const eating = mood === 'eating';
  const eatingSvg = eating ? `<text x="${50 - foodStr.length*2.4}" y="76" font-size="8" fill="${c}" font-family="monospace" opacity="0.9">${esc(foodStr)}</text>` : '';
  const fishEye = dim
    ? `<line x1="27" y1="50" x2="33" y2="50" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`
    : `<circle cx="30" cy="50" r="3.5" fill="${c}"/><circle cx="29" cy="49" r="1.2" fill="white" opacity="0.8"/>`;
  const eyeL = dim
    ? `<line x1="34" y1="44" x2="41" y2="44" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`
    : happy ? `<path d="M33 43 Q37.5 39 42 43" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>` : `<circle cx="37" cy="44" r="3" fill="${c}"/>`;
  const eyeR = dim
    ? `<line x1="59" y1="44" x2="66" y2="44" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`
    : happy ? `<path d="M58 43 Q62.5 39 67 43" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>` : `<circle cx="63" cy="44" r="3" fill="${c}"/>`;
  const fishMouth = `<path d="M24,53 Q23,56 25,58" fill="none" stroke="${c}" stroke-width="1.2" stroke-linecap="round"/>`;
  const stdMouth = dim ? `<line x1="44" y1="58" x2="56" y2="58" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>` : eating ? `<circle cx="50" cy="57" r="4" fill="${c}" opacity="0.9"/>` : happy ? `<path d="M43 56 Q50 62 57 56" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>` : playful ? `<path d="M41 55 Q50 64 59 55" stroke="${c}" stroke-width="2.5" fill="none" stroke-linecap="round"/>` : `<line x1="44" y1="57" x2="56" y2="57" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`;
  const bodies = [
    // 0 — Fish (Eggling)
    `<ellipse cx="47" cy="52" rx="22" ry="13" fill="${c}20" stroke="${c}" stroke-width="1.5"/><path d="M69,52 L82,41 L82,63 Z" fill="${c}28" stroke="${c}" stroke-width="1"/><path d="M46,39 Q53,27 62,39" fill="${c}18" stroke="${c}" stroke-width="1" stroke-linejoin="round"/><path d="M40,56 Q30,52 28,61 Q30,68 40,65" fill="${c}20" stroke="${c}" stroke-width="1"/><path d="M38,44 Q35,52 38,60" fill="none" stroke="${c}" stroke-width="1.1" opacity="0.5"/><path d="M41,44 Q38,52 41,61" fill="none" stroke="${c}" stroke-width="0.7" opacity="0.35"/>${fishEye}${fishMouth}${eatingSvg}`,
    // 1 — Fish + proto-limbs (Glitchling)
    `<ellipse cx="47" cy="51" rx="21" ry="14" fill="${c}20" stroke="${c}" stroke-width="1.5"/><path d="M68,51 L80,42 L80,60 Z" fill="${c}28" stroke="${c}" stroke-width="1"/><path d="M47,37 Q54,27 61,37" fill="${c}18" stroke="${c}" stroke-width="1"/><path d="M39,55 Q29,51 27,60 Q29,67 39,63" fill="${c}20" stroke="${c}" stroke-width="1"/><path d="M37,45 Q34,51 37,58" fill="none" stroke="${c}" stroke-width="0.9" opacity="0.35"/><line x1="49" y1="65" x2="45" y2="78" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><line x1="57" y1="64" x2="61" y2="77" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><circle cx="45" cy="80" r="3" fill="${c}28" stroke="${c}" stroke-width="0.8"/><circle cx="61" cy="79" r="3" fill="${c}28" stroke="${c}" stroke-width="0.8"/>${fishEye}${fishMouth}${eatingSvg}`,
    // 2 — Amphibian (Codespawn)
    `<ellipse cx="50" cy="56" rx="18" ry="22" fill="${c}20" stroke="${c}" stroke-width="1.5"/><path d="M63,68 Q76,74 72,83" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/><path d="M32,49 Q21,44 19,54 Q19,62 32,59" fill="${c}18" stroke="${c}" stroke-width="1.1"/><path d="M68,49 Q79,44 81,54 Q81,62 68,59" fill="${c}18" stroke="${c}" stroke-width="1.1"/><path d="M42,77 Q36,88 38,93" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/><path d="M38,93 L32,95 M38,93 L38,97 M38,93 L44,96" fill="none" stroke="${c}" stroke-width="1" stroke-linecap="round"/><path d="M58,77 Q64,88 62,93" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/><path d="M62,93 L56,96 M62,93 L62,97 M62,93 L68,96" fill="none" stroke="${c}" stroke-width="1" stroke-linecap="round"/>${eyeL}${eyeR}${stdMouth}${eatingSvg}`,
    // 3 — Seraph / First ring forming (Synthecyst)
    `<ellipse cx="50" cy="58" rx="13" ry="20" fill="${c}20" stroke="${c}" stroke-width="1.4"/><ellipse cx="50" cy="58" rx="7" ry="12" fill="${bc}10"/><path d="M37,50 Q18,36 16,20 Q22,6 38,20" fill="${c}22" stroke="${c}" stroke-width="0.9"/><path d="M63,50 Q82,36 84,20 Q78,6 62,20" fill="${c}22" stroke="${c}" stroke-width="0.9"/><path d="M37,64 Q20,76 18,88" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/><path d="M63,64 Q80,76 82,88" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="50" cy="50" rx="44" ry="11" fill="none" stroke="${c}" stroke-width="0.8" stroke-dasharray="4,3" opacity="0.6"/><circle cx="94" cy="50" r="2" fill="${c}" opacity="0.7"/><circle cx="72" cy="60" r="1.8" fill="${c}" opacity="0.6"/><circle cx="28" cy="60" r="1.8" fill="${c}" opacity="0.6"/><circle cx="6" cy="50" r="2" fill="${c}" opacity="0.7"/><circle cx="28" cy="40" r="1.8" fill="${c}" opacity="0.6"/><circle cx="72" cy="40" r="1.8" fill="${c}" opacity="0.6"/>${eyeL}${eyeR}${stdMouth}${eatingSvg}`,
    // 4 — Two rings / Ophanim forming (Archetype)
    `<circle cx="50" cy="50" r="11" fill="${c}25" stroke="${c}" stroke-width="1.4"/><circle cx="50" cy="50" r="6" fill="${bc}20"/><ellipse cx="50" cy="50" rx="44" ry="11" fill="none" stroke="${c}" stroke-width="1.2" opacity="0.85"/><ellipse cx="50" cy="50" rx="11" ry="42" fill="none" stroke="${c}" stroke-width="1.2" opacity="0.85"/><circle cx="94" cy="50" r="2.5" fill="${c}"/><circle cx="72" cy="60" r="2.2" fill="${c}" opacity="0.85"/><circle cx="28" cy="60" r="2.2" fill="${c}" opacity="0.85"/><circle cx="6" cy="50" r="2.5" fill="${c}"/><circle cx="28" cy="40" r="2.2" fill="${c}" opacity="0.85"/><circle cx="72" cy="40" r="2.2" fill="${c}" opacity="0.85"/><circle cx="61" cy="50" r="2.5" fill="${c}"/><circle cx="39" cy="50" r="2.5" fill="${c}"/><circle cx="58" cy="80" r="2.2" fill="${c}" opacity="0.85"/><circle cx="42" cy="80" r="2.2" fill="${c}" opacity="0.85"/><circle cx="50" cy="92" r="2.5" fill="${c}"/><circle cx="42" cy="20" r="2.2" fill="${c}" opacity="0.85"/><circle cx="58" cy="20" r="2.2" fill="${c}" opacity="0.85"/><circle cx="50" cy="8" r="2.5" fill="${c}"/><path d="M38,38 Q18,24 20,8 Q26,2 38,14" fill="${c}20" stroke="${c}" stroke-width="0.9"/><path d="M62,38 Q82,24 80,8 Q74,2 62,14" fill="${c}20" stroke="${c}" stroke-width="0.9"/><circle cx="50" cy="50" r="3.5" fill="${c}" opacity="0.8"/>${eatingSvg}`,
    // 5 — Full Ophanim (Paradigm) — three concentric rings, all the eyes
    `<circle cx="50" cy="50" r="10" fill="${c}30" stroke="${c}" stroke-width="1.3"/><circle cx="50" cy="50" r="5" fill="${bc}25"/><circle cx="50" cy="50" r="2.5" fill="${c}" opacity="0.95"/><ellipse cx="50" cy="50" rx="44" ry="11" fill="none" stroke="${c}" stroke-width="1.3" opacity="0.9"/><ellipse cx="50" cy="50" rx="11" ry="42" fill="none" stroke="${c}" stroke-width="1.3" opacity="0.9"/><g transform="rotate(60,50,50)"><ellipse cx="50" cy="50" rx="44" ry="11" fill="none" stroke="${c}" stroke-width="1" opacity="0.7"/><circle cx="94" cy="50" r="2" fill="${c}" opacity="0.75"/><circle cx="72" cy="60" r="1.8" fill="${c}" opacity="0.7"/><circle cx="28" cy="60" r="1.8" fill="${c}" opacity="0.7"/><circle cx="6" cy="50" r="2" fill="${c}" opacity="0.75"/><circle cx="28" cy="40" r="1.8" fill="${c}" opacity="0.7"/><circle cx="72" cy="40" r="1.8" fill="${c}" opacity="0.7"/></g><circle cx="94" cy="50" r="2.5" fill="${c}"/><circle cx="72" cy="60" r="2.2" fill="${c}" opacity="0.9"/><circle cx="28" cy="60" r="2.2" fill="${c}" opacity="0.9"/><circle cx="6" cy="50" r="2.5" fill="${c}"/><circle cx="28" cy="40" r="2.2" fill="${c}" opacity="0.9"/><circle cx="72" cy="40" r="2.2" fill="${c}" opacity="0.9"/><circle cx="61" cy="50" r="2.5" fill="${c}"/><circle cx="39" cy="50" r="2.5" fill="${c}"/><circle cx="58" cy="80" r="2.2" fill="${c}" opacity="0.9"/><circle cx="42" cy="80" r="2.2" fill="${c}" opacity="0.9"/><circle cx="50" cy="92" r="2.5" fill="${c}"/><circle cx="42" cy="20" r="2.2" fill="${c}" opacity="0.9"/><circle cx="58" cy="20" r="2.2" fill="${c}" opacity="0.9"/><circle cx="50" cy="8" r="2.5" fill="${c}"/><path d="M36,36 Q16,20 18,4 Q24,0 38,12" fill="${c}22" stroke="${c}" stroke-width="0.8" opacity="0.85"/><path d="M64,36 Q84,20 82,4 Q76,0 62,12" fill="${c}22" stroke="${c}" stroke-width="0.8" opacity="0.85"/><path d="M36,36 Q8,28 2,42" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/><path d="M64,36 Q92,28 98,42" fill="none" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/><path d="M36,64 Q8,72 2,60" fill="${c}15" stroke="${c}" stroke-width="0.8" opacity="0.75"/><path d="M64,64 Q92,72 98,60" fill="${c}15" stroke="${c}" stroke-width="0.8" opacity="0.75"/><circle cx="50" cy="50" r="17" fill="none" stroke="${c}" stroke-width="0.4" stroke-dasharray="1,5" opacity="0.35"/><circle cx="50" cy="50" r="25" fill="none" stroke="${c}" stroke-width="0.3" stroke-dasharray="1,7" opacity="0.2"/>${eatingSvg}`,
  ];
  const over = [];
  if (ids.includes('radiant_aura')) over.push(`<circle cx="50" cy="50" r="47" fill="none" stroke="${c}" stroke-width="0.5" stroke-dasharray="2,9" opacity="0.2"/>`);
  if (ids.includes('ophanim_rings')) over.push(`<ellipse cx="50" cy="50" rx="36" ry="9" fill="none" stroke="${c}" stroke-width="0.4" stroke-dasharray="1.5,5" opacity="0.25" transform="rotate(-30,50,50)"/>`);
  return `<svg class="creature-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#glow)">${bodies[Math.min(evoIdx,5)]}${over.join('')}</g></svg>`;
}


// ── HTML ──────────────────────────────────────────────────────────────────────

function refreshWebview(webview, state) {
  const settings = getWorkspaceSettings();
  renderWebview(webview, state, {
    esc,
    getEvolution,
    EVOLUTIONS,
    LANG_TRAITS,
    HYBRIDS,
    ACHIEVEMENTS,
    LORE_ENTRIES,
    renderStyles,
    renderScripts,
    buildEggSVG,
    buildHolyCCreatureSVG,
    buildCreatureForLang,
    getFoodStr,
    ramGremlinsCount: ramGremlins.length,
    animationSpeed: settings.animationSpeed,
  });
}


function deactivate() {
  if (ramGremlinInterval)      { clearInterval(ramGremlinInterval);      ramGremlinInterval      = null; }
  if (statusBarFlickerInterval) { clearInterval(statusBarFlickerInterval); statusBarFlickerInterval = null; }
  ramGremlins = [];
}
module.exports = { activate, deactivate };




