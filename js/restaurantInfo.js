const restaurantID = location.href.split("=")[1].split("&")[0];
const restaurantCity = location.href.split("=")[2];
const innerPage = document.querySelector(".container");
let map;

function init() {
  getRestaurantData();
}

init();

//單一餐廳資料
let restData;
function getRestaurantData() {
  axios
    .get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/${restaurantCity}?%24filter=contains(RestaurantID%2C%20'${restaurantID}')&%24top=60&%24format=JSON`,
      { header: GetAuthorizationHeader() }
    )
    .then((res) => {
      restData = res.data[0];
      let str = "";

      // 處理餐廳類別標籤字串
      let restClass =
        restData.Class == undefined ? "" : `<li>${restData.Class}</li>`;

      //處理圖片
      let picUrl =
        restData.Picture.PictureUrl1 == undefined
          ? `image/food_notFound2.jpg`
          : `${restData.Picture.PictureUrl1}`;

      let picDesc =
        restData.Picture.PictureDescription1 == undefined
          ? `暫無提供圖片`
          : `${restData.Picture.PictureDescription1}`;

      //處理網站字串
      let websiteStr =
        restData.WebsiteUrl == undefined
          ? `<li><img src="image/website.svg" alt="" />暫無提供網站資訊</li>`
          : `<li><img src="image/website.svg" alt="" /><a href='${restData.WebsiteUrl}' target='_blank'>${restData.WebsiteUrl}</a></li>`;

      //經緯度
      let lat = restData.Position.PositionLat;
      let lon = restData.Position.PositionLon;

      str += `<div class="container-nav"></div>
                <div class="container-body">
                    <div class="sceneSpot-card">
                    <div class="scenePic">
                        <img src="${picUrl}" alt="${picDesc}" />
                    </div>
                    <div class="sceneInfo" data-loc="${lat}, ${lon}">
                        <div class="sceneCity">${restData.City}</div>
                        <ul class="sceneTags">
                            ${restClass}
                        </ul>
                        <h2 class="sceneTitle">${restData.RestaurantName}</h2>
                        <ul class="sceneDetails">
                        <li>
                            <img src="image/clock.svg" alt="clock icon" />
                            <span>${restData.OpenTime}</span>
                        </li>
                        <li>
                            <img src="image/phone.svg" alt="phone icon" />
                            <span>${restData.Phone}</span>
                        </li>
                        <li>
                            <img src="image/locate.svg" alt="location icon" />
                            <span><a href='https://www.google.com/maps/place/${lat}, ${lon}' target='_blank'>${restData.Address}</a></span>
                        </li>
                          ${websiteStr}
                        </ul>
                    </div>
                    </div>
                    <div class="sceneSpot-desc">
                      <p>
                      ${restData.Description}
                      </p>
                    </div>
                      <div id="map"></div>
                    </div>
                </div>

                <div class="container-footer">
                  <h2 class="topicTitle">附近餐廳</h2>
                  <div class="sceneSpotPic_section nearbySceneSpot">

                  </div>
                  <div class="subscribeBox">
                    <p class="subscribeTitle">訂閱我們，獲得最在地的旅遊資訊！</p>
                    <p class="secondLine">每週六一封，不隨意打擾，且隨時可以取消</p>
                    <div class="email_subscribe">
                        <input
                        type="text"
                        name=""
                        id="email"
                        placeholder="輸入你的 Email"
                        />
                        <input type="button" name="" id="subscribe" value="訂閱" />
                    </div>
                  </div>

                    
                </div>`;

      innerPage.innerHTML = str;
      getLocation();
    })
    .catch((err) => {
      console.log(err.response.data);
      if (err.response.status == 429) {
        alert(`${err.response.data.message}! \nPlease try again tomorrow. ☺`);
      }
    });
}

//取得現在位置
function getLocation() {
  navigator.geolocation.getCurrentPosition(function (position) {
    let userNowlat = position.coords.latitude;
    let userNowlon = position.coords.longitude;
    getNearByRestaurant(userNowlat, userNowlon);
  });
}

//取得附近景點
let nearbyRestData;
function getNearByRestaurant(userNowlat, userNowlon) {
  //抓此景點經緯度
  const lat = restData.Position.PositionLat;
  const lon = restData.Position.PositionLon;
  axios
    .get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/${restaurantCity}?%24top=30&%24spatialFilter=nearby(${lat},${lon},1000)&%24format=JSON`,
      { header: GetAuthorizationHeader() }
    )
    .then((res) => {
      nearbyRestData = res.data;
      renderMap(lat, lon, userNowlat, userNowlon);
      renderNearBySceneSpot();
    })
    .catch((err) => {
      console.log(err.response);
      if (err.response.status == 429) {
        alert(`${err.response.data.message}! \nPlease try again tomorrow. ☺`);
      }
    });
}

