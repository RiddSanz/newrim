export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


// gausah hapus credit mending tambahin aja nama lu di list

import fs from 'fs'
import { prepareWAMessageMedia } from '@itsliaaa/baileys'

let handler = async (m, { conn }) => {
    const urlB = 'https://github.com/himanackerman'

    const thumb = fs.readFileSync('../../media/thumbnail.jpg')

    const { imageMessage: image } = await prepareWAMessageMedia({
        image: thumb
    }, {
        upload: conn.waUploadToServer,
        mediaTypeOverride: 'thumbnail-link'
    })

    image.width = 1280
    image.height = 720

    const teks = `
❏ Nana
❏ Kyu
❏ Ham
❏ han
❏ Renz 
❏ Rin
❏ Kano
❏ kaizen
❏ Fikri 
❏ Ryu 

❏ ShirokamiRyzen (Penyedia Base Nao MD)
❏ ItsLiaaa (Penyedia Baileys)

❏ Penyedia Layanan API
❏ Penyedia Server/VPS

❏ Contributor
❏ Tester

❏ Hilman (Creator Ryo Yamada - MD)

❏ Semua Supporter
❏ Semua User Ryo Yamada MD
`.trim()

    await conn.sendMessage(m.chat, {
        text: `${urlB}\n\n${teks}`,
        linkPreview: {
            'matched-text': urlB,
            title: 'Ryo Yamada MD',
            description: 'Ryo Yamada - MD',
            previewType: 0,
            jpegThumbnail: thumb,
            highQualityThumbnail: image,
            linkPreviewMetadata: {
                linkMediaDuration: 0,
                socialMediaPostType: 4
            }
        }
    }, { quoted: m })
}

handler.help = ['tqto']
handler.tags = ['info']
handler.command = /^(tqto|thanks|credit|credits)$/i

export default handler
