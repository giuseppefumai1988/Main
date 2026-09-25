/* ANIQRC — Service Worker. Rende il sito installabile come app e disponibile offline.
   Strategia: navigazioni network-first (contenuti sempre freschi, fallback offline),
   asset del sito cache-first con runtime cache. © ANIQRC

   v6 (21 settembre 2026)
   · la home è tornata alla radice: cambiare VERSION svuota le cache vecchie,
     così nessuno si ritrova l'introduzione o gli script precedenti;
   · le richieste verso ALTRI siti (servizi ponte delle notizie, YouTube, Spotify…)
     non passano più dalla cache: prima ci restavano per sempre e le notizie
     non si aggiornavano. Fanno eccezione solo font e librerie, che non cambiano;
   · news-feed.json va sempre in rete per primo: la cache serve solo offline.

   v7 (25 settembre 2026)
   · il journal ha cambiato nome: da «PNJ — Primum Nursing Journal» a
     «RING — Risk International Nursing Group Journal». Cambiare VERSION svuota
     le cache vecchie, così nessuno continua a vedere il nome e il marchio
     precedenti; l'icona della testata ora è logo-ring-512.png. */
var VERSION = 'aniqrc-v7';
var CORE = [
  './', 'index.html',
  'osservatorio.html', 'toolkit.html', 'ricerca.html', 'eventi.html',
  'adesione.html', 'privacy.html', 'grazie.html', 'journal.html',
  'strumenti-campione.html', 'strumenti-kappa.html',
  'aniqrc-bg.js', 'aniqrc-app.js', 'qualita-fx.js',
  'qualita-data.json', 'toolkit-data.json',
  'site.webmanifest', 'favicon.svg', 'favicon-16.png', 'favicon-32.png',
  'apple-touch-icon.png', 'apple-touch-icon-152.png', 'apple-touch-icon-167.png',
  'icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'og-image.png',
  'og-journal.png', 'logo-ring-512.png'
];
/* altri domini che si possono tenere in cache: contenuti che non cambiano */
var STATICI = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(
    caches.open(VERSION).then(function(c){
      // add singolarmente: un asset mancante non fa fallire tutto
      return Promise.all(CORE.map(function(u){
        return c.add(new Request(u, {cache:'reload'})).catch(function(){});
      }));
    })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k!==VERSION; })
        .map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;
  var url = new URL(req.url);
  var stesso = url.origin === self.location.origin;

  // Altri siti: se ne occupa il browser, tranne font e librerie
  if(!stesso && STATICI.indexOf(url.hostname) === -1) return;

  // Pagine: network-first, fallback alla cache, poi alla home
  if(req.mode === 'navigate'){
    e.respondWith(
      fetch(req).then(function(res){
        var copy = res.clone();
        caches.open(VERSION).then(function(c){ c.put(req, copy); });
        return res;
      }).catch(function(){
        return caches.match(req).then(function(r){
          return r || caches.match('index.html') || caches.match('./');
        });
      })
    );
    return;
  }

  // Titoli delle testate: sempre dalla rete; una sola copia in cache per l'offline
  if(stesso && /\/news-feed\.json$/.test(url.pathname)){
    var chiave = new Request(url.origin + url.pathname);
    e.respondWith(
      fetch(req).then(function(res){
        if(res && res.ok){
          var copy = res.clone();
          caches.open(VERSION).then(function(c){ c.put(chiave, copy); });
        }
        return res;
      }).catch(function(){ return caches.match(chiave); })
    );
    return;
  }

  // Asset: cache-first, poi rete (con runtime cache)
  e.respondWith(
    caches.match(req).then(function(cached){
      if(cached) return cached;
      return fetch(req).then(function(res){
        if(res && (res.ok || res.type === 'opaque')){
          var copy = res.clone();
          caches.open(VERSION).then(function(c){ c.put(req, copy); });
        }
        return res;
      }).catch(function(){ return cached; });
    })
  );
});
