// Job selectors
export const JOB_SELECTORS = ['[data-view-name="job-card"]']

// Feed selectors
export const FEED_SELECTOR =
  "[componentkey='container-update-list_mainFeed-lazy-container']"

export const POST_SELECTOR = `${FEED_SELECTOR} > div[data-display-contents="true"] > div`

export const DROPDOWN_TRIGGER_SELECTOR =
  'div[data-view-name="feed-nav-feed-sort-toggle"]'

export const RECENT_OPTION_SELECTOR =
  'div[data-view-name="feed-sort-view-set-recent"]'

export const WIDE_MODE_SELECTOR = 'main > div'

export const VIDEO_KEYWORD = 'video'
export const IMAGE_KEYWORD = 'data-view-name="feed-update-image"'
export const CAROUSEL_KEYWORD = 'data-view-name="feed-document-container"'
export const POLLS_KEYWORD = 'poll'
export const LINKS_KEYWORD = 'https://lnkd.in/'
export const PROMOTED_KEYWORD = 'Promoted'
export const SHARED_KEYWORD = 'reposted'
export const FOLLOWED_KEYWORD = 'following'
export const LIKED_KEYWORDS = ['likes this', 'like this']
export const OTHER_REACTIONS_KEYWORDS = [
  'loves this',
  'love this',
  'finds this insightful',
  'find this insightful',
  'celebrates this',
  'celebrate this',
  'is curious about this',
  'are curious about this',
  'supports this',
  'support this',
  'finds this funny',
  'find this funny',
]
export const COMMENTED_ON_KEYWORD = 'commented on this'
export const BY_COMPANIES_KEYWORD = 'href="https://www.linkedin.com/company/'
export const BY_PEOPLE_KEYWORD = 'href="https://www.linkedin.com/in/'
export const SUGGESTED_KEYWORD = 'Suggested'

// Visibility selectors
export const PRISTINE_SELECTOR = ':not([data-hidden])'
export const VISIBLE_SELECTOR = '[data-hidden=false]'
export const BLOCKED_SELECTOR = '[data-hidden=true]'

// Misc selectors
export const NETWORK_BUILDING_SELECTOR = '[data-view-name="pymk-feed-update"]'

export const FOLLOWS_SELECTOR = '[data-view-name="edge-creation-follow-action"]'

export const UNFOLLOW_ALL_BUTTON_SELECTOR =
  'button[aria-label^="Click to stop"]'

export const ADVERTISEMENT_CONTAINER_SELECTOR =
  "iframe[componentkey='MainFeedDesktopNav_feed_ad']"

export const PROFILE_COUNTERS_SELECTOR =
  "[data-view-name^='home-nav-left-rail-growth-widgets']"

export const NOTIFICATION_COUNT_SELECTOR =
  "[data-view-name='navigation-notifications'] > span > svg + span"

export const NEWS_MODULE_SELECTOR = '[data-view-name="news-module"]'

export const PREMIUM_NAV_UPSELL_SELECTOR =
  '[data-view-name="premium-nav-upsell-text"]'

export const PREMIUM_IDENTITY_UPSELL_SELECTOR =
  '[data-view-name="identity-module-upsell"]'

export const PREMIUM_UPSELL_CARD_SELECTOR =
  '[data-view-name="premium-upsell-card"]'
