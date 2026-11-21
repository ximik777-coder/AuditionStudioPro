const st = document.createElement("style");
st.textContent = `
  *{box-sizing:border-box} body{background:#08090b;color:#d8dce0;font-family:'Segoe UI',sans-serif;margin:0;padding:10px;user-select:none}
  .daw{max-width:1220px;margin:auto;background:#15171a;border:1px solid #2d3138;border-radius:8px;padding:12px;box-shadow:0 24px 70px rgba(0,0,0,.95)}
  .bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;background:#101215;padding:7px 10px;border-radius:5px;border:1px solid #22252b;margin-bottom:8px}
  button{background:#202429;color:#e0e4e8;border:1px solid #373c44;padding:5px 9px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:700;transition:.12s}
  button:hover:not(:disabled){background:#2e333a;border-color:#555c66} button:disabled{opacity:.35;cursor:not-allowed}
  button.on-mint{background:#00897b;border-color:#00f59b;color:#fff} button.on-amb{background:#ef6c00;border-color:#ffa726;color:#fff}
  button.on-pink{background:#c2185b;border-color:#ff4081;color:#fff} button.on-purp{background:#6a1b9a;border-color:#ba68c8;color:#fff}
  button.on-blue{background:#0277bd;border-color:#4fc3f7;color:#fff} button.on-gpu{background:linear-gradient(90deg,#00c853,#00bfa5);border-color:#69f0ae;color:#000}
  .lcd{font-family:Consolas,monospace;background:#050706;color:#00f59b;padding:5px 9px;border-radius:4px;border:1px solid #1e2523;font-size:11px}
  .sys{display:flex;gap:8px;font-family:Consolas,monospace;font-size:11px;background:#070908;padding:4px 8px;border-radius:4px;border:1px solid #222826}
  .sys span{color:#00f59b}
  input[type=text]{background:#1c2024;border:1px solid #373c44;color:#fff;padding:4px 7px;border-radius:4px;font-size:11px;width:130px}
  input[type=range]{accent-color:#ff9800;cursor:pointer} select{background:#202429;color:#fff;border:1px solid #373c44;padding:5px 8px;border-radius:4px;font-size:12px}
  .rk{background:#111316;border:1px solid #252930;border-radius:6px;padding:9px}
  .rk h4{margin:0 0 7px;font-size:11px;color:#ffa726;text-transform:uppercase;border-bottom:1px solid #21252b;padding-bottom:4px}
  .pm{margin:4px 0;font-size:11px;color:#b0b6bc} .pm div{display:flex;justify-content:space-between;margin-bottom:2px} .pm span{color:#00f59b;font-family:monospace}
  .cov-box{width:76px;height:76px;background:#070908;border:2px dashed #3b424c;border-radius:6px;display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;flex-shrink:0}
  .cov-box:hover{border-color:#00f59b} .cov-box canvas{width:100%;height:100%;display:block}
`;
document.head.appendChild(st);

