/* =========================================================
   ANIQRC — costruttore del newsfeed
   Legge i feed RSS/Atom delle testate infermieristiche e scrive
   news-feed.json nella radice del sito. Lo esegue l'automazione
   .github/workflows/newsfeed.yml; si può lanciare anche a mano:

       node tools/build-newsfeed.mjs

   Nessuna dipendenza: solo Node 20 o superiore.

   Per aggiungere o togliere una testata modifica TESTATE qui
   sotto e l'elenco gemello in aniqrc-newsfeed.js.
   ========================================================= */

import { writeFile, readFile } from 'node:fs/promises';

const TESTATE = [
  {
    nome: 'Nurse Times',
    sito: 'https://www.nursetimes.org/',
    // provate in ordine: vince la prima che restituisce voci
    feed: [
      'https://nursetimes.org/feed/',            // indirizzo già usato dal sito
      'https://www.nursetimes.org/feed',
      'https://www.nursetimes.org/rss',
    ],
  },
  {
    nome: 'Nurse24',
    sito: 'https://www.nurse24.it/',
    feed: [
      'https://www.nurse24.it/feed.html',        // indirizzo già usato dal sito
      'https://www.nurse24.it/rss.xml',
      'https://www.nurse24.it/feed',
      'https://www.nurse24.it/rss',
    ],
  },
  {
    nome: 'InfermieriAttivi',
    sito: 'https://www.infermieriattivi.it/',
    feed: [
      'https://www.infermieriattivi.it/feed',
      'https://www.infermieriattivi.it/feed/',
      'https://www.infermieriattivi.it/rss',
      'https://www.infermieriattivi.it/index.php?format=feed&type=rss',
    ],
  },
];

const PER_TESTATA = 5;   // voci prese da ciascuna testata
const TOTALE = 12;       // voci scritte nel file finale
const OUT = 'news-feed.json';

/* ---------- utilità ---------- */

const ENTITA = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  laquo: '«', raquo: '»', hellip: '…', egrave: 'è', eacute: 'é',
  agrave: 'à', ograve: 'ò', ugrave: 'ù', igrave: 'ì', rsquo: '’', lsquo: '‘',
  ldquo: '“', rdquo: '”', ndash: '–', mdash: '—', euro: '€',
};

function decodifica(t) {
  return String(t || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITA[n.toLowerCase()] ?? m)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function primo(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'));
  return m ? decodifica(m[1]) : '';
}

/* il <link> di Atom porta l'indirizzo nell'attributo href */
function estraiLink(blocco) {
  const rss = blocco.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
  if (rss && rss[1].trim()) return decodifica(rss[1]);
  const atom = blocco.match(/<link[^>]*rel=["']?alternate["']?[^>]*href=["']([^"']+)["']/i)
            || blocco.match(/<link[^>]*href=["']([^"']+)["']/i);
  return atom ? decodifica(atom[1]) : '';
}

function parseFeed(xml) {
  const blocchi = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
  const voci = [];
  for (const b of blocchi) {
    const titolo = primo(b, 'title');
    const link = estraiLink(b);
    if (!titolo || !/^https?:\/\//i.test(link)) continue;
    const data = primo(b, 'pubDate') || primo(b, 'published') || primo(b, 'updated') || primo(b, 'dc:date');
    const t = Date.parse(data);
    voci.push({ titolo, link, data: Number.isNaN(t) ? null : new Date(t).toISOString() });
  }
  return voci;
}

async function scarica(url) {
  const ctrl = new AbortController();
  const stop = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'user-agent': 'ANIQRC-newsfeed/1.0 (+https://aniqrc.it)',
        'accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5',
      },
    });
    if (!r.ok) return null;
    return await r.text();
  } catch {
    return null;
  } finally {
    clearTimeout(stop);
  }
}

async function leggiTestata(t) {
  for (const url of t.feed) {
    const xml = await scarica(url);
    if (!xml) { console.log(`  · ${url} — non raggiungibile`); continue; }
    const voci = parseFeed(xml);
    if (voci.length) {
      console.log(`  ✓ ${url} — ${voci.length} voci`);
      return voci.slice(0, PER_TESTATA).map(v => ({ ...v, fonte: t.nome }));
    }
    console.log(`  · ${url} — nessuna voce riconosciuta`);
  }
  console.log(`  ✗ ${t.nome}: nessun feed utilizzabile`);
  return [];
}

/* alterna le testate, così la barra non è monopolizzata da una sola */
function intreccia(gruppi) {
  const out = [];
  for (let i = 0; out.length < TOTALE; i++) {
    let aggiunto = false;
    for (const g of gruppi) {
      if (g[i]) { out.push(g[i]); aggiunto = true; }
      if (out.length >= TOTALE) break;
    }
    if (!aggiunto) break;
  }
  return out;
}

/* ---------- esecuzione ---------- */

console.log('Newsfeed ANIQRC — raccolta dei titoli');
const gruppi = [];
for (const t of TESTATE) {
  console.log(`${t.nome}:`);
  gruppi.push(await leggiTestata(t));
}

const voci = intreccia(gruppi);

if (!voci.length) {
  console.error('Nessuna voce raccolta: il file non viene toccato.');
  process.exit(1);
}

const nuovo = {
  aggiornato: new Date().toISOString(),
  fonti: TESTATE.map(t => ({ nome: t.nome, sito: t.sito })),
  voci,
};

/* riscrive solo se i titoli sono cambiati: evita commit inutili */
let uguale = false;
try {
  const vecchio = JSON.parse(await readFile(OUT, 'utf8'));
  uguale = JSON.stringify(vecchio.voci) === JSON.stringify(nuovo.voci);
} catch { /* il file non c'è ancora */ }

if (uguale) {
  console.log('Nessuna novità: news-feed.json invariato.');
} else {
  await writeFile(OUT, JSON.stringify(nuovo, null, 2) + '\n', 'utf8');
  console.log(`Scritto ${OUT} — ${voci.length} voci.`);
}
