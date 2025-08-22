
async function renderPoster() {
  const data = await getAPI("https://hxcv.site/chuoichien")
  const HTML = data.groups[0].channels.map(i =>{
  return `
    <a href="${GL_domain}chuoiChienTV/stream/index.html?id=${i.sources[0].id.split("-").pop()}" >
    <div class="IPTV_item">
        <img src="${i.image.url}" alt="" />
        <div class="iptv_live">
          LIVE
        </div>
        <div class="iptv_caster">
          ${i.sources[0].contents[0].streams[0].name.split('-')[0]}
        </div>
    </div>
    </a>
    `
  }
  )
  return  HTML.join("")
  // Tab to edit
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




  
  