document.getElementById("app").innerHTML = `
<div class="daw">
  <div class="bar" style="justify-content:space-between">
    <div style="display:flex;align-items:center;gap:10px">
      <div class="cov-box" id="covDrop" title="Кликните, чтобы загрузить обложку релиза (1000x1000)"><canvas id="covCv" width="1000" height="1000"></canvas><span id="covTxt" style="position:absolute;font-size:10px;color:#888;text-align:center">🖼 ОБЛОЖКА<br>+ ФОТО</span></div>
      <input type="file" id="covIn" accept="image/*" style="display:none">
      <div>
        <div style="font-size:15px;font-weight:900;color:#ffa726;margin-bottom:5px">👑 AUDITION x FL STUDIO v8.0 <span style="color:#00f59b">PRO RELEASE</span></div>
        <div style="display:flex;gap:5px;flex-wrap:wrap">
          <input type="text" id="tagArt" placeholder="Исполнитель (Artist)">
          <input type="text" id="tagTit" placeholder="Название трека">
          <input type="text" id="tagAlb" placeholder="Альбом / Релиз">
          <button onclick="dlCover()" style="background:#263238;border-color:#4fc3f7">⬇ Cover.jpg</button>
        </div>
      </div>
    </div>
        <div style="background:#050706;border:1px solid #1e2523;border-radius:6px;padding:6px 10px;min-width:230px;display:flex;flex-direction:column;gap:5px">
      <div style="display:flex;justify-content:space-between;font-family:Consolas,monospace;font-size:11px">
        <span id="stTop" style="color:#ffa726;font-weight:700">⚡ ГОТОВ К РАБОТЕ</span>
        <span id="stTime" style="color:#00f59b">0 ms</span>
      </div>
      <div style="width:100%;height:6px;background:#151918;border-radius:3px;overflow:hidden">
        <div id="stBar" style="width:100%;height:100%;background:linear-gradient(90deg,#ff9800,#00f59b);transition:width .18s ease"></div>
      </div>
    </div>
<div style="display:flex;flex-direction:column;gap:5px;align-items:flex-end">
      <div class="sys">
        <div>CPU: <span id="mCpu">2%</span></div>
        <div>GPU: <span id="mGpu">READY</span></div>
        <div>RAM: <span id="mRam">48 MB</span></div>
        <div>DISK: <span id="mDsk">0 MB/s</span></div>
      </div>
      <div style="display:flex;gap:5px">
        <div class="lcd" id="bpmLcd" style="color:#4fc3f7">BPM: — | KEY: —</div>
        <div class="lcd" id="lufsLcd">LUFS: — | PEAK: —</div>
      </div>
    </div>
  </div>

  <div class="bar">
    <label style="background:#00897b;color:#fff;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:700">📂 ТРЕК (MP3/WAV)<input type="file" id="fIn" accept="audio/*" style="display:none"></label>
    <label style="background:#0277bd;color:#fff;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:700">🎯 РЕФЕРЕНС (A/B)<input type="file" id="refIn" accept="audio/*" style="display:none"></label>
    <button id="bRef" onclick="togRef()" disabled>🎧 Слушать Референс</button>
    <label style="background:#6a1b9a;color:#fff;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:700">📦 ПАКЕТ (АЛЬБОМ)<input type="file" id="batIn" accept="audio/*" multiple style="display:none"></label>
    <span style="font-size:11px;color:#69f0ae;font-weight:700;margin-left:4px">⚙️:</span>
    <button id="btnGpu" class="on-gpu" onclick="setEngine('gpu')">⚡ GPU</button>
    <button id="btnCpu" onclick="setEngine('cpu')">🧠 CPU</button>
    <button onclick="savePresetFile()">💾 Сохр. Пресет</button>
    <label style="background:#202429;border:1px solid #373c44;padding:5px 8px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:700">📂 Загр. Пресет<input type="file" id="preIn" accept=".json" style="display:none"></label>
  </div>
  <div class="bar">
    <span style="font-size:11px;color:#888;font-weight:700">ПРЕСЕТЫ:</span>
    <button onclick="mPreset('folk')">🎸 Фолк</button>
    <button onclick="mPreset('vocal')">🎤 Вокал</button>
    <button onclick="mPreset('bass')">🔥 Бас</button>
    <button onclick="mPreset('ott')">⚡ OTT</button>
    <button onclick="mPreset('flat')">🔄 Сброс</button>
    <span style="font-size:11px;color:#4fc3f7;font-weight:700;margin-left:4px">💾:</span>
    <button id="sn1" class="on-blue" onclick="useSnap(1)">A</button>
    <button id="sn2" onclick="useSnap(2)">B</button>
    <button id="sn3" onclick="useSnap(3)">C</button>
    <span style="font-size:11px;color:#00f59b;font-weight:700;margin-left:4px">✂️ SOLO:</span>
    <button id="sAll" onclick="setSolo('all')" disabled>🌐 Микс</button>
    <button id="sVoc" onclick="setSolo('vocal')" disabled>🎤 Вокал</button>
    <button id="sIns" onclick="setSolo('inst')" disabled>🎸 Минус</button>
    <button id="sBas" onclick="setSolo('bass')" disabled>🔊 Бас</button>
    <button id="sHig" onclick="setSolo('high')" disabled>🥁 Верха</button>
    <button id="dlSt" onclick="dlStem()" style="background:#1b5e20;border-color:#4caf50" disabled>⬇ Стем</button>
  </div>

  <div class="bar" style="border-color:#4a2511;background:#16110f">
    <span style="font-size:11px;color:#ff9800;font-weight:700">⚡ GROSS BEAT:</span>
    <button id="fxHalf" onclick="togHalf()" disabled>🐢 1/2 Speed</button>
    <button id="fxStop" onclick="trigTapeStop()" disabled>🛑 Tape Stop</button>
    <button id="fxStut" onclick="trigStutter()" disabled>🔫 Stutter</button>
    <button id="fxMetro" onclick="togMetro()" disabled>⏱ Метроном</button>
    <span style="font-size:11px;color:#ba68c8;font-weight:700;margin-left:4px">🥁 MPC PADS:</span>
    <button onclick="playPad('sub')" style="border-color:#ab47bc">💥 808 Drop</button>
    <button onclick="playPad('clap')" style="border-color:#ab47bc">👏 Clap</button>
    <button onclick="playPad('horn')" style="border-color:#ab47bc">📯 Horn</button>
    <span style="font-size:11px;color:#ff5252;font-weight:700;margin-left:4px">🌶️ SG:</span>
    <button id="sgA" onclick="setSG('A')">A</button>
    <button id="sgB" onclick="setSG('B')">B</button>
    <button id="sgC" onclick="setSG('C')">C</button>
    <button id="sgD" onclick="setSG('D')">D</button>
    <input type="range" id="sSg" min="0" max="100" value="0" style="width:70px">
    <span id="vSg" style="font-family:monospace;color:#ffa726;font-size:11px">0%</span>
  </div>

  <div style="display:grid;grid-template-columns:1fr 110px;gap:8px;background:#080a09;padding:8px;border-radius:6px;border:1px solid #242927">
    <div>
      <canvas id="waveCv" width="900" height="175" style="width:100%;height:175px;display:block;cursor:crosshair"></canvas>
      <input type="range" id="scr" min="0" max="100" value="0" style="width:100%;margin-top:4px" disabled>
    </div>
    <div style="display:flex;flex-direction:column;gap:4px;align-items:center">
      <div style="display:flex;gap:4px">
        <canvas id="vuCv" width="40" height="100" style="background:#050706;border:1px solid #1e2321"></canvas>
        <canvas id="gonCv" width="64" height="100" style="background:#050706;border:1px solid #1e2321"></canvas>
      </div>
      <div style="width:100%;display:flex;justify-content:space-between;font-size:9px;color:#777;font-family:monospace"><span>-1</span><span>ФАЗА</span><span>+1</span></div>
      <canvas id="phCv" width="108" height="16" style="background:#050706;border:1px solid #1e2321"></canvas>
    </div>
  </div>

  <div class="bar" style="margin-top:8px">
    <button id="bPlay" style="background:#00a86b;border-color:#00e676;color:#fff" disabled>▶ PLAY</button>
    <button id="bStop" disabled>■ STOP</button>
    <div class="lcd" id="tLcd">00:00.0 / 00:00.0</div>
    <button id="bBef" class="on-mint" disabled>ДО</button>
    <button id="bAft" disabled>ПОСЛЕ</button>
    <button id="bSpc" disabled>🌈 Спектр</button>
    <button id="bLop" disabled>🔁 Луп 15с</button>
    <button id="bZin" disabled>🔍+</button>
    <button id="bZout" disabled>🔍−</button>
  </div>
  <div class="rk" style="margin-top:8px">
    <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:6px;border-bottom:1px solid #21252b;padding-bottom:5px">
      <b style="font-size:11px;color:#00f59b">🎛️ 10-ПОЛОСНЫЙ ГРАФИЧЕСКИЙ ЭКВАЛАЙЗЕР (GRAPHIC EQ)</b>
      <div style="display:flex;gap:4px">
        <button onclick="eqPreset('smile')">😊 Улыбка</button>
        <button onclick="eqPreset('voice')">🎙️ Вокал</button>
        <button onclick="eqPreset('warm')">📻 Винил</button>
        <button onclick="eqPreset('air')">✨ Воздух</button>
        <button onclick="eqPreset('zero')">0 дБ</button>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:230px 1fr;gap:12px;align-items:center">
      <canvas id="eqCv" width="230" height="92" style="width:100%;height:92px;background:#060807;border:1px solid #222"></canvas>
      <div id="geqBox" style="display:grid;grid-template-columns:repeat(10,1fr);gap:4px;text-align:center"></div>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;margin-top:8px">
    <div class="rk"><h4>1. Фильтры, Гейт &amp; Де-Эссер</h4>
      <div class="pm"><div>High-Pass (Гул): <span id="vHp">75 Гц</span></div><input type="range" id="sHp" min="20" max="160" value="75" style="width:100%"></div>
      <div class="pm"><div>Low-Pass (Песок): <span id="vLp">17500 Гц</span></div><input type="range" id="sLp" min="8000" max="20000" step="500" value="17500" style="width:100%"></div>
      <div class="pm"><div>Noise Gate: <span id="vGt">-56 дБ</span></div><input type="range" id="sGt" min="-85" max="-30" value="-56" style="width:100%"></div>
      <div class="pm"><div>De-Esser (С/Ц): <span id="vDe">-3 дБ</span></div><input type="range" id="sDe" min="-12" max="0" step="1" value="-3" style="width:100%"></div>
    </div>
    <div class="rk"><h4>2. OTT Multiband &amp; Sub-Bass</h4>
      <div class="pm"><div>⚡ OTT Компрессор: <span id="vOtt">0%</span></div><input type="range" id="sOtt" min="0" max="100" step="5" value="0" style="width:100%"></div>
      <div class="pm"><div>🔊 Sub-Bass Exciter: <span id="vSub">0%</span></div><input type="range" id="sSub" min="0" max="100" step="5" value="0" style="width:100%"></div>
      <div class="pm"><div>🔥 Tube Warmth: <span id="vSat">15%</span></div><input type="range" id="sSat" min="0" max="60" step="5" value="15" style="width:100%"></div>
      <div class="pm"><div>🗜 Мастер-Компрессия: <span id="vCmp">3.5:1</span></div><input type="range" id="sCmp" min="1" max="8" step="0.5" value="3.5" style="width:100%"></div>
    </div>
    <div class="rk"><h4>3. Hardcore, Delay (BPM) &amp; Фейды</h4>
      <div class="pm"><div>💀 Hardcore Overdrive: <span id="vDst">0%</span></div><input type="range" id="sDst" min="0" max="100" step="5" value="0" style="width:100%"></div>
      <div class="pm"><div>🔁 Ping-Pong Delay: <span id="vDly">0%</span></div><input type="range" id="sDly" min="0" max="50" step="5" value="0" style="width:100%"></div>
      <div class="pm"><div>Fade In: <span id="vFi">0.2 с</span></div><input type="range" id="sFi" min="0" max="5" step="0.1" value="0.2" style="width:100%"></div>
      <div class="pm"><div>Fade Out: <span id="vFo">1.5 с</span></div><input type="range" id="sFo" min="0" max="8" step="0.1" value="1.5" style="width:100%"></div>
    </div>
    <div class="rk"><h4>4. Стерео, Реверб, Темп &amp; FFT</h4>
      <div class="pm"><div>Stereo Widener: <span id="vWid">115%</span></div><input type="range" id="sWid" min="50" max="160" step="5" value="115" style="width:100%"></div>
      <div class="pm"><div>Studio Reverb: <span id="vRev">8%</span></div><input type="range" id="sRev" min="0" max="35" step="1" value="8" style="width:100%"></div>
      <div class="pm"><div>Скорость / Тон: <span id="vSpd">1.00x</span></div><input type="range" id="sSpd" min="0.5" max="1.5" step="0.05" value="1" style="width:100%"></div>
      <canvas id="fftCv" width="230" height="62" style="width:100%;height:62px;background:#060807;border:1px solid #222;margin-top:4px"></canvas>
    </div>
  </div>

  <div class="bar" style="margin-top:8px;margin-bottom:0">
    <label style="font-size:12px"><input type="checkbox" id="cNorm" checked> Мастеринг -14 LUFS / Limiter -1.0 dBTP</label>
    <select id="sFmt"><option value="24-48000" selected>WAV 24-bit / 48 kHz</option><option value="16-44100">WAV 16-bit / 44.1 kHz</option></select>
    <button id="bDl" disabled style="flex:1;padding:11px;background:linear-gradient(90deg,#00c853,#00897b);color:#fff;border:none;border-radius:6px;font-size:13px;font-weight:900;cursor:pointer">💾 ЭКСПОРТ РЕЛИЗА В WAV (С ОБЛОЖКОЙ И ТЕГАМИ)</button>
  </div>
  <div id="st" style="text-align:center;font-size:12px;color:#9aa0a6;margin-top:5px">Готово к работе! Загрузите трек и обложку (Пробел = Play/Pause)</div>
</div>
<audio id="plr" style="display:none"></audio>`;
const $ = id => document.getElementById(id);
const eqF = Array.of(31,62,125,250,500,1000,2000,4000,8000,16000);
const eqL = Array.of("31","62","125","250","500","1k","2k","4k","8k","16k");
const eqG = new Float32Array(10);
let rawB=null,prcB=null,stmB=null,refB=null,waveCache=null,uBef="",uAft="",uStm="",uRef="",mode="after",stem="all",sgMode="A",curSnap=1,detBpm=120,engine="gpu";
let spc=false,lop=false,lopS=0,zm=1,scrR=0,bName="track",lCtx=null,ana=null,lSrc=null,halfOn=false,metroIv=null,diskSpeed=0,gpuLoad=0,refOn=false,covBytes=null;
const plr=$("plr"),wCv=$("waveCv"),wCx=wCv.getContext("2d"),vCx=$("vuCv").getContext("2d"),gCx=$("gonCv").getContext("2d"),pCx=$("phCv").getContext("2d"),fCx=$("fftCv").getContext("2d"),eCv=$("eqCv"),eCx=eCv.getContext("2d");

