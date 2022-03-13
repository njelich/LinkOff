'use strict'

// Main function

let mode = 'hide'

async function doIt(res) {
  // Set Mode
  mode = res['gentle-mode'] ? 'dim' : 'hide'
  if (res['dark-mode']) {
    enableDarkTheme()
  } else {
    disableDarkTheme()
  }

  // Hide stuff
  if (res['main-toggle']) {
    //Feed
    if (res['hide-whole-feed']) {
      toggleFeed(true)
      hideOther('feeds')
      clearInterval(keywordInterval)
    } else {
      toggleFeed(false)
      showOther('feeds')
      clearInterval(keywordInterval)
      blockByKeywords(res)
    }
  } else {
    //Feed
    toggleFeed(false)
    showOther('feeds')
    clearInterval(keywordInterval)
  }
  //Toggle feed sorting order
  if (
    res['main-toggle'] &&
    res['sort-by-recent'] &&
    (window.location.href == 'https://www.linkedin.com/feed/' ||
      window.location.href == 'https://www.linkedin.com/')
  )
    sortByRecent()
  // Hide LinkedIn learning prompts and ads
  if (res['main-toggle'] && res['hide-linkedin-learning']) {
    hideOther('learning-top-courses')
    hideOther('pv-course-recommendations')
  } else {
    showOther('learning-top-courses')
    showOther('pv-course-recommendations')
  }
  // Hide ads across linkedin
  if (res['main-toggle'] && res['hide-advertisements']) {
    hideOther('ad-banner-container')
    hideOther('ad-banner-container artdeco-card')
    hideOther('ad-banner-container is-header-zone')
    hideOther('ads-container')
  } else {
    showOther('ad-banner-container')
    showOther('ad-banner-container artdeco-card')

    showOther('ad-banner-container is-header-zone')
    showOther('ads-container')
  }
  // Hide feed area community and follow panels
  if (res['main-toggle'] && res['hide-community-panel']) {
    hideOther('community-panel')
  } else {
    showOther('community-panel')
  }
  if (res['main-toggle'] && res['hide-follow-recommendations']) {
    hideOther('feed-follows-module')
  } else {
    showOther('feed-follows-module')
  }
  // Hide account building prompts
  if (res['main-toggle'] && res['hide-account-building']) {
    hideOther('mn-abi-form')

    hideOther('artdeco-card mb4 overflow-hidden ember-view')
  } else {
    showOther('mn-abi-form')
    showOther('artdeco-card mb4 overflow-hidden ember-view')
  }
  // Hide premium upsell prompts
  if (res['main-toggle'] && res['hide-premium']) {
    hideOther('premium-upsell-link', false)
    hideOther('gp-promo-embedded-card-three__card')
  } else {
    showOther('premium-upsell-link')
    showOther('gp-promo-embedded-card-three__card')
  }

  // Hide news
  if (res['main-toggle'] && res['hide-news']) {
    hideOther('news-module')
  } else {
    showOther('news-module')
  }
}

function getStorageAndDoIt() {
  chrome.storage.local.get(null, doIt)
}

// Add message selection button

let isListenerInstalled
chrome.runtime.onMessage.addListener(function (request) {
  if (request['on-message-page'] && !isListenerInstalled) {
    const menuContainer = document.querySelector(
      '.msg-conversations-container__dropdown-container > div'
    )

    const observer = new MutationObserver(function () {
      const menu = menuContainer.querySelector('ul')

      if (!menu || menu.children.length > 3) return

      const selectMenuItem = document.createElement('div')

      selectMenuItem.classList.add(
        'artdeco-dropdown__item',
        'artdeco-dropdown__item--is-dropdown',
        'ember-view'
      )
      selectMenuItem.textContent = 'Select all for deletion'

      selectMenuItem.onclick = function () {
        document
          .querySelector(
            '.msg-conversations-container__title-row button.artdeco-dropdown__trigger'
          )
          .click()
        selectMessagesForDeletion()
      }

      menu.appendChild(selectMenuItem)
    })

    observer.observe(menuContainer, {
      attributes: false,
      childList: true,
      subtree: false,
      characterData: false,
    })
  }
})

// Toggle feed

async function toggleFeed(shown) {
  let attempts = 0
  let success = false

  while (!success && attempts < 50) {
    await new Promise((resolve) => {
      setTimeout(() => {
        if (
          document.getElementsByClassName('artdeco-dropdown') &&
          document.getElementsByClassName('artdeco-dropdown')[1] &&
          document.getElementsByClassName('artdeco-dropdown')[1]
            .nextElementSibling
        ) {
          if (shown) {
            document
              .getElementsByClassName('artdeco-dropdown')[1]
              .nextElementSibling.classList.add('hide')
          } else {
            document
              .getElementsByClassName('artdeco-dropdown')[1]
              .nextElementSibling.classList.remove('hide', 'dim')
          }
          success = true
        }
        attempts = attempts + 1
        resolve()
      }, 100 + attempts * 10)
    })
  }
}

