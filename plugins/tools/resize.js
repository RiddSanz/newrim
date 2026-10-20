import sharp from 'sharp'

let handler = async (m, { conn }) => {
  const q = m.quoted || m
  const mime = q.mimetype || q.msg?.mimetype || ''

  if (!mime.startsWith('image/')) return m.reply('Reply gambar!')

  try {
    const buffer = await q.download()
    if (!buffer?.length) return m.reply('Gagal mengunduh gambar. Coba kirim ulang.')

    const output = await sharp(buffer)
      .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer()

    await conn.sendMessage(m.chat, { image: output }, { quoted: m })
  } catch (error) {
    console.error('[resize] Gagal memproses gambar:', error)
    return m.reply('Gagal mengubah ukuran gambar. Pastikan file gambar valid.')
  }
}

handler.command = ['resize']
export default handler