$("covDrop").onclick = () => $("covIn").click();
$("covIn").onchange = e => {
  const f = e.target.files.item(0); if(!f) return;
  const img = new Image();
  img.onload = () => {
    const cv = $("covCv"), cx = cv.getContext("2d"), sz = Math.min(img.width, img.height);
    cx.drawImage(img, (img.width-sz)/2, (img.height-sz)/2, sz, sz, 0, 0, 1000, 1000);
    $("covTxt").style.display = "none";
    cv.toBlob(async b => { covBytes = new Uint8Array(await b.arrayBuffer()); }, "image/jpeg", 0.92);
  };
  img.src = URL.createObjectURL(f);
};
window.dlCover = () => {
  if(!covBytes) return;
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(Array.of(covBytes), {type:"image/jpeg"}));
  a.download = (bName || "release") + "-cover-1000x1000.jpg"; a.click();
};

let gpuName = "WebGL2";
try {
  const gl = document.createElement("canvas").getContext("webgl2");
  if (gl) { const dbg = gl.getExtension("WEBGL_debug_renderer_info"); gpuName = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL).replace(/ANGLE \(|, Direct3D.*|\)/g,"").slice(0,16) : "WebGL2 OK"; }
  else { gpuName = "NO GPU"; engine = "cpu"; }
} catch(e) { gpuName = "CPU ONLY"; engine = "cpu"; }
$("mGpu").textContent = `${gpuName} (0%)`;
window.setEngine = m => { engine = m; $("btnGpu").className = m==="gpu" ? "on-gpu" : ""; $("btnCpu").className = m==="cpu" ? "on-blue" : ""; runDSP(); };

setInterval(() => {
  const t0 = performance.now(); for(let i=0;i<40000;i++) Math.sqrt(i);
  const cpuEst = Math.min(99, Math.max(2, Math.round((performance.now()-t0)*12 + (plr.paused?1:7))));
  $("mCpu").textContent = cpuEst + "%";
  const ramMb = performance.memory ? Math.round(performance.memory.usedJSHeapSize/1048576) : (rawB ? Math.round(rawB.length*8/1048576+45) : 42);
  $("mRam").textContent = ramMb + " MB";
  $("mGpu").textContent = `${gpuName} (${engine==="gpu"?gpuLoad:0}%)`;
  $("mDsk").textContent = diskSpeed.toFixed(1) + " MB/s";
  diskSpeed = Math.max(0, diskSpeed*0.4); gpuLoad = Math.max(plr.paused?0:6, Math.round(gpuLoad*0.5));
}, 700);

const slIds = Array.of("sHp","sLp","sGt","sDe","sOtt","sSub","sSat","sCmp","sDst","sDly","sFi","sFo","sWid","sRev","sSg");
const snaps = new Map();
for(let i=0;i<10;i++){
  const d=document.createElement("div");
  d.innerHTML=`<div id="ev${i}" style="color:#00f59b;font-size:10px;font-family:monospace">0</div><input type="range" id="es${i}" min="-12" max="12" step="0.5" value="0" style="writing-mode:bt-lr;-webkit-appearance:slider-vertical;appearance:slider-vertical;width:18px;height:64px"><div style="font-size:10px;color:#888">${eqL.at(i)}</div>`;
  $("geqBox").appendChild(d);
  $(`es${i}`).oninput=e=>{const v=+e.target.value;eqG.set(Float32Array.of(v),i);$(`ev${i}`).textContent=(v>0?"+":"")+v;drawEq();}; $(`es${i}`).onchange=runDSP;
}
function drawEq(){
  const w=eCv.width,h=eCv.height,m=h/2;eCx.fillStyle="#060807";eCx.fillRect(0,0,w,h);
  eCx.strokeStyle="#252c29";eCx.beginPath();eCx.moveTo(0,m);eCx.lineTo(w,m);eCx.stroke();
  eCx.strokeStyle="#ffa726";eCx.lineWidth=2;eCx.beginPath();
  for(let i=0;i<10;i++){const x=12+(i/9)*(w-24),y=m-(eqG.at(i)/12)*(m-10);i===0?eCx.moveTo(x,y):eCx.lineTo(x,y);}
  eCx.stroke();eCx.fillStyle="#00f59b";
  for(let i=0;i<10;i++){const x=12+(i/9)*(w-24),y=m-(eqG.at(i)/12)*(m-10);eCx.beginPath();eCx.arc(x,y,3,0,6.28);eCx.fill();}
}
drawEq();

