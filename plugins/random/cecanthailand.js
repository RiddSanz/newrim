export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m, { conn }) => {
  try {
    let url = 'https://api.siputzx.my.id/api/r/cecan/thailand'
    await conn.sendFile(m.chat, url, 'cecan-thai.jpg', '', m)
  } catch (e) {
    console.error(e)
    m.reply(`❌ Gagal ambil gambar cecan Thailand.\n${e}`)
  }
}

handler.help = ['cecanthai']
handler.tags = ['random']
handler.command = /^cecanthai$/i
handler.limit = true

export default handler
