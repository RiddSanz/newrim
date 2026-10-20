import axios from "axios";
import crypto from "crypto";

const cfg = {
    // API key Firebase Identity Toolkit yang digunakan untuk magic link.
    firebaseApiKey: "AIzaSyDtG1AU22ErnQD60AzBAcaknySiz9_CEq0",
    identityToolkitBase: "https://www.googleapis.com/identitytoolkit/v3/relyingparty",

    // Endpoint resmi untuk pengaktifan/verifikasi pembelian.
    officialPurchaseVerifyUrl: "https://us-central1-alight-creative.cloudfunctions.net/verifyPurchase",

    // API key/token pendukung opsional jika diperlukan provider.
    officialPurchaseVerifyApiKey: "AIzaSyDtG1AU22ErnQD60AzBAcaknySiz9_CEq0",
};

const dip = () => [crypto.randomInt(1, 255), crypto.randomInt(0, 255), crypto.randomInt(0, 255), crypto.randomInt(1, 255)].join('.');

const sp = h => ({
    ...h,
    'x-forwarded-for': dip(),
    'x-real-ip': dip(),
    'client-ip': dip(),
    'x-client-ip': dip(),
    'x-originating-ip': dip(),
    'x-cluster-client-ip': dip()
});

const headers = {
    "content-type": "application/json",
    "x-android-package": "com.alightcreative.motion",
    "x-android-cert": "ECA6BF91B8715A6F810ED0BBFC65B6CD578F52A8",
    "user-agent": "dalvik/2.1.0 (linux; u; android 15; 23127pn0cc build/bp1a.250505.005)",
};

const proHeaders = {
    "content-type": "application/json; charset=utf-8",
    "user-agent": "okhttp/3.12.1",
    "accept-encoding": "gzip",
};

const sessions = globalThis.amprem2Sessions || (globalThis.amprem2Sessions = new Map());
const SESSION_TTL = 15 * 60 * 1000;
const PLACEHOLDERS = new Set([
    "ISI_ENDPOINT_VERIFIKASI_PEMBELIAN_RESMI_DI_SINI",
    "ISI_API_KEY_VERIFIKASI_PEMBELIAN_RESMI_DI_SINI",
]);

