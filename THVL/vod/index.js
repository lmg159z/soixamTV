
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


async function handles(id,ss = 0, dr){
  const api = await getAPI(`https://soixamapi.vercel.app/api/getData?url=https://iptv.cameraddns.net/iptv_channel_contents.php?title_id=${id}`)
  const idHTML_container = document.getElementById("container")
  if (api.sources[0].contents[0].streams.reverse()){
      const listChannels =  api.sources[0].contents[0].streams.reverse()
      const episodes = listChannels.reverse().map((i, index) => {
        console.log(i)
        return `
        <div class="card" onclick="streams('${i.id}', '${i.name}', '${listChannels.length - index - 1}', '${i.image?.url}')">
            <img src="${i.image?.url || ""}" alt="${i.name}">
            <p>${i.name}</p>
        </div>

        `
    })

    idHTML_container.innerHTML = `
       
    <div class="poster">
      <video
        id="myVideo"
        class="video-js vjs-big-play-centered"
        controls
        preload="auto"
        data-setup='{}'
        poster="${listChannels.reverse()[0].image?.url}" alt="Poster Con Cá Đầu Vàng"
        ></video>
    </div>

    <!-- Nội dung -->
    <div class="content">
      <div class="title">${api.sources[0].contents[0].name || ""} <span id="sp">- Tập 1</span></div>
      <p class="desc">
      ${decodeURIComponent(dr)}  
      </p>
    </div>

    <!-- Danh sách tập -->
    <h2>Danh sách tập</h2>
    <div class="episodes">${episodes.join("")}</div>
    </div>
    `  
    
    
  }




  streams(
    api.sources[0].contents[0].streams[ss]?.id, 
    api.sources[0].contents[0].streams[ss]?.name, 
    ss,
    api.sources[0].contents[0].streams[ss]?.image?.url || "")
}






async function streams(key,name,ss,p){
    document.getElementById("myVideo").poster = p
    const id = document.getElementById("sp")
    id.innerText = `- ${name}`
    const data = await getAPI(`https://soixamapi.vercel.app/api/getData?url=https://iptv.cameraddns.net/get_play.php?ep_id=${key}`)
    hls(data.stream_links[0].url)
    window.scrollTo({
    top: 0,
    behavior: "smooth" // mượt
  });

  updateURL(ss)
}




function updateURL(id) {
  const params = new URLSearchParams(window.location.search);
  params.set("ss", id);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  history.pushState(null, '', newUrl);
}


function decodeText(encoded) {
  const binary = atob(encoded);
  const bytes = new Uint8Array([...binary].map(c => c.charCodeAt(0)));
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

/*************************************************************************/

 window.addEventListener("DOMContentLoaded", () => {
      const p = new URLSearchParams(location.search);
      const id = p.get('id'), ss = p.get('ss') , dr = p.get('t') 
      if (id) {
        if (typeof handles === 'function') {
          handles(id,ss === null ? 0 : ss, dr)
        } else {
          console.error("start() function not found");
        }
      } else {
        document.body.innerHTML = '<h1>THIẾU THAM SỐ - missing parameter</h1>';
      }
    });
  

