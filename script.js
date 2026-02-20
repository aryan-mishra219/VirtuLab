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
    if (subj === 'chemistry') color = 'var(--accent-purple)';
    if (subj === 'math') color = 'var(--accent-math)';
    btn.style.borderBottomColor = color;

    document.querySelectorAll('.exp-tabs').forEach(t => t.classList.remove('active'));
    document.getElementById('tabs-' + subj).classList.add('active');

    if (subj === 'physics') switchExp('shm');
    if (subj === 'chemistry') switchExp('decay');
    if (subj === 'math') switchExp('pi');
}

function switchExp(module) {
    activeModule = module;
    document.querySelectorAll('.exp-btn').forEach(b => b.classList.remove('active'));
    const btns = document.querySelectorAll(`button[onclick="switchExp('${module}')"]`);
    if (btns.length > 0) btns[0].classList.add('active');

    document.querySelectorAll('.controls-container').forEach(c => c.classList.remove('active'));
    document.getElementById('ctrl-' + module).classList.add('active');

    document.querySelectorAll('canvas').forEach(c => c.classList.remove('active'));
    document.getElementById('canvas-' + module).classList.add('active');

    resizeCanvases();
    if (module === 'gravity') resetGravity();
    if (module === 'decay') resetDecay();
    if (module === 'pi') resetMath();
    if (module === 'shm') resetSHM();
}

