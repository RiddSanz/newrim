export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m, { conn, usedPrefix }) => {
	let caption = `
🚨 Silahkan Pilih Misi Kamu:

🛵 Ojek
🚀 Roket
👮 Polisi
🚶 Rob
☠️ Hitman
🚖 Taxy

Contoh:
${usedPrefix}ojek
`.trim()
	m.reply(caption)
}
handler.help = ['misi', 'misirpg']
handler.tags = ['info']
handler.command = /^(misi(rpg)?|misirpg)$/i
handler.register = true
handler.group = true
handler.rpg = true
export default handler
