// ==========================================
// 1. SYSTEM CORE
// ==========================================
let activeModule = 'shm';
let timeScale = 1.0; 
let myChart = null;

function setSubject(subj, btn) {
    document.querySelectorAll('.subject-btn').forEach(b => { 
        b.classList.remove('active'); 
        b.style.borderBottomColor = 'transparent'; 
    });
    btn.classList.add('active');
    
    let color = 'var(--accent-cyan)';
    if(subj === 'chemistry') color = 'var(--accent-purple)';
    if(subj === 'math') color = 'var(--accent-math)';
    btn.style.borderBottomColor = color;

    document.querySelectorAll('.exp-tabs').forEach(t => t.classList.remove('active'));
    document.getElementById('tabs-' + subj).classList.add('active');

    if(subj === 'physics') switchExp('shm');
    if(subj === 'chemistry') switchExp('decay');
    if(subj === 'math') switchExp('pi');
}

function switchExp(module) {
    activeModule = module;
    document.querySelectorAll('.exp-btn').forEach(b => b.classList.remove('active'));
    const btns = document.querySelectorAll(`button[onclick="switchExp('${module}')"]`);
    if(btns.length>0) btns[0].classList.add('active');
    
    document.querySelectorAll('.controls-container').forEach(c => c.classList.remove('active'));
    document.getElementById('ctrl-' + module).classList.add('active');

    document.querySelectorAll('canvas').forEach(c => c.classList.remove('active'));
    document.getElementById('canvas-' + module).classList.add('active');

    resizeCanvases();
    if(module === 'gravity') resetGravity();
    if(module === 'decay') resetDecay();
    if(module === 'pi') resetMath();
    if(module === 'shm') resetSHM();
}

function toggleSlowMo(btn) {
    if(timeScale === 1.0) {
        timeScale = 0.2; 
        document.querySelectorAll('.btn-slow').forEach(b => b.classList.add('active'));
    } else {
        timeScale = 1.0; 
        document.querySelectorAll('.btn-slow').forEach(b => b.classList.remove('active'));
    }
}

function resizeCanvases() {
    const w = document.getElementById('viewport').clientWidth;
    const h = document.getElementById('viewport').clientHeight;
    document.querySelectorAll('canvas').forEach(c => { c.width = w; c.height = h; });
}
window.addEventListener('resize', resizeCanvases);


