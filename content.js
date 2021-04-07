'use strict';

// Feed

function hideFeed() {
  if (document.getElementsByClassName("artdeco-dropdown") && 
      document.getElementsByClassName("artdeco-dropdown")[1] && 
      document.getElementsByClassName("artdeco-dropdown")[1].nextElementSibling) {
      return document.getElementsByClassName("artdeco-dropdown")[1].nextElementSibling.classList.add("hide")
  }
}

function showFeed() {
  if (document.getElementsByClassName("artdeco-dropdown") && 
      document.getElementsByClassName("artdeco-dropdown")[1] && 
      document.getElementsByClassName("artdeco-dropdown")[1].nextElementSibling) {
      return document.getElementsByClassName("artdeco-dropdown")[1].nextElementSibling.classList.remove("hide")
  }
}

// Other elements

async function hideOther(className) {
  if (document.getElementsByClassName(className) && document.getElementsByClassName(className)[0]) {
    for (var i = 0; i < document.getElementsByClassName(className).length; i++) {
      document.getElementsByClassName(className)[i].classList.add("hide");
    }
  }
}

async function showOther(className) {
  if (document.getElementsByClassName(className) && document.getElementsByClassName(className)[0]) {
    for (var i = 0; i < document.getElementsByClassName(className).length; i++) {
      document.getElementsByClassName(className)[i].classList.remove("hide");
    }
  }
}


// Block by keywords

var keywordInterval;



function blockByKeywords() {
  chrome.storage.local.get('keywords', function(res) {
    if (res?.keywords) {
      let keywords = res.keywords.split(',');
      if (keywords.length > 0) {
        keywordInterval = setInterval(function() {
          let postCount = 0;
          const posts = Array.prototype.filter.call(document.querySelectorAll('div.relative.ember-view'), function(el) {
            return el.classList[2] == null;
          });
          console.log(posts)
          posts.forEach(element => {
            console.log(element)
            let blocked = false;
            for (keyword in keywords) {
              if (keywords.length && el.html().includes(keywords[i])) {
                blocked = true;
                el.classList.add("hide");
                break;
              }
            }
            if (!blocked) {
              postCount++;
            }
          });

          if (postCount < 12) {
            posts.last().classList.remove("hide");;
            postCount++;
          }
          if (postCount < 12) {
            posts.first().classList.remove("hide");;
            postCount++;
          }

        }, 1000);
      }
    }

  });
};

// Main functions

function hideAll (res) {
  if(res.master) {
    if (res.feed) {hideFeed();} else {showFeed();/*blockByKeywords();*/};
    res.learning ?  hideOther("learning-top-courses") : showOther("learning-top-courses");
    if (res.ads) {hideOther("ad-banner-container"); hideOther("ads-container");}
      else {showOther("ad-banner-container"); showOther("ads-container");}
    res.news ? hideOther("news-module") : showOther("news-module");
  } else {
    showFeed();
    showOther("learning-top-courses");
    showOther("ad-banner-container"); 
    showOther("ads-container");
    showOther("news-module");
    //clearInterval(keywordInterval);
  }
}

function getStorageAndHide () {
  chrome.storage.local.get(['master', 'feed', 'learning', 'ads', 'news'], hideAll);
}

// Storage listener

chrome.storage.onChanged.addListener((res, _) => {
  getStorageAndHide();
});

// On change

let url = window.location.href; 
setInterval(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    getStorageAndHide()
  }
}, 500)

// On load

if (document.readyState != 'loading'){
  getStorageAndHide();
} else {
  document.addEventListener('DOMContentLoaded', getStorageAndHide);
}





 