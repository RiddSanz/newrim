export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { createCanvas, loadImage } from "@napi-rs/canvas"
import axios from "axios"
import te from "../../src/lib/rimuru-error.js"

const pluginConfig = {
  name: "jmk48",
  alias: [],
  category: "canvas",
  description: "Membuat frame foto ala JMK48.",
  usage: ".jmk48 [kirim/reply gambar]",
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
      `Kirim gambar dengan caption \`${m.prefix}jmk48\` atau reply gambar yang sudah ada untuk memberinya frame lucu ala JKT48 (JMK48).`
    );
  }

  try {
    await m.react("🕕")
    
    const frameURL = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772230335511.png"
    const frameRes = await axios.get(frameURL, { responseType: "arraybuffer" })
    const frameBuffer = Buffer.from(frameRes.data)

    const [userImg, frameImg] = await Promise.all([
      loadImage(targetImgBuffer),
      loadImage(frameBuffer)
    ])

    const canvas = createCanvas(frameImg.width, frameImg.height)
    const ctx = canvas.getContext("2d")

    const centerX = canvas.width / 2
    const centerY = Math.round(canvas.height * 0.5)
    const radius = Math.round(canvas.width * 0.4)

    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(userImg, centerX - radius, centerY - radius, radius * 2, radius * 2)
    ctx.restore()

    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height)

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
