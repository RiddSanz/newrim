export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from 'axios';
import _sharp from 'sharp';

const sharp = _sharp;

const pluginConfig = {
  name: 'stickerpackpin',
  alias: ['pin2sticker', 'pinsticker'],
  category: 'sticker',
  description: 'Cari Pinterest dan ubah hasil pin menjadi sticker pack',
  usage: '.stickerpackpin <query>',
  example: '.stickerpackpin anime girl',
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 20,
  energi: 2,
  isEnabled: true,
};

async function pinterest(query) {
  const { data: cookieHtml, headers } = await axios.get('https://www.pinterest.com/csrf_error/', {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    timeout: 15000,
  });
  void cookieHtml;

  const cookies = (headers['set-cookie'] || []).map((v) => v.split(';')[0]).join('; ');
  if (!cookies) return [];

  const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/';
  const params = {
    source_url: `/search/pins/?q=${encodeURIComponent(query)}`,
    data: JSON.stringify({
      options: { isPrefetch: false, query, scope: 'pins', no_fetch_context_on_resource: false },
      context: {},
    }),
    _: Date.now(),
  };

  const { data } = await axios.get(url, {
    params,
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      cookie: cookies,
      referer: 'https://www.pinterest.com/',
      'x-requested-with': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0',
    },
    timeout: 20000,
  });

  return (data?.resource_response?.data?.results || [])
    .filter((v) => v.images?.orig?.url)
    .map((v) => ({
      image: v.images.orig.url,
      source: `https://id.pinterest.com/pin/${v.id}`,
    }))
    .slice(0, 20);
}

async function toWebp(buffer) {
  return sharp(buffer)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 80 })
    .toBuffer();
}

async function handler(m, { sock }) {
  const query = (m.args || []).join(' ').trim();
  if (!query) return m.reply(`📌 Cara pakai: ${m.prefix}stickerpackpin <query>`);
  if (!m.isGroup) return m.reply('❌ Fitur ini khusus grup.');

  await m.react('⏳');
  try {
    const pins = await pinterest(query);
    if (!pins.length) {
      await m.react('❌');
      return m.reply('❌ Tidak ditemukan pin Pinterest yang bisa diproses.');
    }

    const stickers = [];
    for (const pin of pins) {
      try {
        const { data } = await axios.get(pin.image, { responseType: 'arraybuffer', timeout: 20000 });
        stickers.push(await toWebp(Buffer.from(data)));
      } catch {}
    }

    if (!stickers.length) {
      await m.react('❌');
      return m.reply('❌ Gagal mengubah pin menjadi sticker.');
    }

    if (typeof sock.sendStickerPack !== 'function') {
      await m.react('❌');
      return m.reply('❌ WhatsApp client Rimuru tidak mendukung pengiriman sticker pack otomatis.');
    }

    const author = 'Rimuru-MD';
    await sock.sendStickerPack(m.chat, stickers.slice(0, 20), m, {
      name: `Pinterest - ${query}`,
      packname: `Pinterest - ${query}`,
      publisher: author,
      author,
      description: `Pinterest pins: ${query}`,
      emojis: ['❤'],
    });

    await m.react('✅');
    await m.reply(`✅ Berhasil membuat sticker pack dari Pinterest.\n📌 Query: ${query}\n🧩 Sticker: ${Math.min(stickers.length, 20)}`);
  } catch (error) {
    console.error('[STICKERPACKPIN]', error?.message || error);
    await m.react('❌');
    await m.reply('❌ Gagal mengambil data Pinterest.');
  }
}

export { pluginConfig as config, handler };
