export function initCalendarSync() {
  // Common functions for calendar syncing across the app
  // This logic is mostly handled individually by buttons (timeline, polling, etc)
  // But we can expose a global helper if needed.
  window.syncToCalendar = async (eventDetails) => {
    const token = localStorage.getItem('mockUser') ? 'mock-valid-token' : null;
    if (!token) {
      alert('Please sign in to sync with Google Calendar.');
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
        alert('Event successfully added to your Calendar!');
      } else {
        alert('Failed to add event.');
      }
    } catch (e) {
      alert('Error connecting to server.');
    }
  };
}
