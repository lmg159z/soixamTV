
(() => {
  fetch(`https://soixamapi.vercel.app/api/vod_sports`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }
      return response.json(); // Chuyển dữ liệu phản hồi thành JSON
    })
    .then(data => {
     handle_list(data)
    })
    .catch(error => {
      console.error("Lỗi khi gọi API:", error.message);
    });
  }
)()

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const paddedMins = String(mins).padStart(2, '0');
  const paddedSecs = String(secs).padStart(2, '0');

  if (hrs > 0) {
    const paddedHrs = String(hrs).padStart(2, '0');
    return `${paddedHrs}:${paddedMins}:${paddedSecs}`;
  } else {
    return `${paddedMins}:${paddedSecs}`;
  }
}



async function handle_list(data) {
  
  const html = document.getElementById("contents");

  // Tạo danh sách Promise để fetch song song
  const promises = data.map(value =>
    getAPI(`https://tv-web.api.vinasports.com.vn/api/v2/publish/video/?league_id=${value.api}&page_num=1`)
      .then(info => ({ value, info })) // Gắn lại thông tin value để render
  );

  // Chạy song song tất cả request
  const results = await Promise.all(promises);

  // Render tất cả cùng lúc
  const allHTML = results.map(({ value, info }) => {
    if (!info || !info.data) return "";

    const listHTML = info.data
      .filter(i => i.url !== "")
      .map(i => `
      <a href="${GL_domain}video/vod/index.html?vod=${i.url}">
        <div class="VOD_item">
        <img 
            src="https://lmg159z.github.io/soixamTV/wordspage/image/logo/logoChannel.png" 
            data-src="${i.thumbnail}" 
            alt="" 
            style="opacity:0; transition:opacity 0.3s ease;"
        />
          <span>${formatTime(i.duration)}</span>
          <h6>${i.name}</h6>
        </div>
      </a>
      `)
      .join("");

    return `
      <div class="group_VOD">
        <h3>${value.nameList}</h3>
        <div class="VOD">
          ${listHTML}
        </div>
      </div>
    `;
  }).join("");

  html.innerHTML = allHTML;
  choIMG()
}

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

function choIMG() {
  const imgs = document.querySelectorAll("img[data-src]");
  imgs.forEach(img => {
    const tempImg = new Image();
    tempImg.src = img.getAttribute("data-src");
    tempImg.onload = function() {
      img.src = tempImg.src;
      img.style.opacity = 1; // fade in
    };
  });
}