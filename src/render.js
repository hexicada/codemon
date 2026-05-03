'use strict';

function computeRenderState(state, deps) {
  const { getEvolution, EVOLUTIONS, HYBRIDS } = deps;
  const evo = getEvolution(state.xp);
  const evoIdx = EVOLUTIONS.indexOf(evo);
  const idle = (Date.now() - state.lastActive) / 60000;
  let mood;
  if (state.isEatingRam) mood = 'feral';
  else if (state._eating) mood = 'eating';
  else if (state._playful) mood = 'playful';
  else if (idle > 60) mood = 'sleeping';
  else if (idle > 15) mood = 'drowsy';
  else if (state.mood > 70) mood = 'happy';
  else if (state.mood > 40) mood = 'neutral';
  else mood = 'grumpy';
  const nextEvo = EVOLUTIONS.find(e => e.minXP > state.xp);
  const xpPct = nextEvo ? Math.round(((state.xp - evo.minXP) / (nextEvo.minXP - evo.minXP)) * 100) : 100;
  const c = state.dominantColor || '#888888';
  const bc = state.blendColor || c;
  const moodEmoji = { happy:'◉', neutral:'◎', grumpy:'◌', drowsy:'◍', sleeping:'⊙', playful:'◈', feral:'◆', eating:'●' }[mood] || '◎';
  const topLangs = Object.entries(state.langCounts).sort((a,b) => b[1]-a[1]).slice(0, 5);
  const currentHybrid = state.activeHybrids.length
    ? HYBRIDS.find(h => h.id === state.activeHybrids[state.activeHybrids.length - 1])
    : null;
  const totalEdits = Object.values(state.langCounts).reduce((a,b) => a+b, 0);
  const hasStartedCoding = totalEdits > 0;
  const isHolyC = state.dominantLang === 'holyc' || (state.langCounts.holyc || 0) >= 20;
  return { evo, evoIdx, mood, nextEvo, xpPct, c, bc, moodEmoji, topLangs, currentHybrid, totalEdits, hasStartedCoding, isHolyC };
}

function renderHints(state, c, deps) {
  const { LANG_TRAITS, HYBRIDS } = deps;
  let hint = '';
  for (const [lang, count] of Object.entries(state.langCounts).sort((a,b) => b[1]-a[1])) {
    const lt = LANG_TRAITS[lang]; if (!lt) continue;
    for (const [thr, feat] of Object.entries(lt.features)) {
      if (count < parseInt(thr) && !state.unlockedFeatures.some(f => f.featureId === feat.id)) {
        hint = `<div class="hint">▸ next: <span style="color:${lt.color}">${feat.label}</span> (${parseInt(thr)-count} more ${lang} edits)</div>`;
        break;
      }
    }
    if (hint) break;
  }
  if (hint) return hint;
  for (const h of HYBRIDS) {
    if (state.activeHybrids.includes(h.id)) continue;
    const progress = Object.entries(h.requires).map(([l,t]) => {
      const hv = state.langCounts[l] || 0;
      return hv < t ? `${t-hv} more ${l}` : null;
    }).filter(Boolean);
    if (progress.length < Object.keys(h.requires).length) {
      return `<div class="hint">⚡ hybrid <span style="color:${h.color}">${h.name}</span>: ${progress.join(', ')}</div>`;
    }
  }
  return '';
}

