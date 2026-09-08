export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fetch from 'node-fetch'
let handler = async (m) => {
let arr = Object.entries(db.data.chats).filter(user => !user[1].expired >= 1).map(user => user[0])
let boy = `Sukses Menghapus ${arr.length} Chat`
for (let x of arr) delete db.data.chats[x]
await m.reply(boy)
}
handler.help = ['resetchat']
handler.tags = ['owner']
handler.command = /^(resetchat)$/i
handler.owner = true
export default handler
