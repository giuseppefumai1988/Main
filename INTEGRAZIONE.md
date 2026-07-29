# ANIQRC — Osservatorio + Toolkit · Guida all’integrazione

## 1. Dove mettere i file

Carica **tutti questi file nella stessa cartella di `index.html`** (la root del repository GitHub Pages):

```
index.html              ← già esistente
qualita.css             ← NUOVO (foglio di stile condiviso)
osservatorio.html       ← NUOVO
qualita-data.json       ← NUOVO (dati dell'Osservatorio — modificabili)
toolkit.html            ← NUOVO
toolkit-data.json       ← NUOVO (libreria strumenti — modificabile)
strumenti-kappa.html    ← NUOVO (calcolatore concordanza)
strumenti-campione.html ← NUOVO (calcolatore numerosità campionaria)
```

I link interni sono **relativi** (`osservatorio.html`, `qualita.css`, ecc.): funzionano
automaticamente su GitHub Pages senza modifiche. Non serve alcun server: è tutto statico.

## 2. Aggiungere le due voci al menu di `index.html`

Nel `<div class="nav-links">` del tuo `index.html`, aggiungi due link
(es. subito dopo la voce “Ambiti”):

```html
<a href="osservatorio.html">Osservatorio</a>
<a href="toolkit.html">Toolkit</a>
```

Le pagine nuove rimandano già correttamente a `index.html#manifesto`, `index.html#ambiti`,
`adesione.html`, ecc., quindi il menu resta coerente in entrambe le direzioni.

(Facoltativo) Puoi anche aggiungere due card nella sezione “Attività” / “Documenti”
della home che puntano a `osservatorio.html` e `toolkit.html`.

## 3. Come aggiornare i dati (senza toccare il codice)

- **Osservatorio** → modifica `qualita-data.json`. La pagina lo carica automaticamente e
  sovrascrive i valori di base. Ogni indicatore ha `titolo`, `sub`, `fonte`, `url`, e i
  valori. Per aggiornare a una nuova edizione PNE/NSG basta cambiare i numeri e l’anno.
- **Toolkit** → modifica `toolkit-data.json` (array `strumenti`, `raccomandazioni`, `metodi`).
- Se i file `.json` non sono raggiungibili, le pagine usano i dati **incorporati come
  fallback** nello script: quindi funzionano comunque, anche aperte localmente con doppio clic.

## 4. Dipendenze

- **Font**: Google Fonts (Bricolage Grotesque, Manrope, JetBrains Mono) — già nel `<head>`.
- **Grafici**: Chart.js 4.4.1 via CDN jsDelivr (solo `osservatorio.html`). Caricato da
  `<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js">`.
  Se preferisci non dipendere dal CDN, scarica il file e mettilo in locale aggiornando il `src`.

## 5. Nota su dati e copyright

- Tutti i numeri dell’Osservatorio provengono da **fonti ufficiali citate** (PNE-AGENAS,
  Ministero della Salute/SIMES, NSG-LEA, ECDC, OECD) con link diretto sotto ogni grafico.
- Il Toolkit riporta **solo metadati descrittivi** degli strumenti (nome, dominio, n. item,
  editore, licenza, riferimento): nessun item dei questionari è riprodotto, nel rispetto del
  copyright dei rispettivi editori (EuroQol, EORTC, FACIT, NCI, WHO, Picker, AHRQ…).
- Verifica i valori prima di una pubblicazione ufficiale: le edizioni PNE/NSG cambiano ogni anno.