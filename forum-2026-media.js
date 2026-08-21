/* =========================================================
   FORUM INFERMIERISTICO — Bari, 30 ottobre 2026
   «Qualità, sicurezza e rischio clinico»
   IRCCS Istituto Tumori «Giovanni Paolo II» — Bari
   Contenuti multimediali della pagina evento.
   =========================================================

   Questo file contiene TRE blocchi. Modifica solo questi:

     1) FORUM_LOGO_ENTE →  il logo dell'ente organizzatore
     2) FORUM_VIDEO     →  i video del recap
     3) FORUM_GALLERIA  →  le foto del recap

   Finché i blocchi 2 e 3 restano vuoti ( [] ), la sezione «Recap»
   mostra il suo stato di attesa.
   ========================================================= */


/* ---------------------------------------------------------
   1) LOGO DELL'ENTE ORGANIZZATORE
   ---------------------------------------------------------
   Salva il file del logo ufficiale IRCCS nella cartella del sito con
   il nome qui sotto — e comparirà da solo sia nell'intestazione della
   pagina sia nel riquadro dei loghi, al posto del testo.
   Finché il file non c'è, resta il nome scritto: non si rompe nulla.
   Formati consigliati: PNG con sfondo trasparente, oppure SVG.
   --------------------------------------------------------- */
window.FORUM_LOGO_ENTE = "irccs-istituto-tumori.png";


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
