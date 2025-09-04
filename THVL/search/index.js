
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



async function getSearch(key) {
    const api = await getAPI(`https://soixamapi.vercel.app/api/getData?url=https://iptv.cameraddns.net/search.php?k=${key}`)
    console.log(api.groups)
    const idHTML = document.getElementById("danhMuc")
    const HTML =  api.groups.map((i) => {
        const items = i.channels.map((d) => {
          console.log(d.description)
          return `
          <a href="${GL_domain}THVL/vod/index.html?id=${d.id}&ss=0&t=${encodeURIComponent(d.description)}">
                <div class="card"><img src="${d.image.url}" loading="lazy"  alt=""></div>      
             </a> 
          `
        })
        return `
          <section>
            <h2>${i.name}</h2>
            <div class="card-list">
                ${items.join("")}
            </div>
          </section>    
        `
    })
    idHTML.innerHTML = HTML.join("")
//     api.ribbons.forEach(item => {
//     getDataHTML(item.slug)
// });
}

// Mã hóa văn bản tiếng Việt sang Base64
function encodeText(text) {
  const encoder = new TextEncoder(); 
  const bytes = encoder.encode(text); 
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

/************************************************************** */

function search(){
  const inp = document.getElementById("input")
  console.log(inp.value)
  
  if (inp.value.length > 0){
  console.log(inp.value)  
window.location.href = `${GL_domain}THVL/search/index.html?key=${inp.value}`;  
}else {
    alert("Vui Lòng Nhập Thông Tin Tìm Kiếm")
  }
}


 window.addEventListener("DOMContentLoaded", () => {
      const p = new URLSearchParams(location.search);
      const k = p.get('key') 
      if (k) {
        if (typeof getSearch === 'function') {
            getSearch(k)
        } else {
          console.error("start() function not found");
        }
      } else {
       window.location.href = `${GL_domain}THVL`;  
      }
    });