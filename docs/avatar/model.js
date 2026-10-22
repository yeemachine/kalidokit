(function(root){
  'use strict';
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number.isFinite(Number(v))?Number(v):a));
  const defaults={skinTone:'#fac7a5',hairColor:'#252426',hairStyle:'wavy',hairVolume:1.12,faceWidth:1,jawWidth:.94,faceLength:1,eyeSize:1,eyeSpacing:1,browThickness:1,glasses:true,glassesShape:'rounded',glassesColor:'#19191b',shirtColor:'#28282b'};
  function sanitize(input={}){
    const out={...defaults};
    for(const key of ['skinTone','hairColor','glassesColor','shirtColor'])if(/^#[0-9a-f]{6}$/i.test(input[key]||''))out[key]=input[key];
    for(const [key,lo,hi] of [['hairVolume',.8,1.4],['faceWidth',.82,1.2],['jawWidth',.75,1.18],['faceLength',.86,1.15],['eyeSize',.7,1.4],['eyeSpacing',.85,1.2],['browThickness',.7,1.5]])if(typeof input[key]==='number')out[key]=clamp(input[key],lo,hi);
    if(typeof input.glasses==='boolean')out.glasses=input.glasses;
    if(['wavy','short','straight'].includes(input.hairStyle))out.hairStyle=input.hairStyle;
    if(['rounded','round'].includes(input.glassesShape))out.glassesShape=input.glassesShape;
    return out;
  }
  const neutral=()=>({eyeL:1,eyeR:1,mouth:0,smile:0,pucker:0,yaw:0,pitch:0,roll:0,gazeX:0,gazeY:0,brow:0});
  function pose(values={}){const p=neutral();for(const key in p)if(Number.isFinite(values[key]))p[key]=clamp(values[key],['eyeL','eyeR','mouth','pucker'].includes(key)?0:-1,1);return p;}
  function shade(hex,factor){return '#'+[1,3,5].map(i=>Math.round(clamp(parseInt(hex.slice(i,i+2),16)*factor,0,255)).toString(16).padStart(2,'0')).join('');}
  function render(ctx,appearance,values,w,h){
    const a=sanitize(appearance),p=pose(values);ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#fbf0d9';ctx.fillRect(0,0,w,h);
    const scale=Math.min(w/600,h/680);ctx.save();ctx.translate((w-600*scale)/2,(h-680*scale)/2);ctx.scale(scale,scale);
    ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#111112';ctx.lineWidth=5;
    function draw(commands,fill,stroke=true){ctx.beginPath();for(const [op,...args] of commands)ctx[op](...args);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke)ctx.stroke();}
    // The torso stays put. Only the head group is rotated at the neck pivot.
    draw([['moveTo',68,680],['lineTo',84,590],['quadraticCurveTo',95,548,190,526],['lineTo',255,500],['lineTo',345,500],['lineTo',410,526],['quadraticCurveTo',505,548,516,590],['lineTo',532,680],['closePath']],a.shirtColor);
    draw([['moveTo',257,436],['lineTo',251,520],['lineTo',300,566],['lineTo',349,520],['lineTo',343,436],['closePath']],a.skinTone);
    draw([['moveTo',259,446],['lineTo',341,446],['lineTo',346,482],['quadraticCurveTo',299,510,254,490],['closePath']],shade(a.skinTone,.88),false);
    draw([['moveTo',251,510],['lineTo',300,554],['lineTo',350,510],['lineTo',385,680],['lineTo',215,680],['closePath']],'#fffaf1');
    draw([['moveTo',251,510],['lineTo',227,535],['lineTo',260,583],['lineTo',300,554]],'#fffaf1');
    draw([['moveTo',350,510],['lineTo',373,535],['lineTo',340,583],['lineTo',300,554]],'#fffaf1');
    draw([['moveTo',222,524],['lineTo',197,581],['lineTo',222,595],['lineTo',197,612],['lineTo',241,680]],a.shirtColor);
    draw([['moveTo',378,524],['lineTo',403,581],['lineTo',378,595],['lineTo',403,612],['lineTo',359,680]],a.shirtColor);
    ctx.save();ctx.translate(300,456);ctx.rotate(p.roll*.24);ctx.translate(0,-164);
    const yaw=p.yaw*.43,pitch=p.pitch*.28;
    function point(x,y,z=0){
      x*=a.faceWidth;y*=a.faceLength;
      y+=Math.max(0,y-25)/140*p.mouth*5;
      const X=x*Math.cos(yaw)+z*Math.sin(yaw),Z=z*Math.cos(yaw)-x*Math.sin(yaw);
      const Y=y*Math.cos(pitch)-Z*Math.sin(pitch);
      return [X,Y+14*p.pitch];
    }
    function path(commands,fill,stroke=true,z=0){const out=commands.map(([op,...args])=>{const t=[];for(let i=0;i<args.length;i+=2)t.push(...point(args[i],args[i+1],z));return [op,...t]});draw(out,fill,stroke);}
    const ear=(side)=>path([['moveTo',side*118,-8],['bezierCurveTo',side*157,-35,side*161,52,side*124,63],['closePath']],a.skinTone,true,-10);
    ear(-1);ear(1);
    path([['moveTo',0,-150],['bezierCurveTo',90,-155,133,-112,133,-29],['bezierCurveTo',137,48,105,113,64*a.jawWidth,143],['quadraticCurveTo',0,188,-64*a.jawWidth,143],['bezierCurveTo',-105,113,-137,48,-133,-29],['bezierCurveTo',-133,-112,-90,-155,0,-150],['closePath']],a.skinTone);
    // Jaw and cheeks deform gently together when opening the mouth.
    // The mouth itself is a continuous Bezier opening, without moving patches.
    function eye(side,open){
      const x=side*54*a.eyeSpacing,y=-2,ex=17*a.eyeSize,ey=12*a.eyeSize;
      const upper=-ey*open,lower=ey*.65*open;
      ctx.save();ctx.beginPath();
      const start=point(x-ex,y,20);ctx.moveTo(...start);
      ctx.quadraticCurveTo(...point(x,y+upper*1.7,20),...point(x+ex,y,20));
      ctx.quadraticCurveTo(...point(x,y+lower*1.7,20),...start);ctx.clip();
      const pupil=point(x+p.gazeX*6,y-p.gazeY*4,21);
      ctx.fillStyle='#101011';ctx.beginPath();ctx.ellipse(pupil[0],pupil[1],6.5*a.eyeSize*Math.cos(yaw),10*a.eyeSize,0,0,Math.PI*2);ctx.fill();ctx.restore();
      if(open<.65){ctx.lineWidth=3.1;path([['moveTo',x-ex,y],['quadraticCurveTo',x,y+upper*1.7+5*(1-open),x+ex,y]],null,true,20);}
      const by=-29-p.brow*10-Math.max(0,p.smile)*2;
      ctx.lineWidth=5*a.browThickness;
      path([['moveTo',x-20,by+2],['quadraticCurveTo',x,by-7,x+20,by]],null,true,22);ctx.lineWidth=5;
    }
    eye(-1,p.eyeL);eye(1,p.eyeR);
    ctx.lineWidth=4.5;
    path([['moveTo',4,8],['quadraticCurveTo',12,37,7,48],['quadraticCurveTo',4,53,-6,54]],null,true,35);
    const mw=23*(1-p.pucker*.36)*(1+p.smile*.18),my=91,corner=my-p.smile*9;
    const openHeight=2+p.mouth*40;
    if(p.mouth>.025){
      const mouthShape=[['moveTo',-mw,corner],['quadraticCurveTo',0,my-4-p.pucker*5,mw,corner],['bezierCurveTo',mw*.9,my+openHeight, -mw*.9,my+openHeight,-mw,corner],['closePath']];
      ctx.save();path(mouthShape,'#522a2c',true,22);ctx.clip();
      path([['moveTo',-mw,corner-1],['lineTo',mw,corner-1],['lineTo',mw,my+7],['quadraticCurveTo',0,my+12,-mw,my+7],['closePath']],'#fff6e5',false,22);
      path([['moveTo',-mw*.7,my+openHeight],['quadraticCurveTo',0,my+openHeight-20,mw*.7,my+openHeight],['closePath']],'#e88b89',false,22);ctx.restore();
    }else path([['moveTo',-mw,corner],['quadraticCurveTo',0,my+p.smile*12,mw,corner]],null,true,22);
    ctx.lineWidth=5;
    // A deliberately limited set of broad hair masses follows the style reference.
    const hv=a.hairVolume*(a.hairStyle==='short'?.82:1),hy=y=>y < -100 ? -100+(y+100)*hv : y;
    const hair=[['moveTo',-123,13],['quadraticCurveTo',-140,-26,-134,-47],['quadraticCurveTo',-166,-57,-143,-101],['quadraticCurveTo',-164,-145,-116,-159],['quadraticCurveTo',-126,-198,-73,-203],['quadraticCurveTo',-54,-243,-11,-218],['quadraticCurveTo',25,-252,68,-219],['quadraticCurveTo',117,-227,129,-188],['quadraticCurveTo',164,-177,151,-145],['quadraticCurveTo',183,-120,151,-92],['quadraticCurveTo',172,-68,135,-40],['lineTo',126,18],['lineTo',114,-45],['quadraticCurveTo',81,-36,57,-71],['quadraticCurveTo',27,-53,10,-123],['quadraticCurveTo',-15,-77,-45,-66],['quadraticCurveTo',-70,-52,-110,-60],['closePath']];
    if(a.hairStyle==='straight'){
      path([['moveTo',-126,7],['lineTo',-139,-122],['quadraticCurveTo',-131,-219,-18,-217],['quadraticCurveTo',114,-227,142,-139],['lineTo',128,12],['lineTo',112,-65],['lineTo',61,-65],['lineTo',56,-99],['lineTo',38,-61],['lineTo',-12,-69],['lineTo',-21,-102],['lineTo',-42,-66],['lineTo',-113,-59],['closePath']].map(([op,...args])=>[op,...args.map((v,i)=>i%2?hy(v):v)]),a.hairColor,true,3);
    }else path(hair.map(([op,...args])=>[op,...args.map((v,i)=>i%2?hy(v):v)]),a.hairColor,true,3);
    if(a.glasses){
      ctx.strokeStyle=a.glassesColor;ctx.lineWidth=3.8;
      const lens=(s)=>{
        const x=s*57,ww=a.glassesShape==='round'?43:49,hh=a.glassesShape==='round'?43:38;
        path([['moveTo',x-ww,-25],['bezierCurveTo',x-ww-5,-47,x+ww,-46,x+ww,-23],['bezierCurveTo',x+ww+2,hh,x-ww-1,hh,x-ww,-25],['closePath']],null,true,27);
      };lens(-1);lens(1);
      path([['moveTo',-8,-23],['quadraticCurveTo',0,-29,8,-23]],null,true,28);
      path([['moveTo',-106,-23],['lineTo',-128,-29]],null,true,12);path([['moveTo',106,-23],['lineTo',128,-29]],null,true,12);
    }
    ctx.restore();ctx.restore();
  }
  function fromKalido(result,baseline={}){
    if(!result)return neutral();const r=result,b=baseline;
    // KalidoKit labels the eye at landmarks 130/133 'l'. The preview is mirrored,
    // so the displayed left eye uses the opposite image-side landmark group.
    return pose({eyeL:clamp(r.eye?.r??1,0,1),eyeR:clamp(r.eye?.l??1,0,1),
      mouth:clamp(((r.mouth?.y||0)-(b.mouth||0)-.015)*1.35,0,1),
      smile:clamp(((r.mouth?.x||0)-(b.smile||0))*.7,-.6,1),pucker:clamp((r.mouth?.shape?.O||0)+(r.mouth?.shape?.U||0),0,1),
      yaw:clamp(-((r.head?.y||0)-(b.yaw||0))*2.2,-1,1),pitch:clamp(((r.head?.x||0)-(b.pitch||0))*2.4,-1,1),roll:clamp(-((r.head?.z||0)-(b.roll||0))*3,-1,1),
      gazeX:clamp(r.pupil?.x||0,-1,1),gazeY:clamp(r.pupil?.y||0,-1,1),brow:clamp((r.brow||0)-(b.brow||0),-.7,1)});
  }
  function estimateAppearance(points,width,height,rgba,current={}){
    const a=sanitize(current);if(!points||points.length<468)return a;
    const d=(i,j)=>Math.hypot((points[i].x-points[j].x)*width,(points[i].y-points[j].y)*height);
    const faceHeight=d(10,152),faceWidth=d(234,454);
    if(faceHeight<10||faceWidth<10)return a;
    a.faceWidth=clamp(faceWidth/faceHeight/.79,.82,1.2);
    a.eyeSpacing=clamp(d(33,263)/faceWidth/.57,.85,1.2);
    a.jawWidth=clamp(d(172,397)/faceWidth/ .87,.75,1.18);
    if(rgba){
      const colors=[];
      for(const i of [50,280,151]){const x=Math.round(points[i].x*width),y=Math.round(points[i].y*height);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){
        const xx=x+dx,yy=y+dy;if(xx<0||xx>=width||yy<0||yy>=height)continue;
        const offset=(yy*width+xx)*4,c=Array.from(rgba.slice(offset,offset+3));if(Math.max(...c)>90&&Math.min(...c)<240)colors.push(c);
      }}
      if(colors.length){const rgb=[0,1,2].map(k=>Math.round(colors.reduce((s,c)=>s+c[k],0)/colors.length));
        a.skinTone='#'+rgb.map(v=>Math.round(v*.8+245*.2).toString(16).padStart(2,'0')).join('');}
    }
    return sanitize(a);
  }
  function solveFace(points,size,solver){
    if(!Array.isArray(points)||points.length!==478||!solver?.Face?.solve)return null;
    return solver.Face.solve(points.map(p=>({...p})),{runtime:'mediapipe',imageSize:size,smoothBlink:false});
  }
  const api={defaults,sanitize,neutral,pose,render,fromKalido,estimateAppearance,solveFace};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;root.FlatAvatar=api;
})(typeof window!=='undefined'?window:globalThis);
