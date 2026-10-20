import axios from "axios";
import { randomUUID } from "node:crypto";
// Rich HTML verification metadata consistent with the interactive games in this SC.
const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YcN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFYDZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZlXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYvNBkuLoZnQAq4j8yRekrQ==";


const config = {
  name: "ytplay",
  alias: ["ytp"],
  category: "rich",
  description: "Putar video YouTube dengan HTML AI Rich + Direct Player",
  usage: ".ytplay <judul/link>",
  example: ".ytplay Alan Walker Faded",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

const UA = "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/138 Mobile Safari/537.36";

async function sendHTMLRichMessage(sock, chatId, html, { title = "HTML Player", fallbackText = "" } = {}) {
  const responseId = randomUUID();
  try {
    return await sock.relayMessage(
      chatId,
      {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {
            messageDisclaimerText: '',
            botResponseId: responseId,
            verificationMetadata: {
              proofs: [{ version: 1, useCase: 1, signature: SIG, certificateChain: [CERT1, CERT2] }]
            }
          },
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              submessages: [{ messageType: 2, messageText: title }],
              unifiedResponse: {
                data: Buffer.from(JSON.stringify({
                  __typename: 'GenAIUnifiedResponse',
                  response_id: responseId,
                  sections: [{
                    __typename: 'GenAIUnifiedResponseSection',
                    view_model: {
                      __typename: 'GenAISingleLayoutViewModel',
                      primitive: {
                        __typename: 'GenAIaeacdsnwHtmlPrimitive',
                        payload: html,
                        trusted_sources: [],
                      },
                      __typename: 'GenAISingleLayoutViewModel',
                    },
                  }],
                })).toString('base64'),
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: { botJid: '867051314767696@bot' },
                forwardOrigin: 4,
              },
            },
          },
        },
      },
      { messageId: responseId },
    );
  } catch (e) {
    if (fallbackText && typeof sock?.sendMessage === 'function') {
      return sock.sendMessage(chatId, { text: fallbackText });
    }
    throw e;
  }
}


function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function jsEsc(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/</g, "\\x3C")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function cleanYoutubeUrl(value) {
  try {
    const u = new URL(String(value).trim());
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    if (!/^(youtube\.com|m\.youtube\.com|youtu\.be)$/.test(host)) return "";
    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : "";
    }
    if (u.pathname === "/watch" && u.searchParams.get("v")) {
      return `https://www.youtube.com/watch?v=${encodeURIComponent(u.searchParams.get("v"))}`;
    }
    if (u.pathname.startsWith("/shorts/")) {
      const id = u.pathname.split("/").filter(Boolean)[1];
      return id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : "";
    }
    if (u.pathname.startsWith("/embed/")) {
      const id = u.pathname.split("/").filter(Boolean)[1];
      return id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : "";
    }
    return "";
  } catch {
    return "";
  }
}

function isYoutubeUrl(value) {
  return !!cleanYoutubeUrl(value);
}

function textOf(node) {
  if (typeof node === "string") return node;
  if (!node || typeof node !== "object") return "";
  if (typeof node.simpleText === "string") return node.simpleText;
  if (Array.isArray(node.runs)) return node.runs.map(x => x?.text || "").join("");
  return "";
}

