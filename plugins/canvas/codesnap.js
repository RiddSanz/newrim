export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from "axios";
import FormData from "form-data";
import te from "../../src/lib/rimuru-error.js";

const pluginConfig = {
  name: "codesnap",
  alias: ["carbon"],
  category: "canvas",
  description: "Membuat gambar snippet kode ala macOS (Carbon)",
  usage: ".codesnap <kode>",
  example: ".codesnap console.log('hello world');",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const code = m.text?.trim();

  if (!code) {
    return m.reply(`🎮 *ᴄᴏᴅᴇ ꜱɴᴀᴘ*\n\n> Masukkan kode yang ingin diubah menjadi gambar snippet\n\n*ᴄᴏɴᴛᴏʜ ᴘᴇɴɢɢᴜɴᴀᴀɴ:*\n> \`${m.prefix}codesnap console.log("Hello World")\``);
  }

  m.react("🕕");

  try {
    const form = new FormData();
    form.append("code", code);

    const response = await axios.post(
      "https://carbonara.solopov.dev/api/cook",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Accept: "image/png"
        },
        responseType: "arraybuffer"
      }
    );

    const buffer = Buffer.from(response.data);
    await sock.sendMedia(m.chat, buffer, null, m, { type: "image" });
    m.react("✅");
  } catch (error) {
    m.react("❌");
    m.reply(`❌ Gagal membuat code snap. Mungkin API sedang gangguan.`);
  }
}

export { pluginConfig as config, handler };
