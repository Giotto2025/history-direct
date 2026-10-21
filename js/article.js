
const titleElement = document.querySelector("#title");
const subtitleElement = document.querySelector("#subtitle");
const categoryElement = document.querySelector("#category");
const dateElement = document.querySelector("#historical-date");
const locationElement = document.querySelector("#location");
const summaryElement = document.querySelector("#summary");
const contentElement = document.querySelector("#content");
const mapDescription = document.querySelector("#map-description");
const relatedContainer = document.querySelector("#related-articles");
const articleImageContainer = document.querySelector(
  "#article-image-container"
);
const articleImage = document.querySelector("#article-image");
const articleImageCaption = document.querySelector(
  "#article-image-caption"
);

let mapInstance = null;

function showArticleImage(article) {
  if (!articleImageContainer || !articleImage || !articleImageCaption) {
    return;
  }

  if (!article.image) {
    articleImageContainer.hidden = true;
    articleImage.removeAttribute("src");
    return;
  }

  articleImage.src = article.image;
  articleImage.alt = article.imageAlt || article.title || "";

  articleImageCaption.textContent = article.imageCaption || "";

  articleImageContainer.hidden = false;

  articleImage.onerror = () => {
    articleImageContainer.hidden = true;
    console.error("Impossibile caricare l'immagine:", article.image);
  };
}


function renderArticleContent(content) {
  contentElement.replaceChildren();
  contentElement.classList.add("article-body");

  const sections = content.split(/\n\s*\n/);

  sections.forEach(section => {
    const text = section.trim();

    if (!text) return;

    // Riconosce le righe scritte interamente in maiuscolo
    // e le trasforma in sottotitoli.
    const isHeading =
      /[A-ZÀ-ÖØ-Þ]/.test(text) &&
      text === text.toLocaleUpperCase("it") &&
      text.length < 100;

    if (isHeading) {
      const heading = document.createElement("h2");
      heading.textContent = text;
      contentElement.append(heading);
    } else {
      const paragraph = document.createElement("p");

      // Mantiene uniti eventuali a capo all'interno del paragrafo.
      paragraph.textContent = text.replace(/\s*\n\s*/g, " ");

      contentElement.append(paragraph);
    }
  });
}



async function loadArticle() {
  try {
    // 1. Legge l'ID dall'indirizzo della pagina
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get("id");

    if (!articleId) {
      throw new Error("Nessuna notizia selezionata.");
    }

    // 2. Carica l'archivio JSON
    const response = await fetch("data/articles.json");

    if (!response.ok) {
      throw new Error("Impossibile caricare l'archivio.");
    }

    const articles = await response.json();

    // 3. Trova la notizia richiesta
    const article = articles.find(item => item.id === articleId);

    if (!article) {
      throw new Error("Notizia non trovata.");
    }

    // 4. Inserisce i dati nella pagina
    document.title = `${article.title} | History Direct`;

    titleElement.textContent = article.title;
    subtitleElement.textContent = article.subtitle || "";
    categoryElement.textContent = article.category || "Storia";
    dateElement.textContent =
      `Data storica: ${article.historicalDate || "Non specificata"}`;
    locationElement.textContent =
      `Luogo: ${article.location || "Non specificato"}`;
    summaryElement.textContent = article.summary || "";
    renderArticleContent(
    article.content || "Il testo completo sarà aggiunto prossimamente."
    );

    showArticleImage(article);

      // 5. Inizializza la mappa, se ci sono coordinate
    showMap(article);

    // 6. Carica gli articoli correlati
    showRelatedArticles(article, articles);

  } catch (error) {
    console.error(error);

    titleElement.textContent = "Notizia non disponibile";
    subtitleElement.textContent =
      error.message || "Si è verificato un errore.";

    mapDescription.textContent = "";
    relatedContainer.replaceChildren();
  }
}

function showMap(article) {
  const coordinates = article.coordinates;

  if (
    !coordinates ||
    !Number.isFinite(coordinates.lat) ||
    !Number.isFinite(coordinates.lng)
  ) {
    mapDescription.textContent =
      "Non sono disponibili coordinate per questo evento.";
    document.querySelector("#map").hidden = true;
    return;
  }

  if (typeof L === "undefined") {
    mapDescription.textContent =
      "La libreria della mappa non è disponibile. Controlla la connessione.";
    return;
  }

  mapDescription.textContent =
    `Posizione geografica: ${article.location || "luogo dell'evento"}.`;

  const mapElement = document.querySelector("#map");
  mapElement.hidden = false;

  if (mapInstance) {
    mapInstance.remove();
  }

  mapInstance = L.map(mapElement).setView(
    [coordinates.lat, coordinates.lng],
    7
  );

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  ).addTo(mapInstance);

  L.marker([coordinates.lat, coordinates.lng])
    .addTo(mapInstance)
    .bindPopup(article.location || article.title)
    .openPopup();
}

function showRelatedArticles(article, articles) {
  relatedContainer.replaceChildren();

  const relatedIds = article.relatedArticles || [];

  const related = relatedIds
    .map(id => articles.find(item => item.id === id))
    .filter(Boolean);

  if (related.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Non ci sono ancora notizie correlate.";
    relatedContainer.append(message);
    return;
  }

  related.forEach(item => {
    const card = document.createElement("a");
    card.className = "related-card";
    card.href = `article.html?id=${encodeURIComponent(item.id)}`;

    const heading = document.createElement("h3");
    heading.textContent = item.title;

    const date = document.createElement("p");
    date.textContent = item.historicalDate || "";

    const description = document.createElement("p");
    description.textContent = item.summary || "";

    card.append(heading, date, description);
    relatedContainer.append(card);
  });
}

loadArticle();
