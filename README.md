# ANIQRC — Sito istituzionale

Sito web dell'**Associazione Nazionale Infermieri Qualità e Rischio Clinico (ANIQRC)**.
Pagina singola, statica, autosufficiente. Nessun framework, nessuna build: si pubblica così com'è.

---

## Contenuto della cartella

| File | Descrizione |
|------|-------------|
| `index.html` | Il sito completo (HTML + CSS + JS in un unico file) |
| `adesione.html` | Modulo di adesione online (Netlify Forms) |
| `privacy.html` | Informativa privacy (pagina web) |
| `grazie.html` | Pagina di conferma dopo l'invio di un modulo |
| `documenti/` | Cartella con i PDF: Statuto, Modulo di Adesione, Informativa Privacy, Verbale Costitutivo |
| `favicon.svg` | Icona vettoriale (sigillo ANIQRC) |
| `favicon-16.png`, `favicon-32.png` | Favicon raster |
| `apple-touch-icon.png` | Icona per iOS (180×180) |
| `icon-192.png`, `icon-512.png` | Icone per la Progressive Web App |
| `og-image.png` | Anteprima per social e messaggistica |
| `site.webmanifest` | Manifest PWA |
| `.nojekyll` | Evita che GitHub Pages processi i file con Jekyll |

> **Moduli:** `adesione` e `newsletter` usano i Netlify Forms. Le richieste arrivano in Netlify → scheda **Forms**. Vedi le guide allegate.

---

## Pubblicare su GitHub Pages

1. Crea un repository su GitHub, ad esempio `aniqrc-sito` (oppure `aniqrc.github.io` per averlo sulla radice).
2. Carica **tutti i file di questa cartella** nella radice del repository (non dentro una sottocartella).
3. Vai su **Settings → Pages**.
4. In *Build and deployment*, alla voce *Source* scegli **Deploy from a branch**.
5. Seleziona il branch `main` e la cartella `/ (root)`. Salva.
6. Dopo 1–2 minuti il sito sarà online all'indirizzo indicato (es. `https://tuonome.github.io/aniqrc-sito/`).

### Dominio personalizzato (facoltativo)
Per usare un dominio tuo (es. `aniqrc.it`):
1. Crea nella radice un file chiamato `CNAME` contenente una sola riga: `aniqrc.it`
2. Dal pannello del tuo registrar imposta i record DNS verso GitHub Pages
   (record A verso gli IP di GitHub o un CNAME verso `tuonome.github.io`).
3. In *Settings → Pages → Custom domain* inserisci il dominio e attiva *Enforce HTTPS*.

> In alternativa, puoi pubblicare la stessa cartella su **Netlify** o **Vercel**
> trascinandola nell'interfaccia: funziona senza alcuna configurazione.

---

## Personalizzazioni rapide (dentro `index.html`)

Tutte le impostazioni modificabili sono in fondo al file, nel blocco `<script>`.

### Newsfeed (notizie dal vivo)
- **Fonti RSS**: array `NEWS_FEEDS`. Aggiungi o sostituisci gli URL dei feed.
- **Filtro tematico**: array `NEWS_KEYWORDS`. Aggiungi parole chiave per affinare le notizie.
- Il feed funziona **solo da sito pubblicato** (non aprendo il file in locale): i browser
  bloccano le chiamate esterne con il protocollo `file://`. Se le fonti non rispondono,
  compaiono automaticamente le risorse istituzionali di riserva.

### Newsletter
- Le iscrizioni alla newsletter passano da **MailerLite**: il bottone nella sezione
  Newsletter di `index.html` punta al modulo MailerLite dell'associazione. Gli iscritti
  si gestiscono dal pannello MailerLite (non da Netlify).
- La domanda di adesione soci resta invece su **Netlify Forms**: vedi `REGISTRAZIONI-SOCI.md`.

### Fonti istituzionali (riserva)
Quando il feed dal vivo non è raggiungibile, la sezione *News* mostra automaticamente
sei **risorse istituzionali permanenti** (Ministero della Salute, AGENAS, Nurse24,
Quotidiano Sanità, FNOPI). Puoi modificarle nell'array `res` dentro la funzione
`renderFallback()` nel blocco `<script>`.

### Contatti e sede
Cerca `info@aniqrc.it` e `PEC — da attivare` / `Sede — da definire` nell'HTML e sostituisci
con i recapiti reali a fondazione avvenuta.

---

## Note

- Il sito carica i caratteri **Bricolage Grotesque**, **Manrope** e **JetBrains Mono**
  da Google Fonts: serve connessione a internet per la resa tipografica completa.
- Nessun dato personale viene raccolto dal sito in sé (la newsletter dipende dal servizio
  che collegherai).
- Avviso "in costituzione": rimuovilo dalla sezione *Associati* quando l'associazione sarà fondata.

© MMXXVI ANIQRC
