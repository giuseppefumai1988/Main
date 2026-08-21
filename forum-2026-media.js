/* =========================================================
   FORUM INFERMIERISTICO ANIQRC — 30 ottobre 2026
   Contenuti multimediali della pagina evento.
   =========================================================

   Questo file contiene TRE blocchi. Modifica solo questi:

     1) FORUM_VIDEO     → i video del recap
     2) FORUM_GALLERIA  → le foto del recap
     3) FORUM_WORKBOOK  → le pagine del carosello del workbook

   Finché il primo e il secondo blocco restano vuoti ( [] ),
   la sezione «Recap» mostra il suo stato di attesa.
   ========================================================= */


/* ---------------------------------------------------------
   1) VIDEO DEL RECAP
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
   2) GALLERIA FOTOGRAFICA DEL RECAP
   ---------------------------------------------------------
   Metti le immagini nella cartella del sito (o in una sottocartella,
   per esempio "forum2026/") e aggiungile qui:

      { src: "forum2026/01.jpg", alt: "La plenaria del mattino",
        didascalia: "Apertura dei lavori", grande: true }

   grande: true  →  la foto occupa due caselle nella griglia.
   --------------------------------------------------------- */
window.FORUM_GALLERIA = [

  // { src: "forum2026/01.jpg", alt: "La plenaria del mattino", didascalia: "Apertura dei lavori", grande: true },
  // { src: "forum2026/02.jpg", alt: "Sessione parallela", didascalia: "Sessione parallela — Area A1" },
  // { src: "forum2026/03.jpg", alt: "Tavolo di lavoro", didascalia: "Tavoli di lavoro del pomeriggio" },

];


/* ---------------------------------------------------------
   3) CAROSELLO DEL WORKBOOK
   ---------------------------------------------------------
   Ogni voce è una pagina del workbook:
      img    → immagine grande      thumb → miniatura
      occhiello / titolo / testo → la didascalia del racconto
   Le immagini stanno nella cartella workbook/.
   --------------------------------------------------------- */
