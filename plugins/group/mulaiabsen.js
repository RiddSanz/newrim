import { RIMURU_CORE_CONFIG } from "../../rimuru.js";
export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import config from "../../config.js";
const pluginConfig = {
  name: "mulaiabsen",
  alias: ["startabsen", "bukaabsen", "openabsen"],
  category: "group",
  description: "Mulai sesi absen di grup (admin only)",
  usage: ".mulaiabsen [keterangan]",
  example: ".mulaiabsen Rapat Mingguan",
  isOwner: false,
  isPremium: false,
  isGroup: true,
  isPrivate: false,
  cooldown: 10,
  energi: 0,
  isEnabled: true,
  isAdmin: true,
};

if (!global.absensi) global.absensi = {};

async function handler(m, { sock }) {
  const chatId = m.chat;

  if (global.absensi[chatId]) {
    return m.reply(
      `❌ *ᴍᴀsɪʜ ᴀᴅᴀ ᴀʙsᴇɴ*\n\n` +
        `> Masih ada sesi absen di grup ini!\n\n` +
        `> Ketik *.hapusabsen* untuk menghapus\n` +
        `> atau *.cekabsen* untuk melihat daftar`,
    );
  }

  const keterangan = m.text?.trim() || "Absen Harian";

  global.absensi[chatId] = {
    keterangan: keterangan,
    createdBy: m.sender,
    createdAt: new Date().toISOString(),
    peserta: [],
  };

  const saluranId = RIMURU_CORE_CONFIG.saluran?.id || "120363400911374213@newsletter";
  const saluranName = RIMURU_CORE_CONFIG.saluran?.name || RIMURU_CORE_CONFIG.bot?.name || "rimuru-AI";

  await m.reply(
    `📋 *ABSEN UDAH JALAN NIHH*\n\n` +
      `「 📋 *ɪɴғᴏ* 」\n` +
      `📝 ${keterangan}\n` +
      `👑 Dibuat oleh: @${m.sender.split("@")[0]}\n` +
      `👥 Peserta: 0\n\n` +
      `Untuk kamu yang mau ikutan absen, silahkan ketik *${m.prefix}absen*` +
      `Untuk admin yang mau cek absen, silahkan ketik *${m.prefix}cekabsen*` +
      `Untuk admin yang mau hapus absen, silahkan ketik *${m.prefix}hapusabsen*`,
    { mentions: [m.sender] },
  );
}

export { pluginConfig as config, handler };
