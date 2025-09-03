
var dataHoiQuan = []







async function getAPI(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Lỗi khi gọi API:", err.message);
    return null;
  }
}

(async () => {
 const api = await getAPI("https://api.allorigins.win/raw?url=https://sv.hoiquan.live/api/matches")
 const apiSports = await getAPI("https://api.allorigins.win/raw?url=https://sv.hoiquan.live/api/sports")  
 dataHoiQuan = api
 const idHTML = document.getElementById('bannner')
 if (api){
  const dataHTML = api.map((i) => {
    const data1 = `
                <div class="match-card">
                  <div class="match-header">
                    <div class="time">${formatDateTime(i.startTime)}</div>
                    <div class="league">${i.league.name} <img src="${(apiSports.find(item => item.slug === i.sport.slug)).icon}"></div>
                  </div>
                  <div class="teams">
                    <div class="team">
                      <img src="${i.homeTeam.logo}" alt="">
                      <div>${i.homeTeam.name}</div>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                      <img src="${i.awayTeam.logo}" alt="">
                      <div>${i.awayTeam.name}</div>
                    </div>
                  </div>
                  <div class="match-footer">
                    <div class="commentator">
                      <img src="${i.streamLinks[0].commentator.avatar
                      }" alt="">
                      <span>${i.streamLinks[0].commentator.
                      username}</span>
                    </div>
                    <div class="${i.status != "UPCOMING" ? "statusLive" : "status"}">
                      ${i.status != "UPCOMING" ? "Trực Tiếp" : "Chưa Đến Giờ"}
                    </div>
                  </div>
                </div>`
    if (i.status == "UPCOMING"){
      return data1
    } else if (i.status == "LIVE"){
      return `
      <a href="${GL_domain}hoiQuanTV/stream/index.html?idMatch=${getChannelId(i.streamLinks[0].url)}">
                ${data1}
              </a>
      `
    }
  })
  idHTML.innerHTML =`

  <div class="">

          <div id="schedule" class="schedule">${dataHTML.join("")}</div>
    </div>
  `
}
})()





function formatDateTime(isoString) {
  const d = new Date(isoString);

  // Lấy ngày, tháng, giờ, phút
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month} - ${hours}:${minutes}`;
}


function getChannelId(url) {
  const { pathname } = new URL(url);
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return null;
  if (/\.(m3u8|mpd|mp4)$/i.test(parts[parts.length - 1])) parts.pop(); // bỏ file
  return parts.pop() || null; // lấy segment trước file
}