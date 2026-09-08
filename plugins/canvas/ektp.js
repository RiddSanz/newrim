export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from "axios";
import FormData from "form-data";
import te from "../../src/lib/rimuru-error.js";

const pluginConfig = {
  name: "ektp",
  alias: ["fakektp", "makektp", "ktpfake"],
  category: "canvas",
  description: "Membuat e-KTP palsu/kustom (support foto / PP WA)",
  usage: ".ektp <nama>",
  example: ".ektp Alex",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 5,
  energi: 1,
  isEnabled: true,
};

// 🔑 API Key Theresav
const THERESAV_KEY = "4ZtwE";

// Helper angka acak untuk NIK
function randomNik() {
  let result = "317";
  for (let i = 0; i < 13; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

async function handler(m, { sock }) {
  const fullText = (m.text || m.body || "").trim();
  const prefix = m.prefix || ".";

  const rawArgs = fullText.replace(/^[\/.!#]?(ektp|fakektp|makektp|ktpfake)\s*/i, "").trim();

  // 1. Parse input data (Split berdasarkan "|")
  const parts = rawArgs ? rawArgs.split("|").map(p => p.trim()) : [];
  
  const inputNama = parts[0] || m.pushName || "Warga Wakanda";
  const inputNik = parts[1] || randomNik();
  const inputProvinsi = parts[2] || "DKI JAKARTA";
  const inputKota = parts[3] || "JAKARTA SELATAN";
  const inputTtl = parts[4] || "JAKARTA, 01-01-2000";
  const inputGender = parts[5] || "LAKI-LAKI";
  const inputGolDarah = parts[6] || "O";
  const inputAlamat = parts[7] || "JL. MERDEKA NO. 45";
  const inputRtRw = parts[8] || "001/002";
  const inputKelDesa = parts[9] || "PASAR MINGGU";
  const inputKecamatan = parts[10] || "PASAR MINGGU";
  const inputAgama = parts[11] || "ISLAM";
  const inputStatus = parts[12] || "BELUM KAWIN";
  const inputPekerjaan = parts[13] || "PELAJAR/MAHASISWA";
  const inputKewarganegaraan = parts[14] || "WNI";
  const inputMasaBerlaku = "SEUMUR HIDUP";
  const inputTerbuat = "01-01-2021";

  await m.react("💳");

  try {
    let imageBuffer = null;

    // 2. Cek media foto dari reply / pesan langsung
    const quoted = m.quoted ? m.quoted : m;
    const qMsg = quoted.message || quoted.msg || quoted;

    const realMsg = 
      qMsg.viewOnceMessageV2?.message || 
      qMsg.viewOnceMessageV2Extension?.message || 
      qMsg.viewOnceMessage?.message || 
      qMsg;

    const targetImage = 
      realMsg.imageMessage || 
      (realMsg.documentMessage?.mimetype?.startsWith("image/") ? realMsg.documentMessage : null);

    const mime = targetImage?.mimetype || (quoted.msg || quoted).mimetype || quoted.mtype || "";
    const isImage = targetImage || /image/i.test(mime);

    if (isImage) {
      if (typeof quoted.download === "function") {
        imageBuffer = await quoted.download();
      } else if (typeof m.download === "function") {
        imageBuffer = await m.download();
      } else if (sock.downloadMediaMessage) {
        imageBuffer = await sock.downloadMediaMessage(quoted);
      }
    }

    // OPSI B: Jika TIDAK ngirim/reply foto, ambil dari PP WhatsApp
    if (!imageBuffer || !Buffer.isBuffer(imageBuffer) || imageBuffer.length === 0) {
      try {
        const ppUrl = await sock.profilePictureUrl(m.sender, "image");
        const ppRes = await axios.get(ppUrl, { responseType: "arraybuffer", timeout: 10000 });
        imageBuffer = Buffer.from(ppRes.data);
      } catch (e) {
        const defaultPpUrl = "https://litter.catbox.moe/igh5uh.jpg";
        const ppRes = await axios.get(defaultPpUrl, { responseType: "arraybuffer", timeout: 10000 });
        imageBuffer = Buffer.from(ppRes.data);
      }
    }

    // 3. Form Data POST
    const form = new FormData();
    form.append("apikey", THERESAV_KEY);
    form.append("photo", imageBuffer, { filename: "photo.jpg", contentType: "image/jpeg" });
    form.append("nik", inputNik);
    form.append("nama", inputNama);
    form.append("provinsi", inputProvinsi);
    form.append("kota", inputKota);
    form.append("ttl", inputTtl);
    form.append("jenis_kelamin", inputGender);
    form.append("golongan_darah", inputGolDarah);
    form.append("alamat", inputAlamat);
    form.append("rt/rw", inputRtRw);
    form.append("kel/desa", inputKelDesa);
    form.append("kecamatan", inputKecamatan);
    form.append("agama", inputAgama);
    form.append("status", inputStatus);
    form.append("pekerjaan", inputPekerjaan);
    form.append("kewarganegaraan", inputKewarganegaraan);
    form.append("masa_berlaku", inputMasaBerlaku);
    form.append("terbuat", inputTerbuat);

    const targetUrl = `https://api.theresav.biz.id/canvas/ektp`;

    const res = await axios.post(targetUrl, form, {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      responseType: "arraybuffer",
      timeout: 30000
    });

    const resultBuffer = Buffer.from(res.data);

    await m.react("✅");

    // Caption interaktif (Ada info hasil + panduan penggunaan)
    let caption = `🆔 *e-KTP atas nama ${inputNama}*\n\n`;
    caption += `💡 *Tips Kustomisasi Data:*\n`;
    caption += `• Kirim/reply foto + \`${prefix}ektp Nama\`\n`;
    caption += `• Format lengkap dipisah \`|\`:\n`;
    caption += `\`${prefix}ektp Nama|NIK|Provinsi|Kota|TTL|Gender|GolDarah|Alamat\``;

    return await sock.sendMessage(m.chat, {
      image: resultBuffer,
      caption: caption.trim()
    }, { quoted: m });

  } catch (error) {
    console.error("[EKTP Maker Error]:", error?.message);
    await m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
