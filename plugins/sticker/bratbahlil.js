export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import config from "../../config.js";
import te from "../../src/lib/rimuru-error.js";
import { drawBrat } from "../../src/lib/rimuru-brat.js";

const pluginConfig = {
  name: "bratbahlil",
  alias: [],
  category: "sticker",
  description: "Membuat sticker bahlil brat",
  usage: ".bratbahlil <text>",
  example: ".bratbahlil haha",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.args.join(" ").trim();
  if (!text) {
    return m.reply(`🖼️ *BRAT BAHLIL*\n\n> Masukkan teks\n\n\`Contoh: ${m.prefix}bratbahlil haha\``);
  }

  m.react("🕕");

  try {
    const bgUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772229450331.jpeg";
    const rect = { x: 100, y: 770, width: 720, height: 140 };
    
    const buffer = await drawBrat({
      text,
      bgUrl,
      maxWidth: rect.width - 60,
      maxHeight: rect.height,
      centerX: rect.x + rect.width / 2,
      centerY: rect.y + rect.height / 2 + 55,
      maxFontSize: 110,
      fontDecrement: 5,
      lineHeightMult: 1.1
    });

    await sock.sendImageAsSticker(m.chat, buffer, m, {
      packname: config.sticker.packname,
      author: config.sticker.author,
    });
    m.react("✅");
  } catch (error) {
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
