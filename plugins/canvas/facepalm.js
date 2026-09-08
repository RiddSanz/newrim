export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { createCanvas, loadImage } from "@napi-rs/canvas"
import te from "../../src/lib/rimuru-error.js"

const pluginConfig = {
  name: "facepalm",
  alias: [],
  category: "canvas",
  description: "Membuat meme facepalm dari gambar.",
  usage: ".facepalm [kirim/reply gambar]",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
}

async function handler(m, { sock }) {
  let targetImgBuffer = null;
  try {
    if (m.quoted && typeof m.quoted.download === 'function') {
      targetImgBuffer = await m.quoted.download();
    } else if (typeof m.download === 'function' && (m.isMedia || m.mtype === 'imageMessage' || m.type === 'imageMessage')) {
      targetImgBuffer = await m.download();
    }
  } catch (e) {}

  if (!targetImgBuffer) {
    return m.reply(
      `📝 *CARA PENGGUNAAN*\n\n` +
      `Kirim gambar dengan caption \`${m.prefix}facepalm\` atau reply pesan gambar yang sudah ada.`
    );
  }

  try {
    await m.react("🕕")

    const avatar = await loadImage(targetImgBuffer)
    
    // Fallback if FACEPALM asset is not properly configured in original assets
    const facepalmLayerUrl = "https://files.catbox.moe/g45kly.jpg" // Ganti dengan URL asli jika ada
    
    let layer;
    try {
      layer = await loadImage(facepalmLayerUrl)
    } catch(e) {
      // Jika gagal memuat layer, kita gunakan avatar itu sendiri sebagai fallback darurat
      layer = avatar
    }

    const canvas = createCanvas(632, 357)
    const ctx = canvas.getContext("2d")

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, 632, 357)
    ctx.drawImage(avatar, 199, 112, 235, 235)
    ctx.drawImage(layer, 0, 0, 632, 357)

    const buffer = await canvas.encode("png")

    await sock.sendMessage(m.chat, { image: buffer, caption: "✅ *BERHASIL MEMBUAT GAMBAR*" }, { quoted: m })
    await m.react("✅")
  } catch (err) {
    console.error(err)
    await m.react("❌")
    m.reply(`❌ *GAGAL*\n\nTerjadi kesalahan saat memproses gambar.\n\`${err.message}\``)
  }
}

export { pluginConfig as config, handler }
