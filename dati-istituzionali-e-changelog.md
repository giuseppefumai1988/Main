# ANIQRC — dati istituzionali e stato del sito

Documento di riferimento per il sito **aniqrc.it** (repo GitHub `giuseppefumai1988/Main`,
sito statico servito da GitHub Pages, nessuno step di build).

## ⚠ Regole di lavorazione sul repository — leggere prima di toccare il sito

1. **Il repository va sempre riallineato prima di modificarlo** (`git clone`/`git fetch` funzionano,
   il push no). Giuseppe lavora sul repo anche fuori da queste sessioni, direttamente
   dall'interfaccia web di GitHub. Se collega la cartella scaricata da GitHub (es.
   `Main-main-6`), confrontarla con `origin/main` (md5 dei file) prima di lavorarci.
2. **Non consegnare mai uno zip dell'intero sito.** Caricandolo, GitHub sovrascrive i file
   con la versione contenuta nello zip: se questa è costruita su una base vecchia,
   **cancella silenziosamente le modifiche fatte da Giuseppe nel frattempo**. Consegnare
   sempre e solo i **singoli file** modificati, o lavorare direttamente nella cartella
   collegata quando Giuseppe lo chiede.
3. **⚠ Attenzione ai file rinominati dal browser quando Giuseppe li ricarica.** Scaricando
   dalla chat un file che esiste già, il browser lo salva come `nome_1.html` / `nome (1).html`,
   e su GitHub finisce con quel nome. **Dopo ogni caricamento, controllare che non ci siano file
   con il suffisso `_1`, `_2`…** e che i file attesi siano davvero cambiati.
4. **Non aggiungere JavaScript che intercetti l'invio del modulo di adesione.** Vedi sotto.
5. **La home è `index.html`, alla radice.** Tutti i link interni alla home usano `href="/"`
   e il canonical è `https://aniqrc.it/`. `home.html` è solo un reindirizzo.
6. **Le cancellazioni fatte in locale non arrivano su GitHub** con «Add files via upload»:
   i file da togliere vanno cancellati uno per uno dall'interfaccia web.
7. **⚠ Giuseppe carica sempre nella cartella principale.** I file nuovi che consegniamo vanno
   nella radice, con un nome nuovo. Dopo ogni caricamento controllare il commit con `git show --stat`.
8. **Le SVG copiate in `/mnt/user-data/outputs` ricevono metadati C2PA** (blocco `<metadata>`):
   l'md5 non coincide con la copia di lavoro, il disegno sì. È normale (c'era già in `favicon.svg`).

## Identità visiva «VIGIL» (dal 9 novembre 2026)

Sostituisce l'identità del 25 settembre (Roboto, nero/crema/rosso).

- **Palette**: blu notte `#12263A` (ex nero `#0A0A0A`), bianco `#FFFFFF` (ex crema `#F4F2EC`),
  rosso `#E63946` / `#C0202E` invariati. Toni di servizio: testo `#22272E`/`#2B3645`, grigio
  `#5A6573`, filetti `#D6D9DE`, fondo tenue `#EEF2F7`, card `#F7F9FC`, blu medio `#2C5C8A`.
  Tema scuro: fondo `#0C1A2A`, card `#15283E`. Presi dal PDF della Call for Abstracts di VIGIL.
- **Caratteri**: **Bricolage Grotesque** 700/800 per titoli e numeri grandi, **Inter** 300–700
  per sottotitoli, testo, pulsanti e campi. **Ospitati sul sito** (`*.woff2` nella radice,
  latin + latin-ext), nessuna chiamata a Google Fonts.
- **Foglio comune `aniqrc-vigil.css`**: @font-face, variabili `:root` (anche tema scuro),
  `--font-display` / `--font-text`. È incluso **in fondo all'`<head>`** di ogni pagina, dopo gli stili
  inline, così ne sovrascrive le variabili. Nei CSS delle pagine `font-family` usa le due variabili.
- **Logo ANIQRC a mosaico** (`logo-aniqrc-mosaico.svg`, 690×770, con riflesso): lettere ANI/QRC in
  Roboto Bold (contorni uniti), riempite da ~1.680 tessere astratte (56 varianti `<symbol>`) con la
  palette campionata dal logo fotografico originale (marroni/ambra + qualche azzurro `#8EE6F0`);
  **nessuna foto, per privacy**. Contorno `#2B2B2B`, punto rosso = punto ingrandito del 22%, riflesso
  della seconda riga sotto un filetto. Generatore: `/home/claude/logo/gen_logo.py` (non nel repo).
  Varianti fuori dal repo: senza riflesso, tela 1080.
