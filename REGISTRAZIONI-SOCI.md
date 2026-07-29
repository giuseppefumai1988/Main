# Dove finiscono le registrazioni dei soci — percorso completo

Questa nota spiega, passo per passo, che strada fanno i dati quando qualcuno
compila la **Domanda di adesione** su `adesione.html`. Vale per il sito
pubblicato su **Netlify** (aniqrc.it).

---

## Il percorso, in 6 passi

```
[1] Visitatore compila            [2] Invio (POST)              [3] Archivio
    adesione.html      ───────►       ai server Netlify  ───────►   Netlify → Forms → "adesione"
                                      (riconosce il form)           (tutte le domande, per sempre)
                                                                        │
[6] Visitatore vede               [5] Email "ricevuta"            [4] Scatta la funzione
    grazie.html        ◄───────       a te + 2 CC          ◄───────   submission-created.mjs
                                      via SMTP Aruba                  (automatica, ~1 secondo)
```

### Passo 1 — Il modulo
Il form in `adesione.html` ha gli attributi `data-netlify="true"`,
`name="adesione"` e il campo nascosto `form-name`. È questo che dice a Netlify
«questo modulo è mio, raccoglilo». C'è anche un campo trappola invisibile
(`bot-field`, honeypot): se un robot lo compila, l'invio viene scartato.

### Passo 2 — L'invio
Quando il visitatore preme **«Invia la domanda»**, il browser spedisce i dati
direttamente ai server di Netlify (nessun dato passa da GitHub o resta nei
file del sito).

### Passo 3 — L'archivio (il posto dove "finiscono" davvero)
La domanda viene salvata nel pannello Netlify:

> **app.netlify.com → il tuo sito → scheda "Forms" → modulo `adesione`**

Qui trovi ogni domanda con tutti i campi compilati (nome, cognome, email,
telefono, codice fiscale, regione, professione, albo OPI, ente, categoria,
interessi, note, consensi). Da qui puoi anche **esportare tutto in CSV**
(bottone *Export to CSV*) per il libro soci.
Limite del piano gratuito: **100 invii al mese**.

### Passo 4 — La funzione automatica
A ogni nuovo invio Netlify esegue da sola la funzione
`netlify/functions/submission-created.mjs` (il nome `submission-created` è
speciale: Netlify la chiama automaticamente a ogni submission). La funzione
ignora eventuali altri form e lavora solo su `adesione`.

### Passo 5 — L'email di ricevuta
La funzione compone una **ricevuta formattata** (pronta da stampare per il
registro) e la invia tramite la casella Aruba:

| Cosa | Valore |
|------|--------|
| Da | `giuseppe.fumai@aniqrc.it` (SMTP Aruba, `smtps.aruba.it:465`) |
| A | `giuseppe.fumai@aniqrc.it` |
| CC | `giuseppe.colonna@aniqrc.it`, `claudio.morelli@aniqrc.it` |
| Rispondi a | l'email indicata dal richiedente |
| Oggetto | «Nuova domanda di adesione — Nome Cognome» |

Perché funzioni servono, nel pannello Netlify (*Site configuration →
Environment variables*), le due variabili:
`SMTP_USER` = giuseppe.fumai@aniqrc.it e `SMTP_PASS` = password della casella.
La dipendenza `nodemailer` è dichiarata in `package.json`.

**Importante:** se l'email non parte (password cambiata, Aruba giù…), la
domanda **non va persa**: resta comunque salvata al Passo 3. L'errore si legge
in *Netlify → Logs → Functions*.

### Passo 6 — La conferma al visitatore
Il form ha `action="/grazie.html"`: dopo l'invio il visitatore atterra sulla
pagina di ringraziamento.

---

## Dove NON finiscono

- **Non** in un database vostro, né in file dentro il sito o su GitHub.
- **Non** nella casella email del richiedente (a lui non parte nulla, per ora).
- La **newsletter** è un percorso separato: il bottone in home porta a
  **MailerLite** (servizio esterno) — quegli iscritti stanno lì, non in Netlify.

## Tre controlli utili

1. **Prova reale**: compila tu stesso il modulo dal sito pubblicato e verifica
   che compaia in *Forms* e che arrivi l'email. (Aprendo `adesione.html` in
   locale con doppio clic l'invio non funziona: è normale, serve il sito online.)
2. **Notifica di riserva senza codice**: *Forms → adesione → Settings →
   Add notification → Email* — così Netlify ti avvisa anche se la funzione
   SMTP avesse problemi.
3. **Privacy/GDPR**: le domande contengono dati personali. Chi ha accesso al
   pannello Netlify li vede: limita gli accessi e ricordati la cancellazione
   su richiesta (come da `privacy.html`, §6–7).

---

*Nota tecnica: la cartella contiene anche i file per GitHub Pages (`CNAME`,
`.nojekyll`). I moduli però funzionano **solo** con la pubblicazione su
Netlify: GitHub Pages non raccoglie i form. Se un giorno il sito venisse
spostato, questo percorso va ripensato.*
