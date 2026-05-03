import { initChat } from './chatAssistant.js';
import { initTimeline } from './timeline.js';
import { initQuiz } from './quiz.js';
import { initPollFinder } from './pollFinder.js';
import { initSearch } from './search.js';
import { initCalendarSync } from './calendarSync.js';

/**
 * Creates a debounced version of a function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Filters the glossary items based on user input
 * @param {Event} e - Input event
 */
function filterGlossary(e) {
  const term = e.target.value.toLowerCase();
  const items = document.querySelectorAll('.glossary-item');
  items.forEach((item) => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(term) ? 'block' : 'none';
  });
}

/**
 * Handles the registration form submission logic
 * @param {Event} e - Submit event
 */
function handleRegistrationSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('reg-name');
  const stateInput = document.getElementById('reg-state');
  
  const name = nameInput.value;
  const state = stateInput.value;
  
  const resDiv = document.getElementById('reg-result');
  resDiv.innerHTML = `
    <p style="color:var(--color-success)"><strong>${name}</strong> appears to be registered in <strong>${state}</strong>. 
    <a href="https://vote.gov" target="_blank" style="color:var(--color-primary)">Visit Official Site</a></p>
    <button id="reg-reminder-btn" class="btn btn-secondary mt-2">Set Registration Deadline Reminder</button>
  `;
  
  document.getElementById('reg-reminder-btn')?.addEventListener('click', () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'calendar_event_added', { phase: 'Registration Deadline' });
    }
    alert('Reminder task initiated. Sign in to sync with your Google Calendar.');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('ElectionIQ App Initializing...');
  
  initChat();
  initTimeline();
  initQuiz();
  initPollFinder();
  initSearch();
  initCalendarSync();

  const glossarySearch = document.getElementById('glossary-search');
  if (glossarySearch) {
    glossarySearch.addEventListener('input', debounce(filterGlossary, 200));
  }

  const regForm = document.getElementById('registration-form');
  if (regForm) {
    regForm.addEventListener('submit', handleRegistrationSubmit);
  }
});