- **Marchio quadrato piccolo** (favicon, icone, nav): lo stesso ANI/QRC del 25 settembre, ora
  bianco su blu notte. Il mosaico non si legge sotto i 200 px.
- **Marchio VIGIL**: «VIGIL.» in Bricolage Grotesque ExtraBold, blu notte, punto rosso
  (`logo-vigil.svg`, `logo-vigil-512.png` bianco su blu).
- Asset rigenerati: favicon/icone/apple-touch, maskable, `og-image.png`, `og-journal.png`,
  18 `splash-*.png` (bianco + logo a mosaico). Script: `/home/claude/work/assets.py`.
- **Bianco ottico** (9 nov, richiesta di Giuseppe: «la palette deve essere la stessa della pagina del
  journal»): in tema chiaro `aniqrc-vigil.css` nasconde l'aurora (`#aniqrc-aurora`) e gli aloni rossi di
  `.hero::after` e `.page-hero::after`; `--bg-warm` e `--bg-card` = `#F7F9FC`; fondo `#FFFFFF` pieno.
  Gli aloni restano solo sui riquadri blu notte e nel tema scuro.
- **Tesserino** (`tessera-core.js`): **non ancora aggiornato** (Roboto, nero).

## Hero della home

Due colonne dai 1100 px in su. Sinistra: **logo a mosaico** (al posto del quadrato) + nome
dell'associazione + «Seguici su». L'`h1` «ANIQRC» resta nel codice ma è nascosto alla vista
(classe `sr`), per SEO e lettori di schermo. Destra: riquadro news (`aniqrc-newsfeed.js`).
Sfondo animato `aniqrc-bg.js` con macchie fredde (azzurrine) al posto di quelle calde.

## Pulsanteria squadrata

Raggio 0 ovunque, tranne i puntini decorativi. I `<button>` ereditano Inter da `aniqrc-vigil.css`.

## Il journal: VIGIL

**«VIGIL — International Journal of Nursing Safety and Clinical Governance»** (senza accento da
novembre). Pagina: **`vigiljournal.html`** (dal 9 novembre); `journal.html` è un reindirizzo.
Dettagli in **`claude/vigil-journal.md`**.

## Eventi e Book of Abstracts

- **Forum infermieristico: Qualità, sicurezza e rischio clinico** — Bari, 30 ottobre 2026,
  Sala consiliare del Comune di Bari. Call for abstract chiusa il 12 ottobre.
- **PERSPECTIVES — Book of Abstracts, Edizione 1(1)**, edito da ANIQRC su Zenodo,
  **DOI 10.5281/zenodo.23641370** (solo DOI di volume; nessun ISSN). 45 pagine: editoriale +
  17 abstract (9 studi originali, 4 revisioni, 3 protocolli, 1 percorso clinico-assistenziale).
  Diritti ceduti dagli autori ad ANIQRC: scaricabile, condivisibile e citabile con DOI ed
  editore, non riproducibile. Copertina: foto di Sébastien Lavalaye su Unsplash.
  **Autori in tutto: 59** (dopo le correzioni A06, A07 e A15).
- Sul sito: sezione **`eventi.html#book-of-abstracts`** con copertina, conteggi, DOI, pulsanti
  PDF/Zenodo/Scarica, citazione copiabile, sommario a scomparsa con link alla pagina del PDF
  (`#page=` = pagina del volume + 4), nodo JSON-LD `Book`.
  **PDF online: `PERSPECTIVES-1-1-Book-of-Abstracts-v5.pdf` nella radice** (caricato; v3 e la copia
  in radice senza suffisso già cancellate). Resta da cancellare `documenti/PERSPECTIVES-1-1-Book-of-Abstracts.pdf`.
  Altri file: `perspectives-1-1-copertina.jpg`, `og-perspectives-1-1.jpg` (og:image di Eventi).
