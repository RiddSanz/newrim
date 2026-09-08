export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import config from "../../config.js";
import te from "../../src/lib/rimuru-error.js";
import { drawBrat } from "../../src/lib/rimuru-brat.js";

const pluginConfig = {
  name: "bratanime",
  alias: [],
  category: "sticker",
  description: "Membuat sticker anime brat",
  usage: ".bratanime <text>",
  example: ".bratanime halo",
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
    return m.reply(`🖼️ *BRAT ANIME*\n\n> Masukkan teks\n\n\`Contoh: ${m.prefix}bratanime halo\``);
  }

  m.react("🕕");

  try {
    const bgUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772989415819.jpeg";
    const areaX = 170;
    const areaW = 460;
    const areaCY = 530;
    const areaMaxH = 210;

    const buffer = await drawBrat({
      text,
      bgUrl,
      width: 800,
      height: 800,
      maxWidth: areaW,
      maxHeight: areaMaxH,
      centerX: areaX + areaW / 2,
      centerY: areaCY + 60,
      maxFontSize: 72,
      fontDecrement: 3,
      lineHeightMult: 1.45,
      align: "center"
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
