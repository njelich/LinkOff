import {
  ADVERTISEMENT_CONTAINER_SELECTOR,
  NEWS_MODULE_SELECTOR,
  NOTIFICATION_COUNT_SELECTOR,
  PREMIUM_IDENTITY_UPSELL_ANCESTOR_SELECTOR,
  PREMIUM_IDENTITY_UPSELL_CHILD_SELECTOR,
  PREMIUM_NAV_UPSELL_SELECTOR,
  PREMIUM_UPSELL_CARD_SELECTOR,
  PROFILE_COUNTERS_SELECTOR,
  UNFOLLOW_ALL_BUTTON_SELECTOR,
} from '../constants.js'
import {
  hideAncestorByChildSelector,
  hideBySelector,
  hideParentBySelector,
  showAncestorByChildSelector,
  showBySelector,
  showParentBySelector,
} from '../utils.js'

// Show/Hide ads across linkedin
const showAdvertisement = () => {
  showParentBySelector(ADVERTISEMENT_CONTAINER_SELECTOR)
}

const handleAdvertisement = (checkNeedUpdate, mode) => {
  if (checkNeedUpdate('hide-advertisements', true)) {
    hideParentBySelector(ADVERTISEMENT_CONTAINER_SELECTOR, mode, false)
  } else if (checkNeedUpdate('hide-advertisements', false)) {
    showAdvertisement()
  }
}

//  Show/Hide notification count
const showNotifications = () => {
  showBySelector(NOTIFICATION_COUNT_SELECTOR)
}

const handleNotifications = (checkNeedUpdate) => {
  if (checkNeedUpdate('hide-notification-count', true)) {
    hideBySelector(NOTIFICATION_COUNT_SELECTOR, 'hide', false)
  } else if (checkNeedUpdate('hide-notification-count', false)) {
    showNotifications()
  }
}

//  Show/Hide profile counters
const showProfileCounters = () => {
  showParentBySelector(PROFILE_COUNTERS_SELECTOR)
}

const handleProfileCounters = (checkNeedUpdate, mode) => {
  if (checkNeedUpdate('hide-profile-counters', true)) {
    hideParentBySelector(PROFILE_COUNTERS_SELECTOR, mode, false)
  } else if (checkNeedUpdate('hide-profile-counters', false)) {
    showProfileCounters()
  }
}

// Show/Hide news module (right sidebar)
const showNews = () => {
  showBySelector(NEWS_MODULE_SELECTOR)
}

const handleNews = (checkNeedUpdate, mode) => {
  if (checkNeedUpdate('hide-news', true)) {
    hideBySelector(NEWS_MODULE_SELECTOR, mode)
  } else if (checkNeedUpdate('hide-news', false)) {
    showNews()
  }
}

// Show/Hide premium upsell prompts
const showPremium = () => {
  showBySelector(PREMIUM_NAV_UPSELL_SELECTOR)
  showBySelector(PREMIUM_UPSELL_CARD_SELECTOR)
  showAncestorByChildSelector(
    PREMIUM_IDENTITY_UPSELL_CHILD_SELECTOR,
    PREMIUM_IDENTITY_UPSELL_ANCESTOR_SELECTOR
  )
}

const handlePremium = (checkNeedUpdate, mode) => {
  if (checkNeedUpdate('hide-premium', true)) {
    hideBySelector(PREMIUM_NAV_UPSELL_SELECTOR, mode, false)
    hideBySelector(PREMIUM_UPSELL_CARD_SELECTOR, mode, false)
    hideAncestorByChildSelector(
      PREMIUM_IDENTITY_UPSELL_CHILD_SELECTOR,
      PREMIUM_IDENTITY_UPSELL_ANCESTOR_SELECTOR,
      mode,
      false
    )
  } else if (checkNeedUpdate('hide-premium', false)) {
    showPremium()
  }
}

const showAll = () => {
  showNews()
  showProfileCounters()
  showNotifications()
  showPremium()
  showAdvertisement()
}

const handleAll = (checkNeedUpdate, mode) => {
  handleNews(checkNeedUpdate, mode)
  handleProfileCounters(checkNeedUpdate, mode)
  handleNotifications(checkNeedUpdate)
  handlePremium(checkNeedUpdate, mode)
  handleAdvertisement(checkNeedUpdate, mode)
}

export const unfollowAll = async () => {
  let buttons = document.querySelectorAll(UNFOLLOW_ALL_BUTTON_SELECTOR) || []

  if (!buttons.length) console.log('LinkOff: Successfully unfollowed all')

  for (let button of buttons) {
    window.scrollTo(0, button.offsetTop - 260)
    button.click()

    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  window.scrollTo(0, document.body.scrollHeight)
  await new Promise((resolve) => setTimeout(resolve, 1000))

  buttons = document.querySelectorAll(UNFOLLOW_ALL_BUTTON_SELECTOR) || []

  if (buttons.length) unfollowAll()
}

export default (checkNeedUpdate, enabled, mode) => {
  if (checkNeedUpdate('main-toggle', false)) {
    showAll()
  }

  if (!enabled) return

  handleAll(checkNeedUpdate, mode)
}