function toggleSlowMo(btn) {
    if (timeScale === 1.0) {
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
    if (myChart) myChart.destroy();

    // --- PHYSICS (SHM - NEW) ---
    if (module === 'shm') {
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
        for (let t = 0; t < 50; t++) {
            labels.push(t);
            data.push(A * Math.sin(omega * t * 0.05));
        }
        myChart = new Chart(ctxChart, { type: 'line', data: { labels: labels, datasets: [{ label: 'Displacement (y)', data: data, borderColor: '#00f3ff', fill: false, tension: 0.4 }] }, options: { scales: { y: { ticks: { color: '#fff' }, grid: { color: '#334155' } }, x: { display: false } } } });
    }
    // --- MATH (PI) ---
    else if (module === 'pi') {
        title.textContent = "Proof of Irrationality";
        calcDiv.innerHTML = `
            <div class="calc-step"><div class="calc-label">Equation</div><div class="calc-formula">z(θ) = e^{iθ} + e^{iπθ}</div></div>
            <div class="calc-step"><div class="calc-label">Conclusion</div><div class="calc-result">Ratio π is Irrational</div></div>
            <p style="color:#aaa; font-size:0.9rem;">The two arms will <strong>never</strong> return to their starting configuration simultaneously.</p>`;
        let data = Array.from({ length: 20 }, () => Math.random() * 0.5 + 0.1);
        myChart = new Chart(ctxChart, { type: 'line', data: { labels: Array.from({ length: 20 }, (_, i) => i), datasets: [{ label: 'Cycle Error', data: data, borderColor: '#fff', borderWidth: 1, pointRadius: 0 }] }, options: { scales: { y: { min: 0, ticks: { color: '#fff' } }, x: { display: false } } } });
    }
    // --- CHEM & GRAVITY (UNTOUCHED) ---
    else if (module === 'decay') {
        const prob = parseFloat(document.getElementById('d-prob').value);
        const halfLife = Math.log(2) / prob;
        const initialCount = parseInt(document.getElementById('d-num').value);

        title.textContent = "Radioactive Decay Analysis";

        // 1. Generate Theoretical Curve
        let theoryData = [];
        const maxTime = decayDataRealtime.length > 0 ? decayDataRealtime[decayDataRealtime.length - 1].x + 5 : 20;
        for (let t = 0; t <= maxTime; t += 0.5) {
            theoryData.push({ x: t, y: initialCount * Math.exp(-prob * t * 60) }); // Approx conversion for timeScale
            // Note: timeScale is weird in the original code (frame based), but we use real seconds now. 
            // Simplified Theoretical: N = N0 * e^(-lambda * t) where t is in seconds.
            // Adjust lambda based on user feel or keep raw 'prob'. 
            // Let's us standard formula: N(t) = N0 * e^(-prob * t * 30) (Assuming ~30fps effective speed)
            theoryData.push({ x: t, y: initialCount * Math.exp(-prob * t * 30) });
        }

        calcDiv.innerHTML = `
            <div class="calc-step"><div class="calc-label">Formula</div><div class="calc-formula">N(t) = N₀e^(-λt)</div></div>
            <div class="calc-step"><div class="calc-label">Half-Life</div><div class="calc-result">${halfLife.toFixed(1)} cycles</div></div>
            <div class="calc-step"><div class="calc-label">Live Tracking</div><div class="calc-result" style="color:#bd00ff">Active</div></div>
        `;

        myChart = new Chart(ctxChart, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Real-Time Decay',
                        data: decayDataRealtime,
                        borderColor: '#bd00ff',
                        backgroundColor: '#bd00ff',
                        showLine: true,
                        borderWidth: 3,
                        tension: 0.1,
                        pointRadius: 0
                    },
                    {
                        label: 'Theoretical Model',
                        data: theoryData.filter((_, i) => i % 2 === 0), // Dedupe
                        borderColor: 'rgba(255,255,255,0.3)',
                        borderDash: [5, 5],
                        showLine: true,
                        pointRadius: 0,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: { intersect: false },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: { display: true, text: 'Time (Seconds)', color: '#94a3b8' },
                        grid: { color: '#334155' },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Isotopes Remaining', color: '#94a3b8' },
                        grid: { color: '#334155' },
                        ticks: { color: '#94a3b8' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#fff' } },
                    tooltip: {
                        callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.y.toFixed(0)}` }
                    }
                }
            }
        });
    }
    else {
        title.textContent = "Gravity Assist Telemetry";

        // 1. Process Data (Convert to km/s)
        let speeds = probe.trail.map(p => p.v * 10);

        if (speeds.length === 0) {
            calcDiv.innerHTML = `<p>No data recorded yet. Launch the probe first!</p>`;
            return;
        }

        // 2. Calculations
        const v_start = speeds[0];
        const v_max = Math.max(...speeds);
        const v_end = speeds[speeds.length - 1]; // Current/Final
        const delta_v = v_max - v_start;
        const gain_pct = ((delta_v / v_start) * 100).toFixed(1);

        // 3. Display Math
        calcDiv.innerHTML = `
            <div class="calc-step">
                <div class="calc-label">Initial Velocity (v₀)</div>
                <div class="calc-result">${v_start.toFixed(2)} km/s</div>
            </div>
            <div class="calc-step">
                <div class="calc-label">Peak Velocity (vₘₐₓ)</div>
                <div class="calc-result" style="color:var(--accent-cyan)">${v_max.toFixed(2)} km/s</div>
            </div>
            <div class="calc-step">
                <div class="calc-label">Gravity Assist Gain (Δv)</div>
                <div class="calc-formula">Δv = vₘₐₓ - v₀</div>
                <div class="calc-result" style="color:#ffd700">+${delta_v.toFixed(2)} km/s (${gain_pct}%)</div>
            </div>
        `;

        // 4. Draw Graph
        let labels = speeds.map((_, i) => i);
        myChart = new Chart(ctxChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Probe Velocity (km/s)',
                    data: speeds,
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                interaction: { intersect: false, mode: 'index' },
                plugins: {
                    legend: { labels: { color: '#fff' } }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#334155' },
                        title: { display: true, text: 'Velocity (km/s)', color: '#fff' }
                    },
                    x: {
                        display: true,
                        ticks: { color: '#94a3b8', maxTicksLimit: 10 },
                        title: { display: true, text: 'Time Steps (ticks)', color: '#fff' }
                    }
                }
            }
        });
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
    document.getElementById(id).addEventListener('input', (e) => document.getElementById(id + '-val').textContent = e.target.value);
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
    if (!sRunning) return;
    const amp = parseFloat(document.getElementById('s-amp').value);
    const freq = parseFloat(document.getElementById('s-freq').value);

    // Update angle
    sAngle += 0.05 * freq * timeScale;

    // Calculate coords
    const circleX = amp * Math.cos(sAngle);
    const circleY = amp * Math.sin(sAngle);

    // Store wave data
    sWave.unshift(circleY);
    if (sWave.length > 400) sWave.pop();

    drawSHM(circleX, circleY, amp);
    sAnim = requestAnimationFrame(loopSHM);
}

function drawSHM(cx, cy, r) {
    const w = ctxS.canvas.width;
    const h = ctxS.canvas.height;
    const centerX = w * 0.25; // Circle center
    const centerY = h / 2;
    const waveStartX = w * 0.5; // Wave start X

    ctxS.clearRect(0, 0, w, h);

    // Background Grid
    ctxS.strokeStyle = "#1e293b"; ctxS.lineWidth = 1;
    ctxS.beginPath(); ctxS.moveTo(0, centerY); ctxS.lineTo(w, centerY); ctxS.stroke(); // X Axis

    // 1. Reference Circle
    ctxS.strokeStyle = "rgba(10, 205, 249, 0.3)";
    ctxS.lineWidth = 2;
    ctxS.beginPath();
    ctxS.arc(centerX, centerY, r || 100, 0, Math.PI * 2);
    ctxS.stroke();

    // Draw Radius Line
    if (sRunning) {
        ctxS.strokeStyle = "#fff";
        ctxS.beginPath(); ctxS.moveTo(centerX, centerY); ctxS.lineTo(centerX + cx, centerY + cy); ctxS.stroke();

        // Rotating Particle
        ctxS.fillStyle = "#00f3ff";
        ctxS.shadowBlur = 15; ctxS.shadowColor = "#00f3ff";
        ctxS.beginPath(); ctxS.arc(centerX + cx, centerY + cy, 8, 0, Math.PI * 2); ctxS.fill();
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
        for (let i = 0; i < sWave.length; i++) {
            ctxS.lineTo(waveStartX + i, centerY + sWave[i]);
        }
        ctxS.stroke();

        // 3. The Oscillating Point (The Shadow itself)
        ctxS.fillStyle = "#ffd700";
        ctxS.shadowBlur = 15; ctxS.shadowColor = "#ffd700";
        ctxS.beginPath(); ctxS.arc(waveStartX, centerY + cy, 8, 0, Math.PI * 2); ctxS.fill();
        ctxS.shadowBlur = 0;
    }
}

// --- GRAVITY (UNTOUCHED) ---
const ctxG = document.getElementById('canvas-gravity').getContext('2d');
let gAnim, gRunning = false, gTime = 0, probe = { x: 0, y: 0, vx: 0, vy: 0, trail: [] }, planet = { x: 0, y: 0, ang: 0, textureOffset: 0 }, stars = [];
let planetCanvas = document.createElement('canvas'); planetCanvas.width = 40; planetCanvas.height = 40;
let pCtx = planetCanvas.getContext('2d'); pCtx.fillStyle = "#1c4e8a"; pCtx.fillRect(0, 0, 40, 40); pCtx.fillStyle = "#4caf50"; for (let k = 0; k < 10; k++) { pCtx.beginPath(); pCtx.arc(Math.random() * 40, Math.random() * 40, Math.random() * 10 + 2, 0, 6.28); pCtx.fill(); } pCtx.strokeStyle = "rgba(255,255,255,0.4)"; pCtx.lineWidth = 2; for (let k = 0; k < 5; k++) { pCtx.beginPath(); pCtx.moveTo(0, Math.random() * 40); pCtx.bezierCurveTo(10, Math.random() * 40, 30, Math.random() * 40, 40, Math.random() * 40); pCtx.stroke(); }
for (let i = 0; i < 150; i++) stars.push({ x: Math.random(), y: Math.random(), size: Math.random() * 1.5 + 0.5, blinkSpeed: Math.random() * 0.05 });
const gIn = { spd: document.getElementById('g-spd'), ang: document.getElementById('g-ang'), mass: document.getElementById('g-mass') };
['g-spd', 'g-ang', 'g-mass'].forEach(id => { document.getElementById(id).addEventListener('input', (e) => document.getElementById(id + '-val').textContent = e.target.value); });
function resetGravity() { gRunning = false; cancelAnimationFrame(gAnim); gTime = 0; const w = ctxG.canvas.width; const h = ctxG.canvas.height; planet = { x: w / 2 + 200, y: h / 2, ang: 0, textureOffset: 0 }; probe = { x: w / 2 - 300, y: h / 2 + 150, vx: 0, vy: 0, trail: [] }; drawGravity(); }
function fireGravity() { if (gRunning) resetGravity(); const spd = parseFloat(gIn.spd.value) * 0.8; const ang = parseFloat(gIn.ang.value) * Math.PI / 180; probe.vx = spd * Math.cos(ang); probe.vy = spd * -Math.sin(ang); gRunning = true; gLoop(); }
function gLoop() {
    if (!gRunning) return; gTime += 0.01 * timeScale; const cx = ctxG.canvas.width / 2, cy = ctxG.canvas.height / 2;
    planet.x = cx + Math.cos(gTime) * 200; planet.y = cy + Math.sin(gTime) * 200; planet.textureOffset += 0.1 * timeScale;
    let dx = cx - probe.x, dy = cy - probe.y, d = Math.sqrt(dx * dx + dy * dy);
    let f = 2000 / (d * d); probe.vx += f * (dx / d) * timeScale; probe.vy += f * (dy / d) * timeScale;
    dx = planet.x - probe.x; dy = planet.y - probe.y; d = Math.sqrt(dx * dx + dy * dy);
    f = (parseFloat(document.getElementById('g-mass').value) * 500) / (d * d);
    if (d > 15) { probe.vx += f * (dx / d) * timeScale; probe.vy += f * (dy / d) * timeScale; }
    probe.x += probe.vx * timeScale; probe.y += probe.vy * timeScale;
    if (gTime % 0.05 < 0.02) probe.trail.push({ x: probe.x, y: probe.y, v: Math.sqrt(probe.vx ** 2 + probe.vy ** 2) });
    drawGravity(); gAnim = requestAnimationFrame(gLoop);
}
function drawGravity() {
    const w = ctxG.canvas.width, h = ctxG.canvas.height; ctxG.clearRect(0, 0, w, h);
    stars.forEach(s => { ctxG.fillStyle = `rgba(255,255,255,${0.5 + Math.sin(gTime * 50 * s.blinkSpeed) * 0.4})`; ctxG.beginPath(); ctxG.arc(s.x * w, s.y * h, s.size, 0, 6.28); ctxG.fill(); });
    const cx = w / 2, cy = h / 2;
    const sunG = ctxG.createRadialGradient(cx, cy, 10, cx, cy, 60); sunG.addColorStop(0, "#fff"); sunG.addColorStop(0.3, "#ffd700"); sunG.addColorStop(1, "rgba(255,140,0,0)"); ctxG.fillStyle = sunG; ctxG.beginPath(); ctxG.arc(cx, cy, 60, 0, 6.28); ctxG.fill();
    const surfG = ctxG.createRadialGradient(cx, cy, 25, cx, cy, 58); surfG.addColorStop(0, "rgba(255,100,0,0.1)"); surfG.addColorStop(0.8, "rgba(255,60,0,0.8)"); surfG.addColorStop(1, "rgba(200,40,0,0)"); ctxG.fillStyle = surfG; ctxG.beginPath(); ctxG.arc(cx, cy, 60, 0, 6.28); ctxG.fill();
    const glowG = ctxG.createRadialGradient(cx, cy, 50, cx, cy, 150); glowG.addColorStop(0, "rgba(255,100,0,0.4)"); glowG.addColorStop(1, "rgba(255,50,0,0)"); ctxG.fillStyle = glowG; ctxG.beginPath(); ctxG.arc(cx, cy, 150, 0, 6.28); ctxG.fill();
    ctxG.save(); ctxG.translate(planet.x, planet.y); ctxG.beginPath(); ctxG.arc(0, 0, 20, 0, 6.28); ctxG.closePath(); ctxG.clip(); ctxG.fillStyle = "#1c4e8a"; ctxG.fillRect(-20, -20, 40, 40); let off = (planet.textureOffset % 40) - 20; ctxG.drawImage(planetCanvas, off, -20, 40, 40); ctxG.drawImage(planetCanvas, off - 40, -20, 40, 40); const atm = ctxG.createRadialGradient(0, -10, 10, 0, 0, 22); atm.addColorStop(0.7, "rgba(0,243,255,0)"); atm.addColorStop(1, "rgba(0,243,255,0.4)"); ctxG.fillStyle = atm; ctxG.fillRect(-20, -20, 40, 40); const dx = cx - planet.x, dy = cy - planet.y, ang = Math.atan2(dy, dx); ctxG.rotate(ang + Math.PI); const sh = ctxG.createRadialGradient(-10, 0, 5, 0, 0, 25); sh.addColorStop(0, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(0,0,0,0.95)"); ctxG.fillStyle = sh; ctxG.fillRect(-25, -25, 50, 50); ctxG.restore();
    if (probe.trail.length > 1) { for (let i = 0; i < probe.trail.length - 1; i++) { const p = probe.trail[i]; const next = probe.trail[i + 1]; ctxG.beginPath(); ctxG.moveTo(p.x, p.y); ctxG.lineTo(next.x, next.y); const sc = p.v > 8 ? "#ff0055" : (p.v > 6 ? "#c084fc" : "#00f3ff"); ctxG.strokeStyle = sc; ctxG.lineWidth = 2; ctxG.stroke(); } }
    // Draw Satellite (Probe)
    ctxG.save();
    ctxG.translate(probe.x, probe.y);
    const angle = Math.atan2(probe.vy, probe.vx);
    ctxG.rotate(angle);

    // Solar Panels (Blue)
    ctxG.fillStyle = "#3b82f6";
    ctxG.fillRect(-12, -4, 8, 8); // Left Panel
    ctxG.fillRect(4, -4, 8, 8);   // Right Panel

    // Panel Details (Grid)
    ctxG.fillStyle = "rgba(255,255,255,0.3)";
    ctxG.fillRect(-12, -1, 8, 2);
    ctxG.fillRect(4, -1, 8, 2);

    // Body (Gold)
    ctxG.fillStyle = "#ffd700";
    ctxG.shadowBlur = 10; ctxG.shadowColor = "#ffd700";
    ctxG.fillRect(-4, -4, 8, 8);
    ctxG.shadowBlur = 0;

    // Dish (Gray arc)
    ctxG.strokeStyle = "#94a3b8";
    ctxG.lineWidth = 1.5;
    ctxG.beginPath();
    ctxG.arc(2, 0, 6, -1, 1);
    ctxG.stroke();

    ctxG.restore();
    const cv = Math.sqrt(probe.vx ** 2 + probe.vy ** 2) * 10; ctxG.fillStyle = "rgba(0,243,255,0.8)"; ctxG.font = "bold 14px Courier New"; ctxG.textAlign = "left"; ctxG.fillText(`VELOCITY: ${cv.toFixed(1)} km/s`, 20, h - 50);
    const dist = Math.sqrt((probe.x - planet.x) ** 2 + (probe.y - planet.y) ** 2); if (dist < 100) { ctxG.fillStyle = "#ff0055"; ctxG.fillText(`GRAVITY ASSIST ENGAGED`, 20, h - 30); ctxG.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctxG.setLineDash([5, 5]); ctxG.beginPath(); ctxG.moveTo(probe.x, probe.y); ctxG.lineTo(planet.x, planet.y); ctxG.stroke(); ctxG.setLineDash([]); } else { ctxG.fillStyle = "#64748b"; ctxG.fillText(`CRUISE PHASE`, 20, h - 30); }
}

// ==========================================
// 4. CHEMISTRY (DECAY)
// ==========================================
const ctxD = document.getElementById('canvas-decay').getContext('2d');
let dAnim, dRunning = false, atoms = [], decayHistory = [], shocks = [];
let decayDataRealtime = []; // {x: time, y: count}
let decayStartTime = 0;
let lastDecayUpdate = 0;
let decayFrame = 0;
let halfLifeFrames = 0;
let isDecayPaused = false;
let decayTargetRatio = 0.5; // Next stop: 50%

function resetDecay() {
    dRunning = false; cancelAnimationFrame(dAnim); atoms = []; decayHistory = []; shocks = [];
    decayDataRealtime = [];
    document.getElementById('btn-proceed').style.display = 'none';
    const w = ctxD.canvas.width, h = ctxD.canvas.height;
    for (let i = 0; i < parseInt(document.getElementById('d-num').value); i++) atoms.push({ x: Math.random() * (w - 100) + 50, y: Math.random() * (h - 100) + 50, stable: false });
    drawDecay();
}

function proceedDecay() {
    isDecayPaused = false;
    document.getElementById('btn-proceed').style.display = 'none';
    decayTargetRatio /= 2; // Next target: half of current (25%, 12.5%...)
    dLoop();
}

function startDecay() {
    // 1. Prevent Speed-Up Bug (Multiple Loops)
    if (dRunning) return;

    // 2. Prevent "Random Percentage" Bug (Starting mid-decay with 0 timer)
    // If we have fewer atoms than target (meaning some decayed),
    // we MUST reset to start a fresh Half-Life experiment.
    const targetNum = parseInt(document.getElementById('d-num').value);
    if (atoms.length < targetNum || atoms.length === 0) {
        resetDecay();
    }

    dRunning = true;
    decayStartTime = Date.now();
    lastDecayUpdate = Date.now();

    // Half-Life Init
    decayFrame = 0;
    isDecayPaused = false;
    decayTargetRatio = 0.5; // Reset to 50%
    document.getElementById('btn-proceed').style.display = 'none';

    const prob = parseFloat(document.getElementById('d-prob').value);

    // Initial Calc
    const effectiveProb = prob * timeScale;
    halfLifeFrames = effectiveProb > 0 ? Math.log(2) / effectiveProb : Infinity;

    // Record initial state
    decayDataRealtime.push({ x: 0, y: atoms.length });
    dLoop();
}

function dLoop() {
    if (!dRunning) return;

    // Pause for Half-Life
    if (isDecayPaused) {
        drawDecay();
        dAnim = requestAnimationFrame(dLoop);
        return;
    }

    const prob = parseFloat(document.getElementById('d-prob').value);

    // Recalculate Half-Life with TimeScale (Fix for Slow Mo desync)
    // If timesScale is 0.2, decay is 5x slower, so frames must be 5x more.
    const effectiveProb = prob * timeScale;
    if (effectiveProb > 0) {
        halfLifeFrames = Math.log(2) / effectiveProb;
    } else {
        halfLifeFrames = Infinity;
    }

    let uns = 0;

    decayFrame++;
    // Check Half-Life Crossing (Legacy Time-Based check - kept for visual slider progress only)
    // The ACTUAL stop logic is below (Count-Based).
    // Use modulo to detect just for the visual slider right-side bar.
    // if (decayFrame > 0 && Math.floor(decayFrame / halfLifeFrames) > Math.floor((decayFrame - 1) / halfLifeFrames)) {
    //    isDecayPaused = true; 
    // }

    // --- STEP-BY-STEP CHECK vs Count ---
    const activeCount = atoms.filter(a => !a.stable).length;
    const currentRatio = activeCount / atoms.length;

    // Tolerance: Pausing exactly at 0.5 might miss if it jumps from 0.51 to 0.49.
    // Use <= check.
    if (currentRatio <= decayTargetRatio && decayTargetRatio > 0.01) {
        isDecayPaused = true;
        document.getElementById('btn-proceed').style.display = 'inline-block';
        drawDecay(); // Draw the paused state frame once
        return; // Stop the loop! `proceedDecay` will restart it.
    }
    // Physics Update
    atoms.forEach(a => {
        if (!a.stable) { uns++; if (Math.random() < prob * timeScale) { a.stable = true; shocks.push({ x: a.x, y: a.y, r: 0, a: 1 }); } }
    });
    shocks.forEach(s => { s.r += 2; s.a -= 0.05; }); shocks = shocks.filter(s => s.a > 0);

    // Data Collection (Every 100ms)
    const now = Date.now();
    if (now - lastDecayUpdate > 100) {
        const t = (now - decayStartTime) / 1000; // Seconds
        decayDataRealtime.push({ x: t, y: uns });
        lastDecayUpdate = now;

        // Live Chart Update if Modal is Open
        const modal = document.getElementById('analysis-modal');
        if (modal.style.display === 'flex' && document.getElementById('anl-title').textContent.includes('Radioactive') && myChart) {
            myChart.data.datasets[0].data = decayDataRealtime;
            myChart.update('none'); // Efficient update
        }
    }

    decayHistory.push(uns);
    if (uns === 0) {
        dRunning = false;
        // Final data point
        decayDataRealtime.push({ x: (Date.now() - decayStartTime) / 1000, y: 0 });
    }

    drawDecay(); dAnim = requestAnimationFrame(dLoop);
}
function drawDecay() {
    const w = ctxD.canvas.width, h = ctxD.canvas.height; ctxD.clearRect(0, 0, w, h);
    ctxD.fillStyle = "#100018"; ctxD.fillRect(0, 0, w, h); ctxD.strokeStyle = "#bb00ff"; ctxD.lineWidth = 4; ctxD.strokeRect(40, 40, w - 80, h - 80);

    let parentCount = 0;

    atoms.forEach(a => {
        if (a.stable) {
            // Daughter Isotope (Stable)
            ctxD.fillStyle = "rgba(109, 109, 109, 0.91)";
            ctxD.beginPath(); ctxD.arc(a.x, a.y, 4, 0, 6.28); ctxD.fill();
        }
        else {
            // Parent Isotope (Unstable)
            parentCount++;
            const j = Math.random() * 1.5; ctxD.fillStyle = "#bb00ff"; ctxD.beginPath(); ctxD.arc(a.x + j, a.y + j, 4, 0, 6.28); ctxD.fill();
            ctxD.fillStyle = "rgba(190, 0, 248, 0.3)"; ctxD.beginPath(); ctxD.arc(a.x + j, a.y + j, 7, 0, 6.28); ctxD.fill();
        }
    });

    const daughterCount = atoms.length - parentCount;

    shocks.forEach(s => { ctxD.beginPath(); ctxD.strokeStyle = `rgba(255, 200, 50, ${s.a})`; ctxD.lineWidth = 2; ctxD.arc(s.x, s.y, s.r, 0, 6.28); ctxD.stroke(); });

    // Counters
    ctxD.font = "bold 16px Courier New";
    ctxD.textAlign = "left";

    // Parent Count
    ctxD.fillStyle = "#00ffdd";
    ctxD.fillText(`PARENTS: ${parentCount}`, 60, 70);

    // Daughter Count
    ctxD.fillStyle = "#fd0d0d";
    ctxD.fillText(`DAUGHTERS: ${daughterCount}`, 200, 70);

    // Total Mass Validation (Optional Visual Aid)
    ctxD.fillStyle = "#ffe100";
    ctxD.font = "14px Courier New";
    ctxD.fillText(`TOTAL MASS: ${atoms.length}`, w - 180, 70);

    // --- Time Slider (Right Side) ---
    const barW = 10;
    const barH = h - 80;
    const barX = w - 20;
    const barY = 40;

    // Background Track
    ctxD.fillStyle = "#1e293b";
    ctxD.fillRect(barX, barY, barW, barH);

    // Progress Fill
    const progress = (decayFrame % halfLifeFrames) / halfLifeFrames;
    const fillH = progress * barH;
    ctxD.fillStyle = "#00f3ff";
    ctxD.fillRect(barX, barY + barH - fillH, barW, fillH);

    // Half-Life Marker Text
    ctxD.fillStyle = "#fff";
    ctxD.font = "10px sans-serif";
    ctxD.fillText("t½", barX - 15, barY + barH);
    if (progress > 0.05) ctxD.fillText("Next", barX - 25, barY + barH - fillH + 4);

    // --- Half-Life Flash Overlay ---
    if (isDecayPaused) {
        // Flash Line
        ctxD.strokeStyle = "#ea580c"; // Orange for "Safety Stop"
        ctxD.lineWidth = 4;
        ctxD.shadowBlur = 20;
        ctxD.shadowColor = "#ea580c";
        ctxD.beginPath();
        ctxD.moveTo(40, h / 2);
        ctxD.lineTo(w - 40, h / 2);
        ctxD.stroke();
        ctxD.shadowBlur = 0;

        // Text
        ctxD.fillStyle = "#fff";
        ctxD.font = "bold 24px Courier New";
        ctxD.textAlign = "center";

        // Detailed Stats
        const activeCount = atoms.filter(a => !a.stable).length;
        const totalCount = atoms.length;
        const actualPercent = ((activeCount / totalCount) * 100).toFixed(1);

        ctxD.fillText("HALF-LIFE REACHED", w / 2, h / 2 - 20);

        ctxD.font = "16px Courier New";
        ctxD.fillText(`Remaining: ${activeCount} / ${totalCount} (${actualPercent}%)`, w / 2, h / 2 + 15);
        ctxD.fillText(`Target: ${(decayTargetRatio * 100).toFixed(0)}%`, w / 2, h / 2 + 40);

        ctxD.fillStyle = "#ea580c";
        ctxD.fillText("Click 'PROCEED' to continue", w / 2, h / 2 + 65);
    }
}

// ==========================================
// 5. MATH (PI - NEW VISUALIZATION)
// ==========================================
const ctxM = document.getElementById('canvas-pi').getContext('2d');
let mAnim, mRunning = false;
let mTheta = 0;
let mPoints = [];

['m-spd', 'm-zoom'].forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => document.getElementById(id + '-val').textContent = e.target.value);
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
    if (!mRunning) return;
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

    mPoints.push({ x: finalX, y: finalY });
    if (mPoints.length > 5000) mPoints.shift();

    drawMath(x1, y1, finalX, finalY);
    mAnim = requestAnimationFrame(mLoop);
}

function drawMath(x1, y1, finalX, finalY) {
    const w = ctxM.canvas.width;
    const h = ctxM.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const zoom = parseFloat(document.getElementById('m-zoom').value);
    const scale = (Math.min(w, h) / 5) * (zoom / 100);

    ctxM.clearRect(0, 0, w, h);

    // Background
    ctxM.fillStyle = "#000";
    ctxM.fillRect(0, 0, w, h);

    // Trail
    ctxM.beginPath();
    ctxM.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctxM.lineWidth = 1;
    if (mPoints.length > 0) {
        ctxM.moveTo(cx + mPoints[0].x * scale, cy + mPoints[0].y * scale);
        for (let i = 1; i < mPoints.length; i++) {
            ctxM.lineTo(cx + mPoints[i].x * scale, cy + mPoints[i].y * scale);
        }
    }
    ctxM.stroke();

    // Arms
    if (mRunning) {
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
        ctxM.beginPath(); ctxM.arc(cx + x1 * scale, cy + y1 * scale, 3, 0, 6.28); ctxM.fill();
        ctxM.fillStyle = "#ffd700";
        ctxM.beginPath(); ctxM.arc(cx + finalX * scale, cy + finalY * scale, 4, 0, 6.28); ctxM.fill();
    }

    ctxM.font = "20px Courier New";
    ctxM.fillStyle = "#fff";
    ctxM.fillText("z(θ) = e^{iθ} + e^{iπθ}", 20, h - 30);
}

// Theory Data
const theoryData = {
    shm: {
        title: "Simple Harmonic Motion",
        html: `<h3>Principle</h3><p>SHM is the projection of uniform circular motion onto a diameter.</p><div class="formula-box">x(t) = A cos(ωt)</div><h3>Instructions</h3><ol><li>Set Amplitude (Radius).</li><li>Set Frequency (Speed).</li><li>Watch the shadow trace a sine wave.</li></ol>`,
        videoId: "jxstE6A_CYQ" // Example: MIT Physics
    },
    gravity: {
        title: "Gravity Assist (Slingshot)",
        html: `
            <h3>Mechanism</h3>
            <p>A spacecraft can gain velocity by "stealing" a tiny amount of angular momentum from a planet as it flies by. This is known as a <strong>Gravity Assist</strong> or Slingshot Maneuver.</p>
            
            <h3>Vector Math</h3>
            <p>In the <strong>Planet's Frame</strong> of reference, the spacecraft enters and leaves with the same speed (v<sub>in</sub> = v<sub>out</sub>), only the direction changes.</p>
            <p>However, in the <strong>Sun's Frame</strong>, we add the Planet's orbital velocity (<strong>U</strong>):</p>
            <div class="formula-box">
                <b>v</b><sub>final</sub> ≈ <b>v</b><sub>initial</sub> + 2<b>U</b>
            </div>
            
            <h3>Oberth Effect</h3>
            <p>Rocket burns are more efficient at high speeds (periapsis) because Kinetic Energy scales with v<sup>2</sup>.</p>
            <div class="formula-box">
                 ΔE = v · Δv
            </div>
        `,
        videoId: "0iAGrdITIiE" // Example: Gravity Assist
    },
    decay: {
        title: "Nuclear Decay",
        html: `<h3>Principle</h3><p>Nuclear decay is a random, spontaneous process where unstable atomic nuclei lose energy by emitting radiation—primarily alpha, beta, or gamma particles—to achieve a more stable, lower-energy state.
        <p><div class="formula-box">N(t) = N₀e^(-λt)</div></p>`,
        videoId: "P_SD5Rt6XMk" // Example: Radioactive Decay
    },
    pi: {
        title: "Irrationality of Pi",
        html: `<h3>Mathematical Principle</h3><p>This visualization plots the sum of two rotating vectors: one rotating at speed <strong>1</strong>, and the other at speed <strong>π</strong>.</p><div class="formula-box">z(θ) = e^{iθ} + e^{iπθ}</div><p>Because <strong>π</strong> is an irrational number, the ratio of the two speeds is irrational. This means the two arms will <strong>never</strong> return to their starting configuration simultaneously. Consequently, the drawing path never closes and will eventually fill the entire annulus area without ever repeating.</p>`,
        videoId: "Lk_QF_hcM8A" // Example: Pi
    }
};

function toggleTheory() {
    const modal = document.getElementById('theory-modal');
    const data = theoryData[activeModule];
    document.getElementById('theory-title').textContent = data.title;

    let content = data.html;

    // Add Video Section if videoId exists
    if (data.videoId) {
        content += `
            <div class="video-container" onclick="loadVideo(this, '${data.videoId}')">
                <img class="video-thumbnail" src="https://img.youtube.com/vi/${data.videoId}/mqdefault.jpg" alt="Video Thumbnail">
                <div class="play-btn">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                </div>
            </div>
        `;
    }

    document.getElementById('theory-body').innerHTML = content;
    modal.style.display = (modal.style.display === 'flex') ? 'none' : 'flex';
}

function loadVideo(container, videoId) {
    container.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}

function closeTheory() { document.getElementById('theory-modal').style.display = 'none'; }

// --- Event Listeners for Dynamic Labels ---
document.getElementById('d-num').addEventListener('input', function (e) {
    document.getElementById('d-num-val').textContent = e.target.value;
});

document.getElementById('d-prob').addEventListener('input', function (e) {
    const val = parseFloat(e.target.value);
    let label = "Low";
    if (val >= 0.02) label = "Medium";
    if (val >= 0.04) label = "High";
    document.getElementById('d-prob-val').textContent = label + " (" + val + ")";
});
setSubject('physics', document.querySelector('.subject-btn.active'));
