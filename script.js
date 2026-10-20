
const notizie = [
  {
    titolo: "La presa della Bastiglia",
    data: "1789-07-14",
    luogo: "Parigi, Francia",
    epoca: "Età moderna",
    personaggi: ["Luigi XVI", "Camille Desmoulins"],
    categoria: "Rivoluzioni",
    descrizione:
      "Il 14 luglio 1789, la presa della Bastiglia divenne uno degli eventi simbolo della Rivoluzione francese."
  },
  {
    titolo: "La caduta del Muro di Berlino",
    data: "1989-11-09",
    luogo: "Berlino, Germania",
    epoca: "Storia contemporanea",
    personaggi: ["Michail Gorbačëv", "Helmut Kohl"],
    categoria: "Politica",
    descrizione:
      "Il 9 novembre 1989, l'apertura dei passaggi del Muro segnò una svolta nella storia europea."
  },
  {
    titolo: "Il primo allunaggio",
    data: "1969-07-20",
    luogo: "Luna",
    epoca: "Storia contemporanea",
    personaggi: ["Neil Armstrong", "Buzz Aldrin"],
    categoria: "Scienza",
    descrizione:
      "La missione Apollo 11 portò i primi esseri umani sulla superficie lunare nel luglio 1969."
  },
  {
    titolo: "L'incoronazione di Carlo Magno",
    data: "0800-12-25",
    luogo: "Roma, Italia",
    epoca: "Medioevo",
    personaggi: ["Carlo Magno", "Papa Leone III"],
    categoria: "Politica",
    descrizione:
      "Carlo Magno fu incoronato imperatore a Roma il giorno di Natale dell'anno 800."
  },
  {
    titolo: "L'inizio della Prima guerra mondiale",
    data: "1914-07-28",
    luogo: "Europa",
    epoca: "Storia contemporanea",
    personaggi: ["Francesco Ferdinando", "Guglielmo II"],
    categoria: "Guerre",
    descrizione:
      "La dichiarazione di guerra dell'Austria-Ungheria alla Serbia aprì il conflitto mondiale."
  },
  {
    titolo: "La scoperta dell'America da parte di Colombo",
    data: "1492-10-12",
    luogo: "Caraibi",
    epoca: "Età moderna",
    personaggi: ["Cristoforo Colombo"],
    categoria: "Esplorazioni",
    descrizione:
      "La spedizione di Colombo raggiunse i Caraibi, avviando una nuova fase dei rapporti tra Europa e Americhe."
  }
];

const lista = document.getElementById("lista-notizie");
const campoRicerca = document.getElementById("cerca");
const selettoreOrdine = document.getElementById("ordine");
const conteggio = document.getElementById("numero-risultati");

function formattaData(data) {
  // Usiamo mezzogiorno UTC per evitare problemi
  // di fuso orario durante la formattazione.
  const giorno = new Date(data + "T12:00:00Z");

  return giorno.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });
}

function creaArticolo(n) {
  const articolo = document.createElement("article");
  articolo.className = "articolo";

  const categoria = document.createElement("span");
  categoria.className = "categoria";
  categoria.textContent = n.categoria;

  const titolo = document.createElement("h3");
  titolo.textContent = n.titolo;

  const metadati = document.createElement("p");
  metadati.className = "metadati";
  metadati.textContent =
    `${formattaData(n.data)} · ${n.luogo}`;

  const descrizione = document.createElement("p");
  descrizione.textContent = n.descrizione;

  const pulsante = document.createElement("button");
  pulsante.type = "button";
  pulsante.textContent = "Leggi la notizia";

  pulsante.addEventListener("click", () => {
    alert(
      `${n.titolo}\n\n${n.descrizione}\n\n` +
      `Evento: ${formattaData(n.data)}\n` +
      `Luogo: ${n.luogo}\n\n` +
      "Questa è una scheda dimostrativa. " +
      "In seguito aggiungeremo la pagina completa dell'articolo."
    );
  });

  articolo.append(
    categoria,
    titolo,
    metadati,
    descrizione,
    pulsante
  );

  return articolo;
}

function aggiornaNotizie() {
  const testo = campoRicerca.value
    .trim()
    .toLocaleLowerCase("it");

  const ordine = selettoreOrdine.value;

  const risultati = notizie.filter(n => {
    const contenuto = [
      n.titolo,
      n.luogo,
      n.epoca,
      n.categoria,
      n.descrizione,
      ...n.personaggi
    ].join(" ").toLocaleLowerCase("it");

    return contenuto.includes(testo);
  });

  risultati.sort((a, b) => {
    const differenza = a.data.localeCompare(b.data);

    return ordine === "antico"
      ? differenza
      : -differenza;
  });

  lista.replaceChildren();

  if (risultati.length === 0) {
    const messaggio = document.createElement("p");
    messaggio.textContent =
      "Nessuna notizia trovata. Prova un'altra ricerca.";
    lista.appendChild(messaggio);
  } else {
    risultati.forEach(n => {
      lista.appendChild(creaArticolo(n));
    });
  }

  conteggio.textContent =
    `${risultati.length} ${
      risultati.length === 1
        ? "evento trovato"
        : "eventi trovati"
    }`;
}

campoRicerca.addEventListener("input", aggiornaNotizie);
selettoreOrdine.addEventListener("change", aggiornaNotizie);

// Mostra le notizie al primo caricamento.
aggiornaNotizie();
