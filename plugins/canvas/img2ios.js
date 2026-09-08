export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { createCanvas, loadImage } from "@napi-rs/canvas"
import axios from "axios"
import te from "../../src/lib/rimuru-error.js"

const pluginConfig = {
  name: "img2ios",
  alias: ["toios"],
  category: "canvas",
  description: "Membuat frame foto gaya gallery iOS.",
  usage: ".img2ios [kirim/reply gambar]",
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
      `Fitur ini akan membingkai gambarmu menjadi gaya galeri iOS.\n\n` +
      `*Caranya:*\n` +
      `- Kirim gambar dengan caption \`${m.prefix}img2ios\`\n` +
      `- Atau *reply* pesan gambar dengan perintah yang sama.`
    );
  }

  try {
    await m.react("🕕")
    
    const templateURL = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772230291185.jpeg"
    const tmplRes = await axios.get(templateURL, { responseType: "arraybuffer" })
    const templateBuffer = Buffer.from(tmplRes.data)

    const [userImg, template] = await Promise.all([
      loadImage(targetImgBuffer),
      loadImage(templateBuffer)
    ])

    const canvas = createCanvas(template.width, template.height)
    const ctx = canvas.getContext("2d")
    ctx.drawImage(template, 0, 0)

    const bubbleX = 36
    const bubbleY = 363
    const bubbleW = 616
    const bubbleH = 860
    const radius = 21

    const imgRatio = userImg.width / userImg.height
    const bubbleRatio = bubbleW / bubbleH
    let drawW, drawH

    if (imgRatio > bubbleRatio) {
      drawH = bubbleH
      drawW = drawH * imgRatio
    } else {
      drawW = bubbleW
      drawH = drawW / imgRatio
    }

    const offsetX = bubbleX - (drawW - bubbleW) / 2
    const offsetY = bubbleY - (drawH - bubbleH) / 2

    ctx.save()
    ctx.beginPath()
    ctx.moveTo(bubbleX + radius, bubbleY)
    ctx.lineTo(bubbleX + bubbleW - radius, bubbleY)
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + radius)
    ctx.lineTo(bubbleX + bubbleW, bubbleY + bubbleH - radius)
    ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY + bubbleH, bubbleX + bubbleW - radius, bubbleY + bubbleH)
    ctx.lineTo(bubbleX + radius, bubbleY + bubbleH)
    ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleH, bubbleX, bubbleY + bubbleH - radius)
    ctx.lineTo(bubbleX, bubbleY + radius)
    ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + radius, bubbleY)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(userImg, offsetX, offsetY, drawW, drawH)
    ctx.restore()

    const buffer = await canvas.encode("png")

    await sock.sendMessage(m.chat, { image: buffer, caption: "✅ *BERHASIL MEMBINGKAI GAMBAR*" }, { quoted: m })
    await m.react("✅")
  } catch (err) {
    console.error(err)
    await m.react("❌")
    m.reply(`❌ *GAGAL*\n\nTerjadi kesalahan saat memproses gambar.\n\`${err.message}\``)
  }
}

export { pluginConfig as config, handler }
