export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import sharp from 'sharp'

let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) {
    return m.reply(`Reply sticker dengan command *${usedPrefix + command}*`)
  }

  let q = m.quoted
  let mime = q.mimetype || ''

  if (!/image\/webp/.test(mime)) {
    return m.reply('Itu bukan sticker')
  }

  try {
    let media = await q.download()

    let img = await sharp(media)
      .png({ quality: 100 })
      .toBuffer()

    await conn.sendFile(
      m.chat,
      img,
      'image.png',
      null,
      m
    )

  } catch (e) {
    console.error(e)
    m.reply('Gagal convert sticker ke image')
  }
}

handler.help = ['toimg']
handler.tags = ['sticker']
handler.command = ['toimg', 'toimage']

handler.register = true
handler.limit = true

export default handler
