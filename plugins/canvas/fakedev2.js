export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { getAssetBuffer } from "../../src/lib/rimuru-asset-manager.js";
import * as _canvas from '@napi-rs/canvas'
import axios from "axios";
import path from "path";
import fs from "fs";


import { uploadTo0x0 } from "../../src/lib/rimuru-tmpfiles.js";
import te from "../../src/lib/rimuru-error.js";
const pluginConfig = {
  name: "fakedev2",
  alias: [],
  category: "canvas",
  description: "Membuat fake developer profile card",
  usage: ".fakedev2 <nama> (reply/kirim foto)",
  example: ".fakedev2 Misaki",
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
      `🎮 *ꜰᴀᴋᴇ ᴅᴇᴠᴇʟᴏᴘᴇʀ 2*\n\n` +
        `> Masukkan nama untuk profile\n\n` +
        `*ᴄᴀʀᴀ ᴘᴀᴋᴀɪ:*\n` +
        `> 1. Kirim foto + caption \`${m.prefix}fakedev2 <nama>\`\n` +
        `> 2. Reply foto dengan \`${m.prefix}fakedev2 <nama>\``,
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
  
  if (!fontRegistered) {
    try {
      _canvas.GlobalFonts.registerFromPath(path.join(process.cwd(), "SAMPEL/maker/Nunito-MediumItalic.ttf"), "Nunito");
      fontRegistered = true;
    } catch (e) {
      console.log("Gagal meload font Nunito:", e);
    }
  }

  try {
    const userImage = await _canvas.loadImage(buffer);
    const bg = await _canvas.loadImage("https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772229788017.jpeg");

    const canvas = _canvas.createCanvas(1024, 1024);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(bg, 0, 0, 1024, 1024);

    const centerX = 518; 
    const centerY = 455; 
    const radius = 235; 

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const aspect = userImage.width / userImage.height;
    let drawWidth, drawHeight, dx, dy;
    
    if (aspect > 1) {
      drawHeight = radius * 2;
      drawWidth = drawHeight * aspect;
      dx = centerX - drawWidth / 2;
      dy = centerY - radius;
    } else {
      drawWidth = radius * 2;
      drawHeight = drawWidth / aspect;
      dx = centerX - radius;
      dy = centerY - drawHeight / 2;
    }
    
    ctx.drawImage(userImage, dx, dy, drawWidth, drawHeight);
    ctx.restore();

    drawCircularTextBottom(ctx, name, centerX, centerY, radius);

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

function drawCircularTextBottom(context, str, cx, cy, rad) {
  const fontSize = 85;
  const arcSpan = Math.PI * 0.6; 
  const textRadius = rad + 75; 
  const chars = str.toUpperCase().split("");
  const n = chars.length;
  const angleIncrement = n > 1 ? arcSpan / (n - 1) : 0;
  const start = (Math.PI / 2) + (arcSpan / 2);

  context.font = `bold ${fontSize}px Nunito`;
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";

  for (let i = 0; i < n; i++) {
    const char = chars[i];
    const angle = start - i * angleIncrement;
    const x = cx + Math.cos(angle) * textRadius;
    const y = cy + Math.sin(angle) * textRadius;

    context.save();
    context.translate(x, y);
    context.rotate(angle - Math.PI / 2);
    context.lineWidth = 4;
    context.strokeStyle = "rgba(0,0,0,0.5)";
    context.strokeText(char, 0, 0);
    context.fillText(char, 0, 0);
    context.restore();
  }
}

export { pluginConfig as config, handler };
