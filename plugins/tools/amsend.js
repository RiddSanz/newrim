export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from 'axios';

const pluginConfig = {
  name: "amsend",
  alias: ["sendam", "amremlink"],
  category: "tools",
  description: "Kirim email verifikasi/aktivasi Alight Motion Premium",
  usage: ".amsend <email>",
  example: ".amsend emailkamu@gmail.com",
  isOwner: false,
  isPremium: true,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 5,
  isEnabled: true,
};

const API_KEY = "RS-aBk3ue&5";

async function handler(m, { sock, text }) {
  const email = (text || m.text?.split(' ').slice(1).join(' ') || '').trim();

  if (!email || !email.includes('@')) {
    return m.reply(
      `⚠️ *Format Salah*\n\n` +
      `Penggunaan:\n\`${m.prefix || '.'}amsend <email>\`\n\n` +
      `Contoh:\n\`${m.prefix || '.'}amsend emailkamu@gmail.com\``
    );
  }

  await m.react('⏳');

  try {
    const apiUrl = `https://api.nexadev.my.id/am/send/`;
    
    const response = await axios.get(apiUrl, {
      params: {
        key: API_KEY,
        email: email
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 20000
    });

    const data = response.data;

    if (data && data.success) {
      await m.react('✅');
      let resultText = `📩 *ALIGHT MOTION SEND EMAIL* 📩\n\n` +
                       `📧 *Email:* ${email}\n` +
                       `📌 *Status:* Success\n` +
                       `💬 *Pesan:* ${data.message || 'Link premium berhasil terkirim!'}\n\n` +
                       `_Silakan periksa folder Inbox atau Spam pada email tersebut!_`;
      return m.reply(resultText);
    } else {
      await m.react('❌');
      return m.reply(`❌ *Gagal Terkirim:* ${data?.message || 'Terjadi kesalahan pada API.'}`);
    }

  } catch (error) {
    console.error('[AMSEND ERROR]', error);
    await m.react('❌');
    await m.reply(`❌ *Terjadi Kesalahan:* ${error.response?.data?.message || error.message}`);
  }
}

export { pluginConfig as config, handler };
