export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { getAssetBuffer } from "../../src/lib/rimuru-asset-manager.js";
import * as _canvas from '@napi-rs/canvas';
import axios from "axios";
import te from "../../src/lib/rimuru-error.js";

const pluginConfig = {
  name: "afinitasml",
  alias: [],
  category: "canvas",
  description: "Membuat profil ML dengan bingkai Afinitas",
  usage: ".afinitasml (reply/kirim foto) [nomor bg]",
  example: ".afinitasml 1",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  let buffer = null;
  
  if (m.quoted && (m.quoted.type === "imageMessage" || m.quoted.mtype === "imageMessage")) {
    try { buffer = await m.quoted.download(); } catch (e) { return m.reply(te(m.prefix, m.command, m.pushName)); }
  } else if (m.isMedia && m.type === "imageMessage") {
    try { buffer = await m.download(); } catch (e) { return m.reply(te(m.prefix, m.command, m.pushName)); }
  } else {
    return m.reply(`🎮 *ᴀꜰɪɴɪᴛᴀꜱ ᴍʟ*\n\n> Kirim/reply gambar untuk dijadikan avatar!\n> Kamu juga bisa menambahkan nomor background (1-6) di akhir perintah.\n\nContoh: \`.afinitasml 3\``);
  }

  m.react("🕕");

  const backgrounds = [
    "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772225640136.png",
    "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772225645439.png",
    "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772225653904.png",
    "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772225659927.png",
    "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772225664898.png",
    "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772225669507.png"
  ];

  let index = Math.floor(Math.random() * backgrounds.length);
  const bgNum = m.text?.trim();
  if (bgNum) {
    const n = parseInt(bgNum);
    if (!isNaN(n) && n >= 1 && n <= backgrounds.length) {
      index = n - 1;
    }
  }

  try {
    const userImage = await _canvas.loadImage(buffer);
    const bg = await _canvas.loadImage(backgrounds[index]);
    const avatarBorder = await _canvas.loadImage("https://c.termai.cc/i128/BOc3D5a.png");

    const canvas = _canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    const frame = { x: 444, y: 847, w: 205, h: 205 };
    const avatarSize = 300;

    const avatarX = frame.x + (frame.w - avatarSize) / 2;
    const avatarY = frame.y + (frame.h - avatarSize) / 2;

    const minSide = Math.min(userImage.width, userImage.height);
    const cropX = (userImage.width - minSide) / 2;
    const cropY = (userImage.height - minSide) / 2;

    ctx.drawImage(
      userImage,
      cropX,
      cropY,
      minSide,
      minSide,
      avatarX,
      avatarY,
      avatarSize,
      avatarSize
    );

    const pad = 55;
    ctx.drawImage(
      avatarBorder,
      avatarX - pad,
      avatarY - pad,
      avatarSize + pad * 2,
      avatarSize + pad * 2
    );

    const finalBuffer = await canvas.encode("png");
    await sock.sendMedia(m.chat, finalBuffer, null, m, { type: "image" });
    m.react("✅");
  } catch (error) {
    m.react("❌");
    m.reply(`❌ Terjadi kesalahan saat memproses gambar.`);
  }
}

export { pluginConfig as config, handler };
