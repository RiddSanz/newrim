export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m, { conn, isOwner, isPrems }) => {
  let who = m.isGroup ? (m.mentionedJid?.[0] || m.sender) : m.sender
  const user = global.db.data.users[who]

  if (!user) return m.reply('Pengguna tidak ditemukan di database.')

  const name = user.registered ? user.name : await conn.getName(who)
  const limitNow = user.limit || 0
  const status = isOwner
    ? 'Owner'
    : isPrems
      ? 'Premium User'
      : user.level > 999
        ? 'Elite User'
        : 'Free User'

  return m.reply(
    `👤 *${name}*\n\n` +
    `🏷️ Status : *${status}*\n` +
    `✨ Limit  : *${isPrems ? 'Unlimited' : limitNow}*`
  )
}

handler.help = ['limit']
handler.tags = ['xp']
handler.command = /^(limit)$/i
handler.register = false

export default handler
