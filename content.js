'use strict';

// Feed

async function hideFeed() {
  let attempts = 0;
  let success = false;

  while (!success && attempts < 50) {
    await new Promise(resolve => {
      console.log(attempts + "hideFeed" + className)
      setTimeout(() => {
        if (document.getElementsByClassName("artdeco-dropdown") && 
            document.getElementsByClassName("artdeco-dropdown")[1] && 
            document.getElementsByClassName("artdeco-dropdown")[1].nextElementSibling) {
              document.getElementsByClassName("artdeco-dropdown")[1].nextElementSibling.classList.add("hide")
              success = true
        }
        attempts = attempts + 1;
        resolve();
      }, 100*attempts*10);
    });
  }
}

async function showFeed() {
  let attempts = 0;
  let success = false;

  while (!success && attempts < 50) {
    await new Promise(resolve => {
      console.log(attempts + "showFeed" + className)
      setTimeout(() => {
        if (document.getElementsByClassName("artdeco-dropdown") && 
            document.getElementsByClassName("artdeco-dropdown")[1] && 
            document.getElementsByClassName("artdeco-dropdown")[1].nextElementSibling) {
              document.getElementsByClassName("artdeco-dropdown")[1].nextElementSibling.classList.remove("hide")
              success = true
        }
        attempts = attempts + 1;
        resolve();
      }, 100*attempts*10);
    });
  }
}

// Other elements

async function hideOther(className) {
  let attempts = 0;
  let success = false;

  while (!success && attempts < 5) {
    await new Promise(resolve => {
      setTimeout(() => {
        if (document.getElementsByClassName(className) && document.getElementsByClassName(className)[0]) {
          for (var i = 0; i < document.getElementsByClassName(className).length; i++) {
            document.getElementsByClassName(className)[i].classList.add("hide");
            success = true
          }
        }
        attempts = attempts + 1;
        resolve();
      }, 100*attempts*10);
    });
  }
}

async function showOther(className) {
  let attempts = 0;
  let success = false;

  while (!success && attempts < 50) {
    await new Promise(resolve => {
      setTimeout(() => {
        if (document.getElementsByClassName(className) && document.getElementsByClassName(className)[0]) {
          for (var i = 0; i < document.getElementsByClassName(className).length; i++) {
            document.getElementsByClassName(className)[i].classList.remove("hide");
            success = true
          }
        }
        attempts = attempts + 1;
        resolve();
      }, 100*attempts*10);
    });
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
    if (res.ads) {hideOther("ad-banner-container");}
      else {showOther("ad-banner-container");}
    //res.news ? hideOther("news-module") : showOther("news-module");
  } else {
    showFeed();
    showOther("learning-top-courses");
    showOther("ad-banner-container"); 
    showOther("ads-container");
    //showOther("news-module");
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

 