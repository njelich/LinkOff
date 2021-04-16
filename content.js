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

  while (!success && attempts < 50) {
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
    if(res.learning) {hideOther("learning-top-courses");hideOther("pv-course-recommendations")} else {showOther("learning-top-courses");showOther("pv-course-recommendations")};
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

//Modified from https://gist.github.com/twhitacre/d4536183c22a2f5a8c7c427df04acc90
async function deleteMessages() {
  const container = document.querySelector('.msg-conversations-container ul');
  if (!container) {
    alert('No messages. Are you on the messaging page?');
    return;
  }

 /*
  let attempts = 0;
  let success = false;

  while (!success && attempts < 50) {
    await new Promise(resolve => {
      setTimeout(() => {
        console.log(container = document.querySelector('.msg-conversations-container ul'))
        if (container = document.querySelector('.msg-conversations-container ul')) {
          success = true
        }
        attempts = attempts + 1;
        resolve();
      }, 100*attempts*10);
    });
  }*/

  async function loadAllMessages() {
    return await new Promise((resolve) => {
      let height = 0;
      let attempts = 0;
      if (container) {
        const interval = setInterval(() => {
          const { scrollHeight } = container;
          if (scrollHeight > 20000) {
            clearInterval(interval);
            resolve();
          }
          if (scrollHeight === height) {
            if (attempts >= 3) {
              clearInterval(interval);
              resolve();
            } else {
              attempts++;
            }
          }
          height = scrollHeight;
          container.scrollTop = scrollHeight;
        }, 1000);
      } else {
        alert('The page too long to load. Please try again.');
      }
    });
  };
  await loadAllMessages();
  const labels = container.getElementsByTagName('label');
  for (let i = 0; i < labels.length; i++) {
    if (labels[i]) {
      labels[i].click();
    }
  }
  alert('Click the trash can icon at the top to delete all messages.');
};

// Click listener for deleting messages

chrome.runtime.onMessage.addListener(
  function(request, _) {
    if (request.wipeMessages) {
      deleteMessages();
    }
  }
);

// Storage listener

chrome.storage.onChanged.addListener((res, _) => {
  getStorageAndHide();
});

// Track url changes

window.addEventListener('hashchange', getStorageAndHide, false);

// On load

if (document.readyState != 'loading'){
  getStorageAndHide();
} else {
  document.addEventListener('DOMContentLoaded', getStorageAndHide);
}

 