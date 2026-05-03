export function initTimeline() {
  const container = document.getElementById('timeline-container');

  const fetchTimeline = async () => {
    try {
      const res = await fetch('/api/election/timeline');
      if (res.ok) {
        const data = await res.json();
        renderTimeline(data.timeline, data.currentPhaseId);
      }
    } catch (e) {
      console.error('Timeline fetch failed:', e);
    }
  };

  const renderTimeline = (timeline, currentPhaseId) => {
    if (!container) return;
    container.innerHTML = '';
    
    timeline.forEach(phase => {
      const el = document.createElement('div');
      el.className = `timeline-phase ${phase.id === currentPhaseId ? 'active' : ''}`;
      
      el.innerHTML = `
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <span class="timeline-date">${phase.formattedDate || phase.date}</span>
          <h4>${phase.phase}</h4>
          <div class="timeline-description">${phase.description}</div>
          <button class="btn btn-secondary add-cal-btn" data-phase="${phase.phase}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></button>
            Add to Calendar
          </button>
        </div>
      `;

      el.addEventListener('click', () => {
        el.classList.toggle('expanded');
      });

      const btn = el.querySelector('.add-cal-btn');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        alert(`Adding "${phase.phase}" to your Google Calendar...\n\nNote: This requires being signed in with Google.`);
        if (typeof gtag !== 'undefined') gtag('event', 'calendar_event_added', { phase: phase.phase });
      });

      container.appendChild(el);
    });
  };

  fetchTimeline();
}
