import {
  BY_COMPANIES_KEYWORD,
  BY_PEOPLE_KEYWORD,
  CAROUSEL_SELECTOR,
  COMMENTED_ON_KEYWORD,
  DROPDOWN_TRIGGER_SELECTOR,
  FEED_SELECTOR,
  FOLLOWED_KEYWORD,
  IMAGE_SELECTOR,
  LIKED_KEYWORDS,
  LINKS_KEYWORD,
  OTHER_REACTIONS_KEYWORDS,
  POLLS_KEYWORD,
  POST_SELECTOR,
  PROMOTED_KEYWORD,
  RECENT_OPTION_SELECTOR,
  SHARED_KEYWORD,
  SUGGESTED_KEYWORD,
  VIDEO_SELECTOR,
} from '../constants.js'
import {
  getCustomSelector,
  hideAncestorByChildSelector,
  resetBlockedPosts,
  resetShownPosts,
  showAncestorByChildSelector,
  waitForSelector,
} from '../utils.js'

let runs = 0
let feedKeywordInterval
let postCountPrompted = false
let feedKeywords = []
let oldFeedKeywords = []

const handleSortByRecent = async (checkNeedUpdate) => {
  if (!checkNeedUpdate('sort-by-recent', true)) return

  if (
    window.location.href !== 'https://www.linkedin.com/feed/' &&
    window.location.href !== 'https://www.linkedin.com/'
  )
    return

  const dropdownTrigger = await waitForSelector(DROPDOWN_TRIGGER_SELECTOR)

  dropdownTrigger.click()

  const recentOption = await waitForSelector(RECENT_OPTION_SELECTOR)

  recentOption.click()
}

const handleAgeFiltering = (keywords, age) => {
  const ageKeywords = {
    hour: 'h •',
    day: 'd •',
    week: 'w •',
    month: 'mo •',
    year: 'y •',
  }

  const hideByHour = (shouldLoop = true) => {
    if (shouldLoop) {
      for (let x = 2; x <= 24; x++) {
        keywords.push(`${x}${ageKeywords.hour}`)
      }
    } else {
      keywords.push(`${ageKeywords.hour}`)
    }

    hideByDay(false)
  }

  const hideByDay = (shouldLoop) => {
    if (shouldLoop) {
      for (let x = 2; x <= 30; x++) {
        keywords.push(`${x}${ageKeywords.day}`)
      }
    } else {
      keywords.push(`${ageKeywords.day}`)
    }

    hideByWeek(false)
  }

  const hideByWeek = (shouldLoop) => {
    if (shouldLoop) {
      for (let x = 2; x <= 4; x++) {
        keywords.push(`${x}${ageKeywords.week}`)
      }
    } else {
      keywords.push(`${ageKeywords.week}`)
    }

    hideByMonth(false)
  }

  const hideByMonth = (shouldLoop) => {
    if (shouldLoop) {
      for (let x = 2; x <= 12; x++) {
        keywords.push(`${x}${ageKeywords.month}`)
      }
    } else {
      keywords.push(`${ageKeywords.month}`)
    }
    hideByYear(false)
  }

  const hideByYear = (shouldLoop) => {
    if (shouldLoop) {
      for (let x = 2; x <= 5; x++) {
        keywords.push(`${x}${ageKeywords.year}`)
      }
    } else {
      keywords.push(`${ageKeywords.year}`)
    }
  }

  switch (age) {
    case 'hour':
      hideByHour(keywords)
      break

    case 'day':
      hideByDay(keywords)
      break

    case 'week':
      hideByWeek(keywords)
      break

    case 'month':
      hideByMonth(keywords)
      break

    case 'year':
      hideByYear(keywords)
      break
  }
}

const handleVideos = (checkNeedUpdate, mode) => {
  if (checkNeedUpdate('hide-videos', true)) {
    hideAncestorByChildSelector(VIDEO_SELECTOR, POST_SELECTOR, mode)
  } else if (checkNeedUpdate('hide-videos', false)) {
    showAncestorByChildSelector(VIDEO_SELECTOR, POST_SELECTOR, mode)
  }
}

const handleImages = (checkNeedUpdate, mode) => {
  if (checkNeedUpdate('hide-images', true)) {
    hideAncestorByChildSelector(IMAGE_SELECTOR, POST_SELECTOR, mode)
  } else if (checkNeedUpdate('hide-images', false)) {
    showAncestorByChildSelector(IMAGE_SELECTOR, POST_SELECTOR, mode)
  }
}

const handleCarousels = (checkNeedUpdate, mode) => {
  if (checkNeedUpdate('hide-carousels', true)) {
    hideAncestorByChildSelector(CAROUSEL_SELECTOR, POST_SELECTOR, mode)
  } else if (checkNeedUpdate('hide-carousels', false)) {
    showAncestorByChildSelector(CAROUSEL_SELECTOR, POST_SELECTOR, mode)
  }
}