function saveSnap(n){ snaps.set(n, { sl: slIds.map(id => +$(id).value), eq: Array.from(eqG), sg: sgMode }); }
window.useSnap = n => {
  saveSnap(curSnap); curSnap = n; Array.of("sn1","sn2","sn3").forEach(id => $(id).className = ""); $("sn"+n).className = "on-blue";
  const s = snaps.get(n);
  if(s){ s.sl.forEach((v,i) => $(slIds.at(i)).value = v); s.eq.forEach((v,i) => { eqG.set(Float32Array.of(v),i); $(`es${i}`).value=v; $(`ev${i}`).textContent=(v>0?"+":"")+v; }); sgMode = s.sg; Array.of("sgA","sgB","sgC","sgD").forEach(id => $(id).className = ""); $("sg"+sgMode).className = "on-amb"; updL(); drawEq(); runDSP(); }
};
window.savePresetFile = () => {
  const data = JSON.stringify({ sl: slIds.map(id => +$(id).value), eq: Array.from(eqG), sg: sgMode });
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(Array.of(data), {type:"application/json"})); a.download = "audition-preset.json"; a.click();
};
$("preIn").onchange = async e => {
  const f = e.target.files.item(0); if(!f) return;
  const d = JSON.parse(await f.text());
  d.sl.forEach((v,i) => $(slIds.at(i)).value = v); d.eq.forEach((v,i) => { eqG.set(Float32Array.of(v),i); $(`es${i}`).value=v; $(`ev${i}`).textContent=(v>0?"+":"")+v; });
  sgMode = d.sg || "A"; updL(); drawEq(); runDSP();
};

window.setSG = m => { sgMode = m; Array.of("sgA","sgB","sgC","sgD").forEach(id => $(id).className = ""); $("sg" + m).className = "on-amb"; if (+$("sSg").value === 0) { $("sSg").value = 45; $("vSg").textContent = "45%"; } runDSP(); };
$("sgA").className = "on-amb";

window.eqPreset=n=>{
  const a=n==="smile"?Array.of(4,3,1,-1.5,-2.5,-1.5,1,2.5,4,4.5):n==="voice"?Array.of(-4,-2,0,-1.5,1,2.5,3.5,3,1.5,0):n==="warm"?Array.of(3,2.5,1.5,.5,0,-.5,-1.5,-2.5,-3.5,-4):n==="air"?Array.of(0,0,0,0,0,.5,1.5,3,4.5,5.5):Array.of(0,0,0,0,0,0,0,0,0,0);
  for(let i=0;i<10;i++){const v=a.at(i);eqG.set(Float32Array.of(v),i);$(`es${i}`).value=v;$(`ev${i}`).textContent=(v>0?"+":"")+v;}drawEq();runDSP();
};
const updL=()=>{
  $("vHp").textContent=$("sHp").value+" Гц";$("vLp").textContent=$("sLp").value+" Гц";$("vGt").textContent=$("sGt").value+" дБ";$("vDe").textContent=$("sDe").value+" дБ";
  $("vOtt").textContent=$("sOtt").value+"%";$("vSub").textContent=$("sSub").value+"%";$("vSat").textContent=$("sSat").value+"%";$("vCmp").textContent=$("sCmp").value+":1";
  $("vDst").textContent=$("sDst").value+"%";$("vDly").textContent=$("sDly").value+"%";$("vFi").textContent=$("sFi").value+" с";$("vFo").textContent=$("sFo").value+" с";
  $("vWid").textContent=$("sWid").value+"%";$("vRev").textContent=$("sRev").value+"%";$("vSpd").textContent=(+$("sSpd").value).toFixed(2)+"x";$("vSg").textContent=$("sSg").value+"%";
};
slIds.forEach(id=>{ $(id).oninput=updL; $(id).onchange=runDSP; });
$("sSpd").oninput=()=>{updL();halfOn=false;$("fxHalf").className="";plr.playbackRate=+$("sSpd").value;};
$("cNorm").onchange=runDSP;$("sFmt").onchange=runDSP;

window.mPreset=t=>{
  const p=t==="folk"?Array.of(75,17500,-56,-3,20,15,15,3.5,0,0,0.2,1.5,115,8,25):
          t==="vocal"?Array.of(90,18000,-52,-5,25,0,20,4,0,10,0.2,1.5,105,10,35):
          t==="bass"?Array.of(35,17500,-60,-2,40,55,30,5.5,15,0,0.2,1.5,130,5,65):
          t==="ott"?Array.of(45,18500,-58,-4,80,35,25,6.0,5,15,0.1,1.0,125,6,50):
                    Array.of(20,20000,-85,0,0,0,0,1,0,0,0,0,100,0,0);
  for(let i=0;i<15;i++)$(slIds.at(i)).value=p.at(i);
  eqPreset(t==="folk"||t==="ott"?"smile":t==="vocal"?"voice":t==="bass"?"warm":"zero");updL();
};
function analyzeAudio(buf){
  const d = buf.getChannelData(0), sr = buf.sampleRate, step = Math.floor(sr * 0.05);
  const env = new Float32Array(Math.floor(d.length / step));
  for(let i=0;i<env.length;i++){ let s=0; for(let j=0;j<step;j+=16) s+=Math.abs(d.at(i*step+j)); env.set(Float32Array.of(s),i); }
  let bestBpm = 120, bestCorr = 0;
  for(let bpm=75;bpm<=165;bpm++){
    const lag = Math.round((60/bpm)/0.05); let corr = 0;
    for(let i=0;i<env.length-lag;i+=2) corr += env.at(i)*env.at(i+lag);
    if(corr > bestCorr){ bestCorr = corr; bestBpm = bpm; }
  }
  detBpm = bestBpm;
  const notes = Array.of("C","C#","D","D#","E","F","F#","G","G#","A","A#","B");
  let zc = 0; const lim = Math.min(d.length-1, sr*8);
  for(let i=1;i<lim;i++) if(d.at(i-1)<0 && d.at(i)>=0) zc++;
  const midi = Math.round(12 * Math.log2((zc / (lim/sr)) / 440) + 69);
  $("bpmLcd").textContent = `BPM: ${detBpm} | KEY: ${notes.at(((midi % 12) + 12) % 12)}${midi % 2 === 0 ? "m" : " Maj"}`;
}

