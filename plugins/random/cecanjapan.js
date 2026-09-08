export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m, { conn }) => {
  try {
    let url = 'https://api.siputzx.my.id/api/r/cecan/japan'
    let caption = `🇯🇵 *Random Cecan Jepang*\nManisnya bikin pengen liburan ke Tokyo 😳`

    await conn.sendFile(m.chat, url, 'cecan-japan.jpg', caption, m)
  } catch (e) {
    console.error(e)
    m.reply(`❌ Gagal ambil gambar cecan Jepang.\n${e}`)
  }
}

handler.help = ['cecanjapan']
handler.tags = ['random']
handler.command = /^cecanjapan$/i
handler.limit = true

export default handler
