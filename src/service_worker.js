// Set defaults on install.
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.get(null, function (res) {
      if (res.initialized !== 'v0.5')
        chrome.storage.local.set({
          initialized: 'v0.5',
          // Generals
          'gentle-mode': true,
          'dark-mode': false,
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
          'hide-linkedin-learning': true,
          'hide-premium': true,
          'hide-account-building': true,
          'hide-network-building': true,
          'hide-advertisements': true,
          'hide-follow-recommendations': true,
          'hide-news': false,
          'hide-promoted': true,
          'hide-notification-count': false,
          'hide-profile-counters': false,
          'hide-community-panel': true,
          // Jobs
          'job-keywords': '',
          'hide-job-guidance': false,
          'hide-ai-button': false,
          'hide-promoted-jobs': false,
        })
    })
  }
})
