export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fs from 'fs'

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''

    if (!mime.startsWith('image/'))
        return m.reply('Reply / kirim gambar untuk dijadikan thumbnail bot')

    let img = await q.download()

    fs.writeFileSync('./thumbnail.jpg', img)

    m.reply('✅ Done wok')
}

handler.help = ['setthumb']
handler.tags = ['owner']
handler.command = /^setthumb$/i
handler.owner = true
handler.limit = false

export default handler
