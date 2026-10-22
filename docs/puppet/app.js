'use strict';
(() => {
  const $ = id => document.getElementById(id), ids = ['eyeL', 'eyeR', 'mouth', 'roll'];
  const canvas = $('avatar'), ctx = canvas.getContext('2d'), video = $('video');
  const neutral = () => ({eyeL: 1, eyeR: 1, mouth: 0, roll: 0});
  let rig, mode = 'manual', target = neutral(), shown = neutral(), stream, tracker;
  let starting = false, inFlight = false, session = 0, lastVideoTime = -1, lastTrack = 0, lastFace = 0;
  let baseline, samples = [], calibrating = false, lastTick = performance.now(), reportAt = 0, trackCount = 0;
  let demoStart = 0, lastReportTime = 0;
  const pinned = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/';
  function say(message) { $('status').textContent = message; }
  function updateValues() {
    for (const id of ids) {
      const value = id === 'roll' ? shown[id] * 180 / Math.PI : shown[id];
      $(id + 'Value').textContent = id === 'roll' ? value.toFixed(1) + '°' : value.toFixed(2);
      if (mode !== 'manual') $(id).value = value;
    }
  }
  function setMode(next) {
    mode = next;
    for (const id of ['manual', 'demo', 'camera']) $(id).classList.toggle('active', id === next);
    if (next === 'manual') say('手动模式 · 拖动眼睛、嘴巴滑块，检查图层效果。');
    if (next === 'demo') { demoStart = performance.now(); say('自动演示 · 这是预设动作，未跟踪你的表情。'); }
  }
  function resetManual() {
    setMode('manual'); target = neutral();
    for (const id of ids) $(id).value = target[id];
  }
  function closeCamera() {
    session++; if (stream) stream.getTracks().forEach(t => t.stop());
    stream = null; video.srcObject = null; baseline = null; calibrating = false;
    $('stop').disabled = $('calibrate').disabled = true;
    if (mode === 'camera') { resetManual(); say('摄像头已关闭，已回到手动模式。'); }
  }
  function beginCalibration() {
    samples = []; baseline = null; calibrating = true; target = neutral();
    say('正在校准：请保持正面、睁眼、闭嘴约 1 秒。');
  }
  function median(values) { const s = values.slice().sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; }
  function consume(points) {
    if (!stream || mode !== 'camera') return;
    const raw = PortraitRig.extractPose(points, video.videoHeight / video.videoWidth || .75); if (!raw) return;
    if (!Object.values(raw).every(Number.isFinite)) return;
    lastFace = performance.now(); trackCount++;
    if (calibrating) {
      samples.push(raw);
      if (samples.length >= 18) {
        baseline = Object.fromEntries(ids.map(id => [id, median(samples.map(x => x[id]))]));
        if (baseline.eyeL < .06 || baseline.eyeR < .06) { samples = []; say('校准时没有看清睁眼状态，请正视镜头并检查反光。'); return; }
        calibrating = false; say('摄像头驱动中 · 试试眨眼、张嘴和轻微歪头。');
      }
    } else if (baseline) target = PortraitRig.mapPose(raw, baseline);
  }
  async function loadTracker() {
    if (tracker) return;
    if (!window.FaceMesh) await new Promise((resolve, reject) => {
      const s = document.createElement('script'); s.src = pinned + 'face_mesh.js'; s.crossOrigin = 'anonymous';
      const timeout = setTimeout(() => { s.remove(); reject(Error('跟踪组件下载超时。可先使用手动滑块或自动演示，再检查网络后重试。')); }, 30000);
      s.onload = () => { clearTimeout(timeout); resolve(); };
      s.onerror = () => { clearTimeout(timeout); s.remove(); reject(Error('无法下载跟踪组件。请检查网络；手动滑块仍可使用。')); };
      document.head.appendChild(s);
    });
    tracker = new FaceMesh({locateFile: file => pinned + file});
    tracker.setOptions({maxNumFaces: 1, refineLandmarks: false, minDetectionConfidence: .5, minTrackingConfidence: .5});
    tracker.onResults(result => consume(result.multiFaceLandmarks?.[0]));
  }
  async function startCamera() {
    if (!rig || starting) return;
    if (stream) { setMode('camera'); beginCalibration(); return; }
    starting = true; $('camera').disabled = true; const token = ++session;
    say('正在加载跟踪组件并请求摄像头…');
    try {
      await loadTracker(); if (token !== session) return;
      if (!navigator.mediaDevices?.getUserMedia) throw Error('请使用 localhost 地址，并允许摄像头权限。');
      const acquired = await navigator.mediaDevices.getUserMedia({audio: false, video: {width: {ideal: 640}, height: {ideal: 480}, frameRate: {ideal: 30}}});
      if (token !== session) { acquired.getTracks().forEach(t => t.stop()); return; }
      stream = acquired; video.srcObject = stream; await video.play();
      if (token !== session) return;
      $('stop').disabled = $('calibrate').disabled = false;
      lastVideoTime = -1; lastFace = performance.now(); trackCount = 0; lastReportTime = performance.now();
      setMode('camera'); beginCalibration();
    } catch (error) {
      closeCamera(); setMode('manual');
      const messages = {NotAllowedError: '摄像头权限未获允许。请在地址栏设置权限，或先使用手动模式。', NotFoundError: '没有找到摄像头，可先使用手动模式。', NotReadableError: '摄像头可能被其他程序占用。'};
      say(messages[error.name] || error.message); console.error(error);
    } finally { starting = false; $('camera').disabled = false; }
  }
  function animate(now) {
    const dt = Math.min(100, Math.max(0, now - lastTick)); lastTick = now;
    if (mode === 'demo') {
      const t = (now - demoStart) / 1000, blink = Math.pow(Math.max(0, Math.cos(t * 2.3)), 45);
      target = {eyeL: 1 - blink, eyeR: 1 - blink, mouth: Math.max(0, Math.sin(t * 4.6)) * .85, roll: Math.sin(t * .8) * .065};
    }
    if (mode === 'camera' && stream) {
      if (now - lastFace > 600) { target = neutral(); if (now - lastFace > 1500) say('暂未检测到人脸 · 请回到镜头前，画像保持中性表情。'); }
      if (!inFlight && video.readyState >= 2 && now - lastTrack >= 50 && video.currentTime !== lastVideoTime) {
        lastTrack = now; lastVideoTime = video.currentTime; inFlight = true;
        Promise.resolve().then(() => tracker.send({image: video})).catch(error => {
          closeCamera(); say('跟踪运行失败：' + error.message + '。可先使用手动滑块。'); console.error(error);
        }).finally(() => { inFlight = false; });
      }
      if (baseline && now - lastFace < 600 && now - lastReportTime > 1500) {
        say(`摄像头驱动中 · 跟踪 ${Math.round(trackCount * 1000 / (now - lastReportTime))} 次/秒`);
        trackCount = 0; lastReportTime = now;
      }
    }
    for (const id of ids) {
      const tau = id.startsWith('eye') ? 25 : 65;
      shown[id] += (target[id] - shown[id]) * (1 - Math.exp(-dt / tau));
    }
    if (rig) rig.render(ctx, shown, canvas.width, canvas.height);
    if (now - reportAt > 100) { updateValues(); reportAt = now; }
    requestAnimationFrame(animate);
  }
  for (const id of ids) $(id).addEventListener('input', () => {
    setMode('manual'); target = Object.fromEntries(ids.map(name => [name, Number($(name).value) * (name === 'roll' ? Math.PI / 180 : 1)]));
  });
  $('manual').onclick = () => { setMode('manual'); target = {...shown}; };
  $('demo').onclick = () => setMode('demo'); $('camera').onclick = startCamera;
  $('reset').onclick = resetManual; $('stop').onclick = closeCamera;
  $('calibrate').onclick = () => { setMode('camera'); beginCalibration(); };
  $('save').onclick = () => { if (!rig) return; const a = document.createElement('a'); a.download = 'my-cartoon-portrait.png'; a.href = canvas.toDataURL('image/png'); a.click(); };
  window.addEventListener('pagehide', closeCamera);
  const loadImage = src => new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(Error('画像素材加载失败：' + src)); img.src = src; });
  Promise.all([loadImage('./portrait.webp'), loadImage('./clean.webp')]).then(([portrait, clean]) => {
    rig = PortraitRig.createRig(portrait, clean); $('fps').textContent = '静态素材 + 活动图层';
    setMode('manual'); requestAnimationFrame(animate);
  }).catch(error => { say(error.message); $('fps').textContent = '加载失败'; console.error(error); });
})();
