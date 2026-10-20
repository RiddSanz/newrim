const pluginConfig = {
    name: 'credit',
    alias: [],
    category: 'main',
    description: 'Menampilkan credit Rimuru MD.',
    usage: '.credit',
    example: '.credit',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true,
}

async function handler(m, { sock }) {
    const text = "Rimuru MD"

    await m.reply(text)
}

export { pluginConfig as config, handler }
