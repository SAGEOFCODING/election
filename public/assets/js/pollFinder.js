/**
 * pollFinder.js — Handles polling place location and lazy loading of Maps
 */

/**
 * Lazily loads Google Maps script only when poll finder section is visible
 * @param {string} mapsKey - Google Maps API Key
 * @returns {Promise}
 */
async function lazyLoadMaps(mapsKey) {
  if (window.google?.maps) {
    return;
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Initializes the mock map container
 * @param {string} address - Address to search
 */
function renderMockMap(address) {
  const container = document.getElementById('map-container');
  container.innerHTML = `
    <div style="background: rgba(0,0,0,0.2); padding: 2rem; text-align: center; border-radius: var(--radius-md);">
      <h4>Polling Places Near You</h4>
      <p>Address searched: ${address}</p>
      <p>Found 3 polling places nearby.</p>
      <button id="mock-dir-btn" class="btn btn-secondary mt-2">Get Directions</button>
    </div>
  `;

  setTimeout(() => {
    document.getElementById('mock-dir-btn')?.addEventListener('click', () => {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Polling Place near ' + address)}`, '_blank');
    });
  }, 100);
}

/**
 * Initializes the poll finder module
 */
export function initPollFinder() {
  const btn = document.getElementById('find-polling-btn');
  const input = document.getElementById('address-input');
  const section = document.getElementById('poll-finder-section');

  if (section) {
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        // Fetch config to get maps key if needed, or just prepare
        console.log('Poll finder section visible. Preparing maps...');
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(section);
  }

  btn?.addEventListener('click', () => {
    const address = input.value.trim();
    if (!address) {
      alert('Please enter an address');
      return;
    }

    if (typeof gtag !== 'undefined') {
      gtag('event', 'polling_place_searched');
    }

    renderMockMap(address);
  });
}
