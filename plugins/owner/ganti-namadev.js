import { RIMURU_DEVELOPER } from "../../rimuru.js";
export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fs from 'fs'
import path from 'path'
import te from '../../src/lib/rimuru-error.js'
const pluginConfig = {
    name: 'ganti-namadev',
    alias: ['setnamadev', 'setnamedev', 'gantideveloper'],
    category: 'owner',
    description: 'Ganti nama developer di rimuru.js',
    usage: '.ganti-namadev <nama baru>',
    example: '.ganti-namadev Lucky Archz',
    isOwner: true,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 0,
    isEnabled: true
}

async function handler(m, { sock, config }) {
    const newName = m.args.join(' ')
    
    if (!newName) {
        return m.reply(`👨‍💻 *ɢᴀɴᴛɪ ɴᴀᴍᴀ ᴅᴇᴠᴇʟᴏᴘᴇʀ*\n\n> Nama saat ini: *${RIMURU_DEVELOPER || '-'}*\n\n*Penggunaan:*\n\`${m.prefix}ganti-namadev <nama baru>\``)
    }
    
    try {
        const configPath = path.join(process.cwd(), 'rimuru.js')
        let configContent = fs.readFileSync(configPath, 'utf8')
        
        configContent = configContent.replace(
            /export let RIMURU_DEVELOPER = \"[^\"]*\";/,
            `export let RIMURU_DEVELOPER = ${JSON.stringify(newName)};`
        )
        
        fs.writeFileSync(configPath, configContent)
        
        // Developer source lives in rimuru.js; restart bot after changing it.
        await m.reply(`✅ *ʙᴇʀʜᴀsɪʟ*

> Nama developer diganti ke: *${newName}*`)
        await m.reply('💙 Restart bot agar nama developer baru dipakai di semua modul.')
        
    } catch (error) {
        await m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }
