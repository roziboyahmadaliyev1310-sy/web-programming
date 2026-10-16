const playButton = document.getElementById('playJourney');
const journeySteps = document.querySelectorAll('.journey-step');
const journeyStatus = document.getElementById('journeyStatus');
let journeyTimers = [];

playButton.addEventListener('click', () => {
  journeyTimers.forEach(clearTimeout);
  journeyTimers = [];
  journeySteps.forEach((step) => step.classList.remove('active'));
  playButton.disabled = true;

  const messages = [
    'The browser sends the fetch() request.',
    'The request travels across the internet.',
    'The server finds and sends back data.',
    'JavaScript receives the data and updates the page.'
  ];

  messages.forEach((message, index) => {
    journeyTimers.push(setTimeout(() => {
      journeySteps.forEach((step, stepIndex) => {
        step.classList.toggle('active', stepIndex === index);
      });
      journeyStatus.textContent = message;
      if (index === messages.length - 1) {
        playButton.disabled = false;
      }
    }, index * 1000));
  });
});
