/**
 * timeline.js — Handles the interactive election timeline module
 */

/**
 * Initializes the timeline module
 */
export function initTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) {
    return;
  }

  /**
   * Fetches timeline data from the API
   */
  const fetchTimeline = async () => {
    try {
      const res = await fetch('/api/election/timeline');
      if (res.ok) {
        const data = await res.json();
        // Server returns { events: [], lastUpdated: ... }
        renderTimeline(data.events);
      }
    } catch (e) {
      console.error('Timeline fetch failed:', e);
    }
  };

  /**
   * Renders the timeline events into the container
   * @param {Array} events - List of timeline events
   */
  const renderTimeline = (events) => {
    container.innerHTML = '';
    
    events.forEach((phase) => {
      const el = createTimelineElement(phase);
      container.appendChild(el);
    });
  };

  /**
   * Creates a single timeline phase element
   * @param {Object} phase - The timeline phase data
   * @returns {HTMLElement} The constructed element
   */
  const createTimelineElement = (phase) => {
    const el = document.createElement('div');
    const isActive = phase.status === 'active';
    el.className = `timeline-phase ${isActive ? 'active' : ''}`;
    
    el.innerHTML = `
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <span class="timeline-date">${phase.formattedDate || phase.date}</span>
        <h4>${phase.title || phase.phase}</h4>
        <div class="timeline-description">${phase.description}</div>
        <button class="btn btn-secondary add-cal-btn" data-phase="${phase.title || phase.phase}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></button>
          Add to Calendar
        </button>
      </div>
    `;

    el.addEventListener('click', () => {
      el.classList.toggle('expanded');
    });

    const btn = el.querySelector('.add-cal-btn');
    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleAddToCalendar(phase.title || phase.phase);
    });

    return el;
  };

  /**
   * Handles the add to calendar button click
   * @param {string} phaseName - Name of the election phase
   */
  const handleAddToCalendar = (phaseName) => {
    alert(`Adding "${phaseName}" to your Google Calendar...\n\nNote: This requires being signed in with Google.`);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'calendar_event_added', { phase: phaseName });
    }
  };

  fetchTimeline();
}
