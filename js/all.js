const switch_color = document.querySelector(".switch_color");
const sliderBtn = document.querySelector(".sliderBtn");
const dayBtn = document.querySelector(".sun");
const nightBtn = document.querySelector(".moon");
const slider_day = document.querySelector(".slider_day");
const body = document.querySelector("body");
const sliderBar = document.querySelector(".js-sliderBar");

const word_LOGO = document.querySelector(".js-word_LOGO");
const nav_link = document.querySelectorAll(".nav_menu a");
const TW_logo = document.querySelector(".TW_logo");
const magnifier = document.querySelector(".searchDiv img");
const topic_link = document.querySelector(".topic_link");
const footer = document.querySelector(".footer");
const Taiwan_footer = document.querySelector(".Taiwan_footer");
const header = document.querySelector(".header");

function changeLayout() {
  sliderBtn.addEventListener("click", function (e) {
    if (body.classList.contains("black_page")) {
      body.setAttribute("class", "white_page");
      slider_day.setAttribute("class", "slider_day");
      word_LOGO.setAttribute("class", "TW_travel_day");
      nav_link.forEach((item) => {
        item.setAttribute("class", "nav_link_day");
      });
      TW_logo.setAttribute("src", "image/TW_logo.svg");
      magnifier.setAttribute("src", "image/magnifier.svg");
      nightBtn.setAttribute("src", "image/moon.svg");
      dayBtn.setAttribute("src", "image/sun.svg");
      sliderBar.setAttribute("src", "image/Rectangle.svg");

      topic_link.classList.remove("color_darkPage");
      footer.classList.remove("bgColor_darkPage");
      Taiwan_footer.style.color = "#9086CC";
      header.style.borderBottom = "1px solid rgba(0, 0, 0, 0.2)";
      sceneSpotPic.forEach((item) => {
        item.style.boxShadow = "3px 3px 10px lightgrey;";
        item.querySelector(".sceneName").style.color = "#392a93";
      });
    } else {
      body.setAttribute("class", "black_page");
      slider_day.setAttribute("class", "slider_night");
      word_LOGO.setAttribute("class", "TW_travel_night");
      nav_link.forEach((item) => {
        item.setAttribute("class", "nav_link_night");
      });
      TW_logo.setAttribute("src", "image/TW_logo_darkPage.svg");
      magnifier.setAttribute("src", "image/magnifier_darkPage.svg");
      dayBtn.setAttribute("src", "image/sun_darkPage.svg");
      nightBtn.setAttribute("src", "image/Moon_darkPage.svg");
      sliderBar.setAttribute("src", "image/Rectangle_darkPage.svg");

      topic_link.classList.add("color_darkPage");
      footer.classList.add("bgColor_darkPage");
      Taiwan_footer.style.color = "#A9D3FF";
      header.style.borderBottom = "1px solid rgba(234, 234, 234, 0.2)";
      sceneSpotPic.forEach((item) => {
        item.style.boxShadow = "1px 1px 4px #878080";
        item.querySelector(".sceneName").style.color = "#CFCFCF";
      });
    }
  });

  dayBtn.addEventListener("click", function (e) {
    body.setAttribute("class", "white_page");
    slider_day.setAttribute("class", "slider_day");
    word_LOGO.setAttribute("class", "TW_travel_day");
    nav_link.forEach((item) => {
      item.setAttribute("class", "nav_link_day");
    });
    TW_logo.setAttribute("src", "image/TW_logo.svg");
    magnifier.setAttribute("src", "image/magnifier.svg");
    nightBtn.setAttribute("src", "image/moon.svg");
    e.target.setAttribute("src", "image/sun.svg");
    sliderBar.setAttribute("src", "image/Rectangle.svg");

    topic_link.classList.remove("color_darkPage");
    footer.classList.remove("bgColor_darkPage");
    Taiwan_footer.style.color = "#9086CC";
    header.style.borderBottom = "1px solid rgba(0, 0, 0, 0.2)";
    sceneSpotPic.forEach((item) => {
      item.style.boxShadow = "3px 3px 10px lightgrey;";
      item.querySelector(".sceneName").style.color = "#392a93";
    });
  });

  nightBtn.addEventListener("click", function (e) {
    body.setAttribute("class", "black_page");
    slider_day.setAttribute("class", "slider_night");
    word_LOGO.setAttribute("class", "TW_travel_night");
    nav_link.forEach((item) => {
      item.setAttribute("class", "nav_link_night");
    });
    TW_logo.setAttribute("src", "image/TW_logo_darkPage.svg");
    magnifier.setAttribute("src", "image/magnifier_darkPage.svg");
    dayBtn.setAttribute("src", "image/sun_darkPage.svg");
    e.target.setAttribute("src", "image/Moon_darkPage.svg");
    sliderBar.setAttribute("src", "image/Rectangle_darkPage.svg");

    topic_link.classList.add("color_darkPage");
    footer.classList.add("bgColor_darkPage");
    Taiwan_footer.style.color = "#A9D3FF";
    header.style.borderBottom = "1px solid rgba(234, 234, 234, 0.2)";
    sceneSpotPic.forEach((item) => {
      item.style.boxShadow = "1px 1px 4px #878080";
      item.querySelector(".sceneName").style.color = "#CFCFCF";
    });
  });
}

changeLayout(); // 黑白樣式轉換
