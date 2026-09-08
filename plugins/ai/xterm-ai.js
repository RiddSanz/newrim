export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from "axios";
import { xtermImageUrl, xtermJson, uploadToTermaiCdn, xtermBaseUrl, xtermApiKey } from "../../src/scraper/xtermai.js";

const pluginConfig = {
  name: ["animediff", "dalle3", "geminiimage", "clay", "luma", "img2video", "i2v", "cover", "covers", "faceswap", "faceswap-reset", "faceswap-change", "babygenerator", "buatanak"],
  alias: [],
  category: "ai",
  description: "Fitur AI XTerm/Termai yang diambil dari Rimuru by Anita 2",
  usage: ".<command> sesuai media/prompt",
  example: ".animediff anime girl",
  isOwner: false,
  isPremium: false,
  cooldown: 10,
  energi: 10,
  isEnabled: true,
};

const faceSessions = new Map();
const babySessions = new Map();

const getMedia = async (m, type) => {
  const q = m.quoted;
  const mime = String(q?.mimetype || q?.msg?.mimetype || m.mimetype || m.msg?.mimetype || "");
  if (type === "image" && !/image\//i.test(mime)) return null;
  if (type === "audio" && !/audio\//i.test(mime)) return null;
  if (q?.download) return await q.download();
  if (m.download) return await m.download();
  return null;
};

async function streamResult(pathname, body, onData, prompt = "") {
  const res = await axios({
    method: "post",
    url: `${xtermBaseUrl}${pathname}`,
    params: { key: xtermApiKey, ...(prompt ? { prompt } : {}) },
    data: body,
    responseType: "stream",
    timeout: 180000,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    validateStatus: () => true,
  });
  if (res.status >= 400) throw new Error(`XTerm HTTP ${res.status}`);
  let pending = "";
  return await new Promise((resolve, reject) => {
    const stream = res.data;
    const fail = (e) => { try { stream.destroy(); } catch {} reject(e); };
    stream.on("error", fail);
    stream.on("data", async (chunk) => {
      pending += chunk.toString();
      const lines = pending.split(/\r?\n/);
      pending = lines.pop() || "";
      for (const line of lines) {
        const match = line.match(/^data:\s*(.+)$/);
        if (!match) continue;
        try {
          const data = JSON.parse(match[1]);
          const done = await onData(data);
          if (done) {
            try { stream.destroy(); } catch {}
            resolve(data);
            return;
          }
        } catch (e) {
          fail(e);
          return;
        }
      }
    });
    stream.on("close", () => resolve(null));
  });
}

async function handler(m, { sock }) {
  const c = String(m.command || "").toLowerCase();
  const q = String(m.text || m.args?.join(" ") || "").trim();

  try {
    if (c === "animediff") {
      if (!q) return m.reply(`Contoh: ${m.prefix}animediff anime girl, cinematic lighting`);
      await m.react("🕒");
      const url = await xtermImageUrl("/api/text2img/animediff", { prompt: q });
      await sock.sendMessage(m.chat, { image: { url }, caption: `🎨 *AnimeDiff*\n\nPrompt: ${q}` }, { quoted: m });
      return m.react("✅");
    }

    if (c === "dalle3") {
      if (!q) return m.reply(`Contoh: ${m.prefix}dalle3 cyberpunk city at night`);
      await m.react("🕒");
      const url = await xtermImageUrl("/api/text2img/dalle3", { prompt: q });
      await sock.sendMessage(m.chat, { image: { url }, caption: `🖌️ *DALL·E 3*\n\nPrompt: ${q}` }, { quoted: m });
      return m.react("✅");
    }

    if (c === "geminiimage") {
      const media = await getMedia(m, "image");
      if (!media) return m.reply(`Reply/kirim gambar lalu gunakan ${m.prefix}geminiimage <pertanyaan>`);
      if (!q) return m.reply(`Contoh: ${m.prefix}geminiimage jelaskan gambar ini`);
      await m.react("🧠");
      const result = await xtermJson("/api/img2txt/gemini-image", { image: media.toString("base64"), query: q });
      const text = result?.response || result?.msg || result?.text || "Tidak ada jawaban dari server.";
      await m.reply(String(text));
      return m.react("✅");
    }

    if (c === "clay") {
      const media = await getMedia(m, "image");
      if (!media) return m.reply(`Reply/kirim gambar lalu gunakan ${m.prefix}clay`);
      await m.react("🧱");
      const url = await uploadToTermaiCdn(media);
      const out = await xtermImageUrl("/api/img2img/clay-filters", { url });
      await sock.sendMessage(m.chat, { image: { url: out }, caption: "✨ *Clay Filter*" }, { quoted: m });
      return m.react("✅");
    }

    if (["luma", "img2video", "i2v"].includes(c)) {
      const media = await getMedia(m, "image");
      if (!media) return m.reply(`Reply/kirim gambar lalu gunakan ${m.prefix}${c} <prompt>`);
      await m.react("🕒");
      let finalUrl = null;
      await streamResult("/api/img2video/luma", media, async (data) => {
        if (["queueing", "generating", "processing"].includes(data?.status)) return false;
        if (data?.status === "completed" && data?.video?.url) { finalUrl = data.video.url; return true; }
        if (["failed", "reject"].includes(data?.status)) throw new Error(data?.msg || "Luma gagal");
        return false;
      }, q);
      if (!finalUrl) throw new Error("Luma tidak mengembalikan video");
      await sock.sendMessage(m.chat, { video: { url: finalUrl }, mimetype: "video/mp4", caption: `🎬 *Luma Image to Video*${q ? `\nPrompt: ${q}` : ""}` }, { quoted: m });
      return m.react("✅");
    }

    if (["cover", "covers"].includes(c)) {
      const media = await getMedia(m, "audio");
      if (!media) return m.reply(`Reply audio lalu gunakan ${m.prefix}cover <model>`);
      if (!q) return m.reply(`Contoh: ${m.prefix}cover 63001`);
      await m.react("🕒");
      const res = await axios.post(`${xtermBaseUrl}/api/audioProcessing/voice-covers?model=${encodeURIComponent(q)}&key=${encodeURIComponent(xtermApiKey)}`, media, {
        headers: { "Content-Type": "application/octet-stream" }, responseType: "stream", timeout: 180000,
      });
      let audioUrl = null;
      await new Promise((resolve, reject) => {
        let pending = "";
        res.data.on("data", chunk => {
          pending += chunk.toString();
          const lines = pending.split(/\r?\n/); pending = lines.pop() || "";
          for (const line of lines) {
            const match = line.match(/^data:\s*(.+)$/); if (!match) continue;
            try {
              const data = JSON.parse(match[1]);
              if (data.status === "success") { audioUrl = data.result?.url || data.result?.audioUrl || data.result; try { res.data.destroy(); } catch {} resolve(); }
              else if (["failed", "reject"].includes(data.status)) { reject(new Error(data.msg || "Voice cover gagal")); try { res.data.destroy(); } catch {} }
            } catch (e) { reject(e); }
          }
        });
        res.data.on("error", reject);
        res.data.on("close", () => audioUrl ? resolve() : null);
      });
      if (!audioUrl) throw new Error("Voice cover tidak menghasilkan audio");
      await sock.sendMessage(m.chat, { audio: { url: audioUrl }, mimetype: "audio/mpeg" }, { quoted: m });
      return m.react("✅");
    }

    if (c === "faceswap" || c === "faceswap-change" || c === "faceswap-reset") {
      const sid = m.sender;
      if (c === "faceswap-reset") { faceSessions.delete(sid); return m.reply("✅ Sesi faceswap dihapus."); }
      if (c === "faceswap-change") {
        const s = faceSessions.get(sid);
        if (!s?.target) return m.reply("❌ Belum ada sesi faceswap.");
        s.face = null; faceSessions.set(sid, s);
        return m.reply("✅ Wajah pengganti direset. Kirim gambar wajah baru.");
      }
      const media = await getMedia(m, "image");
      if (!media) return m.reply(`Reply/kirim gambar lalu gunakan ${m.prefix}faceswap`);
      const url = await uploadToTermaiCdn(media);
      const s = faceSessions.get(sid) || { target: null, face: null };
      if (!s.target) { s.target = url; faceSessions.set(sid, s); return m.reply("✅ Foto target tersimpan. Sekarang kirim/reply foto wajah pengganti."); }
      if (!s.face) { s.face = url; faceSessions.set(sid, s); }
      await m.react("🕒");
      let result = null;
      // API faceswap menerima URL via query.
      const response = await axios.post(`${xtermBaseUrl}/api/img2img/faceswap?face=${encodeURIComponent(s.face)}&target=${encodeURIComponent(s.target)}&key=${encodeURIComponent(xtermApiKey)}`, null, { responseType: "stream", timeout: 180000 });
      let pending = "";
      await new Promise((resolve, reject) => {
        response.data.on("data", chunk => {
          pending += chunk.toString(); const lines = pending.split(/\r?\n/); pending = lines.pop() || "";
          for (const line of lines) { const mt = line.match(/^data:\s*(.+)$/); if (!mt) continue; try { const d=JSON.parse(mt[1]); if(d.status==='success'){result=d.result; try{response.data.destroy()}catch{} resolve();} else if(['failed','reject'].includes(d.status)){reject(new Error(d.msg||'Faceswap gagal')); try{response.data.destroy()}catch{}} } catch(e){ reject(e); } }
        });
        response.data.on("error", reject); response.data.on("close", () => result ? resolve() : null);
      });
      faceSessions.delete(sid);
      if (!result) throw new Error("Faceswap tidak menghasilkan gambar");
      await sock.sendMessage(m.chat, { image: { url: result }, caption: "🎭 *Faceswap selesai*" }, { quoted: m });
      return m.react("✅");
    }

    if (["babygenerator", "buatanak"].includes(c)) {
      const media = await getMedia(m, "image");
      const sid = m.sender;
      const s = babySessions.get(sid) || { father: null, mother: null };
      const label = /mother/i.test(q) ? "mother" : /father/i.test(q) ? "father" : (!s.father ? "father" : "mother");
      if (media) {
        const url = await uploadToTermaiCdn(media);
        s[label] = url; babySessions.set(sid, s);
        if (!s.mother || !s.father) return m.reply(`✅ Foto ${label} tersimpan. Kirim foto ${label === "father" ? "mother" : "father"} berikutnya.`);
      }
      if (!s.father || !s.mother) return m.reply(`Reply foto dengan caption *father* atau *mother*, atau gunakan *skip* bila salah satu foto ingin disamakan.`);
      const gender = /\b(girl|boy)\b/i.exec(q)?.[1]?.toLowerCase() || "random";
      const url = await xtermImageUrl("/api/img2img/baby-generator", { father: s.father, mother: s.mother, gender });
      babySessions.delete(sid);
      await m.react("🍼");
      await sock.sendMessage(m.chat, { image: { url }, caption: `👶 *Baby Generator*\nGender: ${gender}` }, { quoted: m });
      return m.react("✅");
    }
  } catch (e) {
    console.error("[XTERM AI]", e);
    await m.react("❌").catch(() => {});
    return m.reply(`❌ ${e.message || "Fitur AI gagal diproses."}`);
  }
}

export { pluginConfig as config, handler };
