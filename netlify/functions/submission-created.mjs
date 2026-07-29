// netlify/functions/submission-created.mjs
//
// Funzione attivata AUTOMATICAMENTE da Netlify a ogni invio di un Netlify Form.
// Per il form "adesione" compone una ricevuta formattata (stampabile)
// e lo invia a giuseppe.fumai@aniqrc.it con cc a colonna e morelli,
// spedendolo dalla casella Aruba giuseppe.fumai@aniqrc.it.
//
// Richiede: la dipendenza "nodemailer" e due variabili d'ambiente su Netlify:
//   SMTP_USER = giuseppe.fumai@aniqrc.it
//   SMTP_PASS = (password della casella — impostata SOLO nel pannello Netlify)

import nodemailer from 'nodemailer';

const FROM = 'ANIQRC – Adesioni <giuseppe.fumai@aniqrc.it>';
const TO   = 'giuseppe.fumai@aniqrc.it';
const CC   = ['giuseppe.colonna@aniqrc.it', 'claudio.morelli@aniqrc.it'];

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const payload = body.payload || {};

    // Gestisci solo il modulo di adesione (ignora eventuali altri form futuri)
    if (payload.form_name && payload.form_name !== 'adesione') {
      return { statusCode: 200, body: 'ignored: ' + payload.form_name };
    }

    const d = payload.data || {};
    const val = (k) => {
      const v = d[k];
      if (Array.isArray(v)) return v.filter(Boolean).join(', ');
      return (v === undefined || v === null || String(v).trim() === '') ? '—' : String(v);
    };

    const created = new Date(payload.created_at || Date.now());
    const dateStr = created.toLocaleString('it-IT', {
      timeZone: 'Europe/Rome', day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const fullName = `${val('nome')} ${val('cognome')}`.replace(/—/g, '').trim() || 'Socio';

    const rows = [
      ['Nome',                     'nome'],
      ['Cognome',                  'cognome'],
      ['Email',                    'email'],
      ['Telefono',                 'telefono'],
      ['Codice fiscale',           'codice_fiscale'],
      ['Regione',                  'regione'],
      ['Professione / qualifica',  'professione'],
      ['N. iscrizione Albo OPI',   'albo_opi'],
      ['Ente / struttura',         'ente'],
      ['Categoria di socio',       'categoria_socio'],
      ['Aree di interesse',        'interessi'],
      ['Note',                     'messaggio'],
      ['Consenso privacy',         'consenso_privacy'],
      ['Consenso newsletter',      'consenso_newsletter'],
    ];

    // Versione testo (fallback)
    const text =
      `ANIQRC — Nuova domanda di adesione\n` +
      `Ricevuta il ${dateStr}\n\n` +
      rows.map(([label, key]) => `${label}: ${val(key)}`).join('\n') +
      `\n\n— Email generata automaticamente dal sito aniqrc.it`;

    // Versione HTML (la ricevuta, pronta da stampare per il registro)
    const trHtml = rows.map(([label, key]) => `
      <tr>
        <td style="padding:10px 14px;border:1px solid #D4D0C5;background:#FBFAF6;font-weight:600;color:#34332F;width:40%;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:14px;">${label}</td>
        <td style="padding:10px 14px;border:1px solid #D4D0C5;color:#0A0A0A;font-family:Arial,Helvetica,sans-serif;font-size:14px;">${escapeHtml(val(key))}</td>
      </tr>`).join('');

    const html = `
    <div style="background:#F4F2EC;padding:28px 0;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" align="center" style="width:640px;max-width:100%;margin:0 auto;background:#FBFAF6;border:1px solid #D4D0C5;border-radius:12px;border-collapse:separate;overflow:hidden;">
        <tr>
          <td style="background:#0A0A0A;padding:20px 26px;color:#F4F2EC;">
            <div style="font-size:20px;font-weight:bold;letter-spacing:-0.5px;">ANI<span style="color:#E63946;">Q</span>RC</div>
            <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#B8B5AD;margin-top:3px;">Domanda di adesione — ricevuta</div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 26px 8px 26px;">
            <div style="font-size:17px;font-weight:bold;color:#0A0A0A;">${escapeHtml(fullName)}</div>
            <div style="font-size:13px;color:#75736B;margin-top:4px;">Ricevuta il ${dateStr}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 26px 26px 26px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;width:100%;">
              ${trHtml}
            </table>
          </td>
        </tr>
        <tr>
          <td style="background:#EAE6DC;padding:14px 26px;font-size:11px;color:#75736B;text-transform:uppercase;letter-spacing:1px;">
            ANIQRC · Email generata automaticamente da aniqrc.it
          </td>
        </tr>
      </table>
    </div>`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtps.aruba.it',
      port: Number(process.env.SMTP_PORT || 465),
      secure: true, // SSL su porta 465
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: FROM,
      to: TO,
      cc: CC,
      replyTo: (d.email && String(d.email).includes('@')) ? d.email : undefined,
      subject: `Nuova domanda di adesione — ${fullName}`,
      text,
      html,
    });

    return { statusCode: 200, body: 'email inviata' };
  } catch (err) {
    console.error('submission-created error:', err);
    // Restituisco 200 per non far ritentare all'infinito; l'errore resta nei log.
    return { statusCode: 200, body: 'errore: ' + (err && err.message) };
  }
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
