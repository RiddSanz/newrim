import axios from 'axios';

const pluginConfig = {
    name: 'fakeff2',
    alias: ['fakefreefire2'],
    category: 'canvas',
    description: 'Membuat gambar ff',
    usage: '.fakeff2 <text>',
    example: '.fakeff2 Hai cantik',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock }) {

    const body =
        m.body ||
        m.text ||
        ''

    const nama =
        body.trim()
        .split(' ')
        .slice(1)
        .join(' ')

    if (!nama) {

        return m.reply(
`🎮 *FAKE FF 2*

Contoh:
${pluginConfig.example}`
        )
    }

    await m.react('🕕')

    try {

        const api =
`https://api.ourin.my.id/api/fake-free-fire-2?text=${encodeURIComponent(nama)}&bg=random`

        await sock.sendMessage(
            m.chat,
            {
                image: {
                    url: api
                },

                caption:
`🔥 *FAKE FREE FIRE 2*

👤 Nama:
${nama}`
            },
            { quoted: m }
        )

        await m.react('✅')

    } catch (e) {

        console.log(e)

        await m.react('❌')

        m.reply(
`❌ Error

${e.message}`
        )
    }
}
export { pluginConfig as config, handler };