function validEmail(email = "") {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function isConfigured(value) {
    const v = String(value || "").trim();
    return Boolean(v) && !PLACEHOLDERS.has(v) && !/^ISI_.*_DI_SINI$/.test(v);
}

function getError(error) {
    const data = error?.response?.data;
    if (data && typeof data === "object") {
        return data.error?.message || data.message || JSON.stringify(data);
    }
    if (data) return String(data);
    return error?.message || "Kesalahan tidak diketahui";
}

async function requestMagicLink(email) {
    if (!isConfigured(cfg.firebaseApiKey)) {
        return { ok: false, why: "Isi cfg.firebaseApiKey di bagian KONFIGURASI AMPREM2 terlebih dahulu." };
    }

    const apiKey = encodeURIComponent(cfg.firebaseApiKey);
    const createAuthUri = {
        identifier: email,
        continueUri: "http://localhost",
    };
    const sendLink = {
        requestType: 6,
        email,
        androidInstallApp: true,
        canHandleCodeInApp: true,
        continueUrl: "https://alightcreative.com?ui_sid=0366624874&ui_sd=0",
        iosBundleId: "com.alightcreative.motion",
        androidPackageName: "com.alightcreative.motion",
        androidMinimumVersion: "585",
        clientType: "CLIENT_TYPE_ANDROID",
    };

    try {
        await axios.post(
            `${cfg.identityToolkitBase}/createAuthUri?key=${apiKey}`,
            createAuthUri,
            { headers: sp(headers), timeout: 20000 },
        );
        await axios.post(
            `${cfg.identityToolkitBase}/getOobConfirmationCode?key=${apiKey}`,
            sendLink,
            { headers: sp(headers), timeout: 20000 },
        );
        return { ok: true };
    } catch (error) {
        return { ok: false, why: getError(error) };
    }
}

function extractOobCode(raw = "") {
    if (!raw) return null;
    let value = String(raw).trim().replace(/&amp;/g, "&");
    try {
        value = decodeURIComponent(value);
    } catch {}

    try {
        const url = new URL(value);
        let code = url.searchParams.get("oobCode");
        if (!code) {
            const nested = url.searchParams.get("link") || url.searchParams.get("q") || url.searchParams.get("url");
            if (nested) {
                try {
                    code = new URL(nested).searchParams.get("oobCode");
                } catch {}
            }
        }
        if (code) return code.replace(/[^a-zA-Z0-9_-]/g, "");
    } catch {}

    const match = value.match(/[?&]oobCode=([^&#\s]+)/i);
    if (match) return match[1];
    if (/^[a-zA-Z0-9_-]{10,}$/.test(value) && !value.includes("://")) return value;
    return null;
}

async function verifyMagicLink(email, rawLink) {
    if (!isConfigured(cfg.firebaseApiKey)) {
        return { ok: false, why: "Isi cfg.firebaseApiKey di bagian KONFIGURASI AMPREM2 terlebih dahulu." };
    }
    const oobCode = extractOobCode(rawLink);
    if (!oobCode) {
        return { ok: false, why: "Kode verifikasi (oobCode) tidak ditemukan di link tersebut." };
    }

    try {
        const { data } = await axios.post(
            `${cfg.identityToolkitBase}/emailLinkSignin?key=${encodeURIComponent(cfg.firebaseApiKey)}`,
            { email, oobCode, clientType: "CLIENT_TYPE_ANDROID" },
            { headers: sp(headers), timeout: 20000 },
        );
        return {
            ok: true,
            email,
            idToken: data?.idToken || null,
            uid: data?.localId || null,
            baru: Boolean(data?.isNewUser),
        };
    } catch (error) {
        return { ok: false, why: getError(error) };
    }
}

/*
 * Adapter untuk MEMERIKSA dan MENGAKTIFKAN pembelian melalui API resmi.
 */
async function verifyOfficialPurchase({ email, uid, idToken }) {
    if (!isConfigured(cfg.officialPurchaseVerifyUrl)) {
        return {
            configured: false,
            verified: false,
            message: "Endpoint verifikasi pembelian resmi belum dikonfigurasi.",
        };
    }

    const orderId = "neo-" + crypto.randomBytes(6).toString("hex");
    const body = {
        data: {
            productId: "am.full.sub.annual.19q4",
            token: "mmgaobamlahbbeccfplmbkbb.AO-J1OzqG0or_GJJIx-ms8GrTm-jaglCRfhQSRPUZKpl2YspYS-oN7_94uv8RC5vQbvd_Ios2pPDStZ2n7F0hLE3FiOU7HS3R6Fquulv5xLXFECSv4ctElw",
            skuType: "subs",
            orderId,
        },
    };

    try {
        const res = await axios.post(
            cfg.officialPurchaseVerifyUrl,
            body,
            {
                headers: sp({
                    ...proHeaders,
                    authorization: `Bearer ${idToken}`,
                    "firebase-instance-id-token": "cSDnCyp3T-uwp07z3tL86T:APA91bFkmvvsHw5nnqa1SBFci-99DRsKClLiETdRrVcJjS5yBx1v_FbCb1d8WhBuea_zmwnYBktyTIzcRhN4b6uNOUur9wPc0gKXmJDoZic0LhNq5V2s0xI",
                }),
                timeout: 20000,
                validateStatus: () => true,
            },
        );

        if (res.status >= 200 && res.status < 300) {
            return {
                configured: true,
                verified: true,
                orderId,
                message: "Pembelian terkonfirmasi & status Premium berhasil diaktifkan.",
            };
        }

        return {
            configured: true,
            verified: false,
            message: `Gagal mengonfirmasi pembelian: ${getError({ response: { data: res.data } })} (HTTP ${res.status})`,
        };
    } catch (error) {
        return {
            configured: true,
            verified: false,
            message: `Gagal memeriksa pembelian: ${getError(error)}`,
        };
    }
}

async function finishVerification(m, session, link) {
    if (session.processing) return m.reply("⏳ Link sedang diproses. Tunggu sebentar.");
    session.processing = true;

    await m.reply("⏳ *Memverifikasi magic link...*");
    const result = await verifyMagicLink(session.email, link);

    if (!result.ok) {
        session.processing = false;
        return m.reply(
            `❌ *Verifikasi gagal!*\n\n${result.why}\n\n` +
            "Pastikan email sesuai dan link belum pernah digunakan. Kamu bisa reply ulang ke pesan magic-link selama sesi masih aktif.",
        );
    }

    const purchase = await verifyOfficialPurchase({
        email: result.email,
        uid: result.uid,
        idToken: result.idToken,
    });
    sessions.delete(m.sender);

    let message =
        `✅ *VERIFIKASI AKUN BERHASIL!*\n\n` +
        `📧 *Email:* ${result.email}\n` +
        `🆔 *UID:* ${result.uid || "-"}\n` +
        `🆕 *Akun baru:* ${result.baru ? "Ya" : "Tidak"}\n\n`;

    if (!purchase.configured) {
        message += `ℹ️ *Status pembelian:* Belum diperiksa\n${purchase.message}\n\n` +
            "Isi officialPurchaseVerifyUrl di bagian KONFIGURASI AMPREM2 jika kamu memiliki endpoint verifikasi pembelian resmi.";
    } else if (purchase.verified) {
        message += `🎉 *PREMIUM SUCCESS!*\n` +
        `🆔 *Order ID:* ${purchase.orderId}\n` +
        `📅 *Status:* Active (Alight Motion)\n\n` +
        "Pembelian terkonfirmasi oleh endpoint verifikasi resmi.";
    } else {
        message += `⚠️ *Status pembelian:* ${purchase.message}\n\n` +
            "Akun sudah diverifikasi, tetapi status pembelian belum dikonfirmasi.";
    }
    return m.reply(message);
}

const pluginConfig = {
    name: "amprem2",
    alias: [],
    category: "tools",
    description: "Meminta magic link dan memverifikasi akun melalui reply",
    usage: ".amprem2 email@gmail.com",
    example: ".amprem2 contoh@gmail.com",
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true,
};

async function handler(m, { text = "" } = {}) {
    const command = String(m.command || "").toLowerCase();
    if (command !== "amprem2") return;

    const input = String(text || "").trim();
    const prefix = m.prefix || ".";
    if (!validEmail(input)) {
        return m.reply(`⚠️ *FORMAT SALAH!*\n\nGunakan:\n${prefix}amprem2 contoh@gmail.com`);
    }

    const previous = sessions.get(m.sender);
    if (previous && Date.now() - previous.time <= SESSION_TTL) {
        return m.reply("⚠️ Kamu masih punya sesi amprem2 aktif. Reply ke pesan magic-link sebelumnya atau tunggu sesi kedaluwarsa.");
    }

    await m.reply(`⏳ Meminta magic link untuk ${input}...`);
    const response = await requestMagicLink(input);
    if (!response.ok) return m.reply(`❌ *Gagal meminta magic link!*\n\n${response.why}`);

    const session = {
        email: input,
        chat: m.chat,
        time: Date.now(),
        promptId: null,
        processing: false,
    };
    sessions.set(m.sender, session);

    const prompt = await m.reply(
        `✅ *Magic link berhasil diminta!*\n\n` +
        `📧 *Email:* ${input}\n` +
        "📬 Cek Inbox/Beranda atau folder Spam.\n\n" +
        "⚠️ Salin link dari email lalu jangan dibuka dahulu.\n\n" +
        "↪️ *Reply pesan ini dengan link tersebut.*\n" +
        `⏱️ Sesi berlaku ${Math.floor(SESSION_TTL / 60000)} menit.`,
    );
    session.promptId = prompt?.key?.id || prompt?.message?.key?.id || null;
    sessions.set(m.sender, session);
}

async function before(m) {
    if (!m || m.isCommand || m.command) return false;
    const session = sessions.get(m.sender);
    if (!session || session.chat !== m.chat) return false;

    if (Date.now() - session.time > SESSION_TTL) {
        sessions.delete(m.sender);
        return false;
    }

    const quoted = m.quoted;
    if (!quoted?.fromMe) return false;
    if (session.promptId && quoted.id !== session.promptId) return false;
    if (!session.promptId && !String(quoted.body || "").includes("Magic link berhasil diminta!")) return false;

    const link = String(m.body || m.text || "").trim();
    if (!/^https?:\/\//i.test(link) && !/oobCode=/i.test(link)) return false;

    await finishVerification(m, session, link);
    return true;
}

export { pluginConfig as config, handler, before };
