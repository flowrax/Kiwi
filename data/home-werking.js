// ==============================================
// HOME PAGINA SCRIPT
// ==============================================

window.addEventListener('DOMContentLoaded', () => {

  // -----------------------------
  // Blogcards: laatste 3 blogs
  // -----------------------------
  const homeBlogContainer = document.getElementById('homeBlogs');
  if (homeBlogContainer && window.blogs && Array.isArray(window.blogs)) {
    const sortedBlogs = window.blogs.slice().sort((a,b) => new Date(b.date.split('-').reverse().join('-')) - new Date(a.date.split('-').reverse().join('-')));
    const latest3 = sortedBlogs.slice(0,3);

    latest3.forEach(blog => {
      const card = document.createElement('div');
      card.className = 'blog-card';
      card.innerHTML = `
        <img src="${blog.image}" alt="${blog.title}">
        <h3>${blog.title}</h3>
        <p>${blog.description}</p>
      `;
      card.addEventListener('click', () => {
        window.location.href = `blog-post.html?id=${encodeURIComponent(blog.id)}`;
      });
      homeBlogContainer.appendChild(card);
    });
  }

  // -----------------------------
  // Counters: automatisch aantal blogs en landen
  // -----------------------------
  const totalBlogs = window.blogs ? window.blogs.length : 0;
  const countries = window.blogs ? [...new Set(window.blogs.map(b => b.land || b.country).filter(Boolean))] : [];
  const totalCountries = countries.length;

  function animateCounter(counterEl, target) {
    let current = 0;
    const increment = Math.ceil(target / 200);
    const countEl = counterEl.querySelector('.count');

    function update() {
      current = Math.min(current + increment, target);
      countEl.innerText = current;
      if (current < target) requestAnimationFrame(update);
    }

    update();
  }

  animateCounter(document.getElementById('counterBlogs'), totalBlogs);
  animateCounter(document.getElementById('counterLanden'), totalCountries);

  // -----------------------------
  // Hero animaties
  // -----------------------------
  const heroTitle = document.querySelector('.hero h1');
  const heroText = document.querySelector('.hero p');
  const heroBtn = document.querySelector('.hero .btn');

  [heroTitle, heroText, heroBtn].forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(50px)';
    setTimeout(() => {
      el.style.transition = 'all 1s ease';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, i * 500);
  });

  // -----------------------------
  // Shapes float animatie
  // -----------------------------
  const shapes = document.querySelectorAll('.shape');
  shapes.forEach((shape, i) => {
    const delay = i * 0.5;
    let pos = 0;
    let direction = 1;
    function floatShape() {
      pos += direction * 0.2;
      if (pos > 20 || pos < -20) direction *= -1;
      shape.style.transform = `translateY(${pos}px)`;
      requestAnimationFrame(floatShape);
    }
    setTimeout(floatShape, delay * 1000);
  });

  // -----------------------------
  // Sparkle animatie
  // -----------------------------
  const sparkles = document.querySelectorAll('.sparkle');
  sparkles.forEach((spark, i) => {
    const delay = i * 0.5;
    function sparkleAnim() {
      const scale = Math.random() * 0.7 + 0.5;
      const opacity = Math.random();
      spark.style.transform = `scale(${scale})`;
      spark.style.opacity = opacity;
      setTimeout(sparkleAnim, 500 + Math.random() * 500);
    }
    setTimeout(sparkleAnim, delay * 1000);
  });

  // -----------------------------
  // COUNTRY OVERLAY
  // -----------------------------
  const countryOverlay = document.getElementById('countryOverlay');
  const countryTiles = document.getElementById('countryTiles');

  if (countryOverlay && countryTiles && countries.length) {
    // Maak tiles
    countries.forEach(country => {
      const tile = document.createElement('div');
      tile.className = 'country-tile show';
      tile.style.backgroundImage = `url('img/landen/${country}.png')`;
      tile.innerHTML = `<span>${country}</span>`;
      tile.addEventListener('click', () => {
        window.location.href = `blog.html?land=${encodeURIComponent(country)}`;
      });
      countryTiles.appendChild(tile);
    });

    // Open overlay via knop
    const landenBtn = document.createElement('button');
    landenBtn.innerText = 'Bekijk landen';
    landenBtn.className = 'btn';
    landenBtn.style.margin = '20px auto';
    landenBtn.style.display = 'block';
    landenBtn.addEventListener('click', () => {
      countryOverlay.style.display = 'flex';
      setTimeout(() => countryOverlay.style.opacity = 1, 20);
    });

    document.querySelector('.counters').after(landenBtn);

    // Sluit overlay als je buiten klikt
    countryOverlay.addEventListener('click', (e) => {
      if (e.target === countryOverlay) {
        countryOverlay.style.opacity = 0;
        setTimeout(() => countryOverlay.style.display = 'none', 300);
      }
    });
  }

});
