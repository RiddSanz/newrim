export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { wallpaper } from "../../src/lib/megami/scrape.js";

let handler = async (m, { conn, command, text, usedPrefix }) => {
    let query = text
    if (!query) throw `Input *URL*`;
    m.reply(wait);
    try {
        let wallpapers = await wallpaper(query);
        let randomWallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];
        let cap = "Source: wallpaperflare.com";
        conn.sendMessage(m.chat, { image: { url: randomWallpaper }, caption: cap }, m);
    } catch (e) {
        console.log(e);
        m.reply(`Error`);
    }
};

handler.help = ['wallpaper' + ' <query>']
handler.tags = ['downloader']
handler.command = /^wallpaper$/i

export default handler

