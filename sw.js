/* ANIQRC — Service Worker. Rende il sito installabile come app e disponibile offline.
   Strategia: navigazioni network-first (contenuti sempre freschi, fallback offline),
   asset cache-first con runtime cache. © ANIQRC */
var VERSION = 'aniqrc-v2';
var CORE = [
  './', 'index.html',
  'osservatorio.html', 'toolkit.html', 'ricerca.html', 'eventi.html',
  'adesione.html', 'privacy.html', 'grazie.html',
  'strumenti-campione.html', 'strumenti-kappa.html',
  'aniqrc-bg.js', 'aniqrc-app.js', 'qualita-fx.js',
  'qualita-data.json', 'toolkit-data.json',
  'site.webmanifest', 'favicon.svg', 'favicon-16.png', 'favicon-32.png',
  'apple-touch-icon.png', 'apple-touch-icon-152.png', 'apple-touch-icon-167.png',
  'icon-192.png', 'icon-512.png', 'icon-512-maskable.png', 'og-image.png'
];

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
