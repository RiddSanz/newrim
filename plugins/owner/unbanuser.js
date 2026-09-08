export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m, { conn, text }) => {
    if (!text) throw 'Who wants to be unbanned? Provide the user\'s phone number.'
    let who
    if (m.isGroup) {
        if (!m.mentionedJid) throw 'No user mentioned to unban.'
        who = m.mentionedJid[0]
    } else {
        // Check if the input is a valid phone number
        let phoneNumber = text.replace(/[^0-9]/g, '') // Remove non-numeric characters
        who = phoneNumber + '@s.whatsapp.net'
    }
    let users = global.db.data.users
    if (users[who]) {
        users[who].banned = false
        users[who].banReason = ''
        conn.reply(m.chat, 'Done!', m)
    } else {
        throw 'User not found.'
    }
}
handler.help = ['unban']
handler.tags = ['owner']
handler.command = /^unban(user)?$/i
handler.rowner = true

export default handler
