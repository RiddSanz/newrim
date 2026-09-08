export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from 'axios'

let handler = async (m, { conn }) => {
    try {
        const url = `${global.APIs.deline}/random/ppcouple`

        const { data } = await axios.get(url)

        if (!data.status) throw 'API error'

        const { cowo, cewe } = data.result

        await conn.sendFile(m.chat, cowo, 'cowo.jpg', '👦 PP Couple Cowo', m)
        await conn.sendFile(m.chat, cewe, 'cewe.jpg', '👧 PP Couple Cewe', m)

    } catch (e) {
        console.error(e)
        m.reply('Gagal mengambil PP couple.')
    }
}

handler.help = ['ppcp', 'ppcouple']
handler.tags = ['random']
handler.command = /^(ppcp|ppcouple)$/i
handler.limit = true

export default handler
