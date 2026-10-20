import * as _rimuruBaileys from 'rimuru';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
import { createRequire } from 'node:module';
const __require = createRequire(import.meta.url);
const fs = __require('fs')
const axios = __require('axios')

const _mcAllCats = {
    main: {
        emoji:'🏠', label:'MAIN', desc:'Command utama & monitoring bot',
        cmds:['menu','help','ping','status','speed','owner','ceksewa','bothealth','antibanstatus','safemode','warmupstatus','queuestatus','securityreport','auditlog','incidents','delayanalytics','forensiclog','reconnectstatus']
    },
    download: {
        emoji:'📥', label:'DOWNLOAD', desc:'Downloader berbagai platform',
        cmds:['tt','tiktok','ttmp3','igdl','fbdl','fbhd','ytmp3','ytmp4','threads','mediafire','capcut','soundcloud','terabox','tb','snackvideodl','svdl','pixeldraindl','pdl','videy','videydl']
    },
    hiburan: {
        emoji:'🎮', label:'HIBURAN', desc:'Fun, sticker & hiburan',
        cmds:['sticker','s','toimg','attp','ttp','quotesimage','wallpaper','emojimix','ship','shipping','truth','truthq','dare','tantang','confess','menfess','soulmatch','match','cekkhodam','khodam','rate','nilai','apakah','apa','akankah','akan','mimpiworld','dream','siapa','who','puisi','sajak']
    },
    tts: {
        emoji:'🎤', label:'TTS', desc:'Text to Speech berbagai karakter',
        cmds:['tts','say','ttsgoku','ttseminem','ttsmickey','ttsnahida','ttselon','ttsoptimus']
    },
    game: {
        emoji:'🎲', label:'GAME', desc:'Game interaktif di grup',
        cmds:['tebakkata','tebakword','susunkata','scramble','caklontong','cak','suit','rps']
    },
    stalker: {
        emoji:'🔍', label:'STALKER', desc:'Cek info akun sosmed & game',
        cmds:['igstalk','instagramstalk','tiktokstalk','ttstalk','ffstalk','stalkff','githubstalk','ghstalk']
    },
    cek: {
        emoji:'🎯', label:'CEK', desc:'Cek kepribadian & karakter',
        cmds:['cekcantik','cantik','cekganteng','ganteng','cekwibu','wibu','cekotaku','otaku','cekgamer','gamer','cekhoki','hoki','ceksial','sial','cekrezeki','rezeki','ceksetia','setia','cekbucin','bucin','cekgila','gila','cekmalas','malas']
    },
    primbon: {
        emoji:'🔮', label:'PRIMBON', desc:'Zodiak, mimpi & arti nama',
        cmds:['zodiak','horoscope','tafsirmimpi','mimpi','artinama','namameaning']
    },
    audio: {
        emoji:'🎵', label:'AUDIO FX', desc:'Efek suara dengan FFmpeg',
        cmds:['nightcore','nc','bass','bassboost','slow','slowed','fast','speed','robot','robotvoice','reverse','balik','earrape','loud','echo','gema','tupai','chipmunk']
    },
    canvas: {
        emoji:'🖼️', label:'CANVAS', desc:'Efek gambar & fake generator',
        cmds:['wanted','wantedposter','wasted','gta','jail','penjara','ektp','ktp','fakediscord','fakedc']
    },
    ephoto: {
        emoji:'✨', label:'EPHOTO', desc:'Efek teks dari ephoto360.com',
        cmds:['glitchtext','neonglitch','glowingtext','gradienttext','luxurygold','watercolortext','galaxystyle','summerbeach','royaltext','effectclouds','rainytext','cartoonstyle','papercutstyle','underwatertext','pixelglitch']
    },
    religi: {
        emoji:'🕌', label:'RELIGI', desc:'Jadwal sholat, doa & islami',
        cmds:['jadwalsholat','sholat2','asmaulhusna','asmaul','kisahnabi','nabi','doa','doaharian']
    },
    user: {
        emoji:'👤', label:'USER', desc:'Profil, level, koin & leaderboard',
        cmds:['profile','profil','daily','claim','exp','xp','koin','saldo','leaderboard','top']
    },
    search: {
        emoji:'🔎', label:'SEARCH', desc:'Brainly, Wattpad, bola & puisi',
        cmds:['brainly','brain','wattpad','jadwalbola','bola','puisi','sajak']
    },
    utility: {
        emoji:'🛠️', label:'UTILITY', desc:'Tools berguna sehari-hari',
        cmds:['ocr','readtext','wikipedia','wiki']
    },
    tools: {
        emoji:'🔧', label:'TOOLS', desc:'Utilitas & curl tools',
        cmds:['curl','download','npm','install','backup','autobackup','checklink','ceklink','delayanalytics','killswitch','resetwarn','fakedana','fakeff','fakejago','fakeovo','ampremium','amverify','netprem','nftools','amprem2']
    },
    rich: {
        emoji:'🧩', label:'RICH', desc:'Rich HTML, game, music/video player dan gallery',
        cmds:['ai','angrybirds','balap','breakout','catur','colorblock','dino','flappy','mahjong','memorymatch','mortalkombat','nixelgames','richquiz','richpong','richaim','aim','richplatformer','platformer','jump','richspaceshooter','spacegame','richmurder','richplane','pacman','pinz','play2','play3','playrich','slot2','slotui','snake','sonik','speedydash','stickman','supermario','tetris','tiktoksc','ytplay']
    },
    sewa: {
        emoji:'💰', label:'SEWA', desc:'Manajemen sewa bot',
        cmds:['ceksewa','addsewa','delsewa','extsewa','listsewa','sewa','invoice','inv']
    },
    statistik: {
        emoji:'📊', label:'STATISTIK', desc:'Statistik grup & keamanan',
        cmds:['statsgrup','groupstats','resetstats','reputation','rep','replist','bothealth','incidents','securitydashboard']
    },
    ai: {
        emoji:'🤖', label:'AI CHAT', desc:'Berbagai model AI chat',
        cmds:['chatgpt','openai','gptfree','freegpt','gptdemo','gpt4o','onlinegpt','gptlogin','gptchatly','gptonl','aichatfree','aifree','freechat','gptnet','deepseek','deepseekai','deepseekv3','deepseekr1','dsr1','gemini','geminiai','geminipro','geminiflash','geminithink','geminisearch','geminicode','learnlm','testgemini','groq','groqai','llama','llamaai','llamacode','mixtral','mixtralai','qwen','qwenai','gemma','gemmaai','mistralgroq','codechat','codeai','ai4chat','aichat','talkai','dola','cici','glm4','gitagpt','muslimai','mathgpt','dolphin','dolphinai','deepai2']
    },
    aiimg: {
        emoji:'🎨', label:'AI IMAGE', desc:'Generate & edit gambar dengan AI',
        cmds:['txt2img','imagine','animegen','aianimegen','sora2','soraai','nanobanana','imgedit','removebg','nobg','toghibli','ghiblistyle','toanime','animefy','toblack','tohitam','tochibi','chibistyle','tofigure','figurestyle','tofigurev2','tohijab','hijabstyle','tojapanese','japanesestyle','tomekah','meccabg','toemotebatu','to3d','3dfy','tocartoon','cartoonify','tomanga','mangafy','tooilpainting','oilpainting','tofigurine','figurine']
    },
    sticker: {
        emoji:'🪄', label:'STICKER', desc:'Buat & edit sticker kreatif',
        cmds:['sticker','s','toimg','attp','ttp','brat','bratvid','bratvideo','furbrat','removebg','nobg','emojimix','quotesimage','wallpaper','colongsw','pinterest']
    },
    grup: {
        emoji:'👥', label:'GRUP', desc:'Manajemen anggota & pengaturan grup',
        cmds:['promote','jadiadmin','demote','turonadmin','kick','keluarkan','kickall','add','tambah','kickinactive','cleangrup','tagall','everyone','hidetag','h','delete','del','setname','setnamegc','setdesc','cleardesc','infogc','groupinfo','setppgc','fotogrup','copygc','copymember','curimember','stealmbr','pin','pinpesan','unpin','unpinpesan','revoke','resetlink','setjoin','joinapproval','slowmode','proteksi','lockgrup','lockprofile','autoswgc','backupgrup','gpanel','topaktif','topmember','inaktif','memberinaktif']
    },
    proteksi: {
        emoji:'🛡️', label:'PROTEKSI', desc:'Sistem proteksi & moderasi grup',
        cmds:['antinsfw','antiocrlink','antiocrtext','antiraid','antilink','antilinkWA','antispam','antivortex','antiautobot','antiimage','antivideo','antidocument','antisticker','antiforward','warn','setwarn','maxwarn','listwarn','resetwarn','shadowban','sban','unshadowban','listshadowban','captcha','inviteguard','setantiraid','setantinsfw','infouser','whois']
    },
    security: {
        emoji:'🔐', label:'SECURITY', desc:'Keamanan lanjutan & forensik',
        cmds:['firewall','honeypot','lockdown','quarantine','threatintel','escalation','fullbackupsec','twofactor','2fa','trusteddevice','vault','messagevault','cmdacl','accesscontrol','sandboxscan','deeplink','linkanalysis','floodforensic','anomalycorrelation','mediascan','integritycheck','integritycek','rolehierarchy','repdecay','idlestatus','anomalystatus','forensicsearch','sessionhealth2','presencestatus','entropystatus','contentstatus','interactionstatus','degradationstatus','circadianstatus','poissoncheck','antiqueue','pausequeue','resumequeue']
    },
    doctor: {
        emoji:'🩺', label:'DOCTOR', desc:'AutoDoctor, health & diagnostik',
        cmds:['doctor','healthcheck','errorlog','autofix','sysinfo','repairlog','healthlog','bothealth','cekbot','sessionhealth','antibanstatus','safemode','warmupstatus','queuestatus','reconnectstatus','delayanalytics','forensiclog','circadianstatus','poissoncheck','degradationstatus','entropystatus']
    },
    rpg: {
        emoji:'⚔️', label:'RPG', desc:'Game RPG & kartu profil interaktif',
        cmds:['rpg','rpgmenu','rpgprofile','rpgstats','usercard','kartu','minicard','mc','mycard','profile','profil','daily','claim','exp','xp','koin','saldo','leaderboard','top','readvo','rvo','afk']
    },
    owner: {
        emoji:'👑', label:'OWNER', desc:'Panel khusus owner bot', ownerOnly: true,
        cmds:['addcase','approvecase','editcase','previewcase','cancelcase','listcase','rollbackcase','historycase','delcase','hapuscase','eval','ev','restart','self','public','npm','install','killswitch','safemode','addsewa','delsewa','extsewa','listsewa','addpremium','addprem','delpremium','delprem','listpremium','addowner','delowner','listowner','ban','unban','listban','backup','autobackup','backupdb','broadcast','bc','bcimg','setppbot','setnamebot','setbio','join','leave','block','unblock','addnomer','delnomer','curl','download','checklink','delayanalytics','forensiclog','auditlog','antibanstatus','warmupstatus','queuestatus','reconnectstatus']
    }
}

