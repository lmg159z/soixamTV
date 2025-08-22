



window.addEventListener("DOMContentLoaded", () => {
  const p = new URLSearchParams(location.search);
  const g = p.get('id')
  if (g) {
    if (typeof getChuoiChien === 'function') {
     getChuoiChien(g)

    } else {
      console.error("start() function not found");
    }
  } else {
    document.body.innerHTML = '<h1>THIẾU THAM SỐ - missing parameter</h1>';
  }
});
function getChuoiChien(id) {
  fetch(`https://hxcv.site/chuoichien/stream/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }
      return response.json(); // Chuyển dữ liệu phản hồi thành JSON
    })
    .then(data => {
      innerDATA(data.stream_links)
    })
    .catch(error => {
      console.error("Lỗi khi gọi API:", error.message);
    });
  
}


async function innerDATA(data) {
  const idHTML = document.getElementById("iptv");

  // gọi renderPoster() trước
  const posterHTML = await renderPoster();

  // render danh sách item
  idHTML.innerHTML = `
    <div class="resolution">
      ${data.map((i, idx) => `
        <div class="resolution_item" data-index="${idx}">
          ${i.name}
        </div>
      `).join("")}
    </div>
    <div id="list">
        ${posterHTML}
      </div>
  `;

  // gắn sự kiện click cho từng item
  const items = idHTML.querySelectorAll(".resolution_item");
  items.forEach(item => {
    item.addEventListener("click", () => {
      const index = item.getAttribute("data-index");
      streams(index, data);
    });
  });

  crateHTML({
    url: data[0].url,
    type: detectStreamType(data[0].url)
  });
}
function streams(i, data) {
  crateHTML({
    url: data[i].url,
    type: detectStreamType(data[i].url)
  });
}

function detectStreamType(url) {
  let pathname = '';
  try {
    pathname = new URL(url).pathname.toLowerCase();
  } catch {
    pathname = String(url).split('?')[0].toLowerCase();
  }
  if (pathname.endsWith('.m3u8')) return 'm3u8';
  if (pathname.endsWith('.flv'))  return 'flv';
  return 'unknown'; // các định dạng khác
}