// 載入地圖 note: (userNowlat, userNowlon) user位置待放
function renderMap(lat, lon, userNowlat, userNowlon) {
  // 初始化地圖
  if (map != undefined) {
    map.remove();
  }
  map = L.map("map").setView([lat, lon], 14);
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

  //該景點的marker
  var redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [29, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  let imgUrl;
  if (restData.Picture.PictureUrl1 == undefined) {
    imgUrl = "image/food_notFound2.jpg";
  } else {
    imgUrl = restData.Picture.PictureUrl1;
  }
  L.marker([lat, lon], { icon: redIcon })
    .addTo(map)
    .bindPopup(
      `<div class="sceneSpotPic" >
          <a href="#">
            <div class="img_div">
              <img class="sceneImg" src="${imgUrl}" alt="" onerror='imageError(event)'/> 
            </div>
            <div class="sceneSpotPic_body">
              <h5 class="sceneName">${restData.RestaurantName}</h5>
            </div>
          </a>
        </div>`
    )
    .openPopup();

  //附近餐廳marker
  nearbyRestData.splice(0, 1);
  nearbyRestData.forEach((item, i) => {
    let lat = item.Position.PositionLat;
    let lon = item.Position.PositionLon;

    var myIcon = L.divIcon({
      html: `<div class='iconNum' data-id ='${item.RestaurantID}'>${
        i + 1
      }</div>`,
      className: "myIcon",
      popupAnchor: [13, -10],
    });

    let imgUrl;
    if (item.Picture.PictureUrl1 == undefined) {
      imgUrl = "image/food_notFound2.jpg";
    } else {
      imgUrl = item.Picture.PictureUrl1;
    }

    L.marker([lat, lon], { icon: myIcon })
      .addTo(map)
      .bindPopup(
        `<div class="sceneSpotPic" >
            <a href="restaurantInfo.html?id=${item.RestaurantID}&city=${restaurantCity}">
              <div class="img_div">
                <img class="sceneImg" src="${imgUrl}" alt="" onerror='imageError(event)'/> 
                
              </div>
              <div class="sceneSpotPic_body">
                <h5 class="sceneName">${item.RestaurantName}</h5>
              </div>
            </a>
          </div>`
      );
  });
}

// render附近餐廳卡
function renderNearBySceneSpot() {
  const sceneSpotPic_section = document.querySelector(".sceneSpotPic_section");
  let str = "";
  nearbyRestData.splice(0, 4).forEach((item) => {
    let imgUrl;
    if (item.Picture.PictureUrl1 == undefined) {
      imgUrl = "image/food_notFound2.jpg";
    } else {
      imgUrl = item.Picture.PictureUrl1;
    }
    str += `<div class="sceneSpotPic">
              <a href="restaurantInfo.html?id=${item.RestaurantID}&city=${restaurantCity}">
                <div class="img_div">
                <img class="sceneImg" src="${imgUrl}" alt="${item.Picture.PictureDescription1}" onerror='imageError(event)'/> 
                </div>
                <div class="sceneSpotPic_body">
                  <h5 class="sceneName">${item.RestaurantName}</h5>
                  <span class="sceneCity">${item.City}</span>
                </div>
              </a>
            </div>
          `;
  });
  sceneSpotPic_section.innerHTML = str;
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
