/* =========================================================
   FORUM INFERMIERISTICO — Bari, 30 ottobre 2026
   «Qualità, sicurezza e rischio clinico»
   IRCCS Istituto Tumori «Giovanni Paolo II» — Bari
   Contenuti multimediali della pagina evento.
   =========================================================

   Questo file contiene QUATTRO blocchi. Modifica solo questi:

     1) FORUM_LOGO_ENTE →  il logo dell'ente organizzatore
     2) FORUM_VIDEO     →  i video del recap
     3) FORUM_GALLERIA  →  le foto del recap
     4) FORUM_WORKBOOK  →  le pagine del carosello del libro dei lavori

   Finché i blocchi 2 e 3 restano vuoti ( [] ), la sezione «Recap»
   mostra il suo stato di attesa.
   ========================================================= */


/* ---------------------------------------------------------
   1) LOGO DELL'ENTE ORGANIZZATORE
   ---------------------------------------------------------
   Metti il file del logo ufficiale IRCCS nella cartella del sito
   e scrivi qui il suo nome, per esempio "irccs-istituto-tumori.png".
   Lascia la stringa vuota ("") per mostrare solo il nome scritto.
   --------------------------------------------------------- */
window.FORUM_LOGO_ENTE = "";


/* ---------------------------------------------------------
   2) VIDEO DEL RECAP
   ---------------------------------------------------------
   Due modi per aggiungere un video.

   a) File caricato nella cartella del sito:
      { tipo: "file", src: "forum-2026-apertura.mp4", poster: "forum-2026-apertura.jpg",
        titolo: "Apertura dei lavori", nota: "Plenaria del mattino" }

   b) Video YouTube (basta l'ID, quello dopo watch?v=):
      { tipo: "youtube", id: "XXXXXXXXXXX",
        titolo: "Il Forum in dieci minuti", nota: "Sintesi della giornata" }
   --------------------------------------------------------- */
window.FORUM_VIDEO = [

  // { tipo: "youtube", id: "XXXXXXXXXXX", titolo: "Il Forum in dieci minuti", nota: "Sintesi della giornata" },
  // { tipo: "file", src: "forum-2026-apertura.mp4", poster: "forum-2026-apertura.jpg", titolo: "Apertura dei lavori", nota: "Plenaria del mattino" },

];


/* ---------------------------------------------------------
   3) GALLERIA FOTOGRAFICA DEL RECAP
   ---------------------------------------------------------
   Metti le immagini nella cartella del sito (o in una sottocartella,
   per esempio "forum2026/") e aggiungile qui:

      { src: "forum2026/01.jpg", alt: "La plenaria del mattino",
        didascalia: "Apertura dei lavori", grande: true }

   grande: true  →  la foto occupa due caselle nella griglia.
   --------------------------------------------------------- */
window.FORUM_GALLERIA = [

  // { src: "forum2026/01.jpg", alt: "La Sala consiliare del Comune di Bari", didascalia: "Apertura dei lavori", grande: true },
  // { src: "forum2026/02.jpg", alt: "Sessione parallela", didascalia: "Sessione parallela — Area A1" },
  // { src: "forum2026/03.jpg", alt: "Tavolo di lavoro", didascalia: "Tavoli di lavoro del pomeriggio" },

];


/* ---------------------------------------------------------
   4) CAROSELLO DEL LIBRO DEI LAVORI
   ---------------------------------------------------------
   Ogni voce è una pagina del volume:
      img    → immagine grande      thumb → miniatura
      occhiello / titolo / testo → la didascalia del racconto
   Le immagini stanno nella cartella workbook/.
   --------------------------------------------------------- */
