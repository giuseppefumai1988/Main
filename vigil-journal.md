# VIGÍL — International Journal of Nursing Safety and Clinical Governance

Rivista scientifica dell'ANIQRC. Storia del titolo: «Primum Nursing Journal (PNJ)» (agosto 2026)
→ «RING — Risk International Nursing Group Journal» (24 settembre) → **VIGÍL** (deciso il
28 ottobre, sul sito dal 29 ottobre 2026). RING è stato scartato perché già esistente.

| Voce | Valore |
|------|--------|
| Titolo | VIGÍL — International Journal of Nursing Safety and Clinical Governance (VIGIL alla spagnola, I accentata) |
| Citazione proposta sul sito | Int. J. Nurs. Saf. Clin. Gov. (VIGÍL) — abbreviazione ISO 4 ricavata da Claude, **da confermare** |
| Editore | ANIQRC — Via Napoli 369/Q, 70132 Bari · C.F. 93568220722 |
| Modello | Diamond open access, CC BY 4.0 |
| Periodicità decisa (ott 2026) | 3 numeri l'anno, uno ogni 4 mesi, 18 articoli ciascuno — **il sito dice ancora «due numeri l'anno, maggio e novembre»: da allineare** |

## Il marchio (29 ottobre 2026)

Quadrato 200 × 200 nero, scritta `VIGÍL.` crema, punto rosso #E63946 (il punto del carattere
ingrandito del 22%, come nei marchi ANIQRC e RING). **Roboto Bold**, crenatura −0,02 em.
«VIGÍL.» è più largo di «RING.»: con l'altezza maiuscola di RING (52,85) uscirebbe a 192 unità,
quindi è ridotto a 178 unità d'inchiostro (margini 11), maiuscola ~49,1. Centrato sull'inchiostro
intero (accento compreso). L'accento resta crema: un solo punto rosso.

Generatore: `mark/mark.py` + `mark/gen.py` nella cartella di lavoro della sessione (fontTools sui
glifi di Roboto Bold da @fontsource/roboto 5). Le due path (lettere e punto) stanno in `vigil.json`.

Asset: `logo-vigil-512.png` (nuovo, nella CORE del service worker al posto di `logo-ring-512.png`),
`og-journal.png` rigenerata (1200 × 630). `logo-ring-512.png` e `logo-pnj-512.png` restano nel
repo ma non sono più usati.

## Il sito

- **`journal.html`** — title, description, Open Graph (`og-journal.png?v=3`), JSON-LD
  `Periodical` (alternateName: VIGÍL, VIGIL, titolo esteso, abbreviazione), marchio nelle cinque
  varianti colore (id `vigil-l` / `vigil-d`), h1, sottotitolo, citazione, piede.
  Sezione **«Perché VIGÍL»** riscritta da Claude: *vigil* = chi tiene la guardia; la vigilanza come
  funzione dell'organizzazione (farmacovigilanza, emovigilanza, dispositivi, segnalazione di
  eventi avversi e near miss). **Non spiega l'accento: testo da confermare.**
  Chiavi CloudCannon nuove: `vigil`, `vigil-viene-dal-latino`, `la-rivista-si-occupa-di-questo`.
- **`index.html`** — pulsante «Il journal VIGÍL», sezione `#journal` (marchio, titolo, sottotitolo
  «Diamond open access · Italiano e inglese», frase finale su *vigil*). Chiave
  `vigil-international-journal-of-nursing-safety`.
- `aniqrc-news.js`: la voce commentata per il lancio ora dice «il primo numero di VIGÍL».

## Organigramma

Deciso a ottobre 2026 (dettagli nella memoria di Claude e nel documento «Ruoli editoriali»):
non ancora pubblicato sul sito. La pagina dice ancora «Comitato editoriale in corso».

## Modello del numero

Il modello PDF/Word del numero 1 (settembre, `ring/build/`) è ancora intestato a RING: va
rigenerato con titolo, marchio e citazione VIGÍL. Specifiche tipografiche (gabbia 170 × 240 mm
ripresa da *Archivos de Prevención de Riesgos Laborales*, Roboto, mattone #994C33) invariate.

## Punti aperti

- Confermare abbreviazione ISO 4 e testo «Perché VIGÍL».
- Allineare periodicità sul sito (journal.html, sezione #journal della home).
- Rigenerare il modello del numero con il nuovo nome.
- ISSN, prefisso DOI Crossref: ancora da richiedere.
