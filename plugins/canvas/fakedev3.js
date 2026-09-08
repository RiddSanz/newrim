export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { getAssetBuffer } from "../../src/lib/rimuru-asset-manager.js";
import * as _canvas from '@napi-rs/canvas'
import axios from "axios";
import path from "path";
import fs from "fs";


import { uploadTo0x0 } from "../../src/lib/rimuru-tmpfiles.js";
import te from "../../src/lib/rimuru-error.js";
const pluginConfig = {
  name: "fakedev3",
  alias: [],
  category: "canvas",
  description: "Membuat fake developer profile card",
  usage: ".fakedev3 <nama> (reply/kirim foto)",
  example: ".fakedev3 Misaki",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};
let fontRegistered = false;
async function handler(m, { sock }) {
  const name = m.text?.trim();
  if (!name) {
    return m.reply(
      `🎮 *ꜰᴀᴋᴇ ᴅᴇᴠᴇʟᴏᴘᴇʀ 3*\n\n` +
        `> Masukkan nama untuk profile\n\n` +
        `*ᴄᴀʀᴀ ᴘᴀᴋᴀɪ:*\n` +
        `> 1. Kirim foto + caption \`${m.prefix}fakedev3 <nama>\`\n` +
        `> 2. Reply foto dengan \`${m.prefix}fakedev3 <nama>\``,
    );
  }
  let buffer = null;
  if (
    m.quoted &&
    (m.quoted.type === "imageMessage" || m.quoted.mtype === "imageMessage")
  ) {
    try {
      buffer = await m.quoted.download();
    } catch (e) {
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  } else if (m.isMedia && m.type === "imageMessage") {
    try {
      buffer = await m.download();
    } catch (e) {
      m.reply(te(m.prefix, m.command, m.pushName));
    }
  } else {
    try {
      let te = await sock.profilePictureUrl(m.sender, "image");
      buffer = Buffer.from(
        (await axios.get(te, { responseType: "arraybuffer" })).data,
      );
    } catch (error) {
      buffer = getAssetBuffer("pp-kosong");
    }
  }
  if (!buffer) {
    return m.reply(`❌ Kirim/reply gambar untuk dijadikan avatar!`);
  }
  m.react("🕕");
  try {
    const userImage = await _canvas.loadImage(buffer);
    
    const bgURL = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772226320613.jpeg";
    const blueTick = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772220719294.jpeg";

    const bgImg = await _canvas.loadImage(bgURL);
    const tickImg = await _canvas.loadImage(blueTick);

    const canvas = _canvas.createCanvas(1080, 1080);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 263;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(userImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
    ctx.restore();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.font = "bold 72px 'Segoe UI', 'Arial Black', Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const arcSpan = Math.PI * 0.55;
    const textRadius = radius + 75;
    const chars = name.toUpperCase().split("");
    const n = chars.length;
    const angleIncrement = n > 1 ? arcSpan / (n - 1) : 0;
    const start = Math.PI / 2 + arcSpan / 2;

    for (let i = 0; i < n; i++) {
      const angle = start - i * angleIncrement;
      const x = centerX + Math.cos(angle) * textRadius;
      const y = centerY + Math.sin(angle) * textRadius;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle - Math.PI / 2);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.strokeText(chars[i], 0, 0);
      ctx.fillText(chars[i], 0, 0);
      ctx.restore();
    }

    ctx.restore();

    ctx.drawImage(
      tickImg,
      centerX + Math.cos(0) * (radius + 60) - 35,
      centerY - 35,
      70,
      70
    );

    const finalBuffer = await canvas.encode("png");

    await sock.sendMedia(
      m.chat,
      finalBuffer,
      null,
      m,
      {
        type: "image",
      },
    );
    m.react("✅");
  } catch (error) {
    m.react("❌");
    m.reply(`❌ Terjadi kesalahan saat memproses gambar.`);
  }
}
export { pluginConfig as config, handler };
