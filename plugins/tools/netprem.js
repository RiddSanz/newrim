import axios from 'axios';
import { extractLinks, extractApiMessage, logApiResponse } from '../../src/lib/rimuru-link-extract.js';

const API_KEY = 'EB4F';
const ENDPOINT = '/premium/netflix';

// Memanggil API Netflix Premium dengan timeout agar command tidak menggantung.
async function fetchNetPrem(query = '') {
    try {
        let url = `https://api.yonzofficial.cloud${ENDPOINT}?apikey=${encodeURIComponent(API_KEY)}&plan=premium`;
        if (query) url += `&query=${encodeURIComponent(query)}`;

        const res = await axios.get(url, { timeout: 20000 });
        return { ok: true, data: res.data };
    } catch (e) {
        const responseData = e.response?.data;
        const msg = responseData
            ? (typeof responseData === 'object' ? JSON.stringify(responseData) : String(responseData))
            : e.message;
        return { ok: false, why: msg || 'Permintaan gagal tanpa detail dari API.' };
    }
}

const pluginConfig = {
    name: 'netprem',
    alias: ['netflixprem'],
    category: 'tools',
    description: 'Mendapatkan tautan akses Netflix Premium untuk Android, PC, dan TV',
    usage: '.netprem',
    example: '.netprem',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
};

async function handler(m, { text = '' } = {}) {
    const input = String(text || '').trim();

    await m.reply('⏳ *Memproses tautan Netflix Premium...*');
    const res = await fetchNetPrem(input);

    if (!res.ok) {
        return m.reply(`❌ *Gagal memproses:* ${res.why}`);
    }

    const links = extractLinks(res.data);
    if (!links) {
        logApiResponse('NETPREM', res.data);
        const apiMsg = extractApiMessage(res.data);
        return m.reply('❌ *Gagal mengambil tautan.* Pastikan layanan API aktif atau coba lagi nanti.' + (apiMsg ? `\n\n📝 Pesan API: ${apiMsg}` : ''));
    }

    const caption =
        `💖 *NETFLIX PREMIUM LINK* 💖\n\n` +
        `Tautan akses sesuai perangkat:\n\n` +
        `📱 *Android / Mobile:*\n${links.andro}\n\n` +
        `💻 *PC / Laptop:*\n${links.pc}\n\n` +
        `📺 *Smart TV / Android TV:*\n${links.tv}\n\n` +
        `✨ *Catatan:* Buka tautan pada perangkat yang sesuai.`;

    return m.reply(caption);
}

export { pluginConfig as config, handler };
