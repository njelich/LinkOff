'use strict';

// Main function

function doIt(res) {
  if(res['main-toggle']) {
    //Feed
    if(res['hide-whole-feed']) {
      hideFeed();
      hideOther("feeds");
      clearInterval(keywordInterval);
    } else {
      showFeed();
      showOther("feeds");
      clearInterval(keywordInterval);
      blockByKeywords(res);
    }
  
  } else {
    //Feed
    showFeed();
    showOther("feeds");
    clearInterval(keywordInterval);

  }
  //Feed
  
    /*
    //hideOther("account-center-container");
    if (res.learning) {
      hideOther("learning-top-courses");
      hideOther("pv-course-recommendations")
    } else {
      showOther("learning-top-courses");
      showOther("pv-course-recommendations")
    };
    if (res.ads) { hideOther("ad-banner-container"); } else { showOther("ad-banner-container"); }
    //res.news ? hideOther("news-module") : showOther("news-module");*/
    /*
    showFeed();
    //showOther("feeds")
    //showOther("account-center-container");
    showOther("learning-top-courses");
    showOther("ad-banner-container");
    showOther("ads-container");
    //showOther("news-module");
    clearInterval(keywordInterval);*/
}

function getStorageAndDoIt() {
  chrome.storage.local.get(null, doIt);
}

// Actions listener

chrome.runtime.onMessage.addListener(
  function(request, _) {
    if(request['select-messages-for-deletion']) selectMessagesForDeletion();
  }
);

// Toggle feed

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
      }, 100 * attempts * 10);
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
      }, 100 * attempts * 10);
    });
  }
}

// Toggle arbitrary element

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
      }, 100 * attempts * 10);
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
      }, 100 * attempts * 10);
    });
  }
}

// Block by keywords

let keywordInterval;

function blockByKeywords(res) {
  console.log(res)
  let keywords = res.keywords == "" ? res.keywords.split(',') : []
  if(res['hide-polls']) keywords.push('Poll')
  if(res['hide-videos']) keywords.push('id="vjs_video_')
  if(res['hide-links']) keywords.push('https://lnkd.in/')
  if(res['hide-images']) keywords.push('class="feed-shared-image__container"')
  if(res['hide-promoted']) keywords.push('Promoted')
  if(res['hide-shared']) keywords.push('feed-shared-mini-update-v2')
  if(res['hide-followed']) keywords.push('following')
  if(res['hide-reacted']) keywords.push('likes this', 'loves this', 'finds this insightful', 'celebrates this', 'is curious about this')
  if(res['hide-commented']) keywords.push('commented on this')
  if(res['hide-by-companies']) keywords.push('href="https://www.linkedin.com/company/')
  if(res['hide-by-people']) keywords.push('href="https://www.linkedin.com/in/')

  let posts;

  if(keywords.length) keywordInterval = setInterval(() => {
    posts = Array.prototype.filter.call(document.querySelectorAll('div.relative.ember-view'), function(el) {
      return el.classList[2] == null;
    });

    // Filter only if there are enough posts to load more
    if (posts.length >= 6) {
      posts.forEach(post => {
        if(keywords.some(keyword => {
          return post.innerHTML.indexOf(keyword) !== -1
        })) post.classList.add("hide");
      });
    }

  }, 100);
};

// Main functions

window.mobileCheck = function() {
  let check = false;
  (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

function hideAll(res) {
  if (res.master) {
    //hideOther("account-center-container");
    if (res.feed) {
      hideFeed();
      hideOther("feeds");
      clearInterval(keywordInterval);
    } else {
      showFeed();
      showOther("feeds");
      blockByKeywords();
    };
    if (res.learning) {
      hideOther("learning-top-courses");
      hideOther("pv-course-recommendations")
    } else {
      showOther("learning-top-courses");
      showOther("pv-course-recommendations")
    };
    if (res.ads) { hideOther("ad-banner-container"); } else { showOther("ad-banner-container"); }
    //res.news ? hideOther("news-module") : showOther("news-module");
  } else {
    showFeed();
    //showOther("feeds")
    //showOther("account-center-container");
    showOther("learning-top-courses");
    showOther("ad-banner-container");
    showOther("ads-container");
    //showOther("news-module");
    clearInterval(keywordInterval);
  }
}

//Modified from https://gist.github.com/twhitacre/d4536183c22a2f5a8c7c427df04acc90
async function selectMessagesForDeletion() {
  const container = document.querySelector('.msg-conversations-container ul');
  if (!container) {
    alert("No messages. Are you on the messaging page?\n\nIf not, please navigate to messaging using the LinkedIn navbar and then click the Select Messages for Deletion button again."); 
    return;
  }
  

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

// Storage listener

chrome.storage.onChanged.addListener((res, _) => {
  getStorageAndDoIt();
});

// Track url changes

let lastUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    getStorageAndDoIt()
  }
}, 500)

// On load

if (document.readyState != 'loading') {
  getStorageAndDoIt();
} else {
  document.addEventListener('DOMContentLoaded', getStorageAndDoIt);
}