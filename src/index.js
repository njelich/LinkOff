import { setupDeleteMessagesButton } from './features/message.js'
import doGenerals from './features/general.js'
import doFeed from './features/feed.js'
import doMisc, { unfollowAll } from './features/misc.js'
import doJobs from './features/jobs.js'

let oldResponse = {}

// Main function
const doIt = async (response) => {
  if (JSON.stringify(oldResponse) === JSON.stringify(response)) return

  // checks if filter needs updating, used below
  const getRes = (field, bool) => {
    const changed =
      response[field] !== oldResponse[field] ||
      response['gentle-mode'] !== oldResponse['gentle-mode'] ||
      response['main-toggle'] !== oldResponse['main-toggle']

    if (changed) {
      console.log(`LinkOff: Toggling ${field} to ${response[field]}`)
    }

    return changed && response[field] == bool
  }

  // Set Mode
  let mode = response['gentle-mode'] ? 'dim' : 'hide'

  // Toggle for jobs & feed options
  const enabled = response['main-toggle']

  doGenerals(getRes)
  doFeed(getRes, enabled, mode, response)
  doJobs(getRes, enabled, mode, response)
  doMisc(getRes, enabled, mode)

  oldResponse = response
}

const getStorageAndDoIt = () => chrome.storage.local.get(null, doIt)

// Storage listener
chrome.storage.onChanged.addListener(() => {
  getStorageAndDoIt()
})

chrome.runtime.onMessage.addListener(async (req) => {
  if (req['unfollow-all']) {
    if (
      !window.location.href.includes('/mynetwork/network-manager/people-follow')
    ) {
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
let lastUrl = window.location.href
setInterval(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href
    oldResponse = {}
    getStorageAndDoIt()
    if (window.location.href.includes('/messaging/'))
      setupDeleteMessagesButton()
  }
}, 500)

// On load
if (document.readyState !== 'loading') {
  getStorageAndDoIt()
  if (window.location.href.includes('/messaging/')) {
    setupDeleteMessagesButton()
  }
} else {
  document.addEventListener('DOMContentLoaded', () => {
    getStorageAndDoIt()

    if (window.location.href.includes('/messaging/')) {
      setupDeleteMessagesButton()
    }
  })
}
