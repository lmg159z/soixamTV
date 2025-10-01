

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



function parseFromUrl() {
  const urlObj = new URL(window.location.href);
  const params = urlObj.searchParams;

  const sources = (params.get("src") || "").split("_");
  const ids = (params.get("id") || "").split("_");

  return sources.map((source, index) => ({
    source,
    id: ids[index] || ""
  }));
}


(async () => {
  const parsed = parseFromUrl();
  let arr = [];
  for (let i in parsed) {
    const dataAPI = await getAPI(`https://streamed.pk/api/stream/${parsed[i].source}/${parsed[i].id}`);
    arr = arr.concat(dataAPI); // gán lại cho arr
  }
    const idHTML = document.getElementById("resolution-bar")
    const dataResolution = arr.map((i, index) => {
      return `
      <div class="res-btn" data-url="${i.embedUrl}" >${i.hd === true ? "HD" : "SD"}_${index + 1} ${i.language}</div>
      `
    })

    idHTML.innerHTML = dataResolution.join("")
    toggleActive("res-btn", "active");

})()



function handleClick(url) {
  const id = document.getElementById("video_iframe")
  id.src = url
  // ở đây bạn có thể xử lý thêm (fetch, render, v.v.)
}

function toggleActive(className, activeClass) {
  const elements = document.querySelectorAll(`.${className}`);

  if (elements.length > 0) {
    // Mặc định: thẻ đầu tiên
    elements[0].classList.add(activeClass);
    const defaultUrl = elements[0].dataset.url;
    handleClick(defaultUrl);
  }

  elements.forEach(el => {
    el.addEventListener("click", () => {
      // Bỏ class active khỏi tất cả thẻ
      elements.forEach(e => e.classList.remove(activeClass));
      // Thêm class vào thẻ vừa click
      el.classList.add(activeClass);

      // Lấy data-url
      const url = el.dataset.url;
      handleClick(url);
    });
  });
}
