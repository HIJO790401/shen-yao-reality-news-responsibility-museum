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

    const blockMatch = line.match(/^([a-zA-Z0-9_]+):\s*\|\s*$/);
    if (blockMatch) {
      flushBuffer();
      currentKey = blockMatch[1];
      return;
    }

    if (currentKey) {
      buffer.push(line.replace(/^\s{2}/, ''));
      return;
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

function youtubeEmbed(url = '') {
  if (!url) return '';
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  if (!m) return '';
  return `https://www.youtube.com/embed/${m[1]}`;
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
