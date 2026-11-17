export interface CollocationProgress {
  done: Record<string, boolean>
  lastId: string | null
  lastOpened: string | null
  stillLearning: Record<string, boolean>
}

type ReadStorage = Pick<Storage, 'getItem'>
type WriteStorage = Pick<Storage, 'setItem'>

const KEY = 'collocation-bank-progress'
const emptyProgress = (): CollocationProgress => ({ done: {}, lastId: null, lastOpened: null, stillLearning: {} })
const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
const booleanMap = (value: unknown): Record<string, boolean> => isRecord(value)
  ? Object.fromEntries(Object.entries(value).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean'))
  : {}

export function loadCollocationProgress(storage: ReadStorage): CollocationProgress {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(KEY) ?? 'null')
    if (!isRecord(parsed)) return emptyProgress()
    return {
      done: booleanMap(parsed.done),
      lastId: typeof parsed.lastId === 'string' ? parsed.lastId : null,
      lastOpened: typeof parsed.lastOpened === 'string' ? parsed.lastOpened : null,
      stillLearning: booleanMap(parsed.stillLearning),
    }
  } catch {
    return emptyProgress()
  }
}

export function loadBrowserCollocationProgress(browser: { readonly localStorage: Storage }): CollocationProgress {
  try { return loadCollocationProgress(browser.localStorage) } catch { return emptyProgress() }
}

export function saveBrowserCollocationProgress(browser: { readonly localStorage: Storage }, progress: CollocationProgress): void {
  try { browser.localStorage.setItem(KEY, JSON.stringify(progress)) } catch { /* storage getter blocked */ }
}

export function saveCollocationProgress(storage: WriteStorage, progress: CollocationProgress): void {
  try { storage.setItem(KEY, JSON.stringify(progress)) } catch { /* private browsing or disabled storage */ }
}
