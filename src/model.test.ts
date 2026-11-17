import { describe, expect, it } from 'vitest'
import { completePracticeSet, emptyProgress, getPracticeSet, getReviewWords, markWordRecall, recordWordAnswer, wordStatus, type PracticeQuestion, type Word } from './model'

const questions: PracticeQuestion[] = Array.from({ length: 6 }, (_, index) => ({
  id: `r${index}`,
  skill: 'reading',
  type: 'true-false-not-given',
  level: 'B1',
  prompt: `Question ${index}`,
  passage: 'A sample passage.',
  answer: 'TRUE',
  options: ['TRUE', 'FALSE', 'NOT GIVEN'],
  explanation: 'Explanation',
}))

describe('practice selection', () => {
  it('returns a five-question set from the selected skill, type, and level', () => {
    const result = getPracticeSet([
      ...questions,
      { ...questions[0], id: 'other', skill: 'listening' },
    ], 'reading', 'true-false-not-given', 'B1')
    expect(result).toHaveLength(5)
    expect(result.map(question => question.id)).toEqual(['r0', 'r1', 'r2', 'r3', 'r4'])
  })

})

describe('word mastery', () => {
  it('masters a word after three consecutive correct quiz answers', () => {
    let progress = emptyProgress()
    progress = recordWordAnswer(progress, 'adapt', true)
    progress = recordWordAnswer(progress, 'adapt', true)
    progress = recordWordAnswer(progress, 'adapt', true)
    expect(progress.wordStreaks.adapt).toBe(3)
  })

  it('resets a two-answer streak on a wrong answer', () => {
    let progress = recordWordAnswer(emptyProgress(), 'adapt', true)
    progress = recordWordAnswer(progress, 'adapt', true)
    progress = recordWordAnswer(progress, 'adapt', false)
    expect(progress.wordStreaks.adapt).toBe(0)
  })

  it('marks a forgotten flashcard for review without crediting a correct quiz answer', () => {
    const progress = markWordRecall(emptyProgress(), 'adapt', false)
    expect(wordStatus(progress, 'adapt')).toBe('review')
    expect(progress.wordStreaks.adapt).toBeUndefined()
  })

  it('marks a remembered flashcard as learning without crediting mastery', () => {
    const progress = markWordRecall(emptyProgress(), 'adapt', true)
    expect(wordStatus(progress, 'adapt')).toBe('learning')
    expect(progress.wordStreaks.adapt).toBeUndefined()
  })

  it('puts forgotten words ahead of learning words in a review round', () => {
    const words: Word[] = ['learn', 'forget'].map(id => ({ id, term: id, meaning: id, partOfSpeech: 'v.', example: '', topic: 'study' }))
    let progress = markWordRecall(emptyProgress(), 'learn', true)
    progress = markWordRecall(progress, 'forget', false)
    expect(getReviewWords(words, progress).map(word => word.id)).toEqual(['forget', 'learn'])
  })
})

describe('completed practice sets', () => {
  it('records a set score and question ids after completion', () => {
    const progress = completePracticeSet(emptyProgress(), questions.slice(0, 5), [true, false, true, true, false], '2026-11-17T00:00:00.000Z')
    expect(progress.practiceSets).toEqual([{ skill: 'reading', type: 'true-false-not-given', level: 'B1', score: 3, questionIds: ['r0', 'r1', 'r2', 'r3', 'r4'], at: '2026-11-17T00:00:00.000Z' }])
  })
})
