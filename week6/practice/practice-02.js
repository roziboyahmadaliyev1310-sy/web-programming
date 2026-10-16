const fetchForm = document.getElementById('fetchForm');
const fetchUrl = document.getElementById('fetchUrl');
const fetchButton = document.getElementById('fetchButton');
const fetchResult = document.getElementById('fetchResult');

fetchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = fetchUrl.value.trim();
  fetchResult.className = 'status';
  fetchResult.textContent = 'Fetching…';
  fetchButton.disabled = true;

  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Enter a URL that starts with http:// or https://.');
    }

    const response = await fetch(parsedUrl);
    if (!response.ok) {
      fetchResult.classList.add('incorrect');
      fetchResult.textContent = `HTTP ${response.status}: response.ok is false. fetch() resolved; your code detected the HTTP error.`;
      return;
    }

    fetchResult.classList.add('correct');
    fetchResult.textContent = `Success: HTTP ${response.status}, response.ok is true.`;
  } catch (error) {
    fetchResult.classList.add('incorrect');
    fetchResult.textContent = `Request failed: ${error.message}. A network or CORS error rejects fetch().`;
  } finally {
    fetchButton.disabled = false;
  }
});
