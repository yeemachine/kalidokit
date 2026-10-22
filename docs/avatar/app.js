'use strict';
(()=>{
  const $=id=>document.getElementById(id),A=FlatAvatar;
  const canvas=$('avatar'),ctx=canvas.getContext('2d'),video=$('video');
  const poseFields=['eyeL','eyeR','mouth','smile','yaw','pitch','roll','gazeX'];
  const lookFields=['hairStyle','hairColor','skinTone','shirtColor','glasses','glassesShape','faceWidth','hairVolume'];
  let appearance=A.sanitize(),mode='manual',target=A.neutral(),shown=A.neutral(),stream=null,tracker=null,loadPromise=null;
  let lastTick=performance.now(),lastUI=0,startAt=0,lastSent=0,lastVideo=-1,lastFace=0;
  let latestPoints=null,pendingFrame=null,purpose='live',frameResult=null,starting=false,generating=false,epoch=0;
  let baseline={},calibration=[],calibrating=false,frameCount=0,lastReport=0;
  const mediaRoot='https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/';
  const say=text=>$('status').textContent=text;
  try{const stored=localStorage.getItem('flat-avatar-v2');if(stored){appearance=A.sanitize(JSON.parse(stored));$('origin').textContent='当前：已保存的角色参数。';}}catch{}
  function syncLook(){for(const name of lookFields)if(name==='glasses')$(name).checked=appearance[name];else $(name).value=appearance[name];}
  function remember(){try{localStorage.setItem('flat-avatar-v2',JSON.stringify(appearance));}catch{}}
  function setMode(next){mode=next;for(const id of ['manual','demo','camera'])$(id).classList.toggle('active',id===next);if(next==='manual')say('手动控制 · 滑块改变眼睑、嘴型和姿态的曲线。');if(next==='demo'){startAt=performance.now();say('自动演示 · 预设表情与转头，不代表正在跟踪。');}}
  function reset(){target=A.neutral();setMode('manual');syncPose();}
  function syncPose(){for(const name of poseFields){$(name).value=shown[name];$(name+'Value').textContent=shown[name].toFixed(2);}}
  function stop(){epoch++;if(stream)stream.getTracks().forEach(track=>track.stop());stream=null;video.srcObject=null;latestPoints=null;baseline={};calibrating=false;$('capture').disabled=$('calibrate').disabled=$('stop').disabled=true;if(mode==='camera'){reset();say('摄像头已关闭。');}updateEngine();}
  function calibrate(){calibration=[];baseline={};calibrating=true;target=A.neutral();say('正在校准：请正视镜头、睁眼、闭嘴约一秒。');}
  const median=list=>list.slice().sort((a,b)=>a-b)[Math.floor(list.length/2)];
  function receive(results){
    frameResult=results.multiFaceLandmarks?.[0]||null;
    if(purpose!=='live'||!stream)return;
    if(!frameResult)return;
    latestPoints=frameResult.map(p=>({...p}));lastFace=performance.now();frameCount++;
    if(mode!=='camera')return;
    // Face.solve mutates its landmark argument into pixel coordinates. Always
    // pass a fresh copy; capture and appearance estimation keep normalized data.
    const solved=A.solveFace(latestPoints,{width:video.videoWidth,height:video.videoHeight},Kalidokit);
    if(!solved)return;
    if(![solved.head?.x,solved.head?.y,solved.head?.z,solved.mouth?.x,solved.mouth?.y].every(Number.isFinite))return;
    if(calibrating){
      calibration.push({yaw:solved.head.y,pitch:solved.head.x,roll:solved.head.z,mouth:solved.mouth.y,smile:solved.mouth.x,brow:solved.brow});
      if(calibration.length>=18){baseline=Object.fromEntries(Object.keys(calibration[0]).map(k=>[k,median(calibration.map(x=>x[k]))]));calibrating=false;say('面捕已就绪 · 试试转头、眨眼、张嘴和移动视线。');}
    }else target=A.fromKalido(solved,baseline);
  }
  async function loadTracker(){
    if(tracker)return;if(loadPromise)return loadPromise;
    loadPromise=(async()=>{
      if(!window.FaceMesh)await new Promise((resolve,reject)=>{
        const script=document.createElement('script');script.src=mediaRoot+'face_mesh.js';script.crossOrigin='anonymous';
        const timeout=setTimeout(()=>{script.remove();reject(Error('跟踪组件下载超时，请检查网络后重试。'));},30000);
        script.onload=()=>{clearTimeout(timeout);resolve();};script.onerror=()=>{clearTimeout(timeout);script.remove();reject(Error('跟踪组件下载失败；手动与演示模式仍可使用。'));};document.head.appendChild(script);
      });
      if(!window.Kalidokit?.Face)throw Error('KalidoKit 未加载，请重新更新仓库。');
      tracker=new FaceMesh({locateFile:file=>mediaRoot+file});tracker.setOptions({maxNumFaces:1,refineLandmarks:true,minDetectionConfidence:.5,minTrackingConfidence:.5});tracker.onResults(receive);
    })();
    try{await loadPromise;}catch(error){tracker=null;throw error;}finally{loadPromise=null;}
  }
  async function send(image,kind){purpose=kind;frameResult=null;await tracker.send({image});return frameResult?frameResult.map(p=>({...p})):null;}
  function updateEngine(){ $('engine').textContent=mode==='camera'&&stream?'MediaPipe + KalidoKit':mode==='demo'?'曲线变形 · 自动演示':'曲线变形 · 手动'; }
  async function startCamera(){
    if(starting||generating)return;if(stream){setMode('camera');calibrate();updateEngine();return;}
    starting=true;$('camera').disabled=true;const token=++epoch;say('正在加载面捕组件并请求摄像头…');
    try{
      await loadTracker();if(token!==epoch)return;
      if(!navigator.mediaDevices?.getUserMedia)throw Error('请通过 localhost 打开页面并允许摄像头权限。');
      const acquired=await navigator.mediaDevices.getUserMedia({audio:false,video:{width:{ideal:640},height:{ideal:480},frameRate:{ideal:30}}});
      if(token!==epoch){acquired.getTracks().forEach(t=>t.stop());return;}stream=acquired;video.srcObject=stream;await video.play();
      if(token!==epoch)return;
      $('capture').disabled=$('calibrate').disabled=$('stop').disabled=false;lastVideo=-1;lastFace=performance.now();frameCount=0;lastReport=lastFace;
      setMode('camera');calibrate();updateEngine();
    }catch(error){stop();setMode('manual');say(error.name==='NotAllowedError'?'摄像头权限未获允许，可先使用自动演示。':error.message);console.error(error);}finally{starting=false;$('camera').disabled=false;}
  }
  function snapshot(source){const out=document.createElement('canvas');const iw=source.videoWidth||source.naturalWidth||source.width,ih=source.videoHeight||source.naturalHeight||source.height;
    if(!iw||!ih)throw Error('照片尚未准备好。');out.width=Math.min(640,iw);out.height=Math.round(out.width*ih/iw);out.getContext('2d').drawImage(source,0,0,out.width,out.height);return out;}
  async function generateFrom(source){
    if(generating||starting)return;generating=true;$('capture').disabled=true;$('upload').disabled=true;say('正在检测照片中的人脸并生成角色…');
    try{
      const photo=snapshot(source);await loadTracker();if(pendingFrame)await pendingFrame;
      const points=await send(photo,'capture');if(!points)throw Error('照片中没有检测到清晰人脸，请使用正面、单人照片。');
      const pixels=photo.getContext('2d').getImageData(0,0,photo.width,photo.height).data;
      let candidate=A.estimateAppearance(points,photo.width,photo.height,pixels,appearance);
      const dataURL=photo.toDataURL('image/jpeg',.86);let ai=false,warning='';
      if($('useAI').checked){
        say('正在通过 DeepSeek 分析发型、眼镜和外观…');
        try{
          const response=await fetch('/api/appearance',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:dataURL}),signal:AbortSignal.timeout(75000)});
          const result=await response.json();if(!response.ok)throw Error(result.error||'外观分析失败');
          // Geometry comes from measured landmarks; the AI contributes bounded
          // appearance choices, never executable drawing code.
          candidate=A.sanitize({...candidate,...result.appearance,faceWidth:candidate.faceWidth,jawWidth:candidate.jawWidth,eyeSpacing:candidate.eyeSpacing});ai=true;
        }catch(error){warning=' DeepSeek 分析未成功，本次使用本地比例生成。';$('apiStatus').textContent=warning+' '+error.message;console.warn(error.message);}
      }
      appearance=candidate;syncLook();remember();$('snapshot').src=dataURL;$('snapshot').style.display='block';
      $('origin').textContent=ai?'当前：照片测量比例 + DeepSeek 外观分析生成。':'当前：照片测量比例与近似肤色生成；发型和眼镜沿用设置，可手动调整。';
      say('角色已生成。'+(ai?'可以继续面捕或微调形象。':'本地模式尚不自动识别发型和眼镜，可展开“微调形象”。')+warning);
      if(mode==='camera')calibrate();
    }catch(error){say(error.message);console.error(error);}finally{generating=false;$('capture').disabled=!stream;$('upload').disabled=false;}
  }
  function tick(now){
    const dt=Math.max(0,Math.min(100,now-lastTick));lastTick=now;
    if(mode==='demo'){
      const t=(now-startAt)/1000,blink=Math.exp(-Math.pow(((t%3.2)-.8)/.065,2));
      target=A.pose({eyeL:1-blink,eyeR:1-blink,mouth:Math.max(0,Math.sin(t*5))*.8,smile:.35,yaw:Math.sin(t*.9)*.72,pitch:Math.sin(t*.63)*.35,roll:Math.sin(t*.75)*.28,gazeX:Math.sin(t*1.2)*.6,gazeY:Math.sin(t*.7)*.25,brow:Math.max(0,Math.sin(t*.8))*.3,pucker:Math.max(0,Math.sin(t*3))*.5});
    }
    if(stream&&!generating){
      if(mode==='camera'&&now-lastFace>700){target=A.neutral();if(now-lastFace>1600)say('暂未看清人脸，角色回到中性表情。请面对镜头。');}
      if(!pendingFrame&&video.readyState>=2&&now-lastSent>=50&&video.currentTime!==lastVideo){
        lastSent=now;lastVideo=video.currentTime;
        pendingFrame=send(video,'live').catch(error=>{stop();say('面捕失败：'+error.message);console.error(error);}).finally(()=>pendingFrame=null);
      }
      if(mode==='camera'&&!calibrating&&now-lastFace<700&&now-lastReport>2000){say('面捕驱动中 · '+Math.round(frameCount*1000/(now-lastReport))+' 次/秒');frameCount=0;lastReport=now;}
    }
    for(const key in shown){const tau=key.startsWith('eye')?20:key==='mouth'?45:85;shown[key]+=(target[key]-shown[key])*(1-Math.exp(-dt/tau));}
    A.render(ctx,appearance,shown,canvas.width,canvas.height);
    if(now-lastUI>100){if(mode!=='manual')syncPose();else for(const name of poseFields)$(name+'Value').textContent=shown[name].toFixed(2);lastUI=now;}
    requestAnimationFrame(tick);
  }
  for(const name of poseFields)$(name).addEventListener('input',()=>{setMode('manual');target=A.pose({...shown,...Object.fromEntries(poseFields.map(k=>[k,Number($(k).value)]))});updateEngine();});
  for(const name of lookFields)$(name).addEventListener('input',()=>{appearance=A.sanitize({...appearance,[name]:name==='glasses'?$(name).checked:['faceWidth','hairVolume'].includes(name)?Number($(name).value):$(name).value});remember();});
  $('manual').onclick=()=>{setMode('manual');target={...shown};syncPose();updateEngine();};$('demo').onclick=()=>{setMode('demo');updateEngine();};$('camera').onclick=startCamera;
  $('reset').onclick=()=>{reset();syncPose();updateEngine();};$('stop').onclick=stop;$('calibrate').onclick=()=>{setMode('camera');calibrate();updateEngine();};
  $('capture').onclick=()=>generateFrom(video);
  $('upload').onchange=async event=>{const file=event.target.files[0];if(!file)return;if(file.size>12*1024*1024){say('请上传小于 12 MB 的照片。');event.target.value='';return;}const url=URL.createObjectURL(file);try{const img=new Image();img.src=url;await img.decode();await generateFrom(img);}catch(error){say('无法读取照片：'+error.message);}finally{URL.revokeObjectURL(url);event.target.value='';}};
  $('defaultLook').onclick=()=>{appearance=A.sanitize();syncLook();remember();$('origin').textContent='当前：默认角色，尚未从照片生成。';};
  function download(href,name){const a=document.createElement('a');a.href=href;a.download=name;a.click();}
  $('savePNG').onclick=()=>download(canvas.toDataURL('image/png'),'my-flat-avatar.png');
  $('saveConfig').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({version:2,appearance},null,2)],{type:'application/json'}));download(url,'my-avatar.json');setTimeout(()=>URL.revokeObjectURL(url),1000);};
  window.addEventListener('pagehide',stop);
  fetch('/api/status').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
    $('useAI').disabled=!data.configured;$('apiStatus').textContent=data.configured?'DeepSeek 已配置。勾选后，拍照或上传生成时才发送该照片。':'DeepSeek 未配置：可先使用本地拍照生成和全部动画功能。';
  }).catch(()=>{$('apiStatus').textContent='当前是纯静态服务。运行 python run_avatar.py 后可配置 DeepSeek；本地生成和动画仍可用。';});
  syncLook();requestAnimationFrame(tick);
})();
