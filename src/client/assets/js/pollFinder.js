export function initPollFinder() {
  const btn = document.getElementById('find-polling-btn');
  const input = document.getElementById('address-input');
  const container = document.getElementById('map-container');

  btn.addEventListener('click', () => {
    const address = input.value.trim();
    if (!address) {
      alert('Please enter an address');
      return;
    }

    if (typeof gtag !== 'undefined') gtag('event', 'polling_place_searched');

    // Due to iframe / Google Maps API requirements, we will simulate the map embed if no key is present.
    // In a real scenario, you would initialize the Google Maps JS API here.
    container.innerHTML = `
      <div style="background: rgba(0,0,0,0.2); padding: 2rem; text-align: center; border-radius: var(--radius-md);">
        <h4>Mock Map Rendered</h4>
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
  });
}
