export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from 'axios';

const pluginConfig = {
  name: "amverif",
  alias: ["ampverif", "verifyam", "amverify"],
  category: "tools",
  description: "Verifikasi tautan Alight Motion untuk mempremiumkan akun",
  usage: ".amverif email|link",
  example: ".amverif emailkamu@gmail.com|https://alight-creative.firebaseapp.com/...",
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
  const input = (text || m.text?.split(' ').slice(1).join(' ') || '').trim();

  if (!input) {
    return m.reply(
      `⚠️ *Format Salah*\n\n` +
      `Penggunaan:\n\`${m.prefix || '.'}amverif email|link\`\n\n` +
      `Contoh:\n\`${m.prefix || '.'}amverif emailkamu@gmail.com|https://alight-creative.firebaseapp.com/...\``
    );
  }

  const [emailInput, linkInput] = input.split('|').map(v => v ? v.trim() : '');

  if (!emailInput || !emailInput.includes('@')) {
    return m.reply(`⚠️ Email tidak valid!\nContoh: \`${m.prefix || '.'}amverif emailkamu@gmail.com|https://...\``);
  }

  if (!linkInput) {
    return m.reply(`⚠️ Link verifikasi Alight Motion harus diisi!\nContoh: \`${m.prefix || '.'}amverif emailkamu@gmail.com|https://...\``);
  }

  await m.react('⏳');

  try {
    const apiUrl = `https://api.nexadev.my.id/am/verif/`;
    
    const response = await axios.get(apiUrl, {
      params: {
        key: API_KEY,
        email: emailInput,
        link: linkInput
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 20000
    });

    const data = response.data;

    if (data && data.success) {
      await m.react('✅');
      
      // Hapus pesan user berisi link untuk menjaga privasi jika memungkinkan
      try {
        if (m.key && sock) {
          await sock.sendMessage(m.chat, { delete: m.key });
        }
      } catch {}

      let resultText = `✨ *ALIGHT MOTION PREMIUM VERIFIED* ✨\n\n` +
                       `📧 *Email:* ${emailInput}\n` +
                       `📌 *Status:* Success\n` +
                       `💬 *Pesan:* ${data.message || 'Akun berhasil dipremiumkan!'}\n\n` +
                       `_Silakan masuk ke aplikasi Alight Motion menggunakan email tersebut!_`;
      return m.reply(resultText);
    } else {
      await m.react('❌');
      return m.reply(`❌ *Gagal Verifikasi:* ${data?.message || 'Terjadi kesalahan pada API.'}`);
    }

  } catch (error) {
    console.error('[AMVERIF ERROR]', error);
    await m.react('❌');
    await m.reply(`❌ *Terjadi Kesalahan:* ${error.response?.data?.message || error.message}`);
  }
}

export { pluginConfig as config, handler };
