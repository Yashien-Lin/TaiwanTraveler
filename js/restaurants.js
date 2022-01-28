// let selectedCity = location.href.split("=")[1];
let selectedCity =
  location.href.split("=")[1] == undefined
    ? "Taipei"
    : location.href.split("=")[1];
const dropdownCity = document.querySelector(".dropdownCity");
const itemInfo_section = document.querySelector(".itemInfo_section");
let map;
// console.log(selectedCity);

// 選擇台北市 ->
// 取得該縣市的前100個景點 -> rederData在右邊區塊
//                        -> renderMap在左邊區塊

function init() {
  dropdownCity.value = selectedCity;
  getItemData();

  // renderMap();
}
init();

let data;
function getItemData(city) {
  axios
    .get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/${selectedCity}?%24top=100&format=JSON`,

      { header: GetAuthorizationHeader() }
    )
    .then((res) => {
      data = res.data;
      console.log(data);
      renderItemData();
      // getNearBySceneSpot();
      renderMap();
      bindMarkers();
    })
    .catch((err) => console.log(err));
}

// 取得該縣市
// let nearbySceneData;
// function getNearBySceneSpot() {
//   const location = document.querySelector(".sceneSpotCard").dataset.loc;
//   const lat = location.split(",")[0];
//   const lon = location.split(",")[1];

//   axios
//     .get(
//       `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${selectedCity}?%24top=600&%24format=JSON`,
//       // `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${selectedCity}?%24spatialFilter=nearby(${lat},${lon},5000)&%24format=JSON`,
//       { header: GetAuthorizationHeader() }
//     )
//     .then((res) => {
//       nearbySceneData = res.data;
//       console.log(nearbySceneData);
//       renderMap(lat, lon);
//     })
//     .catch((err) => console.log(err));
// }

// 渲染資料
function renderItemData() {
  let str = "";
  data.forEach((item, i) => {
    // console.log(item.Picture.PictureUrl1);
    let imgUrl;
    if (item.Picture.PictureUrl1 == undefined) {
      imgUrl = "image/food_notFound2.jpg";
      // return;
    } else {
      imgUrl = item.Picture.PictureUrl1;
    }
    str += `<div class="sceneSpotCard" data-loc="${
      item.Position.PositionLat
    }, ${item.Position.PositionLon}" data-id ='${item.RestaurantID}'>
                <a href="restaurantInfo.html?id=${
                  item.RestaurantID
                }&city=${selectedCity}">
                  <div class="img_div">
                    <img class="sceneImg" src="${imgUrl}" alt="${
      item.Picture.PictureDescription1
    }" onerror='imageError(event)'/>  
                  </div>
                  <div class="sceneSpotCard_body">    
                  <div class="numIcon"><p>${i + 1}</p></div>
                    <h5 class="sceneName">${item.RestaurantName}</h5>
                  </div>
                </a>
              </div>`;
    //卡片下塊高度: 126px  //270:316 = 8.5:10
    // onerror='imageError(event)'
  });
  itemInfo_section.innerHTML = str;
}

function imageError(e) {
  console.log((e.target.src = "image/food_notFound2.jpg"));
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
  // L.marker([lat, lon]).addTo(map);   //第一筆的marker

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
      html: `<div class='iconNum' data-id ='${item.RestaurantID}'>${
        i + 1
      }</div>`,
      className: "myIcon",
    });

    let lat = item.Position.PositionLat;
    let lon = item.Position.PositionLon;
    L.marker([lat, lon], { icon: myIcon })
      // .bindPopup(
      //   `<div class="sceneSpotCard" >
      //             <a href="scenicSpotInfo.html?id=${item.ScenicSpotID}">
      //               <div class="img_div">
      //                 <img class="sceneImg" src="${item.Picture.PictureUrl1}" alt="${item.ScenicSpotName}"/>
      //               </div>
      //               <div class="sceneSpotCard_body">
      //                 <h5 class="sceneName">${item.ScenicSpotName}</h5>
      //               </div>
      //             </a>
      //           </div>`
      // )
      .openPopup()
      .addTo(map);
  });

  // var myIcon = new L.Icon({
  //   iconUrl:
  //     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  //   shadowUrl:
  //     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  //   iconSize: [25, 41],
  //   iconAnchor: [12, 41],
  //   popupAnchor: [1, -34],
  //   shadowSize: [41, 41],
  // });

  //客製化Icon
  // var myIcon = L.divIcon({ className: "myIcon" });

  // L.marker([23.23451042175293, 120.0962905883789], { icon: myIcon }).addTo(map);
}

dropdownCity.addEventListener("change", (e) => {
  selectedCity = e.target.value;
  console.log(selectedCity);
  getItemData();
  location.href = `restaurants.html?id=${selectedCity}`;
});

function bindMarkers() {
  const markerPane = document.querySelector(".leaflet-marker-pane");
  const iconNums = markerPane.querySelectorAll(".iconNum");
  const sceneSpotCards = itemInfo_section.querySelectorAll(".sceneSpotCard");

  let selectedMarker;
  sceneSpotCards.forEach((item) => {
    // console.log(item);
    item.addEventListener("mouseover", (e) => {
      const location = item.dataset.loc;
      const lat = location.split(",")[0];
      const lon = location.split(",")[1];
      map.setView([lat, lon], 13); //調整中心點

      selectedMarker = item.getAttribute("data-id");
      // console.log(item);
      // console.log(selectedMarker);

      iconNums.forEach((item) => {
        if (item.dataset.id == selectedMarker) {
          // console.log(item);
          item.closest(".myIcon").classList.add("iconHover");
          item.closest(".myIcon").style.zIndex = "999";
        } else {
          item.closest(".myIcon").classList.remove("iconHover");
        }
      });
    });
  });

  //抓右邊Data的數字
  // itemInfo_section.querySelectorAll(".sceneSpotCard").forEach((item) => {
  //   console.log(item.querySelector(".numIcon p"));
  // });
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
