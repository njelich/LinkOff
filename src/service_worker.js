const DEFAULTS = {
  // Generals
  'gentle-mode': true,
  'main-toggle': true,
  // Feed
  'hide-whole-feed': false,
  'hide-by-age': 'week',
  'feed-keywords': '',
  'hide-shared': false,
  'hide-videos': false,
  'hide-liked': true,
  'hide-suggested': true,
  'hide-other-reactions': false,
  'sort-by-recent': true,
  'hide-carousels': false,
  'hide-by-companies': true,
  'hide-by-people': false,
  'hide-commented-on': false,
  'hide-followed': true,
  'hide-images': false,
  'hide-links': false,
  'hide-polls': true,
  // Misc
  'hide-premium': true,
  'hide-advertisements': true,
  'hide-follow-recommendations': true,
  'hide-news': false,
  'hide-promoted': true,
  'hide-notification-count': false,
  'hide-profile-counters': false,
  'hide-google-integration': false,
  // Jobs
  'job-keywords': '',
  'hide-promoted-jobs': false,
}

// Runs on update too, so options added after an install reach existing users
// instead of staying undefined.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(null, (stored) => {
    const missing = Object.fromEntries(
      Object.entries(DEFAULTS).filter(([key]) => stored[key] === undefined)
    )

    if (Object.keys(missing).length) chrome.storage.local.set(missing)
  })
})
