import config, { getOwnerName } from "../../config.js";
import fs from "fs";
import path from "path";
import { getGroupMode } from "../group/botmode.js";
import { getDatabase } from "../../src/lib/rimuru-database.js";
import {
  addJadibotOwner,
  removeJadibotOwner,
  getJadibotOwners,
} from "../../src/lib/rimuru-jadibot-database.js";
import {
  isLid,
  lidToJid,
  resolveAnyLidToJid,
  isLidConverted,
} from "../../src/lib/rimuru-lid.js";
const pluginConfig = {
  name: "addowner",
  alias: ["addown", "setowner", "delowner", "dedown", "ownerlist", "listowner"],
  category: "owner",
  description: "Kelola owner bot (mode-aware)",
  usage: ".addowner <nomor/@tag/reply>",
  example: ".addowner 6281234567890",
  isOwner: true,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 3,
  energi: 0,
  isEnabled: true,
};

function cleanJid(jid) {
  if (!jid) return null;
  if (isLid(jid)) jid = lidToJid(jid);
  return jid.includes("@") ? jid : jid + "@s.whatsapp.net";
}

function extractNumber(m) {
  let targetNumber = "";

  if (m.quoted) {
    let sender = m.quoted.sender || "";
    if (isLid(sender) || isLidConverted(sender)) {
      sender = resolveAnyLidToJid(sender, m.groupMembers || []);
    }
    targetNumber = sender?.replace(/[^0-9]/g, "") || "";
  } else if (m.mentionedJid?.length) {
    let jid = cleanJid(m.mentionedJid[0]);
    if (isLid(jid) || isLidConverted(jid)) {
      jid = resolveAnyLidToJid(jid, m.groupMembers || []);
    }
    targetNumber = jid?.replace(/[^0-9]/g, "") || "";
  } else if (m.args[0]) {
    targetNumber = m.args[0].replace(/[^0-9]/g, "");
    if (targetNumber.startsWith("08")) {
      targetNumber = "62" + targetNumber.slice(1);
    }
  }

  if (targetNumber.startsWith("0")) {
    targetNumber = "62" + targetNumber.slice(1);
  }

  if (targetNumber.length > 15) {
    return "";
  }

  return targetNumber;
}

const PANEL_LEGACY_PATH = path.join(process.cwd(), "database", "cpanel", "legacy_sellers.json");

function readPanelLegacyData() {
  try {
    const parsed = JSON.parse(fs.readFileSync(PANEL_LEGACY_PATH, "utf8"));
    return {
      sellers: Array.isArray(parsed?.sellers) ? parsed.sellers.map(String) : [],
      ownerPanels: Array.isArray(parsed?.ownerPanels) ? parsed.ownerPanels.map(String) : [],
    };
  } catch {
    return { sellers: [], ownerPanels: [] };
  }
}

function syncPanelLegacyData() {
  const data = readPanelLegacyData();
  if (!config.pterodactyl) config.pterodactyl = {};
  config.pterodactyl.sellers = [...data.sellers];
  config.pterodactyl.ownerPanels = [...data.ownerPanels];
  return data;
}

function savePanelLegacyData() {
  try {
    const dir = path.dirname(PANEL_LEGACY_PATH);
    fs.mkdirSync(dir, { recursive: true });
    const data = {
      sellers: Array.isArray(config.pterodactyl?.sellers) ? config.pterodactyl.sellers : [],
      ownerPanels: Array.isArray(config.pterodactyl?.ownerPanels) ? config.pterodactyl.ownerPanels : [],
    };
    fs.writeFileSync(PANEL_LEGACY_PATH, JSON.stringify(data, null, 2) + "\n", "utf8");
    return true;
  } catch (error) {
    console.error("[CPanel] Failed to save role data:", error.message);
    return false;
  }
}

function removeFromSellers(targetNumber) {
  const sellers = config.pterodactyl?.sellers || [];
  const index = sellers.findIndex((s) => String(s).trim() === String(targetNumber).trim());
  if (index < 0) return false;
  sellers.splice(index, 1);
  return true;
}

function removeFromOwnerPanels(targetNumber) {
  const ownerPanels = config.pterodactyl?.ownerPanels || [];
  const index = ownerPanels.findIndex((s) => String(s).trim() === String(targetNumber).trim());
  if (index < 0) return false;
  ownerPanels.splice(index, 1);
  return true;
}

function toMentionJid(value) {
  const number = String(value || "").replace(/[^0-9]/g, "");
  return number ? `${number}@s.whatsapp.net` : null;
}

