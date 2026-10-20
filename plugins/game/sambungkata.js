import fs from 'fs';
import path from 'path';
import { getDatabase } from '../../src/lib/rimuru-database.js';
import { addExpWithLevelCheck } from '../../src/lib/rimuru-level.js';
import { getRandomReward, isSurrender } from '../../src/lib/rimuru-game-data.js';
import {
    getGameContextInfo,
    getWinnerContextInfo,
    checkFastAnswer
} from '../../src/lib/rimuru-context.js';
const aiJalurKamus = path.join(process.cwd(), 'src/data/kbbi.json');
let aiIsiKamus = [];
try {
    aiIsiKamus = JSON.parse(fs.readFileSync(aiJalurKamus, 'utf-8'));
} catch (aiGagalMuatKamus) {
    // Kamus cadangan lokal agar game tetap bisa berjalan ketika kbbi.json tidak disertakan.
    aiIsiKamus = [
        'abad','abang','acak','acara','ada','adat','adem','adil','adu','agak','agar','agama','agen','agenda','agung','air','ajaib','ajar','akal','akar','akhir','aksi','aktif','aku','akun','alam','alamat','alat','album','alir','alur','aman','amat','ambil','ampas','anak','anda','andai','angan','angin','angka','angkasa','angsa','anjing','antar','anting','anu','apa','apel','api','apik','arah','arak','arang','areal','arena','arus','asal','asap','asam','asli','asuh','atap','atas','awan','awas','ayam','ayah','ayo',
        'baca','badan','badak','bagai','bagan','bagi','bahagia','bahas','bahaya','bahu','baik','bajak','bakar','bakat','balai','balap','balas','bale','balik','bambu','ban','banci','banda','bandar','banding','bandit','bangga','bangku','bangun','bantu','banyak','barang','barat','baris','baru','basah','batu','bawa','bawang','bayang','bayar','bayi','beban','bebas','beda','begitu','belah','belajar','belanja','belas','beli','belok','benar','benci','benda','bentuk','benih','bening','bensin','bentuk','berani','beras','berat','beri','besar','besi','betah','betul','biar','bias','biasa','bijak','biji','bikin','bila','bilang','bilik','bina','binatang','bincang','bingkai','bingung','bintang','biru','bisa','bisik','bisnis','bisu','bobot','bocah','bodoh','bola','bolak','bolong','bon','bongkar','bonus','borang','boros','buah','buang','buat','bubur','budak','budaya','buka','bukan','bukit','bukti','bulan','bulat','bulu','bumi','bunga','bunyi','buram','buruk','burung','bus','busuk','butir',
        'cabang','cacar','cacing','cadang','cahaya','cair','cakap','cakra','calon','camil','campur','canda','candu','cangkir','cantik','capai','capek','cara','cari','carik','catat','cegah','cekat','cekik','cekung','cela','celah','celana','cepat','cerah','cerai','cerdas','cerita','cerna','cetak','cibir','cicil','cinta','ciri','cita','coba','cocok','cokelat','corak','coret','cuaca','cukup','cukur','cuma','cumbu','cumi','curah','curi',
        'dada','dadah','dadu','daerah','daftar','dagang','dagu','dahak','dahan','dahulu','dalam','dana','danau','dapat','dapur','darah','darat','dasar','data','datang','daun','debat','debu','dekat','demam','demi','demo','denah','denda','dengar','depan','depot','desa','desak','desain','detak','detik','dewa','dewi','diam','diare','didik','dikit','dinding','dini','dingin','diri','disiplin','doa','dokter','domba','dompet','dosa','duduk','duit','dunia','durasi','durian',
        'edar','edit','efek','ekor','elang','emas','embun','empuk','enak','endap','energi','enggan','engsel','enam','enak','erat','esok','etalase','etika','evakuasi',
        'gagah','gagal','gajah','gaji','galak','galang','galau','gambar','gambut','ganda','gang','ganggu','ganjil','ganti','garam','garis','garpu','gas','gatal','gaul','gawai','gawat','gaya','gayung','gede','gelap','gelar','gelas','gelombang','gemar','gemas','gempa','genap','gendong','genius','gerak','geram','gerbang','gereja','gerigi','gerimis','gigi','gila','gilang','gilir','gitar','gizi','global','goda','golek','golong','gosok','gotong','gua','gubah','gubuk','gudang','gula','guling','gulir','guna','gunung','gurih','guru',
        'habis','hadir','hafal','hajat','hajar','hakim','halal','halang','halus','hama','hamba','hampir','hangat','hantu','hapus','harap','harga','hari','harum','hasil','hati','haus','hebat','hewan','hias','hibur','hidang','hidup','hijau','hilang','hitung','hobi','hormat','hujan','hukum','hulu','humas','humor','huni','huruf',
        'ibadah','ibarat','ibu','ikan','ikat','ikhlas','iklan','ikut','ilham','ilmiah','ilmu','imam','iman','imbas','impor','indah','indikasi','induk','ingat','ingin','ingkar','injak','inti','irama','isi','iseng','istri','istirahat','itik','izin',
        'jabat','jadah','jadi','jadwal','jaga','jago','jahat','jahit','jalan','jalar','jamah','jamak','jamal','jambu','jamur','janji','jarak','jarang','jari','jatuh','jawab','jawat','jaya','jejak','jelas','jelita','jembatan','jempol','jemput','jendela','jenguk','jenis','jentik','jeram','jerapah','jerat','jerih','jernih','jeruk','jika','jimat','jinak','jingga','joget','joki','jual','juang','juara','jujur','juluk','jumlah','junta',
        'kabar','kabel','kabin','kabur','kaca','kacang','kacamata','kacau','kadal','kadar','kado','kadut','kaget','kakak','kaki','kaku','kalah','kalau','kalem','kali','kalimat','kamar','kampung','kamu','kanan','kandang','kandel','kandas','kangen','kanker','kantong','kantor','kapal','kapas','kapur','karat','karena','karib','karya','kasar','kasih','kasir','kasus','kata','katak','kawal','kawan','kawat','kaya','kayu','kebal','kebun','kecil','kedai','kedap','kedip','kejar','kejam','kejang','keji','keladi','kelas','kelapa','kelar','kelat','kelih','kelip','keliru','kelok','kelor','keluar','kemah','kemas','kemarau','kembali','kemudi','kenal','kenang','kenari','kencang','kendali','kenyal','kenyang','kepala','kepang','kepit','kerah','kerak','keramat','kerang','keras','kereta','keripik','kerja','kering','keris','kerja','keruh','kesan','kesat','kesel','ketat','ketika','ketok','ketupat','kicau','kilang','kilap','kilat','kilau','kilo','kinerja','kios','kipas','kirim','kisah','kita','kiwi','klasik','klinik','klub','koala','kobok','kode','koin','koleksi','kolam','kolar','komik','kompas','kompor','kompak','kompor','komputer','komunikasi','konon','kontak','kopi','koran','korek','kotor','koyak','kucing','kuda','kudus','kuku','kuliah','kulit','kultur','kumpul','kunang','kuning','kunci','kupas','kurang','kursi','kurus','kusut',
        'labuh','lacak','laci','laga','lagak','lagi','lagu','lahir','laju','laksana','laku','lalat','lama','lambat','lampu','lanang','lancar','langit','langkah','langka','langkah','langsing','lanjut','lansia','lapang','lapar','lapis','lapor','larang','laras','lari','laris','larut','laskar','laut','lawak','layak','layar','layu','lebar','lebah','lebam','lebih','lebur','ledek','ledak','leher','lekat','lekas','lelah','lelang','lelap','lemak','lemas','lembah','lembut','lempar','lengan','lengang','lengkap','lengkung','lentur','lepas','lerai','lesu','letak','letih','lewat','lezat','liang','lihat','lima','limbah','limpah','lincah','lindung','lingkar','lingkup','lintah','lintas','lipat','lipur','liris','listrik','liur','lobak','lomba','loncat','longgar','lorong','luang','luas','lubang','lucu','ludah','luka','lulus','lumut','lunak','lupa','lurah','lurus',
        'macam','macan','macet','madah','mahal','mahir','mahkota','maju','makam','makan','makna','malam','malang','malas','malu','mampu','mana','mandi','manis','manja','manjur','mantap','manusia','marah','marak','marina','marmer','masak','masalah','masih','masuk','mata','mati','matang','matematika','mawar','medan','medis','mega','meja','mekar','mekanik','melati','melaut','melodi','memar','memori','menang','menara','menari','mendaki','menit','mental','menu','merah','meraih','merak','merasa','merdu','merek','merica','mesin','mesra','mesum','metal','meter','metode','mewah','mimpi','minat','minum','minus','mirip','misal','miskin','misteri','mobil','modal','mode','modem','mogok','mohon','moral','motor','muat','mudah','muka','mula','mulai','mulia','mulut','mundur','murah','murid','murka','murung','musim','musik','musuh','mutu',
        'nada','nadi','nafas','nafi','naga','nalar','nama','nanas','nanti','napas','nasib','nasihat','nasional','nasi','nasrani','natal','nada','negara','nenek','netral','niaga','niat','ninja','nisan','nitip','niur','nomor','normal','nota','novel','november','nuansa','nusa',
        'obat','obor','objek','ode','olah','olahraga','ombak','omel','omong','ongkos','onta','operasi','optik','orang','orasi','orde','organ','orientasi','otak','otot','oval','oven',
        'pabrik','pacak','pacak','pacu','padam','padat','padi','padu','pagar','pagi','pahit','pajak','pakai','pakar','paket','paku','palang','palet','palsu','paman','pamor','panas','panca','panci','pancing','pancur','pandai','pandang','pangan','panggil','panik','panjang','panjat','pantai','pantas','pantul','papan','para','parah','parang','paras','parfum','parit','parkir','paruh','pasang','pasar','pasir','pasok','pasrah','pasti','pasu','patuh','patung','patut','payah','payung','pecah','pecat','pedas','peduli','pegang','pekan','pekat','pelaku','pelan','pelang','pelangi','pelat','pelihara','pelita','peluk','peluang','pelukis','pemalu','pemandu','pemetik','penak','penat','peniti','penuh','peran','perang','peras','perahu','perak','peran','perang','perasa','perawan','periksa','perih','perintah','perisa','perisai','peristiwa','perlu','permai','permen','pernah','peron','persen','pesan','pesawat','pesek','peserta','pesona','pesta','petang','petik','petir','peti','pikul','pilih','pijat','pikir','pilar','pilih','pilu','pindah','pintar','pintu','pipih','pipit','pirang','piring','pisah','pisang','pita','pohon','pokok','pola','polisi','porsi','potong','potret','prada','praktek','prima','prinsip','prisma','produk','program','proses','protes','proton','provinsi','pucat','puas','puasa','pucuk','pudar','pukat','pukul','pulau','pulang','pulih','pulut','punah','punya','pupuk','pura','pusing','putih','putra','putri','putus',
        'raba','rabu','racik','racun','radar','radio','raga','ragam','rajin','raket','rakit','rakyat','ramah','ramai','ramal','rambut','rame','rampas','rampung','rancang','rangka','rantai','rapat','rapi','rapuh','rasa','rasio','rasuk','rata','ratu','raup','rawan','rawat','rawi','raya','reaksi','rebah','rebus','rebut','reda','redam','redup','reka','rekam','rekan','rekap','rekat','rekor','relasi','relasi','relawan','remas','rembulan','remuk','renang','renda','rendah','renggang','renyah','resep','resah','resap','revisi','rezeki','riba','ribut','ribu','rindu','ringan','ringkas','rintis','ripuh','ritme','riuh','roboh','roda','roh','roket','rokok','roman','rombak','rompi','ronda','rugi','rujak','ruang','rugi','rumah','rumit','rumput','runcing','runtuh','rupa','rusak','rusa','rute',
        'sabar','sabda','sabit','sabu','sadar','sadar','sahabat','saham','sahut','sajak','sakit','saku','salah','salam','salat','salju','sama','sambal','sambut','sampah','sampai','samping','sampul','sana','sandal','sandang','sangat','sangkar','sanggup','santai','santap','sapu','sarang','saran','sarat','sari','saring','sarung','sasaran','satu','sawah','sawat','sayang','sayap','sayur','sebab','sebar','sebat','sebelah','seberang','sedap','sedih','sedot','segar','segera','sehat','sejarah','sejuk','sekat','sekolah','sekop','seksi','sektor','selada','selalu','selang','selaput','selasa','selat','selera','selesai','selimut','seling','selisih','selonjor','selot','semak','semang','semangat','semarak','semat','sembab','sembah','sembilan','sembuh','semesta','semua','semut','senam','senang','senapan','senar','senat','sendal','sendi','sendok','senja','sentak','senter','sentuh','sepah','sepak','sepan','sepat','sepatu','seperti','sepi','sepotong','serah','seram','serang','serasi','serat','serba','serbu','serem','sering','serius','serok','seru','serupa','sesak','sesat','sesuai','setan','setel','setia','setir','setuju','setum','sewa','siang','siap','siar','sifat','sikat','siku','sila','silam','silang','silang','simpan','simpul','sinap','singa','singgah','singkat','sini','siram','sisi','siswa','sisir','situs','soal','sobek','sodok','sokong','sopan','sore','sorot','sorong','sosial','soto','suara','suap','suatu','subur','suka','suku','sulit','sulit','sulung','sumber','sumbu','sumpah','sungguh','sungai','sungkur','suntik','surat','surga','suruh','surut','susah','susun','susu','susut','sutra','suvenir',
        'tabah','tabel','tabib','tabir','tabrak','tadi','tahap','tahu','tahun','tajam','tajuk','takut','tali','taman','tambah','tampak','tampil','tampung','tanah','tanda','tangan','tangga','tangis','tanggung','tanggal','tangkap','tangkis','tangki','tangkup','tanya','tapa','tari','tarik','taruh','tasik','tawar','tawar','tebal','tebang','tebar','tebas','tebu','tegak','tegang','tegar','tegas','teguh','tegur','teh','tekan','teki','tekun','telah','telan','telat','telepon','teliti','telur','teman','tembak','tembang','tembok','tembus','tempa','tempel','tempuh','tenang','tenda','tendang','tengah','tengik','tenis','tentang','tepat','tepi','tepuk','terang','terapi','teras','terasi','teratai','terbang','terbit','terima','terjun','terkadang','terlalu','ternak','terong','terus','tes','tetap','tewas','tiada','tidak','tidur','tiga','tikar','tiket','tikung','tilam','timah','timba','timbun','timpa','timur','tinggal','tinggi','tingkat','tingkah','tinta','tipis','tirai','tiru','titik','titip','tolak','tolong','tombak','tombol','tomat','topang','topi','topik','total','tradisi','tualang','tuan','tubuh','tuduh','tugas','tugu','tujuh','tukar','tulang','tulis','tulus','tumbuh','tumpah','tumpang','tumpas','tumpuk','tunas','tunggu','tunjuk','turun','tusuk','tutup',
        'uang','ubah','ubur','ucap','udang','udara','ujar','ujian','ujung','ukur','ulang','ular','ulas','ulir','umat','umbi','umur','undang','undur','ungkap','unik','unit','untuk','untung','upah','upaya','urban','urap','urat','usaha','usia','usik','usul','utama','utara','utang','utuh',
        'vadum','vakum','valid','variasi','vasal','vegetasi','velg','verbal','versi','virus','visual','vitamin','vokal','volume',
        'wadah','waduk','wajah','wajar','wajib','wakaf','waktu','walau','wangi','warna','warung','wasit','waspada','watak','watan','wawasan','wayang','web','wedang','wedel','wewenang','wibawa','wujud','wukuf',
        'yakin','yakni','yatim','yayasan','yoga','yogurt','yuk','yuwana',
        'zakat','zaman','zebra','ziarah','zina','zona','zoologi'
    ];
}

