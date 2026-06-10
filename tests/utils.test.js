import { describe, it, expect } from 'vitest'
import { shallowEqual, getCustomSelector } from '../src/utils.js'

describe('shallowEqual', () => {
  it('returns true for the same reference', () => {
    const obj = { a: 1 }
    expect(shallowEqual(obj, obj)).toBe(true)
  })

  it('returns true for two empty objects', () => {
    expect(shallowEqual({}, {})).toBe(true)
  })

  it('returns true when keys and values match', () => {
    expect(shallowEqual({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toBe(true)
  })

  it('returns false when a value differs', () => {
    expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false)
  })

  it('returns false when the second object has an extra key', () => {
    expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false)
  })

  it('returns false when the first object has an extra key', () => {
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false)
  })
})

describe('getCustomSelector', () => {
  const BASE = '.post'

  it('returns the selector unchanged for type "all"', () => {
    expect(getCustomSelector(BASE, 'all')).toBe('.post')
  })

  it('appends [data-hidden=true] for type "blocked"', () => {
    expect(getCustomSelector(BASE, 'blocked')).toBe('.post[data-hidden=true]')
  })

  it('appends [data-hidden=false] for type "shown"', () => {
    expect(getCustomSelector(BASE, 'shown')).toBe('.post[data-hidden=false]')
  })

  it('returns visible and pristine variants joined by comma for type "pristine"', () => {
    expect(getCustomSelector(BASE, 'pristine')).toBe(
      '.post[data-hidden=false],.post:not([data-hidden])'
    )
  })

  it('handles an array of selectors', () => {
    expect(getCustomSelector(['.a', '.b'], 'blocked')).toBe(
      '.a[data-hidden=true],.b[data-hidden=true]'
    )
  })

  it('handles an array for type "pristine"', () => {
    expect(getCustomSelector(['.a', '.b'], 'pristine')).toBe(
      '.a[data-hidden=false],.a:not([data-hidden]),.b[data-hidden=false],.b:not([data-hidden])'
    )
  })
})
