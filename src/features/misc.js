import {
  hideByClassName,
  hideByClassNameAndIndex,
  showByClassName,
  showByClassNameAndIndex,
} from '../utils.js'

// Show/Hide LinkedIn learning prompts and ads
const showLearning = () => {
  showByClassName('learning-top-courses')
  showByClassName('pv-course-recommendations')
}
const handleLearning = (getRes, mode) => {
  if (getRes('hide-linkedin-learning', true)) {
    hideByClassName('learning-top-courses', mode)
    hideByClassName('pv-course-recommendations', mode)
  } else if (
    getRes('main-toggle', false) ||
    getRes('hide-linkedin-learning', false)
  ) {
    showLearning()
  }
}

// Show/Hide ads across linkedin
const showAdvertisement = () => {
  showByClassName('ad-banner-container')
  showByClassName('ads-container')
  showByClassName('ad-banner')
  showByClassName('pv-right-rail__sticky-ad-banner')
}

const handleAdvertisement = (getRes, mode) => {
  if (getRes('hide-advertisements', true)) {
    hideByClassName('ad-banner-container', mode)
    hideByClassName('ads-container', mode)
    hideByClassName('ad-banner', mode)
    hideByClassName('pv-right-rail__sticky-ad-banner', mode)
  } else if (
    getRes('main-toggle', false) ||
    getRes('hide-advertisements', false)
  ) {
    showAdvertisement()
  }
}

// Show/Hide community panels
const showCommunity = () => {
  showByClassName('community-panel')
}
const handleCommunity = (getRes, mode) => {
  if (getRes('hide-community-panel', true)) {
    hideByClassName('community-panel', mode)
  } else if (
    getRes('main-toggle', false) ||
    getRes('hide-community-panel', false)
  ) {
    showCommunity()
  }
}

// Show/Hide follow panels
const showFollow = () => {
  showByClassName('feed-follows-module')
}

const handleFollow = (getRes, mode) => {
  if (getRes('hide-follow-recommendations', true)) {
    hideByClassName('feed-follows-module', mode)
  } else if (
    getRes('main-toggle', false) ||
    getRes('hide-follow-recommendations', false)
  ) {
    showFollow()
  }
}

// Show/Hide account building prompts
const showAccountBuilding = () => {
  showByClassName('artdeco-card ember-view mt2')
  showByClassName('artdeco-card mb4 overflow-hidden ember-view')
}
const handleAccountBuilding = (getRes, mode) => {
  if (getRes('hide-account-building', true)) {
    hideByClassName('artdeco-card ember-view mt2', mode)
    hideByClassName('artdeco-card mb4 overflow-hidden ember-view', mode)
  } else if (
    getRes('main-toggle', false) ||
    getRes('hide-account-building', false)
  ) {
    showAccountBuilding()
  }
}

// Show/Hide network building prompts
const showNetworkBuilding = () => {
  showByClassName('mn-abi-form')
  showByClassName('pv-profile-pymk__container artdeco-card')
}

const handleNetworkBuilding = (getRes, mode) => {
  if (getRes('hide-network-building', true)) {
    hideByClassName('mn-abi-form', mode)
    hideByClassName('pv-profile-pymk__container artdeco-card', mode)
  } else if (
    getRes('main-toggle', false) ||
    getRes('hide-network-building', false)
  ) {
    showNetworkBuilding()
  }
}

// Show/Hide premium upsell prompts
const showPremium = () => {
  showByClassName('premium-upsell-link')
  showByClassName('gp-promo-embedded-card-three__card')
  showByClassName('artdeco-card overflow-hidden ph1 mb2')
  showByClassName('artdeco-card premium-accent-bar')
  showByClassName('pvs-premium-upsell__container')
  showByClassName('pvs-entity--blurred')
  showByClassNameAndIndex('artdeco-tab ember-view', 1)
}
const handlePremium = (getRes, mode) => {
  if (getRes('hide-premium', true)) {
    hideByClassName('premium-upsell-link', mode, false)
    hideByClassName('gp-promo-embedded-card-three__card', mode)
    hideByClassName('artdeco-card overflow-hidden ph1 mb2', mode, false)
    hideByClassName('pvs-premium-upsell__container', mode, false)
    hideByClassName('pvs-entity--blurred', mode, false)
    hideByClassName('artdeco-card premium-accent-bar', mode)
    hideByClassNameAndIndex('artdeco-tab ember-view', 1, mode, false)
  } else if (getRes('main-toggle', false) || getRes('hide-premium', false)) {
    showPremium()
  }
}

// Show/Hide news
const showNews = () => {
  showByClassName('news-module')
  showByClassName('news-module--with-game')
}
const handleNews = (getRes, mode) => {
  if (getRes('hide-news', true)) {
    hideByClassName('news-module', mode)
    hideByClassName('news-module--with-game', mode)
  } else if (getRes('main-toggle', false) || getRes('hide-news', false)) {
    showNews()
  }
}

//  Show/Hide notification count
const showNotifications = () => {
  showByClassName('notification-badge__count')
}

const handleNotifications = (getRes) => {
  if (getRes('hide-notification-count', true)) {
    hideByClassName('notification-badge__count', 'hide', false)
  } else {
    showNotifications()
  }
}

const showAll = () => {
  showNews()
  showNotifications()
  showAccountBuilding()
  showNetworkBuilding()
  showAdvertisement()
  showCommunity()
  showFollow()
  showPremium()
  showLearning()
}

let interval

const handleAll = (getRes, mode) => {
  handleLearning(getRes, mode)
  handleCommunity(getRes, mode)
  handleFollow(getRes, mode)
  handleAccountBuilding(getRes, mode)
  handleNetworkBuilding(getRes, mode)
  handlePremium(getRes, mode)
  handleNews(getRes, mode)
  handleAdvertisement(getRes, mode)
  handleNotifications(getRes)
}

export default (getRes, enabled, mode) => {
  if (getRes('main-toggle', false)) {
    showAll()
    clearInterval(interval)
  }

  if (!enabled) return

  handleAll(getRes, mode)

  if (interval) clearInterval(interval)

  interval = setInterval(() => {
    handleAll(getRes, mode)
  }, 500)
}

const BUTTON_SELECTOR = 'button[aria-label^="Click to stop"]'

export const unfollowAll = async () => {
  let buttons = document.querySelectorAll(BUTTON_SELECTOR) || []

  if (!buttons.length) console.log('LinkOff: Successfully unfollowed all')

  for (let button of buttons) {
    window.scrollTo(0, button.offsetTop - 260)
    button.click()

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  window.scrollTo(0, document.body.scrollHeight)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  buttons = document.querySelectorAll(BUTTON_SELECTOR) || []

  if (buttons.length) unfollowAll()
}