const aiKonfigPlugin = {
    name: 'sambungkata',
    alias: ['skata', 'sambungkat', 'wordchain'],
    category: 'game',
    description: 'Game sambung kata dari huruf akhir kata sebelumnya (KBBI) — special from Ai~! ⭐',
    usage: '.sambungkata | .sambungkata start | .sambungkata stop',
    example: '.sambungkata',
    isOwner: false,
    isPremium: false,
    isGroup: true,
    isPrivate: false,
    cooldown: 3,
    energi: 0,
    isEnabled: true
};

if (!global.aiPanggung) global.aiPanggung = new Map();

const AI_BANNER_GAME = `╔══「 ⭐ *KATA BERSAMBUNG* ⭐ 」
╟ Haii~ semuanya! Ini Ai lho! 💕
║ Yuk kita main bareng~!
║ Sambungkan kata dari huruf
║ terakhir kata sebelumnya ya~!
║ Ai pasti support kalian semua!
╚══ *Ai love you~!* ❤️✨`;

const AI_BANNER_RULES = `╔══「 💫 *PERATURAN dari Ai~!* 💫 」
╟ Jawaban harus kata dasar ya~
║ jangan ada spasi atau imbuhan 🌸
╟ Harus ada di kamus KBBI lho!
╟ Waktu tiap giliran: *30 detik* ⏳
╟ 3x salah atau waktu habis = gugur 😢
╟ Wajib *reply* pesan giliran Ai ya~!
╟ Ketik *nyerah* kalau mau keluar 🏳️
╚══ *Ganbatte ne~!* ⭐❤️`;

