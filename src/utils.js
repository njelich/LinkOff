import {
  BLOCKED_SELECTOR,
  FEED_SELECTORS,
  JOB_SELECTORS,
  PRISTINE_SELECTOR,
  VISIBLE_SELECTOR,
} from './constants.js'

const checkElementAndPlaceholderBySelector = (selector, scope = undefined) => {
  const found = (scope ?? document).querySelectorAll(selector)

  if (found.length > 0) {
    return Array.from(found).some((element) =>
      element.innerHTML.includes('skeleton')
    )
  }

  return true
}

const checkElementAndPlaceholderByClassName = (className) => {
  const found = document.getElementsByClassName(className)

  if (found.length > 0) {
    return Array.from(found).some((element) =>
      element.innerHTML.includes('skeleton')
    )
  }

  return true
}

export const waitForSelectorScoped = async (selector, scope) => {
  while (checkElementAndPlaceholderBySelector(`:scope ${selector}`, scope)) {
    await new Promise((resolve) => {
      requestAnimationFrame(resolve)
    })
  }

  return scope.querySelector(`:scope ${selector}`)
}

export const waitForSelector = async (selector) => {
  while (checkElementAndPlaceholderBySelector(selector)) {
    await new Promise((resolve) => {
      requestAnimationFrame(resolve)
    })
  }

  return document.querySelector(selector)
}

export const waitForClassName = async (className) => {
  while (checkElementAndPlaceholderByClassName(className)) {
    await new Promise((resolve) => {
      requestAnimationFrame(resolve)
    })
  }

  return document.getElementsByClassName(className)
}

const forceCallback = (condition, cb) => {
  let runs = 0

  const interval = setInterval(() => {
    if (condition() || runs >= 10) {
      clearInterval(interval)
      return
    }

    cb()
    runs += 1
  }, 350)
}

export const hideByClassName = async (className, mode, showIcon = true) => {
  const elements = await waitForClassName(className)

  for (let el of elements) {
    el.classList.remove('hide', 'dim', 'showIcon')
    el.classList.add(mode)

    if (showIcon) {
      el.classList.add('showIcon')
    }

    forceCallback(
      () => el.classList.contains(mode),
      () => {
        el.classList.remove('hide', 'dim', 'showIcon')
        el.classList.add(mode)

        if (showIcon) {
          el.classList.add('showIcon')
        }
      }
    )
  }
}

export const hideByClassNameAndIndex = async (
  className,
  index,
  mode,
  showIcon = true
) => {
  const elements = await waitForClassName(className)
  const element = elements[index]

  element.classList.remove('hide', 'dim', 'showIcon')
  element.classList.add(mode, showIcon && 'showIcon')
}

export const showByClassName = async (className) => {
  const elements = await waitForClassName(className)
  for (let el of elements) el.classList.remove('hide', 'dim', 'showIcon')
}

export const showByClassNameAndIndex = async (className, index) => {
  const elements = await waitForClassName(className)
  const element = elements[index]

  element.classList.remove('hide', 'dim', 'showIcon')
}

export const getCustomSelectors = (selectors, type) => {
  let result = []

  switch (type) {
    case 'all':
      result = selectors
      break
    case 'blocked':
      result = selectors.map((selector) => `${selector}${BLOCKED_SELECTOR}`)
      break
    case 'shown':
      result = selectors.map((selector) => `${selector}${VISIBLE_SELECTOR}`)
      break
    case 'pristine':
      result = selectors.map(
        (selector) =>
          `${selector}${VISIBLE_SELECTOR},${selector}${PRISTINE_SELECTOR}`
      )
      break
  }

  return result.join(',')
}

export const resetShownPosts = () => {
  console.log('LinkOff: Reset shown posts')

  let posts = document.querySelectorAll(
    getCustomSelectors(FEED_SELECTORS, 'shown')
  )

  posts.forEach((post) => {
    post.classList.remove('hide', 'dim', 'showIcon')
    delete post.dataset.hidden
  })
}

export const resetBlockedPosts = () => {
  console.log(`LinkOff: Resetting blocked posts`)

  let posts = document.querySelectorAll(
    getCustomSelectors(FEED_SELECTORS, 'blocked')
  )

  posts.forEach((post) => {
    post.classList.remove('hide', 'dim', 'showIcon')
    delete post.dataset.hidden
  })
}

export const resetJobs = () => {
  console.log('LinkOff: Reset shown jobs')

  let posts = document.querySelectorAll(
    getCustomSelectors(JOB_SELECTORS, 'all')
  )

  posts.forEach((post) => {
    post.classList.remove('hide', 'dim', 'showIcon')
    delete post.dataset.hidden
  })
}


export const hideAncestorByChildClassName = async (childClassName, ancestorSelector, mode, showIcon = true) => {
  const elements = await waitForClassName(childClassName)

  for (let el of elements) {
    const parent = el.closest(ancestorSelector)

    if (!parent) return

    parent.classList.remove('hide', 'dim', 'showIcon')
    parent.classList.add(mode)

    if (showIcon) {
      parent.classList.add('showIcon')
    }

    forceCallback(
      () => parent.classList.contains(mode),
      () => {
        parent.classList.remove('hide', 'dim', 'showIcon')
        parent.classList.add(mode)

        if (showIcon) {
          parent.classList.add('showIcon')
        }
      }
    )
  }
}

export const showAncestorByChildClassName = async (childClassName, ancestorSelector) => {
  const elements = await waitForClassName(childClassName)
  for (let el of elements) {

    el.closest(ancestorSelector)?.classList.remove('hide', 'dim', 'showIcon')
  }
}