// ==========================================
// 2. DATA ANALYSIS
// ==========================================
function showAnalysis(module) {
    const modal = document.getElementById('analysis-modal');
    const title = document.getElementById('anl-title');
    const calcDiv = document.getElementById('anl-calc');
    const ctxChart = document.getElementById('dataChart').getContext('2d');

    modal.style.display = 'flex';
    if(myChart) myChart.destroy();

    // --- PHYSICS (SHM - NEW) ---
    if(module === 'shm') {
        title.textContent = "SHM Analysis";
        const A = parseFloat(document.getElementById('s-amp').value);
        const f = parseFloat(document.getElementById('s-freq').value);
        const omega = (2 * Math.PI * f).toFixed(2);
        
        calcDiv.innerHTML = `
            <div class="calc-step">
                <div class="calc-label">Equation of Motion</div>
                <div class="calc-formula">y(t) = A sin(ωt)</div>
            </div>
            <div class="calc-step">
                <div class="calc-label">Angular Frequency (ω)</div>
                <div class="calc-formula">ω = 2πf = 2π(${f})</div>
                <div class="calc-result">${omega} rad/s</div>
            </div>
            <div class="calc-step">
                <div class="calc-label">Current Amplitude</div>
                <div class="calc-result">${A} px</div>
            </div>
            <p style="color:#aaa; font-size:0.9rem; margin-top:10px">
                The projection of Uniform Circular Motion onto the diameter is mathematically identical to Simple Harmonic Motion.
            </p>`;
        
        // Draw Sine Wave
        let labels = []; let data = [];
        for(let t=0; t<50; t++) {
            labels.push(t);
            data.push(A * Math.sin(omega * t * 0.05));
        }
        myChart = new Chart(ctxChart, { type: 'line', data: { labels: labels, datasets: [{ label: 'Displacement (y)', data: data, borderColor: '#00f3ff', fill: false, tension:0.4 }] }, options: { scales: { y: { ticks:{color:'#fff'}, grid:{color:'#334155'} }, x:{ display:false } } } });
    }
    // --- MATH (PI) ---
    else if(module === 'pi') {
        title.textContent = "Proof of Irrationality";
        calcDiv.innerHTML = `
            <div class="calc-step"><div class="calc-label">Equation</div><div class="calc-formula">z(θ) = e^{iθ} + e^{iπθ}</div></div>
            <div class="calc-step"><div class="calc-label">Conclusion</div><div class="calc-result">Ratio π is Irrational</div></div>
            <p style="color:#aaa; font-size:0.9rem;">The two arms will <strong>never</strong> return to their starting configuration simultaneously.</p>`;
        let data = Array.from({length:20}, () => Math.random() * 0.5 + 0.1); 
        myChart = new Chart(ctxChart, { type: 'line', data: { labels: Array.from({length:20},(_,i)=>i), datasets: [{ label: 'Cycle Error', data: data, borderColor: '#fff', borderWidth:1, pointRadius:0 }] }, options: { scales: { y: { min:0, ticks:{color:'#fff'} }, x:{ display:false } } } });
    }
    // --- CHEM & GRAVITY (UNTOUCHED) ---
    else if(module === 'decay') {
        const prob = parseFloat(document.getElementById('d-prob').value);
        const halfLife = Math.log(2) / prob;
        title.textContent = "Radioactive Decay Analysis";
        calcDiv.innerHTML = `<div class="calc-step"><div class="calc-label">Formula</div><div class="calc-formula">N(t) = N₀e^(-λt)</div></div><div class="calc-step"><div class="calc-label">Half-Life</div><div class="calc-result">${halfLife.toFixed(1)} cycles</div></div>`;
        let lbl = decayHistory.map((_,i)=>i);
        myChart = new Chart(ctxChart, { type: 'line', data: { labels: lbl, datasets: [{ label: 'Isotopes', data: decayHistory, borderColor: '#bd00ff', backgroundColor:'rgba(189,0,255,0.2)', fill: true }] }, options: { scales: { y: { beginAtZero:true, ticks:{color:'#fff'}, grid:{color:'#334155'} }, x:{ display:false } } } });
    }
    else {
        title.textContent = "Telemetry";
        let d = probe.trail.map(p=>p.v*10);
        calcDiv.innerHTML = `<div class="calc-step"><div class="calc-result" style="color:#ffd700">Velocity Tracking Active</div></div>`;
        myChart = new Chart(ctxChart, { type:'line', data:{labels:d.map((_,i)=>i), datasets:[{label:'Speed', data:d, borderColor:'#ffd700'}]}, options:{scales:{y:{ticks:{color:'#fff'}}, x:{display:false}}} });
    }
}

function closeAnalysis() { document.getElementById('analysis-modal').style.display = 'none'; }
function closeTheory() { document.getElementById('theory-modal').style.display = 'none'; }


// ==========================================
// 3. PHYSICS (SHM - REPLACED CYCLOTRON)
// ==========================================
const ctxS = document.getElementById('canvas-shm').getContext('2d');
let sAnim, sRunning = false;
let sAngle = 0;
let sWave = [];

// Init Listeners
['s-amp', 's-freq'].forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => document.getElementById(id+'-val').textContent = e.target.value);
});

function resetSHM() {
    sRunning = false; cancelAnimationFrame(sAnim);
    sAngle = 0; sWave = [];
    drawSHM();
}

function startSHM() {
    sRunning = true;
    loopSHM();
}