- `forum-infermieristico-2026.html` rimanda alla sezione; `aniqrc-news.js` ha la voce del Book.
- **Correzioni del PDF** (PyMuPDF sul PDF di LibreOffice; il sorgente Writer non è disponibile):
  - **A06**: Giovanni Maria Scupola, Francesco Germinal, Lucia Favale, sulla stessa riga.
    Affiliazione di Germinal e Favale = quella di Scupola: **ipotesi da confermare**.
  - **A07**: Melania Totaro¹˒², Francesca Russo³, Mauro Carmine Martucci⁴, Crescenza Abbinante⁵,
    Francesco Pastore⁶˒⁷, Flavia Minoia¹˒⁷˒⁸ (8 affiliazioni). ORCID solo per Totaro
    (0009-0005-7540-117X, da confermare). Corrispondenza: Totaro.
  - **A15**: Chiara De Meo¹, Maria Teresa Curci¹ (U.O. di Oncologia Medica); corrispondenza De Meo.
  - **Testo allineato a sinistra in tutto il volume** (8 novembre): tolti solo i numeri negativi
    negli array `TJ` (giustificazione di LibreOffice), impaginazione invariata.
  - Note tecniche: non salvare con `clean=True` (usare `garbage=4, deflate=True`); non usare
    `show_pdf_page` con ritagli; per togliere un testo cancellare il blocco `BT…ET`; i titoletti in
    grassetto simulato vanno riscritti con `render_mode=2, border_width=1/30`. Pallino ORCID:
    cerchio pieno #8AAE45, diametro 10,1 pt, centro 2,7 pt sopra la linea di base.
  - Il PDF su Zenodo è ancora quello originale.

## Service worker (v14 consegnata il 9 novembre, v13 online)

`sw.js` → `VERSION = 'aniqrc-v14'`. CORE: `vigiljournal.html` al posto di `journal.html`, più
`aniqrc-vigil.css`, `logo-aniqrc-mosaico.svg`, `logo-vigil.svg`, `vigil-texture.jpg` e 4 font.
**Cambiare `VERSION` a ogni modifica di pagine o asset.** In home `aniqrc-news.js?v=20261029`.

## Modulo di adesione — come funziona davvero

Le domande passano da **SplitForms** (`splitforms.com`), configurazione nel markup di
`adesione.html` (`action="https://splitforms.com/api/submit"`, `access_key` nascosta).

- POST normale del browser, senza AJAX. Nessuno script deve chiamare `preventDefault()`.
- Reindirizzo dopo l'invio configurato **nella dashboard SplitForms** (`_next` ignorato).
- `_replyto`, `_subject`, `_next` sono residui di Formspree: rinominarli solo col consenso di Giuseppe.
- `aniqrc-adesione.js` è **disattivato** e non va reincluso.
- `privacy.html` dichiara SplitForms come responsabile del trattamento.

## CloudCannon — editor visuale

`cloudcannon.config.yml`, tre collection (`pagine`, `documenti`, `dati`). Zone modificabili con
`data-editable="source"` + `data-path` + `data-key`. `vigiljournal.html` è bilingue (blocchi
`data-l="it"` / `data-l="en"`) e per ora non ha zone modificabili.

## Decap CMS

`admin/index.html` + `admin/config.yml`, gestisce `toolkit-data.json`. Con backend GitHub serve un
server OAuth (assente); `local_backend: true` per lavorare in locale con `npx decap-server`.

## Dati dell'Associazione

| Dato | Valore |
|------|--------|
| Denominazione | Associazione Nazionale Infermieri Qualità e Rischio Clinico — ANIQRC |
| Forma giuridica | associazione non riconosciuta ex art. 36 c.c. |
| Atto costitutivo | sottoscritto a Bari, Via Napoli 369/Q, il **21 luglio 2026** |
| Sede legale | Via Napoli 369/Q — 70132 Bari (BA) |
| Codice fiscale | 93568220722 |
| PEC | fondazione@pec.aniqrc.it |
| Email presidenza | giuseppe.fumai@aniqrc.it |
| Consiglio Direttivo | Giuseppe Fumai (Presidente e legale rappresentante), Claudio Morelli (Vicepresidente), Giuseppe Colonna (Segretario-Tesoriere), Francesco Menolascina (Coordinatore della rete e sviluppo nazionale) |
| Statuto | **28 articoli**, allegato «A» all'atto costitutivo (non più sul sito: si richiede alla segreteria) |
| Segreteria | Alessandra D'Alò (segreteria del Presidente) · Sara Rizzo (segretaria) |
| Journal | VIGIL — International Journal of Nursing Safety and Clinical Governance (in costruzione) |
| Profili social | instagram.com/aniqrc · facebook.com/aniqrc · linkedin.com/company/aniqrc |

## Changelog

