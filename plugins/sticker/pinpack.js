import _sharp from 'sharp'
import axios from "axios";
import config from "../../config.js";
import te from "../../src/lib/rimuru-error.js";
import { f } from "../../src/lib/rimuru-http.js";
import { addExifToWebp } from "../../src/lib/rimuru-exif.js";
import { pinterest } from "btch-downloader";

function getResults(data) {
  const candidates = [
    data?.result?.result?.result,
    data?.result?.result,
    data?.result,
    data?.data?.results,
    data?.data,
    data?.results,
  ];
  for (const value of candidates) {
    if (Array.isArray(value)) return value;
  }
  return [];
}

function getImageUrl(item) {
  if (typeof item === "string") return item;
  return (
    item?.image_url ||
    item?.image ||
    item?.images?.orig?.url ||
    item?.images?.["736x"]?.url ||
    item?.images?.["564x"]?.url ||
    item?.url ||
    item?.thumbnail ||
    null
  );
}

// Gabungkan hasil dari beberapa sumber agar jumlah yang diminta lebih mungkin terpenuhi.
async function searchPinterest(query) {
  const q = encodeURIComponent(query);
  const collected = [];
  const seen = new Set();
  const maxCandidates = 150;

  const addResults = (data) => {
    for (const item of getResults(data)) {
      const imageUrl = getImageUrl(item);
      if (typeof imageUrl !== "string" || !/^https?:\/\//i.test(imageUrl)) continue;
      if (seen.has(imageUrl)) continue;
      seen.add(imageUrl);
      collected.push(item);
      if (collected.length >= maxCandidates) break;
    }
  };

  try {
    addResults(await pinterest(query));
  } catch (err) {
    console.log("[PinPack] btch-downloader gagal:", err.message);
  }

  const fallbacks = [
    `https://api.cuki.biz.id/api/search/pinterest?apikey=cuki-x&query=${q}&type=image`,
    `https://api.siputzx.my.id/api/s/pinterest?query=${q}`,
  ];

  for (const url of fallbacks) {
    if (collected.length >= maxCandidates) break;
    try {
      addResults(await f(url));
    } catch (err) {
      console.log("[PinPack] fallback gagal:", err.message);
    }
  }

  return collected;
}

function getSharp() {
  return _sharp;
}

const MAX_STICKERS = 30;
const DOWNLOAD_DELAY = 700;

async function downloadBuffer(url) {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 15000,
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  return Buffer.from(res.data);
}

async function toWebpSticker(buffer) {
  return (await getSharp())(buffer)
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 80 })
    .toBuffer();
}

