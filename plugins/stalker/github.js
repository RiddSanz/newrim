export const FEATURE_CREDIT = "Fitur By: Anita Putri Azzahra\nFitur SC Bot Rimuru MD 👑\nTiktok: https://tiktok.com/@anita.putri.azzah1\nSaluran Resmi: https://whatsapp.com/channel/0029Vb8dmsUElagkVPIw9X2P";


import axios from "axios"

let handler = async (m, { conn, args }) => {
  try {
    if (!args[0]) return m.reply("❌ Masukkan username GitHub!\nContoh: .ghstalk manzxy")

    const username = args[0]
    const { data } = await axios.get(
      `https://manzxy.my.id/stalker/github?username=${encodeURIComponent(username)}`
    )

    if (!data.success) throw "User tidak ditemukan"

    const u = data.result

    const teks = `
🐙 *GITHUB STALKER*

👤 Username : ${u.username}
📛 Nama     : ${u.nickname || "-"}
📝 Bio      : ${u.bio || "-"}
🏢 Company  : ${u.company || "-"}
🌍 Lokasi   : ${u.location || "-"}
🔗 Blog     : ${u.blog || "-"}
📂 Repo     : ${u.public_repo}
📄 Gists    : ${u.public_gists}
👥 Followers: ${u.followers}
➡️ Following: ${u.following}
🕒 Dibuat   : ${new Date(u.created_at).toLocaleString("id-ID")}
🔄 Update   : ${new Date(u.updated_at).toLocaleString("id-ID")}

🔗 ${u.url}
`.trim()

    await conn.sendMessage(
      m.chat,
      {
        image: { url: u.profile_pic },
        caption: teks
      },
      { quoted: m }
    )

  } catch (e) {
    console.error(e)
    m.reply("❌ Gagal mengambil data GitHub")
  }
}

handler.help = ["ghstalk <username>"]
handler.tags = ["stalk"]
handler.command = /^ghstalk$/i

export default handler
