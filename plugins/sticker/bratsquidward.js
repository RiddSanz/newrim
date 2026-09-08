export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import config from "../../config.js";
import te from "../../src/lib/rimuru-error.js";
import { drawBrat } from "../../src/lib/rimuru-brat.js";

const pluginConfig = {
  name: "bratsquidward",
  alias: [],
  category: "sticker",
  description: "Membuat sticker squidward brat",
  usage: ".bratsquidward <text>",
  example: ".bratsquidward cape",
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
    return m.reply(`🖼️ *BRAT SQUIDWARD*\n\n> Masukkan teks\n\n\`Contoh: ${m.prefix}bratsquidward cape\``);
  }

  m.react("🕕");

  try {
    const bgUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772794955890.jpeg";
    
    const buffer = await drawBrat({
      text,
      bgUrl,
      maxWidth: 230,
      maxHeight: 110,
      centerX: 370,
      centerY: 370,
      maxFontSize: 50,
      fontDecrement: 1,
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
