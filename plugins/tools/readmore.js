export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
    name: 'readmore',
    alias: ['selengkapnya', 'spoiler'],
    category: 'tools',
    description: 'Membuat teks baca selengkapnya (spoiler)',
    usage: '.readmore <text_awal>|<text_akhir>',
    example: '.readmore Hai|Ini adalah pesan rahasia',
    isGroup: false,
    isBotAdmin: false,
    isAdmin: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
};

function handler(m, { sock }) {
    const text = m.text;
    
    if (!text) {
        return m.reply(`⚠️ Masukan text!\nContoh: \`${m.prefix}${m.command} Halo|Ini teks tersembunyi\``);
    }
    
    let [l, r] = text.split('|');
    if (!l) l = '';
    if (!r) r = '';
    
    const readmore = String.fromCharCode(8206).repeat(4001);
    
    m.reply(l + readmore + r);
}

export { pluginConfig as config, handler }
