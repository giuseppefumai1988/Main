// Funzione Netlify: recupera un feed RSS/Atom lato server (niente CORS, niente limiti di terzi).
// Endpoint: /.netlify/functions/feed?url=<indirizzo del feed>
// Per sicurezza accetta solo i domini elencati in ALLOWED.

const ALLOWED = [
  'nursetimes.org',
  'nurse24.it',
  'assocarenews.it',
  'quotidianosanita.it',
  'sanitainformazione.it',
  'fnopi.it',
  'youtube.com'
];

function resp(statusCode, body, type) {
  return {
    statusCode,
    headers: {
      'Content-Type': type || 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=900'
    },
    body
  };
}

exports.handler = async (event) => {
  const url = (event.queryStringParameters && event.queryStringParameters.url) || '';
  let host;
  try {
    host = new URL(url).hostname.replace(/^www\./, '');
  } catch (e) {
    return resp(400, 'URL non valido');
  }
  const ok = ALLOWED.some(d => host === d || host.endsWith('.' + d));
  if (!ok) return resp(403, 'Dominio non consentito');

  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (ANIQRC feed proxy)', 'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*' }
    });
    if (!r.ok) return resp(502, 'Sorgente non raggiungibile (' + r.status + ')');
    const text = await r.text();
    return resp(200, text, 'application/xml; charset=utf-8');
  } catch (e) {
    return resp(500, 'Errore: ' + (e && e.message ? e.message : String(e)));
  }
};
