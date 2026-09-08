export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m, { conn, args }) => {
    try {
        if (!args[0]) throw 'Input Jid People/Groups'
        const jid = args[0]
        await conn.chatModify({
          delete: true,
          lastMessages: [{
            key: m.key,
            messageTimestamp: m.messageTimestamp
          }]
        }, jid);
      conn.reply(m.chat, `Success Delete Chat for ${jid}`, m);
    } catch (error) {
      console.error(error);
      conn.reply(m.chat, 'Terjadi Kesalahan Saat Menghapus Chat, Mohon Perhatikan Jidnya', m);
    }
  }

  handler.help = ['clearchat']
  handler.tags = ['owner']
  handler.owner = true
  handler.command = /^(clearchat)$/i

  export default handler
