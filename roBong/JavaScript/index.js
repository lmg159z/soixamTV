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
 const api = await getAPI("https://soixamapi.vercel.app/api/getData?url=https://api.robong.net/match/home")
 console.log(api.result.hot)
 const idHTML = document.getElementById('bannner')
 if (api){
  idHTML.innerHTML =`

  <div class="">
      ${handle_html(api.result.hot,"TÂM ĐIỂM")}
      ${handle_html(api.result.latest.footballMatches,"Bóng Đá")}
      ${handle_html(api.result.latest.basketballMatches,"Bóng Rổ")}
      ${handle_html(api.result.latest.volleyballMatches,"Bóng Chuyền")}
      ${handle_html(api.result.latest.events,"Sự Kiện")}
    </div>
  `
}
})()



function handle_html(data,title){
  if (data.length > 0){
      const dataHTML = data.map((i) => {
            const commentator = i.rooms?.[0]?.commentators?.[0]; // BLV đầu tiên (nếu có)  
            // nếu có avatar thì lấy, còn không thì fallback sang ảnh mặc định
            const avatar = commentator?.avatar?.path 
              ? `https://taikhoan.rogiaitri.com/images${commentator.avatar.path}`
              : "https://robong.net/images/avatar-blank.jpg";

            // nếu có tên BLV thì lấy, còn không thì text fallback
            const name = commentator?.name || "Chưa có BLV";
             if (i.status_text === "live"){
              var mss = "Trực Tiếp"
             } else if (i.status_text === "pending"){
              var mss = "Chưa Đến Giờ"
             } else if (i.status_text === "end"){
              var mss = "Kết Thúc"
             }
            return `
              <a href="${GL_domain}roBong/stream/index.html?idMatch=${i.rooms?.[0]?._id || ''}">
                <div class="match-card">
                  <div class="match-header">
                    <div class="time">${formatTimestamp(i.match_time)}</div>
                    <div class="league">${i.competition.short_name}</div>
                  </div>
                  <div class="teams">
                    <div class="team">
                      <img src="${i.home_team.logo}" alt="">
                      <div>${i.home_team.name}</div>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                      <img src="${i.away_team.logo}" alt="">
                      <div>${i.away_team.name}</div>
                    </div>
                  </div>
                  <div class="match-footer">
                    <div class="commentator">
                      <img src="${avatar}" alt="">
                      <span>${name}</span>
                    </div>
                    <div class="${i.status_text == "live" ? "statusLive" : "status"}">
                      ${mss}
                    </div>
                  </div>
                </div>
              </a>
            `;
      });
      return `
          <h2>${title}</h2>
          <div id="schedule" class="schedule">${dataHTML.join("")}</div>
      `
    }
 return ""

}



function formatTimestamp(ts) {
  // Nhân 1000 vì timestamp tính bằng giây, Date() nhận mili giây
  const date = new Date(ts * 1000);

  // Lấy theo múi giờ Việt Nam (GMT+7)
  const options = { timeZone: "Asia/Ho_Chi_Minh" };

  const day = date.toLocaleString("en-GB", { day: "2-digit", ...options });
  const month = date.toLocaleString("en-GB", { month: "2-digit", ...options });
  const hours = date.toLocaleString("en-GB", { hour: "2-digit", hour12: false, ...options });
  const minutes = date.toLocaleString("en-GB", { minute: "2-digit", ...options });

  return `${day}/${month} - ${hours}:${minutes}`;
}