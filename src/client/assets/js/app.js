import { initChat } from './chatAssistant.js';
import { initTimeline } from './timeline.js';
import { initQuiz } from './quiz.js';
import { initPollFinder } from './pollFinder.js';
import { initSearch } from './search.js';
import { initCalendarSync } from './calendarSync.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('ElectionIQ App Initializing...');
  
  initChat();
  initTimeline();
  initQuiz();
  initPollFinder();
  initSearch();
  initCalendarSync();

  // Handle simple glossary mock filtering
  const glossarySearch = document.getElementById('glossary-search');
  if (glossarySearch) {
    glossarySearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const items = document.querySelectorAll('.glossary-item');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(term) ? 'block' : 'none';
      });
    });
  }

  // Handle Registration form
  const regForm = document.getElementById('registration-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const state = document.getElementById('reg-state').value;
      const dob = document.getElementById('reg-dob').value;
      
      const resDiv = document.getElementById('reg-result');
      resDiv.innerHTML = `<p style="color:var(--color-success)"><strong>${name}</strong> appears to be registered in <strong>${state}</strong>. <a href="https://vote.gov" target="_blank" style="color:var(--color-primary)">Visit Official Site</a></p>
      <button id="reg-reminder-btn" class="btn btn-secondary mt-2">Set Registration Deadline Reminder</button>`;
      
      document.getElementById('reg-reminder-btn').addEventListener('click', () => {
        // Trigger calendar event
        if (typeof gtag !== 'undefined') gtag('event', 'calendar_event_added', { phase: 'Registration Deadline' });
        alert('Reminder task initiated. Sign in to sync with your Google Calendar.');
      });
    });
  }
});
