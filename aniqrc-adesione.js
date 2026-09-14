/* =========================================================
   ANIQRC - aniqrc-adesione.js  --  FILE DISATTIVATO
   ---------------------------------------------------------
   ATTENZIONE: non reinserire questo file in adesione.html.

   CHE COSA ERA
   Una versione precedente di questo script intercettava
   l'invio del modulo di adesione (event.preventDefault) per
   generare il tesserino e spedirlo via email attraverso un
   endpoint esterno. Quell'endpoint non e' mai stato attivato
   e l'intercettazione impediva al modulo di raggiungere
   SplitForms: niente email, niente riga nella dashboard.

   CHE COSA VALE ADESSO
   Il modulo di adesione.html invia i dati direttamente a
   SplitForms con una POST normale del browser. Nessun
   JavaScript deve toccare quell'invio. Questo file e'
   volutamente vuoto di comportamento: se dovesse essere
   caricato per errore, non fa assolutamente nulla.

   IL TESSERINO
   Si genera da tesserino.html, lo strumento interno, quando
   il Consiglio Direttivo delibera sulla domanda e assegna il
   numero di tessera.
   ========================================================= */

console.info('[ANIQRC] aniqrc-adesione.js disattivato: il modulo invia direttamente a SplitForms.');