const aiDaftarKonsonan = ['q','w','r','t','y','p','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m'];
const aiKoleksiHuruf   = ['a','b','c','d','e','g','h','i','j','k','l','m','n','p','r','s','t','u','w'];

const aiPilihAcak = (aiKoleksi) => aiKoleksi[Math.floor(Math.random() * aiKoleksi.length)];

function aiCariKataAwal() {
    const aiHurufTerpilih  = aiPilihAcak(aiKoleksiHuruf);
    const aiKamusFiltered  = aiIsiKamus.filter(aiKata => aiKata.startsWith(aiHurufTerpilih));
    let   aiKataLahir      = aiPilihAcak(aiKamusFiltered);
    let   aiCobaLagi       = 0;

    while (
        (!aiKataLahir ||
        aiKataLahir.length < 3 ||
        aiKataLahir.length > 7 ||
        aiKataLahir.includes('-') ||
        aiKataLahir.includes(' ')) &&
        aiCobaLagi < 300
    ) {
        aiKataLahir = aiPilihAcak(aiKamusFiltered);
        aiCobaLagi++;
    }

    return (aiKataLahir || 'makan').toLowerCase();
}

function aiCariAwalanKata(aiKataInput) {
    if (aiKataInput.length < 3) return aiKataInput;

    if (/([qwrtypsdfghjklzxcvbnm][qwrtypsdfhjklzxcvbnm])$/.test(aiKataInput))
        return /([qwrtypsdfhjklzxcvbnm])$/.exec(aiKataInput)[0];

    if (/([qwrtypsdfghjklzxcvbnm][aiueo]ng)$/.test(aiKataInput))
        return /([qwrtypsdfghjklzxcvbnm][aiueo]ng)$/.exec(aiKataInput)[0];

    if (/([aiueo][aiueo]([qwrtypsdfghjklzxcvbnm]|ng)?)$/i.test(aiKataInput)) {
        if (/(ng)$/i.test(aiKataInput))                              return aiKataInput.substring(aiKataInput.length - 3);
        else if (/([qwrtypsdfghjklzxcvbnm])$/i.test(aiKataInput))   return aiKataInput.substring(aiKataInput.length - 2);
        else                                                          return aiKataInput.substring(aiKataInput.length - 1);
    }

    if (/n[gy]([aiueo]([qwrtypsdfghjklzxcvbnm])?)$/.test(aiKataInput)) {
        const aiPotonganNyNg = /n[gy]/i.exec(aiKataInput)[0];
        const aiSisiKata     = aiKataInput.split(aiPotonganNyNg);
        return aiPotonganNyNg + aiSisiKata[aiSisiKata.length - 1];
    }

    const aiSaringKonsonan = Array.from(aiKataInput).filter(aiHuruf => aiDaftarKonsonan.includes(aiHuruf));
    let   aiKonsonanAkhir  = aiSaringKonsonan[aiSaringKonsonan.length - 1];

    for (const aiHuruf of aiDaftarKonsonan) {
        if (aiKataInput.endsWith(aiHuruf)) aiKonsonanAkhir = aiSaringKonsonan[aiSaringKonsonan.length - 2];
    }

    const aiBelahanKata = aiKataInput.split(aiKonsonanAkhir);
    if (aiKataInput.endsWith(aiKonsonanAkhir)) return aiKonsonanAkhir + aiBelahanKata[aiBelahanKata.length - 2] + aiKonsonanAkhir;
    return aiKonsonanAkhir + aiBelahanKata[aiBelahanKata.length - 1];
}