function _toSmallCaps(str) {
    const map = {'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ꜰ','g':'ɢ','h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ','o':'ᴏ','p':'ᴘ','q':'ǫ','r':'ʀ','s':'ꜱ','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ',' ':' '}
    return str.toLowerCase().split('').map(c => map[c] || c).join('')
}

global.allmenuRimuru = (prefix, isOwner) => {
    const _mBot   = global.namaBot   || 'Rimuru | カンタレラ'
    const _mOwner = global.namaowner || 'Owner'
    const _mUp    = Math.floor(process.uptime())
    const _mUpD   = Math.floor(_mUp / 86400)
    const _mUpH   = Math.floor((_mUp % 86400) / 3600)
    const _mUpM   = Math.floor((_mUp % 3600) / 60)
    const _mRam   = (process.memoryUsage().rss / 1048576).toFixed(1)
    const _mJam   = new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit', timeZone:'Asia/Jakarta' })
    const _mTgl   = new Date().toLocaleDateString('id-ID', { weekday:'long', day:'2-digit', month:'long', year:'numeric', timeZone:'Asia/Jakarta' })

    const _visibleCats = Object.keys(_mcAllCats).filter(k => !(_mcAllCats[k].ownerOnly && !isOwner))
    let _total = 0
    for (const k of _visibleCats) _total += _mcAllCats[k].cmds.length

    let t = ''

t += `sᴇʟᴀᴍᴀᴛ ᴅᴀᴛᴀɴɢ ᴅɪ sɪᴍᴘʟᴇ ᴍᴇɴᴜ *ᴄᴀɴᴛᴀʀᴇʟʟᴀ ᴘʀᴇᴍɪᴜᴍ*, ᴀᴋᴜ ᴀᴅᴀʟᴀʜ ʙᴏᴛ ʏᴀɴɢ ᴅɪʙᴜᴀᴛ ᴏʟᴇʜ *ғᴀʟʟᴢx ɪɴғɪɴɪᴛʏ*\n\n`

t += `╭ ʙᴏᴛ ɪɴғᴏ
│ 👤 ${_mBot}
│ 👑 ${_mOwner}
│ ⚡ ${_mUpStr}
│ 💾 ${_mRam} ᴍʙ
│ 🧩 1500+ ғᴜʟʟ sᴄʀᴀᴘᴇ
╰\n\n`

t += `> ✨ ᴘɪʟɪʜ ᴍᴇɴᴜ ʏᴀɴɢ ᴋᴀᴍᴜ ʙᴜᴛᴜʜᴋᴀɴ,
ᴅᴀɴ ɴɪᴋᴍᴀᴛɪ ᴘᴇɴɢᴀʟᴀᴍᴀɴɴʏᴀ.\n`
    t += `\n`

    for (const k of _visibleCats) {
        const cat = _mcAllCats[k]
        t += `╭┈┈⬡「 ${cat.emoji} *${_toSmallCaps(cat.label)}* ❭  _${cat.cmds.length} cmd_\n`
        t += `┃ ≡ _${cat.desc}_\n`
        t += `┃\n`
        for (const cmd of cat.cmds) {
            t += `┃ • *${prefix}${cmd}*\n`
        }
        t += `╰┈┈┈┈┈┈┈┈⬡\n`
        t += `\n`
    }

    t += `> ✦ _Gunakan tombol di bawah untuk navigasi cepat_`
    return t
}