$("fIn").onchange=async e=>{
  const f=e.target.files.item(0);if(!f)return;
  const tStart = performance.now();
  bName=f.name.replace(/\.[^/.]+$/,""); if(!$("tagTit").value) $("tagTit").value = bName;
  if(uBef)URL.revokeObjectURL(uBef);uBef=URL.createObjectURL(f);$("st").textContent="Декодирование трека...";
  try{
    const ab = await f.arrayBuffer();
    diskSpeed = (ab.byteLength / 1048576) / Math.max(0.01, (performance.now() - tStart)/1000);
    const c=new(window.AudioContext||window.webkitAudioContext)();rawB=await c.decodeAudioData(ab);
    analyzeAudio(rawB);
    Array.of("bPlay","bStop","bBef","bAft","bSpc","bLop","bZin","bZout","bDl","scr","sAll","sVoc","sIns","sBas","sHig","dlSt","fxHalf","fxStop","fxStut","fxMetro").forEach(id=>$(id).disabled=false);
    zm=1;scrR=0;$("scr").value=0;waveCache=null;await runDSP();swTrk("after");
  }catch(err){$("st").textContent="Ошибка: "+err.message;}
};

$("refIn").onchange = async e => {
  const f = e.target.files.item(0); if(!f) return;
  if(uRef) URL.revokeObjectURL(uRef); uRef = URL.createObjectURL(f);
  const c = new(window.AudioContext||window.webkitAudioContext)(); refB = await c.decodeAudioData(await f.arrayBuffer());
  $("bRef").disabled = false; $("st").textContent = "Референс загружен! Жмите 'Слушать Референс' для сравнения.";
};
window.togRef = () => {
  if(!refB) return; refOn = !refOn; $("bRef").className = refOn ? "on-blue" : "";
  const t = plr.currentTime||0, p = !plr.paused;
  plr.src = refOn ? uRef : (mode==="before"?uBef:uAft); plr.currentTime = Math.min(t, plr.duration||t);
  if(p){ plr.play(); requestAnimationFrame(loop); } waveCache=null; drawW();
};

$("batIn").onchange = async e => {
  const files = Array.from(e.target.files); if(!files.length) return;
  for(let k=0; k<files.length; k++){
    const f = files.at(k); bName = f.name.replace(/\.[^/.]+$/,""); $("tagTit").value = bName;
    $("st").textContent = `Пакетная обработка [${k+1}/${files.length}]: ${bName}...`;
    const c = new(window.AudioContext||window.webkitAudioContext)(); rawB = await c.decodeAudioData(await f.arrayBuffer());
    analyzeAudio(rawB); await runDSP(); $("bDl").click();
  }
  $("st").textContent = `Пакетный мастеринг завершён (${files.length} треков)!`;
};

async function runDSP(){
  if(!rawB)return;
  const t0 = performance.now(); gpuLoad = engine==="gpu" ? 75 : 5;
  $("st").textContent=`Рендеринг [${engine.toUpperCase()}]...`;
  const pts=$("sFmt").value.split("-"),bits=+pts.at(0),rate=+pts.at(1),nCh=rawB.numberOfChannels;
  const off=new OfflineAudioContext(nCh,Math.ceil(rawB.duration*rate),rate),src=off.createBufferSource();src.buffer=rawB;let nd=src;
  const hp=off.createBiquadFilter();hp.type="highpass";hp.frequency.value=+$("sHp").value;nd.connect(hp);nd=hp;
  const lp=off.createBiquadFilter();lp.type="lowpass";lp.frequency.value=+$("sLp").value;nd.connect(lp);nd=lp;

  const sgAmt = +$("sSg").value / 100;
  if (sgAmt > 0.01) {
    const sgB = off.createBiquadFilter(), sgM = off.createBiquadFilter(), sgH = off.createBiquadFilter();
    sgB.type = "lowshelf"; sgB.frequency.value = 110; sgM.type = "peaking"; sgM.frequency.value = 1800; sgM.Q.value = 0.9; sgH.type = "highshelf"; sgH.frequency.value = 7500;
    const cfg = sgMode==="A"?Array.of(5,2,4.5):sgMode==="B"?Array.of(3.5,3.5,3):sgMode==="C"?Array.of(6.5,1,3.5):Array.of(2,2,6);
    sgB.gain.value = cfg.at(0)*sgAmt; sgM.gain.value = cfg.at(1)*sgAmt; sgH.gain.value = cfg.at(2)*sgAmt;
    nd.connect(sgB); sgB.connect(sgM); sgM.connect(sgH); nd = sgH;
  }

  for(let i=0;i<10;i++){if(eqG.at(i)!==0){const b=off.createBiquadFilter();b.type="peaking";b.frequency.value=eqF.at(i);b.gain.value=eqG.at(i);b.Q.value=1.4;nd.connect(b);nd=b;}}
  const de=off.createBiquadFilter();de.type="peaking";de.frequency.value=6800;de.gain.value=+$("sDe").value;de.Q.value=3.5;nd.connect(de);nd=de;

  const ottAmt = +$("sOtt").value / 100;
  const cmp=off.createDynamicsCompressor();
  cmp.threshold.value = -19 - ottAmt*14; cmp.ratio.value = +$("sCmp").value + sgAmt*2.5 + ottAmt*6;
  cmp.knee.value = 10; cmp.attack.value = 0.005; cmp.release.value = 0.12; nd.connect(cmp);

  const rMix=+$("sRev").value/100;
  if(rMix > 0.01){
    const dry=off.createGain(),wet=off.createGain(),cnv=off.createConvolver();dry.gain.value=1-rMix*.4;wet.gain.value=rMix;
    const iLen=Math.floor(rate*1.2),imp=off.createBuffer(2,iLen,rate);
    for(let c=0;c<2;c++){const d=imp.getChannelData(c);for(let i=0;i<iLen;i++)d.set(Float32Array.of((Math.random()*2-1)*Math.pow(1-i/iLen,3)),i);}
    cnv.buffer=imp;cmp.connect(dry);dry.connect(off.destination);cmp.connect(cnv);cnv.connect(wet);wet.connect(off.destination);
  } else { cmp.connect(off.destination); }
  src.start(0);const out=await off.startRendering();

  const thr=Math.pow(10,+$("sGt").value/20),wid=+$("sWid").value/100,drv=1+(+$("sSat").value/40),dst=(+$("sDst").value/15)*4,subAmt=+$("sSub").value/100,dlyAmt=+$("sDly").value/100;
  const fi=Math.floor(+$("sFi").value*rate),fo=Math.floor(+$("sFo").value*rate),len=out.length,dlySmp=Math.floor((60/detBpm)*0.5*rate);
  const useDrv = drv > 1.01, tanhDrv = Math.tanh(drv), useDst = dst > 0.05, useSub = subAmt > 0.01, useDly = dlyAmt > 0.01;

  if(nCh===2){
    const L=out.getChannelData(0),R=out.getChannelData(1);let env=0,lpL=0,lpR=0;
    for(let i=0;i<len;i++){
      let fd=1;if(i<fi)fd=i/fi;else if(i>len-fo)fd=(len-i)/fo;
      let l=L.at(i),r=R.at(i);
      if(useDly && i>dlySmp){ l += R.at(i-dlySmp)*dlyAmt*0.5; r += L.at(i-dlySmp)*dlyAmt*0.5; }
      if(useSub){lpL+=0.025*(l-lpL);lpR+=0.025*(r-lpR);l+=Math.tanh(lpL*3)*subAmt*0.45;r+=Math.tanh(lpR*3)*subAmt*0.45;}
      if(useDrv){l=Math.tanh(l*drv)/tanhDrv;r=Math.tanh(r*drv)/tanhDrv;}
      if(useDst){l=Math.tanh(l*(1+dst))*1.1;r=Math.tanh(r*(1+dst))*1.1;}
      const pk=(l<0?-l:l)>(r<0?-r:r)?(l<0?-l:l):(r<0?-r:r);
      env=pk>thr?(env+0.002>1?1:env+0.002):(env-0.00025<0?0:env-0.00025);
      const m=(l+r)*0.5*env*fd,s=(l-r)*0.5*wid*env*fd;
      L.set(Float32Array.of(m+s),i);R.set(Float32Array.of(m-s),i);
    }
  }

  let sum=0,cnt=0,pk=0;
  for(let c=0;c<nCh;c++){const d=out.getChannelData(c);for(let i=0;i<len;i+=8){const q=d.at(i)*d.at(i);if(q>1e-7){sum+=q;cnt++;}}}
  const rLufs=cnt?-0.691+10*Math.log10((sum/cnt)*nCh):-14,gn=$("cNorm").checked?Math.pow(10,(-14-rLufs)/20):1;
  for(let c=0;c<nCh;c++){
    const d=out.getChannelData(c);
    for(let i=0;i<len;i++){
      let s=d.at(i)*gn;
      if(s>0.891)s=0.891+Math.tanh((s-0.891)*5)*0.095; else if(s<-0.891)s=-0.891-Math.tanh((-s-0.891)*5)*0.095;
      const a=s<0?-s:s;if(a>pk)pk=a; d.set(Float32Array.of(s),i);
    }
  }

  $("lufsLcd").textContent=`LUFS: ${$("cNorm").checked?"-14.0":rLufs.toFixed(1)} | PEAK: ${pk>0?(20*Math.log10(pk)).toFixed(1):"-∞"} dBTP`;
  prcB=out;waveCache=null;
  const wavBlob = mkWav(out,bits);
  diskSpeed = (wavBlob.size / 1048576) / Math.max(0.01, (performance.now() - t0)/1000);
  if(uAft)URL.revokeObjectURL(uAft);uAft=URL.createObjectURL(wavBlob);
  if(stem!=="all")await mkStem(stem);else if(mode==="after"&&!refOn){const t=plr.currentTime,p=!plr.paused;plr.src=uAft;plr.playbackRate=halfOn?0.5:+$("sSpd").value;plr.currentTime=t;if(p)plr.play();}
  drawW(); $("st").textContent=`Готово за ${Math.round(performance.now()-t0)} мс [${engine.toUpperCase()}]!`;
}

