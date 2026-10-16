const jokeButton = document.getElementById('jokeBtn');
const saveButton = document.getElementById('saveBtn');
const jokeOutput = document.getElementById('jokeOut');
const jokeSetup = document.getElementById('jokeSetup');
const jokePunchline = document.getElementById('jokePunch');
const statusMessage = document.getElementById('status');
const loadingMessage = document.getElementById('loading');
const favoritesList = document.getElementById('favorites');
const favoritesEmpty = document.getElementById('favorites-empty');
const fallbackJoke = {
  setup: 'Why do programmers prefer dark mode?',
  punchline: 'Because light attracts bugs.'
};
const favoritesKey = 'week6-favorite-jokes';
let currentJoke = null;

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    statusMessage.textContent = `Could not read saved jokes: ${error.message}`;
    return [];
  }
}

function renderFavorites() {
  const favorites = readFavorites();
  favoritesList.replaceChildren();
  favoritesEmpty.hidden = favorites.length > 0;

  favorites.forEach((joke) => {
    const item = document.createElement('li');
    item.textContent = `${joke.setup} — ${joke.punchline}`;
    favoritesList.append(item);
  });
}

async function loadJoke() {
  jokeButton.disabled = true;
  saveButton.disabled = true;
  jokeButton.textContent = 'Loading…';
  loadingMessage.classList.remove('hidden');
  statusMessage.textContent = 'Fetching a joke…';
  jokeOutput.style.display = 'block';
  jokeSetup.textContent = 'Asking the server for a joke…';
  jokePunchline.textContent = '';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch('https://official-joke-api.appspot.com/random_joke', {
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (typeof data.setup !== 'string' || typeof data.punchline !== 'string') {
      throw new Error('The API returned an unexpected joke format.');
    }
    currentJoke = { setup: data.setup, punchline: data.punchline };
    jokeSetup.textContent = currentJoke.setup;
    jokePunchline.textContent = currentJoke.punchline;
    statusMessage.textContent = 'Success: joke loaded.';
  } catch (error) {
    currentJoke = fallbackJoke;
    jokeSetup.textContent = fallbackJoke.setup;
    jokePunchline.textContent = fallbackJoke.punchline;
    statusMessage.textContent = error.name === 'AbortError'
      ? 'The request timed out — showing a fallback joke.'
      : `Could not load from the API (${error.message}) — showing a fallback joke.`;
  } finally {
    clearTimeout(timeoutId);
    loadingMessage.classList.add('hidden');
    jokeButton.disabled = false;
    jokeButton.textContent = 'Load Another Joke';
    saveButton.disabled = !currentJoke;
  }
}

function saveFavorite() {
  if (!currentJoke) return;

  const favorites = readFavorites();
  const exists = favorites.some((joke) =>
    joke.setup === currentJoke.setup && joke.punchline === currentJoke.punchline
  );
  if (exists) {
    statusMessage.textContent = 'That joke is already in your favourites.';
    return;
  }

  try {
    localStorage.setItem(favoritesKey, JSON.stringify([...favorites, currentJoke]));
    statusMessage.textContent = 'Favourite saved in this browser.';
    renderFavorites();
  } catch (error) {
    statusMessage.textContent = `Could not save favourite: ${error.message}`;
  }
}

jokeButton.addEventListener('click', loadJoke);
saveButton.addEventListener('click', saveFavorite);
renderFavorites();
