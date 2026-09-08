export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


async function newup(m, { conn }) {
  const text = `╭━━━〔 ✦ RIMURU UPDATE ✦ 〕━━━╮
┃
┃  📢 UPDATE TERBARU
┃
┃  ✦ Gojo Merge
┃  • Fitur Gojo yang benar-benar belum
┃    ada di Rimuru telah ditambahkan.
┃  • Command dibuat pendek dan disesuaikan
┃    dengan struktur Rimuru-MD.
┃  • Fitur yang sudah ada tidak diduplikasi.
┃
┃  ✦ NIVID
┃  • Command: .nivid
┃  • Mengirim direct video URL sebagai MP4.
┃  • Sumber URL:
┃    src/data/Nita/anita.json
┃  • Jika satu URL gagal, sistem mencoba
┃    URL berikutnya.
┃
┃  ✦ Kompatibilitas
┃  • Handler mengikuti struktur Rimuru-MD.
┃  • Error ditangani agar kegagalan command
┃    tidak membuat bot crash.
┃
┃  🔧 COMMAND BARU
┃  • .nivid
┃  • .newup
┃
┃  📌 Catatan
┃  • Isi anita.json dengan direct URL video
┃    milik kamu sendiri.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`

  try {
    await conn.sendMessage(
      m.chat,
      { text },
      { quoted: m }
    )
  } catch (err) {
    console.error('[NEWUP]', err)
  }
}

newup.help = ['newup']
newup.tags = ['info']
newup.command = ['newup']

export default newup
