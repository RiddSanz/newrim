import axios from "axios";
import yts from "yt-search";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execFile } from "child_process";
import config from "../../config.js";
import { VoipClient } from "rimuru";

const pluginConfig = {
  name: "playcall",
  alias: ["telepon", "call"],
  category: "search",
  description: "Putar musik dari YouTube lewat telpon",
  usage: ".playcall <query>",
  example: ".playcall komang",
  cooldown: 15,
  energi: 2,
  isEnabled: true,
};

const CALL_DURATION_MS = 300000; // 5 menit
const CONNECT_TIMEOUT_MS = 45000; // tunggu sampai diangkat
const MIN_AUDIO_BYTES = 20 * 1024; // di bawah ini dianggap rusak

// Pastikan mesin VoIP terikat ke socket bot yang SEKARANG.
// Socket dibuat ulang tiap reconnect, jadi client lama harus diganti.
async function ensureVoip(sock, force = false) {
  if (!force && global.voipClient && global.voipSock === sock) return;
  try {
    await global.voipClient?.disconnect?.();
  } catch {}
  global.voipClient = new VoipClient();
  await global.voipClient.connectWithSocket(sock);
  global.voipSock = sock;
}

// Cek hasil download benar-benar audio, bukan halaman error / JSON dari API.
function assertAudio(buf) {
  if (!buf || buf.length < MIN_AUDIO_BYTES) {
    throw new Error(`Audio dari API kosong/rusak (${buf?.length || 0} byte)`);
  }
  const head = buf.subarray(0, 16).toString("latin1").trimStart();
  if (head.startsWith("<") || head.startsWith("{")) {
    throw new Error("API mengembalikan halaman error, bukan file audio");
  }
}

// Normalisasi ke mp3 bersih (48kHz mono). Kalau ffmpeg tidak ada, pakai file asli.
function normalizeAudio(input, output) {
  return new Promise((resolve) => {
    execFile(
      "ffmpeg",
      ["-y", "-i", input, "-vn", "-ar", "48000", "-ac", "1", "-b:a", "128k", "-f", "mp3", output],
      { timeout: 120000 },
      (err) => {
        if (err || !fs.existsSync(output) || fs.statSync(output).size < MIN_AUDIO_BYTES) {
          resolve(false);
        } else {
          resolve(true);
        }
      },
    );
  });
}

// Mulai panggilan, lalu tunggu: connected / ended / timeout.
async function placeCall(number, audioFile) {
  const call = await global.voipClient.call(number, {
    audioSource: audioFile,
    durationMs: CALL_DURATION_MS,
  });

  const state = { connected: false, ended: false, reason: null, startedAt: Date.now() };

  const first = new Promise((resolve) => {
    const timer = setTimeout(() => resolve("timeout"), CONNECT_TIMEOUT_MS);
    call.on("connected", () => {
      state.connected = true;
      clearTimeout(timer);
      resolve("connected");
    });
    call.on("ended", (reason) => {
      state.ended = true;
      state.reason = reason;
      clearTimeout(timer);
      resolve("ended");
    });
    call.on("error", (err) => {
      console.error("[VoIP Call Error]", err);
    });
  });

  return { call, state, first };
}

