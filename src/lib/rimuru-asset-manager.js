import fs from 'fs';
import path from 'path';
import axios from 'axios';
import https from 'https';
import { logger } from './rimuru-logger.js';
import config from '../../config.js';

// Memory cache for both local and remote assets.
const assetCache = Object.create(null);
const remoteCache = new Map();

function isRemoteUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

const httpsAgent = new https.Agent({
  family: 4,
  keepAlive: true,
});

const RETRYABLE_ERRORS = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'EAI_AGAIN',
  'ENETUNREACH',
  'EHOSTUNREACH',
]);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function requestRemoteBuffer(url, timeout) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout,
    maxContentLength: 50 * 1024 * 1024,
    maxBodyLength: 50 * 1024 * 1024,
    proxy: false,
    httpsAgent,
    headers: { 'User-Agent': 'Mozilla/5.0 Rimuru-MD AssetLoader' },
    validateStatus: status => status >= 200 && status < 300,
  });

  return Buffer.from(response.data);
}

async function fetchRemoteBuffer(url, timeout = 30000) {
  if (!isRemoteUrl(url)) return null;
  if (remoteCache.has(url)) return remoteCache.get(url);

  let lastError;

  // Direct request first. Retries handle transient Catbox/DNS/socket failures.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const buffer = await requestRemoteBuffer(url, timeout);
      remoteCache.set(url, buffer);
      return buffer;
    } catch (e) {
      lastError = e;
      const code = e?.code || e?.cause?.code;
      if (!RETRYABLE_ERRORS.has(code) && attempt === 0) break;
      if (attempt < 2) await sleep(750 * (attempt + 1));
    }
  }

  // Image-only fallback: let a public image proxy fetch the original URL.
  // This keeps the configured asset URL unchanged and only activates when
  // the origin itself cannot be reached from the bot host.
  if (/^https?:\/\/files\.catbox\.moe\//i.test(url) &&
      /\.(?:jpe?g|png|webp|gif)(?:\?.*)?$/i.test(url)) {
    const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(url)}`;
    try {
      const buffer = await requestRemoteBuffer(proxyUrl, timeout);
      remoteCache.set(url, buffer);
      return buffer;
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError || new Error('Remote asset request failed');
}

/**
 * Preload all configured single-file assets into memory. Remote URLs are fetched
 * once at startup so existing synchronous consumers can keep receiving Buffers.
 */
export async function preloadAssets(configAssets) {
  if (!configAssets) return;

  const entries = Object.entries(configAssets);
  for (const [key, value] of entries) {
    try {
      if (typeof value === 'string' && isRemoteUrl(value)) {
        const buffer = await fetchRemoteBuffer(value);
        if (buffer) {
          assetCache[key] = buffer;
          logger.system('CACHE', `Loaded remote: ${key}`);
        }
        continue;
      }

      if (typeof value === 'string') {
        const fullPath = path.resolve(process.cwd(), value);
        if (fs.existsSync(fullPath)) {
          assetCache[key] = fs.readFileSync(fullPath);
          logger.system('CACHE', `Loaded: ${key}`);
        } else {
          logger.warn('CACHE', `File not found: ${fullPath}`);
        }
      }
    } catch (e) {
      logger.error('CACHE', `Failed to load ${key}: ${e.message}`);
    }
  }
}

/**
 * Get the cached asset buffer by key. Local assets are loaded synchronously;
 * remote assets are expected to have been preloaded by preloadAssets().
 */
export function getAssetBuffer(key, configAssets = null) {
  if (assetCache[key]) return assetCache[key];

  const assets = configAssets || config?.assets;
  const value = assets?.[key];
  if (isRemoteUrl(value)) {
    // A remote asset must be preloaded because this API is synchronous.
    return null;
  }

  if (typeof value === 'string') {
    try {
      const fullPath = path.resolve(process.cwd(), value);
      if (fs.existsSync(fullPath)) {
        const buf = fs.readFileSync(fullPath);
        assetCache[key] = buf;
        return buf;
      }
    } catch (e) {
      console.error(`  ✖  ERR   Failed to read ${key} from disk:`, e.message);
    }
  }

  return null;
}

/** Fetch an arbitrary asset URL with an in-memory cache. */
export async function getRemoteAssetBuffer(url) {
  return fetchRemoteBuffer(url);
}

/** Return a random shuffle image as a Buffer. */
export async function getRandomShuffleAssetBuffer(urls = config?.assets?.shuffleUrls) {
  if (!Array.isArray(urls) || urls.length === 0) return null;
  const url = urls[Math.floor(Math.random() * urls.length)];
  try {
    return await fetchRemoteBuffer(url);
  } catch (e) {
    logger.warn('SHUFFLE', `Failed to fetch remote shuffle image: ${e.message}`);
    return null;
  }
}

/**
 * Update an asset buffer in memory and optionally save it to disk.
 */
export function updateAssetAndSave(key, buffer, filepath) {
  assetCache[key] = buffer;
  if (filepath && !isRemoteUrl(filepath)) {
    try {
      const fullPath = path.resolve(process.cwd(), filepath);
      fs.writeFileSync(fullPath, buffer);
    } catch (e) {
      console.error(`  ✖  ERR   Failed to write updated asset ${key} to disk:`, e.message);
    }
  }
}
