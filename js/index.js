const sceneSpotPic = document.querySelectorAll(".sceneSpotPic");

// 全台縣市 List
const cityAll = [
  "Taipei",
  "NewTaipei",
  "Taoyuan",
  "Taichung",
  "Tainan",
  "Kaohsiung",
  "Keelung",
  "Hsinchu",
  "HsinchuCounty",
  "MiaoliCounty",
  "ChanghuaCounty",
  "NantouCounty",
  "YunlinCounty",
  "ChiayiCounty",
  "Chiayi",
  "PingtungCounty",
  "YilanCounty",
  "HualienCounty",
  "TaitungCounty",
  "KinmenCounty",
  "PenghuCounty",
  "LienchiangCounty",
];

function init() {
  getSpotList();
  getFoodList();
}
init();

// 取得熱門景點資料
let topicListAll = [];

function getSpotList() {
  cityAll.forEach((city) => {
    axios({
      method: "get",
      url: `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${city}?%24top=100&format=JSON`,
      headers: GetAuthorizationHeader(),
    })
      .then((res) => {
        let data = res.data;
        console.log(data);
        data.forEach((spot) => {
          let obj = {};

          if (
            spot.ScenicSpotName == "屏東縣排灣族雕刻館" || //C1-00102.jpg
            spot.ScenicSpotName == "中山公園" ||
            spot.Picture.PictureUrl1 == undefined ||
            spot.City == undefined
          ) {
            return;
          } else {
            obj.city = spot.City;
            obj.EngCity = city;
            obj.id = spot.ScenicSpotID;
            obj.position = spot.Position;
            obj.ScenicSpotName = spot.ScenicSpotName;
            obj.picUrl = spot.Picture.PictureUrl1; //到這裡
          }
          topicListAll.push(obj);
        });

        renderSpotList();
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

// 渲染熱門景點資料
function renderSpotList() {
  const sceneSpotPic_section = document.querySelector(".sceneSpotPic_section");
  let newStr;

  let city;
  topicListAll.forEach((item) => {
    if (item.picUrl != undefined && item.city != city) {
      console.log(item);
      let str = `<div class="sceneSpotPic" >
                  <a href="scenicSpotInfo.html?id=${item.id}&city=${item.EngCity}">
                    <div class="img_div">
                      <img class="sceneImg" src="${item.picUrl}" alt="${item.ScenicSpotName}" onerror='imageError(event)'/>   
                    </div>
                    <div class="sceneSpotPic_body">
                      <h5 class="sceneName">${item.ScenicSpotName}</h5>
                      <span class="sceneCity">${item.city}</span>
                    </div>
                  </a>
                </div>`;

      newStr += str;
      city = item.city;
    }
  });

  if (newStr.indexOf("undefined") != -1) {
    newStr = newStr.replace("undefined", "");
  }
  sceneSpotPic_section.innerHTML = newStr;
  slick();
}

function imageError(e) {
  if (e.target.closest(".sceneSpotPic")) {
    e.target.closest(".sceneSpotPic").style.display = "none";
  } else if (e.target.closest(".foodPic")) {
    e.target.closest(".foodPic").style.display = "none";
  }
}

// 滑動效果slick(): 熱門景點
function slick() {
  $(document).ready(function () {
    $(".sceneSpotPic_section").slick({
      // dots: true,
      arrows: true,
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      autoplay: true,
      autoplaySpeed: 2000,
      infinite: true,
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            // dots: true,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
          },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ],
    });
  });

  $(".sceneSpotPic_section")[0].slick.refresh();

  $(document).ready(function () {
    $(".popFoodPic_section").slick({
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      autoplay: true,
      autoplaySpeed: 2000,
      infinite: true,
      responsive: [
        {
          breakpoint: 1199,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            // dots: true,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: false,
          },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ],
    });
  });

  $(".popFoodPic_section")[0].slick.refresh();
}

let foodListAll = [];

// 取得人氣美食資料
function getFoodList() {
  cityAll.forEach((city) => {
    axios({
      method: "get",
      url: `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/${city}?%24top=100&format=JSON`,
      headers: GetAuthorizationHeader(),
    })
      .then((res) => {
        let data = res.data;
        console.log(data);
        data.forEach((food) => {
          let obj = {};
          //每個city的每個景點Data
          obj.city = food.City;
          obj.EngCity = city;
          obj.id = food.RestaurantID;
          obj.RestaurantName = food.RestaurantName;
          obj.picUrl = food.Picture.PictureUrl1; //到這裡

          foodListAll.push(obj);
        });

        console.log(foodListAll);
        renderFoodList();
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

// 渲染人氣美食資料
function renderFoodList() {
  const popFoodPic_section = document.querySelector(".popFoodPic_section");
  let newStr;
  let city;
  foodListAll.forEach((item) => {
    if (item.picUrl != undefined && item.city != city) {
      let str = `<div class="foodPic">
                  <a class="hoverCover" href="restaurantInfo.html?id=${item.id}&city=${item.EngCity}">
                    <h2 class="food_subtitle">${item.RestaurantName}</h2>
                  </a>
                  <img src="${item.picUrl}" alt="${item.RestaurantName}" onerror='imageError(event)'/>
                  
                </div>`;
      // console.log(str);

      newStr += str;
      city = item.city;
    }
  });
  if (newStr.indexOf("undefined") === -1) {
    return;
  } else {
    newStr = newStr.replace("undefined", ""); //除錯:刪掉textContent:undefined
  }
  popFoodPic_section.innerHTML = newStr;
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

var swiper = new Swiper(".swiper", {
  slidesPerView: "auto",
  centeredSlides: true,
  loop: true,
  spaceBetween: 100,
  autoplay: {
    delay: 3000, // 3秒切換一次
    stopOnLastSlide: false,
    disableOnInteraction: true,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  // grabCursor: true, // 游標為手掌
});
