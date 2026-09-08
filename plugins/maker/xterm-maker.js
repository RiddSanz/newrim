export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from "axios";
import { xtermBaseUrl, xtermApiKey, uploadToTermaiCdn } from "../../src/scraper/xtermai.js";

const pluginConfig = {
  name: ["fake-ngl", "triggered", "triggered-image", "triggered-video"],
  category: "maker",
  description: "Maker dari Rimuru by Anita 2 berbasis XTerm/Termai",
  usage: ".fake-ngl <teks> atau .triggered <reply gambar>",
  example: ".fake-ngl aku suka bot ini",
  isOwner: false,
  isPremium: false,
  cooldown: 8,
  energi: 2,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const c = String(m.command || "").toLowerCase();
  const q = String(m.text || m.args?.join(" ") || "").trim();
  try {
    if (c === "fake-ngl") {
      if (!q) return m.reply(`Contoh: ${m.prefix}fake-ngl Aku suka bot ini`);
      const url = `${xtermBaseUrl}/api/maker/ngl?text=${encodeURIComponent(q)}&emojiType=apple&backgroundColor=%23ffffff&key=${encodeURIComponent(xtermApiKey)}`;
      await m.react("🖼️");
      return sock.sendMessage(m.chat, { image: { url }, caption: "💌 *Fake NGL*" }, { quoted: m }).then(() => m.react("✅"));
    }
    const qmsg = m.quoted || m;
    const mime = String(qmsg?.mimetype || qmsg?.msg?.mimetype || m.mimetype || "");
    if (!/image\//i.test(mime)) return m.reply(`Reply gambar lalu gunakan *${m.prefix}${c}*`);
    const media = qmsg.download ? await qmsg.download() : await m.download();
    const img = await uploadToTermaiCdn(media);
    const type = c === "triggered-video" ? "video" : c === "triggered-image" ? "image" : "image";
    const out = await axios.get(`${xtermBaseUrl}/api/maker/triggered-${type}`, { params: { url: img, key: xtermApiKey }, responseType: type === "video" ? "arraybuffer" : "arraybuffer", timeout: 120000 });
    if (type === "video") {
      await sock.sendMessage(m.chat, { video: Buffer.from(out.data), mimetype: "video/mp4", caption: "⚡ *Triggered Video*" }, { quoted: m });
    } else {
      await sock.sendMessage(m.chat, { image: Buffer.from(out.data), caption: "⚡ *Triggered Image*" }, { quoted: m });
    }
    return m.react("✅");
  } catch (e) {
    console.error("[XTERM MAKER]", e);
    await m.react("❌").catch(() => {});
    return m.reply(`❌ ${e.message}`);
  }
}

export { pluginConfig as config, handler };
