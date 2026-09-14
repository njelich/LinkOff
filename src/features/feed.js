import {
  BY_COMPANIES_KEYWORD,
  BY_PEOPLE_KEYWORD,
  CAROUSEL_KEYWORD,
  COMMENTED_HEADER_KEYWORD,
  DROPDOWN_TRIGGER_SELECTOR,
  FEED_SELECTOR,
  FOLLOWED_KEYWORD,
  IMAGE_KEYWORD,
  LIKED_KEYWORDS,
  LINKS_KEYWORD,
  OTHER_REACTIONS_KEYWORDS,
  POLLS_KEYWORD,
  POST_SELECTOR,
  PROMOTED_KEYWORD,
  RECENT_OPTION_SELECTOR,
  SHARED_KEYWORD,
  SUGGESTED_KEYWORD,
  VIDEO_KEYWORD,
} from '../constants.js'
import {
  getCustomSelector,
  hidePost,
  parseKeywords,
  removeHideClasses,
  resetBlockedPosts,
  resetShownPosts,
  waitForSelector,
} from '../utils.js'

let runs = 0
let feedInterval
let postCountPrompted = false
let feedKeywords = { keywords: [], headerKeywords: [] }
let oldFeedKeywords = []

const isFeedPage = () => window.location.pathname.startsWith('/feed/')

const handleSortByRecent = async (checkNeedUpdate) => {
  if (!checkNeedUpdate('sort-by-recent', true)) return

  if (!isFeedPage()) return

  const dropdownTrigger = await waitForSelector(DROPDOWN_TRIGGER_SELECTOR)

  dropdownTrigger?.click()

  const recentOption = await waitForSelector(RECENT_OPTION_SELECTOR)

  recentOption?.click()
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

const getFeedKeywords = (config) => {
  const keywords = parseKeywords(config['feed-keywords'])

  const hideByAge = config['hide-by-age']

  if (hideByAge !== 'disabled') {
    handleAgeFiltering(keywords, hideByAge)
  }

  if (config['hide-carousels']) keywords.push(CAROUSEL_KEYWORD)
  if (config['hide-videos']) keywords.push(VIDEO_KEYWORD)
  if (config['hide-images']) keywords.push(IMAGE_KEYWORD)
  if (config['hide-polls']) keywords.push(POLLS_KEYWORD)
  if (config['hide-links']) keywords.push(LINKS_KEYWORD)
  if (config['hide-promoted']) keywords.push(PROMOTED_KEYWORD)
  if (config['hide-shared']) keywords.push(SHARED_KEYWORD)
  if (config['hide-followed']) keywords.push(FOLLOWED_KEYWORD)
  if (config['hide-liked']) keywords.push(...LIKED_KEYWORDS)
  if (config['hide-other-reactions']) keywords.push(...OTHER_REACTIONS_KEYWORDS)
  if (config['hide-by-companies']) keywords.push(BY_COMPANIES_KEYWORD)
  if (config['hide-by-people']) keywords.push(BY_PEOPLE_KEYWORD)
  if (config['hide-suggested']) keywords.push(SUGGESTED_KEYWORD)

  const headerKeywords = []

  if (config['hide-commented-on']) headerKeywords.push(COMMENTED_HEADER_KEYWORD)

  console.log('LinkOff: Current feed keywords are', [
    ...keywords,
    ...headerKeywords,
  ])

  return { keywords, headerKeywords }
}

// LinkedIn wraps the social proof line in non-breaking spaces and React comment
// separators, which break plain substring matching on the raw markup.
const normalizeHtml = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/&(?:amp;)?nbsp;|&#160;|&#xa0;|\u00a0/gi, ' ')
    .replace(/\s+/g, ' ')

// The social proof line ("Tim Farmer commented") is the first rendered line of
// a post. Posts that are not rendered have no header and never match.
const getHeaderText = (post) => {
  const firstLine = (post.innerText || '')
    .split('\n')
    .find((line) => line.trim())

  return firstLine ? firstLine.replace(/\s+/g, ' ').trim().toLowerCase() : ''
}

const matchesHeader = (post, lowercaseKeywords) => {
  if (!lowercaseKeywords.length) return false

  const header = getHeaderText(post)

  return lowercaseKeywords.some((keyword) => header.indexOf(keyword) !== -1)
}

const blockPostsByKeywords = (
  { keywords, headerKeywords },
  mode,
  disablePostCount
) => {
  const allKeywords = [...keywords, ...headerKeywords]

  if (oldFeedKeywords.some((kw) => !allKeywords.includes(kw))) {
    resetShownPosts()
  }

  oldFeedKeywords = allKeywords

  const lowercaseHeaderKeywords = headerKeywords.map((keyword) =>
    keyword.toLowerCase()
  )

  let posts

  const runBlockPosts = () => {
    if (runs % 10 === 0) resetBlockedPosts()
    // Select posts which are not already hidden
    posts = document.querySelectorAll(
      getCustomSelector(POST_SELECTOR, 'pristine')
    )

    // Filter only if there are enough posts to load more
    if (posts.length > 5 || mode == 'dim') {
      posts.forEach((post) => {
        const html = normalizeHtml(post.outerHTML)

        const blocked =
          keywords.some((keyword) => html.indexOf(keyword) !== -1) ||
          matchesHeader(post, lowercaseHeaderKeywords)

        if (blocked) {
          hidePost(post, mode)
        } else {
          removeHideClasses(post)
          post.dataset.hidden = false
        }
      })
    } else if (!postCountPrompted && !disablePostCount && isFeedPage()) {
      postCountPrompted = true
      alert(
        'Scroll down to start blocking posts (LinkedIn needs at least 10 loaded to load new ones).\n\nTo disable this alert, toggle it under misc in LinkOff settings'
      )
    }
  }

  if (allKeywords.length)
    feedInterval = setInterval(() => {
      runBlockPosts()
      runs++
    }, 350)
}

const toggleFeed = (shown) => {
  if (!isFeedPage()) return

  if (shown) {
    document.querySelector(FEED_SELECTOR)?.classList.remove('hide')
    console.log(`LinkOff: feed enabled`)
  } else {
    document.querySelector(FEED_SELECTOR)?.classList.add('hide')
    console.log(`LinkOff: feed disabled`)
  }
}

const handleToggledOff = () => {
  toggleFeed(true)

  clearInterval(feedInterval)
  resetBlockedPosts()
  resetShownPosts()
}

const handleHideWholeFeed = () => {
  toggleFeed(false)
  resetBlockedPosts()
  clearInterval(feedInterval)
}

const handleFilterFeed = (mode, config) => {
  toggleFeed(true)

  resetBlockedPosts()
  clearInterval(feedInterval)
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

  feedKeywords = getFeedKeywords(config)

  if (feedKeywords !== oldFeedKeywords) {
    handleFilterFeed(mode, config)
  }
}