function aiSusunDaftarPemain(aiSesi, aiAwalan, aiNamaCommand) {
    return (
        `╔═〘 ⭐ Daftar Pemain 〙\n` +
        aiSesi.aiBarisanPemain.map((aiId, aiNomor) => `╟ ${aiNomor + 1}. @${aiId.split('@')[0]} 💕`).join('\n') +
        `\n╚════\n\n` +
        `Ketik~:\n` +
        `*${aiAwalan}${aiNamaCommand}* → join bareng Ai! 🌟\n` +
        `*${aiAwalan}${aiNamaCommand} start* → mulai _(khusus host ya~)_ ⭐`
    );
}

async function aiCoretPemain(aiPesan, aiSock, aiRuangan, aiSesi, aiAlasanGugur) {
    clearTimeout(aiSesi.aiHitungMundur);
    aiSesi.aiBarisanPemain = aiSesi.aiBarisanPemain.filter(aiId => aiId !== aiPesan.sender);

    await aiPesan.reply(
        `😢 Aduuh~ @${aiPesan.sender.split('@')[0]} *kehabisan kesempatan* dan gugur!\n` +
        `_(${aiAlasanGugur})_\n\n` +
        `_Jangan sedih ya~ next time pasti bisa! 💕_\n` +
        `_Sisa pemain: ${aiSesi.aiBarisanPemain.length} orang~ ⭐_`,
        { mentions: [aiPesan.sender] }
    );

    if (aiSesi.aiBarisanPemain.length <= 1) {
        await aiTutupPanggung(aiPesan, aiSock, aiRuangan, aiSesi);
        return true;
    }

    aiSesi.aiPemainGiliran = aiSesi.aiBarisanPemain[0];
    aiSesi.aiKataPanggung  = aiCariKataAwal();
    aiSesi.aiNyawa         = 3;
    await aiLemparGiliran(aiPesan, aiSock, aiRuangan, aiSesi);
    return true;
}

