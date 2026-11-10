import { useEffect, useRef } from 'react';
import Head from 'next/head';

// Result Day page: the original HTML page's CSS, markup and script, rendered as-is.

const CSS = `
:root{
  box-sizing:border-box;
  padding-top:env(safe-area-inset-top,0px);
  padding-bottom:env(safe-area-inset-bottom,0px);
  --bg:#E8EBF5;
  --surface:#FFFFFF;
  --surface-2:#F2F4FA;
  --text:#1C2140;
  --muted:#5D6488;
  --line:#D5DAEA;
  --accent:#3B5BDB;
  --accent-ink:#FFFFFF;
  --pass:#1E9E62;
  --fail:#D64545;
  --gold:#C98A00;
  --shadow:0 18px 40px -18px rgba(28,33,64,.35);
  color-scheme:light;
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --bg:#0D1120;--surface:#161C33;--surface-2:#1D2442;--text:#E8EBFA;--muted:#99A1C8;
    --line:#2A3257;--accent:#7C93FF;--accent-ink:#0D1120;--pass:#4FD394;--fail:#FF7B7B;--gold:#F4C74F;
    --shadow:0 18px 40px -18px rgba(0,0,0,.7);color-scheme:dark;
  }
}
:root[data-theme="dark"]{
  --bg:#0D1120;--surface:#161C33;--surface-2:#1D2442;--text:#E8EBFA;--muted:#99A1C8;
  --line:#2A3257;--accent:#7C93FF;--accent-ink:#0D1120;--pass:#4FD394;--fail:#FF7B7B;--gold:#F4C74F;
  --shadow:0 18px 40px -18px rgba(0,0,0,.7);color-scheme:dark;
}
*,*::before,*::after{box-sizing:inherit}
html,body{margin:0}
body{background:var(--bg);color:var(--text);font-family:"Mukta",system-ui,sans-serif;line-height:1.5;overflow-x:hidden}
main{max-width:540px;margin:0 auto;padding:24px 16px 56px}
header{margin-bottom:16px}
h1{font-family:"Baloo 2","Mukta",sans-serif;font-weight:800;font-size:clamp(2.1rem,8vw,2.9rem);line-height:1;margin:0;letter-spacing:-.01em}
.lede{margin:6px 0 0;color:var(--muted);font-size:1.05rem}

/* ===== STAGE ===== */
.stage{position:relative;border-radius:24px;overflow:hidden;box-shadow:var(--shadow);background:#1E2547;isolation:isolate}
.cam{transition:transform .9s cubic-bezier(.2,.8,.2,1);transform-origin:50% 62%}
.stage[data-state="suspense"] .cam{transform:scale(1.12)}
.stage[data-state="fail"] .cam{animation:thud .5s}
.stage svg{display:block;width:100%;height:auto}
.vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 55%,transparent 45%,rgba(5,6,20,.75));opacity:0;transition:opacity .8s;z-index:2}
.stage[data-state="suspense"] .vignette{opacity:1}
.stage[data-state="fail"] .vignette{opacity:.6;background:radial-gradient(ellipse at 50% 55%,transparent 40%,rgba(10,14,40,.85))}
.flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:3}
.stage[data-state="top"] .flash,.stage[data-state="pass"] .flash{animation:flash .6s}

.bubble{
  position:absolute;z-index:4;left:37%;top:4%;width:40%;
  padding:9px 12px;border-radius:18px;
  background:#FFFDF6;color:#1C2140;
  font:600 clamp(.78rem,3.3vw,.95rem)/1.25 "Mukta",sans-serif;text-align:center;
  box-shadow:0 6px 0 rgba(0,0,0,.18);
  transition:opacity .3s,transform .3s;
}
.bubble::after{content:"";position:absolute;bottom:-9px;left:30%;width:18px;height:18px;background:#FFFDF6;border-radius:0 0 18px 0;transform:skewX(25deg)}
.bubble.swap{animation:pop .35s}
.stage[data-state="fail"] .bubble{opacity:0;transform:translateY(-8px)}

.hud{position:absolute;z-index:4;left:4%;right:4%;bottom:3.5%;display:flex;justify-content:space-between;align-items:flex-end;gap:8px;pointer-events:none}
.chip{background:rgba(10,12,30,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:#EEF1FF;border-radius:12px;padding:6px 10px;font-size:clamp(.72rem,3vw,.85rem);line-height:1.2}
.bpm{display:flex;align-items:center;gap:8px}
.bpm svg{width:64px;height:22px;overflow:hidden}
.ecg{animation:ecg var(--beat,1s) linear infinite}
.bpm b{font:800 1.15rem/1 "Baloo 2",sans-serif;color:#FF8FA3;min-width:2.2ch;display:inline-block}
.heart{display:inline-block;color:#FF5C7A;animation:beat var(--beat,1s) infinite}
.status-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#F4C74F;margin-right:6px;vertical-align:1px}
.stage[data-state="buzz"] .status-dot,.stage[data-state="suspense"] .status-dot{background:#FF6B6B;animation:blink .6s infinite}
.stage[data-state="pass"] .status-dot,.stage[data-state="top"] .status-dot{background:#4FD394}

/* ===== SVG PARTS ===== */
svg *{transform-box:view-box}
.star{animation:twinkle 2.4s infinite}
.star:nth-child(2n){animation-delay:.8s}.star:nth-child(3n){animation-delay:1.5s}
.hand{transform-origin:330px 80px}
.cone{transition:opacity .5s}
.stage[data-state="suspense"] .cone{animation:flicker 1.2s infinite}
.stage[data-state="fail"] .cone{opacity:.15}

#char{transform-origin:200px 330px;transition:transform .5s}
#head{transform-origin:200px 225px;transition:transform .5s}
.arm{transition:transform .5s cubic-bezier(.3,1.5,.5,1)}
#armL{transform-origin:155px 250px}
#armR{transform-origin:245px 250px}

.face{opacity:0;transition:opacity .15s}
.stage[data-state="tense"] .f-tense,.stage[data-state="buzz"] .f-tense,
.stage[data-state="suspense"] .f-sus,.stage[data-state="pass"] .f-pass,
.stage[data-state="top"] .f-top,.stage[data-state="fail"] .f-fail{opacity:1}
.pupil{animation:dart 2s infinite}
.blink{transform-origin:200px 168px;animation:eyeblink 4s infinite}

.sweat{opacity:0}
.stage[data-state="tense"] .sweat,.stage[data-state="buzz"] .sweat,.stage[data-state="suspense"] .sweat{animation:sweat 1.5s infinite}
.sweat.s2{animation-delay:.7s !important}
.stage[data-state="suspense"] .sweat{animation-duration:.8s}

/* tense */
.stage[data-state="tense"] #char{animation:tremble .2s infinite}
.stage[data-state="tense"] #armL{animation:bite .45s infinite alternate}
.stage[data-state="tense"] #armR{animation:tap .35s infinite alternate}
/* buzz */
.stage[data-state="buzz"] #char{transform:translateY(-6px)}
.stage[data-state="buzz"] #head{transform:rotate(12deg)}
.stage[data-state="buzz"] #armL{transform:rotate(-20deg)}
.stage[data-state="buzz"] #armR{transform:rotate(14deg)}
/* suspense */
.stage[data-state="suspense"] #char{animation:tremble .07s infinite}
.stage[data-state="suspense"] #armL{transform:rotate(-38deg)}
.stage[data-state="suspense"] #armR{transform:rotate(38deg)}
.stage[data-state="suspense"] #head{transform:rotate(-4deg) translateY(4px)}
/* pass */
.stage[data-state="pass"] #char{animation:hop .55s infinite}
.stage[data-state="pass"] #armL{animation:waveL .3s infinite alternate}
.stage[data-state="pass"] #armR{animation:waveR .3s infinite alternate}
/* top */
.stage[data-state="top"] #char{animation:bigJump 1.1s infinite}
.stage[data-state="top"] #armL{transform:rotate(165deg)}
.stage[data-state="top"] #armR{transform:rotate(-165deg)}
.stage[data-state="top"] #head{animation:headBob .55s infinite alternate}
.sparkle{opacity:0}
.stage[data-state="top"] .sparkle{animation:sparkle 1.1s infinite}
.sparkle:nth-of-type(2){animation-delay:.35s !important}.sparkle:nth-of-type(3){animation-delay:.7s !important}
/* fail */
.stage[data-state="fail"] #char{transform:translateY(22px)}
.stage[data-state="fail"] #head{transform:rotate(9deg) translateY(10px)}
.stage[data-state="fail"] #armL{transform:rotate(6deg)}
.stage[data-state="fail"] #armR{transform:rotate(-6deg)}
.tear{transform-origin:center top;transform:scaleY(0)}
.stage[data-state="fail"] .tear{animation:tear 1.1s infinite}
.stage[data-state="fail"] .tear.t2{animation-delay:.45s}
.sad-mouth{transform-origin:200px 204px;animation:quiver .25s infinite alternate}
#cloud{opacity:0;transform:translateY(-30px);transition:all .6s}
.stage[data-state="fail"] #cloud{opacity:1;transform:translateY(0)}
.drop{opacity:0}
.stage[data-state="fail"] .drop{animation:rain .8s infinite linear}

/* phone */
#phone{transform-origin:200px 277px;transform:translate(86px,46px) rotate(-90deg);transition:transform .6s cubic-bezier(.3,1.3,.5,1)}
.stage[data-state="buzz"] #phone{animation:phoneBuzz .12s infinite}
.stage[data-state="suspense"] #phone{transform:none}
.screen{transition:fill .3s}
.stage[data-state="buzz"] .screen{fill:#3B5BDB}
.stage[data-state="pass"] .screen,.stage[data-state="top"] .screen{fill:#1E9E62}
.stage[data-state="fail"] .screen{fill:#8A2A2A}
.thumbs{opacity:0;transition:opacity .2s}
.stage[data-state="suspense"] .thumbs{opacity:1}
.pui{opacity:0}
.stage[data-state="suspense"] .pui{opacity:1}

/* ===== TIME OF DAY ===== */
.sky{fill:#0F1433;transition:fill 1s}
.w1{stop-color:#2A3266}.w2{stop-color:#1B2148}
.sun,.clouds{opacity:0;transition:opacity 1s,transform 1s}
.moon,.stars,.lampglow{transition:opacity 1s}
.stage[data-time="morning"] .sky{fill:#FFC89A}
.stage[data-time="morning"] .w1{stop-color:#F2CDA6}.stage[data-time="morning"] .w2{stop-color:#D9A07E}
.stage[data-time="day"] .sky{fill:#8FD3FF}
.stage[data-time="day"] .w1{stop-color:#A9C7EA}.stage[data-time="day"] .w2{stop-color:#7E9FCB}
.stage[data-time="evening"] .sky{fill:#FF9A66}
.stage[data-time="evening"] .w1{stop-color:#D9897A}.stage[data-time="evening"] .w2{stop-color:#6E4A7A}
.stage:not([data-time="night"]) .moon,.stage:not([data-time="night"]) .stars{opacity:0}
.stage[data-time="morning"] .sun{opacity:1;transform:translate(-42px,38px)}
.stage[data-time="day"] .sun{opacity:1}
.stage[data-time="evening"] .sun{opacity:1;transform:translate(-30px,46px)}
.stage[data-time="evening"] .sun circle{fill:#FF6A3D}
.stage[data-time="morning"] .clouds,.stage[data-time="day"] .clouds{opacity:1}
.stage[data-time="morning"] .lampglow,.stage[data-time="day"] .lampglow{opacity:0}
.stage[data-time="morning"] .cone,.stage[data-time="day"] .cone{opacity:0 !important;animation:none !important}

/* ===== COUNTDOWN ===== */
.countdown{margin-bottom:16px;background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:14px 16px 16px;box-shadow:var(--shadow)}
.cd-top{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
.cd-title{font:700 1.05rem "Mukta",sans-serif}
.cd-edit{font-size:.8rem;color:var(--muted);display:flex;align-items:center;gap:6px}
.cd-edit input{font:500 .85rem "Mukta",sans-serif;color:var(--text);background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:6px 8px}
.cd-edit input:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.cd-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px}
.cd-grid div{background:var(--surface-2);border-radius:14px;padding:10px 4px 8px;text-align:center}
.cd-grid b{display:block;font:800 clamp(1.6rem,7vw,2.1rem)/1 "Baloo 2",sans-serif;font-variant-numeric:tabular-nums}
.cd-grid span{font-size:.78rem;color:var(--muted)}
.cd-meter{margin-top:12px;height:8px;border-radius:6px;background:var(--surface-2);overflow:hidden}
.cd-meter i{display:block;height:100%;width:0;border-radius:6px;transition:width .6s,background .6s}
.cd-note{margin:8px 0 0;font-size:.92rem;color:var(--muted)}
.countdown.done .cd-grid b{color:var(--pass)}
.cta.ready{animation:ctaPulse 1.2s infinite}
@keyframes ctaPulse{50%{transform:scale(1.03)}}
.d-none {display: none !important;}
/* ===== CONTROLS ===== */
.panel{margin-top:16px;background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:16px;box-shadow:var(--shadow)}
.field{display:flex;gap:10px}
.field label{flex:1;display:flex;flex-direction:column;gap:4px;font-size:.85rem;color:var(--muted)}
.field input{font:500 1rem "Mukta",sans-serif;color:var(--text);background:var(--surface-2);border:1px solid var(--line);border-radius:12px;padding:10px 12px;width:100%}
.field input:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.seg-label{margin:14px 0 6px;font-size:.85rem;color:var(--muted)}
.seg{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;background:var(--surface-2);padding:4px;border-radius:14px;border:1px solid var(--line)}
.seg button{font:600 .92rem "Mukta",sans-serif;border:0;background:transparent;color:var(--muted);padding:8px 4px;border-radius:10px;cursor:pointer}
.seg button[aria-pressed="true"]{background:var(--surface);color:var(--text);box-shadow:0 2px 6px rgba(0,0,0,.12)}
.row{display:flex;gap:10px;margin-top:14px;align-items:stretch}
.cta{flex:1;font:800 1.15rem/1 "Baloo 2",sans-serif;padding:15px 18px;border:0;border-radius:14px;background:var(--accent);color:var(--accent-ink);cursor:pointer;box-shadow:0 5px 0 color-mix(in srgb,var(--accent) 55%,#000);transition:transform .08s,box-shadow .08s}
.cta:active{transform:translateY(4px);box-shadow:0 1px 0 color-mix(in srgb,var(--accent) 55%,#000)}
.cta:disabled{opacity:.65;cursor:progress}
.icon-btn{width:54px;border-radius:14px;border:1px solid var(--line);background:var(--surface-2);color:var(--text);font-size:1.3rem;cursor:pointer}
button:focus-visible{outline:3px solid var(--accent);outline-offset:2px}

/* ===== RESULT CARD ===== */
.result{margin-top:16px;background:var(--surface);border:1px solid var(--line);border-radius:20px;padding:18px;box-shadow:var(--shadow);position:relative;overflow:hidden;display:none}
.result.show{display:block;animation:rise .6s cubic-bezier(.2,.9,.3,1.2)}
.r-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.r-name{font:800 1.4rem/1.1 "Baloo 2",sans-serif;margin:0}
.r-meta{color:var(--muted);font-size:.9rem;margin:2px 0 0}
.r-body{display:grid;grid-template-columns:1fr;justify-items:center;gap:18px;margin-top:16px}
.ring{position:relative;width:120px;height:120px}
.ring svg{transform:rotate(-90deg)}
.ring .track{stroke:var(--surface-2)}
.ring .val{stroke:var(--tone,var(--accent));stroke-linecap:round;transition:stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1)}
.ring-num{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.ring-num b{font:800 1.8rem/1 "Baloo 2",sans-serif;color:var(--tone)}
.ring-num span{font-size:.72rem;color:var(--muted);text-align:center;line-height:1.2;max-width:84px}
.subjects{display:flex;flex-direction:column;gap:8px;width:100%}
.sub{display:grid;grid-template-columns:92px 1fr 58px;gap:8px;align-items:center;font-size:.88rem}
.bar{height:8px;border-radius:6px;background:var(--surface-2);overflow:hidden}
.bar i{display:block;height:100%;width:0;border-radius:6px;background:var(--accent);transition:width 1s cubic-bezier(.2,.8,.2,1)}
.bar i.low{background:var(--fail)}
.sub em{font-style:normal;font-weight:700;text-align:right}
.verdict{margin:16px 0 0;padding:12px 14px;border-radius:12px;background:var(--surface-2);font-weight:500}
.stamp{font:800 .9rem/1 "Mukta",sans-serif;letter-spacing:.06em;padding:6px 10px;border:3px solid var(--tone);color:var(--tone);border-radius:8px;transform:rotate(-12deg) scale(2.4);opacity:0;white-space:nowrap}
.result.show .stamp{animation:stamp .35s 1.3s forwards}
.r-actions{display:flex;gap:10px;margin-top:14px}
.ghost{flex:1;font:700 .95rem "Mukta",sans-serif;padding:11px;border-radius:12px;border:1px solid var(--line);background:var(--surface-2);color:var(--text);cursor:pointer}
.toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translate(-50%,30px);background:var(--text);color:var(--bg);padding:10px 16px;border-radius:12px;font-weight:600;opacity:0;transition:all .3s;z-index:30;pointer-events:none}
.toast.show{opacity:1;transform:translate(-50%,0)}
#confetti{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:25}

/* ===== KEYFRAMES ===== */
@keyframes tremble{0%,100%{transform:translateX(0)}50%{transform:translateX(1.4px)}}
@keyframes bite{from{transform:rotate(-136deg)}to{transform:rotate(-144deg)}}
@keyframes tap{from{transform:rotate(4deg)}to{transform:rotate(9deg)}}
@keyframes hop{0%,100%{transform:translateY(0)}50%{transform:translateY(-24px)}}
@keyframes bigJump{0%,100%{transform:translateY(0) scaleY(1)}12%{transform:translateY(5px) scaleY(.93)}45%{transform:translateY(-56px) rotate(-4deg)}75%{transform:translateY(-12px) rotate(3deg)}}
@keyframes headBob{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}
@keyframes waveL{from{transform:rotate(140deg)}to{transform:rotate(168deg)}}
@keyframes waveR{from{transform:rotate(-140deg)}to{transform:rotate(-168deg)}}
@keyframes dart{0%,35%{transform:translateX(0)}45%,70%{transform:translateX(-3px) translateY(1px)}80%,95%{transform:translateX(3px)}}
@keyframes eyeblink{0%,92%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
@keyframes sweat{0%{opacity:0;transform:translateY(0)}25%{opacity:1}100%{opacity:0;transform:translateY(34px)}}
@keyframes tear{0%{transform:scaleY(0);opacity:1}70%{transform:scaleY(1);opacity:1}100%{transform:scaleY(1);opacity:0}}
@keyframes quiver{from{transform:translateY(0)}to{transform:translateY(1px) scaleX(1.06)}}
@keyframes rain{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(70px)}}
@keyframes phoneBuzz{0%,100%{transform:translate(86px,46px) rotate(-90deg)}25%{transform:translate(84px,46px) rotate(-94deg)}75%{transform:translate(88px,46px) rotate(-86deg)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes twinkle{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes flicker{0%,100%{opacity:.55}40%{opacity:.3}45%{opacity:.6}70%{opacity:.4}}
@keyframes sparkle{0%{opacity:0;transform:scale(.4)}50%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.4)}}
@keyframes ecg{from{transform:translateX(0)}to{transform:translateX(-64px)}}
@keyframes beat{0%,100%{transform:scale(1)}15%{transform:scale(1.3)}30%{transform:scale(1)}45%{transform:scale(1.15)}}
@keyframes blink{50%{opacity:.25}}
@keyframes pop{0%{transform:scale(.9);opacity:.4}60%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes flash{0%{opacity:.75}100%{opacity:0}}
@keyframes thud{0%,100%{transform:translateY(0)}30%{transform:translateY(6px)}60%{transform:translateY(-2px)}}
@keyframes rise{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}
@keyframes stamp{to{transform:rotate(-12deg) scale(1);opacity:.9}}

@media (max-width:380px){.r-body{grid-template-columns:1fr;justify-items:center}.subjects{width:100%}.seg button{font-size:.82rem}}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
}
`;

