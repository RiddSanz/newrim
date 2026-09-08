export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { getAssetBuffer } from "../../src/lib/rimuru-asset-manager.js";
import * as _canvas from '@napi-rs/canvas';
import axios from "axios";
import te from "../../src/lib/rimuru-error.js";

const pluginConfig = {
  name: "fakefbkomen",
  alias: [],
  category: "canvas",
  description: "Membuat gambar fake komentar Facebook",
  usage: ".fakefbkomen Nama|Komentar (reply/kirim foto)",
  example: ".fakefbkomen Misaki|Halo semuanya!",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
}

async function handler(m, { sock }) {
  const text = m.text?.trim();
  if (!text) {
    return m.reply(`🎮 *ꜰᴀᴋᴇ ꜰʙ ᴋᴏᴍᴇɴ*\n\n> Masukkan data Nama dan Komentar dengan pemisah |\n\n*ᴄᴏɴᴛᴏʜ ᴘᴇɴɢɢᴜɴᴀᴀɴ:*\n> \`${m.prefix}fakefbkomen Fauzan|Halo semuanya!\``);
  }

  const parts = text.split("|");
  const nama = parts[0]?.trim();
  const komentar = parts.slice(1).join("|")?.trim();

  if (!nama || !komentar) {
    return m.reply(`❌ Format salah! Harus ada Nama dan Komentar. Contoh: \`${m.prefix}fakefbkomen Fauzan|Halo semuanya!\``);
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

  if (!buffer) return m.reply(`❌ Kirim/reply gambar untuk dijadikan profil FB!`);

  m.react("🕕");

  try {
    const avatar = await _canvas.loadImage(buffer);
    const canvas = _canvas.createCanvas(1280, 780);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#1877f2";
    ctx.fillRect(0, 0, canvas.width, 60);

    ctx.fillStyle = "#f0f2f5";
    ctx.fillRect(0, 60, canvas.width, canvas.height - 60);

    const postWidth = 800;
    const postX = (canvas.width - postWidth) / 2;
    const postY = 100;

    ctx.fillStyle = "#fff";
    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;
    roundedRect(ctx, postX, postY, postWidth, 600, 10);
    ctx.fill();
    ctx.shadowColor = "transparent";

    const postHeaderY = postY + 20;
    ctx.save();
    ctx.beginPath();
    ctx.arc(postX + 30 + 25, postHeaderY + 25, 25, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    // Draw avatar in small circle
    const aspect = avatar.width / avatar.height;
    let sw = avatar.width, sh = avatar.height, sx = 0, sy = 0;
    if (aspect > 1) { sw = avatar.height; sx = (avatar.width - sw) / 2; } 
    else { sh = avatar.width; sy = (avatar.height - sh) / 2; }
    
    ctx.drawImage(avatar, sx, sy, sw, sh, postX + 30, postHeaderY, 50, 50);
    ctx.restore();

    ctx.fillStyle = "#050505";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(nama, postX + 70, postHeaderY + 25);

    ctx.fillStyle = "#65676b";
    ctx.font = "13px sans-serif";
    ctx.fillText("baru saja · 🌍", postX + 70, postHeaderY + 45);

    const imgX = postX + 30;
    const imgY = postHeaderY + 80;
    const imgW = postWidth - 60;
    const imgH = 300;
    
    // Draw big image without stretching
    const bannerAspect = imgW / imgH;
    let bsw = avatar.width, bsh = avatar.height, bsx = 0, bsy = 0;
    const imgAspect = avatar.width / avatar.height;

    if (imgAspect > bannerAspect) {
        bsw = avatar.height * bannerAspect;
        bsx = (avatar.width - bsw) / 2;
    } else {
        bsh = avatar.width / bannerAspect;
        bsy = (avatar.height - bsh) / 2;
    }
    
    ctx.drawImage(avatar, bsx, bsy, bsw, bsh, imgX, imgY, imgW, imgH);

    ctx.fillStyle = "#050505";
    ctx.font = "16px sans-serif";
    wrapText(ctx, komentar, imgX, imgY + imgH + 40, imgW, 28);

    ctx.fillStyle = "#65676b";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText("👍 Suka · 💬 Komentar · ↗️ Bagikan", postX + 30, postY + 580);

    const finalBuffer = await canvas.encode("png");
    await sock.sendMedia(m.chat, finalBuffer, null, m, { type: "image" });
    m.react("✅");
  } catch (error) {
    m.react("❌");
    m.reply(`❌ Terjadi kesalahan saat memproses gambar.`);
  }
}

export { pluginConfig as config, handler };
