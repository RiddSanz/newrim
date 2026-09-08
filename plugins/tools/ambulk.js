export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from 'axios';

const pluginConfig = {
  name: "ambulk",
  alias: ["amremlist", "bulkam", "ambulkgen"],
  category: "tools",
  description: "Membuat beberapa akun Alight Motion Premium sekaligus (bulk)",
  usage: ".ambulk <jumlah>",
  example: ".ambulk 3",
  isOwner: false,
  isPremium: true,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 10,
  isEnabled: true,
};

const API_KEY = "RS-aBk3ue&5";

async function handler(m, { sock, text }) {
  const inputAmount = (text || m.text?.split(' ').slice(1).join(' ') || '').trim();
  const amount = parseInt(inputAmount) || 1;

  if (amount < 1 || amount > 10) {
    return m.reply(
      `⚠️ *Jumlah Tidak Valid*\n\n` +
      `Penggunaan:\n\`${m.prefix || '.'}ambulk <jumlah>\` (Maksimal 10)\n\n` +
      `Contoh:\n\`${m.prefix || '.'}ambulk 3\``
    );
  }

  await m.react('⏳');

  try {
    const apiUrl = `https://api.nexadev.my.id/am/bulk/`;
    
    const response = await axios.get(apiUrl, {
      params: {
        key: API_KEY,
        amount: amount
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    });

    const data = response.data;

    if (data && (data.status || data.success) && Array.isArray(data.data)) {
      await m.react('✅');

      let caption = `✨ *ALIGHT MOTION BULK GENERATOR* ✨\n\n`;
      caption += `📦 *Jumlah Akun:* ${data.data.length}\n`;
      if (data.limit_left !== undefined) caption += `🪙 *Sisa Limit API:* ${data.limit_left}\n`;
      caption += `───────────────────\n\n`;

      data.data.forEach((acc, i) => {
        caption += `*${i + 1}. Akun Alight Motion*\n`;
        caption += `📧 *Email:* \`${acc.account}\`\n`;
        caption += `🔗 *Login/Inbox:* ${acc.login_url}\n`;
        caption += `🌟 *Status:* ${acc.status}\n\n`;
      });

      caption += `_Gunakan URL Login/Inbox di atas untuk memverifikasi akun saat masuk aplikasi!_`;

      return m.reply(caption.trim());
    } else {
      await m.react('❌');
      return m.reply(`❌ *Gagal Generate:* ${data?.message || 'Terjadi kesalahan pada API.'}`);
    }

  } catch (error) {
    console.error('[AMBULK ERROR]', error);
    await m.react('❌');
    await m.reply(`❌ *Terjadi Kesalahan:* ${error.response?.data?.message || error.message}`);
  }
}

export { pluginConfig as config, handler };
