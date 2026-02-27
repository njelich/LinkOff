import {
  ADVERTISEMENT_CONTAINER_SELECTOR,
  FOLLOWS_SELECTOR,
  NEWS_MODULE_SELECTOR,
  NOTIFICATION_COUNT_SELECTOR,
  PREMIUM_IDENTITY_UPSELL_SELECTOR,
  PREMIUM_NAV_UPSELL_SELECTOR,
  PROFILE_COUNTERS_SELECTOR,
  UNFOLLOW_ALL_BUTTON_SELECTOR,
} from '../constants.js'
import {
  hideBySelector,
  hideParentBySelector,
  showBySelector,
  showParentBySelector,
  showAncestorIndexBySelector,
  hideAncestorIndexBySelector,
} from '../utils.js'

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

const showProfileCounters = () => {
  showAncestorIndexBySelector(PROFILE_COUNTERS_SELECTOR, 3)
}

const handleProfileCounters = (checkNeedUpdate, mode) => {
  if (checkNeedUpdate('hide-profile-counters', true)) {
    hideAncestorIndexBySelector(PROFILE_COUNTERS_SELECTOR, 3, mode, false)
  } else if (checkNeedUpdate('hide-profile-counters', false)) {
    showProfileCounters()
  }
}

const showNews = () => {
  showBySelector(NEWS_MODULE_SELECTOR)
}

const handleNews = (checkNeedUpdate, mode) => {
  if (checkNeedUpdate('hide-news', true)) {
    hideBySelector(NEWS_MODULE_SELECTOR, mode, false)
  } else if (checkNeedUpdate('hide-news', false)) {
    showNews()
  }
}

const showPremium = () => {
  showBySelector(PREMIUM_NAV_UPSELL_SELECTOR)
  showAncestorIndexBySelector(PREMIUM_IDENTITY_UPSELL_SELECTOR, 2)
}

const handlePremium = (checkNeedUpdate, mode) => {
  if (checkNeedUpdate('hide-premium', true)) {
    hideBySelector(PREMIUM_NAV_UPSELL_SELECTOR, mode, false)
    hideAncestorIndexBySelector(
      PREMIUM_IDENTITY_UPSELL_SELECTOR,
      2,
      mode,
      false
    )
  } else if (checkNeedUpdate('hide-premium', false)) {
    showPremium()
  }
}

const showFollowRecommendations = () => {
  showAncestorIndexBySelector(FOLLOWS_SELECTOR, 7)
}

const handleFollowRecommendations = (checkNeedUpdate, mode) => {
  if (checkNeedUpdate('hide-follow-recommendations', true)) {
    hideAncestorIndexBySelector(FOLLOWS_SELECTOR, 7, mode, false)
  } else if (checkNeedUpdate('hide-follow-recommendations', false)) {
    showFollowRecommendations()
  }
}
const showAll = () => {
  showFollowRecommendations()
  showNews()
  showProfileCounters()
  showNotifications()
  showPremium()
  showAdvertisement()
}

const handleAll = (checkNeedUpdate, mode) => {
  handleFollowRecommendations(checkNeedUpdate, mode)
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
