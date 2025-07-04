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
const channel = document.getElementById("video-list")

function logo(logoChannel, main ) {
  const squaredNumbers = logoChannel.map(num => 
    `
     <div class="video-item"  onclick="play('${num.id}','${main}'); updateURL('${num.id}')" >
            <div class="thumbnail-container">
                <img alt="${num.id}"  src="${(num.logo.includes("http") ? num.logo : `${GL_domain}wordspage/image/logo/${num.logo}`)}">
                
            </div>
            <div class="video-title">${num.name}</div>
        </div>
    `
    );
  //console.log(squaredNumbers.join(""))
  channel.innerHTML = squaredNumbers.join("")
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


/*function checkRadioUrl(url) {
  const fallback = 'https://files.catbox.moe/onhht8.mp3';

  // Kiểm tra xem chuỗi có phải là URL hợp lệ không
  try {
    new URL(url); // Nếu lỗi sẽ nhảy xuống catch
  } catch (e) {
    return fallback;
  }

  // Nếu là URL hợp lệ, kiểm tra xem có hoạt động không
  const xhr = new XMLHttpRequest();
  xhr.open('HEAD', url, false); // ⚠️ Đồng bộ, chỉ nên dùng cho mục đích đơn giản
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
}*/

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