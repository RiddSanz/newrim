import axios from 'axios';
import { extractLinks, extractApiMessage, logApiResponse } from '../../src/lib/rimuru-link-extract.js';

const API_KEY = 'EB4F';
const ENDPOINT = '/nftools/create';

// Memanggil API NF Tools dengan timeout untuk mencegah command menggantung.
async function fetchNFTools(query = '') {
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
    name: 'nftools',
    alias: ['nfcreate'],
    category: 'tools',
    description: 'Membuat akun melalui NF Tools dan menampilkan tautan hasil API',
    usage: '.nftools',
    example: '.nftools',
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

    await m.reply('⏳ *Membuat akun & menyiapkan tautan...*');
    const res = await fetchNFTools(input);

    if (!res.ok) {
        return m.reply(`❌ *Gagal membuat akun:* ${res.why}`);
    }

    const links = extractLinks(res.data);
    if (!links) {
        logApiResponse('NFTOOLS', res.data);
        const apiMsg = extractApiMessage(res.data);
        return m.reply('❌ *Gagal mendapatkan tautan hasil pembuatan.* Coba beberapa saat lagi.' + (apiMsg ? `\n\n📝 Pesan API: ${apiMsg}` : ''));
    }

    const caption =
        `✨ *NF TOOLS — HASIL PEMBUATAN* ✨\n\n` +
        `Tautan hasil API untuk perangkat kamu:\n\n` +
        `📱 *Link Android:*\n${links.andro}\n\n` +
        `💻 *Link PC / Browser:*\n${links.pc}\n\n` +
        `📺 *Link Smart TV:*\n${links.tv}\n\n` +
        `🎉 Ikuti petunjuk yang tersedia pada tautan hasil API.`;

    return m.reply(caption);
}

export { pluginConfig as config, handler };
