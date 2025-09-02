var video = document.getElementById('myVideo');

////////////////////////////


function play(idStream, group) {
  fetch(`https://soixamapi.vercel.app/api/getStreamURL?STT=${idStream}&idGroup=${group}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }
      return response.json(); // Chuyển dữ liệu phản hồi thành JSON
    })
    .then(data => {
      crateHTML(data[0])
    })
    .catch(error => {
      console.error("Lỗi khi gọi API:", error.message);
    });
  
}






function crateHTML(data) {
  console.log(data);

  const idHTML = document.getElementById("video");
  if (!idHTML || !data || !data.type) return;

  const poster = `${GL_domain}wordspage/image/poster/TV_SHOW_20250120_172203_0000.png`;
  const logoHTML = `<img src="${GL_domain}wordspage/image/logo.png" class="logo-overlay" id="logo">`;
  const videoHTML = `<video id="myVideo" class="video-section" poster="${poster}" controls autoplay loop playsinline></video>`;
  const audioHTML = `<audio id="myAudio" class="video-section" autoplay></audio>`;
  const iframeHTML = `<iframe src="${enCode(data.url)}" class="ifvideo" width="100%" allow="autoplay" muted allowfullscreen></iframe>`;
  const linkHTML = `<a class="video-section" target="_blank" href="${enCode(data.url)}">Click vào đây để xem</a>`;

  let content = ""; // HTML sẽ render vào idHTML.innerHTML

  switch (data.type) {
    case 'm3u8':
      content = `
        <div id="video_player">
          ${videoHTML}
          ${logoHTML}
        </div>`;
      idHTML.innerHTML = content;
hls(data.url.includes("http") ? data.url :enCode(data.url) );  
break;
case 'flv':
      content = `
        <div id="video_player">
          ${videoHTML}
          ${logoHTML}
        </div>`;
      idHTML.innerHTML = content;
runFLV(data.url.includes("http") ? data.url :enCode(data.url) ,"myVideo");  
break;

    case 'hls_multi':
      content = `
        <div id="video_player">
          ${videoHTML}
          ${audioHTML}
          ${logoHTML}
        </div>`;
      idHTML.innerHTML = content;
      hls_multi(
        data.url.includes("http") ? data.url :enCode(data.url), 
        data.audio.includes("http") ? data.audio :enCode(data.audio)
        , "myVideo", "myAudio");
      break;

    case 'key':
      content = `
        <div id="video_player">
          ${videoHTML}
          ${logoHTML}
        </div>`;
      idHTML.innerHTML = content;
      playShakaStream(enCode(data.url), {
        keys: [{
          kty: "oct",
          k: enCode(data.key),
          kid: enCode(data.keyID)
        }],
        type: "temporary"
      }, "myVideo");
      break;

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
          kid: hexToBase64(enCode(data.keyID)),
          k: hexToBase64(enCode(data.key))
        }
      ]
    }  
     playShakaStream(
       enCode(data.url),
       clearkeyData,
       "myVideo"
     );
      break;
      case 'aOnly':
     idHTML.innerHTML = `
         <audio id="audio" class="video-section" controls autoplay></audio>`
        
      playRadio(enCode(data.url),"audio")
         const player = new MediaElementPlayer('audio', {
      features: ['playpause','progress','volume'],
      stretching: 'responsive',
      success: function (media) {
        console.log("Player đã sẵn sàng");
      }
    });
      break
    case 'iframe':
      content = `
        <div id="video_player">
          ${iframeHTML}
          ${logoHTML}
        </div>`;
      idHTML.innerHTML = content;
      break;

    default:
      console.warn("Loại không hợp lệ:", data.type);
  }
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

function base64ToBase64Url(b64) {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
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
  // Chuẩn hóa hex: xóa khoảng trắng và chữ hoa
  hexString = hexString.replace(/\s+/g, '').toLowerCase();

  // Kiểm tra độ dài hợp lệ
  if (hexString.length % 2 !== 0) {
    throw new Error("Chuỗi hex không hợp lệ (phải có độ dài chẵn)");
  }

  // Chuyển hex -> Uint8Array
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }

  // Chuyển Uint8Array -> base64
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}


function playRadio(streamUrl,id) {
  const audio = document.getElementById(id);
  const streamLink = streamUrl
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


function runFLV(url, elementId) {
  if (flvjs.isSupported()) {
    const videoElement = document.getElementById(elementId);

    // Nếu đã có player trước đó thì huỷ đi để tránh conflict
    if (videoElement.player) {
      videoElement.player.unload();
      videoElement.player.detachMediaElement();
      videoElement.player.destroy();
      videoElement.player = null;
    }

    const flvPlayer = flvjs.createPlayer({
      type: 'flv',
      url: url,
      isLive: true
    });

    flvPlayer.attachMediaElement(videoElement);
    flvPlayer.load();

    // Đảm bảo autoplay
    videoElement.muted = false;     // để tránh bị block autoplay
    videoElement.autoplay = true;
    flvPlayer.play().catch(err => {
      console.warn("Autoplay bị chặn:", err);
    });

    videoElement.player = flvPlayer;
  } else {
    console.error("Trình duyệt không hỗ trợ FLV.js");
  }
}