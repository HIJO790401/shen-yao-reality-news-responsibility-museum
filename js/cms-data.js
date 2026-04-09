const CMS_REPO = 'HIJO790401/shen-yao-reality-news-responsibility-museum';
const CMS_BRANCH = 'main';

async function fetchFolderEntries(folder) {
  const api = `https://api.github.com/repos/${CMS_REPO}/contents/${folder}?ref=${CMS_BRANCH}`;
  const res = await fetch(api);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const items = await res.json();
  return items.filter((i) => i.type === 'file' && i.name.endsWith('.md'));
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.text();
}

function parseFrontMatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: markdown };
  const yaml = match[1];
  const body = match[2] || '';
  const data = {};
  let currentKey = null;
  let buffer = [];

  const flushBuffer = () => {
    if (currentKey) {
      data[currentKey] = buffer.join('\n').trimEnd();
      currentKey = null;
      buffer = [];
    }
  };

  yaml.split('\n').forEach((line) => {
    if (/^\s*$/.test(line)) {
      if (currentKey) buffer.push('');
      return;
    }

    const blockMatch = line.match(/^([a-zA-Z0-9_]+):\s*([>|])([+-])?\s*$/);
    if (blockMatch) {
      flushBuffer();
      currentKey = blockMatch[1];
      return;
    }

    if (currentKey) {
      if (/^\s{2,}/.test(line)) {
        buffer.push(line.replace(/^\s{2}/, ''));
        return;
      }
      flushBuffer();
    }

    const kvMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kvMatch) {
      data[kvMatch[1]] = kvMatch[2].replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    }
  });

  flushBuffer();
  return { data, body };
}

function textToHtml(text = '') {
  return text
    .split('\n\n')
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function normalizeSlug(value = '') {
  return String(value || '').trim().replace(/\.md$/i, '');
}

function entrySlug(entry = {}) {
  if (entry.slug) return normalizeSlug(entry.slug);
  if (entry._file) return normalizeSlug(entry._file);
  return '';
}

function youtubeEmbed(url = '') {
  if (!url) return '';
  const clean = String(url).trim();

  const shortsMatch = clean.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;

  const watchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortLinkMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortLinkMatch) return `https://www.youtube.com/embed/${shortLinkMatch[1]}`;

  const embedMatch = clean.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return `https://www.youtube.com/embed/${embedMatch[1]}`;

  return '';
}

async function loadCollection(folder) {
  const entries = await fetchFolderEntries(folder);
  const results = await Promise.all(
    entries.map(async (entry) => {
      const text = await fetchText(entry.download_url);
      const parsed = parseFrontMatter(text);
      return { ...parsed.data, markdown_body: parsed.body, _file: entry.name };
    })
  );
  return results;
}

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Cannot load ${path}`);
  return res.json();
}