window.FORUM_WORKBOOK = [
  { img:"workbook/pag-01.jpg", thumb:"workbook/thumb-01.jpg", occhiello:"Copertina",
    titolo:"Un volume, non un volantino",
    testo:"La Call for Abstract ha una sua identità visiva: rosso mattone, tipografia netta, nessuna decorazione. Il workbook è il documento che la porta in giro." },
  { img:"workbook/pag-02.jpg", thumb:"workbook/thumb-02.jpg", occhiello:"Il Forum",
    titolo:"Perché una giornata sola può bastare",
    testo:"Mattino in plenaria per fissare il metodo, pomeriggio in sessioni parallele per i lavori, chiusura con la restituzione. Il programma della giornata, ora per ora." },
  { img:"workbook/pag-03.jpg", thumb:"workbook/thumb-03.jpg", occhiello:"Come partecipare",
    titolo:"Cinque passi, nessuna sorpresa",
    testo:"Dall'area tematica all'invio: la procedura per intero, con i requisiti di lunghezza, autori e parole chiave in fondo alla pagina." },
  { img:"workbook/pag-04.jpg", thumb:"workbook/thumb-04.jpg", occhiello:"Aree tematiche",
    titolo:"Sei aree per orientarsi",
    testo:"Dal rischio clinico agli esiti sensibili all'assistenza, dal digitale alla cultura della sicurezza. Servono a organizzare le sessioni, non a escludere." },
  { img:"workbook/pag-05.jpg", thumb:"workbook/thumb-05.jpg", occhiello:"Valutazione",
    titolo:"Cinque criteri, due revisori in cieco",
    testo:"Rilevanza, metodo, risultati, trasferibilità, chiarezza. Con il calendario completo delle scadenze, dall'apertura della Call al giorno del Forum." },
  { img:"workbook/pag-06.jpg", thumb:"workbook/thumb-06.jpg", occhiello:"I lavori",
    titolo:"Dodici modi di misurarsi",
    testo:"Da qui in poi cambia il registro: iniziano gli abstract, uno per pagina, nel formato esatto in cui vanno inviati." },
  { img:"workbook/pag-07.jpg", thumb:"workbook/thumb-07.jpg", occhiello:"Indice",
    titolo:"Tutto quello che c'è dentro",
    testo:"L'indice dei lavori con codice, tipologia e area tematica: il modo più rapido per trovare il lavoro vicino al proprio." },
  { img:"workbook/pag-08.jpg", thumb:"workbook/thumb-08.jpg", occhiello:"ABS-01 · Rischio clinico",
    titolo:"Errori di terapia: −48% con il doppio controllo",
    testo:"Un progetto di miglioramento su 48 posti letto, con osservazione diretta pre e post. Anche il costo in minuti è dichiarato." },
  { img:"workbook/pag-09.jpg", thumb:"workbook/thumb-09.jpg", occhiello:"ABS-02 · Rischio clinico",
    titolo:"Prevedere le cadute con sei variabili",
    testo:"Un modello costruito su dati già raccolti di routine, validato internamente: più specifico dello strumento in uso, in meno di due minuti." },
  { img:"workbook/pag-10.jpg", thumb:"workbook/thumb-10.jpg", occhiello:"ABS-03 · Indicatori",
    titolo:"Un cruscotto che i reparti usano davvero",
    testo:"Gli indicatori scelti dai coordinatori coincidevano solo per tre su otto con quelli del report ufficiale. Da lì è cambiato tutto." },
  { img:"workbook/pag-11.jpg", thumb:"workbook/thumb-11.jpg", occhiello:"ABS-04 · Indicatori",
    titolo:"Quanto siamo d'accordo quando valutiamo",
    testo:"Uno studio di concordanza sul rischio di lesione da pressione: la formazione condivisa pesa più degli anni di esperienza." },
  { img:"workbook/pag-12.jpg", thumb:"workbook/thumb-12.jpg", occhiello:"ABS-05 · Procedure",
    titolo:"Da 214 documenti a 68 percorsi",
    testo:"Tagliare il corpus procedurale ha aumentato le consultazioni di quattro volte. La qualità di una procedura si misura sul suo uso." },
  { img:"workbook/pag-13.jpg", thumb:"workbook/thumb-13.jpg", occhiello:"ABS-06 · Procedure",
    titolo:"Tre anni di bundle, con una ricaduta a metà strada",
    testo:"La flessione al quattordicesimo mese non è un fallimento: è il punto in cui la sostenibilità va rimessa in moto." },
  { img:"workbook/pag-14.jpg", thumb:"workbook/thumb-14.jpg", occhiello:"ABS-07 · Esiti",
    titolo:"Un paziente in più per infermiere, e gli esiti cambiano",
    testo:"Analisi su 26.000 giornate di degenza: l'effetto è più marcato sul turno notturno." },
  { img:"workbook/pag-15.jpg", thumb:"workbook/thumb-15.jpg", occhiello:"ABS-08 · Esiti",
    titolo:"Missed care: che cosa misuriamo davvero",
    testo:"Quattro strumenti validati in italiano si sovrappongono solo per il 38% degli item. Confrontare i tassi tra studi diversi non ha senso." },
  { img:"workbook/pag-16.jpg", thumb:"workbook/thumb-16.jpg", occhiello:"ABS-09 · Digitale",
    titolo:"Quanti alert prima che smettano di funzionare",
    testo:"Da 23 alert a 7: l'override è sceso dall'87% al 41%. Il valore di un alert dipende dalla scarsità degli alert intorno a lui." },
  { img:"workbook/pag-17.jpg", thumb:"workbook/thumb-17.jpg", occhiello:"ABS-10 · Digitale",
    titolo:"Un indicatore non è più affidabile del suo dato",
    testo:"Audit su 600 cartelle: accuratezza al 76%, con la data di insorgenza degli eventi come punto più fragile." },
  { img:"workbook/pag-18.jpg", thumb:"workbook/thumb-18.jpg", occhiello:"ABS-11 · Cultura",
    titolo:"Il 44% ha rinunciato almeno una volta a segnalare",
    testo:"Indagine su 940 infermieri: la risposta non punitiva all'errore è la leva più diretta per far emergere ciò che resta invisibile." },
  { img:"workbook/pag-19.jpg", thumb:"workbook/thumb-19.jpg", occhiello:"ABS-12 · Cultura",
    titolo:"Sostenere chi assiste, senza cercare un colpevole",
    testo:"Debriefing entro 72 ore dall'evento avverso, tenuto separato dall'analisi del caso. È la separazione a renderlo accettabile." },
  { img:"workbook/pag-20.jpg", thumb:"workbook/thumb-20.jpg", occhiello:"Dopo il Forum",
    titolo:"Dove finiscono i lavori",
    testo:"Archivio ANIQRC, Osservatorio, Toolkit — e per i lavori più solidi l'invito a un contributo esteso per il Journal." },
];
