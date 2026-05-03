/**
 * search.js — Handles global election resource searching
 */

let currentFilter = 'all';

/**
 * Sets the active category filter for search
 * @param {HTMLElement} btn - The clicked button element
 * @param {string} filter - The filter category name
 */
function setFilter(btn, filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
}

/**
 * Executes the search against the API and renders results
 */
async function runSearch() {
  const queryInput = document.getElementById('search-input');
  const q = queryInput.value.trim();
  if (q.length < 2) {
    return;
  }

  const status = document.getElementById('search-status');
  const resultsContainer = document.getElementById('search-results');
  status.textContent = 'Searching...';
  resultsContainer.innerHTML = '';

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&filter=${encodeURIComponent(currentFilter)}`);
    const data = await res.json();
    status.textContent = '';

    if (!data.items || data.items.length === 0) {
      status.textContent = 'No results found. Try a different search term.';
      return;
    }

    renderSearchResults(data.items, resultsContainer);
  } catch (error) {
    status.textContent = 'Search failed. Please try again.';
    console.error('Search Client Error:', error);
  }
}

/**
 * Renders search result cards to the container
 * @param {Array} items - List of search result items
 * @param {HTMLElement} container - The container element to render into
 */
function renderSearchResults(items, container) {
  items.forEach((item) => {
    const card = document.createElement('a');
    card.href = item.link;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = 'search-result-card';
    card.style.cssText = 'text-decoration:none; display:block; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; transition:box-shadow 0.2s; color:inherit; margin-bottom:12px;';
    
    card.innerHTML = `
      ${item.thumbnail ? `<img src="${item.thumbnail}" alt="" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:12px;">` : ''}
      <div style="font-size:12px;color:#64748b;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">${item.source}</div>
      <h4 style="margin:0 0 8px 0;color:#1e3a8a;font-size:16px;">${item.title}</h4>
      <p style="margin:0;color:#475569;font-size:14px;line-height:1.5;">${item.snippet}</p>
    `;
    
    card.onmouseenter = () => { card.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; };
    card.onmouseleave = () => { card.style.boxShadow = 'none'; };
    container.appendChild(card);
  });
}

/**
 * Initializes the search module events
 */
export function initSearch() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  
  if (!searchBtn || !searchInput) {
    return;
  }

  searchBtn.addEventListener('click', runSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runSearch();
    }
  });

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => setFilter(btn, btn.dataset.filter));
  });
}
