(function () {
  const body = document.body;
  const depth = body.dataset.depth || '.';
  const root = depth === '.' ? '.' : depth;

  const navLinks = [
    { href: `${root}/index.html`, label: '首頁 Home' },
    { href: `${root}/reports.html`, label: '報導 Reports' },
    { href: `${root}/museum.html`, label: '博物館 Museum' },
    { href: `${root}/guide.html`, label: '導覽 Guide' },
    { href: `${root}/anchors.html`, label: '主播 Anchors' },
    { href: `${root}/founder.html`, label: '創辦人 Founder' },
    { href: `${root}/contact.html`, label: '聯絡 Contact' }
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
          .map((item) => `<a href="${item.href}" class="${item.href.endsWith(currentFile) ? 'active' : ''}">${item.label}</a>`)
          .join('')}
        <a class="official-btn" href="https://hijo790401.github.io/shen-yao-portal/" target="_blank" rel="noopener noreferrer">官方網站 Official Portal</a>
      </nav>
    </div>
  `;

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="container footer-grid">
      <div>
        <h3>公共界面 Public Interface</h3>
        <p>本平台用於播報、審計、保存、回放與責任裁定，對外呈現文明級責任流程。</p>
      </div>
      <div>
        <h3>最終責任 Final Responsibility</h3>
        <p>沈耀888π／許文耀（Wen-Yao Hsu）</p>
        <p>Email: <a href="mailto:ken0963521@gmail.com">ken0963521@gmail.com</a></p>
      </div>
      <div>
        <h3>對外入口 External Portal</h3>
        <a class="official-btn" href="https://hijo790401.github.io/shen-yao-portal/" target="_blank" rel="noopener noreferrer">官方網站 Official Portal</a>
      </div>
    </div>
    <div class="container footer-base">
      <small>© <span id="year"></span> 沈耀國際實相新聞台 × 責任博物館 ｜ Public Responsibility Interface.</small>
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
