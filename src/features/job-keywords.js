export const getJobKeywords = (config) => {
  let keywords =
    config['job-keywords'] == '' ? [] : config['job-keywords'].split(',')

  if (config['hide-promoted-jobs']) {
    keywords.push('Promoted')
  }

  console.log('LinkOff: Current job keywords are', keywords)
  return keywords
}
