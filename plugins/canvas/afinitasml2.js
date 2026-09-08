export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { getAssetBuffer } from "../../src/lib/rimuru-asset-manager.js";
import * as _canvas from '@napi-rs/canvas';
import axios from "axios";
import te from "../../src/lib/rimuru-error.js";

const pluginConfig = {
  name: "afinitasml2",
  alias: [],
  category: "canvas",
  description: "Membuat profil ML dengan bingkai Afinitas (Style 2)",
  usage: ".afinitasml2 (reply/kirim foto)",
  example: ".afinitasml2",
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
    try {
      let teUrl = await sock.profilePictureUrl(m.sender, "image");
      buffer = Buffer.from((await axios.get(teUrl, { responseType: "arraybuffer" })).data);
    } catch (error) {
      buffer = getAssetBuffer("pp-kosong");
    }
  }

  if (!buffer) {
    return m.reply(`🎮 *ᴀꜰɪɴɪᴛᴀꜱ ᴍʟ 2*\n\n> Kirim/reply gambar untuk dijadikan avatar!`);
  }

  m.react("🕕");

  try {
    const bgURL = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772821724016.png";

    const userImage = await _canvas.loadImage(buffer);
    const bg = await _canvas.loadImage(bgURL);

    const canvas = _canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    const frame = { x: 450, y: 847, width: 205, height: 205 };
    const avatarSize = 300;
    const avatarX = frame.x + (frame.width - avatarSize) / 2;
    const avatarY = frame.y + (frame.height - avatarSize) / 2;

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

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    const finalBuffer = await canvas.encode("png");
    await sock.sendMedia(m.chat, finalBuffer, null, m, { type: "image" });
    m.react("✅");
  } catch (error) {
    m.react("❌");
    m.reply(`❌ Terjadi kesalahan saat memproses gambar.`);
  }
}

export { pluginConfig as config, handler };
