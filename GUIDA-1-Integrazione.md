# Guida 1 — Integrare documenti e moduli nel sito ANIQRC

Questa guida spiega **cosa c'è nel sito**, **come funzionano i moduli** e **come aggiornare ogni elemento**. Non serve saper programmare: si tratta solo di sostituire testi e file.

---

## 1. Struttura dei file

```
aniqrc-site/
├── index.html                 ← la home (tutte le sezioni)
├── adesione.html              ← modulo di adesione online
├── privacy.html               ← informativa privacy (pagina web)
├── grazie.html                ← pagina mostrata dopo l'invio di un modulo
├── favicon.svg / .png         ← icone del sito
├── icon-192.png / icon-512.png← icone per installazione come app
├── apple-touch-icon.png       ← icona iOS
├── og-image.png               ← anteprima per social/WhatsApp
├── site.webmanifest           ← configurazione app
├── README.md                  ← note tecniche
└── documenti/
    ├── Statuto_ANIQRC.pdf
    ├── Modulo_Adesione_ANIQRC.pdf
    ├── Informativa_Privacy_ANIQRC.pdf
    └── Verbale_Assemblea_Costitutiva_ANIQRC.pdf
```

**Regola d'oro:** tutti i file stanno nella stessa cartella (e i PDF nella sottocartella `documenti/`). I collegamenti del sito funzionano solo se mantieni questa struttura.

---

## 2. I moduli (Netlify Forms)

Il sito usa i **moduli di Netlify**: funzionano senza programmazione e senza server. Ci sono due moduli già pronti:

| Modulo | Dove si trova | Nome interno |
|--------|---------------|--------------|
| Domanda di adesione | `adesione.html` | `adesione` |
| Iscrizione newsletter | `index.html` (sezione finale) | `newsletter` |

### Come vedere le richieste ricevute
1. Vai su **app.netlify.com** → seleziona il tuo sito.
2. Apri la scheda **Forms** (Moduli).
3. Vedrai `adesione` e `newsletter`: cliccando leggi tutte le richieste arrivate, con tutti i campi compilati.

### Ricevere una email a ogni nuova richiesta
1. In **Forms**, clicca sul nome del modulo → **Settings and notifications**.
2. **Add notification** → **Email notification**.
3. Inserisci l'indirizzo dell'associazione: riceverai una mail a ogni nuova domanda.

> **Importante:** i moduli si attivano solo **dopo la pubblicazione su Netlify**. Aprendo il file `adesione.html` sul tuo computer (doppio clic) il modulo non invia nulla: è normale.

### Limiti del piano gratuito
Il piano gratuito di Netlify include **100 invii di moduli al mese**. Più che sufficiente all'inizio; se un giorno servirà di più, si passa a un piano superiore.

---

## 3. Aggiornare i documenti PDF

Per sostituire un documento (es. lo statuto definitivo dopo la firma dal notaio):

1. Rinomina il nuovo file **esattamente** come quello vecchio (es. `Statuto_ANIQRC.pdf`).
2. Mettilo nella cartella `documenti/` sovrascrivendo il precedente.
3. Ripubblica (vedi Guida 2).

I link nel sito puntano al nome del file, quindi se mantieni lo stesso nome **non devi toccare il codice**.

Per **aggiungere** un nuovo documento serve invece una piccola modifica: nella sezione Documenti di `index.html` (cerca `id="documenti"`) copia un blocco `<a class="doc-card">…</a>` e cambia titolo, descrizione e nome del file.

---

## 4. Modificare i testi del sito

Apri `index.html` con un editor di testo (va bene anche il Blocco note, meglio **Visual Studio Code**, gratuito). Cerca il testo che vuoi cambiare e sostituiscilo. Le sezioni sono segnalate da commenti ben visibili, ad esempio:

```html
<!-- ============ MANIFESTO ============ -->
<!-- ============ AMBITI ============ -->
<!-- ============ DOCUMENTI ============ -->
```

Non toccare le parti tra `<style>` e `</style>` (è la grafica) se non sai cosa stai facendo.

---

## 5. Il newsfeed, il feed video e i podcast

Tutto si regola in fondo a `index.html`, nel blocco `<script>`:

**Notizie** — array `NEWS_FEEDS`: gli indirizzi dei feed RSS (ora include NurseTimes, Nurse24, AssoCareNews, Quotidiano Sanità, Sanità Informazione). Array `NEWS_KEYWORDS`: le parole chiave che tengono le notizie in tema. Se le fonti non rispondono, compaiono le risorse istituzionali di riserva (funzione `renderFallback()`).

**Video** — variabile `YT_FEED`: il feed del canale YouTube. Ora punta all'**Institute for Healthcare Improvement** (il miglior canale al mondo su qualità e management sanitario). Per cambiare canale, sostituisci l'ID dopo `channel_id=` (lo trovi nell'URL del canale YouTube, inizia con `UC…`).

**Podcast** — nella sezione `id="podcast"` dell'HTML: il primo riquadro è un player Spotify incorporato (cambia l'ID nello `src` dell'`<iframe>`); le card a fianco hanno i link a Spotify e Apple Podcasts (modificabili negli `href`).

> I feed (notizie e video) e il player Spotify funzionano **solo da sito pubblicato**, non aprendo il file in locale: i browser bloccano le chiamate esterne con il protocollo `file://`.

---

## 6. Recapiti e dati da completare

Quando l'associazione sarà costituita, cerca e sostituisci nel codice questi segnaposto:

| Cerca | Sostituisci con |
|-------|-----------------|
| `info@aniqrc.it` | l'email reale dell'associazione |
| `PEC — da attivare` | l'indirizzo PEC |
| `Sede — da definire` | la sede legale |
| `Associazione in costituzione` | rimuovi l'avviso quando sei fondato |
| `[indirizzo]`, `[email]`, `[PEC]` in `privacy.html` | i dati reali nell'informativa |

---

## 7. Newsletter: come funziona oggi

La newsletter è gestita con **MailerLite**: il bottone «Iscriviti alla newsletter» in
`index.html` porta al modulo MailerLite dell'associazione, e gli iscritti si vedono e si
gestiscono dal pannello MailerLite. La **domanda di adesione soci** resta invece su
Netlify Forms: il percorso completo è spiegato in `REGISTRAZIONI-SOCI.md`.

---

Tutto qui. La regola pratica: **modifichi i file → li ricarichi → il sito si aggiorna**. Il *come ricaricarli* è spiegato nella Guida 2.
