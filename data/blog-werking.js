// ==============================================
// BLOG PAGINA SCRIPT
// ==============================================

window.addEventListener('load', () => {

  // ---------------------------
  // Algemene bloglijst pagina
  // ---------------------------
  const grid = document.getElementById('blogGrid');
  const btnDate = document.getElementById('sortDate');
  const btnCountry = document.getElementById('sortCountryBtn');
  const overlay = document.getElementById('countryOverlay');
  const countryTiles = document.getElementById('countryTiles');
  const searchInput = document.getElementById('searchInput');
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  let visibleBlogs = 6; // aantal blogs dat initieel zichtbaar is

  function escapeHtml(text) {
    return text.replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  function parseDate(dateStr) {
    return new Date(dateStr.split('-').reverse().join('-'));
  }

  // ---------------------------
  // Render blogs functie (voor volledige lijst)
  // ---------------------------
  function renderBlogs(list) {
    if(!grid) return;
    grid.innerHTML = '';

    list.forEach((blog, i) => {
      const blogCard = document.createElement('div');
      blogCard.className = 'blog-card fade-up';
      blogCard.style.animationDelay = `${i*0.08}s`;
      blogCard.dataset.index = i;
      blogCard.dataset.country = blog.land || blog.country;

      blogCard.innerHTML = `
  <a href="blog-post.html?id=${encodeURIComponent(blog.id)}">
    <div class="img-wrap">
      <img src="${blog.image}" alt="${escapeHtml(blog.title)}">
      <div class="blog-title">${escapeHtml(blog.title)}</div>
    </div>
  </a>
  <div class="blog-content">
    <p>${blog.description}</p>
  </div>
`;

      grid.appendChild(blogCard);
    });

    showBlogs(); // initialiseer paginering
  }

  // ---------------------------
  // Toon alleen visibleBlogs en verberg de rest
  // ---------------------------
  function showBlogs() {
    const allBlogs = document.querySelectorAll('#blogGrid .blog-card');
    allBlogs.forEach((blog, index) => {
      blog.style.display = index < visibleBlogs ? '' : 'none';
    });
    loadMoreBtn.style.display = visibleBlogs >= allBlogs.length ? 'none' : 'block';
  }

  if(grid && (!window.blogs || !Array.isArray(window.blogs))){
    grid.innerHTML = '<p>Er zijn nog geen blogs.</p>';
  }

  // Init sorteren op datum
  let dateAsc = false;
  if(grid){
    renderBlogs(window.blogs.slice().sort((a,b) => parseDate(b.date)-parseDate(a.date)));

    btnDate.addEventListener('click', () => {
      const sorted = window.blogs.slice().sort((a,b) => dateAsc
        ? parseDate(a.date)-parseDate(b.date)
        : parseDate(b.date)-parseDate(a.date)
      );
      dateAsc = !dateAsc;
      renderBlogs(sorted);
    });

    // Landen overlay
    function renderCountryTiles() {
      const countries = [...new Set(window.blogs.map(b => b.land || b.country).filter(Boolean))].sort();
      countryTiles.innerHTML = '';
      countries.forEach(country => {
        const tile = document.createElement('div');
        tile.className = 'country-tile show';
        tile.style.backgroundImage = `url('img/landen/${country}.png')`;
        tile.innerHTML = `<span>${country}</span>`;
        tile.addEventListener('click', () => {
          renderBlogs(window.blogs.filter(b => (b.land||b.country)===country));
          overlay.style.display = 'none';
        });
        countryTiles.appendChild(tile);
      });
    }
    btnCountry.addEventListener('click', () => { renderCountryTiles(); overlay.style.display='flex'; });
    overlay.addEventListener('click', e => { if(e.target===overlay) overlay.style.display='none'; });

    // ---------------------------
    // Meer laden knop
    // ---------------------------
    loadMoreBtn.addEventListener('click', () => {
      visibleBlogs += 6;
      showBlogs();
    });

    // ---------------------------
    // Zoekfunctie
    // ---------------------------
    searchInput.addEventListener('input', function() {
      const filter = this.value.toLowerCase();
      const allBlogs = document.querySelectorAll('#blogGrid .blog-card');

      allBlogs.forEach((blog, index) => {
        const title = blog.querySelector('.blog-title').textContent.toLowerCase();
        blog.style.display = title.includes(filter) ? '' : 'none';
      });
    });
  }

  // ---------------------------
  // Specifieke blog-post pagina
  // ---------------------------
  const postContainer = document.getElementById('postContainer');
  if(postContainer && window.blogs){

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const post = window.blogs.find(b => b.id === id);
    if(!post){ postContainer.innerHTML='<h1>Blog niet gevonden</h1>'; return; }

    const index = window.blogs.findIndex(b => b.id===id);
    const nextBlog = index<window.blogs.length-1 ? window.blogs[index+1] : null;
    const prevBlog = index>0 ? window.blogs[index-1] : null;

    function renderPhotoSlider(post){
      if(!post.photos || post.photos.length===0) return '';
      return `
        <div class="swiper blog-images">
          <div class="swiper-wrapper">
            ${post.photos.map(file => `
              <div class="swiper-slide">
                <a href="${file}" class="glightbox">
                  <img src="${file}" alt="${escapeHtml(post.title)}">
                </a>
              </div>
            `).join('')}
          </div>
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-pagination"></div>
        </div>
      `;
    }

    postContainer.innerHTML = `
      <article class="post">
        <header class="blog-hero">
          <img src="${post.image}" alt="${escapeHtml(post.title)}">
          <div class="blog-hero-overlay">
            <h1>${escapeHtml(post.title)}</h1>
            <p>${post.date}</p>
          </div>
        </header>
        <div class="post-body">
          ${post.content}
          ${renderPhotoSlider(post)}
        </div>
       <div class="blog-navigation">
  <div class="nav-left">
    ${prevBlog ? `<a href="blog-post.html?id=${prevBlog.id}" class="btn prev-btn">← Vorige</a>` : ''}
  </div>

  <div class="nav-center">
    <a href="blog.html" class="btn back-btn">Terug naar blogs</a>
  </div>

  <div class="nav-right">
    ${nextBlog ? `<a href="blog-post.html?id=${nextBlog.id}" class="btn next-btn">Volgende →</a>` : ''}
  </div>
</div>
    `;

    // ---------------------------
    // Nieuw: navigatie uitlijnen links/midden/rechts
    // ---------------------------
    const blogNav = document.querySelector('.blog-navigation');
    if(blogNav){
      blogNav.style.display = 'grid';
      blogNav.style.gridTemplateColumns = '1fr auto 1fr';
      blogNav.style.alignItems = 'center';
      blogNav.style.marginTop = '3rem';
      
      const navLeft = blogNav.querySelector('.nav-left');
      const navCenter = blogNav.querySelector('.nav-center');
      const navRight = blogNav.querySelector('.nav-right');

      if(navLeft) navLeft.style.display = 'flex';
      if(navCenter) navCenter.style.display = 'flex';
      if(navRight) navRight.style.display = 'flex';

      if(navLeft) navLeft.style.justifyContent = 'flex-start';
      if(navCenter) navCenter.style.justifyContent = 'center';
      if(navRight) navRight.style.justifyContent = 'flex-end';
    }

    const swiper = new Swiper('.blog-images', {
      slidesPerView: 4,
      spaceBetween: 14,
      loop: false,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        1200: { slidesPerView: 4 },
        900:  { slidesPerView: 3 },
        600:  { slidesPerView: 2 },
        400:  { slidesPerView: 1.2 }
      }
    });

    lightbox.reload();
  }

});
