'use strict';

function renderStyles(c, bc) {
  return `<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--c:${c};--bc:${bc};--bg:var(--vscode-sideBar-background,#090910);--s:var(--vscode-input-background,#0e0e1a);--b:var(--vscode-panel-border,var(--vscode-widget-border,#1c1c2a));--t:var(--vscode-foreground,#b0b0c8);--d:var(--vscode-descriptionForeground,#454560)}
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
@keyframes eat{0%,100%{transform:translateY(0) scale(1)}20%{transform:translateY(-4px) scale(1.06)}40%{transform:translateY(1px) scale(0.97)}60%{transform:translateY(-3px) scale(1.04)}80%{transform:translateY(0) scale(1)}}
@keyframes food-rise{0%{transform:translateY(0);opacity:0}15%{opacity:1}80%{opacity:1}100%{transform:translateY(-18px);opacity:0}}
@keyframes burp-pop{0%{transform:scale(0.4) rotate(-8deg);opacity:0}25%{transform:scale(1.15) rotate(4deg);opacity:1}70%{opacity:1}100%{transform:scale(0.9) rotate(-2deg);opacity:0}}
.mood-eating .creature-svg{animation:eat 0.4s ease-in-out 3}
.eating-food{animation:food-rise 1.2s ease-out forwards;transform-box:fill-box;transform-origin:center bottom}
.burp-bubble{position:absolute;top:8px;right:10px;font-family:'VT323',monospace;font-size:18px;color:${c};animation:burp-pop 2s ease-in-out forwards;pointer-events:none;text-shadow:0 0 8px ${c}88}
.nom-bubble{position:absolute;top:8px;left:10px;font-family:'VT323',monospace;font-size:14px;color:${c};animation:burp-pop 1.8s ease-in-out forwards;pointer-events:none;opacity:0.85}
.nomnom-bubble{position:absolute;top:2px;left:10px;font-family:'VT323',monospace;font-size:14px;color:${c};animation:burp-pop 1.8s ease-in-out forwards;pointer-events:none;opacity:0.85;transform:rotate(7deg)}
.mood-sleeping .creature-svg,.mood-drowsy .creature-svg{animation:slp 4s ease-in-out infinite}
.ed{font-size:9px;color:var(--d);line-height:1.5;font-style:italic;text-align:center}
.dna-toggle{background:none;border:none;color:var(--c);font-family:'VT323',monospace;font-size:16px;letter-spacing:1px;cursor:pointer;padding:4px 0;display:flex;align-items:center;gap:4px;width:100%;justify-content:center;border-top:1px solid var(--b);margin-top:4px}
.dna-toggle:hover{opacity:0.8;background:none}
.dna-toggle .arr{display:inline-block;transition:transform .2s;font-style:normal}
.dna-drawer{display:none;flex-wrap:wrap;gap:3px;justify-content:center;padding-top:4px}
.dna-drawer.open{display:flex}
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
.fh.hunger-crit{background:#ff3333;animation:hblink 0.9s ease-in-out infinite}
@keyframes hblink{0%,100%{background:#ff3333}50%{background:#ff7700}}
.ram-counter{font-family:'VT323',monospace;font-size:13px;color:#ff4444;text-align:center;letter-spacing:1px;margin-top:2px;animation:hblink 0.8s ease-in-out infinite}
@keyframes feralGlow{0%,100%{box-shadow:none}50%{box-shadow:0 0 20px 4px rgba(255,40,40,0.22)}}
.mood-feral{animation:feralGlow 1.2s ease-in-out infinite}
.mood-feral .cf{animation:ramshake 0.25s ease-in-out infinite}
.mood-playful .creature-svg{animation:bnc 0.6s ease-in-out infinite}
/* Chase overlay */
#chase-overlay{display:none;position:fixed;inset:0;background:var(--bg);z-index:100;flex-direction:column;align-items:center;justify-content:center;gap:12px}
#chase-overlay.active{display:flex}
#chase-field{width:260px;height:100px;border:1px solid var(--b);border-radius:4px;position:relative;overflow:hidden;background:var(--s)}
#chase-ground{position:absolute;bottom:20px;left:0;right:0;height:1px;background:var(--b)}
#chase-bg{position:absolute;left:-30px;right:0;top:0;bottom:20px;background-image:repeating-linear-gradient(90deg,transparent 0,transparent 28px,${c}22 28px,${c}22 29px);animation:chase-scroll 0.55s linear infinite;pointer-events:none}
@keyframes chase-scroll{from{background-position-x:0}to{background-position-x:-29px}}
#chase-creature{position:absolute;bottom:21px;width:22px;height:22px;z-index:2}
#chase-ball{position:absolute;bottom:22px;left:222px;width:10px;height:10px;border-radius:50%;background:white;box-shadow:0 0 6px white,0 0 12px rgba(255,255,255,0.3);animation:ball-bounce 0.55s ease-in-out infinite alternate;z-index:2}
@keyframes ball-bounce{from{bottom:22px}to{bottom:46px}}
#chase-msg{font-family:'VT323',monospace;font-size:22px;color:var(--c);letter-spacing:1px;text-align:center;min-height:28px}
#chase-key-hint{display:flex;flex-direction:column;align-items:center;gap:4px}
#chase-key{font-family:'VT323',monospace;font-size:48px;color:var(--c);line-height:1;border:2px solid var(--c);border-radius:6px;padding:2px 14px;text-shadow:0 0 10px var(--c)88;box-shadow:0 0 8px var(--c)44;animation:key-pulse 1.2s ease-in-out infinite}
#chase-key-label{font-size:10px;color:var(--d);letter-spacing:1px;text-transform:uppercase}
@keyframes key-pulse{0%,100%{opacity:1;box-shadow:0 0 8px var(--c)44}50%{opacity:0.65;box-shadow:0 0 16px var(--c)88}}
#chase-result{font-family:'VT323',monospace;font-size:32px;text-align:center;display:none;padding:10px 0;animation:result-pop 0.3s ease-out}
@keyframes result-pop{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}
.chase-win{color:#4caf50;text-shadow:0 0 12px #4caf5088}
.chase-lose{color:var(--d)}
@keyframes ramshake{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px) rotate(-0.4deg)}75%{transform:translateX(2px) rotate(0.4deg)}}
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
.speech-bubble-wrap{width:100%;box-sizing:border-box;margin-bottom:2px}
/* Pattern comment speech bubble */
.speech-bubble{position:relative;background:var(--s);border:1px solid var(--c)55;border-radius:6px;padding:7px 26px 7px 9px;font-size:9.5px;line-height:1.55;color:var(--t);width:100%;box-sizing:border-box}
.speech-bubble::after{content:'';position:absolute;bottom:-7px;left:22px;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid var(--c)55}
.speech-bubble::before{content:'';position:absolute;bottom:-5px;left:23px;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid var(--s)}
.bubble-name{font-size:8px;color:var(--c);text-transform:lowercase;letter-spacing:0.5px;margin-bottom:3px;opacity:0.8}
.dismiss-btn{font-size:8px;color:var(--d);cursor:pointer;position:absolute;top:5px;right:6px;background:none;border:none;padding:0;line-height:1}
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
@keyframes creature-open-track{0%,44%{opacity:0}45%,48%{opacity:1}49%,100%{opacity:0}}
@keyframes creature-half-track{0%,44%{opacity:1}45%,48%{opacity:0}49%,74%{opacity:1}75%,93%{opacity:0}94%,100%{opacity:1}}
@keyframes creature-closed-track{0%,74%{opacity:0}75%,93%{opacity:1}94%,100%{opacity:0}}
.eye-container .eyes-open{opacity:0}.eye-container .eyes-half{opacity:1}.eye-container .eyes-closed{opacity:0}
.eye-container.normal .eyes-open{animation:creature-open-track 7s infinite}
.eye-container.normal .eyes-half{animation:creature-half-track 7s infinite}
.eye-container.normal .eyes-closed{animation:creature-closed-track 7s infinite}
.eye-container.eating .eyes-half{opacity:1}.eye-container.eating .eyes-open{opacity:0}.eye-container.eating .eyes-closed{opacity:0}
.eye-container.dim .eyes-half{opacity:0}.eye-container.dim .eyes-open{opacity:0}.eye-container.dim .eyes-closed{opacity:1}
</style>`;
}

