export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { getAssetBuffer } from "../../src/lib/rimuru-asset-manager.js";
import * as _canvas from '@napi-rs/canvas'
import axios from "axios";
import path from "path";
import fs from "fs";


import { uploadTo0x0 } from "../../src/lib/rimuru-tmpfiles.js";
import te from "../../src/lib/rimuru-error.js";
const pluginConfig = {
  name: "fakedev",
  alias: [],
  category: "canvas",
  description: "Membuat fake developer profile card",
  usage: ".fakedev <nama> (reply/kirim foto)",
  example: ".fakedev Misaki",
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
      `🎮 *ꜰᴀᴋᴇ ᴅᴇᴠᴇʟᴏᴘᴇʀ*\n\n` +
        `> Masukkan nama untuk profile\n\n` +
        `*ᴄᴀʀᴀ ᴘᴀᴋᴀɪ:*\n` +
        `> 1. Kirim foto + caption \`${m.prefix}fakedev <nama>\`\n` +
        `> 2. Reply foto dengan \`${m.prefix}fakedev <nama>\``,
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
    const bg = await _canvas.loadImage("https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772797781960.jpeg");
    const badge = await _canvas.loadImage("https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772797710490.png");

    const canvas = _canvas.createCanvas(1080, 1080);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

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

    drawCircularTextTop(ctx, name.toUpperCase(), centerX, centerY, radius, badge);

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

function drawCircularTextTop(ctx, text, centerX, centerY, radius, badgeImage) {
  const fontSize = 72;
  const strokeWidth = 3;
  const arcSpan = Math.PI * 0.7;

  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const textRadius = radius + 75;
  const chars = text.split("");
  const n = chars.length;
  const angleIncrement = n > 1 ? arcSpan / (n - 1) : 0;
  const start = Math.PI / 2 + arcSpan / 2;

  for (let i = 0; i < n; i++) {
    const char = chars[i];
    const angle = start - i * angleIncrement;
    const x = centerX + Math.cos(angle) * textRadius;
    const y = centerY + Math.sin(angle) * textRadius;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle - Math.PI / 2);
    ctx.lineWidth = strokeWidth;
    ctx.strokeText(char, 0, 0);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }

  if (badgeImage) {
    const endAngle = start - (n - 1) * angleIncrement;
    const badgeAngle = endAngle - angleIncrement;
    const badgeSize = Math.round(fontSize * 0.9);
    const bx = centerX + Math.cos(badgeAngle) * textRadius;
    const by = centerY + Math.sin(badgeAngle) * textRadius;
    ctx.drawImage(badgeImage, bx - badgeSize / 2, by - badgeSize / 2, badgeSize, badgeSize);
  }
}

export { pluginConfig as config, handler };
