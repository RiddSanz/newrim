export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas"
import path from "path"
import axios from "axios"
import te from "../../src/lib/rimuru-error.js"

// Mendaftarkan font Arial dari folder SAMPEL/maker
try {
  GlobalFonts.registerFromPath(path.join(process.cwd(), "SAMPEL", "maker", "arial.ttf"), "Times New Roman")
} catch (e) {
  // abaikan jika font tidak ada, akan pakai bawaan
}

const pluginConfig = {
  name: "juaraml",
  alias: ["sertifikatml"],
  category: "canvas",
  description: "Membuat sertifikat Juara ML (Mobile Legends).",
  usage: ".juaraml [nama]",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 2,
  isEnabled: true,
}

async function handler(m, { sock, text }) {
  if (!text) {
    return m.reply(
      `📝 *CARA PENGGUNAAN*\n\n` +
      `Kirim perintah dengan menyertakan nama yang ingin dicetak di sertifikat:\n` +
      `\`${m.prefix}juaraml Asep Gaming\``
    );
  }

  const name = text.trim();
  if (name.length > 50) {
    return m.reply(`❌ *GAGAL*\n\nNama terlalu panjang! Maksimal 50 karakter.`);
  }

  try {
    await m.react("🕕")
    
    const backgroundUrl = "https://raw.githubusercontent.com/kayzzaoshi-code/Uploader/main/file_1772230373362.jpeg"
    const bgRes = await axios.get(backgroundUrl, { responseType: "arraybuffer" })
    const bg = await loadImage(Buffer.from(bgRes.data))

    const canvas = createCanvas(bg.width, bg.height)
    const ctx = canvas.getContext("2d")

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

    let fontSize = 45
    ctx.font = `bold italic ${fontSize}px "Times New Roman"`
    ctx.fillStyle = "#e6c85e"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const maxTextWidth = 480
    while (ctx.measureText(name.toUpperCase()).width > maxTextWidth && fontSize > 10) {
      fontSize--
      ctx.font = `bold italic ${fontSize}px "Times New Roman"`
    }

    const certX = canvas.width * 0.665
    const certY = canvas.height * 0.555

    ctx.save()
    ctx.fillStyle = "#090909"
    ctx.fillRect(certX - 250, certY - 40, 500, 80)
    ctx.restore()

    ctx.fillText(name.toUpperCase(), certX, certY)

    const buffer = await canvas.encode("png")

    await sock.sendMessage(m.chat, { image: buffer, caption: "✅ *SERTIFIKAT BERHASIL DICETAK*" }, { quoted: m })
    await m.react("✅")
  } catch (err) {
    console.error(err)
    await m.react("❌")
    m.reply(`❌ *GAGAL*\n\nTerjadi kesalahan saat memproses gambar.\n\`${err.message}\``)
  }
}

export { pluginConfig as config, handler }
