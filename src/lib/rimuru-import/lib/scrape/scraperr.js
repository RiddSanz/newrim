import fs from 'node:fs';
import path from 'node:path';

// Legacy quote data is optional. Missing or invalid files return null so the
// command handler can use its existing online fallback instead of crashing.
function readRandomQuote(filename, mapper) {
  try {
    const filePath = path.join(process.cwd(), 'database', filename);
    const raw = fs.readFileSync(filePath, 'utf8');
    const items = JSON.parse(raw);
    if (!Array.isArray(items) || items.length === 0) return null;
    const item = items[Math.floor(Math.random() * items.length)];
    return item && typeof item === 'object' ? mapper(item) : null;
  } catch {
    return null;
  }
}

async function quotesnime() {
  return readRandomQuote('quotesnime.json', item => ({
    quote: item.quote || item.message || '',
    character: item.character || '',
    anime: item.anime || '',
    episode: item.episode || '',
  }));
}

async function quotes() {
  return readRandomQuote('quote.json', item => ({
    quote: item.quote || item.message || '',
    by: item.by || item.author || '',
  }));
}

export default { quotesnime, quotes };
