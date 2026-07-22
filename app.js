const sampleProducts = [
  {id:1,name:'Classic White Sneakers',category:'Shoes',price:59.99,image:''},
  {id:2,name:'Running Pro Shoes',category:'Shoes',price:89.00,image:''},
  {id:3,name:'Slim Fit Jeans',category:'Clothing',price:49.5,image:''},
  {id:4,name:'Cotton T-Shirt',category:'Clothing',price:19.99,image:''},
  {id:5,name:'Wireless Headphones',category:'Electronics',price:129.99,image:''},
  {id:6,name:'Smartwatch Series 5',category:'Electronics',price:199.99,image:''},
  {id:7,name:'Coffee Mug - Ceramic',category:'Home',price:12.0,image:''},
  {id:8,name:'LED Desk Lamp',category:'Home',price:35.5,image:''},
  {id:9,name:'Leather Wallet',category:'Accessories',price:39.0,image:''},
  {id:10,name:'Sunglasses UV400',category:'Accessories',price:24.0,image:''},
  {id:11,name:'Yoga Mat 6mm',category:'Sports',price:29.99,image:''},
  {id:12,name:'Resistance Bands Set',category:'Sports',price:15.0,image:''}
];

const state = {
  query: '',
  category: 'All',
  sort: 'relevance',
  results: sampleProducts,
  focusedIndex: -1
};

// Global handles initialized securely upon DOM availability
let searchInput, resultsEl, categoryListEl, sortSelect;

function init() {
  renderCategories();
  applyFilters();
  attachListeners();
}

function uniqueCategories() {
  const cats = Array.from(new Set(sampleProducts.map(p => p.category))).sort();
  return ['All', ...cats];
}

function renderCategories() {
  const cats = uniqueCategories();
  categoryListEl.innerHTML = '';
  
  cats.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat;
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    if (cat === state.category) li.classList.add('active');
    
    li.addEventListener('click', () => { 
      state.category = cat; 
      state.focusedIndex = -1; 
      renderCategories(); 
      applyFilters(); 
    });
    
    li.addEventListener('keydown', (e) => { 
      if (e.key === 'Enter') { li.click(); } 
    });
    
    categoryListEl.appendChild(li);
  });
}

function applyFilters() {
  const q = state.query.trim().toLowerCase();
  let filtered = sampleProducts.filter(p => {
    if (state.category !== 'All' && p.category !== state.category) return false;
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || (p.category && p.category.toLowerCase().includes(q));
  });

  if (state.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  else if (state.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);

  state.results = filtered;
  state.focusedIndex = -1;
  renderResults();
}

function renderResults() {
  resultsEl.innerHTML = '';
  if (state.results.length === 0) {
    resultsEl.innerHTML = '<div class="result-empty">No products found.</div>';
    return;
  }

  state.results.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.dataset.index = idx;

    const img = document.createElement('img');
    img.alt = p.name;
    img.src = generatePlaceholder(p.name, idx);

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = p.name;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = p.category;

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = '$' + p.price.toFixed(2);

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(price);

    card.addEventListener('click', () => { 
      alert(`Open product: ${p.name} (id: ${p.id})`); 
    });
    
    card.addEventListener('focus', () => { 
      setFocusedIndex(idx); 
    });

    resultsEl.appendChild(card);
  });
}

function setFocusedIndex(i) {
  const cards = resultsEl.querySelectorAll('.card');
  cards.forEach(c => c.classList.remove('focused'));
  
  if (i >= 0 && i < cards.length) {
    cards[i].classList.add('focused');
    cards[i].focus();
    state.focusedIndex = i;
  } else {
    state.focusedIndex = -1;
    searchInput.focus();
  }
}

function attachListeners() {
  let debounceTimer = null;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.query = e.target.value;
      applyFilters();
    }, 300);
  });

  sortSelect.addEventListener('change', (e) => { 
    state.sort = e.target.value; 
    applyFilters(); 
  });

  document.addEventListener('keydown', (e) => {
    const cards = resultsEl.querySelectorAll('.card');
    if (cards.length === 0) return;

    // Prevents keystrokes inside search box from accidentally breaking focus context
    if (document.activeElement === searchInput) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(state.focusedIndex + 1, cards.length - 1);
      setFocusedIndex(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = state.focusedIndex - 1;
      if (prev < 0) {
        setFocusedIndex(-1); // Seamlessly return focus to search bar
      } else {
        setFocusedIndex(prev);
      }
    } else if (e.key === 'Enter') {
      if (state.focusedIndex >= 0 && state.focusedIndex < state.results.length) {
        e.preventDefault();
        const p = state.results[state.focusedIndex];
        alert(`Open product: ${p.name} (id: ${p.id})`);
      }
    }
  });
}

function generatePlaceholder(text, idx) {
  const colors = ['#fee2e2', '#e0f2fe', '#ecfdf5', '#fff7ed', '#fef3c7', '#ede9fe'];
  const bg = colors[idx % colors.length];
  const initials = text.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='48' font-weight='bold' fill='%23666'>${initials}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Ensure DOM tree initialization safety guard
document.addEventListener('DOMContentLoaded', () => {
  searchInput = document.getElementById('search-input');
  resultsEl = document.getElementById('results');
  categoryListEl = document.getElementById('category-list');
  sortSelect = document.getElementById('sort-select');

  if (!searchInput || !resultsEl || !categoryListEl || !sortSelect) {
    console.error("Initialization Error: HTML DOM nodes are missing or improperly assigned.");
    return;
  }
  
  init();
});