// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import {
  removeHideClasses,
  hideBySelector,
  showBySelector,
  hideParentBySelector,
  showParentBySelector,
  hideAncestorIndexBySelector,
  showAncestorIndexBySelector,
  hidePost,
  resetShownPosts,
  resetBlockedPosts,
  resetJobs,
} from '../src/utils.js'

beforeEach(() => {
  document.body.innerHTML = ''
})

// ---------------------------------------------------------------------------
// removeHideClasses
// ---------------------------------------------------------------------------

describe('removeHideClasses', () => {
  it('removes the hide class', () => {
    const el = document.createElement('div')
    el.classList.add('hide')
    removeHideClasses(el)
    expect(el.classList.contains('hide')).toBe(false)
  })

  it('removes the dim class', () => {
    const el = document.createElement('div')
    el.classList.add('dim')
    removeHideClasses(el)
    expect(el.classList.contains('dim')).toBe(false)
  })

  it('removes the showIcon class', () => {
    const el = document.createElement('div')
    el.classList.add('showIcon')
    removeHideClasses(el)
    expect(el.classList.contains('showIcon')).toBe(false)
  })

  it('removes all three at once', () => {
    const el = document.createElement('div')
    el.classList.add('hide', 'dim', 'showIcon')
    removeHideClasses(el)
    expect(el.classList.length).toBe(0)
  })

  it('leaves unrelated classes intact', () => {
    const el = document.createElement('div')
    el.classList.add('hide', 'my-class')
    removeHideClasses(el)
    expect(el.classList.contains('my-class')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// hideBySelector
// ---------------------------------------------------------------------------

describe('hideBySelector', () => {
  it('adds the mode class to the matching element', async () => {
    document.body.innerHTML = '<div class="target">content</div>'
    await hideBySelector('.target', 'hide')
    expect(document.querySelector('.target').classList.contains('hide')).toBe(true)
  })

  it('adds the showIcon class by default', async () => {
    document.body.innerHTML = '<div class="target">content</div>'
    await hideBySelector('.target', 'hide')
    expect(document.querySelector('.target').classList.contains('showIcon')).toBe(true)
  })

  it('does not add showIcon when showIcon is false', async () => {
    document.body.innerHTML = '<div class="target">content</div>'
    await hideBySelector('.target', 'hide', false)
    expect(document.querySelector('.target').classList.contains('showIcon')).toBe(false)
  })

  it('clears existing hide classes before applying the new mode', async () => {
    document.body.innerHTML = '<div class="target dim">content</div>'
    await hideBySelector('.target', 'hide')
    const el = document.querySelector('.target')
    expect(el.classList.contains('dim')).toBe(false)
    expect(el.classList.contains('hide')).toBe(true)
  })

  it('applies to every element when given an array of selectors', async () => {
    document.body.innerHTML = '<div class="a">a</div><div class="b">b</div>'
    await hideBySelector(['.a', '.b'], 'dim')
    expect(document.querySelector('.a').classList.contains('dim')).toBe(true)
    expect(document.querySelector('.b').classList.contains('dim')).toBe(true)
  })

  it('works with the dim mode', async () => {
    document.body.innerHTML = '<div class="target">content</div>'
    await hideBySelector('.target', 'dim')
    expect(document.querySelector('.target').classList.contains('dim')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// showBySelector
// ---------------------------------------------------------------------------

describe('showBySelector', () => {
  it('removes hide, dim, and showIcon from the matching element', async () => {
    document.body.innerHTML = '<div class="target hide dim showIcon">content</div>'
    await showBySelector('.target')
    const el = document.querySelector('.target')
    expect(el.classList.contains('hide')).toBe(false)
    expect(el.classList.contains('dim')).toBe(false)
    expect(el.classList.contains('showIcon')).toBe(false)
  })

  it('leaves unrelated classes intact', async () => {
    document.body.innerHTML = '<div class="target hide other">content</div>'
    await showBySelector('.target')
    expect(document.querySelector('.target').classList.contains('other')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// hideParentBySelector
// ---------------------------------------------------------------------------

describe('hideParentBySelector', () => {
  it('adds the mode class to the parent of the matching element', async () => {
    document.body.innerHTML = '<div class="parent"><span class="child">content</span></div>'
    await hideParentBySelector('.child', 'hide')
    expect(document.querySelector('.parent').classList.contains('hide')).toBe(true)
  })

  it('adds showIcon to the parent by default', async () => {
    document.body.innerHTML = '<div class="parent"><span class="child">content</span></div>'
    await hideParentBySelector('.child', 'hide')
    expect(document.querySelector('.parent').classList.contains('showIcon')).toBe(true)
  })

  it('does not add showIcon to the parent when showIcon is false', async () => {
    document.body.innerHTML = '<div class="parent"><span class="child">content</span></div>'
    await hideParentBySelector('.child', 'hide', false)
    expect(document.querySelector('.parent').classList.contains('showIcon')).toBe(false)
  })

  it('clears existing hide classes from the parent before applying the new mode', async () => {
    document.body.innerHTML = '<div class="parent dim"><span class="child">content</span></div>'
    await hideParentBySelector('.child', 'hide')
    const parent = document.querySelector('.parent')
    expect(parent.classList.contains('dim')).toBe(false)
    expect(parent.classList.contains('hide')).toBe(true)
  })

  it('does not affect the child element itself', async () => {
    document.body.innerHTML = '<div class="parent"><span class="child">content</span></div>'
    await hideParentBySelector('.child', 'hide')
    expect(document.querySelector('.child').classList.contains('hide')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// showParentBySelector
// ---------------------------------------------------------------------------

describe('showParentBySelector', () => {
  it('removes hide classes from the parent of the matching element', async () => {
    document.body.innerHTML =
      '<div class="parent hide dim showIcon"><span class="child">content</span></div>'
    await showParentBySelector('.child')
    const parent = document.querySelector('.parent')
    expect(parent.classList.contains('hide')).toBe(false)
    expect(parent.classList.contains('dim')).toBe(false)
    expect(parent.classList.contains('showIcon')).toBe(false)
  })

  it('leaves unrelated classes on the parent intact', async () => {
    document.body.innerHTML =
      '<div class="parent hide other"><span class="child">content</span></div>'
    await showParentBySelector('.child')
    expect(document.querySelector('.parent').classList.contains('other')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// hideAncestorIndexBySelector
// ---------------------------------------------------------------------------

describe('hideAncestorIndexBySelector', () => {
  it('hides the ancestor at the given depth', async () => {
    document.body.innerHTML = `
      <div class="grandparent">
        <div class="parent">
          <span class="child">content</span>
        </div>
      </div>`
    await hideAncestorIndexBySelector('.child', 2, 'hide')
    expect(document.querySelector('.grandparent').classList.contains('hide')).toBe(true)
  })

  it('adds showIcon by default', async () => {
    document.body.innerHTML = '<div class="gp"><div class="p"><span class="c">x</span></div></div>'
    await hideAncestorIndexBySelector('.c', 2, 'hide')
    expect(document.querySelector('.gp').classList.contains('showIcon')).toBe(true)
  })

  it('does not add showIcon when showIcon is false', async () => {
    document.body.innerHTML = '<div class="gp"><div class="p"><span class="c">x</span></div></div>'
    await hideAncestorIndexBySelector('.c', 2, 'hide', false)
    expect(document.querySelector('.gp').classList.contains('showIcon')).toBe(false)
  })

  it('hides the direct parent at depth 1', async () => {
    document.body.innerHTML = '<div class="parent"><span class="child">x</span></div>'
    await hideAncestorIndexBySelector('.child', 1, 'dim')
    expect(document.querySelector('.parent').classList.contains('dim')).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// showAncestorIndexBySelector
// ---------------------------------------------------------------------------

describe('showAncestorIndexBySelector', () => {
  it('removes hide classes from the ancestor at the given depth', async () => {
    document.body.innerHTML = `
      <div class="grandparent hide dim showIcon">
        <div class="parent">
          <span class="child">content</span>
        </div>
      </div>`
    await showAncestorIndexBySelector('.child', 2)
    const gp = document.querySelector('.grandparent')
    expect(gp.classList.contains('hide')).toBe(false)
    expect(gp.classList.contains('dim')).toBe(false)
    expect(gp.classList.contains('showIcon')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// hidePost
// ---------------------------------------------------------------------------

describe('hidePost', () => {
  it('adds the mode class', () => {
    const post = document.createElement('div')
    hidePost(post, 'hide')
    expect(post.classList.contains('hide')).toBe(true)
  })

  it('adds the showIcon class', () => {
    const post = document.createElement('div')
    hidePost(post, 'hide')
    expect(post.classList.contains('showIcon')).toBe(true)
  })

  it('sets dataset.hidden to true', () => {
    const post = document.createElement('div')
    hidePost(post, 'hide')
    expect(post.dataset.hidden).toBe('true')
  })

  it('onclick removes hide, dim, and showIcon classes', () => {
    const post = document.createElement('div')
    hidePost(post, 'hide')
    post.onclick()
    expect(post.classList.contains('hide')).toBe(false)
    expect(post.classList.contains('showIcon')).toBe(false)
  })

  it('onclick sets dataset.hidden to "shown"', () => {
    const post = document.createElement('div')
    hidePost(post, 'hide')
    post.onclick()
    expect(post.dataset.hidden).toBe('shown')
  })

  it('onclick also clears the dim class', () => {
    const post = document.createElement('div')
    hidePost(post, 'dim')
    post.onclick()
    expect(post.classList.contains('dim')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Helpers for feed post DOM structure
// ---------------------------------------------------------------------------

const FEED_CONTAINER = "container-update-list_mainFeed-lazy-container"

const buildFeedPost = (dataHidden, classes = []) => {
  document.body.innerHTML = `
    <div componentkey="${FEED_CONTAINER}">
      <div data-display-contents="true">
        <div data-hidden="${dataHidden}" class="${classes.join(' ')}">Post</div>
      </div>
    </div>`
  return document.querySelector(
    `[componentkey="${FEED_CONTAINER}"] > div > div`
  )
}

// ---------------------------------------------------------------------------
// resetShownPosts
// ---------------------------------------------------------------------------

describe('resetShownPosts', () => {
  it('removes hide classes from posts with data-hidden=false', () => {
    const post = buildFeedPost('false', ['hide', 'showIcon'])
    resetShownPosts()
    expect(post.classList.contains('hide')).toBe(false)
    expect(post.classList.contains('showIcon')).toBe(false)
  })

  it('deletes dataset.hidden from shown posts', () => {
    const post = buildFeedPost('false')
    resetShownPosts()
    expect(post.dataset.hidden).toBeUndefined()
  })

  it('does not touch posts with data-hidden=true', () => {
    const post = buildFeedPost('true', ['hide'])
    resetShownPosts()
    expect(post.classList.contains('hide')).toBe(true)
    expect(post.dataset.hidden).toBe('true')
  })
})

// ---------------------------------------------------------------------------
// resetBlockedPosts
// ---------------------------------------------------------------------------

describe('resetBlockedPosts', () => {
  it('removes hide classes from posts with data-hidden=true', () => {
    const post = buildFeedPost('true', ['hide', 'showIcon'])
    resetBlockedPosts()
    expect(post.classList.contains('hide')).toBe(false)
    expect(post.classList.contains('showIcon')).toBe(false)
  })

  it('deletes dataset.hidden from blocked posts', () => {
    const post = buildFeedPost('true')
    resetBlockedPosts()
    expect(post.dataset.hidden).toBeUndefined()
  })

  it('does not touch posts with data-hidden=false', () => {
    const post = buildFeedPost('false', ['hide'])
    resetBlockedPosts()
    expect(post.classList.contains('hide')).toBe(true)
    expect(post.dataset.hidden).toBe('false')
  })
})

// ---------------------------------------------------------------------------
// resetJobs
// ---------------------------------------------------------------------------

describe('resetJobs', () => {
  it('removes hide classes from .job-card-container elements', () => {
    document.body.innerHTML =
      '<div class="job-card-container hide showIcon" data-hidden="true">job</div>'
    const card = document.querySelector('.job-card-container')
    resetJobs()
    expect(card.classList.contains('hide')).toBe(false)
    expect(card.classList.contains('showIcon')).toBe(false)
  })

  it('deletes dataset.hidden from .job-card-container elements', () => {
    document.body.innerHTML =
      '<div class="job-card-container" data-hidden="true">job</div>'
    const card = document.querySelector('.job-card-container')
    resetJobs()
    expect(card.dataset.hidden).toBeUndefined()
  })

  it('removes hide classes from div[data-job-id] elements', () => {
    document.body.innerHTML =
      '<div data-job-id="123" class="dim showIcon" data-hidden="true">job</div>'
    const card = document.querySelector('[data-job-id]')
    resetJobs()
    expect(card.classList.contains('dim')).toBe(false)
  })

  it('deletes dataset.hidden from div[data-job-id] elements', () => {
    document.body.innerHTML =
      '<div data-job-id="123" class="dim" data-hidden="true">job</div>'
    const card = document.querySelector('[data-job-id]')
    resetJobs()
    expect(card.dataset.hidden).toBeUndefined()
  })
})