async function aiLemparGiliran(aiPesan, aiSock, aiRuangan, aiSesi) {
    const aiAwalanKini = aiCariAwalanKata(aiSesi.aiKataPanggung);

    const aiTeksGiliran =
        `⭐ *SAMBUNG KATA — by Ai~!* ⭐\n\n` +
        `Giliran: @${aiSesi.aiPemainGiliran.split('@')[0]} 💫\n\n` +
        `Kata sekarang~:\n` +
        `*${aiSesi.aiKataPanggung.toUpperCase()}* ✨\n\n` +
        `Sambung dari~:\n` +
        `\`\`\`${aiAwalanKini.toUpperCase()}...\`\`\`\n\n` +
        `_Ketik kata yang dimulai dengan *${aiAwalanKini.toUpperCase()}* ya~! 🌸_\n` +
        `_Kalau menyerah ketik *nyerah* 🏳️_\n\n` +
        `*Ganbatte~! Ai percaya kamu bisa! 💕*`;

    const aiPesanGiliranTerkirim = await aiPesan.reply(aiTeksGiliran, { mentions: [aiSesi.aiPemainGiliran] });

    aiSesi.aiKunciPesanGiliran = aiPesanGiliranTerkirim?.key || null;

    if (aiSesi.aiHitungMundur) clearTimeout(aiSesi.aiHitungMundur);
    aiSesi.aiHitungMundur = setTimeout(async () => {
        const aiSesiAktif = global.aiPanggung.get(aiRuangan);
        if (!aiSesiAktif || aiSesiAktif.aiStatusPanggung !== 'aiTampil') return;
        if (aiSesiAktif.aiPemainGiliran !== aiSesi.aiPemainGiliran || aiSesiAktif.aiKataPanggung !== aiSesi.aiKataPanggung) return;

        const aiPemainHabisWaktu = aiSesiAktif.aiPemainGiliran;
        aiSesiAktif.aiBarisanPemain = aiSesiAktif.aiBarisanPemain.filter(aiId => aiId !== aiPemainHabisWaktu);

        await aiPesan.reply(
            `⏱️ Huwaa~! @${aiPemainHabisWaktu.split('@')[0]} *kehabisan waktu* dan gugur! 😢\n\n` +
            `_Jangan menyesal ya~ Ai tetap sayang kok! 💕_\n` +
            `_Sisa pemain: ${aiSesiAktif.aiBarisanPemain.length} orang~ ⭐_`,
            { mentions: [aiPemainHabisWaktu] }
        );

        if (aiSesiAktif.aiBarisanPemain.length <= 1) return aiTutupPanggung(aiPesan, aiSock, aiRuangan, aiSesiAktif);

        aiSesiAktif.aiPemainGiliran = aiSesiAktif.aiBarisanPemain[0];
        aiSesiAktif.aiKataPanggung  = aiCariKataAwal();
        aiSesiAktif.aiNyawa         = 3;
        await aiLemparGiliran(aiPesan, aiSock, aiRuangan, aiSesiAktif);
    }, 30000);

    return aiPesanGiliranTerkirim;
}