async function handler(m, { sock, jadibotId, isJadibot }) {
  const db = getDatabase();
  const cmd = m.command.toLowerCase();
  const groupMode = m.isGroup ? getGroupMode(m.chat, db) : "private";
  const isCpanelMode = m.isGroup && groupMode === "cpanel";
  syncPanelLegacyData();

  const isAdd = ["addowner", "addown", "setowner"].includes(cmd);
  const isDel = ["delowner", "dedown"].includes(cmd);
  const isList = ["ownerlist", "listowner"].includes(cmd);

  if (!db.data.owner) db.data.owner = [];

  if (isList) {
    if (isJadibot && jadibotId) {
      const jbOwners = getJadibotOwners(jadibotId);
      if (jbOwners.length === 0) {
        return m.reply(
          `📋 *ᴅᴀꜰᴛᴀʀ ᴏᴡɴᴇʀ ᴊᴀᴅɪʙᴏᴛ*\n\n> Belum ada owner terdaftar.\n> Gunakan \`${m.prefix}addowner\` untuk menambah.`,
        );
      }
      let txt = `📋 *DAFTAR OWNER JADIBOT* — ${jadibotId}\n\n`;
      const mentions = jbOwners.map(toMentionJid).filter(Boolean);
      jbOwners.forEach((s, i) => {
        const number = String(s || "").replace(/[^0-9]/g, "");
        const name = getOwnerName(number);
        txt += `${i + 1}. 👑 @${number}${name !== "Owner" ? ` — *${name}*` : ""}\n`;
      });
      txt += `\nTotal: *${jbOwners.length}* owner`;
      return m.reply(txt, { mentions });
    }

    if (isCpanelMode) {
      const panelOwners = config.pterodactyl?.ownerPanels || [];
      const fullOwners = db.data.owner || [];
      const allOwners = [...new Set([...panelOwners, ...fullOwners])];
      if (allOwners.length === 0) {
        return m.reply(`📋 *ᴅᴀꜰᴛᴀʀ ᴏᴡɴᴇʀ ᴘᴀɴᴇʟ*\n\n> Belum ada owner panel terdaftar.`);
      }
      let txt = `📋 *DAFTAR OWNER PANEL*\n\n`;
      const mentions = allOwners.map(toMentionJid).filter(Boolean);
      allOwners.forEach((s, i) => {
        const panel = panelOwners.some((v) => String(v).replace(/[^0-9]/g, "") === String(s).replace(/[^0-9]/g, ""));
        const full = fullOwners.some((v) => String(v).replace(/[^0-9]/g, "") === String(s).replace(/[^0-9]/g, ""));
        const label = panel && full ? "👑🖥️" : full ? "👑" : "🖥️";
        const number = String(s || "").replace(/[^0-9]/g, "");
        const name = getOwnerName(number);
        txt += `${i + 1}. ${label} @${number}${name !== "Owner" ? ` — *${name}*` : ""}\n`;
      });
      txt += `\nTotal: *${allOwners.length}* owner | 👑 Full, 🖥️ Panel`;
      return m.reply(txt, { mentions });
    }

    const configOwners = (config.owner?.number || []).map(String);
    const dbOwners = db.data.owner || [];
    const allOwners = [...new Set([...configOwners, ...dbOwners])];

    if (allOwners.length === 0) {
      return m.reply(`📋 *ᴅᴀꜰᴛᴀʀ ᴏᴡɴᴇʀ*\n\n> Belum ada owner terdaftar.`);
    }
    let txt = `📋 *DAFTAR OWNER*\n\n`;
    const mentions = allOwners.map(toMentionJid).filter(Boolean);
    allOwners.forEach((s, i) => {
      const number = String(s || "").replace(/[^0-9]/g, "");
      const isMain = configOwners.some(
        (o) => String(o).replace(/[^0-9]/g, "") === number,
      );
      const isDb = dbOwners.some(
        (o) => String(o).replace(/[^0-9]/g, "") === number,
      );
      const label = isMain && isDb ? "👑⭐" : isMain ? "⭐" : "👑";
      const name = getOwnerName(number);
      txt += `${i + 1}. ${label} @${number}${name !== "Owner" ? ` — *${name}*` : ""}\n`;
    });
    txt += `\nTotal: *${allOwners.length}* owner | ⭐ Main, 👑 Added`;
    return m.reply(txt, { mentions });
  }

  const targetNumber = await extractNumber(m);
  const numberFromArgs = !m.quoted && !m.mentionedJid?.length && m.args[0];
  const customName = isAdd
    ? (numberFromArgs ? m.args.slice(1) : m.args).join(" ").trim()
    : "";

  if (!targetNumber) {
    return m.reply(
      `👑 *${isAdd ? "ADD" : "DEL"} OWNER*\n\n` +
        `Reply/tag/ketik nomor user\n` +
        `\`Contoh: ${m.prefix}${cmd} 6281234567890\`\n` +
        `\`Dengan nama: ${m.prefix}${cmd} 6281234567890 NamaOwner\``,
    );
  }

  if (targetNumber.length < 10 || targetNumber.length > 15) {
    return m.reply(`❌ *ɢᴀɢᴀʟ*\n\n> Format nomor tidak valid`);
  }

  if (isJadibot && jadibotId) {
    if (isAdd) {
      if (addJadibotOwner(jadibotId, targetNumber)) {
        await m.react("👑");
        return m.reply(
          `✅ Berhasil menambahkan *${targetNumber}* sebagai owner jadibot`,
        );
      } else {
        return m.reply(
          `❌ \`${targetNumber}\` sudah menjadi owner Jadibot ini.`,
        );
      }
    } else if (isDel) {
      if (removeJadibotOwner(jadibotId, targetNumber)) {
        await m.react("✅");
        return m.reply(
          `✅ Berhasil menghapus *${targetNumber}* dari owner jadibot`,
        );
      } else {
        return m.reply(`❌ \`${targetNumber}\` bukan owner Jadibot ini.`);
      }
    }
    return;
  }

  if (isCpanelMode) {
    const oldSellers = [...(config.pterodactyl.sellers || [])];
    const oldPanelOwners = [...(config.pterodactyl.ownerPanels || [])];

    if (isAdd) {
      if (config.pterodactyl.ownerPanels.some((s) => String(s).replace(/[^0-9]/g, "") === targetNumber)) {
        return m.reply(`❌ \`${targetNumber}\` sudah menjadi owner panel.`);
      }
      let roleChanged = "";
      if (removeFromSellers(targetNumber)) roleChanged = `\n> ⚡ Auto-upgrade dari Seller ke Owner Panel`;
      config.pterodactyl.ownerPanels.push(targetNumber);
      if (!savePanelLegacyData()) {
        config.pterodactyl.sellers = oldSellers;
        config.pterodactyl.ownerPanels = oldPanelOwners;
        return m.reply(`❌ Gagal menyimpan data owner panel.`);
      }
      await m.react("👑");
      return m.reply(`✅ Berhasil menambahkan *${targetNumber}* sebagai owner panel${roleChanged}`);
    }

    if (isDel) {
      const ownerList = config.pterodactyl.ownerPanels || [];
      const found = ownerList.some((value) => String(value).replace(/[^0-9]/g, "") === targetNumber);
      if (!found) {
        return m.reply(`❌ \`${targetNumber}\` bukan owner panel.\n\n> Current list: ${ownerList.join(", ") || "empty"}`);
      }
      config.pterodactyl.ownerPanels = ownerList.filter((value) => String(value).replace(/[^0-9]/g, "") !== targetNumber);
      if (!savePanelLegacyData()) {
        config.pterodactyl.sellers = oldSellers;
        config.pterodactyl.ownerPanels = oldPanelOwners;
        return m.reply(`❌ Gagal menyimpan data owner panel.`);
      }
      await m.react("✅");
      return m.reply(`✅ Berhasil menghapus *${targetNumber}* dari owner panel`);
    }
    return;
  }

  if (isAdd) {
    if (db.data.owner.includes(targetNumber)) {
      return m.reply(`❌ \`${targetNumber}\` sudah menjadi full owner.`);
    }

    const oldSellers = [...(config.pterodactyl.sellers || [])];
    const oldPanelOwners = [...(config.pterodactyl.ownerPanels || [])];
    let roleChanged = "";
    if (removeFromSellers(targetNumber)) roleChanged = `\n> ⚡ Auto-upgrade dari Seller`;
    if (removeFromOwnerPanels(targetNumber)) roleChanged = `\n> ⚡ Auto-upgrade dari Panel Owner`;
    if ((oldSellers.length !== config.pterodactyl.sellers.length || oldPanelOwners.length !== config.pterodactyl.ownerPanels.length) && !savePanelLegacyData()) {
      config.pterodactyl.sellers = oldSellers;
      config.pterodactyl.ownerPanels = oldPanelOwners;
      return m.reply(`❌ Gagal memperbarui role CPanel sebelum menaikkan owner.`);
    }

    db.data.owner.push(targetNumber);
    if (customName) {
      const nameMap = db.setting("ownerNames") || {};
      nameMap[targetNumber] = customName;
      db.setting("ownerNames", nameMap);
    }
    db.save();

    await m.react("👑");
    return m.reply(
      `✅ Berhasil menambahkan *${targetNumber}* sebagai full owner${customName ? ` (${customName})` : ""}${roleChanged}`,
    );
  } else if (isDel) {
    const index = db.data.owner.indexOf(targetNumber);
    if (index === -1) {
      return m.reply(`❌ \`${targetNumber}\` bukan full owner.`);
    }

    db.data.owner.splice(index, 1);
    const nameMap = db.setting("ownerNames") || {};
    delete nameMap[targetNumber];
    db.setting("ownerNames", nameMap);
    db.save();

    await m.react("✅");
    return m.reply(`✅ Berhasil menghapus *${targetNumber}* dari full owner`);
  }

}

export {
  pluginConfig as config,
  handler,
};
