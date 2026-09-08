export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { xpRange } from '../../src/lib/megami/levelling.js'

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let { min, max } = xpRange(user.level)
  let next = max - user.exp

  m.reply(`
📊 Level Info
🆙 Level: *${user.level}*
✨ XP: *${user.exp} / ${max}*
➡️ Menuju level ${user.level + 1}: *${next} XP lagi*
`.trim())
}

handler.help = ['ceklvl']
handler.tags = ['rpg']
handler.command = /^ceklvl$/i

export default handler
