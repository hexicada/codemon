'use strict';

function renderStyles(c, bc, animationSpeed) {
  animationSpeed = animationSpeed || 1;
  const a = (dur) => `${(dur / animationSpeed).toFixed(2)}s`;
  return `<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--c:${c};--bc:${bc};--bg:var(--vscode-sideBar-background,#090910);--s:var(--vscode-input-background,#0e0e1a);--b:var(--vscode-panel-border,var(--vscode-widget-border,#1c1c2a));--t:var(--vscode-foreground,#b0b0c8);--d:var(--vscode-descriptionForeground,#454560);--r-soft:12px;--r-organic-a:16px 10px 19px 11px;--r-organic-b:14px 18px 12px 20px;--r-pill:999px;--glass-bg:rgba(18,20,31,.52);--glass-edge:rgba(255,255,255,.09);--mucus-hi:rgba(255,255,255,.10);--mucus-lo:rgba(255,255,255,.04)}
body{font-family:'Space Mono',monospace;background:radial-gradient(130% 90% at 18% 8%,${c}14 0%,transparent 45%),radial-gradient(110% 80% at 88% 18%,${bc}14 0%,transparent 42%),var(--bg);color:var(--t);font-size:11px;overflow-x:hidden}
.w{padding:12px;display:flex;flex-direction:column;gap:10px;position:relative}
.w::before{content:'';position:fixed;inset:-10% -20% auto -20%;height:44%;background:radial-gradient(30% 24% at 22% 62%,${c}12 0%,transparent 72%),radial-gradient(24% 20% at 72% 46%,${bc}14 0%,transparent 74%),radial-gradient(28% 22% at 50% 20%,rgba(255,255,255,.04) 0%,transparent 72%);pointer-events:none;opacity:.6;z-index:0;animation:mucus-drift ${a(14)} ease-in-out infinite}
.w>*{position:relative;z-index:1}
.slot-carousel{display:grid;grid-template-columns:28px 1fr 28px;gap:6px;align-items:center}
.slot-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.slot-nav{padding:6px 0;font-size:11px;line-height:1;height:100%;border-radius:12px 8px 13px 9px}
.slot-chip{display:flex;align-items:center;gap:7px;padding:7px 6px;text-align:left;min-height:42px;text-transform:none;letter-spacing:0;border-color:var(--b)}
.slot-chip{border-radius:13px 9px 16px 10px}
.slot-chip.active{border-color:var(--c);background:${c}12;box-shadow:0 0 0 1px ${c}22 inset,0 6px 14px ${c}12}
.slot-chip.locked{opacity:.45}
.slot-chip:disabled{cursor:not-allowed}
.slot-chip-index{width:18px;flex-shrink:0;font-family:'VT323',monospace;font-size:16px;color:var(--c);text-align:center}
.slot-chip-copy{display:flex;flex-direction:column;min-width:0}
.slot-chip-name{font-size:8px;color:var(--t);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.slot-chip-stage{font-size:7px;color:var(--d);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
/* Header */
.hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1px solid var(--b);padding-bottom:8px}
.nm{font-family:'VT323',monospace;font-size:22px;color:var(--c);letter-spacing:1px;cursor:pointer;text-shadow:0 0 10px var(--c)55}
.es{font-size:9px;color:var(--d);text-transform:uppercase;letter-spacing:2px;margin-top:2px}
.me{font-family:'VT323',monospace;font-size:24px;color:var(--c);line-height:1}
.mw{font-size:9px;color:var(--d)}
/* Creature */
.cf{background:linear-gradient(165deg,var(--glass-bg),rgba(10,11,18,.56));border:1px solid var(--glass-edge);border-radius:var(--r-organic-a);padding:13px;display:flex;flex-direction:column;align-items:center;gap:7px;position:relative;overflow:hidden;box-shadow:0 10px 26px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.08),inset 0 -8px 24px rgba(0,0,0,.16);backdrop-filter:blur(8px) saturate(122%);-webkit-backdrop-filter:blur(8px) saturate(122%)}
.cf::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 18% 12%,var(--mucus-hi) 0%,transparent 44%),radial-gradient(ellipse at 66% 78%,${c}12 0%,transparent 60%);pointer-events:none;animation:mucus-pulse ${a(11)} ease-in-out infinite}
.cf::after{content:'';position:absolute;inset:-16% -12%;background:radial-gradient(24% 18% at 28% 34%,rgba(255,255,255,.11) 0%,transparent 70%),radial-gradient(20% 16% at 70% 62%,${bc}18 0%,transparent 72%),repeating-linear-gradient(112deg,rgba(255,255,255,.028) 0 1px,transparent 1px 8px);opacity:.45;pointer-events:none;mix-blend-mode:screen;animation:mucus-drift ${a(16)} ease-in-out infinite}
.creature-svg{width:94px;height:94px;animation:flt ${a(3)} ease-in-out infinite}
@keyframes flt{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes bnc{0%,100%{transform:translateY(0) scale(1)}35%{transform:translateY(-7px) scale(1.04)}}
@keyframes slp{0%,100%{transform:rotate(-2deg)}50%{transform:translateY(-3px) rotate(2deg)}}
@keyframes wing-flap-left{0%,100%{transform:rotate(0deg) translateY(0)}50%{transform:rotate(-4deg) translateY(-0.7px)}}
@keyframes wing-flap-right{0%,100%{transform:rotate(0deg) translateY(0)}50%{transform:rotate(4deg) translateY(-0.7px)}}
@keyframes eat{0%,100%{transform:translateY(0) scale(1)}20%{transform:translateY(-4px) scale(1.06)}40%{transform:translateY(1px) scale(0.97)}60%{transform:translateY(-3px) scale(1.04)}80%{transform:translateY(0) scale(1)}}
@keyframes food-rise{0%{transform:translateY(0);opacity:0}15%{opacity:1}80%{opacity:1}100%{transform:translateY(-18px);opacity:0}}
@keyframes burp-pop{0%{transform:scale(0.4) rotate(-8deg);opacity:0}25%{transform:scale(1.15) rotate(4deg);opacity:1}70%{opacity:1}100%{transform:scale(0.9) rotate(-2deg);opacity:0}}
.wing-left,.wing-right{transform-box:fill-box;animation-duration:${a(2.4)};animation-timing-function:ease-in-out;animation-iteration-count:infinite}
.wing-left{transform-origin:right center;animation-name:wing-flap-left}
.wing-right{transform-origin:left center;animation-name:wing-flap-right}
.wing-lower{animation-duration:${a(2.8)};opacity:0.9}
.mood-eating .creature-svg{animation:eat ${a(0.4)} ease-in-out 3}
.eating-food{animation:food-rise ${a(1.2)} ease-out forwards;transform-box:fill-box;transform-origin:center bottom}
.burp-bubble{position:absolute;top:8px;right:10px;font-family:'VT323',monospace;font-size:18px;color:${c};animation:burp-pop ${a(2)} ease-in-out forwards;pointer-events:none;text-shadow:0 0 8px ${c}88}
.nom-bubble{position:absolute;top:8px;left:10px;font-family:'VT323',monospace;font-size:14px;color:${c};animation:burp-pop ${a(1.8)} ease-in-out forwards;pointer-events:none;opacity:0.85}
.nomnom-bubble{position:absolute;top:2px;left:10px;font-family:'VT323',monospace;font-size:14px;color:${c};animation:burp-pop ${a(1.8)} ease-in-out forwards;pointer-events:none;opacity:0.85;transform:rotate(7deg)}
.mood-sleeping .creature-svg,.mood-drowsy .creature-svg{animation:slp ${a(4)} ease-in-out infinite}
.mood-sleeping .wing-left,.mood-sleeping .wing-right,.mood-drowsy .wing-left,.mood-drowsy .wing-right{animation-play-state:paused}
.ed{font-size:9px;color:var(--d);line-height:1.5;font-style:italic;text-align:center}
.dna-toggle{background:none;border:none;color:var(--c);font-family:'VT323',monospace;font-size:16px;letter-spacing:1px;cursor:pointer;padding:4px 0;display:flex;align-items:center;gap:4px;width:100%;justify-content:center;border-top:1px solid var(--b);margin-top:4px}
.dna-toggle:hover{opacity:0.8;background:none}
.dna-toggle .arr{display:inline-block;transition:transform .2s;font-style:normal}
.dna-drawer{display:none;flex-wrap:wrap;gap:3px;justify-content:center;padding-top:4px}
.dna-drawer.open{display:flex}
.fbadge{font-size:8px;padding:1px 5px;border:1px solid;border-radius:2px;text-transform:uppercase;letter-spacing:.5px;cursor:default}
.hbox{background:linear-gradient(155deg,var(--glass-bg),rgba(11,13,22,.58));border:1px solid rgba(255,255,255,.10);border-radius:12px 18px 11px 20px;padding:7px 9px;position:relative;overflow:hidden;box-shadow:0 8px 18px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.07)}
.hbox::before{content:'';position:absolute;inset:0;background:linear-gradient(155deg,rgba(255,255,255,.11),transparent 35%);pointer-events:none;opacity:.45;animation:gloss-shift ${a(12)} ease-in-out infinite}
.hname{font-family:'VT323',monospace;font-size:15px;letter-spacing:1px;margin-bottom:3px}
.hdesc{font-size:9px;color:var(--d);line-height:1.5}
/* Stats */
.sts{display:flex;flex-direction:column;gap:5px}
.sr{display:grid;grid-template-columns:46px 1fr 26px;align-items:center;gap:5px}
.sl{font-size:9px;color:var(--d);text-transform:uppercase;letter-spacing:1px}
.sb{height:5px;background:var(--b);border-radius:var(--r-pill);overflow:hidden}
.sf{height:100%;border-radius:var(--r-pill);transition:width .5s}
.fh{background:#f4a261}.fm{background:#7fc8f8}.fx{background:var(--c)}
.fh.hunger-crit{background:#ff3333;animation:hblink ${a(0.9)} ease-in-out infinite}
@keyframes hblink{0%,100%{background:#ff3333}50%{background:#ff7700}}
.ram-counter{font-family:'VT323',monospace;font-size:13px;color:#ff4444;text-align:center;letter-spacing:1px;margin-top:2px;animation:hblink ${a(0.8)} ease-in-out infinite}
@keyframes feralGlow{0%,100%{box-shadow:none}50%{box-shadow:0 0 20px 4px rgba(255,40,40,0.22)}}
.mood-feral{animation:feralGlow ${a(1.2)} ease-in-out infinite}
.mood-feral .cf{animation:ramshake ${a(0.25)} ease-in-out infinite}
.mood-playful .creature-svg{animation:bnc ${a(0.6)} ease-in-out infinite}
/* Chase overlay */
#chase-overlay{display:none;position:fixed;inset:0;background:var(--bg);z-index:100;flex-direction:column;align-items:center;justify-content:center;gap:12px}
#chase-overlay.active{display:flex}
#chase-overlay.shake{animation:chase-camera-shake ${a(0.18)} linear}
#chase-field{width:260px;height:100px;border:1px solid var(--b);border-radius:12px 18px 13px 19px;position:relative;overflow:hidden;background:linear-gradient(170deg,var(--s),${c}08)}
#chase-ground{position:absolute;bottom:20px;left:0;right:0;height:1px;background:var(--b)}
#chase-bg{position:absolute;left:-30px;right:0;top:0;bottom:20px;background-image:repeating-linear-gradient(90deg,transparent 0,transparent 28px,${c}22 28px,${c}22 29px);animation:chase-scroll ${a(0.55)} linear infinite;pointer-events:none}
@keyframes chase-scroll{from{background-position-x:0}to{background-position-x:-29px}}
@keyframes chase-warmup-bob{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-1px) scale(1.01)}}
@keyframes chase-run-bob{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-2.3px) scale(1.025)}}
#chase-creature{position:absolute;bottom:21px;width:22px;height:22px;z-index:2}
#chase-field.warmup #chase-creature{animation:chase-warmup-bob ${a(0.75)} ease-in-out infinite;transform-origin:center bottom}
#chase-field.running #chase-creature{animation:chase-run-bob ${a(0.24)} ease-in-out infinite;transform-origin:center bottom}
#chase-field.near-catch #chase-creature{filter:drop-shadow(0 0 6px ${c}aa);animation:chase-near-creature ${a(0.14)} ease-in-out infinite;transform-origin:center bottom}
#chase-field.win-pop #chase-creature{animation:chase-win-pop ${a(0.25)} ease-out}
#chase-ball{position:absolute;bottom:22px;left:222px;width:10px;height:10px;border-radius:50%;background:white;box-shadow:0 0 6px white,0 0 12px rgba(255,255,255,0.3);animation:ball-bounce ${a(0.55)} ease-in-out infinite alternate;z-index:2}
#chase-field.near-catch #chase-ball{animation:ball-bounce ${a(0.55)} ease-in-out infinite alternate,chase-near-ball ${a(0.14)} ease-in-out infinite;box-shadow:0 0 10px white,0 0 18px rgba(255,255,255,0.65)}
@keyframes ball-bounce{from{bottom:22px}to{bottom:46px}}
@keyframes chase-near-ball{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
@keyframes chase-near-creature{0%,100%{transform:translateY(-0.5px) scale(1.02)}50%{transform:translateY(-2.8px) scale(1.045)}}
@keyframes chase-win-pop{0%{transform:translateY(-2px) scale(1.02)}45%{transform:translateY(-8px) scale(1.16)}100%{transform:translateY(0) scale(1)}}
@keyframes chase-camera-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}50%{transform:translateX(4px)}75%{transform:translateX(-2px)}}
#chase-msg{font-family:'VT323',monospace;font-size:22px;color:var(--c);letter-spacing:1px;text-align:center;min-height:28px}
#chase-key-hint{display:flex;flex-direction:column;align-items:center;gap:4px}
#chase-key{font-family:'VT323',monospace;font-size:48px;color:var(--c);line-height:1;border:2px solid var(--c);border-radius:6px;padding:2px 14px;text-shadow:0 0 10px var(--c)88;box-shadow:0 0 8px var(--c)44;animation:key-pulse ${a(1.2)} ease-in-out infinite}
#chase-key-label{font-size:10px;color:var(--d);letter-spacing:1px;text-transform:uppercase}
@keyframes key-pulse{0%,100%{opacity:1;box-shadow:0 0 8px var(--c)44}50%{opacity:0.65;box-shadow:0 0 16px var(--c)88}}
#chase-result{font-family:'VT323',monospace;font-size:32px;text-align:center;display:none;padding:10px 0;animation:result-pop ${a(0.3)} ease-out}
@keyframes result-pop{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}
.chase-win{color:#4caf50;text-shadow:0 0 12px #4caf5088}
.chase-lose{color:var(--d)}
@keyframes ramshake{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px) rotate(-0.4deg)}75%{transform:translateX(2px) rotate(0.4deg)}}
@keyframes mucus-drift{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(0,-8px,0) scale(1.02)}}
@keyframes mucus-pulse{0%,100%{opacity:.8}50%{opacity:1}}
@keyframes gloss-shift{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}
.sv{font-family:'VT323',monospace;font-size:13px;text-align:right;color:var(--d)}
.sub{font-size:9px;color:var(--d);text-align:center;letter-spacing:1px}
.hint{font-size:9px;color:var(--d);text-align:center;margin-top:1px}
/* DNA */
.stl{font-size:9px;color:var(--d);text-transform:uppercase;letter-spacing:2px;margin-bottom:4px}
.lr{display:flex;gap:4px;flex-wrap:wrap}
.pip{width:26px;height:26px;border-radius:9px 13px 10px 14px;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:#000;cursor:default;opacity:.88;box-shadow:0 3px 8px rgba(0,0,0,.16)}
/* Actions */
.acts{display:grid;grid-template-columns:1fr 1fr;gap:5px}
button{background:linear-gradient(160deg,var(--s),${c}0a);border:1px solid var(--b);color:var(--t);font-family:'Space Mono',monospace;font-size:9px;padding:7px 5px;cursor:pointer;border-radius:11px 8px 14px 9px;text-transform:uppercase;letter-spacing:1px;transition:all .15s}
button:hover{border-color:var(--c);color:var(--c);background:linear-gradient(160deg,${c}14,${c}08);box-shadow:0 4px 10px ${c}18}
button:active{transform:scale(.96)}
/* Rename */
hr{border:none;border-top:1px solid var(--b)}
.rw{display:none;gap:4px}.rw.on{display:flex}
.rw input{flex:1;background:var(--s);border:1px solid var(--c);color:var(--t);font-family:'Space Mono',monospace;font-size:10px;padding:4px 6px;border-radius:10px 8px 12px 9px;outline:none}
.speech-bubble-wrap{width:100%;box-sizing:border-box;margin-bottom:2px}
/* Pattern comment speech bubble */
.speech-bubble{position:relative;background:linear-gradient(160deg,var(--s),${c}08);border:1px solid var(--c)55;border-radius:15px 11px 18px 12px;padding:8px 26px 8px 10px;font-size:9.5px;line-height:1.55;color:var(--t);width:100%;box-sizing:border-box;box-shadow:0 6px 16px rgba(0,0,0,.16)}
.speech-bubble::after{content:'';position:absolute;bottom:-8px;left:18px;border-left:7px solid transparent;border-right:8px solid transparent;border-top:9px solid var(--c)55;transform:rotate(-8deg)}
.speech-bubble::before{content:'';position:absolute;bottom:-6px;left:19px;border-left:6px solid transparent;border-right:7px solid transparent;border-top:8px solid var(--s);transform:rotate(-8deg)}
.bubble-name{font-size:8px;color:var(--c);text-transform:lowercase;letter-spacing:0.5px;margin-bottom:3px;opacity:0.8}
.dismiss-btn{font-size:8px;color:var(--d);cursor:pointer;position:absolute;top:5px;right:6px;background:none;border:none;padding:0;line-height:1}
.dismiss-btn:hover{color:var(--t)}
/* Puzzle */
.section-box{background:linear-gradient(165deg,var(--glass-bg),rgba(10,12,19,.54));border:1px solid rgba(255,255,255,.10);border-radius:13px 18px 11px 16px;padding:10px;position:relative;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,.2),inset 0 1px 0 rgba(255,255,255,.07);backdrop-filter:blur(7px) saturate(118%);-webkit-backdrop-filter:blur(7px) saturate(118%)}
.section-box::before{content:'';position:absolute;inset:0;background:linear-gradient(148deg,rgba(255,255,255,.09),transparent 38%);pointer-events:none;opacity:.5;animation:gloss-shift ${a(13)} ease-in-out infinite}
.section-box::after{content:'';position:absolute;inset:-20% -15%;background:radial-gradient(20% 16% at 24% 30%,rgba(255,255,255,.10) 0%,transparent 72%),radial-gradient(22% 18% at 78% 66%,${c}16 0%,transparent 70%),repeating-linear-gradient(116deg,rgba(255,255,255,.02) 0 1px,transparent 1px 10px);pointer-events:none;opacity:.4;mix-blend-mode:screen;animation:mucus-drift ${a(18)} ease-in-out infinite}
.section-box.solved{border-color:#4caf5044}
.section-box.failed{border-color:#f4433644}
.sec-title{font-size:9px;color:var(--d);text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}
.puzzle-prompt{font-size:10px;color:var(--t);line-height:1.5}
.puzzle-hint{font-size:9px;color:var(--d);margin-bottom:6px;font-style:italic}
.code-block{display:flex;flex-direction:column;gap:1px}
.code-line{display:flex;gap:8px;align-items:baseline;padding:4px 6px;border-radius:9px 6px 10px 7px;cursor:pointer;border:1px solid transparent;transition:all .12s}
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
.ach-entry{display:flex;gap:6px;align-items:flex-start;padding:6px;border-radius:10px 13px 8px 14px;border:1px solid rgba(255,255,255,.08);background:linear-gradient(160deg,var(--glass-bg),rgba(9,11,18,.48));position:relative;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.06)}
.ach-entry::before{content:'';position:absolute;inset:0;background:linear-gradient(150deg,rgba(255,255,255,.08),transparent 34%);pointer-events:none;opacity:.45}
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
@keyframes creature-open-track{0%,44%{opacity:0}45%,48%{opacity:1}49%,100%{opacity:0}}
@keyframes creature-half-track{0%,44%{opacity:1}45%,48%{opacity:0}49%,74%{opacity:1}75%,93%{opacity:0}94%,100%{opacity:1}}
@keyframes creature-closed-track{0%,74%{opacity:0}75%,93%{opacity:1}94%,100%{opacity:0}}
.eye-container .eyes-open{opacity:0}.eye-container .eyes-half{opacity:1}.eye-container .eyes-closed{opacity:0}
.eye-container.normal .eyes-open{animation:creature-open-track ${a(7)} infinite}
.eye-container.normal .eyes-half{animation:creature-half-track ${a(7)} infinite}
.eye-container.normal .eyes-closed{animation:creature-closed-track ${a(7)} infinite}
.eye-container.eating .eyes-half{opacity:1}.eye-container.eating .eyes-open{opacity:0}.eye-container.eating .eyes-closed{opacity:0}
.eye-container.dim .eyes-half{opacity:0}.eye-container.dim .eyes-open{opacity:0}.eye-container.dim .eyes-closed{opacity:1}
@supports not ((backdrop-filter:blur(2px)) or (-webkit-backdrop-filter:blur(2px))){
.cf,.section-box,.hbox,.ach-entry{background:linear-gradient(165deg,rgba(18,20,31,.8),rgba(10,11,18,.88))}
}
</style>`;
}

