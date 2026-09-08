export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { createCanvas } from "@napi-rs/canvas"
import moment from "moment"
import te from "../../src/lib/rimuru-error.js"

const pluginConfig = {
  name: "fakexnxx",
  alias: [],
  category: "canvas",
  description: "Membuat gambar komentar ala xnxx.",
  usage: ".fakexnxx nama | komentar",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ")
  let line = ""

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " "
    const width = ctx.measureText(testLine).width

    if (width > maxWidth && n > 0) {
      ctx.fillText(line, x, y)
      line = words[n] + " "
      y += lineHeight
    } else {
      line = testLine
    }
  }
  ctx.fillText(line, x, y)
}

async function handler(m, { sock, text }) {
  if (!text) {
    return m.reply(
      `📝 *CARA PENGGUNAAN*\n\n` +
      `Kirim perintah dengan format:\n` +
      `\`${m.prefix}fakexnxx nama | komentar | likes | dislikes\`\n\n` +
      `*Contoh:*\n` +
      `\`${m.prefix}fakexnxx Asep | Tutor bang | 100 | 2\``
    );
  }

  const [name, quote, likes = "0", dislikes = "0"] = text.split("|").map(v => v.trim())

  if (!name || !quote) {
    return m.reply(`❌ *GAGAL*\n\nParameter nama dan komentar wajib diisi.`);
  }

  try {
    await m.react("🕕")
    const date = moment().format("MMM D, YYYY, h:mm A")
    const canvas = createCanvas(650, 320)
    const ctx = canvas.getContext("2d")

    ctx.fillStyle = "#00008B"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "rgba(10,35,81,1)")
    gradient.addColorStop(1, "rgba(8,28,65,1)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#FF0000"
    ctx.fillRect(35, 50, 40, 15)

    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(35, 65, 40, 15)

    ctx.font = "bold 24px sans-serif"
    ctx.fillStyle = "#FFFFFF"
    ctx.textAlign = "left"
    ctx.fillText(name, 85, 75)

    ctx.font = "16px sans-serif"
    ctx.fillStyle = "rgba(255,255,255,0.7)"
    ctx.textAlign = "right"
    ctx.fillText(date, canvas.width - 45, 75)

    ctx.font = "22px sans-serif"
    ctx.fillStyle = "#FFFFFF"
    ctx.textAlign = "left"

    wrapText(ctx, quote, 45, 140, canvas.width - 90, 32)

    ctx.font = "bold 20px sans-serif"
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(`👍 ${likes}`, 60, 265)

    ctx.fillStyle = "rgba(255,255,255,0.7)"
    ctx.fillText(`👎 ${dislikes}`, 140, 265)

    ctx.fillText("Reply", 220, 265)
    ctx.fillText("Report", 310, 265)

    const buffer = await canvas.encode("png")

    await sock.sendMessage(m.chat, { image: buffer, caption: "✅ *BERHASIL MEMBUAT GAMBAR*" }, { quoted: m })
    await m.react("✅")
  } catch (err) {
    console.error(err)
    await m.react("❌")
    m.reply(`❌ *GAGAL*\n\nTerjadi kesalahan saat membuat gambar.\n\`${err.message}\``)
  }
}

export { pluginConfig as config, handler }
