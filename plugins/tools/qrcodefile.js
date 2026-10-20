import axios from "axios";
import FormData from "form-data";
import QRCode from "qrcode";
import mime from "mime-types";

const pluginConfig = {
    name: 'qrcodefile',
    alias: ['qrfile', 'fileqr', 'filetoqr', 'qruguu'],
    category: 'tools',
    description: 'Mengupload media/file ke hosting cadangan dan membuat QR Code berisi URL file tersebut',
    usage: '.qrcodefile (kirim dengan caption atau reply media/file/viewonce/dokumen)',
    example: '.qrcodefile',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 10,
    energi: 1,
    isEnabled: true
};

const SIZE = 1024;
const FOREGROUND = "#000000";
const BACKGROUND = "#FFFFFF";
const UA = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";

async function uploadFile(buffer, filename, mimeType) {
  const attempts = [
    {
      name: 'Catbox',
      run: async () => {
        const form = new FormData();
        form.append('reqtype', 'fileupload');
        form.append('fileToUpload', buffer, {
          filename,
          contentType: mimeType || 'application/octet-stream'
        });
        const res = await axios.post('https://catbox.moe/user/api.php', form, {
          timeout: 120000,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          headers: form.getHeaders()
        });
        const url = typeof res.data === 'string' ? res.data.trim() : '';
        if (!/^https?:\/\//i.test(url)) throw new Error('Respons Catbox tidak berisi URL');
        return url;
      }
    },
    {
      name: 'Qu.ax',
      run: async () => {
        const form = new FormData();
        form.append('file', buffer, {
          filename,
          contentType: mimeType || 'application/octet-stream'
        });
        const res = await axios.post('https://qu.ax/upload.php', form, {
          timeout: 120000,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          headers: { ...form.getHeaders(), accept: '*/*' }
        });
        const url = res.data?.files?.[0]?.url || null;
        if (res.data?.success !== true || !url) throw new Error('Respons Qu.ax tidak valid');
        return String(url).replaceAll('\\/', '/');
      }
    },
    {
      name: 'Uguu',
      run: async () => {
        const form = new FormData();
        form.append('files[]', buffer, {
          filename,
          contentType: mimeType || 'application/octet-stream'
        });
        const res = await axios.post('https://uguu.se/upload.php', form, {
          timeout: 120000,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          headers: {
            ...form.getHeaders(),
            accept: '*/*',
            origin: 'https://uguu.se',
            referer: 'https://uguu.se/',
            'user-agent': UA
          }
        });
        const url = res.data?.files?.[0]?.url || null;
        if (res.data?.success !== true || !url) throw new Error('Respons Uguu tidak valid');
        return String(url).replaceAll('\\/', '/');
      }
    }
  ];

  const failures = [];
  for (const attempt of attempts) {
    try {
      return await attempt.run();
    } catch (error) {
      const status = error?.response?.status;
      failures.push(`${attempt.name}: ${status ? `HTTP ${status}` : (error?.message || 'gagal')}`);
      console.warn(`[QRCodeFile] Upload ${attempt.name} gagal:`, status || error?.message || error);
    }
  }
  throw new Error(`Semua server upload gagal. ${failures.join(' | ')}`);
}

async function makeQrBuffer(url) {
  return await QRCode.toBuffer(url, {
    type: "png",
    errorCorrectionLevel: "H",
    margin: 4,
    width: SIZE,
    color: {
      dark: FOREGROUND,
      light: BACKGROUND
    }
  });
}

async function handler(m, { usedPrefix, prefix, command, sock, conn }) {
  const clientBot = sock || conn;
  const pfx = usedPrefix || prefix || '.';

  // Ambil target pesan (bisa dari pesan sendiri dengan caption atau pesan yang direply)
  const target = m.quoted ? m.quoted : m;

  // Bedah struktur pesan Baileys secara mendalam untuk mendeteksi media (termasuk viewOnce, forwarded, dll)
  const rawMsg = target.message || target.msg || target;
  const innerMsg = 
    rawMsg.viewOnceMessage?.message || 
    rawMsg.viewOnceMessageV2?.message || 
    rawMsg.documentWithCaptionMessage?.message ||
    rawMsg.ephemeralMessage?.message ||
    rawMsg;

  const mediaObj = 
    innerMsg.imageMessage || 
    innerMsg.videoMessage || 
    innerMsg.audioMessage || 
    innerMsg.documentMessage || 
    innerMsg.stickerMessage ||
    rawMsg.imageMessage ||
    rawMsg.videoMessage ||
    rawMsg.audioMessage ||
    rawMsg.documentMessage ||
    rawMsg.stickerMessage;

  const mimeType = mediaObj?.mimetype || target.mimetype || '';
  const hasMedia = Boolean(mediaObj || target.mediaMessage || /image|video|audio|document|sticker/i.test(mimeType));

  if (!hasMedia) {
    return await m.reply(
      `*Format Salah!*\n\n` +
      `📌 *Cara Penggunaan:*\n` +
      `• Kirim media dengan caption \`${pfx}${command}\`\n` +
      `• Atau reply foto/video/dokumen/pesan media apa pun dengan perintah \`${pfx}${command}\``
    );
  }

  if (typeof m.react === 'function') await m.react('⏳');

  try {
    let mediaBuffer;

    // Coba unduh menggunakan fungsi download bawaan target/quoted/klien
    if (typeof target.download === 'function') {
      mediaBuffer = await target.download();
    } else if (typeof m.download === 'function') {
      mediaBuffer = await m.download();
    } else if (clientBot.downloadMediaMessage) {
      mediaBuffer = await clientBot.downloadMediaMessage(target);
    }

    if (!mediaBuffer && target.msg && typeof target.msg.download === 'function') {
      mediaBuffer = await target.msg.download();
    }

    if (!mediaBuffer) {
      throw new Error("Gagal mengunduh file media. Pastikan kamu mereply atau mengirimkan file media yang valid.");
    }

    const ext = mime.extension(mimeType) || 'bin';
    const filename = `file_${Date.now()}.${ext}`;

    const uploadedUrl = await uploadFile(mediaBuffer, filename, mimeType || "application/octet-stream");
    const qrBuffer = await makeQrBuffer(uploadedUrl);

    let caption = `📲 *FILE UPLOADED TO QR CODE*\n────────────────────────────\n\n`;
    caption += `🔗 *URL File:* ${uploadedUrl}\n`;
    caption += `📁 *MIME Type:* ${mimeType || 'unknown'}\n\n`;
    caption += `────────────────────────────\n`;
    caption += `💡 *Catatan:* QR Code berisi URL file yang diunggah. Masa penyimpanan mengikuti kebijakan server upload yang berhasil digunakan.`;

    await clientBot.sendMessage(
      m.chat,
      {
        image: qrBuffer,
        caption: caption
      },
      { quoted: m }
    );

    if (typeof m.react === 'function') await m.react('✅');

  } catch (error) {
    console.error('QRCodeFile Plugin Error:', error);
    if (typeof m.react === 'function') await m.react('❌');
    await m.reply('❌ *GAGAL*\n\n> ' + (error.message || String(error)));
  }
}

export { pluginConfig as config, handler };