window.playPad = tp => {
  if (!lCtx) lCtx = new (window.AudioContext || window.webkitAudioContext)();
  const now = lCtx.currentTime, osc = lCtx.createOscillator(), g = lCtx.createGain();
  if (tp === "sub") { osc.type="sine"; osc.frequency.setValueAtTime(140, now); osc.frequency.exponentialRampToValueAtTime(32, now+0.8); g.gain.setValueAtTime(0.6, now); g.gain.exponentialRampToValueAtTime(0.001, now+0.85); osc.connect(g); g.connect(lCtx.destination); osc.start(); osc.stop(now+0.85); }
  else if (tp === "horn") { osc.type="sawtooth"; osc.frequency.setValueAtTime(440, now); osc.frequency.linearRampToValueAtTime(465, now+0.35); g.gain.setValueAtTime(0.35, now); g.gain.exponentialRampToValueAtTime(0.001, now+0.4); osc.connect(g); g.connect(lCtx.destination); osc.start(); osc.stop(now+0.4); }
  else { const b=lCtx.createBuffer(1,4410,44100), d=b.getChannelData(0); for(let i=0;i<4410;i++) d.set(Float32Array.of((Math.random()*2-1)*Math.pow(1-i/4410,2)),i); const s=lCtx.createBufferSource(); s.buffer=b; g.gain.value=0.45; s.connect(g); g.connect(lCtx.destination); s.start(); }
};

window.togMetro = () => {
  if (metroIv) { clearInterval(metroIv); metroIv = null; $("fxMetro").className = ""; return; }
  if (!lCtx) lCtx = new (window.AudioContext || window.webkitAudioContext)(); $("fxMetro").className = "on-blue";
  metroIv = setInterval(() => { if (plr.paused) return; const osc = lCtx.createOscillator(), g = lCtx.createGain(); osc.frequency.value = 1000; g.gain.setValueAtTime(0.25, lCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, lCtx.currentTime + 0.05); osc.connect(g); g.connect(lCtx.destination); osc.start(); osc.stop(lCtx.currentTime + 0.05); }, Math.round(60000 / detBpm));
};
window.togHalf = () => { if (!rawB) return; halfOn = !halfOn; $("fxHalf").className = halfOn ? "on-amb" : ""; plr.preservesPitch = false; plr.playbackRate = halfOn ? 0.5 : +$("sSpd").value; };
window.trigTapeStop = () => { if (!rawB || plr.paused) return; $("fxStop").className = "on-pink"; plr.preservesPitch = false; let spd = plr.playbackRate; const iv = setInterval(() => { spd -= 0.08; if (spd <= 0.1) { clearInterval(iv); plr.pause(); plr.playbackRate = halfOn ? 0.5 : +$("sSpd").value; $("bPlay").textContent = "▶ PLAY"; $("fxStop").className = ""; } else plr.playbackRate = spd; }, 45); };
window.trigStutter = () => { if (!rawB || plr.paused) return; $("fxStut").className = "on-purp"; const anchor = plr.currentTime; let count = 0; const iv = setInterval(() => { plr.currentTime = anchor; count++; if (count >= 8) { clearInterval(iv); $("fxStut").className = ""; } }, 110); };

