export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { clearRegistrationSession } from "./daftar.js";

const pluginConfig = {
  name: "bataldaftar",
  alias: ["cancelreg", "canceldaftar", "regcancel"],
  category: "user",
  description: "Batalkan sesi pendaftaran yang sedang aktif",
  usage: ".bataldaftar",
  example: ".bataldaftar",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
  skipRegistration: true,
};

async function handler(m) {
  const canceled = clearRegistrationSession(m.sender);

  if (!canceled) {
    return m.reply(`❌ Kamu tidak punya sesi pendaftaran aktif.`);
  }

  return m.reply(
    `✅ Sesi pendaftaran berhasil dibatalkan.\n\n` +
      `> Mulai lagi dengan: \`${m.prefix}daftar\``,
  );
}

export { pluginConfig as config, handler };