window.FORUM_WORKBOOK = [
  { img:"workbook/pag-01.jpg", thumb:"workbook/thumb-01.jpg", occhiello:"Copertina",
    titolo:"Un volume, non un volantino",
    testo:"Il libro dei lavori raccolti dalla Call for Abstract: rosso mattone, tipografia netta, nessuna decorazione. È il documento che resta della giornata." },
  { img:"workbook/pag-02.jpg", thumb:"workbook/thumb-02.jpg", occhiello:"Il Forum",
    titolo:"Com'è andata la giornata",
    testo:"Mattino in plenaria per il quadro metodologico, pomeriggio in sessioni parallele per i lavori, chiusura con la restituzione dei tavoli. Il programma ora per ora e le sei aree tematiche." },
  { img:"workbook/pag-03.jpg", thumb:"workbook/thumb-03.jpg", occhiello:"I lavori",
    titolo:"Dodici modi di misurarsi",
    testo:"Da qui in poi cambia il registro: iniziano gli abstract, uno per pagina, nella forma in cui sono stati presentati." },
  { img:"workbook/pag-04.jpg", thumb:"workbook/thumb-04.jpg", occhiello:"Indice",
    titolo:"Tutto quello che c'è dentro",
    testo:"L'indice dei lavori con codice, tipologia e area tematica: il modo più rapido per trovare il lavoro vicino al proprio." },
  { img:"workbook/pag-05.jpg", thumb:"workbook/thumb-05.jpg", occhiello:"ABS-01 · Rischio clinico",
    titolo:"Errori di terapia: −48% con il doppio controllo",
    testo:"Un progetto di miglioramento su 48 posti letto, con osservazione diretta pre e post. Anche il costo in minuti è dichiarato." },
  { img:"workbook/pag-06.jpg", thumb:"workbook/thumb-06.jpg", occhiello:"ABS-02 · Rischio clinico",
    titolo:"Prevedere le cadute con sei variabili",
    testo:"Un modello costruito su dati già raccolti di routine, validato internamente: più specifico dello strumento in uso, in meno di due minuti." },
  { img:"workbook/pag-07.jpg", thumb:"workbook/thumb-07.jpg", occhiello:"ABS-03 · Indicatori",
    titolo:"Un cruscotto che i reparti usano davvero",
    testo:"Gli indicatori scelti dai coordinatori coincidevano solo per tre su otto con quelli del report ufficiale. Da lì è cambiato tutto." },
  { img:"workbook/pag-08.jpg", thumb:"workbook/thumb-08.jpg", occhiello:"ABS-04 · Indicatori",
    titolo:"Quanto siamo d'accordo quando valutiamo",
    testo:"Uno studio di concordanza sul rischio di lesione da pressione: la formazione condivisa pesa più degli anni di esperienza." },
  { img:"workbook/pag-09.jpg", thumb:"workbook/thumb-09.jpg", occhiello:"ABS-05 · Procedure",
    titolo:"Da 214 documenti a 68 percorsi",
    testo:"Tagliare il corpus procedurale ha aumentato le consultazioni di quattro volte. La qualità di una procedura si misura sul suo uso." },
  { img:"workbook/pag-10.jpg", thumb:"workbook/thumb-10.jpg", occhiello:"ABS-06 · Procedure",
    titolo:"Tre anni di bundle, con una ricaduta a metà strada",
    testo:"La flessione al quattordicesimo mese non è un fallimento: è il punto in cui la sostenibilità va rimessa in moto." },
  { img:"workbook/pag-11.jpg", thumb:"workbook/thumb-11.jpg", occhiello:"ABS-07 · Esiti",
    titolo:"Un paziente in più per infermiere, e gli esiti cambiano",
    testo:"Analisi su 26.000 giornate di degenza: l'effetto è più marcato sul turno notturno." },
  { img:"workbook/pag-12.jpg", thumb:"workbook/thumb-12.jpg", occhiello:"ABS-08 · Esiti",
    titolo:"Missed care: che cosa misuriamo davvero",
    testo:"Quattro strumenti validati in italiano si sovrappongono solo per il 38% degli item. Confrontare i tassi tra studi diversi non ha senso." },
  { img:"workbook/pag-13.jpg", thumb:"workbook/thumb-13.jpg", occhiello:"ABS-09 · Digitale",
    titolo:"Quanti alert prima che smettano di funzionare",
    testo:"Da 23 alert a 7: l'override è sceso dall'87% al 41%. Il valore di un alert dipende dalla scarsità degli alert intorno a lui." },
  { img:"workbook/pag-14.jpg", thumb:"workbook/thumb-14.jpg", occhiello:"ABS-10 · Digitale",
    titolo:"Un indicatore non è più affidabile del suo dato",
    testo:"Audit su 600 cartelle: accuratezza al 76%, con la data di insorgenza degli eventi come punto più fragile." },
  { img:"workbook/pag-15.jpg", thumb:"workbook/thumb-15.jpg", occhiello:"ABS-11 · Cultura",
    titolo:"Il 44% ha rinunciato almeno una volta a segnalare",
    testo:"Indagine su 940 infermieri: la risposta non punitiva all'errore è la leva più diretta per far emergere ciò che resta invisibile." },
  { img:"workbook/pag-16.jpg", thumb:"workbook/thumb-16.jpg", occhiello:"ABS-12 · Cultura",
    titolo:"Sostenere chi assiste, senza cercare un colpevole",
    testo:"Debriefing entro 72 ore dall'evento avverso, tenuto separato dall'analisi del caso. È la separazione a renderlo accettabile." },
  { img:"workbook/pag-17.jpg", thumb:"workbook/thumb-17.jpg", occhiello:"Dopo il Forum",
    titolo:"Quello che resta di una giornata",
    testo:"Dove finiscono i lavori, come si citano e chi ha organizzato il Forum. L'ultima pagina del volume." },
];