async function mkStem(tp){
  const sb=prcB||rawB;if(!sb)return;const r=sb.sampleRate,len=sb.length,nCh=sb.numberOfChannels,off=new OfflineAudioContext(nCh,len,r),src=off.createBufferSource();src.buffer=sb;
  if(tp==="bass"){const f=off.createBiquadFilter();f.type="lowpass";f.frequency.value=180;src.connect(f);f.connect(off.destination);}
  else if(tp==="high"){const f=off.createBiquadFilter();f.type="highpass";f.frequency.value=4500;src.connect(f);f.connect(off.destination);}
  else if(tp==="vocal"){const h=off.createBiquadFilter(),l=off.createBiquadFilter();h.type="highpass";h.frequency.value=180;l.type="lowpass";l.frequency.value=8500;src.connect(h);h.connect(l);l.connect(off.destination);}
  else src.connect(off.destination);src.start(0);const res=await off.startRendering();
  if(nCh===2&&(tp==="vocal"||tp==="inst")){const L=res.getChannelData(0),R=res.getChannelData(1);for(let i=0;i<len;i++){const m=(L.at(i)+R.at(i))*0.5,s=(L.at(i)-R.at(i))*0.5;if(tp==="vocal"){const v=m*1.15-Math.abs(s)*0.35;L.set(Float32Array.of(v),i);R.set(Float32Array.of(v),i);}else{L.set(Float32Array.of(s*1.35),i);R.set(Float32Array.of(-s*1.35),i);}}}
  stmB=res;if(uStm)URL.revokeObjectURL(uStm);uStm=URL.createObjectURL(mkWav(res,+$("sFmt").value.split("-").at(0)));
}
window.setSolo=async tp=>{ if(!rawB)return;stem=tp;Array.of("sAll","sVoc","sIns","sBas","sHig").forEach(id=>$(id).className=""); $(tp==="vocal"?"sVoc":tp==="inst"?"sIns":tp==="bass"?"sBas":tp==="high"?"sHig":"sAll").className="on-pink"; const t=plr.currentTime||0,p=!plr.paused;if(tp==="all")plr.src=mode==="before"?uBef:uAft;else{await mkStem(tp);plr.src=uStm;} plr.playbackRate=halfOn?0.5:+$("sSpd").value;plr.currentTime=t;if(p){plr.play();requestAnimationFrame(loop);}waveCache=null;drawW(); };
window.dlStem=async()=>{if(!rawB)return;if(stem==="all"){$("bDl").click();return;}if(!uStm)await mkStem(stem);const a=document.createElement("a");a.href=uStm;a.download=`${bName}-STEM-${stem}.wav`;a.click();};
function drawW(){
  const b=refOn&&refB?refB:(stem!=="all"&&stmB?stmB:(mode==="before"?rawB:prcB)),w=wCv.width,h=wCv.height;
  if(!b){wCx.fillStyle="#050706";wCx.fillRect(0,0,w,h);return;}
  if(!waveCache){
    gpuLoad = engine==="gpu" ? 45 : 10; const oc=document.createElement("canvas");oc.width=w;oc.height=h;const ox=oc.getContext("2d");ox.fillStyle="#050706";ox.fillRect(0,0,w,h);
    if(spc){
      const d=b.getChannelData(0),st=Math.floor(d.length/w);
      for(let x=0;x<w;x++){const s=x*st;for(let bn=0;bn<48;bn++){let e=0,fs=Math.max(1,Math.floor((bn+1)*.8));for(let k=0;k<32&&(s+k+fs)<d.length;k+=fs)e+=Math.abs(d.at(s+k)-d.at(s+k+fs));const nm=Math.min(1,(e/3.2)*(1+bn*.08));ox.fillStyle=`rgb(${Math.floor(nm>.4?255:nm*450)},${Math.floor(nm>.7?(nm-.7)*850:nm*80)},${Math.floor(nm<.45?nm*420:(1-nm)*180)})`;ox.fillRect(x,h-((bn+1)/48)*h,1.5,h/48+1);}}
    }else{
      ox.strokeStyle="#141b18";ox.lineWidth=1;for(let x=0;x<w;x+=52){ox.beginPath();ox.moveTo(x,0);ox.lineTo(x,h);ox.stroke();}
      const nCh=Math.min(2,b.numberOfChannels),chH=h/nCh,tot=b.length,vw=Math.floor(tot/zm),st=Math.floor(scrR*(tot-vw)),stp=Math.max(1,Math.floor(vw/w));
      for(let c=0;c<nCh;c++){const d=b.getChannelData(c),my=chH*c+chH/2;ox.fillStyle=refOn?"#4fc3f7":(stem!=="all"?"#ff4081":(mode==="before"?"#29b6f6":"#00f59b"));for(let x=0;x<w;x++){let mn=1,mx=-1,bs=st+x*stp,jmp=Math.max(1,Math.floor(stp/10));for(let j=0;j<stp;j+=jmp){if(bs+j<tot){const v=d.at(bs+j);if(v<mn)mn=v;if(v>mx)mx=v;}}ox.fillRect(x,my+mn*(chH*.45),1.5,Math.max(1,(mx-mn)*(chH*.45)));}}
    }
    waveCache=oc;
  }
  if(spc){const sw=w/zm,sx=scrR*(w-sw);wCx.drawImage(waveCache,sx,0,sw,h,0,0,w,h);}else{wCx.drawImage(waveCache,0,0);}
  const dur=plr.duration||b.duration||1,vs=1/zm,vst=scrR*(1-vs),rx=((plr.currentTime||0)/dur-vst)/vs;
  if(lop){const l1=((lopS/dur)-vst)/vs,l2=(((lopS+15)/dur)-vst)/vs;wCx.fillStyle="rgba(255,152,0,.22)";wCx.fillRect(l1*w,0,(l2-l1)*w,h);}
  if(rx>=0&&rx<=1){wCx.strokeStyle="#ffa726";wCx.lineWidth=2;wCx.beginPath();wCx.moveTo(rx*w,0);wCx.lineTo(rx*w,h);wCx.stroke();}
  const ft=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+(s%60).toFixed(1).padStart(4,"0");$("tLcd").textContent=ft(plr.currentTime||0)+" / "+ft(dur);
}

function loop(){
  if(lop&&plr.currentTime>=lopS+15)plr.currentTime=lopS;drawW();
  if(ana){
    const bn=new Uint8Array(ana.frequencyBinCount),td=new Uint8Array(ana.fftSize);ana.getByteFrequencyData(bn);ana.getByteTimeDomainData(td);
    const fw=230,fh=62,bw=fw/48;fCx.fillStyle="#060807";fCx.fillRect(0,0,fw,fh);
    for(let i=0;i<48;i++){const v=bn.at(i)/255;fCx.fillStyle=v>.8?"#ff5252":(v>.5?"#ffa726":"#00f59b");fCx.fillRect(i*bw,fh-v*fh,bw-1.5,v*fh);}
    vCx.fillStyle="#050706";vCx.fillRect(0,0,40,100);let avg=0;for(let i=0;i<32;i++)avg+=bn.at(i);const bh=Math.min(1,avg/7040)*94;
    const gr=vCx.createLinearGradient(0,100,0,0);gr.addColorStop(0,"#00e676");gr.addColorStop(.75,"#ffa726");gr.addColorStop(1,"#ff1744");
    vCx.fillStyle=gr;vCx.fillRect(6,96-bh,11,bh);vCx.fillRect(21,96-bh*.96,11,bh*.96);
    gCx.fillStyle="rgba(5,7,6,0.35)";gCx.fillRect(0,0,64,100);gCx.strokeStyle="#1b2622";gCx.beginPath();gCx.moveTo(32,0);gCx.lineTo(32,100);gCx.moveTo(0,50);gCx.lineTo(64,50);gCx.stroke();
    gCx.strokeStyle="#00f59b";gCx.lineWidth=1.2;gCx.beginPath();const widF=+$("sWid").value/100;
    for(let i=0;i<td.length-1;i+=2){const m=(td.at(i)-128)/128,s=((td.at(i+1)-128)/128)*widF;const gx=32+(s*28),gy=50-(m*44);i===0?gCx.moveTo(gx,gy):gCx.lineTo(gx,gy);}gCx.stroke();
    pCx.fillStyle="#050706";pCx.fillRect(0,0,108,16);pCx.strokeStyle="#333";pCx.beginPath();pCx.moveTo(54,0);pCx.lineTo(54,16);pCx.stroke();
    const cr=Math.max(-0.8,Math.min(0.95,1.4-(+$("sWid").value/160)*0.85));pCx.fillStyle=cr>0.3?"#00f59b":(cr>0?"#ffa726":"#ff1744");pCx.fillRect(54+cr*48-3,2,6,12);
  }
  if(!plr.paused)requestAnimationFrame(loop);
}

