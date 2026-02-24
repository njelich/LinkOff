// Job selectors
export const JOB_SELECTORS = [
  '[data-job-id]',
  '[data-occludable-job-id]',
  '.discovery-templates-vertical-list__list-item',
]

// Feed selectors
export const FEED_SELECTOR =
  "[componentkey='container-update-list_mainFeed-lazy-container']"

export const POST_SELECTOR = `${FEED_SELECTOR} > div[data-display-contents="true"] > div`

export const DROPDOWN_TRIGGER_SELECTOR =
  'div[data-view-name="feed-nav-feed-sort-toggle"]'

export const RECENT_OPTION_SELECTOR =
  'div[data-view-name="feed-sort-view-set-recent"]'

export const VIDEO_SELECTOR = 'video'

export const IMAGE_SELECTOR =
  'div[data-view-name="feed-update-image"] > figure > img'

export const CAROUSEL_SELECTOR = 'ul > li > figure > img'

export const WIDE_MODE_SELECTOR = 'main > div'

export const PREMIUM_NAV_UPSELL_SELECTOR =
  '[data-view-name="premium-nav-upsell-text"]'

export const PREMIUM_IDENTITY_UPSELL_ANCESTOR_SELECTOR =
  '[data-view-name="identity-module"] + div'

export const PREMIUM_IDENTITY_UPSELL_CHILD_SELECTOR =
  '[data-view-name="identity-module-upsell"]'

export const POLLS_KEYWORD = 'poll'
export const LINKS_KEYWORD = 'https://lnkd.in/'
export const PROMOTED_KEYWORD = 'Promoted'
export const SHARED_KEYWORD = 'feed-shared-mini-update-v2'
export const FOLLOWED_KEYWORD = 'following'
export const LIKED_KEYWORDS = ['likes this', 'like this']
export const OTHER_REACTIONS_KEYWORDS = [
  'loves this',
  'finds this insightful',
  'celebrates this',
  'is curious about this',
  'supports this',
  'finds this funny',
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
export const UNFOLLOW_ALL_BUTTON_SELECTOR =
  'button[aria-label^="Click to stop"]'

export const ADVERTISEMENT_CONTAINER_SELECTOR =
  "iframe[componentkey='MainFeedDesktopNav_feed_ad']"

export const PROFILE_COUNTERS_SELECTOR =
  "[data-view-name='home-nav-left-rail-growth-widgets-creator-analytics']"

export const NOTIFICATION_COUNT_SELECTOR =
  "[data-view-name='navigation-notifications'] > span > svg + span"
