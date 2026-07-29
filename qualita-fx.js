/* =========================================================
   ANIQRC — qualita-fx.js
   Effetti condivisi: barra avanzamento scroll, glow "a lente"
   che segue il cursore sulle card, count-up dei numeri.
   Rispetta prefers-reduced-motion e i dispositivi touch.
   Inclusione: <script src="qualita-fx.js" defer></script>
   ========================================================= */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = !window.matchMedia || matchMedia('(hover: hover)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* ---------- 1. Barra di avanzamento scroll ---------- */
  function initProgress() {
    var bar = document.createElement('div');
    bar.className = 'fx-progress';
    document.body.appendChild(bar);
    var ticking = false;
    function upd() {
      var h = document.documentElement;
      var max = (h.scrollHeight - h.clientHeight) || 1;
      var p = Math.min(1, Math.max(0, h.scrollTop / max));
      bar.style.transform = 'scaleX(' + p + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(upd); ticking = true; }
    }, { passive: true });
    upd();
  }

  /* ---------- 2. Glow "a lente" sulle card ---------- */
  var SPOT_SEL = '.chart-card, .kpi, .inst, .tool-card, .calc-panel, .lit-card, .result-box, .method, .hub-card, .table-card';
  function initSpotlight() {
    if (!canHover || reduce) return;
    var cards = document.querySelectorAll(SPOT_SEL);
    cards.forEach(function (card) {
      if (card.querySelector(':scope > .fx-lens')) return;
      card.classList.add('fx-card');
      var lens = document.createElement('span');
      lens.className = 'fx-lens';
      lens.setAttribute('aria-hidden', 'true');
      card.appendChild(lens);
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
  }

  /* ---------- 3. Count-up numeri ---------- */
  function parseItNumber(str) {
    var m = String(str).trim().match(/^([\d.,]+)(.*)$/);
    if (!m) return null;
    var numPart = m[1], suffix = m[2] || '';
    var decimals = (numPart.split(',')[1] || '').length;
    var value = parseFloat(numPart.replace(/\./g, '').replace(',', '.'));
    if (isNaN(value)) return null;
    return { value: value, decimals: decimals, suffix: suffix };
  }
  function fmtIt(n, dec) {
    try { return n.toLocaleString('it-IT', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
    catch (e) { return dec ? n.toFixed(dec) : String(Math.round(n)); }
  }
  function countUp(el) {
    // unit span (.u) viene preservato
    var unit = el.querySelector('.u');
    var unitHTML = unit ? unit.outerHTML : '';
    var main = el.textContent;
    if (unit) main = main.replace(unit.textContent, '');
    var parsed = parseItNumber(main);
    if (!parsed) return;
    var dur = 1400, t0 = null;
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var cur = parsed.value * ease(p);
      el.innerHTML = fmtIt(cur, parsed.decimals) + parsed.suffix + unitHTML;
      if (p < 1) requestAnimationFrame(step);
      else el.innerHTML = fmtIt(parsed.value, parsed.decimals) + parsed.suffix + unitHTML;
    }
    requestAnimationFrame(step);
  }
  function initCountUp() {
    var targets = document.querySelectorAll('.kpi-val, [data-countup]');
    if (!targets.length) return;
    if (reduce || !('IntersectionObserver' in window)) return; // lascia i valori statici
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !seen.has(e.target)) {
          seen.add(e.target);
          // piccolo ritardo per accompagnare il reveal a cascata
          setTimeout(function () { countUp(e.target); }, 120);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    targets.forEach(function (t) { io.observe(t); });
  }

  ready(function () {
    initProgress();
    initSpotlight();
    initCountUp();
    initTitles();
  });

  /* ---------- 4. Titoli che si compongono parola per parola ---------- */
  function splitTitle(el) {
    if (el.dataset.fxSplit) return;
    el.dataset.fxSplit = '1';
    var counter = { n: 0 };
    function process(node) {
      var kids = Array.prototype.slice.call(node.childNodes);
      var frag = [];
      kids.forEach(function (ch) {
        if (ch.nodeType === 3) {
          var parts = ch.textContent.split(/(\s+)/);
          parts.forEach(function (p) {
            if (p === '') return;
            if (/^\s+$/.test(p)) { frag.push(document.createTextNode(p)); return; }
            var w = document.createElement('span'); w.className = 'fx-w';
            var i = document.createElement('span'); i.className = 'fx-wi'; i.textContent = p;
            i.style.transitionDelay = (counter.n * 55) + 'ms'; counter.n++;
            w.appendChild(i); frag.push(w);
          });
        } else if (ch.nodeType === 1) {
          process(ch);
          frag.push(ch);
        } else { frag.push(ch); }
      });
      node.innerHTML = '';
      frag.forEach(function (n) { node.appendChild(n); });
    }
    process(el);
    el.classList.add('fx-title');
  }
  function initTitles() {
    if (reduce) return;
    var titles = document.querySelectorAll('.sec-title');
    if (!titles.length) return;
    titles.forEach(splitTitle);
    if (!('IntersectionObserver' in window)) {
      titles.forEach(function (t) { t.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.3 });
    titles.forEach(function (t) { io.observe(t); });
    setTimeout(function () { titles.forEach(function (t) { t.classList.add('in'); }); }, 3000);
  }
})();
