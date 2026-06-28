/* ANIQRC — sfondo "aurora soffusa": luce viva e profonda dietro le pagine.
   Autonomo, leggero, dietro ogni contenuto. Rispetta tema chiaro/scuro e
   prefers-reduced-motion. Nessuna dipendenza. © ANIQRC */
(function(){
  if(typeof window==='undefined' || typeof document==='undefined') return;
  if(window.__aniqrcAurora) return; window.__aniqrcAurora=true;

  var docEl=document.documentElement;
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* Palette degli aloni per i due temi. Valori = [r,g,b], alpha al centro,
     posizione base (frazione viewport), raggio (frazione del lato maggiore),
     ampiezza deriva, periodo (s), fase, "respiro". */
  function palette(){
    var dark = docEl.getAttribute('data-theme')==='dark';
    if(dark){
      return [
        {c:'255,226,170', a:0.12, x:0.24, y:0.20, r:0.62, dx:0.05, dy:0.04, per:36, ph:0.0, br:0.10},
        {c:'130,158,196', a:0.07, x:0.82, y:0.32, r:0.56, dx:0.06, dy:0.05, per:48, ph:1.7, br:0.12},
        {c:'242,97,110',  a:0.09, x:0.66, y:0.80, r:0.52, dx:0.05, dy:0.06, per:42, ph:3.1, br:0.10},
        {c:'255,234,196', a:0.06, x:0.42, y:0.66, r:0.50, dx:0.04, dy:0.05, per:54, ph:4.4, br:0.10}
      ];
    }
    return [
      {c:'255,251,242', a:0.42, x:0.24, y:0.20, r:0.60, dx:0.05, dy:0.04, per:36, ph:0.0, br:0.10},
      {c:'213,205,186', a:0.34, x:0.80, y:0.34, r:0.58, dx:0.06, dy:0.05, per:48, ph:1.7, br:0.12},
      {c:'230,57,70',   a:0.06, x:0.68, y:0.80, r:0.50, dx:0.05, dy:0.06, per:42, ph:3.1, br:0.10},
      {c:'236,229,213', a:0.32, x:0.42, y:0.70, r:0.52, dx:0.04, dy:0.05, per:54, ph:4.4, br:0.10}
    ];
  }
  function palette2(){ var a=palette(); return ((window.innerWidth||0)<700) ? a.slice(0,3) : a; }
  var blobs=palette2();

  var cv=document.createElement('canvas');
  cv.id='aniqrc-aurora'; cv.setAttribute('aria-hidden','true');
  var st=cv.style;
  st.position='fixed'; st.left='0'; st.top='0'; st.width='100%'; st.height='100%';
  st.zIndex='-1'; st.pointerEvents='none'; st.display='block';
  function attach(){ if(document.body && !cv.parentNode){ document.body.insertBefore(cv, document.body.firstChild); } }
  if(document.body){ attach(); } else { document.addEventListener('DOMContentLoaded', attach); }

  var ctx=cv.getContext('2d');
  var RS=0.6, W=1, H=1;
  function resize(){
    W=window.innerWidth||document.documentElement.clientWidth||1;
    H=window.innerHeight||document.documentElement.clientHeight||1;
    RS=(W<700?0.5:0.6);
    cv.width=Math.max(1,Math.floor(W*RS));
    cv.height=Math.max(1,Math.floor(H*RS));
  }
  resize();

  function draw(now){
    var maxR=Math.max(W,H);
    ctx.setTransform(RS,0,0,RS,0,0);
    ctx.clearRect(0,0,W,H);
    var sy=(window.scrollY||window.pageYOffset||0);
    var par=Math.max(-H*0.3, Math.min(H*0.3, -sy*0.05)); /* parallax morbido e limitato */
    for(var i=0;i<blobs.length;i++){
      var b=blobs[i];
      var ang=now/(b.per*1000)*Math.PI*2 + b.ph;
      var px=(b.x + Math.sin(ang)*b.dx)*W;
      var py=(b.y + Math.cos(ang*0.85+b.ph)*b.dy)*H + par*(1+i*0.12);
      var rad=b.r*maxR*(1 + b.br*Math.sin(ang*1.3+b.ph));
      if(rad<=0) continue;
      var g=ctx.createRadialGradient(px,py,0,px,py,rad);
      g.addColorStop(0,'rgba('+b.c+','+b.a+')');
      g.addColorStop(1,'rgba('+b.c+',0)');
      ctx.fillStyle=g;
      ctx.fillRect(0,0,W,H);
    }
  }

  var rt=null;
  window.addEventListener('resize', function(){
    if(rt) cancelAnimationFrame(rt);
    rt=requestAnimationFrame(function(){ resize(); blobs=palette2(); if(reduce) draw(0); });
  });

  if(reduce){ draw(0); return; } /* statico: profondità senza movimento */

  var last=0, frameMs=1000/30, raf=null, running=false;
  function loop(now){
    if(!running) return;
    raf=requestAnimationFrame(loop);
    if(now-last < frameMs) return;
    last=now; draw(now);
  }
  function startLoop(){ if(!running){ running=true; last=0; raf=requestAnimationFrame(loop); } }
  function stopLoop(){ running=false; if(raf){ cancelAnimationFrame(raf); raf=null; } }

  document.addEventListener('visibilitychange', function(){ if(document.hidden) stopLoop(); else startLoop(); });
  if(window.MutationObserver){
    new MutationObserver(function(){ blobs=palette2(); }).observe(docEl,{attributes:true, attributeFilter:['data-theme']});
  }
  startLoop();
})();
