export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import fs from "fs";
import path from "path";
import te from "../../src/lib/rimuru-error.js";

const dbFile = path.join(process.cwd(), "database", "hargabot.json");

function readDb() {
  try {
    if (fs.existsSync(dbFile)) {
      return JSON.parse(fs.readFileSync(dbFile, "utf-8"));
    }
  } catch (e) {}
  return { text: "" };
}

function writeDb(data) {
  try {
    const dir = path.dirname(dbFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
  } catch (e) {}
}

const pluginConfig = {
  name: "hargabot",
  alias: ["sethargabot"],
  category: "main",
  description: "Menampilkan dan mengatur daftar harga sewa bot",
  usage: ".hargabot / .sethargabot <teks>",
  example: ".sethargabot 1 Hari = 1k",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock, isOwner }) {
  const fullText = (m.text || m.body || "").trim();
  const prefix = m.prefix || ".";

  // Cek kalau command-nya sethargabot
  if (/^[\/.!#]?sethargabot/i.test(m.command || fullText)) {
    // Proteksi khusus Owner
    const checkOwner = m.isOwner || isOwner;
    if (!checkOwner) {
      await m.react("❌");
      return m.reply("❌ Perintah ini *khusus untuk Owner Bot*!");
    }

    const newText = fullText.replace(/^[\/.!#]?sethargabot\s*/i, "").trim();
    if (!newText) {
      return m.reply(`❌ Masukkan teksnya juga!\nContoh: \`${prefix}sethargabot ⭐ PRICE LIST ⭐\n1 Hari -> Rp1.000\``);
    }

    writeDb({ text: newText });
    await m.react("✅");
    return m.reply(`✅ Daftar harga untuk *hargabot* berhasil diubah!`);
  }

  // --- MEMBER BIASA & OWNER BISA AKSES DENGAN COMMAND .hargabot ---
  await m.react("⭐");

  try {
    const db = readDb();
    let caption = db.text;

    if (!caption) {
      caption = 
        `⭐ *PRICE LIST SEWA BOT TENDOU* ⭐\n\n` +
        `*1 Hari* ➔ *Rp1.000* ✨\n` +
        `*2 Hari* ➔ *Rp2.000* ✨\n` +
        `*3 Hari* ➔ *Rp3.000* ✨\n` +
        `*5 Hari* ➔ *Rp5.000* ✨\n` +
        `*7 Hari* ➔ *Rp7.500* ✨\n` +
        `*30 Hari* ➔ *Rp15.000 FREE PREMIUM BOT* ✨\n\n` +
        `📌 *Minat? Chat Owner ya!*\n` +
        `Terima kasih telah menggunakan Tendou Bot ❤️`;
    }

    await m.react("✅");
    return await sock.sendMessage(m.chat, {
      text: caption.trim()
    }, { quoted: m });

  } catch (error) {
    console.error("[Hargabot Error]:", error?.message);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
