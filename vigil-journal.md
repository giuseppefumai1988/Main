# VIGIL — International Journal of Nursing Safety and Clinical Governance

Rivista scientifica dell'ANIQRC. Storia del titolo: «Primum Nursing Journal (PNJ)» (agosto 2026)
→ «RING — Risk International Nursing Group Journal» (24 settembre) → «VIGÍL» (28 ottobre) →
**VIGIL, senza accento** (novembre 2026). RING è stato scartato perché già esistente.

| Voce | Valore |
|------|--------|
| Titolo | VIGIL — International Journal of Nursing Safety and Clinical Governance |
| Editore | ANIQRC — Via Napoli 369/Q, 70132 Bari · C.F. 93568220722 |
| Executive Editor | Giuseppe Fumai (unica carica pubblicata sul sito, su sua indicazione) |
| Modello | Diamond open access, **CC BY-NC-ND 4.0** (dal PDF della call; prima sul sito CC BY 4.0) |
| Periodicità | Quadrimestrale: 3 numeri l'anno (gen–apr, mag–ago, set–dic) |
| Peer review | Doppio cieco, linee guida COPE |
| Identificativi | e-ISSN in corso di assegnazione; DOI Crossref previsto |

Fonte dei contenuti pubblicati: **Bozza della Call for Abstracts VIGIL 2027 (EN)**, PDF di 2 pagine
«Draft · for board review» (Volume 1 · 2027; date per il numero 2, mag–ago 2027: abstract entro
31 gen 2027, selezione 28 feb, manoscritto 30 apr, revisione mag–lug, pubblicazione ago 2027).
Il PDF usa Inter + Bricolage Grotesque e i colori `#12263A` / `#E63946`: da qui la nuova identità
del sito (vedi `claude/dati-istituzionali-e-changelog.md`).

## La pagina `vigiljournal.html` (9 novembre 2026)

- **Italiano di default, inglese con la bandierina** (pulsante con bandiera UK / Italia nella barra
  in alto). Tutti i testi sono doppi: blocchi `data-l="it"` e `data-l="en"`, nascosti via CSS secondo
  `html[data-lang]`. Lingua ricordata in `localStorage('vigil-lang')`; link diretto `?lang=en`.
- **Testata come nel PDF**: riga «Published by ANIQRC · Diamond open access · Quadrimestrale…»,
  «VIGIL.» grande a sinistra, sottotitolo «International Journal of / Nursing Safety and Clinical
  Governance» a destra, «e-ISSN in corso di assegnazione»; sotto: «Executive Editor: Giuseppe Fumai».
- Fascia **Call for abstracts** sull'immagine pittorica del PDF (`vigil-texture.jpg`).
- **Call 2027: «Pagina in lavorazione»** (decisione del 9 nov, il PDF è ancora una bozza per il board):
  la scheda mostra solo il riquadro in lavorazione; il link della fascia dice «Pagina in lavorazione».
  Giuseppe ha inserito la modifica a mano su GitHub (due righe di `vigiljournal.html`). Date e requisiti
  del PDF restano annotati sopra per quando la call verrà pubblicata.
- **Menu a transizione** (sticky): 12 schede con indicatore rosso che scorre, cambio pannello con
  dissolvenza e scorrimento laterale; ogni scheda ha il suo indirizzo (`#board`, `#ethics`…);
  tasti freccia; pulsante «Tutto in una pagina» (e stampa) che mostra tutte le sezioni insieme.
- Schede: Panoramica (con i 16 principi di trasparenza COPE·DOAJ·OASPA·WAME collegati alle sezioni),
  Il journal, Obiettivi e ambiti, Comitato editoriale, Peer review, Etica e COPE, Accesso aperto e
  licenza, Costi e finanziamento, Per gli autori, Call 2027, Archiviazione e indicizzazione, Contatti.
- **Regola di Giuseppe (9 nov): non definire ciò che non è deciso.** Comitato editoriale: solo
  l'Executive Editor; Direzione scientifica, Editor-in-Chief, Editorial Board e Redazione sono
  riquadri vuoti «In preparazione». Lo stesso per norme per gli autori, procedura di peer review,
  conservazione e indicizzazione, e la call for abstracts (le politiche etiche, il copyright e i costi
  sono stati scritti il 9 nov, vedi sotto).
  Pubblicato solo ciò che è nel PDF della call più i dati istituzionali dell'editore.
- **Politiche v1.0 (9 nov, pubblicate)** in `/home/claude/work/policies.py`, IT+EN: Etica e COPE
  (autorialità ICMJE + CRediT; conflitti di interesse; approvazione etica e consenso; cattiva condotta
  con diagrammi COPE; correzioni, espressione di preoccupazione, ritrattazioni; ricorsi entro 30 giorni
  a un editor estraneo alla decisione, esito definitivo, poi COPE; IA non autrice, uso dichiarato,
  revisori non caricano manoscritti in IA; dichiarazione di disponibilità dei dati). Copyright agli
  autori + CC BY-NC-ND 4.0; autoarchiviazione di preprint (dichiarato all'invio), versione accettata e
  pubblicata senza embargo. Nessun finanziamento esterno (costi tecnici a carico di ANIQRC, lavoro
  volontario), nessuna pubblicità, nessun marketing diretto (solo sito, social, newsletter agli iscritti).
- Sorgente: `/home/claude/work/build_vj.py` (+ `vj.css`, `vj.js`), genera `vigiljournal.html`.
- `journal.html` reindirizza a `vigiljournal.html` (noindex, canonical verso la nuova pagina).

## Marchio

«VIGIL.» in **Bricolage Grotesque ExtraBold**, blu notte, punto rosso (`logo-vigil.svg`,
`logo-vigil-512.png` bianco su blu, `og-journal.png` con testata come nel PDF). Generatore:
`/home/claude/logo/vigil_mark.py`. I vecchi `logo-ring-512.png`, `logo-pnj-512.png` non sono usati.

## Punti aperti

- Composizione del comitato editoriale da pubblicare quando definita.
- Norme per gli autori, procedura di peer review, archiviazione: da scrivere.
- Lingua di pubblicazione degli articoli (la call chiede abstract in inglese).
- Licenza: CC BY-NC-ND 4.0 nel PDF; verificare la scelta in vista di DOAJ.
- Confermare abbreviazione ISO 4; rigenerare il modello del numero (ancora intestato a RING).
- ISSN, prefisso DOI Crossref: ancora da richiedere.
