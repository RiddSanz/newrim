export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { games } from '../../src/lib/rimuru-games.js'

games.register('tebakjkt48', {
    alias: ['jkt48', 'jkt'],
    emoji: '🎀',
    title: 'TEBAK JKT48',
    description: 'Tebak member JKT48',
    hasImage: true
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakjkt48')
export { pluginConfig as config, handler, answerHandler }
