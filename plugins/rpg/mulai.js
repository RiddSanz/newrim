export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  if (!user) return

  if (user.rpg) return m.reply('🧙 Kamu sudah memulai petualangan!')

  user.rpg = {
    level: 1,
    exp: 0,
    hp: 100,
    atk: 10,
    gold: 50,
    inventory: [],
    lastHunt: 0
  }

  m.reply(`🎮 Petualangan dimulai!\n\n📊 Level: 1\n❤️ HP: 100\n🪙 Gold: 50\n🔪 ATK: 10\n\nGunakan *.berburu* untuk mulai bertarung!`)
}

handler.help = ['mulai']
handler.tags = ['rpg']
handler.command = /^mulai$/i
handler.limit = false

export default handler
