import { JOB_SELECTORS } from '../constants.js'
import { getCustomSelector, resetJobs } from '../utils.js'

let runs = 0
let jobKeywordInterval
let jobKeywords = []
let oldJobKeywords = []

const getJobKeywords = (config) => {
  let jobKeywords =
    config['job-keywords'] == '' ? [] : config['job-keywords'].split(',')

  if (config['hide-promoted-jobs']) {
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

      posts = document.querySelectorAll(getCustomSelector(JOB_SELECTORS, 'all'))

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
  // showJobGuidance()
  // showAiButton()
}

// // Show/Hide Job Guidance
// const showJobGuidance = () => {
//   // showByClassName('artdeco-card mb2 pt5')
// }
// const handleJobGuidance = (checkNeedUpdate, mode) => {
//   if (checkNeedUpdate('hide-job-guidance', true)) {
//     // hideByClassName('artdeco-card mb2 pt5', mode)
//   } else if (
//     checkNeedUpdate('main-toggle', false) ||
//     checkNeedUpdate('hide-job-guidance', false)
//   ) {
//     showJobGuidance()
//   }
// }

// // Show/Hide AI Button
// const showAiButton = () => {
//   // showByClassName('ember-view link-without-hover-state artdeco-button')
// }

// const handleAiButton = (checkNeedUpdate, mode) => {
//   if (checkNeedUpdate('hide-ai-button', true)) {
//     // hideByClassName(
//     //   'ember-view link-without-hover-state artdeco-button',
//     //   mode,
//     //   false
//     // )
//   } else if (
//     checkNeedUpdate('main-toggle', false) ||
//     checkNeedUpdate('hide-ai-button', false)
//   ) {
//     showAiButton()
//   }
// }

export default (checkNeedUpdate, enabled, mode, config) => {
  if (checkNeedUpdate('main-toggle', false)) {
    resetAll()

    return
  }

  if (!enabled) return

  jobKeywords = getJobKeywords(config)

  // Hide by keywords
  if (jobKeywords !== oldJobKeywords || jobKeywords.length === 0) {
    resetAll()

    blockByJobKeywords(jobKeywords, mode)
  }

  // handleJobGuidance(checkNeedUpdate, mode)

  // handleAiButton(checkNeedUpdate, mode)
}
