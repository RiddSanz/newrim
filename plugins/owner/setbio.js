export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m, { conn, text }) => {
  if (!text) throw `Masukan Text Untuk Bio Baru Bot`
    try {
   await conn.updateProfileStatus(text).catch(_ => _)
   conn.reply(m.chat, 'Sukses Mengganti Bio Bot', m)
} catch {
      throw 'Yah Error.. :D'
    }
}
handler.help = ['setbio']
handler.tags = ['owner']
handler.command = /^(setbio)$/i
handler.owner = true

export default handler
