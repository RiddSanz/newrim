import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
import { createRequire } from 'node:module';
const __require = createRequire(import.meta.url);
const __esmExports = {};

import * as _rimuruBaileys from "rimuru";
const { extractMessageContent, jidNormalizedUser, proto, delay, getContentType, areJidsSameUser, generateWAMessage } = _rimuruBaileys
const chalk = __require('chalk')
const fs = __require('fs')
const Crypto = __require('crypto')
const axios = __require('axios')
const moment = __require('moment-timezone')
const { sizeFormatter } = __require('human-readable')
const util = __require('util')
const { defaultMaxListeners } = __require('stream')
const { read, MIME_JPEG, RESIZE_BILINEAR, AUTO, jimp } = __require('jimp')

const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000)

__esmExports.unixTimestampSeconds = unixTimestampSeconds


__esmExports.resize = async (image, width, height) => {
    let oyy = await jimp.read(image)
    let kiyomasa = await oyy.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
    return kiyomasa
}


__esmExports.generateMessageTag = (epoch) => {
    let tag = (0, __esmExports.unixTimestampSeconds)().toString();
    if (epoch)
        tag += '.--' + epoch; // attach epoch if provided
    return tag;
}

__esmExports.processTime = (timestamp, now) => {
  return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

__esmExports.getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

__esmExports.getBuffer = async (url, options) => {
  try {
    options ? options : {}
    const res = await axios({
      method: "get",
      url,
      headers: {
        'DNT': 1,
        'Upgrade-Insecure-Request': 1
      },
      ...options,
      responseType: 'arraybuffer'
    })
    return res.data
  } catch (err) {
    return err
  }
}

__esmExports.formatSize = (bytes) => {
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
if (bytes === 0) return '0 Bytes';
const i = Math.floor(Math.log(bytes) / Math.log(1024));
return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
};

__esmExports.fetchJson = async (url, options) => {
    try {
        options ? options : {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}

__esmExports.runtime = function(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

__esmExports.clockString = (ms) => {
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

__esmExports.reSize = async (buffer, x, z) => {
      return new Promise(async (resolve, reject) => {
         var buff = await read(buffer)
         var ab = await buff.resize(x, z).getBufferAsync(MIME_JPEG)
         resolve(ab)
      })
}

__esmExports.sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

__esmExports.isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

__esmExports.getTime = (format, date) => {
  if (date) {
    return moment(date).locale('id').format(format)
  } else {
    return moment.tz('Asia/Jakarta').locale('id').format(format)
  }
}

__esmExports.formatDate = (n, locale = 'id') => {
  let d = new Date(n)
  return d.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  })
}

__esmExports.tanggal = (numer) => {
  myMonths = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
        myDays = ['Minggu','Senin','Selasa','Rabu','Kamis','Jum’at','Sabtu']; 
        var tgl = new Date(numer);
        var day = tgl.getDate()
        bulan = tgl.getMonth()
        var thisDay = tgl.getDay(),
        thisDay = myDays[thisDay];
        var yy = tgl.getYear()
        var year = (yy < 1000) ? yy + 1900 : yy; 
        const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
        let d = new Date
        let locale = 'id'
        let gmt = new Date(0).getTime() - new Date('1 January 1970').getTime()
        let weton = ['Pahing', 'Pon','Wage','Kliwon','Legi'][Math.floor(((d * 1) + gmt) / 84600000) % 5]

        return`${thisDay}, ${day} - ${myMonths[bulan]} - ${year}`
}

__esmExports.formatp = sizeFormatter({
    std: 'JEDEC', //'SI' = default | 'IEC' | 'JEDEC'
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
})

__esmExports.jsonformat = (string) => {
    return JSON.stringify(string, null, 2)
}

function format(...args) {
  return util.format(...args)
}

__esmExports.logic = (check, inp, out) => {
  if (inp.length !== out.length) throw new Error('Input and Output must have same length')
  for (let i in inp)
    if (util.isDeepStrictEqual(check, inp[i])) return out[i]
  return null
}

__esmExports.generateProfilePicture = async (buffer) => {
  const jimp = await Jimp.read(buffer)
  const min = jimp.getWidth()
  const max = jimp.getHeight()
  const cropped = jimp.crop(0, 0, min, max)
  return {
    img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG)
  }
}

__esmExports.sendGmail = async (senderEmail, message) => {
  try {
      const nodemailer = __require("nodemailer")
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: "kiuurOTP",
        pass: "boqamuoocnticxpm", 
      },
    });

    const mailOptions = {
      from: "kiuurotp@gmail.com",
      to: "client@gmail.com",
      subject: 'New Message from ' + senderEmail,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    console.log('Message sent to your Gmail.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

__esmExports.bytesToSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

__esmExports.getSizeMedia = (path) => {
    return new Promise((resolve, reject) => {
        if (/http/.test(path)) {
            axios.get(path)
            .then((res) => {
                let length = parseInt(res.headers['content-length'])
                let size = __esmExports.bytesToSize(length, 3)
                if(!isNaN(length)) resolve(size)
            })
        } else if (Buffer.isBuffer(path)) {
            let length = Buffer.byteLength(path)
            let size = __esmExports.bytesToSize(length, 3)
            if(!isNaN(length)) resolve(size)
        } else {
            reject('error gatau apah')
        }
    })
}

__esmExports.parseMention = (text = '') => {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}

__esmExports.getGroupAdmins = (participants) => {
        let admins = []
        for (let i of participants) {
            i.admin === "superadmin" ? admins.push(i.id) :  i.admin === "admin" ? admins.push(i.id) : ''
        }
        return admins || []
     }

/**
 * Serialize Message
 * @param {WAConnection} conn 
 * @param {Object} m 
 * @param {store} store 
 */
 
 __esmExports.smsg = (client, m, store) => {
    if (!m) return m;
    
    const M = proto.WebMessageInfo;
    
    // Process message key
    if (m.key) {
        m.id = m.key.id;
        
        // Handle status updates
        if (m.key.remoteJid?.startsWith('status')) {
            m.from = jidNormalizedUser(m.key.participant || m.participant);
        } else {
            m.from = jidNormalizedUser(m.key.remoteJid);
        }
        
        m.isBaileys = m.id?.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat?.endsWith('@g.us') || false;
        
        m.sender = client.decodeJid(
            (m.fromMe && client.user.id) || 
            m.participant || 
            m.key.participant || 
            m.chat || ''
        );
        
        if (m.isGroup && m.key.participant) {
            m.participant = client.decodeJid(m.key.participant);
        }
    }
    
    // Process message content
    if (m.message) {
        m.mtype = getContentType(m.message);
        
        // Handle viewOnceMessage
        if (m.mtype === 'viewOnceMessage') {
            const viewOnceContent = m.message.viewOnceMessage?.message;
            if (viewOnceContent) {
                const viewOnceType = getContentType(viewOnceContent);
                m.msg = viewOnceContent[viewOnceType];
            }
        } else {
            m.msg = m.message[m.mtype];
        }
        
        // Extract message body
        m.body = (
            m.message.conversation ||
            m.msg?.caption ||
            m.msg?.text ||
            (m.mtype === 'listResponseMessage' && m.msg?.singleSelectReply?.selectedRowId) ||
            (m.mtype === 'buttonsResponseMessage' && m.msg?.selectedButtonId) ||
            (m.mtype === 'viewOnceMessage' && m.msg?.caption) ||
            m.text ||
            ''
        ).toString();
    }
    
    // Process quoted message
    const quoted = m.msg?.contextInfo?.quotedMessage;
    m.quoted = quoted || null;
    m.mentionedJid = m.msg?.contextInfo?.mentionedJid || [];
    
    if (m.quoted) {
        const originalQuoted = m.quoted;
        let type = getContentType(m.quoted);
        
        // Extract quoted content
        if (type && m.quoted[type]) {
            m.quoted = m.quoted[type];
        }
        
        // Handle productMessage and other nested types
        if (['productMessage', 'viewOnceMessageV2'].includes(type) && typeof m.quoted === 'object') {
            const nestedType = getContentType(m.quoted);
            if (nestedType && m.quoted[nestedType]) {
                m.quoted = m.quoted[nestedType];
                type = nestedType;
            }
        }
        
        // Ensure m.quoted is an object
        if (typeof m.quoted === 'string') {
            m.quoted = { text: m.quoted };
        }
        
        if (typeof m.quoted !== 'object' || m.quoted === null) {
            m.quoted = {};
        }
        
        // Build quoted key
        const remoteJid = m.msg?.contextInfo?.remoteJid || m.from || m.chat;
        const participant = m.msg?.contextInfo?.participant 
            ? jidNormalizedUser(m.msg.contextInfo.participant)
            : m.from || m.chat;
        
        m.quoted.key = {
            remoteJid,
            participant,
            fromMe: m.msg?.contextInfo?.participant
                ? areJidsSameUser(
                    jidNormalizedUser(m.msg.contextInfo.participant),
                    jidNormalizedUser(client?.user?.id || '')
                  )
                : false,
            id: m.msg?.contextInfo?.stanzaId || m.id || '',
        };
        
        // Set quoted properties
        m.quoted.mtype = type || getContentType(originalQuoted);
        m.quoted.from = /g\.us|status/.test(m.msg?.contextInfo?.remoteJid)
            ? m.quoted.key.participant
            : m.quoted.key.remoteJid;
        m.quoted.id = m.msg?.contextInfo?.stanzaId || m.id || '';
        m.quoted.chat = m.msg?.contextInfo?.remoteJid || m.chat || m.from;
        m.quoted.isBaileys = m.quoted.id?.startsWith('BAE5') && m.quoted.id.length === 16;
        
        m.quoted.sender = m.msg?.contextInfo?.participant
            ? client.decodeJid(m.msg.contextInfo.participant)
            : m.from || m.chat;
        
        m.quoted.fromMe = areJidsSameUser(
            m.quoted.sender,
            jidNormalizedUser(client.user?.id || client.userID || '')
        );
        
        // Extract quoted text
        m.quoted.text = (
            m.quoted.text ||
            m.quoted.caption ||
            m.quoted.conversation ||
            m.quoted.contentText ||
            m.quoted.selectedDisplayText ||
            m.quoted.title ||
            m.quoted.name ||
            ''
        ).toString();
        
        m.quoted.mentionedJid = m.msg?.contextInfo?.mentionedJid || [];
        m.quoted.message = originalQuoted;
        
        // Get quoted object function
        m.getQuotedObj = m.getQuotedMessage = async () => {
            if (!m.quoted.id || !m.chat) return false;
            
            try {
                const q = await store.loadMessage(m.chat, m.quoted.id, client);
                return __esmExports.smsg(client, q, store);
            } catch (error) {
                console.error('Error loading quoted message:', error);
                return false;
            }
        };
        
        // Create fakeObj for operations
        if (typeof M !== 'undefined' && M.fromObject) {
            try {
                const vM = M.fromObject({
                    key: {
                        remoteJid: m.quoted.chat,
                        fromMe: m.quoted.fromMe,
                        id: m.quoted.id,
                        participant: m.quoted.sender
                    },
                    message: originalQuoted,
                    ...(m.isGroup && m.quoted.sender ? { participant: m.quoted.sender } : {})
                });
                
                m.quoted.fakeObj = vM;
                
                // Delete function
                m.quoted.delete = () => {
                    if (vM?.key) {
                        return client.sendMessage(m.quoted.chat, { delete: vM.key });
                    }
                    return Promise.reject(new Error('No valid key for deletion'));
                };
                
                // Copy and forward function
                m.quoted.copyNForward = (jid, forceForward = false, options = {}) => {
                    return client.copyNForward(jid, vM, forceForward, options);
                };
                
            } catch (error) {
                console.error('Error creating fakeObj:', error);
            }
        }
        
        // Download function for quoted media
        m.quoted.download = () => {
            return client.downloadMediaMessage(m.quoted);
        };
    }
    
    // Download function for current message
    if (m.msg?.url) {
        m.download = () => client.downloadMediaMessage(m.msg);
    }
    
    // Extract final text
    m.text = (
        m.msg?.text ||
        m.msg?.caption ||
        m.message?.conversation ||
        m.msg?.contentText ||
        m.msg?.selectedDisplayText ||
        m.msg?.title ||
        m.body ||
        ''
    ).toString();
    
    // Reply function
    m.reply = (content, chatId = m.chat, options = {}) => {
        if (Buffer.isBuffer(content)) {
            return client.sendMedia(chatId, content, 'file', '', m, { ...options });
        }
        return client.sendText(chatId, content.toString(), m, { ...options });
    };
    
    // Copy message
    m.copy = () => {
        if (typeof M !== 'undefined') {
            const copied = M.fromObject(M.toObject(m));
            return __esmExports.smsg(client, copied, store);
        }
        return m;
    };
    
    // Copy and forward
    m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => {
        return client.copyNForward(jid, m, forceForward, options);
    };
    
    return m;
};



export default __esmExports;
