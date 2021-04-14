'use strict';

// Feed

async function hideFeed() {
  let attempts = 0;
  let success = false;

  while (!success && attempts < 50) {
    await new Promise(resolve => {
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

let keywordInterval;

function blockByKeywords() {
  chrome.storage.local.get('keywords', function(res) {
    if (res?.keywords !== "") {
      let keywords = res.keywords.split(',');
      let posts, blockedPosts, postCount = 0;

      keywordInterval = setInterval(() => {

        posts = Array.prototype.filter.call(document.querySelectorAll('div.relative.ember-view'), function(el) {
          return el.classList[2] == 'hide' || el.classList[2] == null;
        });

        blockedPosts = Array.prototype.filter.call(posts, function(el) {
          return el.classList[2] == 'hide';
        });

        // Filter only if there are enough posts to load more
        postCount = posts.length - blockedPosts.length;
        if( postCount >= 6) {
          posts.forEach(post => {
            let blocked = false;
            keywords.forEach(keyword => {
              if(post.innerHTML.indexOf(keyword) !== -1) {
                blocked = true;
                post.classList.add("hide");
              }
            });
          });
        }

      }, 200);
    }
  });
};

// Main functions

function hideAll (res) {
  if(res.master) {
    if (res.feed) {hideFeed(); clearInterval(keywordInterval);} else {showFeed(); blockByKeywords();};
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
    clearInterval(keywordInterval);
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

 