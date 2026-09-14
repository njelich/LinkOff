import { setupDeleteMessagesButton } from './features/message.js'
import doGenerals from './features/general.js'
import doFeed from './features/feed.js'
import doMisc, { unfollowAll } from './features/misc.js'
import doJobs from './features/jobs.js'
import { getLocaleTranslations, shallowEqual } from './utils.js'
import { FOLLOW_PAGE_URL } from './constants.js'

let oldConfig = {}
let translations

const storage = chrome.storage.local

// Main function
const doIt = async (config) => {
  if (shallowEqual(oldConfig, config)) return

  // checks if filter needs updating, used below
  const checkNeedUpdate = (field, bool) => {
    const hasChanged =
      config[field] !== oldConfig[field] ||
      config['gentle-mode'] !== oldConfig['gentle-mode'] ||
      config['main-toggle'] !== oldConfig['main-toggle']

    if (hasChanged) {
      console.log(`LinkOff: Toggling ${field} to ${config[field]}`)
    }

    return hasChanged && config[field] === bool
  }

  const mode = config['gentle-mode'] ? 'dim' : 'hide'
  const enabled = config['main-toggle']

  if (!translations) {
    translations = await getLocaleTranslations()
  }

  doGenerals(checkNeedUpdate)
  doFeed(checkNeedUpdate, enabled, mode, config)
  doJobs(checkNeedUpdate, enabled, mode, config)
  doMisc(checkNeedUpdate, enabled, mode, translations)

  oldConfig = config
}

const initialize = async () => {
  const config = await storage.get()

  doIt(config)
}

// Storage listener
chrome.storage.onChanged.addListener(initialize)

chrome.runtime.onMessage.addListener(async (req) => {
  if (req['unfollow-all']) {
    if (!window.location.href.includes(FOLLOW_PAGE_URL)) {
      alert(
        'No messages. Are you on the follows page (/mynetwork/network-manager/people-follow)?\n\nIf not, please navigate to following using the LinkedIn navbar and then click the Unfollow All button again.'
      )
      return
    } else {
      await unfollowAll()
    }
  }
})

// Track url changes
let lastUrl
let urlCheckIntervalId = null

// Prefixes, so sub-pages such as /jobs/search/ are covered too. The home page
// is the one path that has to match exactly.
const AUTHORIZED_PATH_PREFIXES = ['/feed/', '/jobs/', '/messaging/']

const isAuthorizedPath = (pathname) =>
  pathname === '/' ||
  AUTHORIZED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))

const startUrlCheck = () => {
  if (urlCheckIntervalId !== null) return
  urlCheckIntervalId = setInterval(() => {
    if (!isAuthorizedPath(window.location.pathname)) {
      // Features stop themselves once the page is out of their scope, so
      // forget where we were: returning to the same url must re-run them.
      lastUrl = undefined

      return
    }

    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href
      oldConfig = {}
      initialize()

      if (window.location.href.includes('/messaging/')) {
        setupDeleteMessagesButton()
      }
    }
  }, 500)
}

const stopUrlCheck = () => {
  if (urlCheckIntervalId !== null) {
    clearInterval(urlCheckIntervalId)
    urlCheckIntervalId = null
  }
}

startUrlCheck()

// Clean up interval when tab is hidden so we don't leave a long-lived timer (avoids extra workers)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    stopUrlCheck()
  } else {
    startUrlCheck()
  }
})
window.addEventListener('pagehide', stopUrlCheck)