// const MARKUP = `
// <main>
//   <header>
//     <h1>Result aane wala hai.</h1>
//     <p class="lede">7 paper ho gaye, ab sirf result ka intezaar hai. Naam daalo aur Pappu ke saath result check karo.</p>
//   </header>

//   <section class="countdown" id="countdown" aria-label="Result countdown">
//     <div class="cd-top">
//       <span class="cd-title" id="cdTitle">Result mein baaki</span>
//       <label class="cd-edit">Date<input type="datetime-local" id="cdDate"></label>
//     </div>
//     <div class="cd-grid">
//       <div><b id="cdD">00</b><span>din</span></div>
//       <div><b id="cdH">00</b><span>ghante</span></div>
//       <div><b id="cdM">00</b><span>minute</span></div>
//       <div><b id="cdS">00</b><span>second</span></div>
//     </div>
//     <div class="cd-meter"><i id="cdBar"></i></div>
//     <p class="cd-note" id="cdNote"></p>
//   </section>

//   <section class="stage" id="stage" data-state="tense" data-time="night" aria-label="Animated scene: student waiting for exam result">
//     <div class="cam">
//     <svg viewBox="0 0 400 440" role="img" aria-hidden="true">
//       <defs>
//         <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop class="w1" offset="0" stop-color="#2A3266"/><stop class="w2" offset="1" stop-color="#1B2148"/></linearGradient>
//         <linearGradient id="coneG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE29A" stop-opacity=".9"/><stop offset="1" stop-color="#FFE29A" stop-opacity="0"/></linearGradient>
//         <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE29A" stop-opacity=".35"/><stop offset="1" stop-color="#FFE29A" stop-opacity="0"/></radialGradient>
//       </defs>

