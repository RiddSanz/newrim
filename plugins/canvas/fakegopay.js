import axios from "axios";
import te from "../../src/lib/rimuru-error.js";

const pluginConfig = {
    name: "fakegopay",
    alias: ["fakegopay"],
    category: "canvas",
    description: "Membuat canvas fake gopay",
    usage: ".fakegopay <saldo>|<coin>|<terpakai>|<bulan>",
    example: ".fakegopay 100000|500|20000|Januari",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
};

async function handler(m, { sock, text }) {
    const raw = String(text || "").trim();
    if (!raw) return m.reply(`Format salah!\n\n> Contoh: .fakegopay 100000|500|20000|Januari`);

    const parts = raw.split("|").map(v => v.trim());
    if (parts.length !== 4 || parts.some(v => !v)) {
        return m.reply(`Format salah!\n\n> Gunakan 4 data yang dipisah dengan |\n> Contoh: .fakegopay 100000|500|20000|Januari`);
    }

    const [saldo, coin, terpakai, bulan] = parts;

    await m.react("🕕");
    try {
        const url = `https://kyzznekoo.zone.id/api/canvas/fakegopay?saldo=${encodeURIComponent(saldo)}&coin=${encodeURIComponent(coin)}&terpakai=${encodeURIComponent(terpakai)}&bulan=${encodeURIComponent(bulan)}`;
        const res = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
                "Content-Type": "application/json"
            }
        });
        await sock.sendMessage(m.chat, { image: Buffer.from(res.data), caption: "✅ Berhasil membuat fake gopay" }, { quoted: m });
        await m.react("✅");
    } catch (e) {
        console.error("[FakeGopay Error]", e);
        await m.react("❌");
        m.reply(te(m.prefix, m.command, m.pushName));
    }
}

export { pluginConfig as config, handler };
