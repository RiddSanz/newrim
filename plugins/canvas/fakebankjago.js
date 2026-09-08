export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function ensureFile(url, file) {
  const dir = path.dirname(file)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(file)) {
    const res = await fetch(url)
    const buf = Buffer.from(await res.arrayBuffer())
    fs.writeFileSync(file, buf)
  }
}

async function generateImage(saldo, greet) {
  const bgUrl = "https://raw.githubusercontent.com/uploader762/dat2/main/uploads/52e39f-1773064858080.jpg"
  const fontUrl = "https://raw.githubusercontent.com/uploader762/dat2/main/uploads/49bbd8-1773045557233.otf"
  const font2Url = "https://raw.githubusercontent.com/uploader762/dat1/main/uploads/203827-1773063086445.ttf"

  const font1 = path.join(__dirname, '../../tmp/fonts/Fontspring-DEMO-ceraroundpro-medium.otf')
  const font2 = path.join(__dirname, '../../tmp/fonts/Roboto_Medium.ttf')

  await ensureFile(fontUrl, font1)
  await ensureFile(font2Url, font2)

  GlobalFonts.registerFromPath(font1, "CustomFont")
  GlobalFonts.registerFromPath(font2, "GreetingFont")

  const bgRes = await fetch(bgUrl)
  const bg = await loadImage(Buffer.from(await bgRes.arrayBuffer()))

  const canvas = createCanvas(bg.width, bg.height)
  const ctx = canvas.getContext("2d")

  ctx.drawImage(bg, 0, 0, bg.width, bg.height)

  const numberText = saldo
  const baseX = 2470
  const baseY = 894

  ctx.font = "125px CustomFont"
  ctx.fillStyle = "black"

  const numberWidth = ctx.measureText(numberText).width
  const numberX = baseX - numberWidth

  ctx.fillText(numberText, numberX, baseY)

  const rpText = "Rp"
  const rpWidth = ctx.measureText(rpText).width
  const rpX = numberX - rpWidth - 4

  ctx.fillText(rpText, rpX, baseY)

  ctx.font = "93px GreetingFont"
  ctx.fillStyle = "gray"

  ctx.fillText(greet, 98, 86)

  return canvas.toBuffer('image/png')
}

const pluginConfig = {
    name: 'fakebankjago',
    alias: ['bankjago', 'fakejago'],
    category: 'canvas',
    description: 'Membuat gambar bukti saldo Bank Jago palsu',
    usage: '.fakebankjago <nama>,<nominal>',
    example: '.fakebankjago Zann,10000',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
}

async function handler(m, { sock, text }) {
    const input = text || m.text?.split(' ').slice(1).join(' ') || ''
    const [nama, nominal] = input.split(',')

    if (!nama || !nominal) {
        return m.reply(`⚠️ *Format Salah*\n\nPenggunaan:\n\`.fakebankjago <nama>,<nominal>\`\n\nContoh:\n\`.fakebankjago Zann,10000\``)
    }

    const cleanNominal = nominal.trim().replace(/[^0-9]/g, '')
    if (!cleanNominal || isNaN(cleanNominal)) {
        return m.reply(`⚠️ *Harap masukkan angka nominal saldo yang valid!*`)
    }

    await m.react('⏳')
    
    try {
        const saldo = Number(cleanNominal).toLocaleString('id-ID')
        const hour = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta', hour: '2-digit', hour12: false })
        const h = Number(hour)
        let waktu = 'Malam'
        if (h >= 4 && h < 11) waktu = 'Pagi'
        else if (h >= 11 && h < 15) waktu = 'Siang'
        else if (h >= 15 && h < 18) waktu = 'Sore'

        const fakeBuffer = await generateImage(saldo, `Selamat ${waktu}, ${nama.trim()}`)

        await sock.sendMessage(m.chat, {
            image: fakeBuffer,
            caption: `✨ *Fake Bank Jago Generated!*`
        }, { quoted: m })

        await m.react('✅')
        
    } catch (error) {
        console.error('[FAKEBANKJAGO ERROR]', error)
        await m.react('❌')
        await m.reply(`❌ *Terjadi Kesalahan:* ${error.message}`)
    }
}

export { pluginConfig as config, handler }
