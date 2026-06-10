// @vitest-environment jsdom
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

const FEED_CONTAINER = "container-update-list_mainFeed-lazy-container"
const POST_ROOT = `[componentkey='${FEED_CONTAINER}'] > div[data-display-contents="true"] > div`

const buildFeedDOM = (postContents) => {
  const postDivs = postContents.map((c) => `<div>${c}</div>`).join('')
  document.body.innerHTML = `
    <div componentkey="${FEED_CONTAINER}">
      <div data-display-contents="true">
        ${postDivs}
      </div>
    </div>`
  return document.querySelectorAll(POST_ROOT)
}

let doFeed

beforeEach(async () => {
  vi.resetModules()
  vi.useFakeTimers()
  doFeed = (await import('../../src/features/feed.js')).default
  vi.spyOn(window, 'alert').mockImplementation(() => {})
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

// checkNeedUpdate that never triggers any special-case path
const neverTrigger = () => false
const baseConfig = { 'feed-keywords': '', 'hide-by-age': 'disabled' }

// ---------------------------------------------------------------------------
// runBlockPosts — keyword matching
// ---------------------------------------------------------------------------

describe('runBlockPosts - keyword matching', () => {
  it('hides a post whose outerHTML contains a matched keyword', () => {
    const posts = buildFeedDOM(['Post 1', 'Post 2', 'Post 3', 'Promoted post', 'Post 5', 'Post 6'])

    doFeed(neverTrigger, true, 'hide', { ...baseConfig, 'hide-promoted': true })
    vi.advanceTimersByTime(350)

    const promoted = Array.from(posts).find((p) => p.textContent.includes('Promoted'))
    expect(promoted.classList.contains('hide')).toBe(true)
  })

  it('sets data-hidden=false on posts that do not match any keyword', () => {
    const posts = buildFeedDOM(['Post 1', 'Post 2', 'Post 3', 'Promoted post', 'Post 5', 'Post 6'])

    doFeed(neverTrigger, true, 'hide', { ...baseConfig, 'hide-promoted': true })
    vi.advanceTimersByTime(350)

    Array.from(posts)
      .filter((p) => !p.textContent.includes('Promoted'))
      .forEach((p) => expect(p.dataset.hidden).toBe('false'))
  })

  it('applies dim class instead of hide when mode is dim', () => {
    buildFeedDOM(['Promoted post'])

    doFeed(neverTrigger, true, 'dim', { ...baseConfig, 'hide-promoted': true })
    vi.advanceTimersByTime(350)

    const post = document.querySelector(POST_ROOT)
    expect(post.classList.contains('dim')).toBe(true)
    expect(post.classList.contains('hide')).toBe(false)
  })

  it('removes existing hide classes from posts that no longer match', () => {
    const posts = buildFeedDOM(['Post 1', 'Post 2', 'Post 3', 'Post 4', 'Post 5', 'Post 6'])
    posts[0].classList.add('hide', 'showIcon')

    doFeed(neverTrigger, true, 'hide', { ...baseConfig, 'hide-promoted': true })
    vi.advanceTimersByTime(350)

    expect(posts[0].classList.contains('hide')).toBe(false)
    expect(posts[0].classList.contains('showIcon')).toBe(false)
    expect(posts[0].dataset.hidden).toBe('false')
  })

  it('hides a post that matches any one keyword when multiple keywords are active', () => {
    // Kills the some→every mutation: posts contain only ONE of the two active keywords,
    // so `every` would leave them unblocked while `some` correctly hides them.
    const posts = buildFeedDOM([
      'P1', 'P2', 'P3', 'P4',
      'Promoted post',    // matches 'Promoted' but not 'video'
      'Watch this video', // matches 'video' but not 'Promoted'
    ])

    doFeed(neverTrigger, true, 'hide', {
      ...baseConfig,
      'hide-promoted': true,
      'hide-videos': true,
    })
    vi.advanceTimersByTime(350)

    const promoted = Array.from(posts).find((p) => p.textContent.includes('Promoted'))
    const video    = Array.from(posts).find((p) => p.textContent.includes('video'))
    expect(promoted.classList.contains('hide')).toBe(true)
    expect(video.classList.contains('hide')).toBe(true)
  })

  it('does not start the interval when there are no keywords', () => {
    const posts = buildFeedDOM(['P1', 'P2', 'P3', 'P4', 'P5', 'P6'])

    doFeed(neverTrigger, true, 'hide', baseConfig)
    vi.advanceTimersByTime(350)

    posts.forEach((p) => expect(p.dataset.hidden).toBeUndefined())
  })
})

// ---------------------------------------------------------------------------
// runBlockPosts — post count prompt
// ---------------------------------------------------------------------------

describe('runBlockPosts - post count prompt', () => {
  it('shows an alert when fewer than 6 posts are loaded in hide mode', () => {
    buildFeedDOM(['Post 1', 'Post 2', 'Post 3'])

    doFeed(neverTrigger, true, 'hide', { ...baseConfig, 'hide-promoted': true })
    vi.advanceTimersByTime(350)

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Scroll down'))
  })

  it('does not show the alert when there are 6 or more posts', () => {
    buildFeedDOM(['P1', 'P2', 'P3', 'P4', 'P5', 'P6'])

    doFeed(neverTrigger, true, 'hide', { ...baseConfig, 'hide-promoted': true })
    vi.advanceTimersByTime(350)

    expect(window.alert).not.toHaveBeenCalled()
  })

  it('does not show the alert when disable-postcount-prompt is true', () => {
    buildFeedDOM(['Post 1', 'Post 2', 'Post 3'])

    doFeed(neverTrigger, true, 'hide', {
      ...baseConfig,
      'hide-promoted': true,
      'disable-postcount-prompt': true,
    })
    vi.advanceTimersByTime(350)

    expect(window.alert).not.toHaveBeenCalled()
  })

  it('shows the alert only once when the interval fires multiple times', () => {
    buildFeedDOM(['Post 1', 'Post 2', 'Post 3'])

    doFeed(neverTrigger, true, 'hide', { ...baseConfig, 'hide-promoted': true })
    vi.advanceTimersByTime(350) // first tick → alert fires, postCountPrompted = true
    vi.advanceTimersByTime(350) // second tick → no repeat

    expect(window.alert).toHaveBeenCalledTimes(1)
  })

  it('does not show the alert in dim mode regardless of post count', () => {
    buildFeedDOM(['Post 1', 'Post 2'])

    // dim mode bypasses the 5-post minimum — filtering runs, no prompt
    doFeed(neverTrigger, true, 'dim', { ...baseConfig, 'hide-promoted': true })
    vi.advanceTimersByTime(350)

    expect(window.alert).not.toHaveBeenCalled()
  })

  it('shows an alert when there are exactly 5 posts in hide mode', () => {
    buildFeedDOM(['P1', 'P2', 'P3', 'P4', 'P5'])

    doFeed(neverTrigger, true, 'hide', { ...baseConfig, 'hide-promoted': true })
    vi.advanceTimersByTime(350)

    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Scroll down'))
  })
})

// ---------------------------------------------------------------------------
// enabled flag
// ---------------------------------------------------------------------------

describe('enabled flag', () => {
  it('does not start the interval when enabled is false', () => {
    const posts = buildFeedDOM(['P1', 'P2', 'P3', 'P4', 'P5', 'P6'])

    doFeed(neverTrigger, false, 'hide', { ...baseConfig, 'hide-promoted': true })
    vi.advanceTimersByTime(350)

    posts.forEach((p) => expect(p.dataset.hidden).toBeUndefined())
  })
})

// ---------------------------------------------------------------------------
// main-toggle / hide-whole-feed guards
// ---------------------------------------------------------------------------

describe('main-toggle and hide-whole-feed', () => {
  it('does not start the interval when main-toggle triggers handleToggledOff', () => {
    const posts = buildFeedDOM(['P1', 'P2', 'P3'])
    const triggerToggleOff = (field, bool) => field === 'main-toggle' && bool === false

    doFeed(triggerToggleOff, true, 'hide', { ...baseConfig, 'hide-promoted': true })
    vi.advanceTimersByTime(350)

    posts.forEach((p) => expect(p.dataset.hidden).toBeUndefined())
  })

  it('hides the feed element on /feed/ when hide-whole-feed is triggered', () => {
    document.body.innerHTML = `
      <div componentkey="${FEED_CONTAINER}"></div>`
    vi.stubGlobal('location', { pathname: '/feed/' })
    const triggerHideWholeFeed = (field, bool) => field === 'hide-whole-feed' && bool === true

    doFeed(triggerHideWholeFeed, true, 'hide', baseConfig)

    const feed = document.querySelector(`[componentkey='${FEED_CONTAINER}']`)
    expect(feed.classList.contains('hide')).toBe(true)
  })

  it('shows the feed element on /feed/ when handleFilterFeed runs', () => {
    document.body.innerHTML = `
      <div componentkey="${FEED_CONTAINER}" class="hide"></div>
      <div componentkey="${FEED_CONTAINER}">
        <div data-display-contents="true"></div>
      </div>`
    vi.stubGlobal('location', { pathname: '/feed/' })

    doFeed(neverTrigger, true, 'hide', { ...baseConfig, 'hide-promoted': true })

    const feed = document.querySelector(`[componentkey='${FEED_CONTAINER}']`)
    expect(feed.classList.contains('hide')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// resetShownPosts guard (oldFeedKeywords.some)
// ---------------------------------------------------------------------------

describe('resetShownPosts guard', () => {
  it('does not call resetShownPosts when no keywords have been removed', () => {
    // Pre-populate posts as "shown" (data-hidden=false) before first call.
    // oldFeedKeywords is [] initially, so some() → false → resetShownPosts NOT called.
    const posts = buildFeedDOM(['P1', 'P2', 'P3'])
    posts.forEach((p) => p.setAttribute('data-hidden', 'false'))

    doFeed(neverTrigger, true, 'hide', { ...baseConfig, 'hide-promoted': true })

    posts.forEach((p) => expect(p.dataset.hidden).toBe('false'))
  })

  it('calls resetShownPosts when a keyword is removed from config', () => {
    // Call 1: two keywords → all 6 posts get data-hidden=false after interval tick.
    const posts = buildFeedDOM(['P1', 'P2', 'P3', 'P4', 'P5', 'P6'])
    doFeed(neverTrigger, true, 'hide', {
      ...baseConfig,
      'hide-promoted': true,
      'hide-videos': true,
    })
    vi.advanceTimersByTime(350)
    posts.forEach((p) => expect(p.dataset.hidden).toBe('false'))

    // Call 2: remove hide-videos → oldFeedKeywords has 'video' which is no longer in
    // new keywords → some() → true → resetShownPosts removes data-hidden from shown posts.
    doFeed(neverTrigger, true, 'hide', { ...baseConfig, 'hide-promoted': true })

    posts.forEach((p) => expect(p.dataset.hidden).toBeUndefined())
  })
})

// ---------------------------------------------------------------------------
// handleSortByRecent
// ---------------------------------------------------------------------------

describe('handleSortByRecent', () => {
  it('clicks the dropdown trigger and recent option when sort-by-recent is triggered on /feed/', async () => {
    vi.stubGlobal('location', { pathname: '/feed/' })
    document.body.innerHTML = `
      <div data-view-name="feed-nav-feed-sort-toggle"></div>
      <div data-view-name="feed-sort-view-set-recent"></div>`

    const triggerSort = (field, bool) => field === 'sort-by-recent' && bool === true
    const dropdown = document.querySelector('[data-view-name="feed-nav-feed-sort-toggle"]')
    const recent   = document.querySelector('[data-view-name="feed-sort-view-set-recent"]')
    const clickDropdown = vi.spyOn(dropdown, 'click')
    const clickRecent   = vi.spyOn(recent,   'click')

    doFeed(triggerSort, true, 'hide', baseConfig)
    await vi.advanceTimersByTimeAsync(0)

    expect(clickDropdown).toHaveBeenCalled()
    expect(clickRecent).toHaveBeenCalled()
  })

  it('does not click anything when sort-by-recent is triggered but not on /feed/', async () => {
    // pathname defaults to '/' in jsdom — not /feed/
    document.body.innerHTML = `
      <div data-view-name="feed-nav-feed-sort-toggle"></div>
      <div data-view-name="feed-sort-view-set-recent"></div>`

    const triggerSort = (field, bool) => field === 'sort-by-recent' && bool === true
    const dropdown = document.querySelector('[data-view-name="feed-nav-feed-sort-toggle"]')
    const clickDropdown = vi.spyOn(dropdown, 'click')

    doFeed(triggerSort, true, 'hide', baseConfig)
    await vi.advanceTimersByTimeAsync(0)

    expect(clickDropdown).not.toHaveBeenCalled()
  })
})
