/**
 * calendarSync.js — Global helper for synchronizing events to Google Calendar
 */

/**
 * Initializes the global calendar synchronization helper
 */
export function initCalendarSync() {
  /**
   * Global helper to sync an event to the user's calendar
   * @param {Object} eventDetails - The event to add { summary, description, start, end }
   */
  window.syncToCalendar = async (eventDetails) => {
    const token = sessionStorage.getItem('googleIdToken') || (localStorage.getItem('mockUser') ? 'mock-valid-token' : null);
    
    if (!token) {
      alert('Please sign in with Google to sync events to your calendar.');
      return;
    }

    try {
      const res = await fetch('/api/calendar/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventDetails)
      });
      
      if (res.ok) {
        alert('Event successfully added to your Google Calendar!');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`Failed to add event: ${errorData.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error('Calendar Sync Error:', e);
      alert('Error connecting to the server. Please try again later.');
    }
  };
}
