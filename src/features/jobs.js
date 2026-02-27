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
  if (!window.location.pathname.startsWith('/jobs/')) return

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
        const found = keywords.find((keyword) => {
          return (
            post.innerHTML.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
          )
        })

        if (found) {
          post.classList.add(mode, 'showIcon')
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
}

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
}
