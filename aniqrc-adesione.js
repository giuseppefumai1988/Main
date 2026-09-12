/* =========================================================
   ANIQRC — INVIO DELLA DOMANDA DI ADESIONE
   Alla conferma del modulo questo script:
     1. costruisce la bozza di tesserino con i dati inseriti,
     2. la invia, in allegato, all'indirizzo della presidenza,
     3. porta l'utente alla pagina di ringraziamento.

   ┌──────────────────────────────────────────────────────────┐
   │  UNICA COSA DA CONFIGURARE                               │
   └──────────────────────────────────────────────────────────┘

   ENDPOINT è l'indirizzo che riceve la domanda e spedisce la
   mail. Un sito statico non può mandare email da solo: serve
   un piccolo servizio esterno. Ne trovi due pronti nel
   repository, scegline uno e incolla qui il suo indirizzo:

     · netlify/functions/iscrizione.mjs
       (funzione Netlify — usa la casella Aruba dell'Associazione)
       ENDPOINT = 'https://NOME-SITO.netlify.app/.netlify/functions/iscrizione'

     · tools/apps-script-iscrizione.gs
       (Google Apps Script — usa una casella Gmail, gratuito)
       ENDPOINT = 'https://script.google.com/macros/s/CODICE/exec'

   Finché ENDPOINT resta vuoto il modulo si comporta come
   prima: nessun invio, nessun errore, e in console compare
   un promemoria.
   ========================================================= */

window.ANIQRC_ADESIONE = {
  ENDPOINT: 'https://script.google.com/macros/s/CODICE/exec',
  DESTINATARIO: 'giuseppe.fumai@aniqrc.it',
  /* La tessera generata qui è una BOZZA: il numero lo assegna il
     Consiglio Direttivo quando delibera sulla domanda. Rimane
     marcata come tale finché non la rigeneri da tesserino.html. */
  BOZZA: true,
};

(function () {
  'use strict';

  var CFG = window.ANIQRC_ADESIONE;
  var form = document.querySelector('form[name="adesione"]');
  if (!form) return;

  var inviato = false;

  function carica(src) {
    return new Promise(function (res, rej) {
      if (window.ANIQRC_TESSERA) return res();
      var s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  function campi() {
    var fd = new FormData(form), o = {};
    fd.forEach(function (v, k) {
      if (k === 'bot-field' || k === 'form-name') return;
      o[k] = o[k] ? o[k] + ', ' + v : v;
    });
    return o;
  }

  function oggi() {
    var d = new Date();
    return ('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear();
  }

  function datiTessera(c) {
    var nome = ((c.nome||'') + ' ' + (c.cognome||'')).trim();
    var tipo = c.categoria_socio ? 'Socio ' + String(c.categoria_socio).toLowerCase() : 'Socio ordinario';
    return {
      num: CFG.BOZZA ? 'DA ASSEGNARE' : 'ANIQRC-0000',
      nome: nome || 'Nome Cognome',
      mansione: c.professione || 'Professione',
      tipo: tipo,
      email: c.email || '',
      data: oggi(),
      scadenza: '31/12/' + new Date().getFullYear(),
      foto: null,
      bozza: !!CFG.BOZZA,
    };
  }

  form.addEventListener('submit', async function (ev) {
    if (inviato) return;                    // secondo giro: lascia passare
    if (!CFG.ENDPOINT) {
      console.info('[ANIQRC] Nessun ENDPOINT configurato in aniqrc-adesione.js: ' +
                   'la domanda non viene inoltrata per email.');
      return;                               // comportamento invariato
    }

    ev.preventDefault();
    var btn = form.querySelector('button[type=submit]');
    var etichetta = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Invio in corso…'; }

    var c = campi();
    var payload = { campi: c, destinatario: CFG.DESTINATARIO, inviata: new Date().toISOString() };

    try {
      await carica('tessera-core.js');
      var d = datiTessera(c);
      payload.tessera = {
        nomeFile: 'Tessera_bozza_' + (c.cognome||'socio').replace(/[^A-Za-z0-9]+/g,'_') + '.pdf',
        pdfBase64: await window.ANIQRC_TESSERA.pdfBase64(d),
      };
    } catch (e) {
      /* se la tessera non si genera, la domanda parte lo stesso */
      console.warn('[ANIQRC] tessera non generata:', e);
    }

    try {
      await fetch(CFG.ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.warn('[ANIQRC] invio non riuscito:', e);
    }

    inviato = true;
    if (btn) { btn.disabled = false; btn.textContent = etichetta; }
    window.location.href = form.getAttribute('action') || '/grazie.html';
  });
})();
