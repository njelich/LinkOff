import { FEED_SELECTORS } from '../constants.js'
import {
  getCustomSelectors,
  resetBlockedPosts,
  resetShownPosts,
  waitForSelector,
  waitForSelectorScoped,
} from '../utils.js'

let runs = 0
let feedKeywordInterval
let postCountPrompted = false
let feedKeywords = []
let oldFeedKeywords = []

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
        keywords.push(`text::${x}${ageKeywords.hour}`)
      }
    } else {
      keywords.push(`text::${ageKeywords.hour}`)
    }

    hideByDay(false)
  }

  const hideByDay = (shouldLoop) => {
    if (shouldLoop) {
      for (let x = 2; x <= 30; x++) {
        keywords.push(`text::${x}${ageKeywords.day}`)
      }
    } else {
      keywords.push(`text::${ageKeywords.day}`)
    }

    hideByWeek(false)
  }

  const hideByWeek = (shouldLoop) => {
    if (shouldLoop) {
      for (let x = 2; x <= 4; x++) {
        keywords.push(`text::${x}${ageKeywords.week}`)
      }
    } else {
      keywords.push(`text::${ageKeywords.week}`)
    }

    hideByMonth(false)
  }

  const hideByMonth = (shouldLoop) => {
    if (shouldLoop) {
      for (let x = 2; x <= 12; x++) {
        keywords.push(`text::${x}${ageKeywords.month}`)
      }
    } else {
      keywords.push(`text::${ageKeywords.month}`)
    }
    hideByYear(false)
  }

  const hideByYear = (shouldLoop) => {
    if (shouldLoop) {
      for (let x = 2; x <= 5; x++) {
        keywords.push(`text::${x}${ageKeywords.year}`)
      }
    } else {
      keywords.push(`text::${ageKeywords.year}`)
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

const getFeedKeywords = (response) => {
  let keywords =
    response['feed-keywords'] == '' ? [] : response['feed-keywords'].split(',')

  const hideByAge = response['hide-by-age']

  if (hideByAge !== 'disabled') {
    handleAgeFiltering(keywords, hideByAge)
  }

  if (response['hide-polls']) keywords.push('poll')
  if (response['hide-videos'])
    keywords.push(
      'id="vjs_video_',
      'update-components-linkedin-video',
      'feed-shared-linkedin-video'
    )
  if (response['hide-links']) keywords.push('https://lnkd.in/')
  if (response['hide-images'])
    keywords.push('class="update-components-image__image-link')
  if (response['hide-promoted']) keywords.push('text::Promoted')
  if (response['hide-shared']) keywords.push('feed-shared-mini-update-v2')
  if (response['hide-followed']) keywords.push('text::following')
  if (response['hide-liked'])
    keywords.push('text::likes this', 'text::like this')
  if (response['hide-other-reactions'])
    keywords.push(
      'text::loves this',
      'text::finds this insightful',
      'text::celebrates this',
      'text::is curious about this',
      'text::supports this',
      'text::finds this funny'
    )
  if (response['hide-commented-on']) keywords.push('text::commented on this')
  if (response['hide-by-companies'])
    keywords.push('href="https://www.linkedin.com/company/')
  if (response['hide-by-people'])
    keywords.push('href="https://www.linkedin.com/in/')
  if (response['hide-suggested']) keywords.push('text::Suggested')
  if (response['hide-carousels']) keywords.push('iframe')

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

const blockByFeedKeywords = (keywords, mode, disablePostCount) => {
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
        getCustomSelectors(FEED_SELECTORS, 'pristine')
      )

      console.log(`LinkOff: Found ${posts.length} unblocked posts`)

      // Filter only if there are enough posts to load more
      if (posts.length > 5 || mode == 'dim') {
        posts.forEach((post) => {
          let keywordIndex

          const containsKeyword = keywords.some((keyword, index) => {
            keywordIndex = index

            const splitted = keyword.split('::')

            if (splitted.length > 1) {
              return post.innerText.indexOf(splitted[1]) !== -1
            }

            return post.innerHTML.indexOf(splitted[0]) !== -1
          })

          if (containsKeyword) {
            hidePost(post, mode)

            console.log(
              `LinkOff: Blocked post ${post.getAttribute(
                'data-id'
              )} for keyword ${keywords[keywordIndex]}`
            )
          } else {
            post.classList.remove('hide', 'dim', 'showIcon')
            post.dataset.hidden = false
          }
        })
      } else {
        if (!postCountPrompted && !disablePostCount) {
          postCountPrompted = true //Prompt only once when loading linkedin
          alert(
            'Scroll down to start blocking posts (LinkedIn needs at least 10 loaded to load new ones).\n\nTo disable this alert, toggle it under misc in LinkOff settings'
          )
        }
      }

      runs++
    }, 350)
}

const toggleFeed = async (shown) => {
  let attempts = 0
  let success = false
  let className = 'scaffold-finite-scroll__content' // feed element css class
  if (window.location.href != 'https://www.linkedin.com/feed/') {
    // dont hide this element on notifications & jobs page. Only hide on home feed instead.
    return
  }

  while (!success && attempts < 50) {
    await new Promise((resolve) => {
      setTimeout(() => {
        if (shown) {
          document
            .getElementsByClassName(className)
            .item(0)
            .classList.remove('hide')
          console.log(`LinkOff: feed enabled`)
        } else {
          document
            .getElementsByClassName(className)
            .item(0)
            .classList.add('hide')
          console.log(`LinkOff: feed disabled`)
        }
        success = true
        attempts = attempts + 1
        resolve()
      }, 100 + attempts * 10)
    })
  }
}

// Toggle sort by recent
const handleSortByRecent = async () => {
  if (
    window.location.href !== 'https://www.linkedin.com/feed/' &&
    window.location.href !== 'https://www.linkedin.com/'
  ) {
    return
  }

  const DROPDOWN_TRIGGER_SELECTOR =
    'button.full-width.artdeco-dropdown__trigger.artdeco-dropdown__trigger--placement-bottom'

  const RECENT_OPTION_SELECTOR =
    'ul > li:nth-child(2) > div.artdeco-dropdown__item.artdeco-dropdown__item--is-dropdown'

  const dropdownTrigger = await waitForSelector(DROPDOWN_TRIGGER_SELECTOR)

  const parent = dropdownTrigger.parentElement

  dropdownTrigger.click()

  const recentOption = await waitForSelectorScoped(
    RECENT_OPTION_SELECTOR,
    parent
  )
  recentOption.click()
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

const handleShowFilteredFeed = (mode, response) => {
  toggleFeed(true)

  resetBlockedPosts()
  clearInterval(feedKeywordInterval)
  blockByFeedKeywords(feedKeywords, mode, response['disable-postcount-prompt'])
}

export default (getRes, enabled, mode, response) => {
  if (getRes('main-toggle', false)) {
    handleToggledOff()

    return
  }

  if (!enabled) return

  if (getRes('sort-by-recent', true)) handleSortByRecent()

  feedKeywords = getFeedKeywords(response)
  if (getRes('hide-whole-feed', true)) {
    handleHideWholeFeed()
  } else if (feedKeywords !== oldFeedKeywords) {
    handleShowFilteredFeed(mode, response)
  }
}
