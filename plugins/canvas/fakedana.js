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

async function generate(angka) {
  const fontUrl = "https://raw.githubusercontent.com/uploader762/dat2/main/uploads/49bbd8-1773045557233.otf" // Font alternatif jika lokal kosong
  const fontPath = path.join(process.cwd(), 'assets/fonts/Epep.ttf')

  try {
    if (!fs.existsSync(fontPath)) {
      await ensureFile(fontUrl, fontPath)
    }
    GlobalFonts.registerFromPath(fontPath, 'CartoonVibes')
  } catch (e) {
    console.error('[FAKEDANA FONT ERROR]', e)
  }

  const bgRes = await fetch('https://raw.githubusercontent.com/uploader762/dat3/main/uploads/9c18e0-1772932032348.jpg')
  const logoRes = await fetch('https://raw.githubusercontent.com/uploader762/dat3/main/uploads/d0f081-1772929197100.png')

  const bg = await loadImage(Buffer.from(await bgRes.arrayBuffer()))
  const logo = await loadImage(Buffer.from(await logoRes.arrayBuffer()))

  const canvas = createCanvas(bg.width, bg.height)
  const ctx = canvas.getContext('2d')

  ctx.drawImage(bg, 0, 0)

  ctx.font = '205px CartoonVibes, sans-serif'
  ctx.fillStyle = 'white'
  ctx.textBaseline = 'top'

  const x = 664
  const y = 293

  ctx.fillText(angka, x, y)

  const textWidth = ctx.measureText(angka).width
  const jarak = 11
  const logoSize = 370
  const offsetY = -31

  const logoX = x + textWidth + jarak
  const logoY = y + offsetY

  ctx.drawImage(logo, logoX, logoY, logoSize, logoSize)

  return canvas.toBuffer('image/png')
}

const pluginConfig = {
    name: 'fakedana',
    alias: ['danafake'],
    category: 'canvas',
    description: 'Membuat gambar saldo DANA palsu',
    usage: '.fakedana <nominal>',
    example: '.fakedana 10000',
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
    const cleanNominal = input.trim().replace(/[^0-9]/g, '')

    if (!cleanNominal || isNaN(cleanNominal)) {
        return m.reply(`⚠️ *Format Salah*\n\nPenggunaan:\n\`.fakedana <nominal>\`\n\nContoh:\n\`.fakedana 10000\``)
    }

    await m.react('⏳')
    
    try {
        const saldo = Number(cleanNominal).toLocaleString('id-ID')
        const fakeBuffer = await generate(saldo)

        await sock.sendMessage(m.chat, {
            image: fakeBuffer,
            caption: `✨ *Fake DANA Generated!*`
        }, { quoted: m })

        await m.react('✅')
        
    } catch (error) {
        console.error('[FAKEDANA ERROR]', error)
        await m.react('❌')
        await m.reply(`❌ *Terjadi Kesalahan:* ${error.message}`)
    }
}

export { pluginConfig as config, handler }
