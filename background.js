// Set defaults on install.

chrome.storage.local.get(null, function (res) {
  if (res.initialized !== 'v0.5')
    chrome.storage.local.set({
      initialized: 'v0.5',
      'feed-keywords': '',
      'gentle-mode': true,
      'dark-mode': true,
      'hide-account-building': false,
      'hide-advertisements': true,
      'hide-by-age': 'week',
      'hide-by-companies': true,
      'hide-by-people': false,
      'hide-commented-on': false,
      'hide-follow-recommendations': true,
      'hide-followed': true,
      'hide-community-panel': true,
      'hide-images': false,
      'hide-linkedin-learning': true,
      'hide-links': false,
      'hide-polls': true,
      'hide-premium': true,
      'hide-news': false,
      'hide-promoted': true,
      'hide-shared': false,
      'hide-videos': false,
      'hide-whole-feed': false,
      'hide-liked': true,
      'hide-other-reactions': false,
      'main-toggle': true,
      'sort-by-recent': true,
    })
})
