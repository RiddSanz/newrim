export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m, { conn, command, text }) => {
	
    if (!text) return conn.reply(m.chat, '• *Example :* .cekmemek elaina', m)
	
  conn.reply(m.chat, `
╭━━━━°「 *Memeknya ${text}* 」°
┃
┊• Nama : ${text}
┃• Memek : ${pickRandom(['Putih mulus','Hitam','Pink','Pink Mulus','Hitam mulus'])}
┊• Jembut : ${pickRandom(['Lebat','Tipis','Gada Jembut', 'Bersih'])}
┃• Lobang : ${pickRandom(['Perawan','Ga Perawan','Besar','Sempit'])}
╰═┅═━––––––๑
`.trim(), m)
}
handler.help = ['cekmemek *<name>*']
handler.tags = ['fun']
handler.command = /^cekmemek|cekmmk/i

export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
