export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { createCanvas, loadImage } from "@napi-rs/canvas";
import { downloadMediaMessage, getContentType } from "ourin";
import te from "../../src/lib/rimuru-error.js";
import axios from "axios";

const pluginConfig = {
  name: "gen-xnxx",
  alias: ["genxnxx"],
  category: "canvas",
  description: "Bikin fake video thumbnail XNXX",
  usage: ".gen-xnxx <judul> (reply/kirim foto)",
  example: ".gen-xnxx Momen lucu",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const title = m.text?.trim();
  if (!title) {
    return m.reply(`⚠️ Harap masukkan judulnya!\nContoh: \`${m.prefix}${m.command} Momen Lucu\``);
  }

  let media = null;
  const msgObj = m.quoted?.message ? m.quoted : m;
  const type = getContentType(msgObj.message);

  if (!type || type !== "imageMessage") {
    return m.reply(`⚠️ Harap kirim atau reply foto dengan perintah \`${m.prefix}${m.command} <judul>\``);
  }

  await m.react("🕕");
  
  try {
    media = await downloadMediaMessage(msgObj, "buffer", {});
    if (!media) throw new Error("Gagal membaca media");

    const bgUrl = "https://files.catbox.moe/d4moy2.png";
    const bgBuffer = await axios.get(bgUrl, { responseType: "arraybuffer" }).then(r => r.data);

    const background = await loadImage(Buffer.from(bgBuffer));
    const userImg = await loadImage(media);

    const canvas = createCanvas(720, 790);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(userImg, 0, 20, 720, 457);

    const text = title.length > 20 ? title.substring(0, 20) + "..." : title;

    ctx.font = "bold 45px Arial";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.fillText(text, 30, 535);

    const buffer = await canvas.encode("png");
    await sock.sendMessage(m.chat, { image: buffer, caption: "🔞 *Gen XNXX Thumbnail*" }, { quoted: m });
    await m.react("✅");

  } catch (err) {
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
