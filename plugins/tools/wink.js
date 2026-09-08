export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import te from "../../src/lib/rimuru-error.js";
import { enhanceVideo } from "../../src/scraper/termai.js";

const pluginConfig = {
  name: "wink",
  alias: ["winkenhance", "winkhd", "wenhance", "enhancevideo", "hdvideo", "ehv", "repairvideo", "rpv"],
  category: "tools",
  description: "Wink/XTerm AI video enhancer HD/UHD/4K/Repair",
  usage: ".wink [uhd|4k|2k|hd|repair|portrait|cartoon|denoise|deblur|smooth|color] (reply video)",
  example: ".wink uhd",
  isOwner: false,
  isPremium: true,
  isGroup: false,
  isPrivate: false,
  cooldown: 120,
  energi: 3,
  isEnabled: true,
};

const MODES = {
  uhd: ["VIDEO_UHD", "63031"],
  "4k": ["VIDEO_HD", "63093"],
  "2k": ["VIDEO_HD", "63091"],
  hd: ["VIDEO_HD", "63090"],
  portrait: ["VIDEO_HD", "63092"],
  cartoon: ["VIDEO_HD", "63097"],
  anime: ["VIDEO_HD", "63097"],
  denoise: ["DENOISE", "63292"],
  deblur: ["DEBLUR", "67691"],
  smooth: ["FRAME_INTERPOLATION", "62091"],
  fps: ["FRAME_INTERPOLATION", "62091"],
  color: ["COLOR_CORRECTION", "64990"],
  repair: ["VIDEO_REPAIR", "65591"],
};

async function handler(m, { sock }) {
  const isVideo = m.isVideo || m.isMedia && String(m.mimetype || "").startsWith("video/") || (m.quoted && ["videoMessage", "documentMessage"].includes(m.quoted.type) && String(m.quoted.mimetype || m.quoted.message?.documentMessage?.mimetype || "").startsWith("video/"));
  const opt = String(m.args?.[0] || "uhd").toLowerCase();
  if (m.command === "wink" && !m.args?.length) {
    return m.reply(`🤖 *WINK VIDEO PROCESSOR*\n\n` +
      `Balas video dengan: *${m.prefix}wink uhd*\n\n` +
      `uhd • 4k • 2k • hd • repair • portrait • cartoon • denoise • deblur • smooth • color`);
  }
  if (!isVideo) return m.reply(`🎬 Reply/kirim video lalu gunakan *${m.prefix}wink [opsi]*.`);
  const [task, model] = MODES[opt] || MODES.uhd;
  await m.react("🕕");
  try {
    const video = m.quoted?.download ? await m.quoted.download() : await m.download();
    if (!video?.length) throw new Error("Video gagal diunduh");
    if (video.length > 100 * 1024 * 1024) throw new Error("Video terlalu besar (maks. 100MB)");

    const response = await enhanceVideo(video, { task, model });
    if (response.status >= 400) throw new Error(`API Wink/XTerm HTTP ${response.status}`);

    let finished = false;
    await new Promise((resolve, reject) => {
      const stream = response.data;
      const onError = (e) => reject(e);
      stream.on("error", onError);
      stream.on("data", async (chunk) => {
        const text = chunk.toString();
        for (const line of text.matchAll(/data:\s*(.+)/g)) {
          let data;
          try { data = JSON.parse(line[1]); } catch { continue; }
          if (["preparing", "uploading", "processing", "enhancing"].includes(data.status)) {
            try { await m.react("⏳"); } catch {}
          } else if (data.status === "failed" || data.status === "reject") {
            reject(new Error(data.msg || "Proses Wink gagal"));
            stream.destroy();
            return;
          } else if (data.status === "completed" && data.video?.url) {
            // Only accept a completed video URL. This command must never send an image.
            if (typeof data.video.url !== "string" || !/^https?:\/\//i.test(data.video.url)) {
              continue;
            }
            finished = true;
            await sock.sendMessage(m.chat, {
              video: { url: data.video.url },
              mimetype: "video/mp4",
              fileName: `WINK-HD-${Date.now()}.mp4`,
              caption: `✨ *Wink selesai*\nMode: *${opt}*${data.beans ? `\nPenggunaan: *${data.beans} Beans*` : ""}`,
            }, { quoted: m });
            try { await m.react("✅"); } catch {}
            stream.destroy();
            resolve();
          }
        }
      });
      stream.on("close", () => {
        if (!finished) reject(new Error("Stream Wink terputus sebelum hasil selesai"));
      });
    });
  } catch (e) {
    await m.react("❌").catch(() => {});
    console.error("[WINK-XTERM]", e);
    return m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