function renderScripts(c) {
  return `<script>
const vscode=acquireVsCodeApi();
function s(t,v){vscode.postMessage({type:t,value:v})}
function getSlotButtons(){return Array.from(document.querySelectorAll('.slot-chip:not([disabled])'))}
function switchSlot(i){s('slot_switch',i)}
function cycleSlot(dir){const buttons=getSlotButtons();if(!buttons.length)return;const active=Math.max(0,buttons.findIndex(b=>b.classList.contains('active')));const next=(active+dir+buttons.length)%buttons.length;const target=buttons[next];if(target)target.click()}
(function(){const st=vscode.getState()||{};document.querySelectorAll('.dna-toggle[data-key]').forEach(function(btn){const k=btn.getAttribute('data-key');if(st[k]){const d=btn.nextElementSibling;d.classList.add('open');btn.querySelector('.arr').style.transform='rotate(90deg)';btn.setAttribute('aria-expanded','true');}});})();
function tr(){const w=document.getElementById('rw');w.classList.toggle('on');if(w.classList.contains('on'))document.getElementById('ri').focus()}
function toggleDna(btn){const d=btn.nextElementSibling;const open=d.classList.toggle('open');btn.querySelector('.arr').style.transform=open?'rotate(90deg)':'';btn.setAttribute('aria-expanded',open);const k=btn.getAttribute('data-key');if(k){const st=vscode.getState()||{};st[k]=open;vscode.setState(st);}}
// ── CHASE GAME ──
let chaseActive=false,chaseRaf=null,cX=30,finished=false,chaseFrame=0,chaseMsgState=0;
const FIELD_W=260,CREAT_W=22,BALL_X=222,DRIFT=0.45,TAP_BOOST=15;
function openChase(){
  const ov=document.getElementById('chase-overlay');
  const field=document.getElementById('chase-field');
  ov.classList.add('active');
  ov.classList.remove('shake');
  field.classList.remove('near-catch');
  field.classList.remove('win-pop');
  field.classList.remove('running');
  field.classList.add('warmup');
  s('chase_start');
  document.getElementById('chase-result').style.display='none';
  document.getElementById('chase-result').textContent='';
  document.getElementById('chase-key-hint').style.display='';
  document.getElementById('chase-ball').style.opacity='';
  cX=30;finished=false;chaseFrame=0;chaseMsgState=0;
  chaseActive=false;
  if(chaseRaf)cancelAnimationFrame(chaseRaf);
  document.getElementById('chase-creature').style.left=cX+'px';
  ov.focus();
  _countdown(3);
}
function _countdown(n){
  const msg=document.getElementById('chase-msg');
  const field=document.getElementById('chase-field');
  if(n>0){
    msg.textContent=n+'...';
    setTimeout(()=>_countdown(n-1),700);
  } else {
    msg.textContent='GO!';
    field.classList.remove('warmup');
    field.classList.add('running');
    document.getElementById('chase-key-hint').style.display='none';
    chaseActive=true;
    chaseRaf=requestAnimationFrame(_chaseLoop);
  }
}
function _chaseLoop(){
  if(!chaseActive||finished)return;
  chaseFrame++;
  cX-=DRIFT;
  const gap=BALL_X-(cX+CREAT_W);
  const msg=document.getElementById('chase-msg');
  const field=document.getElementById('chase-field');
  if(gap<20&&gap>0) field.classList.add('near-catch');
  else field.classList.remove('near-catch');
  if(gap<20&&gap>0&&chaseMsgState<3){chaseMsgState=3;msg.textContent='REACH!!'}
  else if(gap<55&&chaseMsgState<2){chaseMsgState=2;msg.textContent='almost there!'}
  else if(gap<110&&chaseMsgState<1){chaseMsgState=1;msg.textContent='getting closer!'}
  if(chaseFrame===480&&chaseMsgState<2) msg.textContent='hurry!!';
  if(cX+CREAT_W>=BALL_X){_endChase(true);return;}
  if(cX<0){_endChase(false);return;}
  if(chaseFrame>600){_endChase(false);return;}
  document.getElementById('chase-creature').style.left=cX+'px';
  chaseRaf=requestAnimationFrame(_chaseLoop);
}
function _endChase(win){
  finished=true;chaseActive=false;
  cancelAnimationFrame(chaseRaf);
  const ov=document.getElementById('chase-overlay');
  const field=document.getElementById('chase-field');
  field.classList.remove('warmup');
  field.classList.remove('running');
  field.classList.remove('near-catch');
  const res=document.getElementById('chase-result');
  const msg=document.getElementById('chase-msg');
  document.getElementById('chase-key-hint').style.display='none';
  res.style.display='block';
  if(win){
    field.classList.remove('win-pop');
    void field.offsetWidth;
    field.classList.add('win-pop');
    document.getElementById('chase-ball').style.opacity='0';
    res.className='chase-win';
    res.textContent='\u2605 GOT IT! \u2605';
    msg.textContent='nice catch!';
    s('game_catch',{result:'win'});
    setTimeout(()=>{
      document.getElementById('chase-overlay').classList.remove('active');
      document.getElementById('chase-ball').style.opacity='';
      field.classList.remove('win-pop');
    },3000);
  } else {
    ov.classList.remove('shake');
    void ov.offsetWidth;
    ov.classList.add('shake');
    res.className='chase-lose';
    res.textContent='too slow...';
    msg.textContent='fell behind!';
    s('game_catch',{result:'miss'});
    setTimeout(()=>{
      document.getElementById('chase-overlay').classList.remove('active');
    },2500);
  }
}
document.addEventListener('keydown',function(e){
  const overlayOpen = document.getElementById('chase-overlay').classList.contains('active');
  if(e.key==='Escape'){
    if(overlayOpen&&!finished){
      chaseActive=false;finished=true;cancelAnimationFrame(chaseRaf);
      const field=document.getElementById('chase-field');
      field.classList.remove('warmup');
      field.classList.remove('running');
      field.classList.remove('near-catch');
      field.classList.remove('win-pop');
      document.getElementById('chase-overlay').classList.remove('active');
      document.getElementById('chase-ball').style.opacity='';
      s('chase_abort');
    }
  }
  if((e.key==='ArrowRight'||e.key==='ArrowLeft')&&!e.repeat&&overlayOpen&&!chaseActive){
    e.preventDefault();
    return;
  }
  if(e.key==='ArrowRight'&&!e.repeat&&chaseActive&&!finished){
    e.preventDefault();
    cX=Math.min(cX+TAP_BOOST,FIELD_W-CREAT_W);
    document.getElementById('chase-creature').style.left=cX+'px';
    return;
  }
});
function dr(){const v=document.getElementById('ri').value.trim();if(v)s('rename',v);document.getElementById('rw').classList.remove('on')}
document.getElementById('ri')?.addEventListener('keydown',e=>{if(e.key==='Enter')dr();if(e.key==='Escape')document.getElementById('rw').classList.remove('on')});
(function(){const t=document.getElementById('tongue-layer');if(!t)return;function f(){const d=1500+Math.random()*7000;setTimeout(function(){const b=document.body.classList;if(!b.contains('mood-sleeping')&&!b.contains('mood-drowsy')){t.style.display='';setTimeout(function(){t.style.display='none';f()},350)}else{f()}},d)}f()})();
<\/script>`;
}

module.exports = { renderStyles, renderScripts };

