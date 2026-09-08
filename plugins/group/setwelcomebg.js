export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fs from 'fs'
import path from 'path'

const handler = async (m, { usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''

  if (!mime.startsWith('image/')) {
    return m.reply(`Reply/kirim gambar dengan caption:\n${usedPrefix + command}`)
  }

  const dir = '/home/container/src/Aesthetic'
  const file = path.join(dir, 'welcome-bg.jpg')

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const buffer = await q.download()

  fs.writeFileSync(file, buffer)

  m.reply(`✅ Background welcome berhasil disimpan!\n\n📁 ${file}`)
}

handler.help = ['setwelcomebg']
handler.tags = ['owner']
handler.command = /^(setwelcomebg|setbgwelcome)$/i
handler.owner = true

export default handler
