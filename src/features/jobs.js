import { JOB_SELECTORS, looksLikeJobsPage } from '../constants.js'
import { getCustomSelector, resetJobs } from '../utils.js'

let runs = 0
let jobKeywordInterval
let jobKeywords = []
let oldJobKeywords = []
let lastJobSummary = ''

const getJobKeywords = (config) => {
  // 'job-keywords' is only written to storage once the user edits the tag
  // input. If it has never been touched it is undefined, and `undefined == ''`
  // is false, so the old code went straight into undefined.split() and threw.
  const raw = config['job-keywords']

  let jobKeywords =
    typeof raw === 'string' && raw.length
      ? raw
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)
      : []

  if (config['hide-promoted-jobs']) {
    jobKeywords.push('Promoted')
  }

  console.log('LinkOff: Current job keywords are', jobKeywords)
  return jobKeywords
}

const blockByJobKeywords = (keywords, mode) => {
  if (oldJobKeywords.some((kw) => !keywords.includes(kw))) {
    resetJobs()
  }

  oldJobKeywords = keywords

  let posts

  if (keywords.length)
    jobKeywordInterval = setInterval(() => {
      // Checked every tick. LinkedIn is a single page app and can serve jobs
      // from a /preload/ document, so this must not rely on the raw pathname.
      if (!looksLikeJobsPage()) return

      if (runs % 10 === 0) resetJobs()

      posts = document.querySelectorAll(getCustomSelector(JOB_SELECTORS, 'all'))

      let matched = 0

      posts.forEach((post) => {
        const found = keywords.find((keyword) => {
          return (
            post.innerHTML.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
          )
        })

        if (found) {
          matched++
          post.classList.add(mode, 'showIcon')
        } else {
          post.classList.remove('hide', 'dim', 'showIcon')
        }
      })

      // Only log when the numbers change, so the console stays readable.
      const summary = `${posts.length} cards found, ${matched} matched keywords`

      if (summary !== lastJobSummary) {
        lastJobSummary = summary
        console.log(`LinkOff jobs: ${summary}`)
      }

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
