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
    url: 'https://countries.trevorblades.com/',
    summarize: (payload) => {
      if (payload.errors?.length) {
        throw new Error(payload.errors.map((entry) => entry.message).join('; ') || 'Country search failed');
      }
      const countries = payload.data?.countries;
      if (!Array.isArray(countries) || countries.length === 0) {
        throw new Error('No countries matched that name');
      }
      return countries[0];
    }
  }
};

function renderCountry(result, country) {
  const name = country.names?.common || country.name?.common || country.name || 'Unknown country';
  const capitals = country.capitals || country.capital || [];
  const capital = Array.isArray(capitals)
    ? capitals.map((entry) => typeof entry === 'string' ? entry : entry.name).filter(Boolean).join(', ')
    : capitals?.primary || capitals?.name || capitals || 'Not listed';
  const population = country.population?.total ?? country.population;
  const region = country.region?.name || country.region || country.continent?.name || 'Not listed';
  const code = country.codes?.alpha_2 || country.cca2 || country.code || 'Not listed';
  const flagUrl = country.flag?.url_png || country.flag?.url_svg || country.flags?.png || country.flags?.svg;

  result.replaceChildren();
  const heading = document.createElement('h2');
  heading.className = 'country-name';
  heading.textContent = name;
  result.append(heading);

  if (flagUrl) {
    const flag = document.createElement('img');
    flag.className = 'country-flag';
    flag.src = flagUrl;
    flag.alt = `${name} flag`;
    result.append(flag);
  } else if (country.flag?.emoji || country.emoji) {
    const flag = document.createElement('p');
    flag.className = 'country-flag-emoji';
    flag.textContent = country.flag?.emoji || country.emoji;
    flag.setAttribute('aria-label', `${name} flag`);
    result.append(flag);
  }

  const details = [
    ['Capital', capital || 'Not listed'],
    ...(population == null ? [] : [['Population', population.toLocaleString()]]),
    ['Region', region],
    ['Country code', code]
  ];
  const list = document.createElement('dl');
  list.className = 'country-details';
  details.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'country-detail';
    const term = document.createElement('dt');
    term.textContent = `${label}:`;
    const description = document.createElement('dd');
    description.textContent = value;
    row.append(term, description);
    list.append(row);
  });
  result.append(list);
}

async function loadApi(apiName, button) {
  const config = apiConfigs[apiName];
  const result = document.getElementById(`result-${apiName}`);
  if (!config || !result) return;

  const headers = {};
  let url = config.url;
  let method;
  let body;
  if (apiName === 'countries') {
    const countryName = document.getElementById('countryName')?.value.trim();
    if (!countryName) {
      result.className = 'country-result api-result is-error';
      result.textContent = 'Enter a country name to search.';
      return;
    }
    const regex = countryName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/[a-z]/gi, (letter) => `[${letter.toLowerCase()}${letter.toUpperCase()}]`);
    method = 'POST';
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify({
      query: 'query CountryLookup($name: String!) { countries(filter: { name: { regex: $name } }) { name capital code emoji continent { name } } }',
      variables: { name: `^${regex}$` }
    });
  }

  button.disabled = true;
  result.className = apiName === 'countries' ? 'country-result api-result is-loading' : 'api-result is-loading';
  result.replaceChildren();
  result.textContent = 'Loading…';

  try {
    const response = await fetch(url, { method, headers, body });
    const data = await response.json();
    if (!response.ok) {
      const details = data.errors?.map((entry) => entry.message).join('; ');
      throw new Error(details || `Request failed with HTTP ${response.status}`);
    }
    const summary = config.summarize(data);
    result.className = apiName === 'countries' ? 'country-result api-result is-success' : 'api-result is-success';
    if (apiName === 'countries') {
      renderCountry(result, summary);
      return;
    }
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
    result.className = apiName === 'countries' ? 'country-result api-result is-error' : 'api-result is-error';
    result.textContent = `Could not load data: ${error.message}. Check your connection and try again.`;
  } finally {
    button.disabled = false;
  }
}

document.querySelector('[data-country-search]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('[data-api="countries"]');
  if (button) loadApi('countries', button);
});

document.querySelectorAll('[data-api]').forEach((button) => {
  if (button.closest('[data-country-search]')) return;
  button.addEventListener('click', () => loadApi(button.dataset.api, button));
});
