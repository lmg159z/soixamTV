function start(logoJ, main) {
  fetch(`${GL_domain}json/radio/logo/${logoJ}.json`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }
    return response.json(); // Chuyển dữ liệu phản hồi thành JSON
  })
  .then(data => {
    logo(data,main)
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
  params.set('channel', id);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  history.pushState(null, '', newUrl);
}




function play(idStream, tag) {
  fetch(`${GL_domain}json/radio/streamLink/${tag}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }
      return response.json(); // Chuyển dữ liệu phản hồi thành JSON
    })
    .then(data => {
      if (data[idStream].style == "radio") {
        playRadio(data[idStream].streamLink)
      }
      
      
    })
    .catch(error => {
      console.error("Lỗi khi gọi API:", error.message);
    });
  
}

function playRadio(streamUrl) {
  const audio = document.getElementById('myVideo');
  const streamLink = checkRadioUrl(streamUrl)
  console.log(streamLink)
  audio.src = streamLink
  audio.load()
  audio.play() 
  
}


function checkRadioUrl(url) {
  var fallback = 'https://files.catbox.moe/onhht8.mp3';
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', url, false); // false = đồng bộ (⚠️ KHÔNG KHUYÊN DÙNG)
  try {
    xhr.send();
    if (xhr.status >= 200 && xhr.status < 400) {
      return url;
    } else {
      return fallback;
    }
  } catch (e) {
    return fallback;
  }
}

let currentLiveId = null;

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