// Toggle arbitrary element

async function hideOther(className, showIcon = true) {
  const elements = await waitForClassName(className)
  for (let el of elements) el.classList.add(mode, showIcon && 'showIcon')
}

async function showOther(className) {
  const elements = await waitForClassName(className)
  for (let el of elements) el.classList.remove('hide', 'dim', 'showIcon')
}

// Block by keywords

let keywordInterval
let postCountPrompted = false

function blockByKeywords(res) {
  console.log('res', res)
  let keywords =
    res['feed-keywords'] == '' ? [] : res['feed-keywords'].split(',')
  if (res['hide-by-age'] !== 'disabled')
    keywords.push(
      { hour: 'h • ', day: 'd • ', week: 'w • ', month: 'mo • ' }[
        res['hide-by-age']
      ]
    )
  if (res['hide-polls']) keywords.push('poll')
  if (res['hide-videos'])
    keywords.push('id="vjs_video_', 'feed-shared-linkedin-video')
  if (res['hide-links']) keywords.push('https://lnkd.in/')
  if (res['hide-images']) keywords.push('class="feed-shared-image__image"')
  if (res['hide-promoted']) keywords.push('Promoted')
  if (res['hide-shared']) keywords.push('feed-shared-mini-update-v2')
  if (res['hide-followed']) keywords.push('following')
  if (res['hide-liked']) keywords.push('likes this', 'like this')
  if (res['hide-other-reactions'])
    keywords.push(
      'loves this',
      'finds this insightful',
      'celebrates this',
      'is curious about this'
    )
  if (res['hide-commented-on']) keywords.push('commented on this')
  if (res['hide-by-companies'])
    keywords.push('href="https://www.linkedin.com/company/')
  if (res['hide-by-people']) keywords.push('href="https://www.linkedin.com/in/')

  let posts

  if (keywords.length)
    keywordInterval = setInterval(() => {
      // Select posts which are not already hidden
      posts = document.querySelectorAll(
        '[data-id*="urn:li:activity"]:not([data-hidden])'
      )

      // Filter only if there are enough posts to load more
      if (posts.length > 10) {
        posts.forEach((post) => {
          if (
            keywords.some((keyword) => {
              return post.innerHTML.indexOf(keyword) !== -1
            })
          ) {
            post.classList.add(mode, 'showIcon')
            post.onclick = () => {
              post.classList.remove(mode, 'showIcon')
              post.dataset.hidden = false
            }

            // Add attribute to track already hidden posts
            post.dataset.hidden = true
          }
        })
      } else {
        if (!postCountPrompted) {
          postCountPrompted = true //Prompt only once when loading linkedin
          alert(
            'Scroll down to start blocking posts (LinkedIn needs at least 10 loaded to load new ones).\n\nTo disable this alert, toggle it under misc in LinkOff settings'
          )
        }
      }
    }, 100)
}

// Toggle sort by recent

async function sortByRecent() {
  const dropdownTrigger = await waitForSelector(
    'button[data-control-name="feed_sort_dropdown_trigger"]'
  )
  if (dropdownTrigger.textContent.includes('Top')) {
    dropdownTrigger.click()
    const recentOption = await waitForSelector(
      'div[data-control-name="feed_sort_toggle_chron"]'
    )
    recentOption.click()
  }
}

// Wait for selector implementation

async function waitForSelector(selector) {
  while (document.querySelector(selector) === null) {
    await new Promise((resolve) => {
      requestAnimationFrame(resolve)
    })
  }
  return document.querySelector(selector)
}

async function waitForClassName(className) {
  while (!document.getElementsByClassName(className).length) {
    await new Promise((resolve) => {
      requestAnimationFrame(resolve)
    })
  }
  return document.getElementsByClassName(className)
}

// Main functions

window.mobileCheck = function () {
  let check = false
  ;(function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      // eslint-disable-next-line no-useless-escape
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(
        a.substr(0, 4)
      )
    )
      check = true
  })(navigator.userAgent || navigator.vendor || window.opera)
  return check
}

//Taken from https://github.com/sweaver2112/LinkedIn-dark-theme-hack

