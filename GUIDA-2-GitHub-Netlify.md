# Guida 2 — GitHub e Netlify: dove mettere i file e come pubblicare

Questa guida spiega **dove vanno i file** e **come aggiornare il sito**. Ci sono due modi di lavorare con Netlify: scegline uno.

---

## Quale metodo stai usando?

- **Metodo A — Trascinamento (drag & drop):** hai pubblicato trascinando la cartella su Netlify. Semplice, ma ogni aggiornamento va ri-trascinato a mano.
- **Metodo B — GitHub collegato:** il sito è collegato a un repository GitHub e si aggiorna **da solo** ogni volta che carichi una modifica su GitHub. È il metodo consigliato per il futuro.

---

## METODO A — Aggiornare con il trascinamento

1. Tieni sul computer la cartella `aniqrc-site` aggiornata (con i nuovi file).
2. Vai su **app.netlify.com** → seleziona il sito → scheda **Deploys**.
3. Trascina la cartella `aniqrc-site` nell'area **"Drag and drop your site output folder here"**.
4. In pochi secondi il sito è aggiornato.

> Attenzione: trascina **la cartella**, non i singoli file, così mantieni la struttura (con la sottocartella `documenti/`).

---

## METODO B — Collegare GitHub a Netlify (consigliato)

Una volta configurato, ti basterà caricare i file su GitHub e il sito si aggiornerà automaticamente. I moduli e i form vengono rilevati a ogni pubblicazione.

### Passo 1 — Crea il repository su GitHub
1. Vai su **github.com**, accedi (o crea un account gratuito).
2. In alto a destra: **+** → **New repository**.
3. Nome: ad esempio `aniqrc-sito`. Lascialo **Public** (o Private, va bene comunque).
4. **Create repository**.

### Passo 2 — Carica i file
Il modo più semplice senza strumenti tecnici:
1. Nel repository appena creato, clicca **"uploading an existing file"** (oppure **Add file → Upload files**).
2. Trascina **tutto il contenuto** della cartella `aniqrc-site` (i file E la cartella `documenti`).
3. In basso scrivi un messaggio (es. "Primo caricamento") e clicca **Commit changes**.

> **Dove vanno i file:** nella **radice** del repository, non dentro una sottocartella. Quindi `index.html` deve stare al primo livello, e i PDF dentro `documenti/`. Così:
> ```
> aniqrc-sito (repository)
> ├── index.html
> ├── adesione.html
> ├── privacy.html
> ├── grazie.html
> ├── favicon.svg …
> └── documenti/
>     └── *.pdf
> ```

### Passo 3 — Collega il repository a Netlify
1. Su **app.netlify.com**: **Add new site** → **Import an existing project**.
2. Scegli **GitHub** e autorizza Netlify.
3. Seleziona il repository `aniqrc-sito`.
4. Impostazioni di build: **lascia tutto vuoto** (è un sito statico, niente da compilare).
   - Build command: *(vuoto)*
   - Publish directory: *(vuoto, oppure `/`)*
5. **Deploy site**. Fatto.

### Passo 4 — D'ora in poi
Ogni volta che modifichi un file:
1. Su GitHub apri il file → icona **matita** (Edit) → modifica → **Commit changes**.
   *(oppure ricarichi i file aggiornati con Add file → Upload files)*
2. Netlify se ne accorge e **ripubblica da solo** in un minuto.

---

## Abilitare i moduli (Netlify Forms)

I moduli sono già pronti nel codice (attributo `data-netlify="true"`). Per attivarli:

1. Dopo il primo deploy, vai in **Site configuration → Forms** e verifica che **Form detection** sia attivo.
2. Fai un invio di prova dal sito pubblicato (compila la domanda di adesione).
3. Torna in **Forms**: dovresti vedere il modulo `adesione` con la tua prova.
4. Imposta una **notifica email** (Forms → il modulo → Settings → Add notification → Email).

> Se i moduli non compaiono: assicurati di aver pubblicato la versione che contiene i form (con i campi nascosti `form-name`), poi rifai un deploy. Netlify rileva i moduli **durante** la pubblicazione.

---

## Dominio personalizzato (es. `aniqrc.it`)

1. Acquista il dominio da un registrar (Aruba, Register.it, GoDaddy, Namecheap…).
2. Su Netlify: **Domain management → Add a domain** → inserisci `aniqrc.it`.
3. Netlify ti indica i record DNS da impostare nel pannello del registrar
   (in genere un record `A` verso l'IP di Netlify e un `CNAME` per `www`).
4. Attendi la propagazione (da pochi minuti a qualche ora).
5. Attiva **HTTPS** (gratuito, automatico con Let's Encrypt) dal pannello Netlify.

Da quel momento il sito risponderà sia su `aniqrc.it` sia sull'indirizzo `…netlify.app`.

---

## In sintesi

| Vuoi… | Metodo A (drag&drop) | Metodo B (GitHub) |
|-------|----------------------|-------------------|
| Aggiornare un testo | modifichi in locale e ri-trascini | modifichi su GitHub, si pubblica da solo |
| Sostituire un PDF | sostituisci nella cartella e ri-trascini | carichi su GitHub in `documenti/` |
| Sforzo minimo nel tempo | medio | minimo (consigliato) |

Per un'associazione che crescerà nel tempo, **il Metodo B (GitHub collegato)** è la scelta giusta: aggiorni una volta, e non ripensi più alla pubblicazione.
