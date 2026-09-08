export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { games } from '../../src/lib/rimuru-games.js'

games.register('tebakepep', {
    alias: ['tebakff', 'tebakfreefire'],
    emoji: '🔫',
    title: 'TEBAK EPEP',
    description: 'Tebak karakter Free Fire',
    hasImage: true
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakepep')
export { pluginConfig as config, handler, answerHandler }
