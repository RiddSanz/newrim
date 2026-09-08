export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { resetSider } from '../../src/lib/listsider.js';
const pluginConfig = {
name: 'risetsider',
alias: [],
category: 'group',
isGroup: true,
isAdmin: true,
cooldown: 10,
isEnabled: true
}

async function handler(m){

resetSider(m.chat)

m.reply(`✅ List sider di group ini sudah di riset.`)

}

export { pluginConfig as config, handler };