function loopSHM() {
    if(!sRunning) return;
    const amp = parseFloat(document.getElementById('s-amp').value);
    const freq = parseFloat(document.getElementById('s-freq').value);
    
    // Update angle
    sAngle += 0.05 * freq * timeScale;
    
    // Calculate coords
    const circleX = amp * Math.cos(sAngle);
    const circleY = amp * Math.sin(sAngle);
    
    // Store wave data
    sWave.unshift(circleY);
    if(sWave.length > 400) sWave.pop();
    
    drawSHM(circleX, circleY, amp);
    sAnim = requestAnimationFrame(loopSHM);
}

function drawSHM(cx, cy, r) {
    const w = ctxS.canvas.width;
    const h = ctxS.canvas.height;
    const centerX = w * 0.25; // Circle center
    const centerY = h / 2;
    const waveStartX = w * 0.5; // Wave start X
    
    ctxS.clearRect(0,0,w,h);
    
    // Background Grid
    ctxS.strokeStyle = "#1e293b"; ctxS.lineWidth = 1;
    ctxS.beginPath(); ctxS.moveTo(0, centerY); ctxS.lineTo(w, centerY); ctxS.stroke(); // X Axis
    
    // 1. Reference Circle
    ctxS.strokeStyle = "rgba(0, 243, 255, 0.3)";
    ctxS.lineWidth = 2;
    ctxS.beginPath();
    ctxS.arc(centerX, centerY, r || 100, 0, Math.PI * 2);
    ctxS.stroke();
    
    // Draw Radius Line
    if(sRunning) {
        ctxS.strokeStyle = "#fff";
        ctxS.beginPath(); ctxS.moveTo(centerX, centerY); ctxS.lineTo(centerX + cx, centerY + cy); ctxS.stroke();
        
        // Rotating Particle
        ctxS.fillStyle = "#00f3ff";
        ctxS.shadowBlur = 15; ctxS.shadowColor = "#00f3ff";
        ctxS.beginPath(); ctxS.arc(centerX + cx, centerY + cy, 8, 0, Math.PI*2); ctxS.fill();
        ctxS.shadowBlur = 0;
        
        // Projection Line (The Shadow)
        ctxS.strokeStyle = "rgba(255, 215, 0, 0.5)"; // Gold dashed line
        ctxS.setLineDash([5, 5]);
        ctxS.beginPath();
        ctxS.moveTo(centerX + cx, centerY + cy);
        ctxS.lineTo(waveStartX, centerY + cy);
        ctxS.stroke();
        ctxS.setLineDash([]);
        
        // 2. The Wave (Trace)
        ctxS.strokeStyle = "#ffd700";
        ctxS.lineWidth = 3;
        ctxS.beginPath();
        for(let i=0; i<sWave.length; i++) {
            ctxS.lineTo(waveStartX + i, centerY + sWave[i]);
        }
        ctxS.stroke();
        
        // 3. The Oscillating Point (The Shadow itself)
        ctxS.fillStyle = "#ffd700";
        ctxS.shadowBlur = 15; ctxS.shadowColor = "#ffd700";
        ctxS.beginPath(); ctxS.arc(waveStartX, centerY + cy, 8, 0, Math.PI*2); ctxS.fill();
        ctxS.shadowBlur = 0;
    }
}

