
const breakingContainer = document.querySelector("#breaking-news");
const latestContainer = document.querySelector("#latest-news");
const archiveContainer = document.querySelector("#archive-news");
const searchInput = document.querySelector("#search-input");
const searchStatus = document.querySelector("#search-status");

let articles = [];

async function loadArticles() {
  try {
    const response = await fetch("data/articles.json");

    if (!response.ok) {
      throw new Error("Impossibile caricare l'archivio.");
    }

    articles = await response.json();
    renderHomepage();
  } catch (error) {
    console.error(error);
    searchStatus.textContent =
      "Non riesco a caricare le notizie. Avvia il sito con un server locale.";
  }
}


function createCard(article) {
  const card = document.createElement("article");
  card.className = "news-card";

  // Immagine della notizia, se presente nell'archivio.
  if (article.image) {
    const image = document.createElement("img");
    image.className = "news-card-image";
    image.src = article.image;
    image.alt = article.imageAlt || article.title;
    image.loading = "lazy";

    card.append(image);
  }

  const category = document.createElement("p");
  category.className = "category";
  category.textContent = article.category;

  const title = document.createElement("h3");
  title.textContent = article.title;

  const date = document.createElement("p");
  date.textContent = article.historicalDate;

  const summary = document.createElement("p");
  summary.textContent = article.summary;

  const link = document.createElement("a");
  link.className = "read-more";
  link.href = `article.html?id=${encodeURIComponent(article.id)}`;
  link.textContent = "Leggi la notizia →";

  card.append(category, title, date, summary, link);
  return card;
}


function renderList(container, list) {
  container.replaceChildren();

  if (list.length === 0) {
    const message = document.createElement("p");
    message.textContent = "Nessuna notizia trovata.";
    container.append(message);
    return;
  }

  list.forEach(article => {
    container.append(createCard(article));
  });
}

function renderHomepage() {
  const ordered = [...articles].sort(
    (a, b) => b.publicationOrder - a.publicationOrder
  );

  renderList(
    breakingContainer,
    ordered.filter(article => article.breaking)
  );

  renderList(latestContainer, ordered);

  renderList(archiveContainer, articles);
}

function searchArticles() {
  const query = searchInput.value.trim().toLocaleLowerCase("it");

  const filtered = articles.filter(article => {
    const searchableText = [
      article.title,
      article.subtitle,
      article.historicalDate,
      article.era,
      article.location,
      article.category,
      ...article.people
    ].join(" ").toLocaleLowerCase("it");

    return searchableText.includes(query);
  });

  if (!query) {
    renderHomepage();
    searchStatus.textContent = "";
    return;
  }

  renderList(breakingContainer, filtered.filter(a => a.breaking));
  renderList(latestContainer, filtered);
  renderList(archiveContainer, filtered);

  searchStatus.textContent =
    `${filtered.length} notizie trovate per "${searchInput.value.trim()}".`;
}

searchInput.addEventListener("input", searchArticles);

loadArticles();
