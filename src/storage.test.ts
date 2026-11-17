import { describe, expect, it } from 'vitest'
import { loadBrowserProgress, loadProgress, saveBrowserProgress } from './storage'
import { emptyProgress } from './model'

describe('saved progress', () => {
  it('returns empty progress when stored JSON is malformed', () => {
    const storage = { getItem: () => '{broken' }
    expect(loadProgress(storage).practiceAttempts).toEqual([])
    expect(loadProgress(storage).wordStreaks).toEqual({})
  })

  it('returns empty progress when storage is unavailable', () => {
    const storage = { getItem: () => { throw new Error('blocked') } }
    expect(loadProgress(storage).savedWords).toEqual([])
  })

  it('survives a browser localStorage getter throwing during load', () => {
    const browser = { get localStorage(): Storage { throw new Error('blocked') } }
    expect(loadBrowserProgress(browser).practiceAttempts).toEqual([])
  })

  it('survives a browser localStorage getter throwing during save', () => {
    const browser = { get localStorage(): Storage { throw new Error('blocked') } }
    expect(() => saveBrowserProgress(browser, emptyProgress())).not.toThrow()
  })
})
