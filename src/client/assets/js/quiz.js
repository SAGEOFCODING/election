export function initQuiz() {
  const modal = document.getElementById('quiz-modal');
  const closeBtn = document.getElementById('close-quiz');
  const container = document.getElementById('quiz-question-container');
  const timerEl = document.getElementById('quiz-timer');
  const progressFill = document.getElementById('progress-fill');

  let currentQuestion = 0;
  let score = 0;
  let timerInterval;
  let timeLeft = 30;
  let questions = [];

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/election/quizzes');
      if (res.ok) {
        const data = await res.json();
        questions = data.quizzes;
      }
    } catch (e) {
      console.error('Quiz fetch failed:', e);
      /* Fallback if backend is unavailable */
      questions = [
        { id: 'q1', question: 'How many electors are in the Electoral College?', options: ['270', '435', '538', '100'], answer: '538', explanation: 'The 538 electors include 435 Representatives, 100 Senators, and 3 from DC.' },
        { id: 'q2', question: 'What is the minimum voting age?', options: ['16', '18', '21', '25'], answer: '18', explanation: 'The 26th Amendment lowered the age to 18 in 1971.' }
      ];
    }
  };

  const startTimer = () => {
    timeLeft = 30;
    timerEl.textContent = timeLeft;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        handleAnswer(''); /* Timeout */
      }
    }, 1000);
  };

  const renderQuestion = () => {
    if (currentQuestion >= questions.length) {
      endQuiz();
      return;
    }
    const q = questions[currentQuestion];
    progressFill.style.width = `${((currentQuestion) / questions.length) * 100}%`;
    
    container.innerHTML = `
      <div class="question-header">
        <span class="question-number">Question ${currentQuestion + 1} of ${questions.length}</span>
        <h4>${q.question}</h4>
      </div>
      <div class="options-grid">
        ${q.options.map(o => `<button class="quiz-opt">${o}</button>`).join('')}
      </div>
      <div id="quiz-feedback" class="quiz-feedback hidden"></div>
    `;

    const btns = container.querySelectorAll('.quiz-opt');
    btns.forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(btn.textContent, btn));
    });

    startTimer();
  };

  const handleAnswer = (selected, btn) => {
    clearInterval(timerInterval);
    const q = questions[currentQuestion];
    const feedback = document.getElementById('quiz-feedback');
    feedback.classList.remove('hidden');

    const btns = container.querySelectorAll('.quiz-opt');
    btns.forEach(b => {
      b.disabled = true;
      if (b.textContent === q.answer) b.classList.add('correct-outline');
    });

    if (selected === q.answer) {
      if(btn) btn.classList.add('correct');
      feedback.innerHTML = `<strong>Correct!</strong> ${q.explanation || ''}`;
      score++;
    } else {
      if(btn) btn.classList.add('incorrect');
      feedback.innerHTML = `<strong>Incorrect.</strong> The correct answer was ${q.answer}. ${q.explanation || ''}`;
    }

    setTimeout(() => {
      currentQuestion++;
      renderQuestion();
    }, 3500);
  };

  const endQuiz = () => {
    progressFill.style.width = '100%';
    const percent = Math.round((score / questions.length) * 100);
    let rank = percent >= 80 ? 'Election Expert' : percent >= 50 ? 'Informed Citizen' : 'Aspiring Voter';
    
    container.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">${percent >= 70 ? '🎉' : '📚'}</div>
        <h4>Quiz Complete!</h4>
        <p style="font-size: 1.25rem; margin: 1rem 0;">You scored <strong>${score}</strong> out of ${questions.length}</p>
        <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; display: inline-block; margin-bottom: 1.5rem;">
          Rank: <strong>${rank}</strong>
        </div>
        <br>
        <button id="share-score" class="btn btn-primary">Share My Results</button>
        <button id="restart-quiz" class="btn btn-secondary" style="margin-left: 8px;">Try Again</button>
      </div>
    `;

    if (typeof gtag !== 'undefined') gtag('event', 'quiz_completed', { score, percent });

    document.getElementById('restart-quiz').addEventListener('click', startQuiz);
    document.getElementById('share-score').addEventListener('click', () => {
      const text = `I just scored ${score}/${questions.length} on the ElectionIQ quiz! Can you beat my score?`;
      if (navigator.share) {
        navigator.share({ title: 'ElectionIQ Results', text, url: window.location.href });
      } else {
        alert(text);
      }
    });
  };

  const startQuiz = () => {
    if (typeof gtag !== 'undefined') gtag('event', 'quiz_started');
    modal.showModal();
    currentQuestion = 0;
    score = 0;
    renderQuestion();
  };

  /* Attach to all start buttons */
  const startButtons = ['start-quiz-btn', 'start-quiz-btn-section'];
  startButtons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', startQuiz);
  });

  closeBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    modal.close();
  });

  fetchQuestions();
}