async function aiTutupPanggung(aiPesan, aiSock, aiRuangan, aiSesi) {
    clearTimeout(aiSesi.aiHitungMundur);
    global.aiPanggung.delete(aiRuangan);

    const aiJuara = aiSesi.aiBarisanPemain[0];

    if (!aiJuara) {
        await aiPesan.reply(
            `🏁 *Panggung selesai~!* ⭐\n\n` +
            `_Huwaa semua pemain gugur... 😢_\n` +
            `_Tidak ada pemenangnya kali ini~_\n\n` +
            `_Tapi Ai tetap sayang semuanya! 💕_`
        );
        return;
    }

    try {
        const aiDatabase     = getDatabase();
        const aiDataSiJuara  = aiDatabase.getUser(aiJuara);
        const aiHadiahKejutan = getRandomReward();
        aiDatabase.updateEnergi(aiJuara, aiHadiahKejutan.limit);
        aiDatabase.updateKoin(aiJuara, aiHadiahKejutan.koin);
        if (!aiDataSiJuara.rpg) aiDataSiJuara.rpg = {};
        await addExpWithLevelCheck(aiSock, { chat: aiRuangan, sender: aiJuara }, aiDatabase, aiDataSiJuara, aiHadiahKejutan.exp);
        aiDatabase.save();

        await aiPesan.reply(
            `⭐✨ *SELAMAT~! @${aiJuara.split('@')[0]} MENANG!* ✨⭐\n\n` +
            `Waaah keren banget~! Ai bangga sama kamu! 💕\n\n` +
            `🎁 *Hadiah dari Ai~!*\n` +
            `▸ +${aiHadiahKejutan.limit} Limit 💫\n` +
            `▸ +${aiHadiahKejutan.koin} Koin ✨\n` +
            `▸ +${aiHadiahKejutan.exp} EXP 🌟\n\n` +
            `_Terima kasih sudah main bareng Ai~!_\n` +
            `*Ai love you~! ❤️⭐*`,
            { mentions: [aiJuara] }
        );
    } catch (aiGagalBeriHadiah) {
        await aiPesan.reply(
            `⭐✨ *SELAMAT~! @${aiJuara.split('@')[0]} MENANG!* ✨⭐\n\n` +
            `Waaah hebat banget~! Ai bangga! 💕\n\n` +
            `_Terima kasih sudah main bareng Ai~!_\n` +
            `*Ai love you~! ❤️⭐*`,
            { mentions: [aiJuara] }
        );
    }
}