//       <rect width="400" height="440" fill="url(#wall)"/>
//       <circle class="lampglow" cx="300" cy="300" r="140" fill="url(#glow)"/>

//       <!-- window -->
//       <rect class="sky" x="40" y="40" width="110" height="110" rx="6" fill="#0F1433" stroke="#5B4636" stroke-width="8"/>
//       <g class="stars">
//         <circle class="star" cx="62" cy="62" r="1.6" fill="#fff"/>
//         <circle class="star" cx="84" cy="120" r="1.3" fill="#fff"/>
//         <circle class="star" cx="130" cy="128" r="1.6" fill="#fff"/>
//         <circle class="star" cx="70" cy="98" r="1" fill="#fff"/>
//         <circle class="star" cx="138" cy="56" r="1.2" fill="#fff"/>
//       </g>
//       <g class="moon"><circle cx="112" cy="76" r="15" fill="#FFF3C4"/><circle cx="120" cy="70" r="13" fill="#0F1433"/></g>
//       <g class="sun"><circle cx="112" cy="76" r="24" fill="#FFE38A" opacity=".45"/><circle cx="112" cy="76" r="15" fill="#FFD54A"/></g>
//       <g class="clouds" fill="#fff"><ellipse cx="68" cy="68" rx="15" ry="6"/><ellipse cx="76" cy="63" rx="9" ry="6"/><ellipse cx="126" cy="122" rx="16" ry="6"/><ellipse cx="132" cy="117" rx="9" ry="6"/></g>
//       <line x1="95" y1="40" x2="95" y2="150" stroke="#5B4636" stroke-width="4"/>
//       <line x1="40" y1="95" x2="150" y2="95" stroke="#5B4636" stroke-width="4"/>

//       <!-- sticky notes -->
//       <g transform="rotate(-6 74 186)"><rect x="50" y="166" width="50" height="42" fill="#FFE27A"/><text x="75" y="184" font-family="Mukta,sans-serif" font-size="8.5" font-weight="700" text-anchor="middle" fill="#5A4300">Result</text><text x="75" y="197" font-family="Mukta,sans-serif" font-size="8.5" text-anchor="middle" fill="#5A4300" id="stickyDate">30 Nov</text></g>
//       <g transform="rotate(5 312 160)"><rect x="290" y="140" width="46" height="40" fill="#FF9EB5"/><text x="313" y="157" font-family="Mukta,sans-serif" font-size="8" text-anchor="middle" fill="#5A1023">Padhai</text><text x="313" y="170" font-family="Mukta,sans-serif" font-size="8" font-weight="700" text-anchor="middle" fill="#5A1023">kal se</text></g>

//       <!-- clock -->
//       <circle cx="330" cy="80" r="30" fill="#F5F1E6" stroke="#3A2E25" stroke-width="4"/>
//       <g stroke="#3A2E25" stroke-width="2"><line x1="330" y1="54" x2="330" y2="59"/><line x1="356" y1="80" x2="351" y2="80"/><line x1="330" y1="106" x2="330" y2="101"/><line x1="304" y1="80" x2="309" y2="80"/></g>
//       <line class="hand" id="hHand" x1="330" y1="80" x2="330" y2="65" stroke="#3A2E25" stroke-width="3.5" stroke-linecap="round"/>
//       <line class="hand" id="mHand" x1="330" y1="80" x2="330" y2="58" stroke="#3A2E25" stroke-width="2.5" stroke-linecap="round"/>
//       <line class="hand" id="sHand" x1="330" y1="84" x2="330" y2="56" stroke="#D64545" stroke-width="1.2"/>
//       <circle cx="330" cy="80" r="2.5" fill="#D64545"/>

//       <!-- character -->
//       <g id="char" stroke-linejoin="round">
//         <!-- torso -->
//         <path d="M137 342 Q135 262 176 249 L224 249 Q265 262 263 342 Z" fill="#7BB3E8" stroke="#2A1E1A" stroke-width="2.5"/>
//         <path d="M236 256 Q262 268 261 340 L245 340 Q246 286 230 258Z" fill="#62A0D8"/>
//         <path d="M150 322 Q159 312 167 324M232 318 Q240 308 248 320" fill="none" stroke="#5F98CC" stroke-width="2" stroke-linecap="round"/>
//         <rect x="219" y="285" width="25" height="22" rx="3" fill="#86BCEE" stroke="#5F98CC" stroke-width="2"/>
//         <rect x="223" y="275" width="3.5" height="14" rx="1.5" fill="#2F4FB8"/><rect x="229.5" y="278" width="3.5" height="11" rx="1.5" fill="#D64545"/>
//         <path d="M162 284 h14 v9 q-7 7 -14 0Z" fill="#E3A72F" stroke="#9C6F0A" stroke-width="1.5"/>
//         <!-- neck -->
//         <path d="M187 208 L213 208 L214 254 L186 254Z" fill="#E2AC80" stroke="#2A1E1A" stroke-width="2.5"/>
//         <path d="M187 214 Q200 226 213 214 L213 222 Q200 232 187 222Z" fill="#C99169"/>
//         <!-- collar + tie -->
//         <path d="M195 264 L205 264 L211 316 L200 330 L189 316Z" fill="#D64545" stroke="#2A1E1A" stroke-width="2"/>
//         <path d="M193 288 L207 281M191 303 L209 294" stroke="#A42E2E" stroke-width="2.5"/>
//         <path d="M193 258 L207 258 L205 268 L195 268Z" fill="#B83636" stroke="#2A1E1A" stroke-width="2"/>
//         <path d="M176 247 L200 262 L189 276 L170 256Z" fill="#fff" stroke="#2A1E1A" stroke-width="2.2"/>
//         <path d="M224 247 L200 262 L211 276 L230 256Z" fill="#fff" stroke="#2A1E1A" stroke-width="2.2"/>

//         <g id="head">
//           <!-- ears -->
//           <ellipse cx="145" cy="170" rx="12" ry="15" fill="#F2C49B" stroke="#2A1E1A" stroke-width="2.5"/>
//           <path d="M142 164 Q149 170 143 178" fill="none" stroke="#C99169" stroke-width="2.2" stroke-linecap="round"/>
//           <ellipse cx="255" cy="170" rx="12" ry="15" fill="#F2C49B" stroke="#2A1E1A" stroke-width="2.5"/>
//           <path d="M258 164 Q251 170 257 178" fill="none" stroke="#C99169" stroke-width="2.2" stroke-linecap="round"/>
//           <!-- face shape -->
//           <path d="M200 106 C235 106 258 131 258 163 C258 193 239 215 213 221 Q200 225 187 221 C161 215 142 193 142 163 C142 131 165 106 200 106Z" fill="#F2C49B" stroke="#2A1E1A" stroke-width="2.5"/>
//           <path d="M244 140 C256 160 254 196 226 216 C246 194 250 168 244 140Z" fill="#E2AC80"/>
//           <!-- hair -->
//           <path d="M139 166 C131 116 160 92 198 91 C240 90 268 115 261 166 C257 151 252 142 246 136 L242 149 L232 129 L224 144 L212 124 L202 141 L189 124 L181 142 L169 129 L163 148 L157 136 C150 144 144 154 139 166Z" fill="#2B1B12" stroke="#1A0F09" stroke-width="2"/>
//           <path d="M186 95 L178 76 L196 89 L203 72 L211 92 L224 82 L220 98Z" fill="#2B1B12" stroke="#1A0F09" stroke-width="2"/>
//           <path d="M168 108 Q190 96 214 100" fill="none" stroke="#5A3D2B" stroke-width="3.5" stroke-linecap="round"/>
//           <!-- nose -->
//           <path d="M199 174 Q193 186 202 188" fill="none" stroke="#C99169" stroke-width="2.6" stroke-linecap="round"/>

