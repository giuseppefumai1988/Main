/* =========================================================
   ANIQRC — ricezione della domanda di adesione
   Riceve i dati del modulo e la bozza di tesserino generata
   dal browser, e li inoltra per email alla presidenza.

   Il sito resta dov'è: questa funzione può vivere su un sito
   Netlify separato, usato solo come recapito. Basta incollare
   il suo indirizzo in ENDPOINT dentro aniqrc-adesione.js.

   VARIABILI D'AMBIENTE da impostare su Netlify
   (Site settings → Environment variables):

     SMTP_HOST = smtps.aruba.it
     SMTP_PORT = 465
     SMTP_USER = giuseppe.fumai@aniqrc.it
     SMTP_PASS = (la password della casella)
     MAIL_TO   = giuseppe.fumai@aniqrc.it      (facoltativa)
     ORIGINE   = https://aniqrc.it             (facoltativa)

   Dipendenza: nodemailer.  In package.json:  "nodemailer": "^6"
   ========================================================= */

import nodemailer from 'nodemailer';

const ORIGINE = process.env.ORIGINE || 'https://aniqrc.it';

const CORS = {
  'Access-Control-Allow-Origin': ORIGINE,
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const ETICHETTE = [
  ['Nome', 'nome'], ['Cognome', 'cognome'], ['Email', 'email'], ['Telefono', 'telefono'],
  ['Codice fiscale', 'codice_fiscale'], ['Regione', 'regione'],
  ['Professione', 'professione'], ['Albo OPI', 'albo_opi'], ['Ente', 'ente'],
  ['Categoria', 'categoria_socio'], ['Aree di interesse', 'interessi'],
  ['Note', 'messaggio'], ['Consenso privacy', 'consenso_privacy'],
  ['Consenso newsletter', 'consenso_newsletter'],
];

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: CORS });
  if (req.method !== 'POST')    return new Response('Metodo non consentito', { status: 405, headers: CORS });

  let body;
  try { body = await req.json(); }
  catch { return new Response('JSON non valido', { status: 400, headers: CORS }); }

  const campi = body?.campi || {};
  if (!campi.nome || !campi.cognome || !campi.email) {
    return new Response('Campi obbligatori mancanti', { status: 400, headers: CORS });
  }

  const nome = `${campi.nome} ${campi.cognome}`.trim();

  const righe = ETICHETTE
    .filter(([, k]) => campi[k])
    .map(([l, k]) => `<tr><td style="padding:5px 14px 5px 0;color:#75736B;font-size:13px;white-space:nowrap">${esc(l)}</td>` +
                     `<td style="padding:5px 0;color:#14120E;font-size:14px"><b>${esc(campi[k])}</b></td></tr>`)
    .join('');

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:620px">
    <div style="background:#0A0A0A;color:#F4F2EC;padding:18px 22px">
      <div style="font-size:20px;font-weight:bold;letter-spacing:-.02em">ANI<span style="color:#E63946">Q</span>RC</div>
      <div style="font-size:11px;letter-spacing:.14em;color:#8A857A;margin-top:4px">NUOVA DOMANDA DI ADESIONE</div>
    </div>
    <div style="padding:22px;background:#FBFAF6">
      <p style="margin:0 0 16px;font-size:15px;color:#14120E"><b>${esc(nome)}</b> ha inviato una domanda di adesione dal sito.</p>
      <table style="border-collapse:collapse">${righe}</table>
      ${body?.tessera?.pdfBase64
        ? `<p style="margin:20px 0 0;font-size:13px;color:#3E3A33;border-left:3px solid #E63946;padding-left:12px">
             In allegato la <b>bozza di tesserino</b> con i dati della domanda. Il numero di tessera va assegnato
             quando il Consiglio Direttivo delibera: rigenera la versione definitiva da <b>tesserino.html</b>.</p>`
        : `<p style="margin:20px 0 0;font-size:13px;color:#8A857A">Bozza di tesserino non disponibile per questa domanda.</p>`}
      <p style="margin:22px 0 0;font-size:11px;color:#8A857A">Messaggio generato automaticamente da aniqrc.it</p>
    </div>
  </div>`;

  const testo = ETICHETTE.filter(([, k]) => campi[k])
    .map(([l, k]) => `${l}: ${campi[k]}`).join('\n');

  const allegati = [];
  if (body?.tessera?.pdfBase64) {
    allegati.push({
      filename: body.tessera.nomeFile || 'Tessera_bozza.pdf',
      content: Buffer.from(body.tessera.pdfBase64, 'base64'),
      contentType: 'application/pdf',
    });
  }

  try {
    const trasporto = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await trasporto.sendMail({
      from: `ANIQRC — Adesioni <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO || 'giuseppe.fumai@aniqrc.it',
      replyTo: campi.email,
      subject: `Nuova adesione ANIQRC — ${nome}`,
      text: `Nuova domanda di adesione\n\n${testo}\n\n— aniqrc.it`,
      html,
      attachments: allegati,
    });
  } catch (e) {
    console.error('invio non riuscito', e);
    return new Response('Invio non riuscito', { status: 502, headers: CORS });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
};
