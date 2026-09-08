export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import safeJson from "../../src/lib/rimuru-safe-json.js";
import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  await m.react('✨')

  if (!text) {
    return conn.reply(m.chat, '*Example :* .gimg Ryo Yamada', m)
  }

  let url = `${global.APIs.faa}/faa/google-image?query=${encodeURIComponent(text)}`
  let res = await fetch(url)
  let json = await safeJson(res, { status: false })

  if (!json.status || !json.result?.length) return

  for (let img of json.result.slice(0, 5)) {
    await conn.sendFile(m.chat, img, 'image.jpg', '', m)
  }
}

handler.help = ['gimg']
handler.tags = ['internet']
handler.command = /^gimg$/i
handler.limit = true

export default handler
