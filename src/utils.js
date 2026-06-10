import {
  BLOCKED_SELECTOR,
  JOB_SELECTORS,
  POST_SELECTOR,
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

export const removeHideClasses = (element) => {
  element.classList.remove('hide', 'dim', 'showIcon')
}

const resolveSelector = (selectors) =>
  Array.isArray(selectors) ? selectors.join(',') : selectors

const applyHide = (target, mode, showIcon) => {
  removeHideClasses(target)
  target.classList.add(mode)
  if (showIcon) target.classList.add('showIcon')
}

const resetBySelector = (selector) => {
  document.querySelectorAll(selector).forEach((el) => {
    removeHideClasses(el)
    delete el.dataset.hidden
  })
}

export const waitForSelector = async (selector) => {
  while (checkElementAndPlaceholderBySelector(selector)) {
    await new Promise((resolve) => {
      requestAnimationFrame(resolve)
    })
  }

  return document.querySelector(selector)
}

export const waitForSelectorAll = async (selector) => {
  while (checkElementAndPlaceholderBySelector(selector)) {
    await new Promise((resolve) => {
      requestAnimationFrame(resolve)
    })
  }

  return document.querySelectorAll(selector)
}

export const hideBySelector = async (selectors, mode, showIcon = true) => {
  const elements = await waitForSelectorAll(resolveSelector(selectors))
  for (const el of elements) applyHide(el, mode, showIcon)
}

export const showBySelector = async (selectors) => {
  const elements = await waitForSelectorAll(resolveSelector(selectors))
  for (const el of elements) removeHideClasses(el)
}

export const hideParentBySelector = async (selectors, mode, showIcon = true) => {
  const elements = await waitForSelectorAll(resolveSelector(selectors))
  for (const el of elements) applyHide(el.parentElement, mode, showIcon)
}

export const showParentBySelector = async (selectors) => {
  const elements = await waitForSelectorAll(resolveSelector(selectors))
  for (const el of elements) removeHideClasses(el.parentElement)
}

export const hideAncestorIndexBySelector = async (selectors, index, mode, showIcon = true) => {
  const elements = await waitForSelectorAll(resolveSelector(selectors))
  for (const el of elements) {
    let ancestor = el
    for (let i = 1; i <= index; i++) ancestor = ancestor.parentElement
    applyHide(ancestor, mode, showIcon)
  }
}

export const showAncestorIndexBySelector = async (selectors, index) => {
  const elements = await waitForSelectorAll(resolveSelector(selectors))
  for (const el of elements) {
    let ancestor = el
    for (let i = 1; i <= index; i++) ancestor = ancestor.parentElement
    removeHideClasses(ancestor)
  }
}

export const getCustomSelector = (selectors, type) => {
  let result = []

  const arr = Array.isArray(selectors) ? selectors : [selectors]

  switch (type) {
    case 'all':
      result = arr
      break
    case 'blocked':
      result = arr.map((selector) => `${selector}${BLOCKED_SELECTOR}`)
      break
    case 'shown':
      result = arr.map((selector) => `${selector}${VISIBLE_SELECTOR}`)
      break
    case 'pristine':
      result = arr.map(
        (selector) =>
          `${selector}${VISIBLE_SELECTOR},${selector}${PRISTINE_SELECTOR}`
      )
      break
  }

  return result.join(',')
}

export const hidePost = (post, mode) => {
  post.classList.add(mode, 'showIcon')

  post.onclick = () => {
    post.classList.remove('hide', 'dim', 'showIcon')
    post.dataset.hidden = 'shown'
  }

  // Add attribute to track already hidden posts
  post.dataset.hidden = true
}

export const resetShownPosts = () => {
  console.log('LinkOff: Reset shown posts')
  resetBySelector(getCustomSelector(POST_SELECTOR, 'shown'))
}

export const resetBlockedPosts = () => {
  console.log('LinkOff: Resetting blocked posts')
  resetBySelector(getCustomSelector(POST_SELECTOR, 'blocked'))
}

export const resetJobs = () => {
  console.log('LinkOff: Reset shown jobs')
  resetBySelector(getCustomSelector(JOB_SELECTORS, 'all'))
}

export const hideAncestorByChildSelector = async (
  childSelector,
  ancestorSelector,
  mode,
  showIcon = true
) => {
  const selector = Array.isArray(childSelector)
    ? childSelector.join(',')
    : childSelector

  const elements = await waitForSelectorAll(selector)

  for (let el of elements) {
    const parent = el.closest(ancestorSelector)

    if (!parent) return

    removeHideClasses(parent)
    parent.classList.add(mode)

    parent.dataset.hidden = true

    if (showIcon) {
      parent.classList.add('showIcon')
    }
  }
}

export const showAncestorByChildSelector = async (
  childSelector,
  ancestorSelector
) => {
  const elements = await waitForSelectorAll(childSelector)
  for (let el of elements) {
    const ancestor = el.closest(ancestorSelector)

    if (!ancestor) return

    removeHideClasses(ancestor)

    ancestor.dataset.hidden = false
  }
}

export const shallowEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) return false
    if (obj1[key] !== obj2[key]) return false
  }

  return true
}
