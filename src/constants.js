export const FEED_SELECTORS = [
  '[data-id*="urn:li:activity"]',
  '[data-id*="urn:li:aggregate"]',
]

export const JOB_SELECTORS = [
  '[data-job-id]',
  '[data-occludable-job-id]',
  '.discovery-templates-vertical-list__list-item',
]

export const PRISTINE_SELECTOR = ':not([data-hidden])'

export const VISIBLE_SELECTOR = '[data-hidden=false]'

export const BLOCKED_SELECTOR = '[data-hidden=true]'