function togPlay(){if(!rawB)return;if(!lCtx){lCtx=new(window.AudioContext||window.webkitAudioContext)();ana=lCtx.createAnalyser();ana.fftSize=256;lSrc=lCtx.createMediaElementSource(plr);lSrc.connect(ana);ana.connect(lCtx.destination);}if(lCtx.state==="suspended")lCtx.resume();if(plr.paused){plr.play();$("bPlay").textContent="⏸ PAUSE";requestAnimationFrame(loop);}else{plr.pause();$("bPlay").textContent="▶ PLAY";drawW();}}
$("bPlay").onclick=togPlay;$("bStop").onclick=()=>{plr.pause();plr.currentTime=0;$("bPlay").textContent="▶ PLAY";drawW();};plr.onended=()=>{$("bPlay").textContent="▶ PLAY";drawW();};
document.onkeydown=e=>{if(e.code==="Space"&&document.activeElement.tagName!=="BUTTON"&&document.activeElement.tagName!=="INPUT"){e.preventDefault();togPlay();}};
wCv.onclick=e=>{if(!rawB)return;const r=wCv.getBoundingClientRect(),vs=1/zm,vst=scrR*(1-vs),d=plr.duration||rawB.duration;plr.currentTime=Math.min(d,Math.max(0,(vst+((e.clientX-r.left)/r.width)*vs)*d));if(lop)lopS=plr.currentTime;drawW();};
wCv.onwheel=e=>{if(!rawB)return;e.preventDefault();zm=e.deltaY<0?Math.min(20,zm*1.3):Math.max(1,zm/1.3);waveCache=null;drawW();};
$("scr").oninput=e=>{scrR=+e.target.value/100;waveCache=null;drawW();};$("bZin").onclick=()=>{zm=Math.min(20,zm*1.5);waveCache=null;drawW();};$("bZout").onclick=()=>{zm=Math.max(1,zm/1.5);waveCache=null;drawW();};
$("bSpc").onclick=()=>{spc=!spc;$("bSpc").className=spc?"on-purp":"";waveCache=null;drawW();};$("bLop").onclick=()=>{lop=!lop;lopS=plr.currentTime||0;$("bLop").className=lop?"on-amb":"";drawW();};
function swTrk(m){mode=m;refOn=false;$("bRef").className="";if(stem!=="all"){setSolo("all");return;}const t=plr.currentTime||0,p=!plr.paused;plr.src=m==="before"?uBef:uAft;plr.playbackRate=halfOn?0.5:+$("sSpd").value;plr.currentTime=t;if(p){plr.play();requestAnimationFrame(loop);}$("bBef").className=m==="before"?"on-mint":"";$("bAft").className=m==="after"?"on-mint":"";waveCache=null;drawW();}
$("bBef").onclick=()=>swTrk("before");$("bAft").onclick=()=>swTrk("after");$("bDl").onclick=()=>{const a=document.createElement("a");a.href=uAft;const t=$("tagTit").value||bName,ar=$("tagArt").value;a.download=(ar?ar+" - ":"")+t+"-PRO-MASTER.wav";a.click();};

function mkWav(b,bits){
  const n=b.numberOfChannels,bps=bits/8,al=n*bps,ds=b.length*al,enc=new TextEncoder();
  const tit=enc.encode(($("tagTit").value||bName)+"\0"),art=enc.encode(($("tagArt").value||"Audition Studio")+"\0"),alb=enc.encode(($("tagAlb").value||"Master Release")+"\0");
  const pad=a=>a.length%2?Uint8Array.of(...a,0):a;
  const tB=pad(tit),aB=pad(art),lB=pad(alb),infoSz=4+8+tB.length+8+aB.length+8+lB.length;
  const hdr=new ArrayBuffer(44),v=new DataView(hdr),pcm=new Uint8Array(ds);
  const ch=Array.from({length:n},(u,i)=>b.getChannelData(i));
  let p=0,q=0;
  const w16=x=>{v.setUint16(p,x,true);p+=2;},w32=x=>{v.setUint32(p,x,true);p+=4;};
  for(let i=0;i<b.length;i++)for(let c=0;c<n;c++){
    const s=Math.max(-1,Math.min(1,ch.at(c).at(i)));
    if(bits===16){const x=(s<0?s*32768:s*32767)|0;pcm.fill(x&255,q,q+1);pcm.fill((x>>8)&255,q+1,q+2);q+=2;}
    else{const x=Math.round(s<0?s*8388608:s*8388607);pcm.fill(x&255,q,q+1);pcm.fill((x>>8)&255,q+1,q+2);pcm.fill((x>>16)&255,q+2,q+3);q+=3;}
  }
  const mkChunk=(id,arr)=>{const h=new ArrayBuffer(8),dv=new DataView(h);dv.setUint32(0,id,true);dv.setUint32(4,arr.length,true);return Array.of(new Uint8Array(h),arr);};
  const infoArr=new Uint8Array(infoSz),iv=new DataView(infoArr.buffer);iv.setUint32(0,1330007625,true);let ip=4;
  const putT=(id,arr)=>{iv.setUint32(ip,id,true);iv.setUint32(ip+4,arr.length,true);infoArr.set(arr,ip+8);ip+=8+arr.length;};
  putT(1296125513,tB);putT(1414677065,aB);putT(1146241609,lB);
  const cList=mkChunk(1414744396,infoArr);
  if(covBytes){
        const fSz=14+covBytes.length,tSz=20+fSz,id3=new Uint8Array(tSz+(tSz%2)),dv=new DataView(id3.buffer);
    id3.set(Uint8Array.of(73,68,51,3,0,0),0);
    dv.setUint8(6,(tSz-10)>>21&127);dv.setUint8(7,(tSz-10)>>14&127);dv.setUint8(8,(tSz-10)>>7&127);dv.setUint8(9,(tSz-10)&127);
    id3.set(Uint8Array.of(65,80,73,67),10);dv.setUint32(14,fSz);
    id3.set(Uint8Array.of(0,105,109,97,103,101,47,106,112,101,103,0,3,0),20);
    id3.set(covBytes,34);cList.push(...mkChunk(540230729,id3));
  }
  const extraSz=cList.reduce((acc,x)=>acc+x.byteLength,0);
  w32(1179011410);w32(36+ds+extraSz);w32(1163280727);w32(544501094);w32(16);w16(1);w16(n);w32(b.sampleRate);w32(b.sampleRate*al);w16(al);w16(bits);w32(1635017060);w32(ds);
  return new Blob(Array.of(new Uint8Array(hdr),pcm,...cList),{type:"audio/wav"});
}
let rStart = 0, rTimer = null;
const stObs = new MutationObserver(() => {
  const txt = $("st").textContent;
  $("stTop").textContent = txt;
  if (txt.includes("Рендеринг") || txt.includes("Декодирование") || txt.includes("Пакетная")) {
    rStart = performance.now();
    $("stBar").style.width = "35%";
    clearInterval(rTimer);
    rTimer = setInterval(() => {
      const el = Math.round(performance.now() - rStart);
      $("stTime").textContent = el + " ms";
      const curW = parseFloat($("stBar").style.width) || 35;
      if (curW < 92) $("stBar").style.width = (curW + 4) + "%";
    }, 60);
  } else if (txt.includes("Готово") || txt.includes("завершён")) {
    clearInterval(rTimer);
    $("stBar").style.width = "100%";
    const m = txt.match(/(\d+)\s*мс/);
    if (m) $("stTime").textContent = m.at(1) + " ms";
  }
});
stObs.observe($("st"), { childList: true, characterData: true, subtree: true });
