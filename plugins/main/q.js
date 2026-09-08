export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m, { conn }) => {
  try {
    if (!m.quoted) {
      return m.reply('Reply pesan yang mau diambil JSON-nya')
    }

    let json = m.quoted?.msg || m.quoted?.message || m.quoted
    let result = JSON.stringify(json, null, 2)

    if (result.length > 4000) {
      return conn.sendFile(
        m.chat,
        Buffer.from(result),
        'message.json',
        '📦 JSON terlalu panjang, dikirim sebagai file',
        m
      )
    }

    m.reply(`📦 *QUOTED MESSAGE JSON*\n\n\`\`\`json\n${result}\n\`\`\``)

  } catch (e) {
    m.reply('❌ Error:\n' + e.message)
  }
}

handler.help = ['q']
handler.tags = ['owner']
handler.command = /^q$/i

handler.owner = true
handler.limit = false

export default handler
