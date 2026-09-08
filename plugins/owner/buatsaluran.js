import { RIMURU_CORE_CONFIG } from "../../rimuru.js";
export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


const pluginConfig = {
  name: ["buatsaluran", "createsaluran", "createnewsletter"],
  alias: [],
  category: "owner",
  description: "Buat saluran/newsletter baru",
  usage: ".buatsaluran <nama>|<deskripsi>",
  example: ".buatsaluran Info Bot|Update terbaru bot kami",
  isOwner: true,
  cooldown: 5,
  energi: 0,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.text?.trim() || "";
  const pipeIdx = text.indexOf("|");

  let name, description;
  if (pipeIdx === -1) {
    name = text;
    description = "";
  } else {
    name = text.substring(0, pipeIdx).trim();
    description = text.substring(pipeIdx + 1).trim();
  }

  if (!name || name.length < 2) {
    return m.reply(
      "📢 *ʙᴜᴀᴛ sᴀʟᴜʀᴀɴ*\n\n" +
        "> `.buatsaluran Nama Saluran`\n" +
        "> `.buatsaluran Nama|Deskripsi`\n\n" +
        "📝 Contoh:\n" +
        "> `.buatsaluran Info Bot`\n" +
        "> `.buatsaluran Info Bot|Update terbaru bot kami`",
    );
  }

  try {
    const result = await sock.newsletterCreate(name, description || undefined);
    const saluranId = result?.id || result?.thread_metadata?.id || "unknown";
    const saluranName = result?.name || name;
    await m.react("✅");
    return m.reply(
      `📢 *sᴀʟᴜʀᴀɴ ᴅɪʙᴜᴀᴛ*\n\n` +
        `> Nama: ${saluranName}\n` +
        (description ? `> Deskripsi: ${description}\n` : "") +
        `> ID: ${saluranId}\n` +
        `> Subscribers: ${result?.subscribers || 0}\n\n` +
        `_Saluran ini bisa dikonfigurasi di RIMURU_CORE_CONFIG.saluran.id_`,
    );
  } catch (err) {
    return m.reply(`❌ Gagal membuat saluran: ${err.message}`);
  }
}

export { pluginConfig as config, handler };
