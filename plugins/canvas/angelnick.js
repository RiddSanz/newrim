export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { getAssetBuffer } from "../../src/lib/rimuru-asset-manager.js";
import * as _canvas from '@napi-rs/canvas';
import axios from "axios";
import te from "../../src/lib/rimuru-error.js";

const pluginConfig = {
  name: "angelnick",
  alias: [],
  category: "canvas",
  description: "Membuat banner nama bertema Angel",
  usage: ".angelnick <teks> (reply/kirim foto)",
  example: ".angelnick Misaki",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

function drawCircularText(ctx, text, centerX, centerY, radius) {
  const chars = text.split('');
  const n = chars.length;
  const arcSpan = Math.PI * 0.7;
  const angleIncrement = n > 1 ? arcSpan / (n - 1) : 0;
  const start = Math.PI / 2 + arcSpan / 2;

  for (let i = 0; i < n; i++) {
    const char = chars[i];
    const angle = start - i * angleIncrement;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle - Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }
}

async function handler(m, { sock }) {
  const text = m.text?.trim();
  if (!text) {
    return m.reply(`🎮 *ᴀɴɢᴇʟ ɴɪᴄᴋ*\n\n> Masukkan teks untuk banner\n\n*ᴄᴀʀᴀ ᴘᴀᴋᴀɪ:*\n> 1. Kirim foto + caption \`${m.prefix}angelnick <teks>\`\n> 2. Reply foto dengan \`${m.prefix}angelnick <teks>\``);
  }

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

  if (!buffer) return m.reply(`❌ Kirim/reply gambar untuk dijadikan avatar!`);

  m.react("🕕");

  try {
    const bgURL = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1771170750646.jpeg";

    const userImg = await _canvas.loadImage(buffer);
    const bg = await _canvas.loadImage(bgURL);

    const canvas = _canvas.createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    const circleSize = 95;
    const centerX = canvas.width / 2 + 65;
    const centerY = canvas.height / 2 - 40;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, circleSize, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // calculate crop for userImg to fill circle
    const aspect = userImg.width / userImg.height;
    let sw = userImg.width, sh = userImg.height, sx = 0, sy = 0;
    if (aspect > 1) {
        sw = userImg.height;
        sx = (userImg.width - sw) / 2;
    } else {
        sh = userImg.width;
        sy = (userImg.height - sh) / 2;
    }

    ctx.drawImage(userImg, sx, sy, sw, sh, centerX - circleSize, centerY - circleSize, circleSize * 2, circleSize * 2);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(centerX, centerY, circleSize + 5, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    ctx.save();
    const maxFontSize = 50;
    const minFontSize = 25;
    let fontSize = maxFontSize;
    if (text.length > 10) fontSize = Math.max(minFontSize, maxFontSize - (text.length - 10) * 2);
    
    ctx.font = `bold ${fontSize}px serif`;
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const radius = circleSize + 70;
    drawCircularText(ctx, text.toUpperCase(), centerX, centerY - 15, radius);
    ctx.restore();

    const finalBuffer = await canvas.encode("png");
    await sock.sendMedia(m.chat, finalBuffer, null, m, { type: "image" });
    m.react("✅");
  } catch (error) {
    m.react("❌");
    m.reply(`❌ Terjadi kesalahan saat memproses gambar.`);
  }
}

export { pluginConfig as config, handler };
