/* =========================================================
   ANIQRC — NASTRO NEWS
   Il nastro rosso che scorre subito sotto il menu, in home.
   =========================================================

   ┌───────────────────────────────────────────────────────┐
   │  PERSONALIZZAZIONE — modifica SOLO l'elenco qui sotto │
   └───────────────────────────────────────────────────────┘

   Ogni voce del nastro accetta queste proprietà:

     testo  →  il testo che scorre                      (obbligatorio)
     link   →  la pagina che si apre al clic            (facoltativo)
     tag    →  etichetta a pillola davanti al testo     (facoltativo)
     nuovo  →  true per il pallino lampeggiante         (facoltativo)
     esterno → true se il link va aperto in nuova scheda (facoltativo)
     tag_en, testo_en → le stesse voci per la versione inglese del sito
                        (facoltative: se mancano resta l'italiano)

   Per AGGIUNGERE una news: copia una riga e cambiala.
   Per TOGLIERE una news: cancella la sua riga, oppure mettici // davanti.
   Se l'elenco resta vuoto, il nastro sparisce da solo.
   ========================================================= */

window.ANIQRC_NEWS = [

  { tag: "Novità", testo: "È online VISIONE, la newsletter mensile di ANIQRC: sfoglia il N. 1 di novembre o scarica il PDF", link: "visione.html", nuovo: true,
    tag_en: "New", testo_en: "VISIONE, ANIQRC's monthly newsletter, is online: browse issue 1 (November) or download the PDF" },

  { tag: "Prossimo evento", testo: "Da C.Or.O a C.Or.O: il ruolo dell'infermiere nella rete oncologica — Bari, Istituto Tumori IRCCS, 18 dicembre 2026 · iscrizioni aperte", link: "eventi.html#coro-2026", nuovo: true,
    tag_en: "Next event", testo_en: "From C.Or.O to C.Or.O: the nurse's role in the oncology network — Bari, Istituto Tumori IRCCS, 18 December 2026 · registration open" },

  { tag: "Concluso", testo: "Forum infermieristico: Qualità, sicurezza e rischio clinico — Bari, 30 ottobre 2026", link: "forum-infermieristico-2026.html",
    tag_en: "Concluded", testo_en: "Nursing Forum: Quality, Safety and Clinical Risk — Bari, 30 October 2026" },

  { tag: "Book of Abstracts", testo: "Online PERSPECTIVES 1(1): i 17 lavori del Forum di Bari, con DOI su Zenodo", link: "eventi.html#book-of-abstracts",
    testo_en: "PERSPECTIVES 1(1) is online: the 17 papers of the Bari Forum, with DOIs on Zenodo" },

  // Esempi già pronti — togli le // per attivarli:
  // { tag: "Eventi", testo: "Nuovi eventi", link: "eventi.html", nuovo: true },
  // { tag: "Lavori", testo: "Online il libro dei lavori del Forum di Bari", link: "forum-infermieristico-2026.html#lavori" },
  // { tag: "Journal", testo: "È online il primo numero di VIGIL", link: "vigiljournal.html" },
  // { tag: "Toolkit", testo: "Nuovo strumento nel Toolkit: calcolo del campione", link: "strumenti-campione.html" },

];

/* Velocità di scorrimento in pixel al secondo (più alto = più veloce). */
window.ANIQRC_NEWS_SPEED = 60;


/* =========================================================
   ── DA QUI IN GIÙ NON SERVE MODIFICARE NULLA ──
   Motore del nastro: costruisce, duplica e anima le voci.
   ========================================================= */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function inglese() { return (document.documentElement.getAttribute('lang') || '').slice(0, 2) === 'en'; }

  function itemHTML(it) {
    var en = inglese();
    var tag = en && it.tag_en ? it.tag_en : it.tag;
    var txt = en && it.testo_en ? it.testo_en : it.testo;
    var inner = '';
    if (it.nuovo) inner += '<span class="nb-new" aria-hidden="true"></span>';
    if (tag) inner += '<span class="nb-tag">' + esc(tag) + '</span>';
    inner += '<span class="nb-txt">' + esc(txt) + '</span>';

    var html;
    if (it.link) {
      var target = it.esterno ? ' target="_blank" rel="noopener"' : '';
      inner += '<span class="nb-arr" aria-hidden="true">→</span>';
      html = '<a class="nb-item" href="' + esc(it.link) + '"' + target + '>' + inner + '</a>';
    } else {
      html = '<span class="nb-item nb-static">' + inner + '</span>';
    }
    return html + '<span class="nb-sep" aria-hidden="true">•</span>';
  }

  function build() {
    var bar = document.getElementById('newsbar');
    var track = document.getElementById('newsbarTrack');
    var view = bar && bar.querySelector('.newsbar-viewport');
    if (!bar || !track || !view) return;
    track.setAttribute('data-noi18n', '');   /* la traduzione la fa questo file (tag_en, testo_en) */

    var news = Array.isArray(window.ANIQRC_NEWS) ? window.ANIQRC_NEWS.filter(function (n) {
      return n && n.testo;
    }) : [];

    if (!news.length) { bar.hidden = true; bar.style.display = 'none'; return; }
    bar.hidden = false;

    var seq = news.map(itemHTML).join('');

    // una sola copia, per misurare
    track.style.animation = 'none';
    track.innerHTML = seq;
    var unit = track.scrollWidth;
    if (!unit) { track.innerHTML = seq + seq; return; }

    // ripete la sequenza finché non copre almeno la larghezza visibile,
    // poi la raddoppia: le due metà identiche rendono il loop invisibile
    var need = Math.max(1, Math.ceil((view.clientWidth + 80) / unit));
    var half = '';
    for (var i = 0; i < need; i++) half += seq;
    track.innerHTML = half + half;

    // durata calcolata sulla metà, così la velocità resta costante
    var speed = Number(window.ANIQRC_NEWS_SPEED) || 60;
    var dur = (unit * need) / speed;
    track.style.setProperty('--nb-dur', dur.toFixed(2) + 's');
    track.style.animation = '';
    bar.classList.add('ready');
  }

  function init() {
    build();
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(build, 250);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(build).catch(function () {});
    }
    /* cambio di lingua (pulsante Italiano / English): il nastro si ricostruisce */
    if (window.MutationObserver) {
      new MutationObserver(function () { build(); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
