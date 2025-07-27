
async function getSheetData(id, sheet = 'Sheet1') {
  const url = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?sheet=${sheet}&tqx=out:json`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    // Tách phần JSON thật sự ra khỏi hàm wrap
    const jsonText = text.match(/google\.visualization\.Query\.setResponse\(([\s\S\w]+)\)/)[1];
    const data = JSON.parse(jsonText);

    // Lấy tiêu đề (key)
    const keys = data.table.cols.map(col => col.label);

    // Chuyển từng dòng thành object
    const result = data.table.rows.map(row => {
      const obj = {};
      row.c.forEach((cell, i) => {
        obj[keys[i]] = cell ? cell.v : null;
      });
      return obj;
    });

    return result;
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu từ Google Sheet:", err);
    return [];
  }
}

getSheetData('1hSEcXxxEkbgq8203f_sTKAi3ZNEnFNoBnr7f3fsfzYE', 'Sheet1')
  .then(data =>{
    console.log(data)
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
  });
  
  
  /*
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
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP4Kq7.png" alt="Logo 1"></td>
        <td>VTV1 HD</td>
        <td>✔️</td>
        <td>✔️</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP5wfv.png" alt="Logo 2"></td>
        <td>HTV7 HD</td>
        <td>❌</td>
        <td>✔️</td>
      </tr>
      <tr>
      <td>1</td>
        <td><img src="https://lmg159z.github.io/soixamTV/wordspage/image/logo/VTV_CanTho.png" alt="Logo 3"></td>
        <td>THVL1</td>
        <td>✔️</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP4Kq7.png" alt="Logo 1"></td>
        <td>VTV1 HD</td>
        <td>✔️</td>
        <td>✔️</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP5wfv.png" alt="Logo 2"></td>
        <td>HTV7 HD</td>
        <td>❌</td>
        <td>✔️</td>
      </tr>
      <tr>
      <td>1</td>
        <td><img src="https://lmg159z.github.io/soixamTV/wordspage/image/logo/VTV_CanTho.png" alt="Logo 3"></td>
        <td>THVL1</td>
        <td>✔️</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP4Kq7.png" alt="Logo 1"></td>
        <td>VTV1 HD</td>
        <td>✔️</td>
        <td>✔️</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP5wfv.png" alt="Logo 2"></td>
        <td>HTV7 HD</td>
        <td>❌</td>
        <td>✔️</td>
      </tr>
      <tr>
      <td>1</td>
        <td><img src="https://lmg159z.github.io/soixamTV/wordspage/image/logo/VTV_CanTho.png" alt="Logo 3"></td>
        <td>THVL1</td>
        <td>✔️</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP4Kq7.png" alt="Logo 1"></td>
        <td>VTV1 HD</td>
        <td>✔️</td>
        <td>✔️</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP5wfv.png" alt="Logo 2"></td>
        <td>HTV7 HD</td>
        <td>❌</td>
        <td>✔️</td>
      </tr>
      <tr>
      <td>1</td>
        <td><img src="https://lmg159z.github.io/soixamTV/wordspage/image/logo/VTV_CanTho.png" alt="Logo 3"></td>
        <td>THVL1</td>
        <td>✔️</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP4Kq7.png" alt="Logo 1"></td>
        <td>VTV1 HD</td>
        <td>✔️</td>
        <td>✔️</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP5wfv.png" alt="Logo 2"></td>
        <td>HTV7 HD</td>
        <td>❌</td>
        <td>✔️</td>
      </tr>
      <tr>
      <td>1</td>
        <td><img src="https://lmg159z.github.io/soixamTV/wordspage/image/logo/VTV_CanTho.png" alt="Logo 3"></td>
        <td>THVL1</td>
        <td>✔️</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP4Kq7.png" alt="Logo 1"></td>
        <td>VTV1 HD</td>
        <td>✔️</td>
        <td>✔️</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP5wfv.png" alt="Logo 2"></td>
        <td>HTV7 HD</td>
        <td>❌</td>
        <td>✔️</td>
      </tr>
      <tr>
      <td>1</td>
        <td><img src="https://lmg159z.github.io/soixamTV/wordspage/image/logo/VTV_CanTho.png" alt="Logo 3"></td>
        <td>THVL1</td>
        <td>✔️</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP4Kq7.png" alt="Logo 1"></td>
        <td>VTV1 HD</td>
        <td>✔️</td>
        <td>✔️</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP5wfv.png" alt="Logo 2"></td>
        <td>HTV7 HD</td>
        <td>❌</td>
        <td>✔️</td>
      </tr>
      <tr>
      <td>1</td>
        <td><img src="https://lmg159z.github.io/soixamTV/wordspage/image/logo/VTV_CanTho.png" alt="Logo 3"></td>
        <td>THVL1</td>
        <td>✔️</td>
        <td>❌</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP4Kq7.png" alt="Logo 1"></td>
        <td>VTV1 HD</td>
        <td>✔️</td>
        <td>✔️</td>
      </tr>
      <tr>
        <td>1</td>
        <td><img src="https://iili.io/2lP5wfv.png" alt="Logo 2"></td>
        <td>HTV7 HD</td>
        <td>❌</td>
        <td>✔️</td>
      </tr>
      <tr>
      <td>1</td>
        <td><img src="https://lmg159z.github.io/soixamTV/wordspage/image/logo/VTV_CanTho.png" alt="Logo 3"></td>
        <td>THVL1</td>
        <td>✔️</td>
        <td>❌</td>
      </tr>
    </tbody>
    */