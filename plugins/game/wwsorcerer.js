export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { nightActionHandler } from './werewolf.js'
const pluginConfig = {
    name: 'wwsorcerer',
    alias: ['sorcerer', 'wws'],
    category: 'game',
    description: 'Sorcerer night action - Check if target is Seer',
    usage: '.wwsorcerer <nomor>',
    example: '.wwsorcerer 3',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: true,
    cooldown: 0,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock }) {
    return await nightActionHandler(m, { sock })
}

export { pluginConfig as config, handler }
