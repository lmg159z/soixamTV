console.log("h")

async function start(logoJ, main) {
  try {
    const response = await fetch(`https://soixamapi.vercel.app/api/getURLFPT`);
    if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

    const data = await response.json();
    await checkStreamLinksParallel(data);
  } catch (error) {
    console.error("Lỗi khi gọi API:", error.message);
  }
}

async function checkStreamLinksParallel(streams) {
  const entries = Object.values(streams);

  const tasks = entries.map(async ({ url, name, STT }) => {
    try {
      const response = await fetch(enCode(url), { method: 'HEAD' });
      if (response.ok) {
        innerChannel(url, name, STT);
        /*console.log(`${name} OK: ${streamLink}`);*/
      } else {
        console.warn(`${name} lỗi: Status ${response.status}`);
      }
    } catch (error) {
      console.error(`${name} lỗi khi kiểm tra:`, error.message);
    }
  });

  await Promise.allSettled(tasks); // Đợi tất cả hoàn tất (kể cả lỗi)
}

function innerChannel(src, name, id) {
  const videoListContainer = document.getElementById("video-list");
  if (!videoListContainer) return;

  videoListContainer.insertAdjacentHTML("beforeend", `
    <a class="video-card" href="./channel/index.html?groupChannel=FPTplay&channel=${id}">
      <div class="thumbnail">
        <video poster="https://iptv.nhadai.org/img/fpt-play.png" src="${enCode(src)}" muted autoplay loop playsinline></video>
      </div>
      <div class="title">${name}</div>
    </a>
  `);
}









  document.addEventListener("DOMContentLoaded", function () {
      start("TV_e_fptplay", "TV_e_fptplay");
    });