global.mainmenuRimuru = (prefix) => {
    const c = _mcAllCats.main
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.downloadmenuRimuru = (prefix) => {
    const c = _mcAllCats.download
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.hiburanmenuRimuru = (prefix) => {
    const c = _mcAllCats.hiburan
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.ttsmenuRimuru = (prefix) => {
    const c = _mcAllCats.tts
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.gamemenuRimuru = (prefix) => {
    const c = _mcAllCats.game
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.stalkermenuRimuru = (prefix) => {
    const c = _mcAllCats.stalker
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.cekmenuRimuru = (prefix) => {
    const c = _mcAllCats.cek
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.primbonmenuRimuru = (prefix) => {
    const c = _mcAllCats.primbon
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.audiomenuRimuru = (prefix) => {
    const c = _mcAllCats.audio
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.canvasmenuRimuru = (prefix) => {
    const c = _mcAllCats.canvas
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.ephotomenuRimuru = (prefix) => {
    const c = _mcAllCats.ephoto
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.religimenuRimuru = (prefix) => {
    const c = _mcAllCats.religi
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.usermenuRimuru = (prefix) => {
    const c = _mcAllCats.user
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.searchmenuRimuru = (prefix) => {
    const c = _mcAllCats.search
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.utilitymenuRimuru = (prefix) => {
    const c = _mcAllCats.utility
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.toolsmenuRimuru = (prefix) => {
    const c = _mcAllCats.tools
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.richmenuRimuru = (prefix) => {
    const c = _mcAllCats.rich
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.sewamenuRimuru = (prefix) => {
    const c = _mcAllCats.sewa
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.statistikmenuRimuru = (prefix) => {
    const c = _mcAllCats.statistik
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.aimenuRimuru = (prefix) => {
    const c = _mcAllCats.ai
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.aiimgmenuRimuru = (prefix) => {
    const c = _mcAllCats.aiimg
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.stickermenuRimuru = (prefix) => {
    const c = _mcAllCats.sticker
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.grupmenuRimuru = (prefix) => {
    const c = _mcAllCats.grup
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.proteksimenuRimuru = (prefix) => {
    const c = _mcAllCats.proteksi
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.securitymenuRimuru = (prefix) => {
    const c = _mcAllCats.security
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.doctormenuRimuru = (prefix) => {
    const c = _mcAllCats.doctor
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.rpgmenuRimuru = (prefix) => {
    const c = _mcAllCats.rpg
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

global.ownermenuRimuru = (prefix) => {
    const c = _mcAllCats.owner
    let t = `╭┈┈⬡「 ${c.emoji} *${_toSmallCaps(c.label)}* 」\n`
    t += `┃ _${c.desc}_\n┃\n`
    for (const cmd of c.cmds) t += `┃ • *${prefix}${cmd}*\n`
    t += `╰┈┈┈┈┈┈┈┈⬡`
    return t
}

async function sendAllMenu(bulter, m, prefix, pushname, isOwner, isCreator, isPremium = false) {
    await bulter.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

    let _genMsg, _prepMedia
    try {
        const _bl  = _rimuruBaileys
        _genMsg    = _bl.generateWAMessageFromContent
        _prepMedia = _bl.prepareWAMessageMedia
    } catch (e) {
        console.error('[allmenu] gagal load baileys:', e.message)
    }

    // ── Variabel dasar ──
    const _mBot      = global.namaBot     || 'Rimuru | カンタレラ'
    const _mOwner    = global.namaowner   || 'Owner'
    const _mPrefix   = prefix
    const _mSaluran  = global.linkSaluran || 'https://whatsapp.com/channel/'
    const _mOwnerNum = (global.owner?.[0] || global.nobot || '').replace(/[^0-9]/g, '')
    const _mOwnerWa  = `https://wa.me/${_mOwnerNum}`
    const _mNewsJid  = global.saluranId   || '120363414017624228@newsletter'
    const _mNewsName = global.saluranName || _mBot

    // ── Role user ──
    const _mRole = isOwner || isCreator ? `👑 Owner`
                 : isPremium            ? `💎 Premium`
                 : `👤 User Biasa`

    // ── Runtime & memory ──
    const _mUp    = Math.floor(process.uptime())
    const _mUpD   = Math.floor(_mUp / 86400)
    const _mUpH   = Math.floor((_mUp % 86400) / 3600)
    const _mUpM   = Math.floor((_mUp % 3600) / 60)
    const _mRam   = (process.memoryUsage().rss / 1048576).toFixed(1)
    const _mUpStr = `${_mUpD}h ${_mUpH}j ${_mUpM}m`

    // ── Hitung total command ──
    // NOTE: sesuaikan './Rimuru.js' dengan nama file utama bot kamu kalau bukan itu
    let _mTotalCmd = 0
    try {
        const _mMainFile = global.mainFile || './Rimuru.js'
        const _mContent  = fs.readFileSync(_mMainFile, 'utf8')
        const _mMatches  = _mContent.match(/^case '[^']+'/gm) || []
        _mTotalCmd = _mMatches.length
    } catch (e) {
        console.error('[allmenu] gagal hitung total command:', e.message)
    }
    if (_mTotalCmd === 0) _mTotalCmd = '150+'

    // ── Jam & tanggal (Asia/Jakarta) ──
    const _mNow  = new Date()
    const _mJam  = _mNow.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
    const _mTgl  = _mNow.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })
    const _mHour = parseInt(_mNow.toLocaleTimeString('id-ID', { hour: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' }))
    const _mSapa = _mHour >= 4 && _mHour < 11  ? 'Pagi'
                 : _mHour >= 11 && _mHour < 15 ? 'Siang'
                 : _mHour >= 15 && _mHour < 18 ? 'Sore'
                 : 'Malam'

    // ── Header umum axios (hindari 403 dari host yang nolak request tanpa User-Agent) ──
    const _mAxiosHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'image/*,video/*,*/*;q=0.8'
    }

    // ── GIF Menu (gantikan Canvas Menu Card), fallback ke image kalau gagal ──
    const _mThumbUrl = global.thumnail2 || 'https://img3.pixhost.to/images/5260/763071434_rafaofficial.jpg'
    const _mGifUrl    = global.menuGif   || 'https://files.catbox.moe/oat93j.mp4'

    let _mThumbBuf  = null
    let _mIsGif     = false
    let _mAvatarUrl = null
    try {
        _mAvatarUrl = await bulter.profilePictureUrl(m.sender, 'image')
    } catch (e) {
        console.error('[allmenu] gagal ambil avatar:', e.message)
    }

    try {
        const _mGifRes = await axios.get(_mGifUrl, { responseType: 'arraybuffer', timeout: 15000, headers: _mAxiosHeaders })
        _mThumbBuf = Buffer.from(_mGifRes.data)
        _mIsGif = true
    } catch (_mgErr) {
        console.error('[allmenu] gagal ambil GIF:', _mgErr?.response?.status || _mgErr.message)
        try {
            const _mImgRes = await axios.get(_mThumbUrl, { responseType: 'arraybuffer', timeout: 15000, headers: _mAxiosHeaders })
            _mThumbBuf = Buffer.from(_mImgRes.data)
            _mIsGif = false
        } catch (_miErr) {
            console.error('[allmenu] gagal ambil fallback image:', _miErr?.response?.status || _miErr.message)
        }
    }

    // ── Teks utama menu (redesign) ──
    const _mGreet = _mSapa === 'Pagi'  ? '🌤 ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ' :
                    _mSapa === 'Siang' ? '☀️ ɢᴏᴏᴅ ᴀꜰᴛᴇʀɴᴏᴏɴ' :
                    _mSapa === 'Sore'  ? '🌇 ɢᴏᴏᴅ ᴇᴠᴇɴɪɴɢ' :
                                         '🌙 ɢᴏᴏᴅ ɴɪɢʜᴛ'
    const _mRoleIcon = (isOwner || isCreator) ? '👑' : isPremium ? '💎' : '🪸'
    const _mModeStr  = bulter.public ? 'PUBLIC' : 'SELF'
    const _mGreetCard =
`sᴇʟᴀᴍᴀᴛ ᴅᴀᴛᴀɴɢ ᴅɪ sɪᴍᴘʟᴇ ᴍᴇɴᴜ *ᴄᴀɴᴛᴀʀᴇʟʟᴀ ᴘʀᴇᴍɪᴜᴍ*, ᴀᴋᴜ ᴀᴅᴀʟᴀʜ ʙᴏᴛ ʏᴀɴɢ ᴅɪʙᴜᴀᴛ ᴏʟᴇʜ *ғᴀʟʟᴢx ɪɴғɪɴɪᴛʏ*

╭ ʙᴏᴛ ɪɴғᴏ
│ 👤 ${_mBot}
│ 👑 ${_mOwner}
│ ⚡ ${_mUpStr}
│ 💾 ${_mRam} ᴍʙ
│ 🧩 1500+ ғᴜʟʟ sᴄʀᴀᴘᴇ
╰

> ✨ ᴘɪʟɪʜ ᴍᴇɴᴜ ʏᴀɴɢ ᴋᴀᴍᴜ ʙᴜᴛᴜʜᴋᴀɴ,
ᴅᴀɴ ɴɪᴋᴍᴀᴛɪ ᴘᴇɴɢᴀʟᴀᴍᴀɴɴʏᴀ.\n`

    // Daftar lengkap semua command per kategori — sekarang manggil tiap fungsi per-kategori
    // (mainmenuRimuru, downloadmenuRimuru, hiburanmenuRimuru, dst) satu-satu, sesuai nama
    // kategori di _mcAllCats (pola nama fungsinya: `${key}menuRimuru`), lalu digabung.
    const _mVisibleCatsForList = Object.keys(_mcAllCats)
        .filter(k => !(_mcAllCats[k].ownerOnly && !(isOwner || isCreator)))
    const _mFullList = _mVisibleCatsForList
        .map(k => {
            const _mCatFn = global[`${k}menuRimuru`]
            if (typeof _mCatFn !== 'function') {
                console.error(`[allmenu] global.${k}menuRimuru belum terdefinisi, kategori dilewati`)
                return ''
            }
            try {
                return _mCatFn(prefix)
            } catch (e) {
                console.error(`[allmenu] gagal jalanin global.${k}menuRimuru:`, e.message)
                return ''
            }
        })
        .filter(Boolean)
        .join('\n\n')
    const _mText = _mGreetCard + (_mFullList ? `\n\n${_mFullList}` : '')

    // ── Category rows untuk single_select popup ──
    // NOTE: daftar ini manual/terpisah dari _mcAllCats di atas. Kalau kamu nambah/ubah
    // command di _mcAllCats, ingat update juga daftar ini biar nggak beda-beda sendiri.
    const _mCategories = [
        { header: `🏠 𝗠𝗔𝗜𝗡`,       title: `Command utama bot`,             description: `menu, ping, owner, ceksewa dll`,           id: `${_mPrefix}mcat main`      },
        { header: `👥 𝗚𝗥𝗨𝗣`,        title: `Panel manajemen grup`,          description: `kick, ban, promote, mute, warn dll`,       id: `${_mPrefix}mcat grup`      },
        { header: `🛡️ 𝗣𝗥𝗢𝗧𝗘𝗞𝗦𝗜`,  title: `Proteksi grup`,                 description: `antilink, antiraid, antinsfw dll`,         id: `${_mPrefix}mcat proteksi`  },
        { header: `📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗`,   title: `TikTok, YouTube, Terabox dll`, description: `tt, ytmp3, igdl, terabox, videy dll`,      id: `${_mPrefix}mcat download`  },
        { header: `🎮 𝗛𝗜𝗕𝗨𝗥𝗔𝗡`,    title: `Fun, game & hiburan`,           description: `ship, truth, dare, rate, siapa dll`,       id: `${_mPrefix}mcat hiburan`   },
        { header: `🎤 𝗧𝗧𝗦`,         title: `Text to Speech`,                description: `tts, ttsgoku, ttseminem, ttsmickey dll`,   id: `${_mPrefix}mcat tts`       },
        { header: `🎲 𝗚𝗔𝗠𝗘`,        title: `Game interaktif di grup`,       description: `tebakkata, susunkata, caklontong, suit`,   id: `${_mPrefix}mcat game`      },
        { header: `🔍 𝗦𝗧𝗔𝗟𝗞𝗘𝗥`,     title: `Cek info sosmed & game`,        description: `igstalk, tiktokstalk, ffstalk, ghstalk`,   id: `${_mPrefix}mcat stalker`   },
        { header: `🎯 𝗖𝗘𝗞`,         title: `Cek kepribadian & karakter`,    description: `cekcantik, cekwibu, cekhoki, cekrezeki`,   id: `${_mPrefix}mcat cek`       },
        { header: `🔮 𝗣𝗥𝗜𝗠𝗕𝗢𝗡`,    title: `Zodiak, mimpi & arti nama`,     description: `zodiak, tafsirmimpi, artinama`,            id: `${_mPrefix}mcat primbon`   },
        { header: `🎵 𝗔𝗨𝗗𝗜𝗢 𝗙𝗫`,   title: `Efek suara audio`,              description: `nightcore, bass, slow, reverse dll`,       id: `${_mPrefix}mcat audio`     },
        { header: `🖼️ 𝗖𝗔𝗡𝗩𝗔𝗦`,    title: `Efek gambar & fake generator`,  description: `wanted, wasted, jail, ektp, fakedc`,       id: `${_mPrefix}mcat canvas`    },
        { header: `✨ 𝗘𝗣𝗛𝗢𝗧𝗢`,      title: `Efek teks dari ephoto360`,      description: `glitchtext, neonglitch, gradienttext dll`, id: `${_mPrefix}mcat ephoto`    },
        { header: `🕌 𝗥𝗘𝗟𝗜𝗚𝗜`,      title: `Jadwal sholat & islami`,        description: `jadwalsholat, asmaulhusna, doa dll`,       id: `${_mPrefix}mcat religi`    },
        { header: `👤 𝗨𝗦𝗘𝗥`,        title: `Profil, level & koin`,          description: `profile, daily, exp, koin, leaderboard`,   id: `${_mPrefix}mcat user`      },
        { header: `🔎 𝗦𝗘𝗔𝗥𝗖𝗛`,      title: `Brainly, Wattpad & info`,       description: `brainly, wattpad, jadwalbola, puisi`,      id: `${_mPrefix}mcat search`    },
        { header: `🛠️ 𝗨𝗧𝗜𝗟𝗜𝗧𝗬`,   title: `Tools berguna sehari-hari`,     description: `ocr, wikipedia dll`,                       id: `${_mPrefix}mcat utility`   },
        { header: `🔧 𝗧𝗢𝗢𝗟𝗦`,       title: `Utilitas & owner tools`,        description: `curl, backup, checklink dll`,              id: `${_mPrefix}mcat tools`     },
        { header: `🧩 𝗥𝗜𝗖𝗛`,        title: `Rich HTML, game, music/video player`, description: `play2, play3, playrich, supermario, dll`, id: `${_mPrefix}mcat rich`      },
        { header: `💰 𝗦𝗘𝗪𝗔`,        title: `Info & manajemen sewa bot`,     description: `ceksewa, addsewa, invoice dll`,            id: `${_mPrefix}mcat sewa`      },
        { header: `📊 𝗦𝗧𝗔𝗧𝗜𝗦𝗧𝗜𝗞`,   title: `Statistik grup & keamanan`,     description: `statsgrup, reputation, incidents dll`,     id: `${_mPrefix}mcat statistik` },
        { header: `🤖 𝗔𝗜 𝗖𝗛𝗔𝗧`,     title: `Berbagai model AI chat`,        description: `chatgpt, gemini, groq, deepseek dll`,      id: `${_mPrefix}mcat ai`        },
        { header: `🎨 𝗔𝗜 𝗜𝗠𝗔𝗚𝗘`,    title: `Generate & edit gambar AI`,     description: `txt2img, animegen, toghibli, toanime dll`, id: `${_mPrefix}mcat aiimg`     },
        { header: `🪄 𝗦𝗧𝗜𝗖𝗞𝗘𝗥`,    title: `Buat & edit sticker kreatif`,   description: `brat, furbrat, attp, ttp, emojimix dll`,   id: `${_mPrefix}mcat sticker`   },
        { header: `🔐 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬`,  title: `Keamanan lanjutan & forensik`,  description: `firewall, vault, 2fa, sandboxscan dll`,    id: `${_mPrefix}mcat security`  },
        { header: `🩺 𝗗𝗢𝗖𝗧𝗢𝗥`,     title: `AutoDoctor & diagnostik bot`,   description: `doctor, bothealth, sysinfo, errorlog dll`, id: `${_mPrefix}mcat doctor`    },
        { header: `⚔️ 𝗥𝗣𝗚`,        title: `RPG, kartu & profil user`,      description: `rpg, usercard, minicard, mycard dll`,      id: `${_mPrefix}mcat rpg`       },
        ...(isOwner || isCreator ? [
        { header: `👑 𝗢𝗪𝗡𝗘𝗥`,       title: `Panel khusus owner bot`,        description: `addcase, delcase, eval, restart dll`,      id: `${_mPrefix}mcat owner`     }
        ] : [])
    ]

    // ── fakeQuoted ──
    const _mQuoted = {
        key: {
            participant: `0@s.whatsapp.net`,
            remoteJid:   `status@broadcast`
        },
        message: {
            contactMessage: {
                displayName: `🪸 ${_mBot}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${_mBot}\nitem1.TEL;waid=0:+0\nEND:VCARD`,
                sendEphemeral: true
            }
        }
    }

    // ── contextInfo ──
    // NOTE: expiration_time diperbaiki dari `Date.now() * 999` (overflow ke tahun ~50000)
    // jadi `Date.now() + 24 jam`. Ubah durasinya kalau kamu mau lebih lama/singkat.
    const _mExpirationTime = Date.now() + 24 * 60 * 60 * 1000

    const _mCtx = {
        mentionedJid: [m.sender],
        forwardingScore: 9999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid:   _mNewsJid,
            newsletterName:  _mNewsName,
            serverMessageId: 127
        },
        externalAdReply: {
            title:   _mBot,
            body:    `v2.0 • ${_mModeStr}`,
            mediaType: 1,
            showAdAttribution: false,
            renderLargerThumbnail: true,
            ...((_mThumbBuf && !_mIsGif) ? { thumbnail: _mThumbBuf } : {}),
            sourceUrl: _mSaluran
        },
        limited_time_offer: {
            text: `Gunakan bot ini dengan bijak yak`,
            url: _mSaluran,
            copy_code: _mBot,
            expiration_time: _mExpirationTime
        }
    }

    const _mButtons = [
        {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({ has_multiple_buttons: true })
        },
        {
            name: 'call_permission_request',
            buttonParamsJson: JSON.stringify({ has_multiple_buttons: true })
        },
        {
            name: 'single_select',
            buttonParamsJson: JSON.stringify({
                title: '⌗ ᴅᴀꜰᴛᴀʀ ᴋᴀᴛᴇɢᴏʀɪ ᴍᴇɴᴜ',
                sections: [{
                    title: '𓍢ִ໋ ᴘɪʟɪʜ ᴋᴀᴛᴇɢᴏʀɪ ʏᴀɴɢ ᴋᴀᴍᴜ ɪɴɢɪɴᴋᴀɴ',
                    highlight_label: _mBot,
                    rows: _mCategories
                }],
                has_multiple_buttons: true
            })
        },
        {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: 'ꜱᴀʟᴜʀᴀɴ ᴏꜰꜰɪᴄɪᴀʟ',
                url: _mSaluran,
                merchant_url: _mSaluran
            })
        },
        {
            name: 'cta_copy',
            buttonParamsJson: JSON.stringify({
                display_text: '⎙ ᴅᴇᴠ: ꜰᴀʟʟᴢx ɪɴꜰɪɴɪᴛʏ',
                copy_code: 'Anita Official'
            })
        },
        {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '</> ꜱᴇᴍᴜᴀ ᴄᴏᴍᴍᴀɴᴅ', id: `${_mPrefix}allmenu` })
        },
        {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '⛁ ɪɴꜰᴏ ꜱᴇᴡᴀ ʙᴏᴛ', id: `${_mPrefix}ceksewa` })
        },
        {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: 'ⓘ ꜱᴛᴀᴛᴜꜱ ʙᴏᴛ', id: `${_mPrefix}ping` })
        },
        ...(isOwner || isCreator ? [{
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({ display_text: '♔ ᴘᴀɴᴇʟ ᴏᴡɴᴇʀ', id: `${_mPrefix}mcat owner` })
        }] : [])
    ]

    const _mFlowParams = JSON.stringify({
        limited_time_offer: {
            text: `ꜱᴇʟᴀᴍᴀᴛ ᴅᴀᴛᴀɴɢ ᴅɪ ${_mBot} !`,
            url: _mSaluran,
            copy_code: _mBot,
            expiration_time: _mExpirationTime
        },
        bottom_sheet: {
            in_thread_buttons_limit: 2,
            divider_indices: [2, 3, 4, 5, 6, 999],
            list_title: 'ᴘɪʟɪʜ ᴋᴀᴛᴇɢᴏʀɪ ᴍᴇɴᴜ',
            button_title: 'ᴊᴇʟᴀᴊᴀʜɪ ᴍᴇɴᴜ ꜱᴇᴋᴀʀᴀɴɢ'
        }
    })

    try {
        // Upload GIF (video + gifPlayback) atau image fallback ke WA server
        if (!_genMsg || !_prepMedia) throw new Error('baileys generateWAMessageFromContent/prepareWAMessageMedia tidak tersedia')
        if (!_mThumbBuf) throw new Error('tidak ada media untuk diupload (fetch GIF & fallback image gagal semua)')

        const _mMediaPrep = await _prepMedia(
            _mIsGif ? { video: _mThumbBuf, gifPlayback: true } : { image: _mThumbBuf },
            { upload: bulter.waUploadToServer }
        )

        const _mHeader = _mIsGif
            ? { hasMediaAttachment: true, videoMessage: _mMediaPrep.videoMessage }
            : { hasMediaAttachment: true, imageMessage: _mMediaPrep.imageMessage }

        // Bangun proto interactiveMessage dengan header GIF/image
        const _mProto = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
                    interactiveMessage: {
                        header: _mHeader,
                        body:   { text: _mText },
                        footer: { text: global.Foah || `✦ ${_mBot}` },
                        contextInfo: {
                            mentionedJid: [m.sender],
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid:   _mNewsJid,
                                newsletterName:  _mNewsName,
                                serverMessageId: 127
                            }
                        },
                        nativeFlowMessage: {
                            messageParamsJson: _mFlowParams,
                            buttons: _mButtons
                        }
                    }
                }
            }
        }

        const _mGenMsg = _genMsg(m.chat, _mProto, { quoted: _mQuoted })
        await bulter.relayMessage(m.chat, _mGenMsg.message, { messageId: _mGenMsg.key.id })

    } catch (_mErr) {
        console.error('[allmenu] gagal kirim interactive+media:', _mErr.message)
        // Fallback 1: interactiveMessage biasa + thumbnail di externalAdReply
        try {
            await bulter.sendMessage(m.chat, {
                interactiveMessage: {
                    title: _mText,
                    footer: global.Foah || `✦ ${_mBot}  •  ${new Date().getFullYear()}`,
                    contextInfo: _mCtx,
                    nativeFlowMessage: {
                        messageParamsJson: _mFlowParams,
                        buttons: _mButtons
                    }
                }
            }, { quoted: _mQuoted })
        } catch (_mErr2) {
            console.error('[allmenu] gagal kirim interactive fallback 1:', _mErr2.message)
            // Fallback 2: kirim GIF/image langsung + caption plain
            try {
                if (_mIsGif) {
                    await bulter.sendMessage(m.chat, {
                        video: _mThumbBuf,
                        gifPlayback: true,
                        caption: _mText,
                        mentions: [m.sender],
                        contextInfo: _mCtx
                    }, { quoted: _mQuoted })
                } else {
                    await bulter.sendMessage(m.chat, {
                        image: _mThumbBuf || { url: _mThumbUrl },
                        mimetype: 'image/jpeg',
                        caption: _mText,
                        mentions: [m.sender],
                        contextInfo: _mCtx
                    }, { quoted: _mQuoted })
                }
            } catch (_mErr3) {
                console.error('[allmenu] gagal kirim media langsung, fallback teks polos:', _mErr3.message)
                await bulter.sendMessage(m.chat, {
                    text: _mText,
                    mentions: [m.sender],
                    contextInfo: _mCtx
                }, { quoted: _mQuoted })
            }
        }
    }

    await bulter.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
const __esmExports = { _mcAllCats, sendAllMenu }


export default __esmExports;
