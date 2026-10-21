const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
  const savedTheme = localStorage.getItem('week7-theme');
  if (savedTheme === 'dark') document.body.classList.add('dark');

  const updateThemeLabel = () => {
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️ Light' : '🌙 Dark';
  };

  updateThemeLabel();
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('week7-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    updateThemeLabel();
  });
}

const apiConfigs = {
  joke: {
    url: 'https://official-joke-api.appspot.com/random_joke',
    summarize: (joke) => `${joke.setup}\n\n${joke.punchline}`
  },
  posts: {
    url: 'https://jsonplaceholder.typicode.com/posts?_limit=3',
    summarize: (posts) => posts.map((post) => `${post.id}. ${post.title}\n${post.body}`).join('\n\n')
  },
  weather: {
    url: 'https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FSeoul',
    summarize: (weather) => {
      const current = weather.current;
      return `Seoul now: ${current.temperature_2m} ${weather.current_units.temperature_2m}\nHumidity: ${current.relative_humidity_2m}${weather.current_units.relative_humidity_2m}\nWind: ${current.wind_speed_10m} ${weather.current_units.wind_speed_10m}`;
    }
  },
  user: {
    url: 'https://randomuser.me/api/',
    summarize: (response) => {
      const user = response.results[0];
      return `${user.name.first} ${user.name.last}\n${user.email}\n${user.location.country}`;
    }
  },
  pokemon: {
    url: 'https://pokeapi.co/api/v2/pokemon/pikachu',
    summarize: (pokemon) => {
      const types = pokemon.types.map((entry) => entry.type.name).join(', ');
      const stats = pokemon.stats.map((entry) => `${entry.stat.name}: ${entry.base_stat}`).join('\n');
      return `${pokemon.name} · ${pokemon.height / 10} m · ${pokemon.weight / 10} kg\nTypes: ${types}\n\n${stats}`;
    }
  },
  countries: {
    url: 'https://api.restcountries.com/countries/v5/names.common/Korea',
    summarize: (payload) => {
      if (payload.success === false) {
        throw new Error(payload.errors?.map((entry) => entry.message).join('; ') || 'The API returned an error');
      }
      const data = payload.data ?? payload;
      const countries = Array.isArray(data) ? data : [data];
      return countries.map((country) => {
        const name = country.names?.common || country.name?.common || country.name || 'Korea';
        const capitals = country.capitals || country.capital;
        const capital = Array.isArray(capitals)
          ? capitals.map((entry) => typeof entry === 'string' ? entry : entry.name).join(', ')
          : capitals?.primary || capitals?.name || capitals || 'No capital listed';
        const population = country.population?.total ?? country.population;
        const region = country.region?.name || country.region || 'Not provided';
        const flag = country.flag?.emoji || country.flag || country.flags?.emoji || '';
        return `${flag} ${name}\nCapital: ${capital}\nPopulation: ${population?.toLocaleString?.() || 'Not provided'}\nRegion: ${region}`;
      }).join('\n\n');
    }
  }
};

async function loadApi(apiName, button) {
  const config = apiConfigs[apiName];
  const result = document.getElementById(`result-${apiName}`);
  if (!config || !result) return;

  const headers = {};
  if (apiName === 'countries') {
    const apiKey = document.querySelector('[data-api-key]')?.value.trim();
    if (!apiKey) {
      result.className = 'api-result is-error';
      result.textContent = 'Enter an API key to use the current REST Countries API.';
      return;
    }
    headers.Authorization = apiKey;
  }

  button.disabled = true;
  result.className = 'api-result is-loading';
  result.textContent = 'Loading…';

  try {
    const response = await fetch(config.url, { headers });
    if (!response.ok) throw new Error(`Request failed with HTTP ${response.status}`);
    const data = await response.json();
    const summary = config.summarize(data);
    result.className = 'api-result is-success';
    result.replaceChildren();
    if (apiName === 'user') {
      const imageUrl = data.results?.[0]?.picture?.medium;
      if (imageUrl) {
        const image = document.createElement('img');
        image.className = 'user-avatar';
        image.src = imageUrl;
        image.alt = 'Randomly generated profile';
        result.append(image);
      }
    }
    result.append(document.createTextNode(summary));
  } catch (error) {
    result.className = 'api-result is-error';
    result.textContent = `Could not load data: ${error.message}. Check your connection and try again.`;
  } finally {
    button.disabled = false;
  }
}

document.querySelectorAll('[data-api]').forEach((button) => {
  button.addEventListener('click', () => loadApi(button.dataset.api, button));
});