//           <!-- tense / buzz face -->
//           <g class="face f-tense">
//             <g class="blink">
//               <ellipse cx="180" cy="166" rx="11" ry="13" fill="#fff" stroke="#2A1E1A" stroke-width="2.5"/>
//               <ellipse cx="220" cy="166" rx="11" ry="13" fill="#fff" stroke="#2A1E1A" stroke-width="2.5"/>
//               <g class="pupil">
//                 <circle cx="180" cy="168" r="4.6" fill="#5A3A22"/><circle cx="180" cy="168" r="2.4" fill="#140C08"/><circle cx="181.6" cy="166.4" r="1.3" fill="#fff"/>
//                 <circle cx="220" cy="168" r="4.6" fill="#5A3A22"/><circle cx="220" cy="168" r="2.4" fill="#140C08"/><circle cx="221.6" cy="166.4" r="1.3" fill="#fff"/>
//               </g>
//             </g>
//             <path d="M171 183 Q180 187 189 183M211 183 Q220 187 229 183" fill="none" stroke="#C99169" stroke-width="1.8" stroke-linecap="round"/>
//             <path d="M165 150 Q177 145 192 138" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
//             <path d="M208 138 Q223 145 235 150" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
//             <rect x="185" y="194" width="30" height="12" rx="4" fill="#fff" stroke="#2A1E1A" stroke-width="2.5"/>
//             <path d="M192.5 194v12M200 194v12M207.5 194v12M185 200h30" stroke="#2A1E1A" stroke-width="1.3"/>
//           </g>
//           <!-- suspense: peeking -->
//           <g class="face f-sus">
//             <path d="M169 160 L187 167 L169 174" fill="none" stroke="#2A1E1A" stroke-width="3.2" stroke-linecap="round"/>
//             <ellipse cx="220" cy="167" rx="10" ry="7.5" fill="#fff" stroke="#2A1E1A" stroke-width="2.5"/>
//             <circle cx="219" cy="169" r="4" fill="#5A3A22"/><circle cx="219" cy="169" r="2" fill="#140C08"/><circle cx="220.4" cy="167.6" r="1" fill="#fff"/>
//             <path d="M165 154 Q178 150 192 146" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
//             <path d="M208 142 Q222 146 235 152" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
//             <path d="M184 202 q4 -5 8 0 t8 0 t8 0 t8 0" fill="none" stroke="#2A1E1A" stroke-width="2.6" stroke-linecap="round"/>
//           </g>
//           <!-- pass -->
//           <g class="face f-pass">
//             <ellipse cx="180" cy="165" rx="11" ry="13" fill="#fff" stroke="#2A1E1A" stroke-width="2.5"/>
//             <ellipse cx="220" cy="165" rx="11" ry="13" fill="#fff" stroke="#2A1E1A" stroke-width="2.5"/>
//             <circle cx="181" cy="166" r="7" fill="#5A3A22"/><circle cx="181" cy="166" r="3.6" fill="#140C08"/>
//             <circle cx="221" cy="166" r="7" fill="#5A3A22"/><circle cx="221" cy="166" r="3.6" fill="#140C08"/>
//             <circle cx="183.5" cy="163" r="2.3" fill="#fff"/><circle cx="178.5" cy="169" r="1.1" fill="#fff"/>
//             <circle cx="223.5" cy="163" r="2.3" fill="#fff"/><circle cx="218.5" cy="169" r="1.1" fill="#fff"/>
//             <path d="M167 142 Q179 133 192 139" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
//             <path d="M208 139 Q221 133 233 142" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
//             <ellipse cx="163" cy="190" rx="10" ry="6" fill="#F28B8B" opacity=".7"/><ellipse cx="237" cy="190" rx="10" ry="6" fill="#F28B8B" opacity=".7"/>
//             <path d="M180 192 Q200 222 220 192 Z" fill="#7A2323" stroke="#2A1E1A" stroke-width="2.5"/>
//             <path d="M183 193 L217 193 L215 198 L185 198Z" fill="#fff"/>
//             <path d="M191 208 Q200 201 209 208 Q200 215 191 208Z" fill="#E86D6D"/>
//           </g>
//           <!-- topper -->
//           <g class="face f-top">
//             <path d="M168 170 Q180 154 192 170" fill="none" stroke="#2A1E1A" stroke-width="3.8" stroke-linecap="round"/>
//             <path d="M208 170 Q220 154 232 170" fill="none" stroke="#2A1E1A" stroke-width="3.8" stroke-linecap="round"/>
//             <path d="M168 163 l-4 -3M232 163 l4 -3" stroke="#2A1E1A" stroke-width="2.4" stroke-linecap="round"/>
//             <path d="M167 139 Q179 130 192 136" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
//             <path d="M208 136 Q221 130 233 139" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
//             <ellipse cx="162" cy="187" rx="11" ry="6.5" fill="#F28B8B" opacity=".85"/><ellipse cx="238" cy="187" rx="11" ry="6.5" fill="#F28B8B" opacity=".85"/>
//             <path d="M174 186 Q200 232 226 186 Z" fill="#7A2323" stroke="#2A1E1A" stroke-width="2.5"/>
//             <path d="M177 187 L223 187 L221 194 L179 194Z" fill="#fff"/>
//             <path d="M189 211 Q200 202 211 211 Q200 219 189 211Z" fill="#E86D6D"/>
//           </g>
//           <!-- fail -->
//           <g class="face f-fail">
//             <path d="M168 166 Q180 175 192 166" fill="none" stroke="#2A1E1A" stroke-width="3.4" stroke-linecap="round"/>
//             <path d="M208 166 Q220 175 232 166" fill="none" stroke="#2A1E1A" stroke-width="3.4" stroke-linecap="round"/>
//             <path d="M165 156 Q178 150 192 143" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
//             <path d="M208 143 Q222 150 235 156" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
//             <rect class="tear" x="174" y="171" width="7" height="44" rx="3.5" fill="#7EC8F2" opacity=".9"/>
//             <rect class="tear t2" x="219" y="171" width="7" height="44" rx="3.5" fill="#7EC8F2" opacity=".9"/>
//             <path class="sad-mouth" d="M185 209 Q200 194 215 209" fill="none" stroke="#2A1E1A" stroke-width="3.5" stroke-linecap="round"/>
//           </g>

//           <path class="sweat" d="M153 128 q-5 9 0 12 q5 -3 0 -12Z" fill="#8FD3FF" stroke="#4B9BCF" stroke-width="1"/>
//           <path class="sweat s2" d="M249 124 q-5 9 0 12 q5 -3 0 -12Z" fill="#8FD3FF" stroke="#4B9BCF" stroke-width="1"/>
//         </g>

//         <!-- arms: sleeve + forearm + hand -->
//         <g id="armL" class="arm">
//           <line x1="155" y1="282" x2="155" y2="314" stroke="#2A1E1A" stroke-width="19" stroke-linecap="round"/>
//           <line x1="155" y1="282" x2="155" y2="314" stroke="#F2C49B" stroke-width="14" stroke-linecap="round"/>
//           <path d="M141 258 Q141 245 155 245 Q169 245 169 258 L171 287 Q155 294 139 287Z" fill="#7BB3E8" stroke="#2A1E1A" stroke-width="2.5"/>
//           <path d="M140 281 Q155 288 170 281" fill="none" stroke="#5F98CC" stroke-width="2.5"/>
//           <ellipse cx="164.5" cy="315" rx="4.5" ry="6.5" fill="#F2C49B" stroke="#2A1E1A" stroke-width="2"/>
//           <circle cx="155" cy="322" r="11" fill="#F2C49B" stroke="#2A1E1A" stroke-width="2.5"/>
//           <path d="M149 326 h6M150 330 h5" stroke="#C99169" stroke-width="1.6" stroke-linecap="round"/>
//         </g>
//         <g id="armR" class="arm">
//           <line x1="245" y1="282" x2="245" y2="314" stroke="#2A1E1A" stroke-width="19" stroke-linecap="round"/>
//           <line x1="245" y1="282" x2="245" y2="314" stroke="#E9B88D" stroke-width="14" stroke-linecap="round"/>
//           <path d="M231 258 Q231 245 245 245 Q259 245 259 258 L261 287 Q245 294 229 287Z" fill="#6CA6DE" stroke="#2A1E1A" stroke-width="2.5"/>
//           <path d="M230 281 Q245 288 260 281" fill="none" stroke="#4F88BE" stroke-width="2.5"/>
//           <rect x="238" y="300" width="14" height="6" rx="2" fill="#2E2E3A"/>
//           <ellipse cx="235.5" cy="315" rx="4.5" ry="6.5" fill="#E9B88D" stroke="#2A1E1A" stroke-width="2"/>
//           <circle cx="245" cy="322" r="11" fill="#E9B88D" stroke="#2A1E1A" stroke-width="2.5"/>
//           <path d="M245 326 h6M245 330 h5" stroke="#C99169" stroke-width="1.6" stroke-linecap="round"/>
//         </g>
//       </g>

//       <!-- sparkles for topper -->
//       <g fill="#FFE27A">
//         <path class="sparkle" style="transform-origin:120px 120px" d="M120 106 L124 116 L134 120 L124 124 L120 134 L116 124 L106 120 L116 116Z"/>
//         <path class="sparkle" style="transform-origin:285px 110px" d="M285 98 L288 107 L297 110 L288 113 L285 122 L282 113 L273 110 L282 107Z"/>
//         <path class="sparkle" style="transform-origin:270px 215px" d="M270 205 L272 212 L280 215 L272 218 L270 225 L268 218 L260 215 L268 212Z"/>
//       </g>

//       <!-- desk -->
//       <rect x="0" y="330" width="400" height="16" fill="#8A5530"/>
//       <rect x="0" y="330" width="400" height="4" fill="#A86B3E"/>
//       <rect x="12" y="346" width="376" height="94" fill="#6E4224"/>
//       <rect x="150" y="364" width="100" height="5" rx="2.5" fill="#4E2C15"/>

//       <!-- books -->
//       <rect x="26" y="306" width="84" height="12" rx="2" fill="#C94F4F"/>
//       <rect x="32" y="294" width="74" height="12" rx="2" fill="#3F7CC9"/>
//       <rect x="24" y="318" width="90" height="12" rx="2" fill="#E3A72F"/>
//       <path d="M36 312h40M40 300h34M30 324h50" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>

//       <!-- lamp -->
//       <polygon class="cone" points="302,268 340,268 384,330 258,330" fill="url(#coneG)" opacity=".55"/>
//       <ellipse cx="356" cy="329" rx="22" ry="5" fill="#2E2E3A"/>
//       <path d="M356 328 L342 292 L326 262" fill="none" stroke="#2E2E3A" stroke-width="4" stroke-linecap="round"/>
//       <path d="M300 268 L342 268 L332 246 L310 246Z" fill="#E65A5A"/>

//       <!-- phone -->
//       <g id="phone">
//         <rect x="185" y="250" width="30" height="54" rx="5" fill="#1A1A22"/>
//         <rect class="screen" x="188" y="256" width="24" height="42" rx="2" fill="#0E1430"/>
//         <g class="pui">
//           <text x="200" y="272" font-family="Mukta,sans-serif" font-size="5" text-anchor="middle" fill="#B9C4FF">Result</text>
//           <text id="ptext" x="200" y="284" font-family="Baloo 2,sans-serif" font-size="8" font-weight="800" text-anchor="middle" fill="#fff">0%</text>
//           <rect x="191" y="289" width="18" height="3" rx="1.5" fill="#2A3257"/>
//           <rect id="pbar" x="191" y="289" width="0" height="3" rx="1.5" fill="#4FD394"/>
//         </g>
//         <g class="thumbs" fill="#F2C49B" stroke="#2A1E1A" stroke-width="2"><ellipse cx="185" cy="289" rx="5" ry="7"/><ellipse cx="215" cy="289" rx="5" ry="7"/></g>
//       </g>

//       <!-- rain cloud -->
//       <g id="cloud">
//         <circle cx="178" cy="62" r="20" fill="#7D869C"/><circle cx="204" cy="52" r="26" fill="#7D869C"/><circle cx="230" cy="64" r="18" fill="#7D869C"/>
//         <rect x="160" y="62" width="88" height="20" rx="10" fill="#7D869C"/>
//         <rect class="drop" x="172" y="84" width="2.5" height="11" rx="1" fill="#8FD3FF"/>
//         <rect class="drop" x="192" y="84" width="2.5" height="11" rx="1" fill="#8FD3FF" style="animation-delay:.25s"/>
//         <rect class="drop" x="212" y="84" width="2.5" height="11" rx="1" fill="#8FD3FF" style="animation-delay:.5s"/>
//         <rect class="drop" x="232" y="84" width="2.5" height="11" rx="1" fill="#8FD3FF" style="animation-delay:.15s"/>
//       </g>
//     </svg>
//     </div>
//     <div class="vignette"></div>
//     <div class="flash"></div>
//     <div class="bubble" id="bubble" aria-live="polite">Bas Calculus mein F na aaye…</div>
//     <div class="hud" aria-hidden="true">
//       <div class="chip bpm">
//         <span class="heart">♥</span>
//         <svg viewBox="0 0 64 22"><g class="ecg"><path d="M0 11h10l3-7 4 14 3-7h12l3-7 4 14 3-7h12M64 11h10l3-7 4 14 3-7h12l3-7 4 14 3-7h12" fill="none" stroke="#FF8FA3" stroke-width="1.8" stroke-linejoin="round"/></g></svg>
//         <b id="bpm">112</b>
//       </div>
//       <div class="chip"><span class="status-dot"></span><span id="status">Result 12 baje</span></div>
//     </div>
//   </section>

