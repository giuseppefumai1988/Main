/* =========================================================
   ANIQRC — NEWSFEED DELLE TESTATE INFERMIERISTICHE
   La seconda barra rossa, subito sotto l'hero della home.
   =========================================================

   ┌──────────────────────────────────────────────────────────┐
   │  COME FUNZIONA                                           │
   └──────────────────────────────────────────────────────────┘

   Le testate non permettono di leggere i loro feed RSS
   direttamente dal browser (blocco CORS): il sito riceverebbe
   un errore e la barra resterebbe vuota.

   Perciò i titoli vengono raccolti a monte, una volta ogni tre
   ore, dall'automazione .github/workflows/newsfeed.yml, che
   scrive il file news-feed.json qui nel repository. Questa
   pagina legge quel file: stesso dominio, nessun blocco,
   nessuna chiamata a servizi di terze parti e nessun dato dei
   visitatori che esce dal sito.

   Se news-feed.json non c'è ancora (automazione non attiva),
   la barra mostra comunque i collegamenti alle tre testate:
   non resta mai vuota e non finge di essere aggiornata.

   ┌──────────────────────────────────────────────────────────┐
   │  PERSONALIZZAZIONE                                       │
   └──────────────────────────────────────────────────────────┘

   Per aggiungere o togliere una testata modifica l'elenco qui
   sotto E l'elenco identico in tools/build-newsfeed.mjs.
   ========================================================= */

window.ANIQRC_TESTATE = [
  { nome: 'Nurse Times',      sito: 'https://www.nursetimes.org/' },
  { nome: 'Nurse24',          sito: 'https://www.nurse24.it/' },
  { nome: 'InfermieriAttivi', sito: 'https://www.infermieriattivi.it/' },
];

/* Quante notizie far scorrere al massimo, e velocità in pixel al secondo. */
window.ANIQRC_FEED_MAX = 12;
window.ANIQRC_FEED_SPEED = 52;


/* =========================================================
   ── DA QUI IN GIÙ NON SERVE MODIFICARE NULLA ──
   ========================================================= */
(function () {
  'use strict';

  var BAR = 'newsfeed', TRACK = 'newsfeedTrack';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* accetta solo link http(s): un feed è pur sempre contenuto di terzi */
  function linkSicuro(u) {
    try {
      var url = new URL(String(u), location.href);
      return (url.protocol === 'https:' || url.protocol === 'http:') ? url.href : '';
    } catch (e) { return ''; }
  }

  function taglia(t, max) {
    t = String(t || '').replace(/\s+/g, ' ').trim();
    return t.length > max ? t.slice(0, max - 1).trim() + '…' : t;
  }

  function itemHTML(it) {
    var href = linkSicuro(it.link);
    var inner = '';
    if (it.fonte) inner += '<span class="nb-tag">' + esc(it.fonte) + '</span>';
    inner += '<span class="nb-txt">' + esc(taglia(it.titolo, 110)) + '</span>';
    var html;
    if (href) {
      inner += '<span class="nb-arr" aria-hidden="true">→</span>';
      html = '<a class="nb-item" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>';
    } else {
      html = '<span class="nb-item nb-static">' + inner + '</span>';
    }
    return html + '<span class="nb-sep" aria-hidden="true">•</span>';
  }

  /* riga di ripiego: le tre testate, senza titoli */
  function ripiego() {
    var testate = Array.isArray(window.ANIQRC_TESTATE) ? window.ANIQRC_TESTATE : [];
    if (!testate.length) return [];
    return testate.map(function (t) {
      return { fonte: t.nome, titolo: 'Le notizie di ' + t.nome, link: t.sito };
    });
  }

  function anima(bar, track, view) {
    var seq = track.getAttribute('data-seq') || '';
    track.style.animation = 'none';
    track.innerHTML = seq;
    var unit = track.scrollWidth;
    if (!unit) { track.innerHTML = seq + seq; return; }
    var need = Math.max(1, Math.ceil((view.clientWidth + 80) / unit));
    var half = '';
    for (var i = 0; i < need; i++) half += seq;
    track.innerHTML = half + half;
    var speed = Number(window.ANIQRC_FEED_SPEED) || 52;
    track.style.setProperty('--nb-dur', ((unit * need) / speed).toFixed(2) + 's');
    track.style.animation = '';
    bar.classList.add('ready');
  }

  function mostra(voci) {
    var bar = document.getElementById(BAR);
    var track = document.getElementById(TRACK);
    var view = bar && bar.querySelector('.newsbar-viewport');
    if (!bar || !track || !view) return;

    voci = (voci || []).filter(function (v) { return v && v.titolo; });
    if (!voci.length) voci = ripiego();
    if (!voci.length) { bar.hidden = true; return; }

    var max = Number(window.ANIQRC_FEED_MAX) || 12;
    track.setAttribute('data-seq', voci.slice(0, max).map(itemHTML).join(''));
    bar.hidden = false;
    anima(bar, track, view);

    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { anima(bar, track, view); }, 250);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { anima(bar, track, view); }).catch(function () {});
    }
  }

  function carica() {
    /* la marca oraria evita che la cache del browser tenga un file vecchio */
    var url = 'news-feed.json?v=' + Math.floor(Date.now() / 3600000);
    fetch(url, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { mostra(d && Array.isArray(d.voci) ? d.voci : null); })
      .catch(function () { mostra(null); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carica);
  } else {
    carica();
  }
})();
