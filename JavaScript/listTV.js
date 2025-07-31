
  function start(classify) {
  fetch(`https://soixamapi.vercel.app/api/${classify}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Lỗi HTTP: ${response.status}`);
    }
    return response.json(); // Chuyển dữ liệu phản hồi thành JSON
  })
  .then(data => {
  loop(data)
  console.log(data)
  
    })
  .catch(error => {
    console.error("Lỗi khi gọi API:", error.message);
  });
  

}


function loop(list) {
  for (const i of list) {
     innerChannel(i)  
  }
}


function innerChannel(data) {
  const channel = document.getElementById("video-list");
  const listChannel = data.channel.map(c => `
    <a href="${GL_domain}stream/index.html?groupChannel=${c.idGroup}&channel=${c.STT}">
      <div class="video-item">
        <div class="thumbnail-container">
          <img src="${(c.logo.includes('http') ? c.logo : `${GL_domain}wordspage/image/logo/${c.logo}`)}" alt="${c.name}">
        </div>
        <div class="video-title">${c.name}</div>
      </div>
    </a>
  `);

  channel.innerHTML += `
     <div class="league-section">
      <h2>${data.info.group}</h2>
      <div class="video-row">
        ${listChannel.join("")}
      </div>
    </div>
  `;
}






