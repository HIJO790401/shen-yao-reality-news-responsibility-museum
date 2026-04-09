const CMS_REPO = 'HIJO790401/shen-yao-reality-news-responsibility-museum';
const CMS_BRANCH = 'main';
const CACHE_TTL = 1000 * 60 * 5;

function cacheGet(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() - data.time > CACHE_TTL) return null;
    return data.value;
  } catch {
    return null;
  }
}

function cacheSet(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ time: Date.now(), value }));
  } catch {}
}

function setLoading(el, text = '資料載入中 Loading...') {
  if (!el) return;
  el.innerHTML = `<article class="card"><p>${text}</p></article>`;
}

function setError(el, text = '資料載入失敗，請稍後重試。Load failed, please retry.') {
  if (!el) return;
  el.innerHTML = `<article class="card alert"><p>${text}</p></article>`;
}

async function fetchFolderEntries(folder) {
  const cacheKey = `entries:${folder}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;
  const api = `https://api.github.com/repos/${CMS_REPO}/contents/${folder}?ref=${CMS_BRANCH}`;
  const res = await fetch(api);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const items = (await res.json()).filter((i) => i.type === 'file' && i.name.endsWith('.md'));
  cacheSet(cacheKey, items);
  return items;
}

async function fetchText(url) {
  const cacheKey = `text:${url}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  const text = await res.text();
  cacheSet(cacheKey, text);
  return text;
}

function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: markdown };
  const yaml = match[1];
  const body = match[2] || '';
  const data = {};
  let currentKey = null;
  let buffer = [];

  const flush = () => {
    if (currentKey) {
      data[currentKey] = buffer.join('\n').trim();
      currentKey = null;
      buffer = [];
    }
  };

  yaml.split('\n').forEach((line) => {
    if (/^\s*$/.test(line)) {
      if (currentKey) buffer.push('');
      return;
    }
    const block = line.match(/^([a-zA-Z0-9_]+):\s*\|\s*$/);
    if (block) {
      flush();
      currentKey = block[1];
      return;
    }
    if (currentKey) {
      buffer.push(line.replace(/^\s{2}/, ''));
      return;
    }
    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].replace(/^"|"$/g, '').replace(/^'|'$/g, '');
  });
  flush();
  return { data, body };
}

function textToHtml(text = '') {
  return text
    .split('\n\n')
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function youtubeEmbed(url = '') {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : '';
}

async function loadCollection(folder) {
  const cacheKey = `collection:${folder}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;
  const entries = await fetchFolderEntries(folder);
  const results = await Promise.all(entries.map(async (entry) => {
    const text = await fetchText(entry.download_url);
    const parsed = parseFrontMatter(text);
    return {
      ...parsed.data,
      markdown_body: parsed.body,
      _file: entry.name,
      _slug: parsed.data.slug || entry.name.replace(/\.md$/, '')
    };
  }));
  cacheSet(cacheKey, results);
  return results;
}

async function loadBySlug(folder, slug) {
  const items = await loadCollection(folder);
  return items.find((i) => (i.slug || i._slug) === slug || i.id === slug) || null;
}

async function loadJson(path) {
  const cacheKey = `json:${path}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Cannot load ${path}`);
  const json = await res.json();
  cacheSet(cacheKey, json);
  return json;
}
