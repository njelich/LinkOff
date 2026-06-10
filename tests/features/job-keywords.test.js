import { describe, it, expect } from 'vitest'
import { getJobKeywords } from '../../src/features/job-keywords.js'

describe('getJobKeywords', () => {
  it('returns an empty array when job-keywords is empty', () => {
    expect(getJobKeywords({ 'job-keywords': '' })).toEqual([])
  })

  it('splits comma-separated job-keywords', () => {
    expect(getJobKeywords({ 'job-keywords': 'engineer,manager' })).toEqual([
      'engineer',
      'manager',
    ])
  })

  it('includes "Promoted" when hide-promoted-jobs is true', () => {
    expect(
      getJobKeywords({ 'job-keywords': '', 'hide-promoted-jobs': true })
    ).toContain('Promoted')
  })

  it('does not include "Promoted" when hide-promoted-jobs is false', () => {
    expect(
      getJobKeywords({ 'job-keywords': '', 'hide-promoted-jobs': false })
    ).not.toContain('Promoted')
  })

  it('combines custom keywords and the promoted flag', () => {
    const result = getJobKeywords({
      'job-keywords': 'senior,contract',
      'hide-promoted-jobs': true,
    })
    expect(result).toContain('senior')
    expect(result).toContain('contract')
    expect(result).toContain('Promoted')
  })
})