const getFeedKeywords = (config) => {
  const keywords =
    config['feed-keywords'] === '' ? [] : config['feed-keywords'].split(',')

  const hideByAge = config['hide-by-age']

  if (hideByAge !== 'disabled') {
    handleAgeFiltering(keywords, hideByAge)
  }

  if (config['hide-polls']) keywords.push(POLLS_KEYWORD)
  if (config['hide-links']) keywords.push(LINKS_KEYWORD)
  if (config['hide-promoted']) keywords.push(PROMOTED_KEYWORD)
  if (config['hide-shared']) keywords.push(SHARED_KEYWORD)
  if (config['hide-followed']) keywords.push(FOLLOWED_KEYWORD)
  if (config['hide-liked']) keywords.push(...LIKED_KEYWORDS)
  if (config['hide-other-reactions']) keywords.push(...OTHER_REACTIONS_KEYWORDS)
  if (config['hide-commented-on']) keywords.push(COMMENTED_ON_KEYWORD)
  if (config['hide-by-companies']) keywords.push(BY_COMPANIES_KEYWORD)
  if (config['hide-by-people']) keywords.push(BY_PEOPLE_KEYWORD)
  if (config['hide-suggested']) keywords.push(SUGGESTED_KEYWORD)

  console.log('LinkOff: Current feed keywords are', keywords)

  return keywords
}

const hidePost = (post, mode) => {
  post.classList.add(mode, 'showIcon')

  post.onclick = () => {
    post.classList.remove('hide', 'dim', 'showIcon')
    post.dataset.hidden = 'shown'
  }

  // Add attribute to track already hidden posts
  post.dataset.hidden = true
}

const blockPostsByKeywords = (keywords, mode, disablePostCount) => {
  if (oldFeedKeywords.some((kw) => !keywords.includes(kw))) {
    resetShownPosts()
  }

  oldFeedKeywords = keywords

  let posts

  if (keywords.length)
    feedKeywordInterval = setInterval(() => {
      if (runs % 10 === 0) resetBlockedPosts()
      // Select posts which are not already hidden
      posts = document.querySelectorAll(
        getCustomSelector(POST_SELECTOR, 'pristine')
      )

      // Filter only if there are enough posts to load more
      if (posts.length > 5 || mode == 'dim') {
        posts.forEach((post) => {
          const keywordIndex = keywords.findIndex(
            (keyword) => post.innerText.indexOf(keyword) !== -1
          )

          if (keywordIndex === -1) {
            post.classList.remove('hide', 'dim', 'showIcon')
            post.dataset.hidden = false
          } else {
            hidePost(post, mode)
          }
        })
      } else {
        if (!postCountPrompted && !disablePostCount) {
          postCountPrompted = true
          alert(
            'Scroll down to start blocking posts (LinkedIn needs at least 10 loaded to load new ones).\n\nTo disable this alert, toggle it under misc in LinkOff settings'
          )
        }
      }

      runs++
    }, 350)
}

const toggleFeed = async (shown) => {
  if (window.location.href != 'https://www.linkedin.com/feed/') return

  if (shown) {
    document.querySelector(FEED_SELECTOR).classList.remove('hide')
    console.log(`LinkOff: feed enabled`)
  } else {
    document.querySelector(FEED_SELECTOR).classList.add('hide')
    console.log(`LinkOff: feed disabled`)
  }
}

const handleToggledOff = () => {
  toggleFeed(true)

  clearInterval(feedKeywordInterval)
  resetBlockedPosts()
  resetShownPosts()
}

const handleHideWholeFeed = () => {
  toggleFeed(false)
  resetBlockedPosts()
  clearInterval(feedKeywordInterval)
}

const handleFilterFeed = (mode, config) => {
  toggleFeed(true)

  resetBlockedPosts()
  clearInterval(feedKeywordInterval)
  blockPostsByKeywords(feedKeywords, mode, config['disable-postcount-prompt'])
}

export default (checkNeedUpdate, enabled, mode, config) => {
  if (checkNeedUpdate('main-toggle', false)) {
    handleToggledOff()

    return
  }

  if (checkNeedUpdate('hide-whole-feed', true)) {
    handleHideWholeFeed()
    return
  }

  if (!enabled) return

  handleSortByRecent(checkNeedUpdate)
  handleVideos(checkNeedUpdate, mode)
  handleImages(checkNeedUpdate, mode)
  handleCarousels(checkNeedUpdate, mode)

  feedKeywords = getFeedKeywords(config)

  if (feedKeywords !== oldFeedKeywords) {
    handleFilterFeed(mode, config)
  }
}
