window.addEventListener('load', () => {
  const grid = document.getElementById('blogGrid');
  const btnDate = document.getElementById('sortDate');
  const btnCountry = document.getElementById('sortCountryBtn');

  // Maak overlay container voor landen
  const countryOverlay = document.createElement('div');
  countryOverlay.id = 'countryOverlay';
  countryOverlay.style.display = 'none';
  countryOverlay.style.position = 'fixed';
  countryOverlay.style.top = 0;
  countryOverlay.style.left = 0;
  countryOverlay.style.width = '100%';
  countryOverlay.style.height = '100%';
  countryOverlay.style.background = 'rgba(0,0,0,0.6)';
  countryOverlay.style.justifyContent = 'center';
  countryOverlay.style.alignItems = 'center';
  countryOverlay.style.zIndex = '1000';
  countryOverlay.style.overflowY = 'auto';
  countryOverlay.style.padding = '40px';
  countryOverlay.style.boxSizing = 'border-box';
  countryOverlay.style.display = 'flex';
  countryOverlay.style.flexDirection = 'column';
  countryOverlay.style.alignItems = 'center';
  document.body.appendChild(countryOverlay);

  // Tegels container
  const countryTiles = document.createElement('div');
  countryTiles.style.display = 'grid';
  countryTiles.style.gridTemplateColumns = 'repeat(auto-fit,minmax(120px,1fr))';
  countryTiles.style.gap = '16px';
  countryTiles.style.maxWidth = '900px';
  countryTiles.style.width = '100%';
  countryOverlay.appendChild(countryTiles);

  if (!window.blogs || !Array.isArray(window.blogs)) {
    grid.innerHTML = '<p>Er zijn nog geen blogs.</p>';
    return;
  }

  function escapeHtml(text) {
    return text.replace(/[&<>\"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  function renderBlogs(blogArray){
    grid.innerHTML = '';
    blogArray.forEach((blog,i)=>{
      const a = document.createElement('a');
      a.className = 'blog-item fade-up';
      a.style.animationDelay = `${i*0.08}s`;
      a.href = `blog-post.html?id=${encodeURIComponent(blog.id)}`;
      a.innerHTML = `
        <div class="img-wrap">
          <img src="${blog.image}" alt="${escapeHtml(blog.title)}">
          <div class="blog-title">${escapeHtml(blog.title)}</div>
        </div>`;
      grid.appendChild(a);
    });
  }

  // Initial render: datum nieuw -> oud
  let dateAsc = false;
  renderBlogs(window.blogs.slice().sort((a,b)=>{
    const partsA = a.date.split('-').reverse().join('-');
    const partsB = b.date.split('-').reverse().join('-');
    return new Date(partsB) - new Date(partsA);
  }));

  // Sorteren op datum
  btnDate.addEventListener('click', () => {
    const sorted = window.blogs.slice().sort((a,b)=>{
      const aDate = new Date(a.date.split('-').reverse().join('-'));
      const bDate = new Date(b.date.split('-').reverse().join('-'));
      return dateAsc ? aDate - bDate : bDate - aDate;
    });
    dateAsc = !dateAsc;
    renderBlogs(sorted);
  });

  // Dynamische landenlijst
  const countries = [...new Set(window.blogs.map(b => b.land || b.country).filter(Boolean))].sort();

  // Bouw automatisch tegels van alle landen
  function renderCountryTiles() {
    countryTiles.innerHTML = ''; // reset
    countries.forEach((country, i) => {
      const tile = document.createElement('div');
      tile.className = 'country-tile';
      tile.style.backgroundImage = `url('img/landen/${country}.png')`;
      tile.innerHTML = `<span>${country}</span>`;
      tile.addEventListener('click', () => {
        const filtered = window.blogs.filter(b => (b.land || b.country) === country);
        renderBlogs(filtered);
        countryOverlay.style.display = 'none';
      });
      countryTiles.appendChild(tile);

      // Animatie: pop-in effect
      setTimeout(() => tile.classList.add('show'), i * 100);
    });
  }

  // Open overlay bij klikken op knop
  btnCountry.addEventListener('click', () => {
    renderCountryTiles(); // bouw tegels dynamisch
    countryOverlay.style.display = 'flex';
  });

  // Sluit overlay als je buiten tegels klikt
  countryOverlay.addEventListener('click', (e) => {
    if(e.target === countryOverlay) countryOverlay.style.display = 'none';
  });

  // -------------------------
  // Dropdown menu voor "Over"
  // -------------------------
  const dropdowns = document.querySelectorAll('.nav-links .dropdown');

  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    const menu = dropdown.querySelector('.dropdown-menu');

    // Hover effect (desktop)
    dropdown.addEventListener('mouseenter', () => {
      if(menu) menu.style.display = 'block';
    });
    dropdown.addEventListener('mouseleave', () => {
      if(menu) menu.style.display = 'none';
    });

    // Klik effect (mobiel)
    link.addEventListener('click', (e) => {
      if(menu){
        e.preventDefault();
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
      }
    });
  });
});