const colors = `:root{--black:#000;--black-a90:rgba(0,0,0,0.9);--black-a75:rgba(0,0,0,0.75);--black-a60:rgba(0,0,0,0.6);--black-a45:rgba(0,0,0,0.45);--black-a30:rgba(0,0,0,0.3);--black-a15:rgba(0,0,0,0.15);--black-a12:rgba(0,0,0,0.12);--black-a08:rgba(0,0,0,0.08);--black-a04:rgba(0,0,0,0.04);--white:#fff;--white-a90:hsla(0,0%,100%,0.9);--white-a85:hsla(0,0%,100%,0.85);--white-a70:hsla(0,0%,100%,0.7);--white-a55:hsla(0,0%,100%,0.55);--white-a40:hsla(0,0%,100%,0.4);--white-a25:hsla(0,0%,100%,0.25);--white-a18:hsla(0,0%,100%,0.18);--white-a12:hsla(0,0%,100%,0.12);--white-a06:hsla(0,0%,100%,0.06);--blue-10:#f6fbff;--blue-20:#e8f3ff;--blue-30:#d0e8ff;--blue-40:#a8d4ff;--blue-50:#70b5f9;--blue-50-a20:rgba(112,181,249,0.2);--blue-50-a30:rgba(112,181,249,0.3);--blue-60:#378fe9;--blue-70:#0a66c2;--blue-80:#004182;--blue-90:#09223b;--cool-gray-10:#f9fafb;--cool-gray-20:#eef3f8;--cool-gray-30:#dce6f1;--cool-gray-40:#c0d1e2;--cool-gray-50:#9db3c8;--cool-gray-60:#788fa5;--cool-gray-70:#56687a;--cool-gray-80:#38434f;--cool-gray-90:#1d2226;--warm-gray-10:#fafaf9;--warm-gray-20:#f3f2ef;--warm-gray-30:#e9e5df;--warm-gray-40:#d6cec2;--warm-gray-50:#b9af9f;--warm-gray-60:#958b7b;--warm-gray-70:#6e6558;--warm-gray-80:#474139;--warm-gray-90:#211f1c;--warm-red-10:#fff9f7;--warm-red-20:#ffefea;--warm-red-30:#ffded5;--warm-red-40:#fdc2b1;--warm-red-50:#f5987e;--warm-red-60:#e16745;--warm-red-70:#b24020;--warm-red-80:#762812;--warm-red-90:#351a12;--teal-10:#eefdff;--teal-20:#d5f9fe;--teal-30:#aef0fa;--teal-40:#79deee;--teal-50:#44bfd3;--teal-50-a30:rgba(68,191,211,0.3);--teal-60:#2199ac;--teal-70:#13707e;--teal-80:#104952;--teal-90:#0e2428;--purple-10:#fcf9ff;--purple-20:#f7efff;--purple-30:#eedfff;--purple-40:#dec5fd;--purple-40-a15:rgba(222,197,253,0.15);--purple-50:#c79ef7;--purple-60:#a872e8;--purple-70:#8344cc;--purple-70-a15:rgba(131,68,204,0.15);--purple-80:#592099;--purple-90:#2c1349;--system-red-10:#fff9f9;--system-red-20:#ffeeef;--system-red-30:#ffddde;--system-red-40:#ffbfc1;--system-red-50:#fc9295;--system-red-60:#f55257;--system-red-70:#cc1016;--system-red-80:#8a0005;--system-red-90:#46080a;--system-green-10:#f0fdf7;--system-green-20:#dbf9eb;--system-green-30:#b6f2d6;--system-green-40:#7ce3b3;--system-green-50:#3ec786;--system-green-60:#13a05f;--system-green-70:#057642;--system-green-80:#004d2a;--system-green-90:#022716;--pink-10:#fff8ff;--pink-20:#ffedfe;--pink-30:#ffdafd;--pink-40:#fcb9f9;--pink-50:#f489ee;--pink-60:#dd51d6;--pink-70:#b11faa;--pink-80:#770c72;--pink-90:#3d0a3b;--amber-10:#fdfaf5;--amber-20:#fbf1e2;--amber-30:#fce2ba;--amber-40:#f8c77e;--amber-50:#e7a33e;--amber-60:#c37d16;--amber-70:#915907;--amber-80:#5d3b09;--amber-90:#2a1f0e;--copper-10:#fcfaf9;--copper-20:#fcf0ed;--copper-30:#fadfd8;--copper-40:#f2c5b8;--copper-50:#e0a191;--copper-60:#be7b6a;--copper-70:#8f5849;--copper-80:#5d392f;--copper-90:#2d1d19;--green-10:#f6fcf4;--green-20:#e3f9d8;--green-30:#c7f1b2;--green-40:#a5df89;--green-50:#7fc15e;--green-60:#5f9b41;--green-70:#44712e;--green-80:#2f4922;--green-90:#1b2416;--sage-10:#f8fbf6;--sage-20:#eaf6e4;--sage-30:#d7ebce;--sage-40:#bdd7b0;--sage-50:#9db88f;--sage-60:#7b9370;--sage-70:#5a6b51;--sage-80:#3a4535;--sage-90:#1e221c;--lime-10:#f9fce9;--lime-20:#eff8b9;--lime-30:#dfee89;--lime-40:#c6d957;--lime-50:#a6ba32;--lime-60:#83941f;--lime-70:#5f6c16;--lime-80:#3e4613;--lime-90:#20230f;--camo-10:#fafbf3;--camo-20:#f1f4e4;--camo-30:#e4e8cc;--camo-40:#cdd3ac;--camo-50:#aeb48a;--camo-60:#8a8f6c;--camo-70:#65684e;--camo-80:#414335;--camo-90:#21211d;--smoke-10:#f8fafb;--smoke-20:#edf3f4;--smoke-30:#dbe7e9;--smoke-40:#bfd3d6;--smoke-50:#a0b4b7;--smoke-60:#7d8f92;--smoke-70:#5b696b;--smoke-80:#3c4345;--smoke-90:#1f2122;--lavender-10:#fbf9fd;--lavender-20:#f4f1f9;--lavender-30:#eae2f3;--lavender-40:#d7cae7;--lavender-50:#bba9d1;--lavender-60:#9983b1;--lavender-70:#715e86;--lavender-80:#493d57;--lavender-90:#241f29;--mauve-10:#fcf9fc;--mauve-20:#f9eff8;--mauve-30:#f2e0f1;--mauve-40:#e5c6e3;--mauve-50:#cea2cc;--mauve-60:#ac7da9;--mauve-70:#80597e;--mauve-80:#523a51;--mauve-90:#271e27;--system-gray-10:#fafafa;--system-gray-20:#f2f2f2;--system-gray-30:#e5e5e5;--system-gray-40:#cfcfcf;--system-gray-50:#b0b0b0;--system-gray-60:#8c8c8c;--system-gray-70:#666;--system-gray-80:#424242;--system-gray-90:#212121;--system-orange-10:#fff9f6;--system-orange-20:#ffefe8;--system-orange-30:#ffdfd1;--system-orange-40:#ffc1a7;--system-orange-50:#ff9466;--system-orange-60:#eb6126;--system-orange-70:#b93a04;--system-orange-80:#792603;--system-orange-90:#351a0f;--transparent:transparent;--transparent-white:hsla(0,0%,100%,0);`
const addendum = `--color-background-brand-accent-4: var(--cool-gray-90);`

