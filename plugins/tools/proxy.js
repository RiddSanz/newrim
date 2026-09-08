export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


/**
 ╔══════════════════════
      ⧉  [proxy] — [tools]
╚══════════════════════

  ✺ Type     : Plugin ESM
  ✺ Source   : https://whatsapp.com/channel/0029VbAXhS26WaKugBLx4E05
  ✺ Creator  : SXZnightmare
  ✺ API     : https://zelapioffciall.koyeb.app
*/

let handler = async (m, { conn, usedPrefix, command }) => { 
    try {
        await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
        
        const response = await fetch('https://zelapioffciall.koyeb.app/random/proxy');
        if (!response.ok) {
            throw new Error(`🍂 *HTTP Error!* Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.status || !data.proxy) {
            throw new Error('🍂 *Respons API tidak valid!* Format data tidak sesuai');
        }
        
        const proxy = data.proxy;
        const message = `
✅ *PROXY BERHASIL DITEMUKAN!*

📍 *IP Address:* ${proxy.ip}
🚪 *Port:* ${proxy.port}
🌍 *Country:* ${proxy.country}
🏢 *Organization:* ${proxy.org}
⚡ *Latency:* ${proxy.latency} ms
🕵️ *Anonymity:* ${proxy.anonymity}
🔗 *Full Address:* ${proxy.full}
        `.trim();
        
        await conn.reply(m.chat, message, m);
        
    } catch (error) {
        await conn.reply(m.chat, `🍂 *Gagal mengambil proxy!*\nError: ${error.message}`, m);
    } finally {
        await conn.sendMessage(m.chat, { react: { text: '', key: m.key } });
    }
};

handler.help = ['proxy'];
handler.tags = ['tools'];
handler.command = /^(proxy)$/i;
handler.limit = true;
handler.register = false; // true kan jika ada fitur register atau daftar di bot mu.

export default handler;