function renderPuzzle(state, c, deps) {
  const { esc } = deps;
  const puzzleLangOptions = ['auto','python','javascript','rust','haskell','r','lua','shellscript','holyc','default'];
  const puzzleLangShort   = {auto:'AUTO',python:'PY',javascript:'JS',rust:'RS',haskell:'HS',r:'R',lua:'LUA',shellscript:'SH',holyc:'HC',default:'CS'};
  const selectedPuzzleLang = state.puzzleLang || 'auto';
  const langSelectorHtml = `<div style="margin-top:6px">
    <div style="font-size:9px;color:var(--d);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">language:</div>
    <div style="display:flex;flex-wrap:wrap;gap:3px">
      ${puzzleLangOptions.map(k => { const active = k === selectedPuzzleLang; return `<button onclick="s('set_puzzle_lang','${k==='auto'?'':k}')" style="padding:2px 6px;font-size:9px;${active?`background:${c};color:#fff;border-color:${c};`:'opacity:0.55;'}">${puzzleLangShort[k]||k}</button>`; }).join('')}
    </div>
  </div>`;
  if (state.puzzleState === 'idle') {
    return `<div class="section-box"><div class="sec-title">debug challenge</div><div class="puzzle-prompt">I have a challenge for you. Find the bug, earn XP and lore.</div>${langSelectorHtml}<button onclick="s('start_puzzle')" style="width:100%;margin-top:6px">◈ Start Challenge</button></div>`;
  }
  if (state.puzzleState === 'active' && state.activePuzzle) {
    const p = state.activePuzzle;
    const lines = p.lines.map((line, i) =>
      `<div class="code-line" onclick="s('guess_bug',${i})" title="Click if this is the bug">
        <span class="line-num">${i+1}</span>
        <code>${esc(line)}</code>
      </div>`
    ).join('');
    return `<div class="section-box"><div class="sec-title">debug challenge <span style="color:${c}">${state.puzzleLang||state.dominantLang||'cs'}</span></div>
      <div class="puzzle-hint">I sense something wrong here. Which line is broken?</div>
      <div class="code-block">${lines}</div>
      <div class="hint" style="margin-top:4px">hint: ${esc(p.hint)}</div>
      <button onclick="s('dismiss_puzzle')" style="width:100%;margin-top:6px;opacity:0.5">✕ Give Up</button>
    </div>`;
  }
  if (state.puzzleState === 'solved' && state.activePuzzle) {
    const p = state.activePuzzle;
    return `<div class="section-box solved"><div class="sec-title" style="color:#4caf50">✓ correct — +${p.xp} xp</div>
      <div class="puzzle-explanation">${esc(p.explanation)}</div>
      <div class="lore-fragment">"${esc(p.lore)}"</div>
      <button onclick="s('dismiss_puzzle')" style="width:100%;margin-top:6px">Continue</button>
    </div>`;
  }
  if (state.puzzleState === 'failed' && state.activePuzzle) {
    const p = state.activePuzzle;
    return `<div class="section-box failed"><div class="sec-title" style="color:#f44336">✗ not quite</div>
      <div class="puzzle-explanation">The bug was on line ${p.bugLine+1}. ${esc(p.explanation)}</div>
      <button onclick="s('dismiss_puzzle')" style="width:100%;margin-top:6px">Try Again Later</button>
    </div>`;
  }
  return '';
}

function renderCodex(state, c, deps) {
  const { EVOLUTIONS, HYBRIDS } = deps;
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
    const reqStr = Object.entries(h.requires).map(([l,t]) => `${t} ${l}`).join(' + ');
    return `<div class="codex-entry ${unlocked?'unlocked':'locked'}">
      <span class="codex-glyph" style="${unlocked?`color:${h.color}`:'color:#333'}">⚡</span>
      <div><div class="codex-name" style="${unlocked?`color:${h.color}`:''}"> ${unlocked?h.name:'???'}</div>
      <div class="codex-sub">${unlocked?h.desc:reqStr}</div></div>
    </div>`;
  }).join('');
  return `<div class="section-box" style="width:100%">
    <div class="sec-title">evolution stages</div>${codexEvo}
  </div>
  <div class="section-box" style="margin-top:6px;width:100%">
    <div class="sec-title">hybrid forms</div>${codexHybrids}
  </div>`;
}

function renderAchievements(state, c, deps) {
  const { ACHIEVEMENTS } = deps;
  return ACHIEVEMENTS.map(a => {
    const earned = state.achievements.includes(a.id);
    return `<div class="ach-entry ${earned?'earned':''}">
      <span class="ach-glyph" style="${earned?`color:${c}`:'color:#333'}">${a.glyph}</span>
      <div><div class="ach-label">${earned?a.label:'???'}</div>
      <div class="ach-desc">${earned?a.desc:'keep coding'}</div></div>
    </div>`;
  }).join('');
}

function renderLore(state, deps) {
  const { esc, LORE_ENTRIES } = deps;
  if (!state.unlockedLore.length) {
    return '<div class="hint" style="text-align:center">Unlock lore by coding and finding bugs.</div>';
  }
  return state.unlockedLore
    .filter(id => id.startsWith('puzzle_') || LORE_ENTRIES[id])
    .map(id => {
      if (id.startsWith('puzzle_')) {
        const n = parseInt(id.replace('puzzle_', ''));
        return `<div class="lore-entry"><div class="lore-title">Field Note #${n}</div><div class="lore-text">Bug found. Something learned. The distinction between what is written and what is meant.</div></div>`;
      }
      const entry = LORE_ENTRIES[id];
      if (!entry) return '';
      return `<div class="lore-entry"><div class="lore-title">${esc(entry.title)}</div><div class="lore-text">${esc(entry.text)}</div></div>`;
    })
    .filter(Boolean)
    .join('');
}

