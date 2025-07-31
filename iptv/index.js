
  fetch("https://soixamapi.vercel.app/api/logoF")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Lỗi HTTP: ${response.status}`);
      }
      return response.json(); // Chuyển dữ liệu phản hồi thành JSON
    })
    .then(data => {
      
      const html = data.map(list => `
    
      <tr>
        <td>${list.STT}</td>
        <td><img src="${list.logo.includes("http") ? list.logo : `${GL_domain}wordspage/image/logo/${list.logo}`}" onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/500px-Google_2015_logo.svg.png';" alt="Logo 1"></td>
        <td>${list.name}</td>
        <td>${list.classify == "TV" ?"✅":"❌"}</td>
        <td>${list.classify == "IPTV" || list.classify == "TV" ?"✅":"❌"}️</td>
      </tr>
  `);
const idHTML = document.getElementById("table_list_channels")
idHTML.innerHTML = ` 
    
   <thead>
      <tr>
        <th>Vị Trí</th>
        <th>Logo</th>
        <th>Tên kênh</th>
        <th>Website</th>
        <th>IPTV</th>
      </tr>
    </thead>
    <tbody>
      ${html.join("")}
    </tbody>
    
    `
      
      
      
      
    })
    .catch(error => {
      console.error("Lỗi khi gọi API:", error.message);
    });