**7–14 settembre** — dati istituzionali, atto costitutivo e statuto; rimozione di TinaCMS e
Netlify; CloudCannon; guasto e ripristino del modulo di adesione (12 settembre).

**21 settembre** — intro tolta, «Seguici su», riquadro news, pulsanteria squadrata, sw v6.

**24–25 settembre** — RING; Roboto in tutto il sito, marchi ridisegnati, manifesto ricostruito.

**29–31 ottobre** — VIGÍL e Book of Abstracts; correzioni A06, A07 (sw v9–v11).

**8 novembre** — A15 e testo a sinistra in PERSPECTIVES (v5), sw v12. Caricato.

**9 novembre — nuova identità visiva VIGIL e pagina `vigiljournal.html`.** 72 file scritti
direttamente nella cartella collegata `Main-main-6` (verificata identica a `origin/main` prima del
lavoro): 15 pagine HTML ricolorate e con i nuovi caratteri, `aniqrc-vigil.css`, 15 font `woff2`,
logo a mosaico, marchio VIGIL, icone, splash, anteprime social, `vigil-texture.jpg`,
`aniqrc-bg.js`, `aniqrc-app.js`, `aniqrc-news.js`, `qualita.css`, `site.webmanifest`,
`sitemap.xml`, `sw.js` v13. `journal.html` ora reindirizza. **Caricati il 9 novembre, 10:13–10:22**
(commit `e7b4601`, `c72f590`, `cc98e7d`, `c7135c0`: quest'ultimo con la Call «in lavorazione»). In home il riquadro del journal dice
«tre numeri l'anno» e «peer review in doppio anonimato» (prima «due numeri», «italiano e inglese»).
Carosello di 6 storie Instagram «nuovo look» (`/mnt/user-data/outputs/storie`, script
`/home/claude/stories/make.py`).

**9 novembre, seconda consegna** — `vigiljournal.html` (politiche di etica, copyright, autoarchiviazione,
finanziamento, pubblicità, marketing diretto), `aniqrc-vigil.css` (bianco ottico), `sw.js` v14.
Consegnati come file e scritti nella cartella collegata. **Da caricare.**

## Punti aperti

- **Caricare i 3 file della seconda consegna del 9 novembre** e verificare il commit.
- **Tesserino** (`tessera-core.js`, `tesserino.html` generatore PDF): ancora nero/crema e Roboto.
- **Licenza dell'immagine `vigil-texture.jpg`** (pittura blu presa dal PDF della call): da verificare.
- **Storia «Grazie» agli autori**: ha 58 nomi, manca Maria Teresa Curci.
- **Nuova versione su Zenodo** del PDF corretto: valutare il DOI di concetto.
- **Da confermare**: affiliazione di Germinal e Favale (A06); ORCID di Melania Totaro.
- **Residui da cancellare nel repo**: `journal_1.html`, `toolkit_1.html`, `logo-pnj-512.png`,
  `logo-ring-512.png`, `index.backup-20260628-173318.html`, `documenti/Statuto_ANIQRC.pdf`,
  `documenti/PERSPECTIVES-1-1-Book-of-Abstracts.pdf`, i video dell'intro, `index.txt`, `src/`,
  i `.patch`, lo screenshot dell'8 ottobre, le pagine `anteprima-*.html` (ancora vecchi colori).
- **⚠ `826500007-ISO-7101-2023.pdf` (7,1 MB) nel repository pubblico**: norma ISO licenziata per
  singolo utilizzatore, va tolta (resta comunque nella cronologia).
- **Workflow del newsfeed da creare a mano** (`.github/workflows/newsfeed.yml` da
  `tools/newsfeed-workflow.yml`): senza, `news-feed.json` risponde 404.
- **`irccs-istituto-tumori.png` manca** ma è richiamata dalla pagina del Forum.
- **Indirizzi email del direttivo**: confermati solo `giuseppe.fumai@` e `alessandra.dalo@`.
- **Decap: manca il server OAuth.**
- **Verbale dell'assemblea costitutiva**: mancano gli orari di apertura e chiusura.
- `documenti/Forum-Infermieristico-2026-Libro-dei-Lavori.pdf`: superato, da cancellare.
- Search Console: «Pagina duplicata senza URL canonico» su `https://aniqrc.it/index.html`.
- `email-rinnovo-tessera.html` (modello email) e `manifesto-aniqrc.pdf` hanno ancora i vecchi colori.
