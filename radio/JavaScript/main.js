/*
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
        radio(data[idStream].streamLink)
      }
      
      
    })
    .catch(error => {
      console.error("Lỗi khi gọi API:", error.message);
    });
  
}



function radio(streamLink) {
  console.log("test")
    const player = videojs('myVideo', {
      sources: [{
        src: streamLink, // Thay bằng link thật
        type: 'application/x-mpegURL'
      }]
    });

    player.ready(function () {
      this.muted(false); // Bỏ mute sau khi play
    });
}

*/

// Đảm bảo khai báo GL_domain từ nơi khác
// Ví dụ:
// const GL_domain = "https://yourdomain.com/";

const channelContainer = document.getElementById("video-list");

function start(groupLogo, groupChannel) {
  fetch(`${GL_domain}json/radio/logo/${groupLogo}.json`)
    .then(response => {
      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
      return response.json();
    })
    .then(data => {
      renderChannelList(data, groupChannel);
    })
    .catch(error => {
      console.error("Lỗi khi gọi API:", error.message);
    });
}

function renderChannelList(channelList, groupChannel) {
  const html = channelList.map(channel => `
    <div class="video-item" onclick="play('${channel.id}', '${groupChannel}'); updateURL('${channel.id}')">
      <div class="thumbnail-container">
        <img alt="${channel.id}" src="${channel.logo.includes('http') ? channel.logo : `${GL_domain}wordspage/image/logo/${channel.logo}`}">
      </div>
      <div class="video-title">${channel.name}</div>
    </div>
  `).join("");

  channelContainer.innerHTML = html;
}

function updateURL(id) {
  const params = new URLSearchParams(window.location.search);
  params.set('channel', id);
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  history.pushState(null, '', newUrl);
}

function play(idStream, groupChannel) {
  fetch(`${GL_domain}json/radio/streamLink/${groupChannel}.json`)
    .then(response => {
      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
      return response.json();
    })
    .then(data => {
      const streamData = data[idStream];

      if (streamData && streamData.style === "radio") {
        const poster = streamData.poster && streamData.poster !== ""
          ? streamData.poster
          : `${GL_domain}wordspage/image/poster/TV_SHOW_20250120_172203_0000.png`;
         console.log(poster)
        playRadio(streamData.streamLink, poster);
        console.log(streamData);
      } else {
        console.warn("Không tìm thấy stream radio hợp lệ.");
      }
    })
    .catch(error => {
      console.error("Lỗi khi gọi API:", error.message);
    });
}
function playRadio(streamLink, poster) {
  let player = videojs.getPlayer('myVideo');
  
  if (!player) {
    player = videojs('myVideo', {
      autoplay: true,
      controls: true,
      muted: true,
      poster: poster,
      sources: [{
        src: streamLink,
        type: 'application/x-mpegURL'
      }]
    });
  } else {
    // ✅ Đảm bảo player đã được khởi tạo mới gán poster và src
    player.ready(() => {
      player.poster(poster);
      player.src({
        src: streamLink,
        type: 'application/x-mpegURL'
      });
      player.play();
      player.muted(false);
    });
  }
}

// Hàm khởi động sau khi DOM đã sẵn sàng
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const groupChannel = params.get('groupChannel');
  const channel = params.get('channel');
  const groupLogo = params.get('groupLogo');

  if (groupChannel && groupLogo) {
    start(groupLogo, groupChannel);
    if (channel) play(channel, groupChannel);
  } else {
    document.body.innerHTML = '<h1>THIẾU THAM SỐ - missing parameter</h1>';
  }
});