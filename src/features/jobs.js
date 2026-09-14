import { JOB_SELECTORS } from '../constants.js'
import {
  getCustomSelector,
  getInnermostElements,
  parseKeywords,
  resetJobs,
} from '../utils.js'

let runs = 0
let jobKeywordInterval
let jobKeywords = []
let oldJobKeywords = []
let lastJobSummary = ''

const isJobsPage = () => window.location.pathname.startsWith('/jobs/')

const getJobKeywords = (config) => {
  const jobKeywords = parseKeywords(config['job-keywords'])

  if (config['hide-promoted-jobs']) {
    jobKeywords.push('Promoted')
  }

  console.log('LinkOff: Current job keywords are', jobKeywords)
  return jobKeywords
}

const blockByJobKeywords = (keywords, mode) => {
  if (!isJobsPage()) return

  if (oldJobKeywords.some((kw) => !keywords.includes(kw))) {
    resetJobs()
  }

  oldJobKeywords = keywords

  const lowercaseKeywords = keywords.map((keyword) => keyword.toLowerCase())

  if (keywords.length)
    jobKeywordInterval = setInterval(() => {
      // The single page app can navigate away without doJobs running again.
      if (!isJobsPage()) return resetAll()

      if (runs % 10 === 0) resetJobs()

      const posts = getInnermostElements(
        document.querySelectorAll(getCustomSelector(JOB_SELECTORS, 'all'))
      )

      let matched = 0

      posts.forEach((post) => {
        const html = post.innerHTML.toLowerCase()
        const found = lowercaseKeywords.some(
          (keyword) => html.indexOf(keyword) !== -1
        )

        if (found) {
          matched++
          post.classList.add(mode, 'showIcon')
        } else {
          post.classList.remove('hide', 'dim', 'showIcon')
        }
      })

      const summary = `Found ${posts.length} jobs, ${matched} blocked`

      if (summary !== lastJobSummary) {
        lastJobSummary = summary
        console.log(`LinkOff: ${summary}`)
      }

      runs++
    }, 350)
}

const resetAll = () => {
  clearInterval(jobKeywordInterval)
  lastJobSummary = ''
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