function renderScripts(c) {
  return `<script>
const vscode=acquireVsCodeApi();
function s(t,v){vscode.postMessage({type:t,value:v})}
(function(){const st=vscode.getState()||{};document.querySelectorAll('.dna-toggle[data-key]').forEach(function(btn){const k=btn.getAttribute('data-key');if(st[k]){const d=btn.nextElementSibling;d.classList.add('open');btn.querySelector('.arr').style.transform='rotate(90deg)';btn.setAttribute('aria-expanded','true');}});})();
function tr(){const w=document.getElementById('rw');w.classList.toggle('on');if(w.classList.contains('on'))document.getElementById('ri').focus()}
function toggleDna(btn){const d=btn.nextElementSibling;const open=d.classList.toggle('open');btn.querySelector('.arr').style.transform=open?'rotate(90deg)':'';btn.setAttribute('aria-expanded',open);const k=btn.getAttribute('data-key');if(k){const st=vscode.getState()||{};st[k]=open;vscode.setState(st);}}
// ── CHASE GAME ──
let chaseActive=false,chaseRaf=null,cX=30,finished=false,chaseFrame=0,chaseMsgState=0;
const FIELD_W=260,CREAT_W=22,BALL_X=222,DRIFT=0.45,TAP_BOOST=15;
function openChase(){
  const ov=document.getElementById('chase-overlay');
  ov.classList.add('active');
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
  if(n>0){
    msg.textContent=n+'...';
    setTimeout(()=>_countdown(n-1),700);
  } else {
    msg.textContent='GO!';
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
  const res=document.getElementById('chase-result');
  const msg=document.getElementById('chase-msg');
  document.getElementById('chase-key-hint').style.display='none';
  res.style.display='block';
  if(win){
    document.getElementById('chase-ball').style.opacity='0';
    res.className='chase-win';
    res.textContent='\u2605 GOT IT! \u2605';
    msg.textContent='nice catch!';
    s('game_catch',{result:'win'});
    setTimeout(()=>{
      document.getElementById('chase-overlay').classList.remove('active');
      document.getElementById('chase-ball').style.opacity='';
    },3000);
  } else {
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
  if(e.key==='Escape'){
    if(document.getElementById('chase-overlay').classList.contains('active')&&!finished){
      chaseActive=false;finished=true;cancelAnimationFrame(chaseRaf);
      document.getElementById('chase-overlay').classList.remove('active');
      document.getElementById('chase-ball').style.opacity='';
      s('chase_abort');
    }
  }
  if(e.key==='ArrowRight'&&!e.repeat&&chaseActive&&!finished){
    e.preventDefault();
    cX=Math.min(cX+TAP_BOOST,FIELD_W-CREAT_W);
    document.getElementById('chase-creature').style.left=cX+'px';
  }
});
function dr(){const v=document.getElementById('ri').value.trim();if(v)s('rename',v);document.getElementById('rw').classList.remove('on')}
document.getElementById('ri')?.addEventListener('keydown',e=>{if(e.key==='Enter')dr();if(e.key==='Escape')document.getElementById('rw').classList.remove('on')});
(function(){const t=document.getElementById('tongue-layer');if(!t)return;function f(){const d=1500+Math.random()*7000;setTimeout(function(){const b=document.body.classList;if(!b.contains('mood-sleeping')&&!b.contains('mood-drowsy')){t.style.display='';setTimeout(function(){t.style.display='none';f()},350)}else{f()}},d)}f()})();
<\/script>`;
}

module.exports = { renderStyles, renderScripts };

