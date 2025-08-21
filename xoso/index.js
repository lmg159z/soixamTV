/*
function startCountdown(startStr, endStr, elementId, onStart, onEnd) {
    const el = document.getElementById(elementId);

    // Chuyển "DD:MM:YY_HH:MM:SS" thành Date
    function parseDateTime(str) {
        let [datePart, timePart] = str.split("_");
        let [DD, MM, YY] = datePart.split(":").map(Number);
        let [hh, mm, ss] = timePart.split(":").map(Number);
        return new Date(2000 + YY, MM - 1, DD, hh, mm, ss, 0);
    }

    let startTime = parseDateTime(startStr);
    let endTime = parseDateTime(endStr);

    let started = false;
    let timer;

    function update() {
        let now = new Date();

        if (now < startTime) {
            // Chỉ hiển thị khi chưa tới giờ bắt đầu
            let diff = startTime - now;
            el.innerHTML =  formatTime(diff);
        }
        else if (now >= startTime && now < endTime) {
            // Khi bắt đầu
            if (!started) {
                started = true;
                el.innerHTML = ""; // Ẩn countdown
                if (typeof onStart === "function") onStart();
            }
        }
        else if (now >= endTime) {
            // Khi kết thúc
            el.innerHTML = "";
            if (typeof onEnd === "function") onEnd();
            clearInterval(timer);
        }
    }

    function formatTime(ms) {
        let hours = Math.floor(ms / (1000 * 60 * 60));
        let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return String(hours).padStart(2, "0") + ":" +
               String(minutes).padStart(2, "0") + ":" +
               String(seconds).padStart(2, "0");
    }

    timer = setInterval(update, 1000);
    update();
}

*/

function startCountdown(startStr, endStr, elementId, onStart, onEnd) {
    const el = document.getElementById(elementId);

    // Chuyển "DD:MM:YYYY_HH:MM:SS" thành Date
    function parseDateTime(str) {
        let [datePart, timePart] = str.split("_");
        let [DD, MM, YYYY] = datePart.split(":").map(Number);
        let [hh, mm, ss] = timePart.split(":").map(Number);
        return new Date(YYYY, MM - 1, DD, hh, mm, ss, 0);
    }

    let startTime = parseDateTime(startStr);
    let endTime = parseDateTime(endStr);

    let started = false;
    let timer;

    function update() {
        let now = new Date();

        if (now < startTime) {
            // Chỉ hiển thị khi chưa tới giờ bắt đầu
            let diff = startTime - now;
            el.innerHTML = formatTime(diff);
        }
        else if (now >= startTime && now < endTime) {
            // Khi bắt đầu
            if (!started) {
                started = true;
                el.innerHTML = ""; // Ẩn countdown
                if (typeof onStart === "function") onStart();
            }
        }
        else if (now >= endTime) {
            // Khi kết thúc
            el.innerHTML = "";
            if (typeof onEnd === "function") onEnd();
            clearInterval(timer);
        }
    }

    function formatTime(ms) {
        let hours = Math.floor(ms / (1000 * 60 * 60));
        let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return String(hours).padStart(2, "0") + ":" +
               String(minutes).padStart(2, "0") + ":" +
               String(seconds).padStart(2, "0");
    }

    timer = setInterval(update, 1000);
    update();
}




let dataXSKTStart = []
function startXSKT(){
  const idXOSO = document.getElementById("body")
  const html = dataXSKTStart.data.map((num, i )=> `
    <div class="list-channel-item" onclick="streams(${i}); liveTheme('${i}')">
      <div id="channel_${i}" class="list-channel-item-logo">
        <img alt="${num.kenh}" src="${num.logo.includes("http") ? num.logo : `${GL_domain}wordspage/image/logo/${num.logo}`}">
      </div>
      <div class="title">${num.kenh}</div>
    </div>
  `);
  console.log(html)
  idXOSO.innerHTML = `
    
    <div id="video">
      <div id="video_player">
        <video class="video-section" id="myVideo" src="https://live.fptplay53.net/fnxhd2/quocphongvnhd_vhls.smil/chunklist.m3u8" poster="../wordspage/image/poster/TV_SHOW_20250120_172203_0000.png" muted loop autoplay controls>
        </video>
      </div>
    </div>
    <div id="list_channel" class="">
      ${html.join("")}
    </div>
  `
 crateHTML({
     "url": dataXSKTStart.data[0].url,
     "type": dataXSKTStart.data[0].type
 })
 liveTheme("0")
}
async function endXSKT(){
  const idXOSO = document.getElementById("body")
const dataXSKT = await getAPI("https://soixamapi.vercel.app/api/xoso")
dataXSKTStart = dataXSKT
 idXOSO.innerHTML = `
 
  <div id="xoso">
 <div id="before">
      <h2>${dataXSKT
      .data[0].danhMuc}</h2>
      <h4>Chưa đến giờ xổ số vui lòng đợi sau</h4>
      <div id="countdown">00:00:00</div>
    </div></div>
 `
 startCountdown(
    dataXSKT.timeStart, // Ngày giờ bắt đầu
    dataXSKT.timeEnd, // Ngày giờ kết thúc
    "countdown",
    startXSKT,
    endXSKT
);
  
}
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
endXSKT()
function streams(i) {
   crateHTML({
     "url": dataXSKTStart.data[i].url,
     "type": dataXSKTStart.data[i].type
 })
  
}