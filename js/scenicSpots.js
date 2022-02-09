let selectedCity =
  location.href.split("=")[1] == undefined
    ? "Taipei"
    : location.href.split("=")[1];
const dropdownCity = document.querySelector(".dropdownCity");
const itemInfo_section = document.querySelector(".itemInfo_section");
const breadcrumb = document.querySelector(".breadcrumb-item.active");

let map;

function init() {
  dropdownCity.value = selectedCity;
  breadcrumb.textContent =
    dropdownCity.options[dropdownCity.selectedIndex].text;
  getItemData();
}
init();

let data;
function getItemData(city) {
  axios
    .get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${selectedCity}?%24top=60&format=JSON`,
      { header: GetAuthorizationHeader() }
    )
    .then((res) => {
      data = res.data;
      renderItemData();
      renderMap();
      bindMarkers();
    })
    .catch((err) => {
      console.log(err.response);
      if (err.response.status == 429) {
        alert(`${err.response.data.message}! \nPlease try again tomorrow. ☺`);
      }
    });
}

// 渲染資料
function renderItemData() {
  let str = "";
  data.forEach((item, i) => {
    let imgUrl;
    if (item.Picture.PictureUrl1 == undefined) {
      imgUrl = "image/landscape.jpg";
    } else {
      imgUrl = item.Picture.PictureUrl1;
    }
    str += `<div class="sceneSpotCard" data-loc="${
      item.Position.PositionLat
    }, ${item.Position.PositionLon}" data-id ='${item.ScenicSpotID}'>
                <a href="scenicSpotInfo.html?id=${
                  item.ScenicSpotID
                }&city=${selectedCity}">
                  <div class="img_div">
                    <img class="sceneImg" src="${imgUrl}" alt="${
      item.Picture.PictureDescription1
    }" onerror='imageError(event)'/>  
                  </div>
                  <div class="sceneSpotCard_body">    
                  <div class="numIcon"><p>${i + 1}</p></div>
                    <h5 class="sceneName">${item.ScenicSpotName}</h5>
                  </div>
                </a>
              </div>`;
  });
  itemInfo_section.innerHTML = str;
}

function imageError(e) {
  console.log((e.target.src = "image/landscape.jpg"));
}

//渲染地圖
function renderMap() {
  // 初始化地圖
  if (map != undefined) {
    map.remove();
  }
  // 抓第一筆資料當作中心點
  const location = document.querySelector(".sceneSpotCard").dataset.loc;
  const lat = location.split(",")[0];
  const lon = location.split(",")[1];
  map = L.map("map").setView([lat, lon], 11); //第一筆做中心點

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoieWFzaGllbnh6eHoiLCJhIjoiY2t2MjlpMzBxMDFkdjJzbDdxbm8yYmM5byJ9.fN2QIK9fAfUXmdNZdv_oGA",
    }
  ).addTo(map);

  // 渲染所有Icon
  data.forEach((item, i) => {
    var myIcon = L.divIcon({
      html: `<div class='iconNum' data-id ='${item.ScenicSpotID}'>${
        i + 1
      }</div>`,
      className: "myIcon",
    });

    let lat = item.Position.PositionLat;
    let lon = item.Position.PositionLon;
    L.marker([lat, lon], { icon: myIcon }).addTo(map);
  });
}

dropdownCity.addEventListener("change", (e) => {
  selectedCity = e.target.value;
  getItemData();
  location.href = `scenicSpots.html?id=${selectedCity}`;
});

function bindMarkers() {
  const markerPane = document.querySelector(".leaflet-marker-pane");
  const iconNums = markerPane.querySelectorAll(".iconNum");
  const sceneSpotCards = itemInfo_section.querySelectorAll(".sceneSpotCard");

  let selectedMarker;
  sceneSpotCards.forEach((item) => {
    item.addEventListener("mouseover", (e) => {
      const location = item.dataset.loc;
      const lat = location.split(",")[0];
      const lon = location.split(",")[1];
      map.setView([lat, lon], 13); //調整中心點

      selectedMarker = item.getAttribute("data-id");

      iconNums.forEach((item) => {
        if (item.dataset.id == selectedMarker) {
          item.closest(".myIcon").classList.add("iconHover");
          item.closest(".myIcon").style.zIndex = "999";
        } else {
          item.closest(".myIcon").classList.remove("iconHover");
        }
      });
    });
  });
}

//驗證用
function GetAuthorizationHeader() {
  var AppID = "106dd91d71204e77ad5b3be1ea162e7c";
  var AppKey = "C0XualwSfBvKfjS_RDRcnDoSc6A";

  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA("SHA-1", "TEXT");
  ShaObj.setHMACKey(AppKey, "TEXT");
  ShaObj.update("x-date: " + GMTString);
  let HMAC = ShaObj.getHMAC("B64");
  let Authorization =
    'hmac username="' +
    AppID +
    '", algorithm="hmac-sha1", headers="x-date", signature="' +
    HMAC +
    '"';
  return { Authorization: Authorization, "X-Date": GMTString };
}
