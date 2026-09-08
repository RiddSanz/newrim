export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import moment from 'moment-timezone'

let handler = async (m, { text }) => {
  if (!text) return m.reply('❗ Contoh: .order nokos indo')

  if (!global.db.data.store) global.db.data.store = {}
  if (!global.db.data.store.orders) global.db.data.store.orders = []

  const waktu = moment().tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss')

  global.db.data.store.orders.push({
    from: m.sender,
    barang: text,
    time: waktu
  })

  const caption = `
🛒 *ORDER DITERIMA*

• *Barang:* ${text}
• *Waktu:* ${waktu} WIB

Silakan tunggu admin memproses pesanan kamu 🙏
Ketik *.pay* untuk info pembayaran 💳
`.trim()

  m.reply(caption)
}

handler.help = ['order <barang>']
handler.tags = ['store']
handler.command = /^order$/i

export default handler
