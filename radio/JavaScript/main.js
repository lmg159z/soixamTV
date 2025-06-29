
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
    console.log(data)
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
  console.log(streamUrl)
  const audio = document.getElementById('myVideo');
  
  if (!audio) {
    console.error("Không tìm thấy thẻ audio với id 'myAudio'");
    return;
  }
  
  audio.pause(); // Dừng nếu đang phát
  audio.src = streamUrl; // Gán link mới
  audio.load(); // Tải lại
  audio.play().then(() => {
    console.log("🎵 Đang phát:", streamUrl);
  }).catch(error => {
    console.error("🚫 Không thể phát:", error);
  });
}