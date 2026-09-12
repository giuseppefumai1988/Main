/* =========================================================
   ANIQRC — ricezione della domanda di adesione (Google Apps Script)
   Alternativa gratuita alla funzione Netlify: spedisce la mail
   dalla casella Google con cui pubblichi lo script.

   COME SI ATTIVA (cinque minuti)
   1. Vai su script.google.com e crea un nuovo progetto.
   2. Incolla questo file al posto del contenuto di Codice.gs.
   3. In alto a destra: Distribuisci → Nuova distribuzione →
      tipo «App web».
        · Esegui come: Io
        · Chi ha accesso: Chiunque
   4. Autorizza (Google chiede il permesso di inviare email
      a tuo nome: è la prima volta e basta).
   5. Copia l'indirizzo che finisce in /exec e incollalo in
      ENDPOINT dentro aniqrc-adesione.js.

   Limite: circa 100 email al giorno con un account Gmail
   gratuito, 1.500 con Workspace. Più che sufficiente.
   ========================================================= */

var DESTINATARIO = 'giuseppe.fumai@aniqrc.it';

var ETICHETTE = [
  ['Nome', 'nome'], ['Cognome', 'cognome'], ['Email', 'email'], ['Telefono', 'telefono'],
  ['Codice fiscale', 'codice_fiscale'], ['Regione', 'regione'],
  ['Professione', 'professione'], ['Albo OPI', 'albo_opi'], ['Ente', 'ente'],
  ['Categoria', 'categoria_socio'], ['Aree di interesse', 'interessi'],
  ['Note', 'messaggio'], ['Consenso privacy', 'consenso_privacy'],
  ['Consenso newsletter', 'consenso_newsletter']
];

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var campi = body.campi || {};
    if (!campi.nome || !campi.cognome || !campi.email) {
      return risposta({ ok: false, errore: 'campi obbligatori mancanti' });
    }

    var nome = (campi.nome + ' ' + campi.cognome).trim();

    var righe = ETICHETTE.filter(function (c) { return campi[c[1]]; }).map(function (c) {
      return '<tr><td style="padding:5px 14px 5px 0;color:#75736B;font-size:13px;white-space:nowrap">' +
             esc(c[0]) + '</td><td style="padding:5px 0;color:#14120E;font-size:14px"><b>' +
             esc(campi[c[1]]) + '</b></td></tr>';
    }).join('');

    var nota = body.tessera && body.tessera.pdfBase64
      ? '<p style="margin:20px 0 0;font-size:13px;color:#3E3A33;border-left:3px solid #E63946;padding-left:12px">' +
        'In allegato la <b>bozza di tesserino</b> con i dati della domanda. Il numero di tessera va assegnato ' +
        'quando il Consiglio Direttivo delibera: rigenera la versione definitiva da <b>tesserino.html</b>.</p>'
      : '<p style="margin:20px 0 0;font-size:13px;color:#8A857A">Bozza di tesserino non disponibile.</p>';

    var html =
      '<div style="font-family:Arial,Helvetica,sans-serif;max-width:620px">' +
        '<div style="background:#0A0A0A;color:#F4F2EC;padding:18px 22px">' +
          '<div style="font-size:20px;font-weight:bold">ANI<span style="color:#E63946">Q</span>RC</div>' +
          '<div style="font-size:11px;letter-spacing:.14em;color:#8A857A;margin-top:4px">NUOVA DOMANDA DI ADESIONE</div>' +
        '</div>' +
        '<div style="padding:22px;background:#FBFAF6">' +
          '<p style="margin:0 0 16px;font-size:15px;color:#14120E"><b>' + esc(nome) + '</b> ha inviato una domanda di adesione dal sito.</p>' +
          '<table style="border-collapse:collapse">' + righe + '</table>' + nota +
          '<p style="margin:22px 0 0;font-size:11px;color:#8A857A">Messaggio generato automaticamente da aniqrc.it</p>' +
        '</div>' +
      '</div>';

    var opzioni = { htmlBody: html, name: 'ANIQRC — Adesioni', replyTo: campi.email };

    if (body.tessera && body.tessera.pdfBase64) {
      opzioni.attachments = [Utilities.newBlob(
        Utilities.base64Decode(body.tessera.pdfBase64),
        'application/pdf',
        body.tessera.nomeFile || 'Tessera_bozza.pdf'
      )];
    }

    MailApp.sendEmail(
      body.destinatario || DESTINATARIO,
      'Nuova adesione ANIQRC — ' + nome,
      ETICHETTE.filter(function (c) { return campi[c[1]]; })
               .map(function (c) { return c[0] + ': ' + campi[c[1]]; }).join('\n'),
      opzioni
    );

    return risposta({ ok: true });
  } catch (err) {
    return risposta({ ok: false, errore: String(err) });
  }
}

/* Apps Script risponde sempre con CORS aperto sulle app web /exec */
function risposta(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput('ANIQRC — endpoint adesioni attivo.');
}
