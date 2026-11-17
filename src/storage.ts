import { emptyProgress, type Progress } from './model'

const KEY = 'ielts-practice-studio-progress-v1'
type ReadStorage = Pick<Storage, 'getItem'>
type WriteStorage = Pick<Storage, 'setItem'>

export function loadProgress(storage: ReadStorage): Progress {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(KEY) ?? 'null')
    if (!parsed || typeof parsed !== 'object') return emptyProgress()
    const value = parsed as Record<string, unknown>
    if (!Array.isArray(value.practiceAttempts) || !Array.isArray(value.savedWords) || !value.wordStreaks || typeof value.wordStreaks !== 'object') return emptyProgress()
    return {
      practiceAttempts: value.practiceAttempts.filter((item): item is Progress['practiceAttempts'][number] =>
        !!item && typeof item.questionId === 'string' && typeof item.answer === 'string' && typeof item.correct === 'boolean' && typeof item.at === 'string'),
      practiceSets: Array.isArray(value.practiceSets) ? value.practiceSets.filter((item): item is Progress['practiceSets'][number] =>
        !!item && typeof item.skill === 'string' && typeof item.type === 'string' && typeof item.level === 'string' && typeof item.score === 'number' && Array.isArray(item.questionIds) && typeof item.at === 'string') : [],
      savedWords: value.savedWords.filter((item): item is string => typeof item === 'string'),
      wordStreaks: Object.fromEntries(Object.entries(value.wordStreaks).filter(([, count]) => typeof count === 'number' && Number.isInteger(count) && count >= 0 && count <= 3)) as Record<string, number>,
      cardRecall: value.cardRecall && typeof value.cardRecall === 'object' ? Object.fromEntries(Object.entries(value.cardRecall).filter(([, recalled]) => typeof recalled === 'boolean')) as Record<string, boolean> : {},
    }
  } catch {
    return emptyProgress()
  }
}

export function loadBrowserProgress(browser: { readonly localStorage: Storage }): Progress {
  try { return loadProgress(browser.localStorage) } catch { return emptyProgress() }
}

export function saveBrowserProgress(browser: { readonly localStorage: Storage }, progress: Progress): void {
  try { saveProgress(browser.localStorage, progress) } catch { /* storage getter blocked */ }
}

export function saveProgress(storage: WriteStorage, progress: Progress): void {
  try { storage.setItem(KEY, JSON.stringify(progress)) } catch { /* private browsing or disabled storage */ }
}
