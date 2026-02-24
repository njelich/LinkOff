import {
  ADVERTISEMENT_CONTAINER_SELECTOR,
  NOTIFICATION_COUNT_SELECTOR,
  PREMIUM_IDENTITY_UPSELL_ANCESTOR_SELECTOR,
  PREMIUM_IDENTITY_UPSELL_CHILD_SELECTOR,
  PREMIUM_NAV_UPSELL_SELECTOR,
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
  } else {
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

// Show/Hide news
// const showNews = () => {
//   // showByClassName('news-module')
//   // showByClassName('news-module--with-game')
// }
// const handleNews = (checkNeedUpdate, mode) => {
//   if (checkNeedUpdate('hide-news', true)) {
//     // hideByClassName('news-module', mode)
//     // hideByClassName('news-module--with-game', mode)
//   } else if (checkNeedUpdate('hide-news', false)) {
//     showNews()
//   }
// }

// // Show/Hide LinkedIn learning prompts and ads
// const showLearning = () => {
//   showByClassName('learning-top-courses')
//   showByClassName('pv-course-recommendations')
// }

// const handleLearning = (checkNeedUpdate, mode) => {
//   if (checkNeedUpdate('hide-linkedin-learning', true)) {
//     hideByClassName('learning-top-courses', mode)
//     hideByClassName('pv-course-recommendations', mode)
//   } else if (checkNeedUpdate('hide-linkedin-learning', false)) {
//     showLearning()
//   }
// }

// // Show/Hide community panels
// const showCommunity = () => {
//   showByClassName('community-panel')
// }
// const handleCommunity = (checkNeedUpdate, mode) => {
//   if (checkNeedUpdate('hide-community-panel', true)) {
//     hideByClassName('community-panel', mode)
//   } else if (checkNeedUpdate('hide-community-panel', false)) {
//     showCommunity()
//   }
// }

// // Show/Hide follow panels
// const showFollow = () => {
//   showByClassName('feed-follows-module')
// }

// const handleFollow = (checkNeedUpdate, mode) => {
//   if (checkNeedUpdate('hide-follow-recommendations', true)) {
//     hideByClassName('feed-follows-module', mode)
//   } else if (checkNeedUpdate('hide-follow-recommendations', false)) {
//     showFollow()
//   }
// }

// // Show/Hide account building prompts
// const showAccountBuilding = () => {
//   showByClassName('artdeco-card ember-view mt2')
//   showByClassName('artdeco-card mb4 overflow-hidden ember-view')
// }
// const handleAccountBuilding = (checkNeedUpdate, mode) => {
//   if (checkNeedUpdate('hide-account-building', true)) {
//     hideByClassName('artdeco-card ember-view mt2', mode)
//     hideByClassName('artdeco-card mb4 overflow-hidden ember-view', mode)
//   } else if (checkNeedUpdate('hide-account-building', false)) {
//     showAccountBuilding()
//   }
// }

// // Show/Hide network building prompts
// const showNetworkBuilding = () => {
//   showByClassName('mn-abi-form')
//   showByClassName('pv-profile-pymk__container artdeco-card')
// }

// const handleNetworkBuilding = (checkNeedUpdate, mode) => {
//   if (checkNeedUpdate('hide-network-building', true)) {
//     hideByClassName('mn-abi-form', mode)
//     hideByClassName('pv-profile-pymk__container artdeco-card', mode)
//   } else if (checkNeedUpdate('hide-network-building', false)) {
//     showNetworkBuilding()
//   }
// }

const showPremium = () => {
  showBySelector(PREMIUM_NAV_UPSELL_SELECTOR)
  showAncestorByChildSelector(
    PREMIUM_IDENTITY_UPSELL_CHILD_SELECTOR,
    PREMIUM_IDENTITY_UPSELL_ANCESTOR_SELECTOR
  )
}

const handlePremium = (checkNeedUpdate, mode) => {
  if (checkNeedUpdate('hide-premium', true)) {
    hideBySelector(PREMIUM_NAV_UPSELL_SELECTOR, mode, false)
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
  // showNews()
  // showAccountBuilding()
  // showNetworkBuilding()
  // showCommunity()
  // showFollow()
  // showLearning()
  showProfileCounters()
  showNotifications()
  showPremium()
  showAdvertisement()
}

const handleAll = (checkNeedUpdate, mode) => {
  // handleLearning(checkNeedUpdate, mode)
  // handleCommunity(checkNeedUpdate, mode)
  // handleFollow(checkNeedUpdate, mode)
  // handleAccountBuilding(checkNeedUpdate, mode)
  // handleNetworkBuilding(checkNeedUpdate, mode)
  // handleNews(checkNeedUpdate, mode)
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