const pluginConfig = {
  name: "pinpack",
  alias: ["ppack", "pinsticker", "pinsearchpack"],
  category: "sticker",
  description: "Cari gambar Pinterest lalu kirim sticker pack sesuai jumlah yang diminta (1-30)",
  usage: ".pinpack <query> | <jumlah 1-30>",
  example: ".pinpack Rimuru | 30",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 20,
  energi: 3,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const input = String(m.text ?? m.args?.join(" ") ?? "").trim();
  const parts = input.split("|");
  const query = (parts[0] || "").trim();
  const amountText = (parts[1] || "").trim();

  if (!input || parts.length !== 2 || !query || !amountText) {
    return m.reply(
      `── .✦ 𝗣𝗜𝗡 𝗣𝗔𝗖𝗞 ✦. ── 𝜗ৎ\n\n` +
        `Cari gambar Pinterest lalu ubah menjadi sticker pack sesuai jumlah pilihanmu.\n\n` +
        `╭─〔 Cara Pakai 〕───⬣\n` +
        `│  ✦ ${m.prefix}pinpack <request> | <jumlah 1-30>\n` +
        `╰──────────────⬣\n\n` +
        `Contoh:\n` +
        `*${m.prefix}pinpack Rimuru | 30*\n` +
        `*${m.prefix}pinpack anime cat | 10*\n\n` +
        `Jumlah wajib berupa angka dari 1 sampai 30. .☘︎ ݁˖`,
    );
  }

  if (!/^\d+$/.test(amountText)) {
    return m.reply(`Jumlah harus berupa angka 1-30.\nContoh: *${m.prefix}pinpack Rimuru | 30*`);
  }

  const requestedCount = Number(amountText);
  if (!Number.isInteger(requestedCount) || requestedCount < 1 || requestedCount > MAX_STICKERS) {
    return m.reply(`Jumlah sticker harus antara *1 sampai ${MAX_STICKERS}*.\nContoh: *${m.prefix}pinpack Rimuru | 30*`);
  }

  await m.react("🕕");

  try {
    const results = await searchPinterest(query);

    if (!results.length) {
      await m.react("✘");
      return m.reply(`── .✦ ──\n\n> Tidak ditemukan hasil untuk: *${query}* .☘︎ ݁˖`);
    }

    await m.reply(
      `── .✦ ──\n\n> Permintaan: *${requestedCount} sticker*\n` +
        `> Ditemukan *${results.length}* kandidat gambar. Mengunduh dan mengonversi sampai jumlah yang diminta terpenuhi... .☘︎ ݁˖`,
    );

    const stickerBuffers = [];
    const seenUrls = new Set();

    for (const item of results) {
      if (stickerBuffers.length >= requestedCount) break;

      const imageUrl = getImageUrl(item);
      if (!imageUrl || seenUrls.has(imageUrl)) continue;
      seenUrls.add(imageUrl);

      try {
        const buf = await downloadBuffer(imageUrl);
        if (!buf?.length) continue;
        const webp = await toWebpSticker(buf);
        if (webp?.length) stickerBuffers.push(webp);
        if (stickerBuffers.length < requestedCount) {
          await new Promise((resolve) => setTimeout(resolve, DOWNLOAD_DELAY));
        }
      } catch (err) {
        console.log("[PinPack] Gagal mengunduh/mengonversi gambar:", err.message);
      }
    }

    // Jumlah harus sesuai input. Jangan mengirim pack yang jumlahnya kurang dari permintaan.
    if (stickerBuffers.length !== requestedCount) {
      await m.react("✘");
      return m.reply(
        `── .✦ ──\n\n> Kamu meminta *${requestedCount} sticker*, tetapi hanya *${stickerBuffers.length}* gambar yang berhasil diunduh.\n` +
          `> Pack tidak dikirim agar jumlahnya tidak berbeda dari permintaan. Coba kata kunci lain atau jumlah lebih kecil. .☘︎ ݁˖`,
      );
    }

    const packname = `Pinterest: ${query}`;
    const author = config.bot?.developer || config.sticker?.author || "Bot";

    try {
      await sock.sendStickerPack(m.chat, stickerBuffers, m, {
        name: packname,
        packname,
        publisher: author,
        author,
        description: `Sticker pack dari Pinterest: ${query}`,
        emojis: ["❤"],
      });
      await m.react("✓");
      await m.reply(`── .✦ ──\n\n> Berhasil membuat pack berisi tepat *${requestedCount} sticker* dari *${query}*. .☘︎ ݁˖`);
    } catch (packErr) {
      console.error("[PinPack] Pack send failed:", packErr.message);
      await m.reply(`── .✦ ──\n\n> Pack gagal dikirim sebagai pack, mencoba mengirim *${requestedCount} sticker* satu per satu... .☘︎ ݁˖`);

      let sent = 0;
      for (const buf of stickerBuffers) {
        try {
          let exifBuf = buf;
          try {
            exifBuf = await addExifToWebp(buf, {
              packname,
              author,
              emojis: ["❤"],
            });
          } catch {}
          await sock.sendMessage(
            m.chat,
            {
              sticker: exifBuf,
              contextInfo: { isForwarded: true, forwardingScore: 1 },
            },
            { quoted: m },
          );
          sent++;
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (err) {
          console.log("[PinPack] Gagal mengirim sticker:", err.message);
        }
      }

      if (sent === requestedCount) {
        await m.react("✓");
        await m.reply(`── .✦ ──\n\n> Berhasil mengirim tepat *${sent} sticker* dari *${packname}*. .☘︎ ݁˖`);
      } else if (sent > 0) {
        await m.react("✘");
        await m.reply(`── .✦ ──\n\n> Diminta *${requestedCount} sticker*, tetapi hanya *${sent}* yang berhasil terkirim karena beberapa pengiriman gagal. .☘︎ ݁˖`);
      } else {
        await m.react("✘");
        await m.reply(`── .✦ ──\n\n> Gagal mengirim sticker. .☘︎ ݁˖`);
      }
    }
  } catch (error) {
    console.error("[PinPack] Error:", error.message);
    await m.react("✘");
    return m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { pluginConfig as config, handler };