// --- GRAVITY (UNTOUCHED) ---
const ctxG = document.getElementById('canvas-gravity').getContext('2d');
let gAnim, gRunning=false, gTime=0, probe={x:0,y:0,vx:0,vy:0,trail:[]}, planet={x:0,y:0,ang:0,textureOffset:0}, stars=[];
let planetCanvas=document.createElement('canvas'); planetCanvas.width=40; planetCanvas.height=40;
let pCtx=planetCanvas.getContext('2d'); pCtx.fillStyle="#1c4e8a"; pCtx.fillRect(0,0,40,40); pCtx.fillStyle="#4caf50"; for(let k=0;k<10;k++){pCtx.beginPath();pCtx.arc(Math.random()*40,Math.random()*40,Math.random()*10+2,0,6.28);pCtx.fill();} pCtx.strokeStyle="rgba(255,255,255,0.4)"; pCtx.lineWidth=2; for(let k=0;k<5;k++){pCtx.beginPath();pCtx.moveTo(0,Math.random()*40);pCtx.bezierCurveTo(10,Math.random()*40,30,Math.random()*40,40,Math.random()*40);pCtx.stroke();}
for(let i=0;i<150;i++) stars.push({x:Math.random(),y:Math.random(),size:Math.random()*1.5+0.5,blinkSpeed:Math.random()*0.05});
const gIn = { spd: document.getElementById('g-spd'), ang: document.getElementById('g-ang'), mass: document.getElementById('g-mass') };
['g-spd', 'g-ang', 'g-mass'].forEach(id => { document.getElementById(id).addEventListener('input', (e) => document.getElementById(id+'-val').textContent = e.target.value); });
function resetGravity() { gRunning=false; cancelAnimationFrame(gAnim); gTime=0; const w=ctxG.canvas.width; const h=ctxG.canvas.height; planet={x:w/2+200,y:h/2,ang:0,textureOffset:0}; probe={x:w/2-300,y:h/2+150,vx:0,vy:0,trail:[]}; drawGravity(); }
function fireGravity() { if(gRunning) resetGravity(); const spd=parseFloat(gIn.spd.value)*0.8; const ang=parseFloat(gIn.ang.value)*Math.PI/180; probe.vx=spd*Math.cos(ang); probe.vy=spd*-Math.sin(ang); gRunning=true; gLoop(); }
function gLoop() { 
    if(!gRunning)return; gTime+=0.01*timeScale; const cx=ctxG.canvas.width/2, cy=ctxG.canvas.height/2; 
    planet.x = cx+Math.cos(gTime)*200; planet.y = cy+Math.sin(gTime)*200; planet.textureOffset+=0.1*timeScale;
    let dx=cx-probe.x, dy=cy-probe.y, d=Math.sqrt(dx*dx+dy*dy);
    let f = 2000/(d*d); probe.vx+=f*(dx/d)*timeScale; probe.vy+=f*(dy/d)*timeScale; 
    dx=planet.x-probe.x; dy=planet.y-probe.y; d=Math.sqrt(dx*dx+dy*dy);
    f = (parseFloat(document.getElementById('g-mass').value)*500)/(d*d);
    if(d>15) { probe.vx+=f*(dx/d)*timeScale; probe.vy+=f*(dy/d)*timeScale; }
    probe.x+=probe.vx*timeScale; probe.y+=probe.vy*timeScale;
    if(gTime%0.05<0.02) probe.trail.push({x:probe.x, y:probe.y, v:Math.sqrt(probe.vx**2+probe.vy**2)});
    drawGravity(); gAnim=requestAnimationFrame(gLoop);
}
function drawGravity() {
    const w=ctxG.canvas.width, h=ctxG.canvas.height; ctxG.clearRect(0,0,w,h);
    stars.forEach(s=>{ctxG.fillStyle=`rgba(255,255,255,${0.5+Math.sin(gTime*50*s.blinkSpeed)*0.4})`; ctxG.beginPath(); ctxG.arc(s.x*w,s.y*h,s.size,0,6.28); ctxG.fill();});
    const cx=w/2, cy=h/2;
    const sunG=ctxG.createRadialGradient(cx,cy,10,cx,cy,60); sunG.addColorStop(0,"#fff"); sunG.addColorStop(0.3,"#ffd700"); sunG.addColorStop(1,"rgba(255,140,0,0)"); ctxG.fillStyle=sunG; ctxG.beginPath(); ctxG.arc(cx,cy,60,0,6.28); ctxG.fill();
    const surfG=ctxG.createRadialGradient(cx,cy,25,cx,cy,58); surfG.addColorStop(0,"rgba(255,100,0,0.1)"); surfG.addColorStop(0.8,"rgba(255,60,0,0.8)"); surfG.addColorStop(1,"rgba(200,40,0,0)"); ctxG.fillStyle=surfG; ctxG.beginPath(); ctxG.arc(cx,cy,60,0,6.28); ctxG.fill();
    const glowG=ctxG.createRadialGradient(cx,cy,50,cx,cy,150); glowG.addColorStop(0,"rgba(255,100,0,0.4)"); glowG.addColorStop(1,"rgba(255,50,0,0)"); ctxG.fillStyle=glowG; ctxG.beginPath(); ctxG.arc(cx,cy,150,0,6.28); ctxG.fill();
    ctxG.save(); ctxG.translate(planet.x,planet.y); ctxG.beginPath(); ctxG.arc(0,0,20,0,6.28); ctxG.closePath(); ctxG.clip(); ctxG.fillStyle="#1c4e8a"; ctxG.fillRect(-20,-20,40,40); let off=(planet.textureOffset%40)-20; ctxG.drawImage(planetCanvas,off,-20,40,40); ctxG.drawImage(planetCanvas,off-40,-20,40,40); const atm=ctxG.createRadialGradient(0,-10,10,0,0,22); atm.addColorStop(0.7,"rgba(0,243,255,0)"); atm.addColorStop(1,"rgba(0,243,255,0.4)"); ctxG.fillStyle=atm; ctxG.fillRect(-20,-20,40,40); const dx=cx-planet.x, dy=cy-planet.y, ang=Math.atan2(dy,dx); ctxG.rotate(ang+Math.PI); const sh=ctxG.createRadialGradient(-10,0,5,0,0,25); sh.addColorStop(0,"rgba(0,0,0,0)"); sh.addColorStop(1,"rgba(0,0,0,0.95)"); ctxG.fillStyle=sh; ctxG.fillRect(-25,-25,50,50); ctxG.restore();
    if(probe.trail.length>1) { for(let i=0;i<probe.trail.length-1;i++){ const p=probe.trail[i]; const next=probe.trail[i+1]; ctxG.beginPath(); ctxG.moveTo(p.x,p.y); ctxG.lineTo(next.x,next.y); const sc=p.v>8?"#ff0055":(p.v>6?"#c084fc":"#00f3ff"); ctxG.strokeStyle=sc; ctxG.lineWidth=2; ctxG.stroke(); } }
    ctxG.fillStyle="#fff"; ctxG.beginPath(); ctxG.arc(probe.x,probe.y,4,0,6.28); ctxG.fill();
    const cv=Math.sqrt(probe.vx**2+probe.vy**2)*10; ctxG.fillStyle="rgba(0,243,255,0.8)"; ctxG.font="bold 14px Courier New"; ctxG.textAlign="right"; ctxG.fillText(`VELOCITY: ${cv.toFixed(1)} km/s`, w-20, h-50);
    const dist=Math.sqrt((probe.x-planet.x)**2+(probe.y-planet.y)**2); if(dist<100){ ctxG.fillStyle="#ff0055"; ctxG.fillText(`GRAVITY ASSIST ENGAGED`, w-20, h-30); ctxG.strokeStyle="rgba(255, 255, 255, 0.2)"; ctxG.setLineDash([5,5]); ctxG.beginPath(); ctxG.moveTo(probe.x,probe.y); ctxG.lineTo(planet.x,planet.y); ctxG.stroke(); ctxG.setLineDash([]); } else { ctxG.fillStyle="#64748b"; ctxG.fillText(`CRUISE PHASE`, w-20, h-30); }
}

