
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
    const api = await getAPI("https://api.thvli.vn/backend/cm/page/303439c8-8869-4489-a753-6177c58765cb/?platform=web")
    console.log(api)
    api.ribbons.forEach(item => {
    getDataHTML(item.slug)
});
})()


async function getDataHTML(slug){
   const idHTML = document.getElementById("danhMuc")
   const apiData = await getAPI(`https://api.thvli.vn/backend/cm/ribbon/${slug}/?platform=web&page=0&limit=20`)
   const dataHTML = apiData.items.map((i) => {
    return `
    <div class="card"><img src="${i.images.thumbnail}" alt=""></div>
    `
   })

   idHTML.innerHTML += `
    <section>
            <h2>${apiData.name} <a href="#">Xem thêm ›</a></h2>
            <div class="card-list">
                ${dataHTML.join("")}
            </div>
  </section>   
   `
}


// <section>
//             <h2>Mới Cập Nhật <a href="#">Xem thêm ›</a></h2>
//             <div class="card-list">
//                 <div class="card"><img src="https://static3.thvli.vn/assets/thumbnail/2025/08/28/k6a9g8ok_thumbthvli-408x230-nguoidighedocac.jpg" alt=""></div>
//             </div>
//   </section>