//   <section class="panel" aria-label="Result check controls">
//     <div class="field">
//       <label>Naam<input id="name" value="Pappu" maxlength="20" autocomplete="off"></label>
//       <label>Roll no.<input id="roll" value="2611042" maxlength="10" inputmode="numeric" autocomplete="off"></label>
//     </div>
//     <p class="seg-label">Kya hona chahiye?</p>
//     <div class="seg" role="group" aria-label="Result outcome">
//       <button aria-pressed="true" data-o="random">Kismat</button>
//       <button aria-pressed="false" data-o="pass">Pass</button>
//       <button aria-pressed="false" data-o="fail">Fail</button>
//       <button aria-pressed="false" data-o="top">Topper</button>
//     </div>
//     <div class="row">
//       <button class="cta" id="checkBtn">Result check karo</button>
//       <button class="icon-btn" id="soundBtn" aria-pressed="false" aria-label="Sound on karo">🔇</button>
//     </div>
//   </section>

//   <section class="result" id="result" aria-live="polite">
//     <div class="r-head">
//       <div><p class="r-name" id="rName">Pappu</p><p class="r-meta" id="rMeta">BS Semester 1, Roll no. 2611042</p></div>
//       <span class="stamp" id="stamp">PASS</span>
//     </div>
//     <div class="r-body">
//       <div class="ring">
//         <svg viewBox="0 0 120 120" width="120" height="120"><circle class="track" cx="60" cy="60" r="50" fill="none" stroke-width="11"/><circle class="val" id="ringVal" cx="60" cy="60" r="50" fill="none" stroke-width="11" stroke-dasharray="314.16" stroke-dashoffset="314.16"/></svg>
//         <div class="ring-num"><b id="pct">0.00</b><span id="total">GPA</span></div>
//       </div>
//       <div class="subjects" id="subjects"></div>
//     </div>
//     <p class="verdict" id="verdict"></p>
//     <div class="r-actions">
//       <button class="ghost" id="againBtn">Phir se tension lo</button>
//       <button class="ghost" id="copyBtn">Result copy karo</button>
//     </div>
//   </section>
// </main>
// <canvas id="confetti" aria-hidden="true"></canvas>
// <div class="toast" id="toast" role="status"></div>