// ==========================================
// 4. CHEMISTRY (DECAY)
// ==========================================
const ctxD = document.getElementById('canvas-decay').getContext('2d');
let dAnim, dRunning=false, atoms=[], decayHistory=[], shocks=[];
function resetDecay() {
    dRunning=false; cancelAnimationFrame(dAnim); atoms=[]; decayHistory=[]; shocks=[];
    const w=ctxD.canvas.width, h=ctxD.canvas.height;
    for(let i=0; i<parseInt(document.getElementById('d-num').value); i++) atoms.push({x:Math.random()*(w-100)+50, y:Math.random()*(h-100)+50, stable:false});
    drawDecay();
}
function startDecay() { if(atoms.length===0)resetDecay(); dRunning=true; dLoop(); }
function dLoop() {
    if(!dRunning)return; const prob=parseFloat(document.getElementById('d-prob').value); let uns=0;
    atoms.forEach(a=>{
        if(!a.stable) { uns++; if(Math.random()<prob*timeScale){ a.stable=true; shocks.push({x:a.x, y:a.y, r:0, a:1}); } }
    });
    shocks.forEach(s=>{ s.r+=2; s.a-=0.05; }); shocks=shocks.filter(s=>s.a>0);
    decayHistory.push(uns); if(uns===0) dRunning=false; drawDecay(); dAnim=requestAnimationFrame(dLoop);
}
function drawDecay() {
    const w=ctxD.canvas.width, h=ctxD.canvas.height; ctxD.clearRect(0,0,w,h);
    ctxD.fillStyle="#100018"; ctxD.fillRect(0,0,w,h); ctxD.strokeStyle="#bd00ff"; ctxD.lineWidth=4; ctxD.strokeRect(40,40,w-80,h-80);
    atoms.forEach(a=>{
        if(a.stable) { ctxD.fillStyle="#334155"; ctxD.beginPath(); ctxD.arc(a.x,a.y,4,0,6.28); ctxD.fill(); }
        else { 
            const j=Math.random()*1.5; ctxD.fillStyle="#bd00ff"; ctxD.beginPath(); ctxD.arc(a.x+j,a.y+j,4,0,6.28); ctxD.fill();
            ctxD.fillStyle="rgba(255,255,255,0.3)"; ctxD.beginPath(); ctxD.arc(a.x+j,a.y+j,7,0,6.28); ctxD.fill();
        }
    });
    shocks.forEach(s=>{ ctxD.beginPath(); ctxD.strokeStyle=`rgba(255, 200, 50, ${s.a})`; ctxD.lineWidth=2; ctxD.arc(s.x, s.y, s.r, 0, 6.28); ctxD.stroke(); });
    ctxD.fillStyle="#fff"; ctxD.font="16px monospace"; ctxD.fillText(`ISOTOPES: ${atoms.filter(a=>!a.stable).length}`, 60, 70);
}

