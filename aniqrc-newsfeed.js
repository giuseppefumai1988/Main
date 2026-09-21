/* =========================================================
   ANIQRC — IL RIQUADRO NEWS DELLA HOME
   Nurse Times e Nurse24 a turno, nel quadrato nero a destra
   del logotipo. (Fino a settembre 2026 questo file animava la
   barra rossa sotto l'hero, che il riquadro ha sostituito.)
   =========================================================

   ┌──────────────────────────────────────────────────────────┐
   │  DA DOVE ARRIVANO LE NOTIZIE                             │
   └──────────────────────────────────────────────────────────┘

   1. news-feed.json, qui nel sito. Lo riscrive ogni tre ore
      l'automazione .github/workflows/newsfeed.yml, che esegue
      tools/build-newsfeed.mjs. È la strada principale: stesso
      dominio, nessun servizio esterno, nessun dato dei
      visitatori che esce dal sito.

   2. Se quel file non c'è, ha più di tre giorni o non contiene
      notizie di una testata, il riquadro legge il feed RSS
      della testata attraverso gli stessi due servizi ponte già
      usati dalla sezione «News» della home (codetabs e
      allorigins): un browser non può leggere direttamente il
      feed di un altro sito (blocco CORS).

   3. Se non risponde nessuno, il riquadro mostra i
      collegamenti diretti alle testate: non resta vuoto e non
      finge di essere aggiornato.

   ┌──────────────────────────────────────────────────────────┐
   │  PERSONALIZZAZIONE                                       │
   └──────────────────────────────────────────────────────────┘

   Per cambiare o aggiungere una testata modifica l'elenco qui
   sotto E l'elenco gemello in tools/build-newsfeed.mjs: il
   campo «nome» deve essere identico nei due file.
   ========================================================= */

window.ANIQRC_TESTATE = [
  { nome: 'Nurse Times', sito: 'https://www.nursetimes.org/', feed: 'https://nursetimes.org/feed/' },
  { nome: 'Nurse24',     sito: 'https://www.nurse24.it/',     feed: 'https://www.nurse24.it/feed.html' },
];

/* Notizie mostrate per ciascuna testata. */
window.ANIQRC_FEED_MAX = 10;

/* Secondi prima di passare all'altra testata. */
window.ANIQRC_FEED_ALTERNANZA = 10;


/* =========================================================
   ── DA QUI IN GIÙ NON SERVE MODIFICARE NULLA ──
   ========================================================= */
