import legacyHandler from "../../src/lib/rimuru-import/Rimuru-legacy-engine.js";

const config = {
  name: "playrich",
  alias: [],
  category: "rich",
  description: "Pemutar video YouTube Rich HTML",
  usage: ".playrich <judul atau URL YouTube>",
  example: ".playrich alan walker faded",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 8,
  energi: 1,
  isEnabled: true,
};

async function handler(m, context = {}) {
  const { sock, store, chatUpdate } = context;
  if (!sock) throw new Error("Socket Rimuru tidak tersedia.");
  return legacyHandler(sock, m, chatUpdate, store);
}

export { config, handler };