// ==========================================
// 5. MATH (PI - NEW VISUALIZATION)
// ==========================================
const ctxM = document.getElementById('canvas-pi').getContext('2d');
let mAnim, mRunning = false;
let mTheta = 0;
let mPoints = [];

['m-spd', 'm-zoom'].forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => document.getElementById(id+'-val').textContent = e.target.value);
});

function resetMath() {
    mRunning = false; cancelAnimationFrame(mAnim);
    mTheta = 0; mPoints = [];
    drawMath();
}

function startMath() {
    mRunning = true;
    mLoop();
}

function mLoop() {
    if(!mRunning) return;
    const speed = parseFloat(document.getElementById('m-spd').value);
    
    // Update angle
    mTheta += 0.02 * speed * timeScale;
    
    // Arm 1 (Speed 1)
    let x1 = Math.cos(mTheta);
    let y1 = Math.sin(mTheta);
    
    // Arm 2 (Speed PI - Irrational)
    let x2 = Math.cos(Math.PI * mTheta);
    let y2 = Math.sin(Math.PI * mTheta);
    
    let finalX = x1 + x2;
    let finalY = y1 + y2;
    
    mPoints.push({x: finalX, y: finalY});
    if(mPoints.length > 5000) mPoints.shift();

    drawMath(x1, y1, finalX, finalY);
    mAnim = requestAnimationFrame(mLoop);
}

