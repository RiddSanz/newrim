export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { getRandomItem } from '../../src/lib/rimuru-game-data.js'
const pluginConfig = {
    name: 'bucin',
    alias: ['gombal', 'love', 'romantis'],
    category: 'fun',
    description: 'Random kata-kata bucin/romantis',
    usage: '.bucin',
    example: '.bucin',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
};

async function handler(m) {
    const quote = getRandomItem('bucin.json');
    
    if (!quote) {
        await m.reply('❌ Data tidak tersedia!');
        return;
    }
    
    await m.reply(`\`\`\`"${quote}"\`\`\`\n\n`);
}

export { pluginConfig as config, handler }
