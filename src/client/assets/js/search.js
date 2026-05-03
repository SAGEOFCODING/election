let currentFilter = 'all';

function setFilter(btn, filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

async function runSearch() {
  const q = document.getElementById('search-input').value.trim();
  if (q.length < 2) return;
  const status = document.getElementById('search-status');
  const results = document.getElementById('search-results');
  status.textContent = 'Searching...';
  results.innerHTML = '';
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&filter=${encodeURIComponent(currentFilter)}`);
    const data = await res.json();
    status.textContent = '';
    if (!data.items || data.items.length === 0) {
      status.textContent = 'No results found. Try a different search term.';
      return;
    }
    data.items.forEach(item => {
      const card = document.createElement('a');
      card.href = item.link;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.style.cssText = 'text-decoration:none; display:block; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; transition:box-shadow 0.2s; color:inherit;';
      card.onmouseenter = () => card.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
      card.onmouseleave = () => card.style.boxShadow = 'none';
      card.innerHTML = `
        ${item.thumbnail ? `<img src="${item.thumbnail}" alt="" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:12px;">` : ''}
        <div style="font-size:12px;color:#64748b;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">${item.source}</div>
        <h4 style="margin:0 0 8px 0;color:#1e3a8a;font-size:16px;">${item.title}</h4>
        <p style="margin:0;color:#475569;font-size:14px;line-height:1.5;">${item.snippet}</p>
      `;
      results.appendChild(card);
    });
  } catch {
    status.textContent = 'Search failed. Please try again.';
  }
}

export function initSearch() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  
  if (!searchBtn || !searchInput) return;

  searchBtn.addEventListener('click', runSearch);
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') runSearch();
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn, btn.dataset.filter));
  });
}
