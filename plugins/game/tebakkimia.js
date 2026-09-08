export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { games } from '../../src/lib/rimuru-games.js'

games.register('tebakkimia', {
    alias: ['kimia', 'chemistry', 'unsur'],
    emoji: '🧪',
    title: 'TEBAK KIMIA',
    description: 'Tebak unsur kimia',
    questionField: 'unsur',
    answerField: 'lambang'
})

const { config: pluginConfig, handler, answerHandler } = games.createPlugin('tebakkimia')
export { pluginConfig as config, handler, answerHandler }
