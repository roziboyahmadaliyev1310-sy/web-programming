
const toggleButton = document.querySelector('.theme-toggle');

if (toggleButton) {
  const savedTheme = localStorage.getItem('week6-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    toggleButton.textContent = '☀️ Light';
  } else {
    toggleButton.textContent = '🌙 Dark';
  }

  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('week6-theme', isDark ? 'dark' : 'light');
    toggleButton.textContent = isDark ? '☀️ Light' : '🌙 Dark';
  });
}
