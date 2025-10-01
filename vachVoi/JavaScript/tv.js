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
  }else{
    getStreams(idMatch)
  }
});



async function getStreams(idMatch){
  const api = await getAPI(`https://soixamapi.vercel.app/api/getData?url=https://hxcv.site/vachvoi/stream/${idMatch}`)
  console.log(api.stream_links)
}