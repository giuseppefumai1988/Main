# ANIQRC — aggiornamento del 7 settembre 2026

Contenuto: i **23 file modificati o aggiunti** del repository `giuseppefumai1988/Main`,
con i percorsi già corretti. Sovrascrivili nel repo (o caricali con *Add files via upload*
mantenendo la cartella `documenti/`) e il sito è aggiornato.

> **Nota sul push.** Il commit è stato preparato, ma la pubblicazione diretta su GitHub è
> stata rifiutata: il repository `giuseppefumai1988/Main` non è tra le fonti autorizzate di
> questa sessione. Per farmelo pubblicare direttamente basta collegare il repository alle
> *sources* della sessione dall'app Claude; in alternativa carica questo zip. Nel pacchetto
> trovi anche `0001-aggiornamento-aniqrc.patch`, applicabile con
> `git am 0001-aggiornamento-aniqrc.patch` se preferisci mantenere la cronologia.

---

## 1. Dati istituzionali inseriti ovunque

| Dato | Valore |
|------|--------|
| Sede legale | Via Napoli 369/Q — 70132 Bari (BA) |
| Codice fiscale | 93568220722 |
| Forma giuridica | associazione non riconosciuta ex art. 36 c.c. |

**Sito** — footer di `index.html` (blocco Contatti + riga di chiusura), `privacy.html`
(nota di apertura, art. 1 Titolare, art. 7 diritti dell'interessato, footer), `adesione.html`,
`eventi.html`, `forum-infermieristico-2026.html`, `journal.html`, `osservatorio.html`,
`ricerca.html`, `toolkit.html`, `strumenti-campione.html`, `strumenti-kappa.html`,
`email-rinnovo-tessera.html`.

**Dati strutturati** — aggiunte le proprietà `taxID` e `address` (PostalAddress completa)
all'entità `NGO/Organization` nei blocchi JSON-LD di `index.html` e `head-seo-aniqrc.html`:
serve a Google per associare l'ente al nome «ANIQRC» nelle ricerche.

**Stato «in costituzione»** — rimosso da tutti i footer e dai due avvisi della home
(sezione *Documenti* e banner della sezione *Associati*), sostituito dalla formula
«associazione non riconosciuta ex art. 36 c.c. · C.F. 93568220722».

## 2. Documenti PDF in `documenti/`

Rigenerati **Statuto**, **Verbale dell'assemblea costitutiva**, **Informativa privacy** e
**Modulo di adesione**: stessa impaginazione dei precedenti, con il marchio quadrato
ANI/QRC del sito al posto della vecchia croce nel cerchio.

- **Statuto** — art. 2 dell'atto costitutivo e art. 2 dello statuto: sede legale completa.
  Art. 6: codice fiscale attribuito. Riquadro di testa con i dati identificativi.
  I codici fiscali e le residenze dei tre soci fondatori **non** vengono più pubblicati:
  al loro posto una nota rinvia all'originale sottoscritto (scelta di tutela dei dati
  personali, trattandosi di un PDF liberamente scaricabile).
- **Verbale** — delibera n. 4 con la sede legale; numero di articoli dello statuto (27);
  riquadro finale «Adempimenti eseguiti» con il codice fiscale attribuito.
- **Informativa privacy** — Titolare completo (sede, C.F., email, PEC), assenza di DPO
  motivata ex art. 37 GDPR, recapiti per l'esercizio dei diritti.
- **Modulo di adesione** — intestazione con i dati dell'ente, recapiti di invio
  (email e PEC); ora sta **su una sola pagina**.

## 3. Evento e call for abstract

Il Forum **si svolgerà il 30 ottobre 2026**. La call chiude il **12 ottobre 2026**
(abstract e poster). Invio degli abstract a **infermieridiricercaircss@gmail.com**,
indirizzo dedicato esclusivamente agli abstract.

`forum-infermieristico-2026.html`

- badge `Evento concluso` → `In programma`; `Libro dei lavori disponibile` → `Call for abstract aperta`
- riquadro della call: `Chiusa` → **12 ottobre 2026**, «entro questa data vanno inviati
  l'abstract e il poster»
- **nuovo riquadro con il QR code della Call** (`qr-call-for-abstract-2026.png`), che
  rimanda al documento su Google Drive, con sotto l'indirizzo email per l'invio
- pulsanti: «Invia il tuo abstract» (mailto all'indirizzo dedicato) e «Istruzioni della Call»
  (link al documento del QR)
- i due riquadri dati «Lavori presentati 12» e «Materiali: libro dei lavori» sostituiti da
  «Call for abstract — 12 ottobre 2026» e «Aree tematiche — 6»
- download principale: **workbook della call** al posto del libro dei lavori
- sezione *Recap* → *Dopo il Forum*: i materiali saranno pubblicati dopo il 30 ottobre
- titolo/descrizioni meta, Open Graph e Twitter riscritti al futuro

`eventi.html` — «Dove siamo stati» → «Il prossimo appuntamento»; pillole e descrizione
della scheda evento aggiornate.

`aniqrc-news.js` — attivate due voci nel nastro news: la call con la scadenza del
12 ottobre e l'evento del 30 ottobre.

`ANIQRC-Workbook-Call-for-Abstract-2026.pdf`

- calendario a pag. 5: chiusura degli invii **12 ottobre 2026** («abstract e poster,
  ore 23:59»); le due righe successive non riportano più date anteriori alla chiusura
- pag. 3, passo 5: l'invio avviene per email all'indirizzo dedicato, con rinvio al QR code
- pag. 20: indirizzo del comitato scientifico aggiornato; colophon con sede legale e
  codice fiscale

`sitemap.xml` — `lastmod` aggiornate; il workbook della call sostituisce il libro dei
lavori tra gli URL segnalati.

---

## Da decidere

1. **Statuto e verbale** — restano tre campi che solo tu puoi compilare:
   data e luogo dell'assemblea costitutiva e durata del primo mandato (`[3/4]` anni).
2. **`documenti/Forum-Infermieristico-2026-Libro-dei-Lavori.pdf`** — è scritto al passato.
   L'ho tolto da tutti i link del sito e dalla sitemap, ma il file resta raggiungibile via
   URL diretto: sarà sostituito dal volume con i lavori reali dopo la chiusura della call.
