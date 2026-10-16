const quizForm = document.getElementById('quizForm');
const quizAnswers = { q1: 'b', q2: 'b', q3: 'b', q4: 'c', q5: 'a' };

quizForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let score = 0;

  Object.entries(quizAnswers).forEach(([question, answer]) => {
    const selected = quizForm.querySelector(`input[name="${question}"]:checked`);
    const feedback = document.getElementById(`feedback-${question}`);
    feedback.className = 'quiz-feedback';

    if (!selected) {
      feedback.textContent = 'Choose an answer first.';
      feedback.classList.add('incorrect');
    } else if (selected.value === answer) {
      score += 1;
      feedback.textContent = 'Correct!';
      feedback.classList.add('correct');
    } else {
      feedback.textContent = 'Not quite. Review the lesson and try again.';
      feedback.classList.add('incorrect');
    }
  });

  document.getElementById('quizScore').textContent = `Your score: ${score} / 5`;
});