async function aiMulaiPanggung(aiPesan, { sock: aiSock }) {
    if (!global.aiPanggung) global.aiPanggung = new Map();

    const aiRuangan      = aiPesan.chat;
    const aiTandaPrefix  = aiPesan.prefix || '.';
    const aiNamaCommand  = 'sambungkata';
    const aiArgumen      = (aiPesan.body || '').replace(/^[.!/#\\]?\w+\s*/i, '').trim().toLowerCase();
    const aiSesiSaatIni  = global.aiPanggung.get(aiRuangan);

    if (!aiSesiSaatIni) {
        global.aiPanggung.set(aiRuangan, {
            aiRuangan,
            aiSiHost:            aiPesan.sender,
            aiBarisanPemain:     [aiPesan.sender],
            aiStatusPanggung:    'aiPersiapan',
            aiPemainGiliran:     null,
            aiKataPanggung:      '',
            aiHitungMundur:      null,
            aiNyawa:             3,
            aiKunciPesanGiliran: null,
            aiKataBekasPakai:    new Set()
        });
        const aiSesiBaru = global.aiPanggung.get(aiRuangan);
        return aiPesan.reply(
            `${AI_BANNER_GAME}\n\n${AI_BANNER_RULES}\n\n` +
            `👑 Host~: @${aiPesan.sender.split('@')[0]}\n\n` +
            aiSusunDaftarPemain(aiSesiBaru, aiTandaPrefix, aiNamaCommand),
            { mentions: aiSesiBaru.aiBarisanPemain }
        );
    }

    if (aiSesiSaatIni.aiStatusPanggung === 'aiPersiapan') {

        if (aiArgumen === 'stop') {
            if (aiPesan.sender !== aiSesiSaatIni.aiSiHost && !aiPesan.isOwner)
                return aiPesan.reply(
                    `❌ Ehhh~! Hanya *host room* atau owner bot yang bisa menghentikan lho! 😤`
                );
            global.aiPanggung.delete(aiRuangan);
            return aiPesan.reply(
                `🛑 *Room Sambung Kata dihentikan~* 💔\n\n_Sayang banget ya... Ai sedih juga nih~ 😢_`
            );
        }

        if (aiArgumen === 'start') {
            if (aiPesan.sender !== aiSesiSaatIni.aiSiHost && !aiPesan.isOwner)
                return aiPesan.reply(
                    `❌ Ehhh~! Hanya *host room* yang bisa mulai lho~! 😤\n\n` +
                    `👑 Host-nya: @${aiSesiSaatIni.aiSiHost.split('@')[0]} ya~!`,
                    { mentions: [aiSesiSaatIni.aiSiHost] }
                );
            if (aiSesiSaatIni.aiBarisanPemain.length < 2)
                return aiPesan.reply(
                    `❌ Huwaa~ minimal *2 player* dulu dong buat mulai~! 😢\n\n` +
                    `Ajak teman-temanmu join dengan \`${aiTandaPrefix}${aiNamaCommand}\` ya~! 💕`
                );

            aiSesiSaatIni.aiStatusPanggung = 'aiTampil';
            aiSesiSaatIni.aiPemainGiliran  = aiSesiSaatIni.aiBarisanPemain[0];
            aiSesiSaatIni.aiKataPanggung   = aiCariKataAwal();
            aiSesiSaatIni.aiNyawa          = 3;

            await aiPesan.reply(
                `⭐ *YEAY~! GAME DIMULAI!* ⭐\n\n` +
                `Haii semuanya~! Ini pemain yang keren~! 💕\n\n` +
                aiSesiSaatIni.aiBarisanPemain.map((aiId, aiNomor) => `${aiNomor + 1}. @${aiId.split('@')[0]} 🌟`).join('\n') +
                `\n\n_Ai akan temani kalian semua~! Ganbatte ne~! ✨_`,
                { mentions: aiSesiSaatIni.aiBarisanPemain }
            );

            return aiLemparGiliran(aiPesan, aiSock, aiRuangan, aiSesiSaatIni);
        }

        if (aiSesiSaatIni.aiBarisanPemain.includes(aiPesan.sender))
            return aiPesan.reply(
                `⚠️ Hehehe~ kamu sudah join kok~! 😄\n` +
                `Tunggu host ketik \`${aiTandaPrefix}${aiNamaCommand} start\` ya~! 💫\n\n` +
                `👑 Host~: @${aiSesiSaatIni.aiSiHost.split('@')[0]}`,
                { mentions: [aiSesiSaatIni.aiSiHost] }
            );

        aiSesiSaatIni.aiBarisanPemain.push(aiPesan.sender);
        return aiPesan.reply(
            `⭐ Yaaay~! @${aiPesan.sender.split('@')[0]} *bergabung~!* 💕\n\n` +
            aiSusunDaftarPemain(aiSesiSaatIni, aiTandaPrefix, aiNamaCommand),
            { mentions: aiSesiSaatIni.aiBarisanPemain }
        );
    }

    if (aiSesiSaatIni.aiStatusPanggung === 'aiTampil') {
        if (aiArgumen === 'stop' && (aiPesan.sender === aiSesiSaatIni.aiSiHost || aiPesan.isOwner)) {
            clearTimeout(aiSesiSaatIni.aiHitungMundur);
            global.aiPanggung.delete(aiRuangan);
            return aiPesan.reply(
                `🛑 *Game Sambung Kata dihentikan paksa~* 💔\n` +
                `_oleh ${aiPesan.isOwner && aiPesan.sender !== aiSesiSaatIni.aiSiHost ? 'owner' : 'host'}_\n\n` +
                `_Huuu sayang banget~ Ai sedih nih... 😢_\n` +
                `_Tapi Ai tetap sayang semuanya ya~! ❤️_`
            );
        }
        const aiAwalanKini = aiCariAwalanKata(aiSesiSaatIni.aiKataPanggung);
        return aiPesan.reply(
            `⚠️ Ehh~! *Game masih berjalan lho~!* ⭐\n\n` +
            `Sekarang giliran: @${aiSesiSaatIni.aiPemainGiliran.split('@')[0]} 💫\n` +
            `Kata: *${aiSesiSaatIni.aiKataPanggung.toUpperCase()}* ✨\n` +
            `Sambung dari: \`${aiAwalanKini.toUpperCase()}...\`\n\n` +
            `_Gunakan \`.sambungkata stop\` untuk menghentikan (host/owner) ya~_ 🌸`,
            { mentions: [aiSesiSaatIni.aiPemainGiliran] }
        );
    }
}

async function aiJawabHati(aiPesan, aiSock) {
    if (!global.aiPanggung) return false;

    const aiRuangan     = aiPesan.chat;
    const aiSesiAktif   = global.aiPanggung.get(aiRuangan);

    if (!aiSesiAktif || aiSesiAktif.aiStatusPanggung !== 'aiTampil') return false;
    if (aiPesan.sender !== aiSesiAktif.aiPemainGiliran) return false;

    const aiInputMentah = (aiPesan.body || '').trim();
    if (!aiInputMentah || aiInputMentah.startsWith('.') || aiInputMentah.startsWith('!') || aiInputMentah.startsWith('/')) return false;

    const aiKataJawaban = aiInputMentah.toLowerCase().trim();

    if (isSurrender(aiKataJawaban)) {
        clearTimeout(aiSesiAktif.aiHitungMundur);
        aiSesiAktif.aiBarisanPemain = aiSesiAktif.aiBarisanPemain.filter(aiId => aiId !== aiPesan.sender);

        await aiPesan.reply(
            `🏳️ *Huwaa~! Nyerah~?* 😢\n\n` +
            `_@${aiPesan.sender.split('@')[0]} menyerah dan gugur..._\n\n` +
            `_Gapapa~ Ai tetap sayang kok~! 💕_\n` +
            `_Sisa pemain: ${aiSesiAktif.aiBarisanPemain.length} orang~ ⭐_`,
            { mentions: [aiPesan.sender] }
        );

        if (aiSesiAktif.aiBarisanPemain.length <= 1) {
            return aiTutupPanggung(aiPesan, aiSock, aiRuangan, aiSesiAktif).then(() => true);
        }

        aiSesiAktif.aiPemainGiliran = aiSesiAktif.aiBarisanPemain[0];
        aiSesiAktif.aiKataPanggung  = aiCariKataAwal();
        aiSesiAktif.aiNyawa         = 3;
        await aiLemparGiliran(aiPesan, aiSock, aiRuangan, aiSesiAktif);
        return true;
    }

    const aiIdQuoted       = aiPesan.quoted?.id || aiPesan.quoted?.key?.id || '';
    const aiIdPesanTerakhir = aiSesiAktif.aiKunciPesanGiliran?.id || '';
    const aiReplyTerverifikasi = aiPesan.quoted && aiIdPesanTerakhir && aiIdQuoted === aiIdPesanTerakhir;

    if (!aiReplyTerverifikasi) {
        aiSesiAktif.aiNyawa--;
        await aiPesan.react('⚠️');
        if (aiSesiAktif.aiNyawa <= 0) {
            return aiCoretPemain(aiPesan, aiSock, aiRuangan, aiSesiAktif, 'tidak reply pesan giliran Ai');
        }
        await aiPesan.reply(
            `⚠️ Ehh~! Harus *reply* pesan giliran Ai dulu dong~! 😤\n\n` +
            `_Kesempatan tersisa: ${aiSesiAktif.aiNyawa}x ya~_ 💫\n` +
            `_Coba lagi kata yang dimulai dengan *${aiCariAwalanKata(aiSesiAktif.aiKataPanggung).toUpperCase()}* ne~! 🌸_`
        );
        return true;
    }

    const aiAwalanWajib = aiCariAwalanKata(aiSesiAktif.aiKataPanggung);
    if (!aiKataJawaban.startsWith(aiAwalanWajib)) return false; 

    if (aiKataJawaban.length < 3) {
        await aiPesan.reply(
            `❌ Huuu~! Kata terlalu pendek~! Minimal *3 huruf* ya~! 😢\n\n` +
            `_Coba kata lain yang dimulai dengan *${aiAwalanWajib.toUpperCase()}* ne~! 💕_`
        );
        return true;
    }

    if (!aiIsiKamus.includes(aiKataJawaban)) {
        aiSesiAktif.aiNyawa--;
        await aiPesan.react('❌');
        if (aiSesiAktif.aiNyawa <= 0) {
            return aiCoretPemain(aiPesan, aiSock, aiRuangan, aiSesiAktif, 'kehabisan kesempatan');
        }
        await aiPesan.reply(
            `❌ Huwaa~! *"${aiKataJawaban}"* tidak ada di kamus Ai (KBBI) lho~! 😢\n\n` +
            `_Kesempatan tersisa: ${aiSesiAktif.aiNyawa}x ya~_ 💫\n` +
            `_Coba kata lain yang dimulai dengan *${aiAwalanWajib.toUpperCase()}* ne~! 🌸_`
        );
        return true;
    }

    if (aiSesiAktif.aiKataBekasPakai.has(aiKataJawaban)) {
        aiSesiAktif.aiNyawa--;
        await aiPesan.react('🔄');
        if (aiSesiAktif.aiNyawa <= 0) {
            return aiCoretPemain(aiPesan, aiSock, aiRuangan, aiSesiAktif, 'kehabisan kesempatan');
        }
        await aiPesan.reply(
            `🔄 Ehh~! Kata *"${aiKataJawaban}"* sudah pernah dipakai lho~! 😤\n\n` +
            `_Kesempatan tersisa: ${aiSesiAktif.aiNyawa}x ya~_ 💫\n` +
            `_Coba kata lain yang dimulai dengan *${aiAwalanWajib.toUpperCase()}* ne~! 🌸_`
        );
        return true;
    }

    clearTimeout(aiSesiAktif.aiHitungMundur);
    aiSesiAktif.aiKataBekasPakai.add(aiKataJawaban);
    aiSesiAktif.aiNyawa = 3;
    await aiPesan.react('✅');

    const aiPosisiGiliran      = aiSesiAktif.aiBarisanPemain.indexOf(aiPesan.sender);
    aiSesiAktif.aiPemainGiliran = aiSesiAktif.aiBarisanPemain[(aiPosisiGiliran + 1) % aiSesiAktif.aiBarisanPemain.length];
    aiSesiAktif.aiKataPanggung  = aiKataJawaban;

    try {
        const aiDatabase       = getDatabase();
        const aiDataSiPenjawab = aiDatabase.getUser(aiPesan.sender);
        aiDatabase.updateEnergi(aiPesan.sender, 1);
        aiDatabase.updateKoin(aiPesan.sender, Math.floor(Math.random() * 100) + 50);
        if (!aiDataSiPenjawab.rpg) aiDataSiPenjawab.rpg = {};
        await addExpWithLevelCheck(aiSock, aiPesan, aiDatabase, aiDataSiPenjawab, Math.floor(Math.random() * 200) + 100);
        aiDatabase.save();
    } catch (aiGagalBeriReward) {}

    await aiLemparGiliran(aiPesan, aiSock, aiRuangan, aiSesiAktif);
    return true;
}
export { aiKonfigPlugin as config, aiMulaiPanggung as handler, aiJawabHati as answerHandler };