export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import safeJson from "../../src/lib/rimuru-safe-json.js";
import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  await m.react('✨')

  if (!text) return

  let url = `${global.APIs.faa}/faa/doa?q=${encodeURIComponent(text)}`
  let res = await fetch(url)
  let json = await safeJson(res, { status: false, data: [] })

  if (!json.status || !json.data?.length) return

  let hasil = json.data.map(d => `
${d.doa}

${d.ayat}

${d.latin}

${d.artinya}
`.trim()).join('\n\n')

  conn.reply(m.chat, hasil, m)
}

handler.help = ['doa <kata kunci>']
handler.tags = ['internet']
handler.command = /^doa$/i
handler.limit = true

export default handler