function enableDarkTheme() {
  const rand = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
  }
  const style = document.createElement('style')
  const shift255 = (num) => {
    return (parseInt(num) + rand(220, 255)) % 256
  }
  style.innerHTML = colors
    .replace(/100%|0%/g, (m) => {
      return m == '100%' ? '0%' : '100%'
    })
    .replace(/#000|#fff/g, (m) => {
      return m == '#fff' ? '#000' : '#fff'
    })
    .replace(/#([fe])(.)([fe])(.)([fe])(.)/g, `#1$21$41$6`)
    .replace(/\d+(?=,)/g, (m) => {
      return shift255(m)
    })
  style.innerHTML += addendum

  document.body.appendChild(style)
}

function disableDarkTheme() {
  const style = document.createElement('style')
  style.innerHTML = colors
  document.body.appendChild(style)
}

//Modified from https://gist.github.com/twhitacre/d4536183c22a2f5a8c7c427df04acc90
async function selectMessagesForDeletion() {
  const container = document.querySelector(
    '.msg-conversations-container__conversations-list'
  )

  if (!container) {
    alert(
      'No messages. Are you on the messaging page?\n\nIf not, please navigate to messaging using the LinkedIn navbar and then click the Select Messages for Deletion button again.'
    )
    return
  }

  async function loadAllMessages() {
    return await new Promise((resolve) => {
      let height = 0
      let attempts = 0
      if (container) {
        const interval = setInterval(() => {
          const { scrollHeight } = container
          if (scrollHeight > 20000) {
            clearInterval(interval)
            resolve()
          }
          if (scrollHeight === height) {
            if (attempts >= 3) {
              clearInterval(interval)
              resolve()
            } else {
              attempts++
            }
          }
          height = scrollHeight
          container.scrollTop = scrollHeight
        }, 1000)
      } else {
        alert('The page took too long to load. Please try again.')
      }
    })
  }
  await loadAllMessages()
  const labels = container.getElementsByTagName('label')
  for (let i = 0; i < labels.length; i++) {
    if (labels[i]) {
      labels[i].click()
    }
  }
  alert('Click the trash can icon at the top to delete all messages.')
}

// Storage listener

chrome.storage.onChanged.addListener(() => {
  getStorageAndDoIt()
})

// Track url changes

let lastUrl = window.location.href
setInterval(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href
    getStorageAndDoIt()
  }
}, 500)

// On load

if (document.readyState != 'loading') {
  getStorageAndDoIt()
} else {
  document.addEventListener('DOMContentLoaded', getStorageAndDoIt)
}