async function handler(m, { sock }) {
  const query = m.text?.trim();
  if (!query)
    return m.reply(`🎵 *ᴘʟᴀʏ ᴄᴀʟʟ*\n\n> Masukkan judul lagunya\n\`Contoh: ${m.prefix}playcall surat cinta untuk starla\``);

  if (!config.fake_call?.active) {
    return m.reply("Fitur panggilan suara tidak diaktifkan (fake_call.active = false di config.js).");
  }

  m.react("📞");

  let tmpFile = null;
  let tmpRaw = null;
  const cleanup = () => {
    for (const f of [tmpFile, tmpRaw]) {
      try {
        if (f && fs.existsSync(f)) fs.unlinkSync(f);
      } catch {}
    }
  };

  try {
    await ensureVoip(sock);

    console.log("[PlayCall] Searching for:", query);
    const search = await yts(query);
    if (!search.videos.length) throw new Error("Video tidak ditemukan");
    const video = search.videos[0];

    const res = await axios.get(
      `https://api.azbry.com/api/download/ytmp3?url=${encodeURIComponent(video.url)}`,
      { timeout: 60000 },
    );
    const data = res.data;
    if (!data.status || !data.result || !data.result.download) {
      throw new Error("Gagal mengambil audio dari API");
    }

    await m.react("🕕");

    console.log("[PlayCall] Downloading audio from:", data.result.download);
    const audioRes = await axios.get(data.result.download, { responseType: "arraybuffer", timeout: 60000 });
    const audioBuffer = Buffer.from(audioRes.data);
    console.log("[PlayCall] Audio downloaded, buffer size:", audioBuffer.length);
    assertAudio(audioBuffer);

    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const id = crypto.randomBytes(4).toString("hex");
    tmpRaw = path.join(tmpDir, `call_${id}_raw.mp3`);
    const tmpClean = path.join(tmpDir, `call_${id}.mp3`);
    fs.writeFileSync(tmpRaw, audioBuffer);

    const normalized = await normalizeAudio(tmpRaw, tmpClean);
    tmpFile = normalized ? tmpClean : tmpRaw;
    if (!normalized) console.log("[PlayCall] ffmpeg tidak tersedia / gagal, memakai file asli");

    const targetJid =
      !m.isGroup && typeof m.chat === "string" && m.chat.endsWith("@s.whatsapp.net") ? m.chat : m.sender;
    const targetNumber = targetJid.split("@")[0];

    if (m.isGroup) {
      await m.reply(`_📞 Panggilan grup tidak didukung oleh library saat ini. Memanggil nomormu secara privat (${targetNumber})..._`);
    } else {
      await m.reply(`_📞 Memanggil nomormu (${targetNumber})..._`);
    }

    // Percobaan 1 dengan mesin VoIP sekarang. Kalau langsung putus sebelum
    // tersambung, ulangi sekali dengan mesin VoIP baru.
    let attempt = await placeCall(targetNumber, tmpFile).catch(async (e) => {
      console.log("[PlayCall] call() gagal, buat ulang VoIP:", e?.message || e);
      await ensureVoip(sock, true);
      return placeCall(targetNumber, tmpFile);
    });
    let result = await attempt.first;

    if (result === "ended" && !attempt.state.connected && Date.now() - attempt.state.startedAt < 15000) {
      console.log("[PlayCall] Putus sebelum tersambung (reason:", attempt.state.reason, "), mencoba ulang dengan VoIP baru");
      await ensureVoip(sock, true);
      attempt = await placeCall(targetNumber, tmpFile);
      result = await attempt.first;
    }

    if (result === "connected") {
      m.reply(`✅ *TERHUBUNG*\nLagu *${video.title}* sedang diputar di telpon!`);
      attempt.call.on("ended", (reason) => {
        cleanup();
        m.reply(`📵 Panggilan selesai${reason ? `: ${reason}` : ""}`);
      });
      if (attempt.state.ended) {
        cleanup();
        m.reply(`📵 Panggilan selesai${attempt.state.reason ? `: ${attempt.state.reason}` : ""}`);
      }
      return;
    }

    cleanup();
    console.log("[PlayCall] Gagal tersambung:", result, "reason:", attempt.state.reason);
    if (result === "timeout") {
      try {
        attempt.call.hangup?.();
        attempt.call.end?.();
      } catch {}
      m.react("😭");
      return m.reply("📵 Panggilan tidak diangkat dalam 45 detik, dibatalkan.");
    }
    m.react("😭");
    return m.reply(
      `📵 Panggilan putus sebelum tersambung (${attempt.state.reason || "ended"}).\n` +
        `> Sudah dicoba ulang otomatis sekali.\n` +
        `> Kalau masih begini, restart bot lalu coba lagi.`,
    );
  } catch (err) {
    cleanup();
    console.error("[PlayCall]", err);
    m.react("😭");
    m.reply(`Gagal menelpon / memainkan lagu: ${err.message}`);
  }
}

export { pluginConfig as config, handler };