(function () {
  'use strict';

  var box = document.getElementById('newsBox');
  if (!box || !window.fetch || !window.DOMParser) return;

  var TESTATE = (Array.isArray(window.ANIQRC_TESTATE) ? window.ANIQRC_TESTATE : [])
    .filter(function (t) { return t && t.nome && t.sito; });
  if (!TESTATE.length) return;

  var MAX = Math.max(1, Number(window.ANIQRC_FEED_MAX) || 10);
  var DURATA = Math.max(4, Number(window.ANIQRC_FEED_ALTERNANZA) || 10) * 1000;
  var VECCHIO = 72 * 3600 * 1000;           /* oltre tre giorni il file è «vecchio» */
  var PONTI = [
    function (u) { return 'https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent(u); },
    function (u) { return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u); },
  ];
  var riduci = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  var tabsEl = box.querySelector('.nfb-tabs');
  var panel = box.querySelector('.nfb-panel');
  var list = box.querySelector('.nfb-list');
  var agg = box.querySelector('.nfb-agg');
  var all = box.querySelector('.nfb-all');
  var pausa = box.querySelector('.nfb-pausa');
  if (!tabsEl || !panel || !list) return;

  var ICONA_PAUSA = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><rect x="2" y="1.5" width="2.6" height="9" fill="currentColor"/><rect x="7.4" y="1.5" width="2.6" height="9" fill="currentColor"/></svg>';
  var ICONA_VIA = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>';

  /* ---------- stato ---------- */
  var dati = TESTATE.map(function () { return null; });   /* null = in arrivo */
  var cur = 0;
  var tabs = [];
  var pronto = false;
  var fermo = riduci;      /* alternanza ferma: scelta del visitatore o preferenza di sistema */
  var sospeso = 0;         /* 1 mouse sopra · 2 focus da tastiera · 4 tocco · 8 fuori schermo · 16 scheda nascosta */
  var trascorso = 0, ultimo = 0, raf = 0;

  /* ---------- utilità ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  /* accetta solo link http(s): un feed è pur sempre contenuto di terzi */
  function linkSicuro(u) {
    try {
      var url = new URL(String(u || '').trim(), location.href);
      return (url.protocol === 'https:' || url.protocol === 'http:') ? url.href : '';
    } catch (e) { return ''; }
  }
  /* da HTML a testo semplice: il documento di DOMParser è inerte, non esegue né carica nulla */
  function testo(html) {
    if (!html) return '';
    var d = new DOMParser().parseFromString('<!doctype html><body>' + String(html), 'text/html');
    return (d.body.textContent || '').replace(/\s+/g, ' ').trim();
  }
  /* toglie le formule automatiche dei feed WordPress («L'articolo … sembra essere il primo su …») */
  function ripulisci(t) {
    return String(t || '')
      .replace(/\s*(L[’']articolo|The post)\s.*?\s(sembra essere il primo su|proviene da|appeared first on)\s.*$/i, '')
      .replace(/\s*\[(…|\.\.\.)\]\s*$/, '…')
      .trim();
  }
  function taglia(t, max) {
    t = String(t || '').replace(/\s+/g, ' ').trim();
    if (t.length <= max) return t;
    return t.slice(0, max - 1).replace(/[\s,;:.–—-]+\S*$/, '') + '…';
  }
  function ora(d) { return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }); }
  function stessoGiorno(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function quando(d, conArticolo) {
    if (!d || isNaN(d)) return '';
    var oggi = new Date(), ieri = new Date(oggi.getTime() - 86400000);
    if (stessoGiorno(d, oggi)) return (conArticolo ? 'oggi alle ' : 'Oggi · ') + ora(d);
    if (stessoGiorno(d, ieri)) return (conArticolo ? 'ieri alle ' : 'Ieri · ') + ora(d);
    var g = d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
    return conArticolo ? 'il ' + g + ' alle ' + ora(d) : g + ' · ' + ora(d);
  }
  function prendi(url, ms, comeTesto) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, ms);
    return fetch(url, { cache: 'no-cache', credentials: 'omit', signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) {
        clearTimeout(t);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return comeTesto ? r.text() : r.json();
      }, function (e) { clearTimeout(t); throw e; });
  }

  /* ---------- 1. il file del sito ---------- */
  function daFile() {
    return prendi('news-feed.json?v=' + Math.floor(Date.now() / 3600000), 6000)
      .then(function (d) {
        if (!d || !Array.isArray(d.voci)) return null;
        var t = Date.parse(d.aggiornato);
        return {
          quando: isNaN(t) ? null : new Date(t),
          gruppi: TESTATE.map(function (ts) {
            return d.voci.filter(function (v) { return v && v.titolo && v.fonte === ts.nome; }).slice(0, MAX);
          }),
        };
      })
      .catch(function () { return null; });
  }

  /* ---------- 2. il feed RSS attraverso i servizi ponte ---------- */
  function leggiRSS(xml) {
    var doc = new DOMParser().parseFromString(xml, 'text/xml');
    if (doc.getElementsByTagName('parsererror').length) return [];
    var nodi = [].slice.call(doc.getElementsByTagName('item'));
    var atom = !nodi.length;
    if (atom) nodi = [].slice.call(doc.getElementsByTagName('entry'));
    return nodi.map(function (n) {
      function primo(tag) { var e = n.getElementsByTagName(tag)[0]; return e ? (e.textContent || '') : ''; }
      var link = primo('link');
      if (atom || !link.trim()) {
        var ls = [].slice.call(n.getElementsByTagName('link'));
        var alt = ls.filter(function (l) { return (l.getAttribute('rel') || 'alternate') === 'alternate'; })[0] || ls[0];
        if (alt && alt.getAttribute('href')) link = alt.getAttribute('href');
      }
      var d = Date.parse(primo('pubDate') || primo('published') || primo('updated') || primo('dc:date'));
      return {
        titolo: testo(primo('title')),
        link: String(link || '').trim(),
        data: isNaN(d) ? null : new Date(d).toISOString(),
        sommario: taglia(ripulisci(testo(primo('description') || primo('summary') || primo('content:encoded') || primo('content'))), 240),
      };
    }).filter(function (v) { return v.titolo && /^https?:\/\//i.test(v.link); });
  }
  function daPonte(ts) {
    var i = 0;
    function prova() {
      if (!ts.feed || i >= PONTI.length) return Promise.resolve([]);
      return prendi(PONTI[i++](ts.feed), 8000, true)
        .then(function (xml) {
          var voci = (xml && xml.indexOf('<') !== -1) ? leggiRSS(xml) : [];
          return voci.length ? voci.slice(0, MAX) : prova();
        })
        .catch(prova);
    }
    return prova();
  }

  /* ---------- disegno ---------- */
  function scheletro() {
    var li = '<li class="nfb-sk" aria-hidden="true"><i></i><i></i><i></i></li>';
    return li + li + li;
  }
  function ripiego(ts) {
    return '<li><a class="nfb-it nfb-rip" href="' + esc(linkSicuro(ts.sito)) + '" target="_blank" rel="noopener">' +
      '<span class="nfb-meta"><span>Collegamento diretto</span></span>' +
      '<span class="nfb-tit">Le ultime notizie di ' + esc(ts.nome) + '</span>' +
      '<span class="nfb-sum">Il flusso dei titoli non risponde in questo momento: apri la testata per leggere gli aggiornamenti.</span>' +
      '<span class="nfb-go" aria-hidden="true">↗</span></a></li>';
  }
  function voce(v, n, ts) {
    var href = linkSicuro(v.link);
    var d = v.data ? new Date(v.data) : null;
    var fresca = d && !isNaN(d) && (Date.now() - d.getTime() < 3 * 3600000);   /* «Nuovo» fino a tre ore */
    var meta = '<span class="nfb-meta"><span class="nfb-n">' + (n < 9 ? '0' : '') + (n + 1) + '</span>' +
      (d && !isNaN(d) ? '<time datetime="' + esc(d.toISOString()) + '">' + esc(quando(d)) + '</time>' : '<span>' + esc(ts.nome) + '</span>') +
      (fresca ? '<span class="nfb-nuovo">Nuovo</span>' : '') + '</span>';
    var corpo = meta +
      '<span class="nfb-tit">' + esc(taglia(v.titolo, 150)) + '</span>' +
      (v.sommario ? '<span class="nfb-sum">' + esc(taglia(v.sommario, 240)) + '</span>' : '') +
      '<span class="nfb-go" aria-hidden="true">↗</span>';
    return '<li>' + (href
      ? '<a class="nfb-it" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + corpo + '</a>'
      : '<span class="nfb-it">' + corpo + '</span>') + '</li>';
  }
  function piede() {
    var ts = TESTATE[cur], r = dati[cur];
    if (all) {
      all.href = linkSicuro(ts.sito);
      all.innerHTML = '<span class="nfb-all-v">Vai a </span>' + esc(ts.nome) + ' <span aria-hidden="true">↗</span>';
      all.title = 'Apri ' + ts.nome + ' in una nuova scheda';
    }
    if (agg) {
      if (!r) agg.textContent = 'Caricamento dei titoli…';
      else if (r.voci.length && r.quando) agg.textContent = 'Aggiornato ' + quando(r.quando, true);
      else agg.textContent = 'Link alle fonti originali';
    }
  }
  var cambioT = 0;
  function mostra(anima) {
    var ts = TESTATE[cur], r = dati[cur];
    var html = !r ? scheletro() : (r.voci.length ? r.voci.map(function (v, n) { return voce(v, n, ts); }).join('') : ripiego(ts));
    function applica() {
      list.innerHTML = html;
      panel.scrollTop = 0;
      panel.setAttribute('aria-labelledby', tabs[cur] ? tabs[cur].id : '');
      panel.removeAttribute('aria-label');
      list.setAttribute('aria-busy', r ? 'false' : 'true');
      piede();
      box.classList.remove('nfb-cambio');
    }
    clearTimeout(cambioT);
    if (anima && !riduci) { box.classList.add('nfb-cambio'); cambioT = setTimeout(applica, 260); }
    else applica();
  }

  /* ---------- schede ---------- */
  function costruisciSchede() {
    tabsEl.innerHTML = '';
    tabsEl.style.setProperty('--n', TESTATE.length);
    TESTATE.forEach(function (ts, k) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'nfb-tab';
      b.id = 'nfbTab' + k;
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-controls', panel.id || 'nfbPanel');
      b.innerHTML = '<span>' + esc(ts.nome) + '</span><i class="nfb-prog" aria-hidden="true"></i>';
      b.addEventListener('click', function () { scegli(k, true); });
      tabsEl.appendChild(b);
      tabs.push(b);
    });
    tabsEl.addEventListener('keydown', function (e) {
      var k = tabs.indexOf(document.activeElement);
      if (k < 0) return;
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (k + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (k - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      scegli(n, true);
      tabs[n].focus();
    });
  }
  function barra(p) {
    tabs.forEach(function (b, k) {
      var i = b.querySelector('.nfb-prog');
      if (i) i.style.transform = 'scaleX(' + (k === cur ? p : 0) + ')';
    });
  }
  function segna() {
    tabs.forEach(function (b, k) {
      var on = k === cur;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      b.tabIndex = on ? 0 : -1;
    });
    barra(fermo ? 1 : Math.min(1, trascorso / DURATA));
  }
  function scegli(k, dalVisitatore) {
    if (dalVisitatore && !fermo) ferma(true);
    trascorso = 0;
    if (k === cur) { segna(); return; }
    cur = k;
    segna();
    mostra(true);
  }

  /* ---------- alternanza ---------- */
  function inMoto() { return pronto && !fermo && !sospeso && TESTATE.length > 1; }
  function giro(ts) {
    raf = 0;
    if (!inMoto()) return;
    var dt = ultimo ? Math.min(ts - ultimo, 120) : 0;   /* dopo una pausa del browser non salta avanti */
    ultimo = ts;
    trascorso += dt;
    if (trascorso >= DURATA) {
      trascorso = 0;
      cur = (cur + 1) % TESTATE.length;
      segna();
      mostra(true);
    } else {
      barra(trascorso / DURATA);
    }
    raf = requestAnimationFrame(giro);
  }
  function moto() {
    if (inMoto()) { if (!raf) { ultimo = 0; raf = requestAnimationFrame(giro); } }
    else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (fermo) barra(1);
  }
  function ferma(si) {
    fermo = si;
    if (pausa) {
      var etichetta = si ? "Riprendi l'alternanza delle testate" : "Ferma l'alternanza delle testate";
      pausa.innerHTML = si ? ICONA_VIA : ICONA_PAUSA;
      pausa.setAttribute('aria-label', etichetta);
      pausa.title = etichetta;
    }
    if (!si) trascorso = 0;
    box.classList.toggle('nfb-ferma', si);
    moto();
  }
  if (pausa) {
    pausa.hidden = TESTATE.length < 2;
    pausa.addEventListener('click', function () {
      /* chi preme «riprendi» vuole vedere l'alternanza subito, anche con il mouse sopra */
      if (fermo) sospeso &= ~3;
      ferma(!fermo);
    });
  }

  function sospendi(bit, si) {
    if (si) sospeso |= bit; else sospeso &= ~bit;
    moto();
  }
  box.addEventListener('mouseenter', function () { sospendi(1, true); });
  box.addEventListener('mouseleave', function () { sospendi(1, false); });
  box.addEventListener('focusin', function (e) {
    var t = e.target;
    var tastiera = true;
    try { tastiera = t.matches(':focus-visible'); } catch (_) {}
    if (tastiera) sospendi(2, true);
  });
  box.addEventListener('focusout', function (e) { if (!box.contains(e.relatedTarget)) sospendi(2, false); });
  var toccoT = 0;
  box.addEventListener('touchstart', function () {
    sospendi(4, true);
    clearTimeout(toccoT);
    toccoT = setTimeout(function () { sospendi(4, false); }, 9000);
  }, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { sospendi(8, !e.isIntersecting); });
    }, { threshold: 0.3 }).observe(box);
  }
  document.addEventListener('visibilitychange', function () { sospendi(16, document.hidden); });

  /* ---------- avvio ---------- */
  costruisciSchede();
  ferma(fermo);
  segna();
  mostra(false);

  daFile().then(function (f) {
    var fresco = !!(f && f.quando && Date.now() - f.quando.getTime() < VECCHIO);
    var attese = TESTATE.map(function (ts, k) {
      var dalFile = f ? f.gruppi[k] : [];
      var p = (dalFile.length && fresco)
        ? Promise.resolve({ voci: dalFile, quando: f.quando })
        : daPonte(ts).then(function (voci) {
            if (voci.length) return { voci: voci, quando: new Date() };
            return { voci: dalFile, quando: f ? f.quando : null };   /* meglio titoli datati che niente, con la data in vista */
          });
      return p.then(function (r) {
        dati[k] = r;
        if (k === cur) mostra(false);
        if (k === 0 && !pronto) { pronto = true; trascorso = 0; moto(); }
      });
    });
    return Promise.all(attese);
  }).then(function () {
    if (!pronto) { pronto = true; moto(); }
  });
})();
