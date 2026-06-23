import {
  ADVERTISEMENT_CONTAINER_SELECTOR,
  GOOGLE_INTEGRATION_SELECTOR,
  NOTIFICATION_COUNT_SELECTOR,
  UNFOLLOW_ALL_BUTTON_SELECTOR,
} from '../constants.js'
import {
  hideBySelector,
  hideParentBySelector,
  showBySelector,
  showParentBySelector,
  hideAncestorIndexByTextContent,
  showAncestorIndexByTextContent,
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

const showProfileCounters = (translations) => {
  showAncestorIndexByTextContent(translations['hide-profile-counters'], 7)
}

const handleProfileCounters = (checkNeedUpdate, mode, translations) => {
  if (checkNeedUpdate('hide-profile-counters', true)) {
    hideAncestorIndexByTextContent(
      translations['hide-profile-counters'],
      7,
      mode,
      false
    )
  } else if (checkNeedUpdate('hide-profile-counters', false)) {
    showProfileCounters(translations)
  }
}

const showNews = (translations) => {
  showAncestorIndexByTextContent(translations['hide-news'], 4)
}

const handleNews = (checkNeedUpdate, mode, translations) => {
  if (checkNeedUpdate('hide-news', true)) {
    hideAncestorIndexByTextContent(translations['hide-news'], 4, mode, false)
  } else if (checkNeedUpdate('hide-news', false)) {
    showNews(translations)
  }
}

const showPremium = (translations) => {
  showAncestorIndexByTextContent(translations['hide-premium'].top, 6, 'header')
  showAncestorIndexByTextContent(
    translations['hide-premium'].sidebar,
    9,
    `[aria-label="${translations.common.sidebar}"]`
  )
}

const handlePremium = (checkNeedUpdate, mode, translations) => {
  if (checkNeedUpdate('hide-premium', true)) {
    hideAncestorIndexByTextContent(
      translations['hide-premium'].top,
      4,
      mode,
      false,
      'header'
    )

    hideAncestorIndexByTextContent(
      translations['hide-premium'].sidebar,
      9,
      mode,
      false,
      `[aria-label="${translations.common.sidebar}"]`
    )
  } else if (checkNeedUpdate('hide-premium', false)) {
    showPremium(translations)
  }
}

const showFollowRecommendations = (translations) => {
  showAncestorIndexByTextContent(translations['hide-follow-recommendations'], 2)
}

const handleFollowRecommendations = (checkNeedUpdate, mode, translations) => {
  if (checkNeedUpdate('hide-follow-recommendations', true)) {
    hideAncestorIndexByTextContent(
      translations['hide-follow-recommendations'],
      2,
      mode,
      false
    )
  } else if (checkNeedUpdate('hide-follow-recommendations', false)) {
    showFollowRecommendations(translations)
  }
}

const handleGoogleIntegration = (checkNeedUpdate) => {
  if (checkNeedUpdate('hide-google-integration', true)) {
    document.querySelector(GOOGLE_INTEGRATION_SELECTOR)?.remove()
  }
}

const showAll = (translations) => {
  showFollowRecommendations(translations)
  showNews(translations)
  showProfileCounters(translations)
  showPremium(translations)

  showNotifications()
  showAdvertisement()
}

const handleAll = (checkNeedUpdate, mode, translations) => {
  handleFollowRecommendations(checkNeedUpdate, mode, translations)
  handleNews(checkNeedUpdate, mode, translations)
  handleProfileCounters(checkNeedUpdate, mode, translations)
  handlePremium(checkNeedUpdate, mode, translations)

  handleNotifications(checkNeedUpdate)
  handleAdvertisement(checkNeedUpdate, mode)
  handleGoogleIntegration(checkNeedUpdate, mode)
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

export default (checkNeedUpdate, enabled, mode, translations) => {
  if (checkNeedUpdate('main-toggle', false)) {
    showAll(translations)
  }

  if (!enabled) return

  handleAll(checkNeedUpdate, mode, translations)
}