// `;
const MARKUP = `
<main>
  <header>
    <h1>Result aane wala hai.</h1>
    <p class="lede">7 paper ho gaye, ab sirf result ka intezaar hai. </p>
  </header>

  <section class="countdown" id="countdown" aria-label="Result countdown">
    <div class="cd-top d-none">
      <span class="cd-title" id="cdTitle">Result mein baaki</span>
      <label class="cd-edit">Date<input type="datetime-local" id="cdDate"></label>
    </div>
    <div class="cd-grid">
      <div><b id="cdD">00</b><span>din</span></div>
      <div><b id="cdH">00</b><span>ghante</span></div>
      <div><b id="cdM">00</b><span>minute</span></div>
      <div><b id="cdS">00</b><span>second</span></div>
    </div>
    <div class="cd-meter"><i id="cdBar"></i></div>
    <p class="cd-note" id="cdNote"></p>
  </section>

  <section class="stage" id="stage" data-state="tense" data-time="night" aria-label="Animated scene: student waiting for exam result">
    <div class="cam">
    <svg viewBox="0 0 400 440" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop class="w1" offset="0" stop-color="#2A3266"/><stop class="w2" offset="1" stop-color="#1B2148"/></linearGradient>
        <linearGradient id="coneG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE29A" stop-opacity=".9"/><stop offset="1" stop-color="#FFE29A" stop-opacity="0"/></linearGradient>
        <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE29A" stop-opacity=".35"/><stop offset="1" stop-color="#FFE29A" stop-opacity="0"/></radialGradient>
      </defs>

      <rect width="400" height="440" fill="url(#wall)"/>
      <circle class="lampglow" cx="300" cy="300" r="140" fill="url(#glow)"/>

      <!-- window -->
      <rect class="sky" x="40" y="40" width="110" height="110" rx="6" fill="#0F1433" stroke="#5B4636" stroke-width="8"/>
      <g class="stars">
        <circle class="star" cx="62" cy="62" r="1.6" fill="#fff"/>
        <circle class="star" cx="84" cy="120" r="1.3" fill="#fff"/>
        <circle class="star" cx="130" cy="128" r="1.6" fill="#fff"/>
        <circle class="star" cx="70" cy="98" r="1" fill="#fff"/>
        <circle class="star" cx="138" cy="56" r="1.2" fill="#fff"/>
      </g>
      <g class="moon"><circle cx="112" cy="76" r="15" fill="#FFF3C4"/><circle cx="120" cy="70" r="13" fill="#0F1433"/></g>
      <g class="sun"><circle cx="112" cy="76" r="24" fill="#FFE38A" opacity=".45"/><circle cx="112" cy="76" r="15" fill="#FFD54A"/></g>
      <g class="clouds" fill="#fff"><ellipse cx="68" cy="68" rx="15" ry="6"/><ellipse cx="76" cy="63" rx="9" ry="6"/><ellipse cx="126" cy="122" rx="16" ry="6"/><ellipse cx="132" cy="117" rx="9" ry="6"/></g>
      <line x1="95" y1="40" x2="95" y2="150" stroke="#5B4636" stroke-width="4"/>
      <line x1="40" y1="95" x2="150" y2="95" stroke="#5B4636" stroke-width="4"/>

      <!-- sticky notes -->
      <g transform="rotate(-6 74 186)"><rect x="50" y="166" width="50" height="42" fill="#FFE27A"/><text x="75" y="184" font-family="Mukta,sans-serif" font-size="8.5" font-weight="700" text-anchor="middle" fill="#5A4300">Result</text><text x="75" y="197" font-family="Mukta,sans-serif" font-size="8.5" text-anchor="middle" fill="#5A4300" id="stickyDate">30 Nov</text></g>
      <g transform="rotate(5 312 160)"><rect x="290" y="140" width="46" height="40" fill="#FF9EB5"/><text x="313" y="157" font-family="Mukta,sans-serif" font-size="8" text-anchor="middle" fill="#5A1023">Padhai</text><text x="313" y="170" font-family="Mukta,sans-serif" font-size="8" font-weight="700" text-anchor="middle" fill="#5A1023">kal se</text></g>

      <!-- clock -->
      <circle cx="330" cy="80" r="30" fill="#F5F1E6" stroke="#3A2E25" stroke-width="4"/>
      <g stroke="#3A2E25" stroke-width="2"><line x1="330" y1="54" x2="330" y2="59"/><line x1="356" y1="80" x2="351" y2="80"/><line x1="330" y1="106" x2="330" y2="101"/><line x1="304" y1="80" x2="309" y2="80"/></g>
      <line class="hand" id="hHand" x1="330" y1="80" x2="330" y2="65" stroke="#3A2E25" stroke-width="3.5" stroke-linecap="round"/>
      <line class="hand" id="mHand" x1="330" y1="80" x2="330" y2="58" stroke="#3A2E25" stroke-width="2.5" stroke-linecap="round"/>
      <line class="hand" id="sHand" x1="330" y1="84" x2="330" y2="56" stroke="#D64545" stroke-width="1.2"/>
      <circle cx="330" cy="80" r="2.5" fill="#D64545"/>

      <!-- character -->
      <g id="char" stroke-linejoin="round">
        <!-- torso -->
        <path d="M137 342 Q135 262 176 249 L224 249 Q265 262 263 342 Z" fill="#7BB3E8" stroke="#2A1E1A" stroke-width="2.5"/>
        <path d="M236 256 Q262 268 261 340 L245 340 Q246 286 230 258Z" fill="#62A0D8"/>
        <path d="M150 322 Q159 312 167 324M232 318 Q240 308 248 320" fill="none" stroke="#5F98CC" stroke-width="2" stroke-linecap="round"/>
        <rect x="219" y="285" width="25" height="22" rx="3" fill="#86BCEE" stroke="#5F98CC" stroke-width="2"/>
        <rect x="223" y="275" width="3.5" height="14" rx="1.5" fill="#2F4FB8"/><rect x="229.5" y="278" width="3.5" height="11" rx="1.5" fill="#D64545"/>
        <path d="M162 284 h14 v9 q-7 7 -14 0Z" fill="#E3A72F" stroke="#9C6F0A" stroke-width="1.5"/>
        <!-- neck -->
        <path d="M187 208 L213 208 L214 254 L186 254Z" fill="#E2AC80" stroke="#2A1E1A" stroke-width="2.5"/>
        <path d="M187 214 Q200 226 213 214 L213 222 Q200 232 187 222Z" fill="#C99169"/>
        <!-- collar + tie -->
        <path d="M195 264 L205 264 L211 316 L200 330 L189 316Z" fill="#D64545" stroke="#2A1E1A" stroke-width="2"/>
        <path d="M193 288 L207 281M191 303 L209 294" stroke="#A42E2E" stroke-width="2.5"/>
        <path d="M193 258 L207 258 L205 268 L195 268Z" fill="#B83636" stroke="#2A1E1A" stroke-width="2"/>
        <path d="M176 247 L200 262 L189 276 L170 256Z" fill="#fff" stroke="#2A1E1A" stroke-width="2.2"/>
        <path d="M224 247 L200 262 L211 276 L230 256Z" fill="#fff" stroke="#2A1E1A" stroke-width="2.2"/>

        <g id="head">
          <!-- ears -->
          <ellipse cx="145" cy="170" rx="12" ry="15" fill="#F2C49B" stroke="#2A1E1A" stroke-width="2.5"/>
          <path d="M142 164 Q149 170 143 178" fill="none" stroke="#C99169" stroke-width="2.2" stroke-linecap="round"/>
          <ellipse cx="255" cy="170" rx="12" ry="15" fill="#F2C49B" stroke="#2A1E1A" stroke-width="2.5"/>
          <path d="M258 164 Q251 170 257 178" fill="none" stroke="#C99169" stroke-width="2.2" stroke-linecap="round"/>
          <!-- face shape -->
          <path d="M200 106 C235 106 258 131 258 163 C258 193 239 215 213 221 Q200 225 187 221 C161 215 142 193 142 163 C142 131 165 106 200 106Z" fill="#F2C49B" stroke="#2A1E1A" stroke-width="2.5"/>
          <path d="M244 140 C256 160 254 196 226 216 C246 194 250 168 244 140Z" fill="#E2AC80"/>
          <!-- hair -->
          <path d="M139 166 C131 116 160 92 198 91 C240 90 268 115 261 166 C257 151 252 142 246 136 L242 149 L232 129 L224 144 L212 124 L202 141 L189 124 L181 142 L169 129 L163 148 L157 136 C150 144 144 154 139 166Z" fill="#2B1B12" stroke="#1A0F09" stroke-width="2"/>
          <path d="M186 95 L178 76 L196 89 L203 72 L211 92 L224 82 L220 98Z" fill="#2B1B12" stroke="#1A0F09" stroke-width="2"/>
          <path d="M168 108 Q190 96 214 100" fill="none" stroke="#5A3D2B" stroke-width="3.5" stroke-linecap="round"/>
          <!-- nose -->
          <path d="M199 174 Q193 186 202 188" fill="none" stroke="#C99169" stroke-width="2.6" stroke-linecap="round"/>

          <!-- tense / buzz face -->
          <g class="face f-tense">
            <g class="blink">
              <ellipse cx="180" cy="166" rx="11" ry="13" fill="#fff" stroke="#2A1E1A" stroke-width="2.5"/>
              <ellipse cx="220" cy="166" rx="11" ry="13" fill="#fff" stroke="#2A1E1A" stroke-width="2.5"/>
              <g class="pupil">
                <circle cx="180" cy="168" r="4.6" fill="#5A3A22"/><circle cx="180" cy="168" r="2.4" fill="#140C08"/><circle cx="181.6" cy="166.4" r="1.3" fill="#fff"/>
                <circle cx="220" cy="168" r="4.6" fill="#5A3A22"/><circle cx="220" cy="168" r="2.4" fill="#140C08"/><circle cx="221.6" cy="166.4" r="1.3" fill="#fff"/>
              </g>
            </g>
            <path d="M171 183 Q180 187 189 183M211 183 Q220 187 229 183" fill="none" stroke="#C99169" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M165 150 Q177 145 192 138" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
            <path d="M208 138 Q223 145 235 150" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
            <rect x="185" y="194" width="30" height="12" rx="4" fill="#fff" stroke="#2A1E1A" stroke-width="2.5"/>
            <path d="M192.5 194v12M200 194v12M207.5 194v12M185 200h30" stroke="#2A1E1A" stroke-width="1.3"/>
          </g>
          <!-- suspense: peeking -->
          <g class="face f-sus">
            <path d="M169 160 L187 167 L169 174" fill="none" stroke="#2A1E1A" stroke-width="3.2" stroke-linecap="round"/>
            <ellipse cx="220" cy="167" rx="10" ry="7.5" fill="#fff" stroke="#2A1E1A" stroke-width="2.5"/>
            <circle cx="219" cy="169" r="4" fill="#5A3A22"/><circle cx="219" cy="169" r="2" fill="#140C08"/><circle cx="220.4" cy="167.6" r="1" fill="#fff"/>
            <path d="M165 154 Q178 150 192 146" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
            <path d="M208 142 Q222 146 235 152" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
            <path d="M184 202 q4 -5 8 0 t8 0 t8 0 t8 0" fill="none" stroke="#2A1E1A" stroke-width="2.6" stroke-linecap="round"/>
          </g>
          <!-- pass -->
          <g class="face f-pass">
            <ellipse cx="180" cy="165" rx="11" ry="13" fill="#fff" stroke="#2A1E1A" stroke-width="2.5"/>
            <ellipse cx="220" cy="165" rx="11" ry="13" fill="#fff" stroke="#2A1E1A" stroke-width="2.5"/>
            <circle cx="181" cy="166" r="7" fill="#5A3A22"/><circle cx="181" cy="166" r="3.6" fill="#140C08"/>
            <circle cx="221" cy="166" r="7" fill="#5A3A22"/><circle cx="221" cy="166" r="3.6" fill="#140C08"/>
            <circle cx="183.5" cy="163" r="2.3" fill="#fff"/><circle cx="178.5" cy="169" r="1.1" fill="#fff"/>
            <circle cx="223.5" cy="163" r="2.3" fill="#fff"/><circle cx="218.5" cy="169" r="1.1" fill="#fff"/>
            <path d="M167 142 Q179 133 192 139" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
            <path d="M208 139 Q221 133 233 142" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
            <ellipse cx="163" cy="190" rx="10" ry="6" fill="#F28B8B" opacity=".7"/><ellipse cx="237" cy="190" rx="10" ry="6" fill="#F28B8B" opacity=".7"/>
            <path d="M180 192 Q200 222 220 192 Z" fill="#7A2323" stroke="#2A1E1A" stroke-width="2.5"/>
            <path d="M183 193 L217 193 L215 198 L185 198Z" fill="#fff"/>
            <path d="M191 208 Q200 201 209 208 Q200 215 191 208Z" fill="#E86D6D"/>
          </g>
          <!-- topper -->
          <g class="face f-top">
            <path d="M168 170 Q180 154 192 170" fill="none" stroke="#2A1E1A" stroke-width="3.8" stroke-linecap="round"/>
            <path d="M208 170 Q220 154 232 170" fill="none" stroke="#2A1E1A" stroke-width="3.8" stroke-linecap="round"/>
            <path d="M168 163 l-4 -3M232 163 l4 -3" stroke="#2A1E1A" stroke-width="2.4" stroke-linecap="round"/>
            <path d="M167 139 Q179 130 192 136" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
            <path d="M208 136 Q221 130 233 139" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
            <ellipse cx="162" cy="187" rx="11" ry="6.5" fill="#F28B8B" opacity=".85"/><ellipse cx="238" cy="187" rx="11" ry="6.5" fill="#F28B8B" opacity=".85"/>
            <path d="M174 186 Q200 232 226 186 Z" fill="#7A2323" stroke="#2A1E1A" stroke-width="2.5"/>
            <path d="M177 187 L223 187 L221 194 L179 194Z" fill="#fff"/>
            <path d="M189 211 Q200 202 211 211 Q200 219 189 211Z" fill="#E86D6D"/>
          </g>
          <!-- fail -->
          <g class="face f-fail">
            <path d="M168 166 Q180 175 192 166" fill="none" stroke="#2A1E1A" stroke-width="3.4" stroke-linecap="round"/>
            <path d="M208 166 Q220 175 232 166" fill="none" stroke="#2A1E1A" stroke-width="3.4" stroke-linecap="round"/>
            <path d="M165 156 Q178 150 192 143" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
            <path d="M208 143 Q222 150 235 156" fill="none" stroke="#2B1B12" stroke-width="5" stroke-linecap="round"/>
            <rect class="tear" x="174" y="171" width="7" height="44" rx="3.5" fill="#7EC8F2" opacity=".9"/>
            <rect class="tear t2" x="219" y="171" width="7" height="44" rx="3.5" fill="#7EC8F2" opacity=".9"/>
            <path class="sad-mouth" d="M185 209 Q200 194 215 209" fill="none" stroke="#2A1E1A" stroke-width="3.5" stroke-linecap="round"/>
          </g>

          <path class="sweat" d="M153 128 q-5 9 0 12 q5 -3 0 -12Z" fill="#8FD3FF" stroke="#4B9BCF" stroke-width="1"/>
          <path class="sweat s2" d="M249 124 q-5 9 0 12 q5 -3 0 -12Z" fill="#8FD3FF" stroke="#4B9BCF" stroke-width="1"/>
        </g>

        <!-- arms: sleeve + forearm + hand -->
        <g id="armL" class="arm">
          <line x1="155" y1="282" x2="155" y2="314" stroke="#2A1E1A" stroke-width="19" stroke-linecap="round"/>
          <line x1="155" y1="282" x2="155" y2="314" stroke="#F2C49B" stroke-width="14" stroke-linecap="round"/>
          <path d="M141 258 Q141 245 155 245 Q169 245 169 258 L171 287 Q155 294 139 287Z" fill="#7BB3E8" stroke="#2A1E1A" stroke-width="2.5"/>
          <path d="M140 281 Q155 288 170 281" fill="none" stroke="#5F98CC" stroke-width="2.5"/>
          <ellipse cx="164.5" cy="315" rx="4.5" ry="6.5" fill="#F2C49B" stroke="#2A1E1A" stroke-width="2"/>
          <circle cx="155" cy="322" r="11" fill="#F2C49B" stroke="#2A1E1A" stroke-width="2.5"/>
          <path d="M149 326 h6M150 330 h5" stroke="#C99169" stroke-width="1.6" stroke-linecap="round"/>
        </g>
        <g id="armR" class="arm">
          <line x1="245" y1="282" x2="245" y2="314" stroke="#2A1E1A" stroke-width="19" stroke-linecap="round"/>
          <line x1="245" y1="282" x2="245" y2="314" stroke="#E9B88D" stroke-width="14" stroke-linecap="round"/>
          <path d="M231 258 Q231 245 245 245 Q259 245 259 258 L261 287 Q245 294 229 287Z" fill="#6CA6DE" stroke="#2A1E1A" stroke-width="2.5"/>
          <path d="M230 281 Q245 288 260 281" fill="none" stroke="#4F88BE" stroke-width="2.5"/>
          <rect x="238" y="300" width="14" height="6" rx="2" fill="#2E2E3A"/>
          <ellipse cx="235.5" cy="315" rx="4.5" ry="6.5" fill="#E9B88D" stroke="#2A1E1A" stroke-width="2"/>
          <circle cx="245" cy="322" r="11" fill="#E9B88D" stroke="#2A1E1A" stroke-width="2.5"/>
          <path d="M245 326 h6M245 330 h5" stroke="#C99169" stroke-width="1.6" stroke-linecap="round"/>
        </g>
      </g>

      <!-- sparkles for topper -->
      <g fill="#FFE27A">
        <path class="sparkle" style="transform-origin:120px 120px" d="M120 106 L124 116 L134 120 L124 124 L120 134 L116 124 L106 120 L116 116Z"/>
        <path class="sparkle" style="transform-origin:285px 110px" d="M285 98 L288 107 L297 110 L288 113 L285 122 L282 113 L273 110 L282 107Z"/>
        <path class="sparkle" style="transform-origin:270px 215px" d="M270 205 L272 212 L280 215 L272 218 L270 225 L268 218 L260 215 L268 212Z"/>
      </g>

      <!-- desk -->
      <rect x="0" y="330" width="400" height="16" fill="#8A5530"/>
      <rect x="0" y="330" width="400" height="4" fill="#A86B3E"/>
      <rect x="12" y="346" width="376" height="94" fill="#6E4224"/>
      <rect x="150" y="364" width="100" height="5" rx="2.5" fill="#4E2C15"/>

      <!-- books -->
      <rect x="26" y="306" width="84" height="12" rx="2" fill="#C94F4F"/>
      <rect x="32" y="294" width="74" height="12" rx="2" fill="#3F7CC9"/>
      <rect x="24" y="318" width="90" height="12" rx="2" fill="#E3A72F"/>
      <path d="M36 312h40M40 300h34M30 324h50" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>

      <!-- lamp -->
      <polygon class="cone" points="302,268 340,268 384,330 258,330" fill="url(#coneG)" opacity=".55"/>
      <ellipse cx="356" cy="329" rx="22" ry="5" fill="#2E2E3A"/>
      <path d="M356 328 L342 292 L326 262" fill="none" stroke="#2E2E3A" stroke-width="4" stroke-linecap="round"/>
      <path d="M300 268 L342 268 L332 246 L310 246Z" fill="#E65A5A"/>

      <!-- phone -->
      <g id="phone">
        <rect x="185" y="250" width="30" height="54" rx="5" fill="#1A1A22"/>
        <rect class="screen" x="188" y="256" width="24" height="42" rx="2" fill="#0E1430"/>
        <g class="pui">
          <text x="200" y="272" font-family="Mukta,sans-serif" font-size="5" text-anchor="middle" fill="#B9C4FF">Result</text>
          <text id="ptext" x="200" y="284" font-family="Baloo 2,sans-serif" font-size="8" font-weight="800" text-anchor="middle" fill="#fff">0%</text>
          <rect x="191" y="289" width="18" height="3" rx="1.5" fill="#2A3257"/>
          <rect id="pbar" x="191" y="289" width="0" height="3" rx="1.5" fill="#4FD394"/>
        </g>
        <g class="thumbs" fill="#F2C49B" stroke="#2A1E1A" stroke-width="2"><ellipse cx="185" cy="289" rx="5" ry="7"/><ellipse cx="215" cy="289" rx="5" ry="7"/></g>
      </g>

      <!-- rain cloud -->
      <g id="cloud">
        <circle cx="178" cy="62" r="20" fill="#7D869C"/><circle cx="204" cy="52" r="26" fill="#7D869C"/><circle cx="230" cy="64" r="18" fill="#7D869C"/>
        <rect x="160" y="62" width="88" height="20" rx="10" fill="#7D869C"/>
        <rect class="drop" x="172" y="84" width="2.5" height="11" rx="1" fill="#8FD3FF"/>
        <rect class="drop" x="192" y="84" width="2.5" height="11" rx="1" fill="#8FD3FF" style="animation-delay:.25s"/>
        <rect class="drop" x="212" y="84" width="2.5" height="11" rx="1" fill="#8FD3FF" style="animation-delay:.5s"/>
        <rect class="drop" x="232" y="84" width="2.5" height="11" rx="1" fill="#8FD3FF" style="animation-delay:.15s"/>
      </g>
    </svg>
    </div>
    <div class="vignette"></div>
    <div class="flash"></div>
    <div class="bubble" id="bubble" aria-live="polite">Bas Calculus mein F na aaye…</div>
    <div class="hud" aria-hidden="true">
      <div class="chip bpm">
        <span class="heart">♥</span>
        <svg viewBox="0 0 64 22"><g class="ecg"><path d="M0 11h10l3-7 4 14 3-7h12l3-7 4 14 3-7h12M64 11h10l3-7 4 14 3-7h12l3-7 4 14 3-7h12" fill="none" stroke="#FF8FA3" stroke-width="1.8" stroke-linejoin="round"/></g></svg>
        <b id="bpm">112</b>
      </div>
      <div class="chip d-none"><span class="status-dot"></span><span id="status">Result 12 baje</span></div>
    </div>
  </section>

  <section class="panel d-none" aria-label="Result check controls">
    <div class="field">
      <label>Naam<input id="name" value="Pappu" maxlength="20" autocomplete="off"></label>
      <label>Roll no.<input id="roll" value="2611042" maxlength="10" inputmode="numeric" autocomplete="off"></label>
    </div>
    <p class="seg-label">Kya hona chahiye?</p>
    <div class="seg" role="group" aria-label="Result outcome">
      <button aria-pressed="true" data-o="random">Kismat</button>
      <button aria-pressed="false" data-o="pass">Pass</button>
      <button aria-pressed="false" data-o="fail">Fail</button>
      <button aria-pressed="false" data-o="top">Topper</button>
    </div>
    <div class="row">
      <button class="cta" id="checkBtn">Result check karo</button>
      <button class="icon-btn" id="soundBtn" aria-pressed="false" aria-label="Sound on karo">🔇</button>
    </div>
  </section>

  <section class="result" id="result" aria-live="polite">
    <div class="r-head">
      <div><p class="r-name" id="rName">Pappu</p><p class="r-meta" id="rMeta">BS Semester 1, Roll no. 2611042</p></div>
      <span class="stamp" id="stamp">PASS</span>
    </div>
    <div class="r-body">
      <div class="ring">
        <svg viewBox="0 0 120 120" width="120" height="120"><circle class="track" cx="60" cy="60" r="50" fill="none" stroke-width="11"/><circle class="val" id="ringVal" cx="60" cy="60" r="50" fill="none" stroke-width="11" stroke-dasharray="314.16" stroke-dashoffset="314.16"/></svg>
        <div class="ring-num"><b id="pct">0.00</b><span id="total">GPA</span></div>
      </div>
      <div class="subjects" id="subjects"></div>
    </div>
    <p class="verdict" id="verdict"></p>
    <div class="r-actions">
      <button class="ghost" id="againBtn">Phir se tension lo</button>
      <button class="ghost" id="copyBtn">Result copy karo</button>
    </div>
  </section>
</main>
<canvas id="confetti" aria-hidden="true"></canvas>
<div class="toast" id="toast" role="status"></div>


`;

