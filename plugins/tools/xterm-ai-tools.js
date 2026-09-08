export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from "axios";
import { xtermBaseUrl, xtermApiKey, uploadToTermaiCdn } from "../../src/scraper/xtermai.js";

const pluginConfig = {
  name: ["objectdetection"],
  category: "tools",
  description: "Tool AI XTerm/Termai dari Anita 2",
  usage: ".objectdetection (reply gambar)",
  example: ".objectdetection",
  isOwner: false,
  isPremium: false,
  cooldown: 8,
  energi: 3,
  isEnabled: true,
};

async function getImage(m) {
  const q = m.quoted;
  const mime = String(q?.mimetype || q?.msg?.mimetype || m.mimetype || m.msg?.mimetype || "");
  if (!/image\//i.test(mime)) return null;
  return q?.download ? q.download() : m.download();
}

async function handler(m, { sock }) {
  const c = String(m.command || "").toLowerCase();
  if (c !== "objectdetection") return m.reply(`Perintah tidak dikenal: ${c}`);
  const media = await getImage(m);
  if (!media) return m.reply(`Reply/kirim gambar lalu gunakan *${m.prefix}objectdetection*`);
  try {
    await m.react("🧠");
    const url = await uploadToTermaiCdn(media);
    const res = await axios.get(`${xtermBaseUrl}/api/tools/object-detection`, {
      params: { url, key: xtermApiKey },
      timeout: 120000,
    });
    const data = res.data?.data || res.data;
    const objects = Array.isArray(data?.DetectedObjects) ? data.DetectedObjects : [];
    if (!objects.length) {
      const text = data?.response || data?.result || data?.msg || "Tidak ada objek yang terdeteksi.";
      await m.reply(`🔎 *Object Detection*\n\n${text}`);
      return m.react("✅");
    }
    const lines = objects.map((obj, i) => {
      const score = typeof obj.Score === "number" ? `${(obj.Score * 100).toFixed(1)}%` : String(obj.Score ?? "-");
      const b = obj.Bounds;
      const bounds = b && typeof b === "object" ? ` | bounds: ${JSON.stringify(b)}` : "";
      return `${i + 1}. *${obj.Label || "Unknown"}* — ${score}${bounds}`;
    });
    await m.reply(`🔎 *Object Detection*\n\n${lines.join("\n")}`);
    return m.react("✅");
  } catch (e) {
    console.error("[XTERM OBJECT DETECTION]", e);
    await m.react("❌").catch(() => {});
    return m.reply(`❌ ${e.message}`);
  }
}

export { pluginConfig as config, handler };
