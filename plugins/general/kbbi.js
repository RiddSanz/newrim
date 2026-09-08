export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import safeJson from "../../src/lib/rimuru-safe-json.js";
import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  await m.react('✨')

  if (!text) {
    return conn.reply(m.chat, '*Example :* .kbbi Anu', m)
  }

  let url = `${global.APIs.faa}/faa/kbbi?q=${encodeURIComponent(text)}`
  let res = await fetch(url)
  let json = await safeJson(res, { status: false })

  if (!json.status || !json.result) return

  let hasil = `
${json.result.kata}

${json.result.keterangan}
`.trim()

  conn.reply(m.chat, hasil, m)
}

handler.help = ['kbbi']
handler.tags = ['internet']
handler.command = /^kbbi$/i
handler.limit = true

export default handler
