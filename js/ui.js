(function () {
  const body = document.body;
  const depth = body.dataset.depth || '.';
  const root = depth === '.' ? '.' : depth;

  const navLinks = [
    { href: `${root}/index.html`, label: 'Home' },
    { href: `${root}/reports.html`, label: 'Reports' },
    { href: `${root}/museum.html`, label: 'Museum' },
    { href: `${root}/guide.html`, label: 'Guide' },
    { href: `${root}/anchors.html`, label: 'Anchors' },
    { href: `${root}/founder.html`, label: 'Founder' },
    { href: `${root}/contact.html`, label: 'Contact' }
  ];

  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="container nav-wrap">
      <a href="${root}/index.html" class="brand" aria-label="Homepage">
        <span class="brand-cn">沈耀國際實相新聞台 × 責任博物館</span>
        <span class="brand-en">Shen-Yao International Reality News Network × Responsibility Museum</span>
      </a>
      <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button>
      <nav class="main-nav" aria-label="Main Navigation">
        ${navLinks
          .map(
            (item) => `<a href="${item.href}" class="${item.href.endsWith(currentFile) ? 'active' : ''}">${item.label}</a>`
          )
          .join('')}
        <a class="official-btn" href="https://hijo790401.github.io/shen-yao-portal/" target="_blank" rel="noopener noreferrer">Official Portal</a>
      </nav>
    </div>
  `;

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="container footer-grid">
      <div>
        <h3>平台簡介 | Platform</h3>
        <p>結合國際新聞台、責任審計報導與數位館藏導覽的公共界面。</p>
      </div>
      <div>
        <h3>Founder</h3>
        <p>許文耀／沈耀888π</p>
        <p>Email: <a href="mailto:ken0963521@gmail.com">ken0963521@gmail.com</a></p>
      </div>
      <div>
        <h3>External Link</h3>
        <a class="official-btn" href="https://hijo790401.github.io/shen-yao-portal/" target="_blank" rel="noopener noreferrer">官方網站 Official Portal</a>
      </div>
    </div>
    <div class="container footer-base">
      <small>© <span id="year"></span> 沈耀國際實相新聞台 × 責任博物館 | All Rights Reserved.</small>
    </div>
  `;

  document.body.prepend(header);
  document.body.appendChild(footer);

  const toggle = header.querySelector('.nav-toggle');
  const nav = header.querySelector('.main-nav');
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