async function searchYoutube(query) {
  const endpoint = "https://www.youtube.com/youtubei/v1/search?prettyPrint=false";
  const body = {
    context: {
      client: {
        clientName: "WEB",
        clientVersion: "2.20260904.01.00",
        hl: "id",
        gl: "ID",
      },
    },
    query: String(query).trim(),
  };

  const { data } = await axios.post(endpoint, body, {
    timeout: 25000,
    headers: {
      "user-agent": UA,
      accept: "application/json",
      "content-type": "application/json",
      origin: "https://www.youtube.com",
      referer: "https://www.youtube.com/",
    },
  });

  const hits = [];
  const seen = new Set();
  const walk = node => {
    if (!node || typeof node !== "object" || hits.length >= 8) return;
    const v = node.videoRenderer;
    if (v?.videoId && !seen.has(v.videoId)) {
      seen.add(v.videoId);
      hits.push({
        id: v.videoId,
        url: `https://www.youtube.com/watch?v=${v.videoId}`,
        title: textOf(v.title) || "YouTube Video",
        channel: textOf(v.ownerText) || textOf(v.longBylineText) || "YouTube",
        thumb: v.thumbnail?.thumbnails?.at(-1)?.url || `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
        duration: textOf(v.lengthText) || "",
      });
    }
    for (const value of Object.values(node)) walk(value);
  };
  walk(data);

  if (!hits.length) throw new Error("Video YouTube tidak ditemukan");
  return hits[0];
}

async function getOembed(url) {
  try {
    const { data } = await axios.get("https://www.youtube.com/oembed", {
      params: { url, format: "json" },
      timeout: 10000,
      headers: { "user-agent": UA },
    });
    return {
      title: data?.title || "YouTube Video",
      channel: data?.author_name || "YouTube",
      thumb: data?.thumbnail_url || "",
    };
  } catch {
    return null;
  }
}

async function posterData(url) {
  if (!url) return "";
  try {
    const r = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 12000,
      headers: { "user-agent": UA },
      maxContentLength: 3 * 1024 * 1024,
    });
    const type = String(r.headers?.["content-type"] || "image/jpeg").split(";")[0];
    if (!/^image\//i.test(type)) return "";
    return `data:${type};base64,${Buffer.from(r.data).toString("base64")}`;
  } catch {
    return "";
  }
}


function youtubeId(value) {
  try {
    const u = new URL(String(value).trim());
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtu.be") return u.pathname.split("/").filter(Boolean)[0] || "";
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts[0] === "shorts" || parts[0] === "embed") return parts[1] || "";
    }
  } catch {}
  return "";
}

function qualityNumber(value) {
  const m = String(value || "").match(/(\d{3,4})p/i);
  return m ? Number(m[1]) : 0;
}

async function getPlayableStream(youtubeUrl) {
  const id = youtubeId(youtubeUrl);
  if (!id) return null;

  const pipedInstances = [
    "https://pipedapi.kavin.rocks",
    "https://pipedapi.adminforge.de",
  ];

  for (const base of pipedInstances) {
    try {
      const { data } = await axios.get(`${base}/streams/${encodeURIComponent(id)}`, {
        timeout: 12000,
        headers: { "user-agent": UA, accept: "application/json" },
      });

      const streams = Array.isArray(data?.videoStreams) ? data.videoStreams : [];
      const candidates = streams
        .filter(x => x?.url && x?.videoOnly === false && /^video\/mp4(?:;|$)/i.test(String(x?.mimeType || "")))
        .sort((a, b) => qualityNumber(b.quality) - qualityNumber(a.quality));

      if (candidates[0]?.url) {
        return {
          url: candidates[0].url,
          mime: String(candidates[0].mimeType || "video/mp4").split(";")[0],
          duration: Number(data?.duration) > 0 ? Number(data.duration) : 0,
          server: new URL(candidates[0].url).hostname,
          source: "Piped",
        };
      }
    } catch (e) {
      console.warn(`[YTPLAY] Piped resolver failed (${base}):`, e?.message || e);
    }
  }

  const invidiousInstances = [
    "https://inv.nadeko.net",
    "https://invidious.nerdvpn.de",
  ];

  for (const base of invidiousInstances) {
    try {
      const { data } = await axios.get(`${base}/api/v1/videos/${encodeURIComponent(id)}`, {
        params: { local: "true" },
        timeout: 12000,
        headers: { "user-agent": UA, accept: "application/json" },
      });

      const streams = Array.isArray(data?.formatStreams) ? data.formatStreams : [];
      const candidates = streams
        .filter(x => x?.url && /mp4/i.test(String(x?.type || "")))
        .sort((a, b) => qualityNumber(b.quality) - qualityNumber(a.quality));

      if (candidates[0]?.url) {
        return {
          url: candidates[0].url,
          mime: "video/mp4",
          duration: Number(data?.lengthSeconds) > 0 ? Number(data.lengthSeconds) : 0,
          server: new URL(candidates[0].url).hostname,
          source: "Invidious",
        };
      }
    } catch (e) {
      console.warn(`[YTPLAY] Invidious resolver failed (${base}):`, e?.message || e);
    }
  }

  return null;
}

function playerHtml({ title, channel, duration, videoUrl, poster, mediaUrl, mediaMime }) {
  const t = esc(title), c = esc(channel), d = esc(duration || "0:00");
  const media = esc(mediaUrl || "");
  const p = esc(poster || "");
  const mmime = esc(mediaMime || "video/mp4");
  const yt = youtubeId(videoUrl);
  const durationSeconds = Number(String(duration || '').split(':').reduce((a, part) => a * 60 + Number(part || 0), 0)) || 0;
  const embed = yt ? `https://www.youtube.com/embed/${encodeURIComponent(yt)}?autoplay=0&playsinline=1&rel=0&enablejsapi=1` : "";
  const eembed = jsEsc(embed);
  return `<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}html,body{margin:0;width:100%;min-height:100%;font-family:Arial,Helvetica,sans-serif;background:#090a0f;color:#fff}body{padding:10px}.wrap{width:100%;max-width:440px;margin:auto}.card{position:relative;overflow:hidden;background:#111318;border:1px solid rgba(255,255,255,.12);border-radius:22px;box-shadow:0 10px 40px rgba(0,0,0,.55)}.bg{position:absolute;inset:-30px;background:center/cover no-repeat url('${p}');filter:blur(24px);opacity:.3;transform:scale(1.12)}.ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,6,10,.28),rgba(5,6,10,.82))}.content{position:relative;z-index:2;padding:17px}.top{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}.tt{font-size:13px;font-weight:800;letter-spacing:.9px}.sub{font-size:10px;opacity:.5;margin-top:3px;max-width:280px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.icon{width:35px;height:35px;border:0;border-radius:50%;background:rgba(255,255,255,.09);color:#fff;display:flex;align-items:center;justify-content:center}.frame{position:relative;width:100%;aspect-ratio:16/9;border-radius:16px;overflow:hidden;background:#000;box-shadow:0 12px 35px rgba(0,0,0,.45)}video,iframe{position:absolute;inset:0;width:100%;height:100%;display:block;background:#000}video{z-index:1;object-fit:contain}iframe{z-index:2;border:0}.big{position:absolute;inset:0;z-index:3;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.16);pointer-events:none}.big button{width:62px;height:62px;border:0;border-radius:50%;background:#fff;color:#090a0f;font-size:25px;pointer-events:auto}.playing .big{opacity:0;pointer-events:none}.title{font-size:19px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:15px}.artist{font-size:13px;opacity:.58;margin-top:5px}.prog{margin-top:17px}.range{width:100%;height:4px;accent-color:#fff}.times{display:flex;justify-content:space-between;font-size:10px;opacity:.55;margin-top:7px}.controls{display:flex;align-items:center;justify-content:center;gap:25px;margin-top:13px}.ctrl{width:40px;height:40px;border:0;background:transparent;color:#fff;font-size:23px}.bottom{display:flex;align-items:center;justify-content:space-between;margin-top:14px}.volume{width:86px}.hint{margin-top:13px;font-size:10px;opacity:.5;text-align:center}</style>
<div class="wrap"><div class="card"><div class="bg"></div><div class="ov"></div><div class="content"><div class="top"><div><div class="tt">NOW PLAYING VIDEO</div><div class="sub">${t}</div></div><button class="icon" onclick="mute()">◖</button></div><div class="frame" id="frame"><video id="v" playsinline webkit-playsinline preload="metadata" controls poster="${p}"${media ? ` src="${media}" type="${mmime}"` : ""}></video>${embed ? `<iframe id="yt" src="${eembed}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="display:${media ? 'none' : 'block'}"></iframe>` : ''}<div class="big"><button onclick="toggle()">▶</button></div></div><div class="title">${t}</div><div class="artist">${c}</div><div class="prog"><input class="range" id="progress" type="range" min="0" max="100" value="0" step=".1" oninput="seek(this.value)"><div class="times"><span id="cur">0:00</span><span id="dur">${d}</span></div></div><div class="controls"><button class="ctrl" onclick="jump(-10)">↶</button><button class="ctrl" onclick="toggle()" id="cp">▶</button><button class="ctrl" onclick="jump(10)">↷</button></div><div class="bottom"><button class="icon" onclick="toggleLoop()">↻</button><div><button class="icon" onclick="mute()">◖</button><input class="range volume" id="volume" type="range" min="0" max="1" step=".01" value=".8" oninput="setVol(this.value)"></div></div><div class="hint" id="hint">${media ? 'Video siap diputar' : (embed ? 'Memuat YouTube Player...' : 'Sumber video tidak tersedia')}</div></div></div></div>
<script>(function(){
var v=document.getElementById('v'),yt=document.getElementById('yt'),frame=document.getElementById('frame'),progress=document.getElementById('progress'),cur=document.getElementById('cur'),dur=document.getElementById('dur'),cp=document.getElementById('cp'),vol=document.getElementById('volume'),hint=document.getElementById('hint');
var repeat=false, directFailed=!v.getAttribute('src'), ytCurrent=0, ytDuration=${durationSeconds}, ytState=-1, ytVolume=80;
function tm(n){if(!isFinite(n)||n<0)return'0:00';return Math.floor(n/60)+':'+String(Math.floor(n%60)).padStart(2,'0')}
function directMode(){return !!v.getAttribute('src')&&!directFailed}
function ui(){var playing=directMode()?!v.paused:ytState===1;cp.textContent=playing?'Ⅱ':'▶';frame.classList.toggle('playing',playing)}
function ytCommand(func,args){if(!yt||!yt.contentWindow)return;try{yt.contentWindow.postMessage(JSON.stringify({event:'command',func:func,args:args||[]}), '*')}catch(e){}}
function setHint(t){if(hint)hint.textContent=t}
function safePlay(){if(!directMode()){ytCommand('playVideo');setHint('Perintah Play dikirim ke YouTube');return}try{var p=v.play();if(p&&p.catch)p.catch(function(){setHint('Tekan ▶ lagi untuk memutar video')})}catch(e){setHint('Gagal memutar video')}}
window.toggle=function(){if(!directMode()){if(ytState===1){ytCommand('pauseVideo');ytState=2;setHint('YouTube dijeda')}else{ytCommand('playVideo');ytState=1;setHint('Perintah Play dikirim ke YouTube')}ui();return}if(v.paused)safePlay();else v.pause();ui()};
window.jump=function(n){if(!directMode()){ytCommand('seekTo',[Math.max(0,ytCurrent+Number(n||0)),true]);return}if(isFinite(v.duration))v.currentTime=Math.max(0,Math.min(v.duration,v.currentTime+Number(n||0)))};
window.seek=function(x){if(!directMode()){var pct=Math.max(0,Math.min(100,Number(x)||0));ytCommand('seekTo',[pct/100*(ytDuration||0),true]);return}if(isFinite(v.duration))v.currentTime=Number(x)/100*v.duration};
window.setVol=function(x){var value=Math.round(Math.max(0,Math.min(1,Number(x)||0))*100);if(!directMode()){ytVolume=value;ytCommand('setVolume',[value]);if(value>0)ytCommand('unMute');return}v.volume=value/100;v.muted=false};
window.mute=function(){if(!directMode()){ytCommand(ytVolume===0?'unMute':'mute');ytVolume=ytVolume===0?80:0;return}v.muted=!v.muted};
window.toggleLoop=function(){repeat=!repeat;if(!directMode()){ytCommand('setLoop',[repeat]);setHint(repeat?'Repeat diminta ke YouTube':'Repeat dimatikan');return}v.loop=repeat};
window.addEventListener('message',function(event){if(!yt||event.source!==yt.contentWindow)return;var d=event.data;try{if(typeof d==='string')d=JSON.parse(d)}catch(e){return}if(!d||d.event!=='infoDelivery'||!d.info)return;var info=d.info;if(Number.isFinite(Number(info.currentTime))){ytCurrent=Number(info.currentTime);cur.textContent=tm(ytCurrent)}if(Number.isFinite(Number(info.duration))&&Number(info.duration)>0){ytDuration=Number(info.duration);dur.textContent=tm(ytDuration)}if(Number.isFinite(ytDuration)&&ytDuration>0)progress.value=ytCurrent/ytDuration*100;if(Number.isFinite(Number(info.playerState))){ytState=Number(info.playerState);ui();if(ytState===1)setHint('Playing di YouTube');else if(ytState===2)setHint('YouTube dijeda')}});
if(yt){yt.addEventListener('load',function(){try{yt.contentWindow.postMessage(JSON.stringify({event:'listening',id:'rimuru-ytplay'}),'*')}catch(e){}ytCommand('addEventListener',['onStateChange']);ytCommand('addEventListener',['onReady']);ytCommand('getCurrentTime');ytCommand('getDuration')})}
v.volume=.8;
v.onloadedmetadata=function(){if(isFinite(v.duration)&&v.duration>0)dur.textContent=tm(v.duration)};
v.ontimeupdate=function(){if(!directMode()||!isFinite(v.duration)||v.duration<=0)return;var p=v.currentTime/v.duration*100;progress.value=p;cur.textContent=tm(v.currentTime);dur.textContent=tm(v.duration)};
v.onplay=function(){if(yt)yt.style.display='none';ui();setHint('Playing')};
v.onpause=ui;
v.onended=function(){ui();if(repeat){v.currentTime=0;safePlay()}};
v.onerror=function(){directFailed=true;if(yt){yt.style.display='block';setHint('Direct stream gagal • Kontrol memakai YouTube Player');ytCommand('playVideo')}else setHint('Video gagal diputar');ui()};
if(yt&&!directMode())yt.style.display='block';ui();
})();</script>`;
}

function tmServer(n) {
  n = Number(n) || 0;
  return Math.floor(n / 60) + ":" + String(Math.floor(n % 60)).padStart(2, "0");
}

async function handler(m, { sock }) {
  const query = String(m.text || "").trim();
  if (!query) return m.reply(`〄 *YT PLAY*\n\n〄 ${m.prefix}ytplay <judul/link>\n〄 ${m.prefix}ytplay https://youtu.be/xxxx`);

  try {
    await m.react("🕐");
    let meta;
    if (isYoutubeUrl(query)) {
      const url = cleanYoutubeUrl(query);
      meta = { url, title: "YouTube Video", channel: "YouTube", thumb: "" };
      const o = await getOembed(url);
      if (o) Object.assign(meta, o);
    } else {
      meta = await searchYoutube(query);
    }

    if (!meta?.url) throw new Error("Video YouTube tidak ditemukan");

    const stream = await getPlayableStream(meta.url);
    const poster = await posterData(meta.thumb);
    const html = playerHtml({
    title: meta.title || "YouTube Video",
      channel: meta.channel || "YouTube",
      duration: meta.duration || (stream?.duration ? tmServer(stream.duration) : "0:00"),
      videoUrl: meta.url,
      poster,
      mediaUrl: stream?.url || "",
      mediaMime: stream?.mime || "video/mp4",
    });

    await sendHTMLRichMessage(sock, m.chat, html, {
      title: "YouTube Player • Fitur By: Anita Putri Azzahra",
      fallbackText: `〄 *YT PLAY*\n\n〄 ${meta.title || "YouTube Video"}\n〄 ${meta.channel || "YouTube"}\n\n〄 Player video siap diputar.`,
    });
    await m.react("✅");
  } catch (e) {
    console.error("[YTPLAY]", e?.stack || e?.message || e);
    await m.react("❌");
    return m.reply(`〄 *YT PLAY ERROR*\n\n〄 ${e?.message || "Gagal memproses video."}`);
  }
}

export default { config, handler };