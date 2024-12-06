import { JOB_SELECTORS } from '../constants.js'
import {
  getCustomSelectors,
  hideByClassName,
  resetJobs,
  showByClassName,
} from '../utils.js'

let runs = 0
let jobKeywordInterval
let jobKeywords = []
let oldJobKeywords = []

const getJobKeywords = (response) => {
  let jobKeywords =
    response['job-keywords'] == '' ? [] : response['job-keywords'].split(',')

  if (response['hide-promoted-jobs']) {
    jobKeywords.push('Promoted')
  }

  console.log('LinkOff: Current job keywords are', jobKeywords)
  return jobKeywords
}

const blockByJobKeywords = (keywords, mode) => {
  if (!window.location.href.startsWith('https://www.linkedin.com/jobs/')) return

  if (oldJobKeywords.some((kw) => !keywords.includes(kw))) {
    resetJobs()
  }

  oldJobKeywords = keywords

  let posts

  if (keywords.length)
    jobKeywordInterval = setInterval(() => {
      if (runs % 10 === 0) resetJobs()

      posts = document.querySelectorAll(
        getCustomSelectors(JOB_SELECTORS, 'all')
      )

      console.log(`LinkOff: Found ${posts.length} unblocked jobs`)

      posts.forEach((post) => {
        let keywordIndex
        if (
          keywords.some((keyword, index) => {
            keywordIndex = index
            return (
              post.innerHTML.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
            )
          })
        ) {
          post.classList.add(mode, 'showIcon')

          console.log(
            `LinkOff: Blocked job ${post.getAttribute(
              'data-occludable-job-id'
            )} for keyword ${keywords[keywordIndex]}`
          )
        } else {
          post.classList.remove('hide', 'dim', 'showIcon')
        }
      })

      runs++
    }, 350)
}

const resetAll = () => {
  clearInterval(jobKeywordInterval)
  resetJobs()
  showJobGuidance()
  showAiButton()
}

// Show/Hide Job Guidance
const showJobGuidance = () => {
  showByClassName('artdeco-card mb2 pt5')
}
const handleJobGuidance = (getRes, mode) => {
  if (getRes('hide-job-guidance', true)) {
    hideByClassName('artdeco-card mb2 pt5', mode)
  } else if (
    getRes('main-toggle', false) ||
    getRes('hide-job-guidance', false)
  ) {
    showJobGuidance()
  }
}

// Show/Hide AI Button
const showAiButton = () => {
  showByClassName('ember-view link-without-hover-state artdeco-button')
}

const handleAiButton = (getRes, mode) => {
  if (getRes('hide-ai-button', true)) {
    hideByClassName(
      'ember-view link-without-hover-state artdeco-button',
      mode,
      false
    )
  } else if (getRes('main-toggle', false) || getRes('hide-ai-button', false)) {
    showAiButton()
  }
}

export default (getRes, enabled, mode, response) => {
  if (getRes('main-toggle', false)) {
    resetAll()

    return
  }

  if (!enabled) return

  jobKeywords = getJobKeywords(response)

  // Hide by keywords
  if (jobKeywords !== oldJobKeywords || jobKeywords.length === 0) {
    resetAll()

    blockByJobKeywords(jobKeywords, mode)
  }

  handleJobGuidance(getRes, mode)

  handleAiButton(getRes, mode)
}