function renderStats(state, topLangs, currentHybrid, deps) {
  const { LANG_TRAITS, esc } = deps;
  const LANG_ABBR = {javascript:'JS',typescript:'TS',python:'PY',rust:'RS',go:'GO',haskell:'HS',cpp:'C++',lua:'LU',ruby:'RB',r:'R',rmd:'R',css:'CSS',scss:'CSS',html:'HTM',shellscript:'SH',bash:'SH',powershell:'PS',java:'JV',csharp:'C#',php:'PHP',swift:'SW',kotlin:'KT',dart:'DA',vue:'VUE',svelte:'SV',sql:'SQL',toml:'TOM',yaml:'YML',c:'C',zig:'ZIG',ocaml:'ML',elixir:'EX',clojure:'CLJ',scala:'SC',holyc:'HC'};
  const langPips = topLangs.map(([l,cnt]) => {
    const lt = LANG_TRAITS[l] || { color:'#888' };
    const abbr = LANG_ABBR[l] || (l.slice(0,3).toUpperCase());
    return `<div class="pip" style="background:${lt.color}" title="${esc(l)}: ${cnt} edits"><span>${abbr}</span></div>`;
  }).join('');
  const featBadges = state.unlockedFeatures.map(f => `<span class="fbadge" style="border-color:${f.color}88;color:${f.color}" title="${esc(f.desc)}">${esc(f.label)}</span>`).join('');
  const hybridBox = currentHybrid ? `<div class="hbox" style="border-color:${currentHybrid.color}55"><div class="hname" style="color:${currentHybrid.color}">⚡ ${currentHybrid.name}</div><div class="hdesc">${currentHybrid.desc}</div></div>` : '';
  const cpuStr = state.cpuTempAvailable && state.cpuTemp !== null
    ? (() => { const col = state.cpuTemp >= 80 ? '#f44336' : state.cpuTemp >= 60 ? '#f4a261' : 'var(--d)'; return `<span style="color:${col}">cpu: ${state.cpuTemp}°C</span>`; })()
    : '';
  return { langPips, featBadges, hybridBox, cpuStr };
}

function renderLineage(state, deps) {
  const { esc } = deps;
  if (!state.generations || !state.generations.length) return '';
  const entries = [...state.generations].reverse().map(g => {
    const retiredDate = new Date(g.retiredAt).toLocaleDateString('en-NZ', {day:'numeric', month:'short', year:'numeric'});
    const langLabel = g.dominantLang || 'unknown';
    const featList = g.features && g.features.length ? g.features.map(f => f.label).join(', ') : 'none';
    return `<div style="border:1px solid var(--b);border-radius:4px;padding:7px 9px;margin-bottom:6px;font-size:9px;color:var(--d)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px">
        <span style="font-size:10px;color:var(--t);font-weight:600">${esc(g.name)}</span>
        <span style="opacity:0.5">gen ${g.generation + 1}</span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:3px">
        <span>⬡ ${g.xp >= 1000 ? (g.xp/1000).toFixed(1)+'k' : g.xp} xp</span>
        <span>⚙ ${g.bugsFound||0} bugs</span>
        <span>↑ ${g.totalCommits||0} commits</span>
      </div>
      <div style="margin-bottom:2px">dominant: <span style="color:${g.dominantColor||'#888'}">${langLabel}</span></div>
      <div style="margin-bottom:2px;opacity:0.7">traits: ${esc(featList)}</div>
      <div style="opacity:0.4">retired ${retiredDate}</div>
    </div>`;
  }).join('');
  return `<hr/>
  <button class="dna-toggle" data-key="lineage" onclick="toggleDna(this)" aria-expanded="false"><i class="arr">&#9656;</i>lineage (${state.generations.length})</button>
  <div class="dna-drawer">${entries}</div>`;
}

