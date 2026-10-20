// Helper untuk plugin yang mengambil tautan dari API (nftools, netprem).
// Mencari URL di mana pun posisinya dalam balasan API (string / JSON bersarang),
// lalu memetakan ke Android / PC / TV berdasarkan nama field-nya.

const URL_RE = /https?:\/\/[^\s"'<>\\]+/gi;
const trimUrl = (u) => String(u).replace(/[)\],.;]+$/, '');

function collect(node, keyPath, out, depth = 0) {
    if (depth > 6 || node == null) return;
    if (typeof node === 'string') {
        for (const m of node.match(URL_RE) || []) out.push({ key: keyPath, url: trimUrl(m) });
    } else if (Array.isArray(node)) {
        node.forEach((v, i) => collect(v, `${keyPath}[${i}]`, out, depth + 1));
    } else if (typeof node === 'object') {
        for (const [k, v] of Object.entries(node)) collect(v, keyPath ? `${keyPath}.${k}` : k, out, depth + 1);
    }
}

function parsePossibleJson(data) {
    if (typeof data !== 'string') return data;
    const t = data.trim();
    if (t.startsWith('{') || t.startsWith('[')) {
        try { return JSON.parse(t); } catch { /* biarkan sebagai teks */ }
    }
    return data;
}

export function extractLinks(rawData) {
    const data = parsePossibleJson(rawData);
    const found = [];
    collect(data, '', found);
    if (!found.length) return null;

    const pick = (re) => found.find((f) => re.test(f.key))?.url;
    const first = found[0].url;
    return {
        andro: pick(/andro|mobile|phone|hp|ponsel/i) || first,
        pc: pick(/\bpc\b|desktop|laptop|web|browser|komputer/i) || pick(/pc|desktop|laptop|web|browser/i) || first,
        tv: pick(/tv/i) || first,
    };
}

// Ambil pesan singkat dari API (misal "apikey invalid", "limit habis") untuk ditampilkan ke user.
export function extractApiMessage(rawData) {
    const data = parsePossibleJson(rawData);
    let msg = '';
    if (typeof data === 'string') msg = data;
    else if (data && typeof data === 'object') {
        msg = data.message || data.msg || data.error || data.status_message ||
            (typeof data.result === 'string' ? data.result : '') ||
            data.result?.message || data.data?.message || '';
        if (typeof msg !== 'string') msg = JSON.stringify(msg);
    }
    msg = String(msg || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return msg.length > 200 ? msg.slice(0, 200) + '…' : msg;
}

export function logApiResponse(tag, rawData) {
    let s;
    try { s = typeof rawData === 'string' ? rawData : JSON.stringify(rawData); } catch { s = String(rawData); }
    console.warn(`[${tag}] Respons API tanpa tautan:`, String(s).slice(0, 500));
}
