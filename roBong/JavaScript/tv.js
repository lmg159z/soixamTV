let dataStreams = [];

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

function streams(index) {
  const idVideo = document.getElementById("myVideo");
  const stream = dataStreams[index];
  if (!stream) return;

  // Update nút active
  document.querySelectorAll(".res-btn").forEach((btn, i) =>
    btn.classList.toggle("active", i === index)
  );

  switch (stream.type) {
    case "flv":
      runFLV(stream.stream_url, "myVideo");
      break;
    case "hls":
      hls(stream.stream_url);
      break;
  }

  Object.assign(idVideo, {
    poster: `${GL_domain}wordspage/image/poster/TV_SHOW_20250120_172203_0000.png`,
    autoplay: true,
    controls: true,
    muted: false,
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const idMatch = new URLSearchParams(location.search).get("idMatch");
  if (!idMatch) {
    document.body.innerHTML =
      "<h1>THIẾU THAM SỐ - missing parameter</h1>";
    return;
  }
  checkMatchStatus(idMatch);
});

async function checkMatchStatus(idMatch) {
  try {
    const api = await getAPI(
      `https://soixamapi.vercel.app/api/getData?url=https://api.robong.net/match/info?room_id=${idMatch}`
    );
    const idVideo = document.getElementById("myVideo");

    if (!api?.result?.match) {
      console.warn("Không có dữ liệu hợp lệ từ API.");
      return;
    }

    const status = api.result.match.status_text;
    console.log("Trạng thái:", status);

    switch (status) {
      case "pending":
        idVideo.poster = `${GL_domain}wordspage/image/poster/1.png`;
        idVideo.controls = false;
        setTimeout(() => checkMatchStatus(idMatch), 20000); // 30s thay vì 500ms
        break;

      case "live":
        dataStreams = api.result.room?.servers || [];
        if (!dataStreams.length) {
          console.warn("Không có streams khả dụng.");
          return;
        }
        const IDServers = document.getElementById("resolution-bar");
        IDServers.innerHTML = dataStreams
          .map(
            (srv, i) => `
              <div class="res-btn ${i === 0 ? "active" : ""}" onclick="streams(${i})">
                ${srv.name}
              </div>
            `
          )
          .join("");
        streams(0);
        break;

      case "end":
        idVideo.poster = `${GL_domain}wordspage/image/poster/2.png`;
        idVideo.controls = false;
        break;

      default:
        console.log("Trạng thái khác:", status);
    }
  } catch (err) {
    console.error("Lỗi khi xử lý:", err.message);
  }
}