const SCRIPT = `
(() => {
  const $ = id => document.getElementById(id);
  const stage = $('stage'), bubble = $('bubble'), bpmEl = $('bpm'), statusEl = $('status');
  const checkBtn = $('checkBtn'), soundBtn = $('soundBtn'), resultEl = $('result');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let outcomeMode = 'random', busy = false, timers = [], thoughtTimer = null, bpmTimer = null, lastResult = null;

  const tenseLines = [
    'Bas Calculus mein F na aaye…',
    'Discrete ka woh proof galat likha tha…',
    'Papa ko GPA kya bataunga?',
    'Programming mein loop ulta chala diya tha…',
    'CGPA 2.0 se upar rahe bas…',
    'Portal kab khulega yaar…'
  ];
  const SUBJ = ['Management','Pre-Calc I','Calculus I','Discrete','English','Programming','ICT'];
  const CODES = ['MGT-3003','MATH-3001','MATH-3004','MATH-3005','ENGL-3001','CS-3002','CS-3003'];
  function grade(m){
    const t = [[85,'A',4],[80,'A-',3.7],[75,'B+',3.3],[71,'B',3],[68,'B-',2.7],[64,'C+',2.3],[61,'C',2],[58,'C-',1.7],[54,'D+',1.3],[50,'D',1]];
    for(const [min,g,pt] of t) if(m >= min) return [g,pt];
    return ['F',0];
  }
  const PLANS = {
    pass:{ marks:[78,66,52,58,81,72,84], stamp:'PASS', tone:'var(--pass)', bpm:94,
      line:'Pass!! Calculus ne izzat bacha li',
      verdict: (m,g) => \`Saare papers clear! Calculus-I mein \${m[2]}, bal bal bache. GPA \${g.toFixed(2)}, chalega.\` },
    fail:{ marks:[64,55,38,44,70,58,61], stamp:'REPEAT', tone:'var(--fail)', bpm:58,
      line:'',
      verdict: (m,g) => \`Calculus-I aur Discrete mein F, GPA \${g.toFixed(2)}. Dono courses repeat karke CGPA wapas upar aa sakta hai. Ek semester poori degree tay nahi karta.\` },
    top:{ marks:[92,95,97,90,88,99,96], stamp:'DEAN’S LIST', tone:'var(--gold)', bpm:128,
      line:'4.00 GPA!! Dean’s list pe naam aayega',
      verdict: () => 'Saare courses mein A. Perfect 4.00, ab poori class tumse notes maangegi.' }
  };

  /* ---------- sound (Web Audio) ---------- */
  let ac = null, soundOn = false, tickTimer = null;
  function ctx(){ if(!ac) ac = new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
  function tone(freq, dur, type='sine', vol=.15, when=0, slideTo){
    if(!soundOn) return;
    const a = ctx(), t = a.currentTime + when;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if(slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + .05);
  }
  const sfx = {
    tick(){ tone(1400,.03,'square',.025); },
    heart(){ tone(70,.14,'sine',.5); tone(62,.14,'sine',.35,.17); },
    buzz(){ for(let i=0;i<3;i++) tone(170,.12,'square',.05,i*.2); },
    pass(){ [523,659,784,1047].forEach((f,i)=>tone(f,.25,'triangle',.18,i*.1)); },
    top(){ [523,659,784,1047,784,1047,1319].forEach((f,i)=>tone(f,.3,'triangle',.18,i*.11)); tone(1568,.7,'sine',.12,.8); },
    fail(){ [[392,370],[370,349],[349,330]].forEach(([a,b],i)=>tone(a,.45,'sawtooth',.07,i*.45,b)); tone(330,1.1,'sawtooth',.07,1.35,262); }
  };
  function startTicks(ms){ clearInterval(tickTimer); tickTimer = setInterval(()=>sfx.tick(), ms); }
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    soundBtn.setAttribute('aria-pressed', soundOn);
    soundBtn.textContent = soundOn ? '🔊' : '🔇';
    soundBtn.setAttribute('aria-label', soundOn ? 'Sound band karo' : 'Sound on karo');
    if(soundOn){ ctx(); startTicks(stage.dataset.state==='suspense' ? 250 : 1000); } else clearInterval(tickTimer);
  });

  /* ---------- helpers ---------- */
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  function clearAll(){ timers.forEach(clearTimeout); timers = []; }
  function say(text){ bubble.textContent = text; bubble.classList.remove('swap'); void bubble.offsetWidth; bubble.classList.add('swap'); }
  function setBpm(target){
    clearInterval(bpmTimer);
    let cur = +bpmEl.textContent;
    bpmTimer = setInterval(() => {
      cur += Math.sign(target - cur) * Math.max(1, Math.round(Math.abs(target - cur) / 8));
      bpmEl.textContent = cur;
      stage.style.setProperty('--beat', (60 / cur).toFixed(2) + 's');
      if(cur === target) clearInterval(bpmTimer);
    }, 60);
  }
  function startThoughts(){
    clearInterval(thoughtTimer);
    let i = 0; say(tenseLines[0]);
    thoughtTimer = setInterval(() => { i = (i + 1) % tenseLines.length; say(tenseLines[i]); }, 2600);
  }
  function setProgress(p){ $('pbar').setAttribute('width', (18 * p / 100).toFixed(2)); $('ptext').textContent = Math.round(p) + '%'; }
  function animateProgress(from, to, ms, done){
    const t0 = performance.now();
    (function step(now){
      const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 2);
      setProgress(from + (to - from) * e);
      if(k < 1) requestAnimationFrame(step); else done && done();
    })(t0);
  }
  function toast(msg){ const t = $('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 1800); }

  /* ---------- flow ---------- */
  function reset(){
    clearAll();
    stage.dataset.state = 'tense';
    statusEl.textContent = statusText();
    resultEl.classList.remove('show');
    setProgress(0); setBpm(baseBpm()); startThoughts();
    if(soundOn) startTicks(1000);
    busy = false; checkBtn.disabled = false;
  }

  function check(){
    if(busy) return;
    busy = true; checkBtn.disabled = true;
    resultEl.classList.remove('show');
    clearInterval(thoughtTimer);
    const kind = outcomeMode === 'random' ? ['pass','pass','fail','top'][Math.floor(Math.random()*4)] : outcomeMode;

    stage.dataset.state = 'buzz';
    statusEl.textContent = 'Result declared!';
    say('Aa gaya!! Result aa gaya!!');
    setBpm(138); sfx.buzz();

    later(() => {
      stage.dataset.state = 'suspense';
      statusEl.textContent = 'Website load ho rahi hai';
      say('Ek aankh se dekhta hoon…');
      setBpm(172); if(soundOn) startTicks(250);
      const hb = setInterval(()=>sfx.heart(), 650); timers.push(hb);
      animateProgress(0, 87, 1500, () => {
        statusEl.textContent = 'Server busy… 87% pe atka';
        say('Server bhi meri tarah tension mein hai');
        later(() => animateProgress(87, 100, 500, () => { clearInterval(hb); reveal(kind); }), 1100);
      });
    }, 1100);
  }

  function reveal(kind){
    const p = PLANS[kind];
    const total = p.marks.reduce((a,b)=>a+b,0);
    const gpa = +(p.marks.reduce((a,m)=>a+grade(m)[1],0) / p.marks.length).toFixed(2);
    lastResult = { kind, gpa, total };
    stage.dataset.state = kind;
    statusEl.textContent = \`Result: GPA \${gpa.toFixed(2)}\`;
    if(p.line) say(p.line);
    setBpm(p.bpm);
    if(soundOn) startTicks(1000);
    sfx[kind]();

    const name = $('name').value.trim() || 'Pappu', roll = $('roll').value.trim() || '2611042';
    $('rName').textContent = name;
    $('rMeta').textContent = \`BS Semester 1, Roll no. \${roll}\`;
    resultEl.style.setProperty('--tone', p.tone);
    $('stamp').textContent = p.stamp;
    $('verdict').textContent = p.verdict(p.marks, gpa);

    const box = $('subjects'); box.innerHTML = '';
    SUBJ.forEach((s,i) => {
      const row = document.createElement('div'); row.className = 'sub';
      row.innerHTML = \`<span title="\${CODES[i]}">\${s}</span><span class="bar"><i class="\${p.marks[i] < 50 ? 'low' : ''}"></i></span><em>0</em>\`;
      box.appendChild(row);
    });
    resultEl.classList.remove('show'); void resultEl.offsetWidth; resultEl.classList.add('show');
    $('ringVal').style.strokeDashoffset = 314.16;
    $('pct').textContent = '0.00';

    requestAnimationFrame(() => requestAnimationFrame(() => {
      $('ringVal').style.strokeDashoffset = (314.16 * (1 - gpa / 4)).toFixed(2);
      [...box.children].forEach((row,i) => setTimeout(() => {
        row.querySelector('i').style.width = p.marks[i] + '%';
        const g = grade(p.marks[i])[0];
        countTo(row.querySelector('em'), p.marks[i], 900, v => \`\${v} \${g}\`);
      }, 120 * i));
      countTo($('pct'), gpa, 1500, v => v.toFixed(2));
      $('total').textContent = \`GPA, \${total}/700 marks\`;
    }));

    if(kind === 'pass') confetti(140);
    if(kind === 'top'){ confetti(220); later(()=>confetti(160), 900); }
    later(() => resultEl.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'nearest'}), 700);
    busy = false; checkBtn.disabled = false; checkBtn.textContent = 'Dobara check karo';
  }

  function countTo(el, target, ms, fmt){
    const t0 = performance.now();
    (function step(now){
      const k = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(k < 1 ? (Number.isInteger(target) ? Math.round(target * e) : target * e) : target);
      if(k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- canvas confetti ---------- */
  const cv = $('confetti'), cx = cv.getContext('2d');
  let parts = [], running = false;
  function size(){ const d = devicePixelRatio || 1; cv.width = innerWidth * d; cv.height = innerHeight * d; cx.setTransform(d,0,0,d,0,0); }
  addEventListener('resize', size); size();
  function confetti(n){
    if(reduce) return;
    const colors = ['#FF5C7A','#3B5BDB','#F4C74F','#4FD394','#7BB3E8','#B36BFF','#FF9A3C'];
    const r = stage.getBoundingClientRect();
    for(let i=0;i<n;i++){
      const left = i % 2 === 0;
      parts.push({
        x: left ? r.left : r.right, y: r.top + r.height * .55,
        vx: (left ? 1 : -1) * (3 + Math.random() * 7), vy: -(7 + Math.random() * 9),
        w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, rot: Math.random() * 6, vr: (Math.random() - .5) * .4,
        c: colors[i % colors.length], life: 0, shape: Math.random() > .7 ? 'c' : 'r'
      });
    }
    if(!running){ running = true; requestAnimationFrame(loop); }
  }
  function loop(){
    cx.clearRect(0,0,innerWidth,innerHeight);
    parts.forEach(p => {
      p.vy += .28; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot); cx.fillStyle = p.c;
      if(p.shape === 'c'){ cx.beginPath(); cx.arc(0,0,p.w/2,0,7); cx.fill(); }
      else { cx.scale(1, Math.cos(p.life * .15)); cx.fillRect(-p.w/2,-p.h/2,p.w,p.h); }
      cx.restore();
    });
    parts = parts.filter(p => p.y < innerHeight + 40 && p.life < 400);
    if(parts.length) requestAnimationFrame(loop); else { running = false; cx.clearRect(0,0,innerWidth,innerHeight); }
  }

  /* ---------- wiring ---------- */
  document.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.seg button').forEach(x => x.setAttribute('aria-pressed', x === b));
    outcomeMode = b.dataset.o;
  }));
  checkBtn.addEventListener('click', () => { if(stage.dataset.state !== 'tense'){ reset(); later(check, 400); } else check(); });
  $('againBtn').addEventListener('click', () => { reset(); checkBtn.textContent = 'Result check karo'; stage.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'center'}); });
  $('copyBtn').addEventListener('click', async () => {
    if(!lastResult) return;
    const name = $('name').value.trim() || 'Pappu';
    const text = \`\${name} ka Semester 1 result: GPA \${lastResult.gpa.toFixed(2)} (\${lastResult.total}/700), \${PLANS[lastResult.kind].stamp}\`;
    try { await navigator.clipboard.writeText(text); toast('Result copy ho gaya'); }
    catch(e){ toast('Copy nahi hua, browser ne roka'); }
  });

  /* ---------- countdown ---------- */
  const EXAMS_DONE = new Date('2026-10-31T17:00');
  const DEFAULT_DATE = '2026-11-30T12:00';
  const cdInput = $('cdDate'), cdBox = $('countdown');
  const pad = n => String(n).padStart(2, '0');
  let resultAt;
  try { cdInput.value = localStorage.getItem('resultDate') || DEFAULT_DATE; } catch(e){ cdInput.value = DEFAULT_DATE; }
  function loadDate(){
    const d = new Date(cdInput.value);
    resultAt = isNaN(d) ? new Date(DEFAULT_DATE) : d;
    $('stickyDate').textContent = resultAt.toLocaleDateString('en-GB', {day:'numeric', month:'short'});
  }
  function left(){ return Math.max(0, resultAt - Date.now()); }
  function tensionFrac(){
    const span = resultAt - EXAMS_DONE;
    if(span <= 0) return 1;
    return Math.min(1, Math.max(0, (Date.now() - EXAMS_DONE) / span));
  }
  function baseBpm(){ return left() === 0 ? 150 : Math.round(80 + 65 * tensionFrac()); }
  function statusText(){
    const ms = left();
    if(!ms) return 'Result aa gaya!';
    const d = Math.floor(ms / 864e5);
    return d ? \`Result mein \${d} din\` : 'Result aaj hi hai!';
  }
  function tick(){
    const ms = left();
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, sec = Math.floor(ms / 1e3) % 60;
    $('cdD').textContent = pad(d); $('cdH').textContent = pad(h); $('cdM').textContent = pad(m); $('cdS').textContent = pad(sec);
    const f = tensionFrac(), bar = $('cdBar');
    bar.style.width = (f * 100).toFixed(1) + '%';
    bar.style.background = f < .5 ? 'var(--pass)' : f < .85 ? 'var(--gold)' : 'var(--fail)';
    const done = ms === 0;
    cdBox.classList.toggle('done', done);
    $('cdTitle').textContent = done ? 'Result aa gaya hai' : 'Result mein baaki';
    $('cdNote').textContent = done ? 'Portal khul gaya hoga. Neeche button dabao.'
      : d >= 14 ? 'Tension level: abhi to mazay karo'
      : d >= 7 ? 'Tension level: thodi thodi shuru ho gayi'
      : d >= 2 ? 'Tension level: neend kam ho rahi hai'
      : 'Tension level: dil bahar aa raha hai';
    const now = new Date();
    const hr = now.getHours();
    const tod = hr >= 5 && hr < 10 ? 'morning' : hr >= 10 && hr < 17 ? 'day' : hr >= 17 && hr < 19 ? 'evening' : 'night';
    if(stage.dataset.time !== tod) stage.dataset.time = tod;
    const cs = now.getSeconds(), cm = now.getMinutes() + cs / 60, ch = (now.getHours() % 12) + cm / 60;
    $('sHand').style.transform = \`rotate(\${cs * 6}deg)\`;
    $('mHand').style.transform = \`rotate(\${cm * 6}deg)\`;
    $('hHand').style.transform = \`rotate(\${ch * 30}deg)\`;
    checkBtn.classList.toggle('ready', done && !busy);
    if(stage.dataset.state === 'tense') statusEl.textContent = statusText();
  }
  cdInput.addEventListener('change', () => {
    try { localStorage.setItem('resultDate', cdInput.value); } catch(e){}
    loadDate(); tick();
    if(stage.dataset.state === 'tense' && !busy) setBpm(baseBpm());
  });
  loadDate(); tick(); setInterval(tick, 1000);

  reset();
})();
`;

export default function Exams() {
  const started = useRef(false);

  useEffect(() => {
    // Run the page script once (strict mode runs effects twice in dev)
    if (started.current) return;
    started.current = true;
    new Function(SCRIPT)();
  }, []);

  return (
    <>
      <Head>
        <title>Result Day</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Mukta:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div dangerouslySetInnerHTML={{ __html: MARKUP }} />
    </>
  );
}
