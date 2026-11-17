import type { PracticeQuestion, QuestionType, Level, Skill } from '../model'

type Row = [prompt: string, answer: string, explanation: string, source: string, options?: string[]]

function makeQuestions(prefix: string, skill: Skill, type: QuestionType, level: Level, rows: Row[]): PracticeQuestion[] {
  return rows.map(([prompt, answer, explanation, source, options], index) => ({
    id: `${prefix}-${index + 1}`, skill, type, level, prompt, answer, explanation,
    ...(skill === 'reading' ? { passage: source } : { transcript: source }),
    ...(options ? { options } : {}),
  }))
}

const garden = 'The Westbrook Community Garden opened in 2018 on land that had been an unused car park. Members grow vegetables in shared plots. The garden welcomes visitors every Saturday morning, but only members may harvest food. This year, the group plans to add a small greenhouse if it receives enough donations.'
const research = 'A university team studied how short breaks affect concentration. Volunteers completed a reading task, paused for five minutes, and then worked on a second task. The researchers observed better accuracy after a walk than after scrolling on a phone. They have not yet tested whether the effect lasts for several hours.'

export const practiceQuestions: PracticeQuestion[] = [
  ...makeQuestions('rg-b1', 'reading', 'true-false-not-given', 'B1', [
    ['The garden used to be a place for parking cars.', 'TRUE', '文章說這塊地原本是未使用的停車場。', garden, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['Visitors can harvest vegetables on Saturdays.', 'FALSE', '文章說只有會員可以採收。', garden, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['The garden opened in 2018.', 'TRUE', '開放年份在第一句明確提到。', garden, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['Every member has a private plot.', 'NOT GIVEN', '文章提到共用菜圃，沒有說每位會員都有私人菜圃。', garden, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['The greenhouse depends on donations.', 'TRUE', '最後一句說捐款足夠才會增建溫室。', garden, ['TRUE', 'FALSE', 'NOT GIVEN']],
  ]),
  ...makeQuestions('rg-b2', 'reading', 'true-false-not-given', 'B2', [
    ['The volunteers did two tasks with a break between them.', 'TRUE', '受試者先做閱讀任務，休息後再做第二個任務。', research, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['Phone use led to better accuracy than walking.', 'FALSE', '研究觀察到散步後的準確度較好。', research, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['The break lasted ten minutes.', 'FALSE', '文章寫的是五分鐘。', research, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['All volunteers were university students.', 'NOT GIVEN', '文章沒有交代志願者的身分。', research, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['The lasting effect has not yet been tested.', 'TRUE', '研究團隊尚未測試效果是否能持續數小時。', research, ['TRUE', 'FALSE', 'NOT GIVEN']],
  ]),
  ...makeQuestions('gap-b1', 'reading', 'reading-gap', 'B1', [
    ['The garden opened in _____. (ONE NUMBER)', '2018', '第一句直接提供開放年份。', garden],
    ['Members grow _____ in shared plots. (ONE WORD)', 'vegetables', '文章使用 grow vegetables。', garden],
    ['Visitors are welcome on _____ mornings. (ONE WORD)', 'Saturday', '文章寫 every Saturday morning。', garden],
    ['Only _____ may harvest food. (ONE WORD)', 'members', '只有 members 可以採收。', garden],
    ['The group hopes to add a _____. (ONE WORD)', 'greenhouse', '最後一句提到小型溫室。', garden],
  ]),
  ...makeQuestions('gap-b2', 'reading', 'reading-gap', 'B2', [
    ['The study looked at the effect of short breaks on _____. (ONE WORD)', 'concentration', '第一句點出研究主題。', research],
    ['The first task involved _____. (ONE WORD)', 'reading', '文章稱第一個任務為 reading task。', research],
    ['The break lasted _____ minutes. (ONE WORD)', 'five', '原文寫 five minutes，請填英文單字。', research],
    ['A walk was linked with better _____. (ONE WORD)', 'accuracy', '研究觀察到散步後準確度較高。', research],
    ['The researchers have not tested whether the effect lasts for several _____. (ONE WORD)', 'hours', '最後一句明確提到 several hours。', research],
  ]),
  ...makeQuestions('lc-b1', 'listening', 'listening-choice', 'B1', [
    ['Where will the class meet?', 'the library', '錄音說課程將在圖書館碰面。', 'The class will meet at the library, not in the main hall.', ['the library', 'the main hall', 'the café']],
    ['When does the tour begin?', '9:30', '錄音說九點半開始。', 'Please arrive by nine fifteen. The tour begins at nine thirty.', ['9:15', '9:30', '10:30']],
    ['What should students bring?', 'a notebook', '錄音提醒帶筆記本。', 'You do not need a laptop, but please bring a notebook.', ['a laptop', 'a notebook', 'a camera']],
    ['Which bus goes to the museum?', 'bus 12', '錄音更正了公車號碼，應搭十二號。', 'The number ten bus changed its route. Take bus twelve to the museum.', ['bus 10', 'bus 12', 'bus 20']],
    ['What is included in the ticket?', 'lunch', '錄音說票價包含午餐。', 'Your ticket includes lunch, but drinks are extra.', ['drinks', 'lunch', 'a guidebook']],
  ]),
  ...makeQuestions('lg-b1', 'listening', 'listening-gap', 'B1', [
    ['The appointment is on _____. (ONE WORD)', 'Tuesday', '錄音說預約在星期二。', 'Your appointment is on Tuesday at two o clock.'],
    ['The room number is _____. (ONE NUMBER)', '204', '錄音說房號是 204。', 'Please go to room two hundred and four.'],
    ['Bring your student _____. (ONE WORD)', 'card', '錄音請學生帶學生證。', 'Remember to bring your student card.'],
    ['The workshop starts at _____ o’clock. (ONE NUMBER)', '3', '錄音說工作坊三點開始。', 'The workshop starts at three o clock in the afternoon.'],
    ['The fee is _____ pounds. (ONE NUMBER)', '15', '錄音說費用為十五英鎊。', 'The fee for the workshop is fifteen pounds.'],
  ]),
]
