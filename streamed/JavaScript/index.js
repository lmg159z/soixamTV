


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


function formatDate(ms) {
  const d = new Date(ms);
  const now = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  if (year === now.getFullYear()) {
    return `${day}/${month}`;
  } else {
    return `${day}/${month}/${year}`;
  }
}

function buildQueryString(sources) {
  const src = sources.map(item => item.source).join("_");
  const ids = sources.map(item => item.id).join("_");
  return `src=${src}&id=${ids}`;
}

async function items() { 
   const api = await getAPI("https://streamed.pk/api/sports")  
    const data = []
    for (let index in api){
     const api2 = await getAPI(`https://streamed.pk/api/matches/${api[index].id}`)
     const dataRender = sortPopularFirst(api2).map((i) =>{
        return `
          <a href="${GL_domain}streamed/streams/index.html?${buildQueryString(i.sources)}" style="${i.popular === true ? '':'pointer-events: none; color: gray;'}">
            <div class="VOD_item">
            <img 
                src="https://streamed.pk${i.poster || '/api/images/poster/london-lions-vs-bristol-flyers-1629463869/fallback.webp'}" 
                alt="" 
            />
              <span 
                  class="status ${i.popular == true ? "live" : "UnLive"}">
                  ${i.popular === true ? "LIVE" :  formatDate(i.date)}
              </span>
              <h6>${i.title}</h6>
            </div>
          </a>
        `
     })

    data.push({
      title : api[index].name,
      html: dataRender
    })
    }


   return data

}


function sortPopularFirst(data) {
  return [
    ...data.filter(item => item.popular),
    ...data.filter(item => !item.popular)
  ];
}





async function render() {
  const html = document.getElementById("contents");

  // chờ items trả về mảng data
  const it = await items(); 
  const data = it.map((i) => {
    return `
    <h3>${i.title}</h3>
        <div class="VOD">
          ${i.html.join('')}
        </div>
        `
  })


  html.innerHTML = `
   <div class="group_VOD">
      ${data.join("")}
      </div>
  `
}



render()