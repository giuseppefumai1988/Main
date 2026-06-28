/* ANIQRC — app & mobile layer.
   1) Menu mobile (hamburger) che riusa i link già presenti in ogni pagina.
   2) Registrazione del service worker (solo http/https).
   3) Prompt discreto "Installa l'app" (PWA).
   Autonomo, nessuna dipendenza. © ANIQRC */
(function(){
  if(typeof window==='undefined' || typeof document==='undefined') return;
  if(window.__aniqrcApp) return; window.__aniqrcApp=true;

  /* ---------- CSS iniettato ---------- */
  var css = ''+
  'html{-webkit-text-size-adjust:100%;}'+
  '*{-webkit-tap-highlight-color:transparent;}'+
  'img,svg,video,canvas{max-width:100%;}'+
  '.am-burger{display:none;align-items:center;justify-content:center;width:44px;height:44px;margin-left:10px;border:1px solid var(--rule,#D4D0C5);border-radius:11px;background:transparent;color:var(--ink,#0A0A0A);cursor:pointer;flex:0 0 auto;}'+
  '.am-burger span{position:relative;display:block;width:20px;height:2px;background:currentColor;border-radius:2px;transition:transform .25s ease,opacity .2s ease;}'+
  '.am-burger span::before,.am-burger span::after{content:"";position:absolute;left:0;display:block;width:20px;height:2px;background:currentColor;border-radius:2px;transition:transform .25s ease,top .25s ease;}'+
  '.am-burger span::before{top:-6px;} .am-burger span::after{top:6px;}'+
  'nav.am.open .am-burger span{background:transparent;}'+
  'nav.am.open .am-burger span::before{top:0;transform:rotate(45deg);}'+
  'nav.am.open .am-burger span::after{top:0;transform:rotate(-45deg);}'+
  '.am-backdrop{position:fixed;inset:0;z-index:90;background:rgba(10,10,10,.36);opacity:0;visibility:hidden;transition:opacity .26s ease,visibility .26s;}'+
  'body.am-open .am-backdrop{opacity:1;visibility:visible;}'+
  'body.am-lock{overflow:hidden;}'+
  '@media (max-width:860px){'+
    'body{overflow-x:hidden;}'+
    'nav.am .am-burger{display:inline-flex;}'+
    'nav.am .nav-links{position:absolute;top:100%;left:0;right:0;flex-direction:column;align-items:stretch;gap:0;background:var(--bg-card,#FBFAF6);border-top:1px solid var(--rule,#D4D0C5);border-bottom:1px solid var(--rule,#D4D0C5);padding:6px 22px 22px;box-shadow:0 26px 44px rgba(20,18,14,.18);transform:translateY(-10px);opacity:0;visibility:hidden;pointer-events:none;transition:opacity .26s ease,transform .26s ease,visibility .26s;max-height:calc(100vh - 58px);overflow:auto;-webkit-overflow-scrolling:touch;}'+
    'nav.am.open .nav-links{transform:none;opacity:1;visibility:visible;pointer-events:auto;}'+
    'nav.am .nav-links>a{display:flex !important;align-items:center;width:100%;padding:15px 2px;font-size:16px;color:var(--ink-soft,#34332F);border-bottom:1px solid var(--rule-soft,#E2DED4);}'+
    'nav.am .nav-links>a::after{display:none !important;}'+
    'nav.am .nav-links>a.nav-cta{justify-content:center;text-align:center;margin-top:14px;color:#fff;border-bottom:0 !important;}'+
    'nav.am .nav-links .nav-search,nav.am .nav-links .nav-theme{width:42px;height:42px;margin-top:12px;border-bottom:0 !important;}'+
    'nav.am .nav-links .nl-short{display:inline !important;} nav.am .nav-links .nl-full{display:none !important;}'+
  '}'+
  '.am-install{position:fixed;left:50%;transform:translateX(-50%);bottom:16px;z-index:300;display:none;align-items:center;gap:12px;font-family:"JetBrains Mono",monospace;font-size:12.5px;letter-spacing:.03em;color:#fff;background:var(--accent,#E63946);border:0;border-radius:999px;padding:12px 16px 12px 18px;box-shadow:0 12px 30px rgba(230,57,70,.34);cursor:pointer;}'+
  '.am-install.show{display:inline-flex;}'+
  '.am-install b{font-weight:600;}'+
  '.am-install .x{display:inline-flex;width:20px;height:20px;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,255,255,.22);font-size:13px;}';
  var style=document.createElement('style'); style.id='aniqrc-app-css'; style.textContent=css;
  (document.head||document.documentElement).appendChild(style);

  /* ---------- Menu mobile ---------- */
  function initNav(){
    var nav=document.querySelector('nav'); if(!nav) return;
    var inner=nav.querySelector('.nav-inner'); var links=nav.querySelector('.nav-links');
    if(!inner || !links) return;
    if(links.querySelectorAll('a').length < 3) return;      // pagine semplici: niente menu
    if(nav.classList.contains('am')) return;
    nav.classList.add('am');

    var burger=document.createElement('button');
    burger.type='button'; burger.className='am-burger';
    burger.setAttribute('aria-label','Apri il menu'); burger.setAttribute('aria-expanded','false');
    burger.innerHTML='<span></span>';
    inner.appendChild(burger);

    var backdrop=document.createElement('div'); backdrop.className='am-backdrop';
    document.body.appendChild(backdrop);

    function open(){ nav.classList.add('open'); document.body.classList.add('am-open','am-lock'); burger.setAttribute('aria-expanded','true'); burger.setAttribute('aria-label','Chiudi il menu'); }
    function close(){ nav.classList.remove('open'); document.body.classList.remove('am-open','am-lock'); burger.setAttribute('aria-expanded','false'); burger.setAttribute('aria-label','Apri il menu'); }
    function toggle(){ nav.classList.contains('open') ? close() : open(); }

    burger.addEventListener('click', toggle);
    backdrop.addEventListener('click', close);
    links.addEventListener('click', function(e){ if(e.target.closest('a')) close(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape'||e.key==='Esc') close(); });
    window.addEventListener('resize', function(){ if(window.innerWidth>860 && nav.classList.contains('open')) close(); });
  }

  /* ---------- Service worker ---------- */
  function initSW(){
    if(!('serviceWorker' in navigator)) return;
    if(location.protocol!=='https:' && location.protocol!=='http:') return; // niente su file://
    navigator.serviceWorker.register('sw.js').catch(function(){});
  }

  /* ---------- Prompt installazione ---------- */
  function initInstall(){
    var deferred=null, pill=null, dismissed=false;
    window.addEventListener('beforeinstallprompt', function(e){
      e.preventDefault(); deferred=e; if(dismissed) return;
      if(!pill){
        pill=document.createElement('button'); pill.type='button'; pill.className='am-install';
        pill.innerHTML='<b>Installa l’app ANIQRC</b><span class="x" aria-label="Chiudi">×</span>';
        document.body.appendChild(pill);
        pill.addEventListener('click', function(ev){
          if(ev.target && ev.target.classList.contains('x')){ pill.classList.remove('show'); dismissed=true; return; }
          if(deferred){ deferred.prompt(); deferred.userChoice.then(function(){ pill.classList.remove('show'); deferred=null; }); }
        });
      }
      pill.classList.add('show');
      setTimeout(function(){ if(pill) pill.classList.remove('show'); }, 14000);
    });
    window.addEventListener('appinstalled', function(){ if(pill) pill.classList.remove('show'); });
  }

  /* ---------- Icone iOS aggiuntive + splash screen ---------- */
  function initAppleAssets(){
    var head=document.head||document.getElementsByTagName('head')[0]; if(!head) return;
    function add(rel,attrs){ var l=document.createElement('link'); l.rel=rel; for(var k in attrs) l.setAttribute(k,attrs[k]); head.appendChild(l); }
    if(!document.querySelector('link[rel="apple-touch-icon"][sizes="152x152"]')) add('apple-touch-icon',{sizes:'152x152',href:'apple-touch-icon-152.png'});
    if(!document.querySelector('link[rel="apple-touch-icon"][sizes="167x167"]')) add('apple-touch-icon',{sizes:'167x167',href:'apple-touch-icon-167.png'});
    if(!document.querySelector('link[rel="apple-touch-icon"][sizes="180x180"]')) add('apple-touch-icon',{sizes:'180x180',href:'apple-touch-icon.png'});
    if(document.querySelector('link[rel="apple-touch-startup-image"]')) return;
    var D=[[750,1334,375,667,2],[1242,2208,414,736,3],[1125,2436,375,812,3],[828,1792,414,896,2],[1242,2688,414,896,3],[1170,2532,390,844,3],[1284,2778,428,926,3],[1179,2556,393,852,3],[1290,2796,430,932,3],[1206,2622,402,874,3],[1320,2868,440,956,3],[1080,2340,360,780,3],[1536,2048,768,1024,2],[1620,2160,810,1080,2],[1640,2360,820,1180,2],[1668,2224,834,1112,2],[1668,2388,834,1194,2],[2048,2732,1024,1366,2]];
    for(var i=0;i<D.length;i++){ var a=D[i];
      add('apple-touch-startup-image',{media:'(device-width:'+a[2]+'px) and (device-height:'+a[3]+'px) and (-webkit-device-pixel-ratio:'+a[4]+') and (orientation:portrait)', href:'splash-'+a[0]+'x'+a[1]+'.png'});
    }
  }
  function start(){ initNav(); initSW(); initInstall(); initAppleAssets(); }
  if(document.readyState!=='loading') start(); else document.addEventListener('DOMContentLoaded', start);
})();