function renderWebview(webview, state, deps) {
  const {
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
    ramGremlinsCount,
  } = deps;

  const shared = { esc, getEvolution, EVOLUTIONS, LANG_TRAITS, HYBRIDS, ACHIEVEMENTS, LORE_ENTRIES };
  const { evo, evoIdx, mood, nextEvo, xpPct, c, bc, moodEmoji, topLangs, currentHybrid, totalEdits, hasStartedCoding, isHolyC } = computeRenderState(state, shared);
  const hint = renderHints(state, c, shared);
  const puzzleHtml = renderPuzzle(state, c, shared);
  const codexHtml = renderCodex(state, c, shared);
  const achHtml = renderAchievements(state, c, shared);
  const loreHtml = renderLore(state, shared);
  const { langPips, featBadges, hybridBox, cpuStr } = renderStats(state, topLangs, currentHybrid, shared);
  const lineage = renderLineage(state, shared);
  const styles = renderStyles(c, bc);
  const scripts = renderScripts(c);
  const account = state.__account;
  const activeSlotIndex = account ? account.activeSlotIndex : 0;
  const slotButtons = account
    ? account.slots.map((slot, index) => {
        const unlocked = !!account.unlockedSlots[index];
        const active = index === activeSlotIndex;
        const slotLabel = unlocked ? (slot.name || `Slot ${index + 1}`) : 'Locked';
        const slotStage = unlocked ? getEvolution(slot.xp).name : 'Reach Paradigm to unlock';
        return `<button class="slot-chip${active ? ' active' : ''}${unlocked ? '' : ' locked'}" onclick="switchSlot(${index})" ${unlocked ? '' : 'disabled'} title="${esc(slotLabel)}">
          <span class="slot-chip-index">${unlocked ? index + 1 : '🔒'}</span>
          <span class="slot-chip-copy"><span class="slot-chip-name">${esc(slotLabel)}</span><span class="slot-chip-stage">${esc(slotStage)}</span></span>
        </button>`;
      }).join('')
    : '';

  const rawChaseSvg = (hasStartedCoding || state.unlockedGhost)
    ? (isHolyC
        ? buildHolyCCreatureSVG(evoIdx, c, bc, 'happy', state.unlockedFeatures, '')
        : buildCreatureForLang(state.dominantLang, evoIdx, c, bc, 'happy', state.unlockedFeatures, state.installedExtTraits, '', state.unlockedGhost))
    : buildEggSVG(state.installedExtTraits, c);
  const chaseSvg = rawChaseSvg.replace('<svg class="creature-svg"', '<svg id="chase-creature"');

  webview.html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
${styles}</head><body>
<div class="sl2"></div>
<div class="w mood-${mood}">

  ${account ? `<div class="slot-carousel"><button class="slot-nav" onclick="cycleSlot(-1)" aria-label="Previous slot">◀</button><div class="slot-strip">${slotButtons}</div><button class="slot-nav" onclick="cycleSlot(1)" aria-label="Next slot">▶</button></div>` : ''}

  <!-- Header -->
  <div class="hdr">
    <div>
      <div class="nm" onclick="tr()" title="click to rename">${esc(state.name)}</div>
      <div class="es">${hasStartedCoding ? evo.name : 'egg'}${state.generation > 0 ? ` <span style="opacity:0.5">[gen ${state.generation + 1}]</span>` : ''}</div>
      ${state.inheritedFrom ? `<div style="font-size:8px;color:var(--d);margin-top:1px">descended from ${esc(state.inheritedFrom)}</div>` : ''}
    </div>
    <div style="text-align:right"><div class="me">${moodEmoji}</div><div class="mw">${mood}</div></div>
  </div>
  <div class="rw" id="rw"><input id="ri" maxlength="20" value="${esc(state.name)}"/><button onclick="dr()">OK</button></div>

  <!-- Creature -->
  <div class="cf">
    <div class="speech-bubble-wrap" style="${state.patternComment ? 'min-height:52px' : ''}">` + (state.patternComment && !state._eating && !state._nomnom && !state._burping ? `<div class="speech-bubble"><button class="dismiss-btn" onclick="s('dismiss_comment')">✕</button><div class="bubble-name">${esc(state.name)}:</div>${esc(state.patternComment)}</div>` : '') + `</div>
    ${(hasStartedCoding || state.unlockedGhost) ? (isHolyC ? buildHolyCCreatureSVG(evoIdx, c, bc, mood, state.unlockedFeatures, getFoodStr(state)) : buildCreatureForLang(state.dominantLang, evoIdx, c, bc, mood, state.unlockedFeatures, state.installedExtTraits, getFoodStr(state), state.unlockedGhost)) : buildEggSVG(state.installedExtTraits, c)}
    ${state._burping ? `<div class="burp-bubble">*bwooorp*</div>` : ''}
    ${state._nomnom ? `<div class="${Math.random() < 0.5 ? 'nom-bubble' : 'nomnom-bubble'}">${Math.random() < 0.5 ? '*nom*' : '*nomnom*'}</div>` : ''}
    ${hasStartedCoding && featBadges ? `<button class="dna-toggle" data-key="dna" onclick="toggleDna(this)" aria-expanded="false"><i class="arr">▸</i>dna traits (${state.unlockedFeatures.length})</button><div class="dna-drawer">${featBadges}</div>` : ''}
    <div class="ed">${hasStartedCoding ? evo.description : 'Something stirs inside. Start coding to hatch your creature.'}</div>
  </div>

  ${hybridBox}

  <!-- Stats -->
  <div class="sts">
    <div class="sr"><div class="sl">hunger</div><div class="sb"><div class="sf fh${state.isEatingRam ? ' hunger-crit' : ''}" style="width:${state.hunger}%"></div></div><div class="sv">${Math.round(state.hunger)}</div></div>
    <div class="sr"><div class="sl">mood</div><div class="sb"><div class="sf fm" style="width:${state.mood}%"></div></div><div class="sv">${Math.round(state.mood)}</div></div>
    <div class="sr"><div class="sl">xp</div><div class="sb"><div class="sf fx" style="width:${xpPct}%"></div></div><div class="sv">${state.xp}</div></div>
  </div>
  ${nextEvo ? `<div class="sub">${nextEvo.minXP - state.xp} xp → ${nextEvo.name}</div>` : '<div class="sub">MAX FORM</div>'}
  ${hint}
  <div class="stat-row-inline"><span>edits: ${totalEdits}</span><span>bugs: ${state.bugsFound}</span><span>commits: ${state.totalCommits || 0}</span><span>streak: ${state.feedStreak || 0}d</span>${cpuStr}</div>
  ${state.isEatingRam ? `<div class="ram-counter">⚠ RAM consumed: ${ramGremlinsCount * 5}MB / 50MB</div>` : ''}

  <!-- Actions -->
  <div class="acts"><button onclick="s('feed')">◆ Feed</button><button onclick="s('play')">◈ Pet</button></div>
  <button onclick="openChase()" style="width:100%;margin-top:5px;border-color:${c}44;font-size:9px">⬤ Chase Ball</button>
  <div id="ng-confirm" style="display:none;background:var(--s);border:1px solid #f4433644;border-radius:4px;padding:8px 10px;font-size:9px;color:var(--d)">
    Retire ${esc(state.name)} and begin a new generation.<br/>One DNA trait will carry forward. Name your successor.
    <div style="display:flex;gap:5px;margin-top:6px">
      <button onclick="s('prestige')" style="flex:1;border-color:#f4433688;color:#f44336">✦ Prestige</button>
      <button onclick="document.getElementById('ng-confirm').style.display='none'" style="flex:1">Cancel</button>
    </div>
  </div>
  <button onclick="document.getElementById('ng-confirm').style.display=(document.getElementById('ng-confirm').style.display==='none'?'block':'none')" style="width:100%;opacity:0.3;font-size:8px">⟳ new game+</button>

  <hr/>

  <!-- DNA -->
  ${topLangs.length ? `<div><div class="stl">DNA</div><div class="lr">${langPips}</div></div>` : '<div class="sub">start coding to shape your creature</div>'}

  <hr/>

  <!-- Debug challenge -->
  <div class="section-header">[ debug ]</div>
  ${puzzleHtml}

  <hr/>

  <!-- Codex -->
  <button class="dna-toggle" data-key="codex" onclick="toggleDna(this)" aria-expanded="false"><i class="arr">&#9656;</i>codex</button>
  <div class="dna-drawer">
  ${codexHtml}
  </div>

  <hr/>

  <!-- Achievements -->
  <button class="dna-toggle" data-key="ach" onclick="toggleDna(this)" aria-expanded="false"><i class="arr">&#9656;</i>achievements (${state.achievements.length})</button>
  <div class="dna-drawer">
  <div class="ach-grid" style="width:100%">${achHtml}</div>
  </div>

  <hr/>

  <!-- Lore -->
  <button class="dna-toggle" data-key="lore" onclick="toggleDna(this)" aria-expanded="false"><i class="arr">&#9656;</i>lore (${state.unlockedLore.length})</button>
  <div class="dna-drawer">${loreHtml}</div>

  ${lineage}

</div>

<div id="chase-overlay">
  <div id="chase-msg">ready?</div>
  <div id="chase-field">
    <div id="chase-bg"></div>
    <div id="chase-ground"></div>
    ${chaseSvg}
    <div id="chase-ball"></div>
  </div>
  <div id="chase-result"></div>
  <div id="chase-key-hint">
    <span id="chase-key">→</span>
    <span id="chase-key-label">press the arrow key to run</span>
  </div>
</div>
${scripts}</body></html>`;
}

module.exports = { renderWebview };
