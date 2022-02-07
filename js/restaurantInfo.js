const restaurantID = location.href.split("=")[1].split("&")[0];
const restaurantCity = location.href.split("=")[2];
const innerPage = document.querySelector(".container");
let map;

function init() {
  getRestaurantData();
  getLocation();
}

init();

function getRestaurantData() {
  axios
    .get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/${restaurantCity}?%24filter=contains(RestaurantID%2C%20'${restaurantID}')&%24top=10&%24format=JSON`,
      { header: GetAuthorizationHeader() }
    )
    .then((res) => {
      let restData = res.data;
      console.log(restData); //單一餐廳資料
      let str = "";
      restData.forEach((item) => {
        // 處理餐廳類別標籤字串
        let restClass = item.Class == undefined ? "" : `<li>${item.Class}</li>`;

        //處理圖片
        let picUrl =
          item.Picture.PictureUrl1 == undefined
            ? `image/food_notFound2.jpg`
            : `${item.Picture.PictureUrl1}`;

        let picDesc =
          item.Picture.PictureDescription1 == undefined
            ? `暫無提供圖片`
            : `${item.Picture.PictureDescription1}`;

        //處理網站字串
        let websiteStr =
          item.WebsiteUrl == undefined
            ? `<li><img src="image/website.svg" alt="" />暫無提供網站資訊</li>`
            : `<li><img src="image/website.svg" alt="" /><a href='${item.WebsiteUrl}' target='_blank'>${item.WebsiteUrl}</a></li>`;

        //經緯度
        let lat = item.Position.PositionLat;
        let lon = item.Position.PositionLon;

        // 到第93行，加上"附近景點"
        str += `<div class="container-nav"></div>
                <div class="container-body">
                    <div class="sceneSpot-card">
                    <div class="scenePic">
                        <img src="${picUrl}" alt="${picDesc}" />
                    </div>
                    <div class="sceneInfo" data-loc="${lat}, ${lon}">
                        <div class="sceneCity">${item.City}</div>
                        <ul class="sceneTags">
                            ${restClass}
                        </ul>
                        <h2 class="sceneTitle">${item.RestaurantName}</h2>
                        <ul class="sceneDetails">
                        <li>
                            <img src="image/clock.svg" alt="" />
                            <span>${item.OpenTime}</span>
                        </li>
                        <li>
                            <img src="image/phone.svg" alt="" />
                            <span>${item.Phone}</span>
                        </li>
                        <li>
                            <img src="image/locate.svg" alt="" />
                            <span><a href='https://www.google.com/maps/place/${lat}, ${lon}' target='_blank'>${item.Address}</a></span>
                        </li>
                          ${websiteStr}
                        </ul>
                    </div>
                    </div>
                    <div class="sceneSpot-desc">
                      <p>
                      ${item.Description}
                      </p>
                    </div>
                      <div id="map"></div>
                    </div>
                </div>
                <div class="container-footer">
                
                <h2 class="topicTitle">附近景點</h2>
                <div class="sceneSpotPic_section">
                  <div class="sceneSpotPic">
                    <a href="scenicSpotInfo.html?id=123456">
                      <div class="img_div">
                        <img
                          class="sceneImg"
                          src="image/beach2.jpg"
                          alt=""
                          onerror="imageError(event)"
                        />
                      </div>
                      <div class="sceneSpotPic_body">
                        <h5 class="sceneName">陽明山國家公園冷水坑_牛奶池</h5>
                        <span class="sceneCity">台北</span>
                      </div>
                    </a>
                  </div>
                  <div class="sceneSpotPic">
                    <a href="scenicSpotInfo.html?id=123456">
                      <div class="img_div">
                        <img
                          class="sceneImg"
                          src="image/beach2.jpg"
                          alt=""
                          onerror="imageError(event)"
                        />
                      </div>
                      <div class="sceneSpotPic_body">
                        <h5 class="sceneName">陽明山國家公園冷水坑_牛奶池</h5>
                        <span class="sceneCity">台北</span>
                      </div>
                    </a>
                  </div>
                  <div class="sceneSpotPic">
                    <a href="scenicSpotInfo.html?id=123456">
                      <div class="img_div">
                        <img
                          class="sceneImg"
                          src="image/beach2.jpg"
                          alt=""
                          onerror="imageError(event)"
                        />
                      </div>
                      <div class="sceneSpotPic_body">
                        <h5 class="sceneName">陽明山國家公園冷水坑_牛奶池</h5>
                        <span class="sceneCity">台北</span>
                      </div>
                    </a>
                  </div>
                  <div class="sceneSpotPic">
                    <a href="scenicSpotInfo.html?id=123456">
                      <div class="img_div">
                        <img
                          class="sceneImg"
                          src="image/beach2.jpg"
                          alt=""
                          onerror="imageError(event)"
                        />
                      </div>
                      <div class="sceneSpotPic_body">
                        <h5 class="sceneName">陽明山國家公園冷水坑_牛奶池</h5>
                        <span class="sceneCity">台北</span>
                      </div>
                    </a>
                  </div>
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
      });

      innerPage.innerHTML = str;
      getNearBySceneSpot(); // 要放單一景點位置
    });
}

//取得現在位置
function getLocation() {
  navigator.geolocation.getCurrentPosition(function (position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    // getNearBySceneSpot(latitude, longitude);   // 要放單一景點位置
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