function drawMath(x1, y1, finalX, finalY) {
    const w = ctxM.canvas.width;
    const h = ctxM.canvas.height;
    const cx = w/2;
    const cy = h/2;
    const zoom = parseFloat(document.getElementById('m-zoom').value);
    const scale = (Math.min(w, h) / 5) * (zoom/100);

    ctxM.clearRect(0,0,w,h);
    
    // Background
    ctxM.fillStyle = "#000";
    ctxM.fillRect(0,0,w,h);

    // Trail
    ctxM.beginPath();
    ctxM.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctxM.lineWidth = 1;
    if(mPoints.length > 0) {
        ctxM.moveTo(cx + mPoints[0].x * scale, cy + mPoints[0].y * scale);
        for(let i=1; i<mPoints.length; i++) {
            ctxM.lineTo(cx + mPoints[i].x * scale, cy + mPoints[i].y * scale);
        }
    }
    ctxM.stroke();

    // Arms
    if(mRunning) {
        ctxM.beginPath();
        ctxM.strokeStyle = "#888";
        ctxM.lineWidth = 2;
        ctxM.moveTo(cx, cy);
        ctxM.lineTo(cx + x1 * scale, cy + y1 * scale);
        ctxM.stroke();
        
        ctxM.beginPath();
        ctxM.strokeStyle = "#fff";
        ctxM.lineWidth = 2;
        ctxM.moveTo(cx + x1 * scale, cy + y1 * scale);
        ctxM.lineTo(cx + finalX * scale, cy + finalY * scale);
        ctxM.stroke();

        ctxM.fillStyle = "#fff";
        ctxM.beginPath(); ctxM.arc(cx, cy, 3, 0, 6.28); ctxM.fill();
        ctxM.beginPath(); ctxM.arc(cx + x1*scale, cy + y1*scale, 3, 0, 6.28); ctxM.fill();
        ctxM.fillStyle = "#ffd700";
        ctxM.beginPath(); ctxM.arc(cx + finalX*scale, cy + finalY*scale, 4, 0, 6.28); ctxM.fill(); 
    }

    ctxM.font = "20px Courier New";
    ctxM.fillStyle = "#fff";
    ctxM.fillText("z(θ) = e^{iθ} + e^{iπθ}", 20, h-30);
}

// Theory Data
const theoryData = {
    shm: {
        title: "Simple Harmonic Motion",
        html: `<h3>Principle</h3><p>SHM is the projection of uniform circular motion onto a diameter.</p><div class="formula-box">x(t) = A cos(ωt)</div><h3>Instructions</h3><ol><li>Set Amplitude (Radius).</li><li>Set Frequency (Speed).</li><li>Watch the shadow trace a sine wave.</li></ol>`
    },
    gravity: {
        title: "Gravity Assist",
        html: `<h3>Principle</h3><p>Spacecraft can 'steal' orbital energy from planets to gain speed.</p>`
    },
    decay: {
        title: "Nuclear Decay",
        html: `<h3>Principle</h3><p>Unstable isotopes randomly decay. N(t) = N₀e^(-λt)</p>`
    },
    pi: {
        title: "Irrationality of Pi",
        html: `<h3>Mathematical Principle</h3><p>This visualization plots the sum of two rotating vectors: one rotating at speed <strong>1</strong>, and the other at speed <strong>π</strong>.</p><div class="formula-box">z(θ) = e^{iθ} + e^{iπθ}</div><p>Because <strong>π</strong> is an irrational number, the ratio of the two speeds is irrational. This means the two arms will <strong>never</strong> return to their exact starting configuration simultaneously. Consequently, the drawing path never closes and will eventually fill the entire annulus area without ever repeating.</p>`
    }
};

function toggleTheory() {
    const modal = document.getElementById('theory-modal');
    const data = theoryData[activeModule];
    document.getElementById('theory-title').textContent = data.title;
    document.getElementById('theory-body').innerHTML = data.html;
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}
function closeTheory() { document.getElementById('theory-modal').style.display = 'none'; }

// START WITH SHM
setSubject('physics', document.querySelector('.subject-btn.active'));