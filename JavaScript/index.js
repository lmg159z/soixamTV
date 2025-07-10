var video = document.getElementById('myVideo');

////////////////////////////

function play(idStream, tag) {
  console.log(idStream,tag)
  fetch(`${GL_domain}json/tivi/streamLink/${tag}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }
      return response.json(); // Chuyển dữ liệu phản hồi thành JSON
    })
    .then(data => {
      console.log(idStream)
      /*liveTheme(idStream)*/
      crateHTML(data[idStream])
    })
    .catch(error => {
      console.error("Lỗi khi gọi API:", error.message);
    });
  
}



function crateHTML(data) {
  console.log(data.style)
  const videoHTML = `
    <video id="myVideo"
           class="video-section"
           poster="${GL_domain}wordspage/image/poster/TV_SHOW_20250120_172203_0000.png"
           controls autoplay loop  playsinline>
    </video>
  `
  const audioHTML = `<audio id="myAudio"  autoplay ></audio>`
  const linlHTML =`<a class="video-section" tagret="_bank"  href="${data.streamLink}">Click vào đây để xem</a>`
  const iframeHTML = `<iframe src="${data.streamLink}" class="ifvideo" width="100%" allow="autoplay" muted allowfullscreen></iframe>`
  const logoHTML = `<img src="${GL_domain}wordspage/image/logo.png" class="logo-overlay" id="logo">`
  const idHTML = document.getElementById("video")

 /*********Dieu kien************/
  switch (data.style) {
    case 'm3u8':
      idHTML.innerHTML = `
        <div id="video_player">
            ${videoHTML}
            ${logoHTML}
        </div>
      `
      hls(data.streamLink);
      break;
    /*******************/  
    case 'hls_multi':
      idHTML.innerHTML = `
        <div id="video_player">
            ${videoHTML}
            ${audioHTML}
            ${logoHTML}
        </div>
            `
     hls_multi(
     data.streamLink,
     data.audio,
     "myVideo",
     "myAudio"
    );
      break
      
    /*******************/  
    case 'key':
      idHTML.innerHTML = `
        <div id="video_player">
            ${videoHTML}
            ${logoHTML}
        </div>
            `
     playShakaStream(
       data.streamLink,
       data.key,
       "myVideo"
     );
      break
    /*******************/  
    case 'key-hex':
      idHTML.innerHTML = `
        <div id="video_player">
            ${videoHTML}
            ${logoHTML}
        </div>
            `
    const  clearkeyData = {
      type: "temporary",
      keys: [
        {
          kty: "oct",
          k: hexToBase64(data.key.keys[0].k),
          kid: hexToBase64(data.key.keys[0].kid)
        }
      ]
    }  
     playShakaStream(
       data.streamLink,
       clearkeyData,
       "myVideo"
     );
      break
        
    /*******************/  
    case 'iframe':
      idHTML.innerHTML = `
        <div id="video_player">
            ${iframeHTML}
            ${logoHTML}
        </div>
            `
      break
        
    default:
      console.log("Không hợp lệ")
  }
}








function base64ToBase64Url(b64) {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function convertJWKS(jwks) {
  const result = {};
  jwks.keys.forEach(key => {
    result[base64ToBase64Url(key.kid)] = base64ToBase64Url(key.k);
  });
  return result;
}

function playShakaStream(url, jwks, id) {
  if (!shaka.Player.isBrowserSupported()) {
    alert('Trình duyệt không hỗ trợ Shaka Player!');
    return;
  }
  
  const video = document.getElementById(id);
  const player = new shaka.Player(video);
  
  const clearKeyMap = convertJWKS(jwks);
  
  player.configure({
    drm: {
      clearKeys: clearKeyMap
    }
  });
  
  player.load(url).then(() => {
    console.log('Phát thành công!');
    video.autoplay = true;
    video.muted = false;
    video.play();
  }).catch(error => {
    console.error('Lỗi phát:', error);
    alert(`Lỗi phát: ${error.code}`);
  });
  
  video.play();
  video.muted = false
  video.autoplay = true
  
}


function hls(videoSrc) {
  const video = document.getElementById('myVideo');
  
  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      video.play();
    });
  } else if (
    video.canPlayType('application/vnd.apple.mpegurl')
  )
  {
    video.src = videoSrc;
    video.play();
    video.autoplay = true
    video.muted = false
  }
}

function hls_multi(videoSrc, audioSrc, idV, idA, tolerance = 0.1, syncTime = 2000) { // syncTime is now a parameter
  const videoPlayer = document.getElementById(idV);
  const audioPlayer = document.getElementById(idA);
  
  let videoHls = null;
  let audioHls = null;
  let videoManifestLoaded = false;
  let audioManifestLoaded = false;
  let syncInterval;
  
  function loadHlsStream(player, src, isVideo) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        /* console.log((isVideo ? "Video" : "Audio") + " manifest loaded.");*/
        if (isVideo) {
          videoManifestLoaded = true;
        } else {
          audioManifestLoaded = true;
        }
        
        if (videoManifestLoaded && audioManifestLoaded) {
          // Cả hai luồng đã tải, tiến hành đồng bộ hóa và phát
          console.log("Both manifests loaded, starting sync process.");
          startSyncProcess();
        } else {
          player.muted = true;
        }
      });
      
      hls.on(Hls.Events.ERROR, function(event, data) {
        const errorType = data.type;
        const errorDetails = data.details;
        const errorMessage = `HLS error: ${errorType} - ${errorDetails}`;
        console.error(errorMessage, data);
      });
      
      hls.loadSource(src);
      hls.attachMedia(player);
      return hls;
      
    } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
      player.src = src;
      player.addEventListener('loadedmetadata', function() {
        /* console.log((isVideo ? "Video" : "Audio") + " loaded natively.");*/
        if (isVideo) {
          videoManifestLoaded = true;
        } else {
          audioManifestLoaded = true;
        }
        if (videoManifestLoaded && audioManifestLoaded) {
          console.log("Both manifests loaded, starting sync process.");
          startSyncProcess();
        } else {
          player.muted = true;
        }
      });
    } else {
      console.error("HLS is not supported on this browser.");
    }
    return null;
  }
  
  function startSyncProcess() {
    // Start synchronizing
    videoPlayer.muted = true;
    audioPlayer.muted = true;
    videoPlayer.play(); // Starts playback muted
    syncInterval = setInterval(synchronizeStreams, 50); // Sync more frequently at start
    
    // After a certain time, enable audio
    setTimeout(() => {
      console.log("Sync process finished, enabling audio.");
      clearInterval(syncInterval); // Stop frequent syncing
      videoPlayer.muted = false;
      audioPlayer.muted = false;
      setInterval(synchronizeStreams, 100); // Normal sync frequency
    }, syncTime);
  }
  
  
  
  videoHls = loadHlsStream(videoPlayer, videoSrc, true);
  audioHls = loadHlsStream(audioPlayer, audioSrc, false);
  
  function synchronizeStreams() {
    const videoTime = videoPlayer.currentTime;
    const audioTime = audioPlayer.currentTime;
    
    const diff = videoTime - audioTime;
    
    if (Math.abs(diff) > tolerance) {
      if (diff > tolerance) {
        audioPlayer.currentTime = videoTime;
      } else {
        videoPlayer.currentTime = audioTime;
      }
    }
  }
  
  videoPlayer.addEventListener('play', function() {
    audioPlayer.play();
    // videoPlayer.muted = false;  // Removed from here. Muting handled in startSyncProcess
    // audioPlayer.muted = false; // Removed from here. Muting handled in startSyncProcess
    //  setInterval(synchronizeStreams, 100); // Removed because syncing starts in startSyncProcess
  });
  
  videoPlayer.addEventListener('pause', function() {
    audioPlayer.pause();
  });
  
  videoPlayer.addEventListener('seeking', function() {
    audioPlayer.currentTime = videoPlayer.currentTime;
  });
  
}

function hexToBase64(hexString) {
  // Loại bỏ dấu cách và chữ hoa/thường nếu cần
  hexString = hexString.replace(/\s+/g, '').toLowerCase();
  
  // Chuyển hex thành một mảng byte
  const byteArray = [];
  for (let i = 0; i < hexString.length; i += 2) {
    byteArray.push(parseInt(hexString.substr(i, 2), 16));
  }
  
  // Tạo chuỗi nhị phân từ mảng byte
  const binaryString = String.fromCharCode(...byteArray);
  
  // Mã hóa base64
  return btoa(binaryString);
}