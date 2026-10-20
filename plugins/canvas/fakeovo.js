import sharp from 'sharp';

const pluginConfig = {
    name: 'fakeovo',
    alias: ['fake-ovo', 'fakeovo'],
    category: 'canvas',
    description: 'Membuat mockup saldo dompet digital dengan tanda DEMO',
    usage: '.fakeovo <nominal>',
    example: '.fakeovo 5000',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 2,
    isEnabled: true,
};

const escapeXml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

async function handler(m, { sock, text }) {
    const raw = String(text || '').trim();
    if (!raw || !/^(?:rp\s*)?[\d.,\s]+$/i.test(raw)) {
        return m.reply('Format: .fakeovo 5000\nMasukkan nominal angka untuk mockup DEMO.');
    }

    const digits = raw.replace(/\D/g, '');
    const amount = Number(digits);
    if (!digits || !Number.isSafeInteger(amount) || amount < 0) {
        return m.reply('Nominal tidak valid. Contoh: .fakeovo 5000');
    }

    await m.react('🕕');
    try {
        const formatted = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(amount);
        const amountText = `Rp${formatted}`;
        const safeAmount = escapeXml(amountText);
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600" viewBox="0 0 1000 600">
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#102b53"/>
              <stop offset="100%" stop-color="#168bd2"/>
            </linearGradient>
            <pattern id="watermark" width="460" height="180" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
              <text x="0" y="90" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="#ffffff" fill-opacity="0.16">DEMO • BUKAN SALDO NYATA</text>
            </pattern>
          </defs>
          <rect width="1000" height="600" rx="38" fill="#e9f2fc"/>
          <rect x="20" y="20" width="960" height="560" rx="30" fill="url(#bg)"/>
          <rect x="20" y="20" width="960" height="560" rx="30" fill="url(#watermark)"/>
          <text x="72" y="98" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#ffffff">SIMULASI DOMPET DIGITAL</text>
          <text x="72" y="154" font-family="Arial, sans-serif" font-size="22" fill="#dcecff">MOCKUP • BUKAN APLIKASI RESMI</text>
          <rect x="60" y="198" width="880" height="220" rx="24" fill="#ffffff" fill-opacity="0.96"/>
          <text x="100" y="254" font-family="Arial, sans-serif" font-size="25" fill="#52657f">Saldo demo</text>
          <text x="100" y="336" font-family="Arial, sans-serif" font-size="66" font-weight="800" fill="#142b4a">${safeAmount}</text>
          <rect x="60" y="450" width="880" height="82" rx="18" fill="#fff0b3"/>
          <text x="500" y="485" text-anchor="middle" font-family="Arial, sans-serif" font-size="25" font-weight="900" fill="#7c3b00">DEMO • BUKAN SALDO NYATA</text>
          <text x="500" y="514" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#7c3b00">Tidak berlaku sebagai bukti pembayaran atau saldo.</text>
        </svg>`;

        const image = await sharp(Buffer.from(svg)).png().toBuffer();
        await sock.sendMessage(m.chat, {
            image,
            caption: '⚠️ *SIMULASI / DEMO — BUKAN SALDO NYATA.* Tidak berlaku sebagai bukti pembayaran.'
        }, { quoted: m });
        await m.react('✅');
    } catch (error) {
        console.error('[FakeOvo Error]', error);
        await m.react('❌').catch(() => {});
        return m.reply('Gagal membuat mockup DEMO. Pastikan dependensi sharp terpasang.');
    }
}

export { pluginConfig as config, handler };
