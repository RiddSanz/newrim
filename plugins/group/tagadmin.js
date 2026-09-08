export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m, { conn, participants, text }) => {
  if (!m.isGroup) throw '…ini bukan grup.'

  let admins = participants
    .filter(v => v.admin)
    .map(v => v.id)

  if (!admins.length) throw '…adminnya hilang? aneh.'

  let alasan = text ? `\n\nalasan: ${text}` : ''

  let teks = `🎸 *tag admin dulu deh...*\n\n`
  teks += admins.map(v => `@${v.split('@')[0]}`).join('\n')
  teks += `${alasan}\n\n_...cepet respon ya._`

  await conn.sendMessage(m.chat, {
    text: teks,
    mentions: admins
  }, { quoted: m })
}

handler.help = ['tagadmin']
handler.tags = ['group']
handler.command = /^tagadmin$/i
handler.group = true

export default handler
