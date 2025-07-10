
function start(logoJ, main) {
  fetch(`${GL_domain}json/tivi/logo/${logoJ}.json`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }
    return response.json(); // Chuyển dữ liệu phản hồi thành JSON
  })
  .then(data => {
    logo(data,main)
    console.log(data)
    })
  .catch(error => {
    console.error("Lỗi khi gọi API:", error.message);
  });

}

const channel = document.getElementById("list_channel");

function logo(logoChannel, main) {
  const html = logoChannel.map(num => `
    <div class="list-channel-item" onclick="play('${num.id}','${main}'); updateURL('${num.id}'); liveTheme('${num.id}')">
      <div id="${num.id}" class="list-channel-item-logo">
        <img alt="${num.id}" src="${num.logo.includes("http") ? num.logo : `${GL_domain}wordspage/image/logo/${num.logo}`}">
      </div>
      <div class="title">${num.name}</div>
    </div>
  `);
  
  channel.innerHTML = html.join("");
}

function updateURL(id) {
  const params = new URLSearchParams(window.location.search);
  params.set("channel", id);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  history.pushState(null, '', newUrl);
}



let currentLiveId = null;

// Hàm chờ phần tử có selector xuất hiện, sau đó gọi callback
function waitForElement(selector, callback, timeout = 5000) {
  const start = Date.now();
  
  const interval = setInterval(() => {
    const element = document.querySelector(selector);
    if (element) {
      clearInterval(interval);
      callback(element);
    } else if (Date.now() - start > timeout) {
      clearInterval(interval);
      console.warn("Hết thời gian đợi phần tử:", selector);
    }
  }, 100);
}

// Hàm thêm class "live" vào đúng phần tử, bỏ class khỏi cái trước
function liveTheme(id) {
  const applyLive = (el) => {
    // Bỏ class cũ nếu có
    if (currentLiveId && currentLiveId !== id) {
      const oldEl = document.getElementById(currentLiveId);
      if (oldEl) oldEl.classList.remove("live");
    }
    
    el.classList.add("live");
    currentLiveId = id;
  };
  
  const tag = document.getElementById(id);
  if (tag) {
    applyLive(tag);
  } else {
    // Chờ phần tử có id xuất hiện
    waitForElement(`#${id}`, applyLive);
  }
}