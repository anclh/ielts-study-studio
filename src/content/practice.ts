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

const library = 'The Riverside Tool Library began in 2021 to help residents borrow equipment they use only occasionally. Members can reserve a drill or ladder online and collect it on Wednesday evenings. Borrowing is free, but damaged items must be reported. Last year volunteers repaired 120 tools. The organisers hope to open on Sundays, although they have not yet found enough volunteers.'
const roofs = 'Researchers compared the temperatures of buildings with different roof surfaces during a summer study. Roofs covered with plants remained cooler during the afternoon than dark conventional roofs. However, installation costs varied considerably, and the team did not measure winter energy use. The researchers suggest that building owners consider local rainfall before choosing plants.'

export const practiceQuestions: PracticeQuestion[] = [
  ...makeQuestions('library-tf', 'reading', 'true-false-not-given', 'B1', [
    ['The tool library opened in 2021.', 'TRUE', '首句指出開放年份。', library, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['Members can collect tools on Wednesday evenings.', 'TRUE', '文章明確提到星期三晚取工具。', library, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['Members must pay to borrow a ladder.', 'FALSE', '借用免費。', library, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['The library owns more drills than ladders.', 'NOT GIVEN', '文章沒有比較工具數量。', library, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['The library already opens every Sunday.', 'FALSE', '星期日開放仍只是計劃。', library, ['TRUE', 'FALSE', 'NOT GIVEN']],
  ]),
  ...makeQuestions('roof-tf', 'reading', 'true-false-not-given', 'B2', [
    ['The study compared different types of roof.', 'TRUE', '研究比較不同屋頂表面。', roofs, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['Plant-covered roofs were cooler than dark roofs in the afternoon.', 'TRUE', '研究結果指出植物屋頂下午較涼。', roofs, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['Every planted roof cost the same to install.', 'FALSE', '安裝成本差異很大。', roofs, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['The team measured energy consumption in winter.', 'FALSE', '研究沒有量度冬季能源使用。', roofs, ['TRUE', 'FALSE', 'NOT GIVEN']],
    ['The study was conducted in Hong Kong.', 'NOT GIVEN', '文章沒有提及研究地點。', roofs, ['TRUE', 'FALSE', 'NOT GIVEN']],
  ]),
  ...makeQuestions('library-gap', 'reading', 'reading-gap', 'B1', [
    ['Tools can be reserved _____. (ONE WORD)', 'online', '會員可以網上預約。', library],
    ['Tools are collected on _____ evenings. (ONE WORD)', 'Wednesday', '取工具時間為星期三晚。', library],
    ['Damaged items must be _____. (ONE WORD)', 'reported', '損壞工具必須申報。', library],
    ['Volunteers repaired _____ tools last year. (ONE NUMBER)', '120', '文章指出維修了 120 件工具。', library],
    ['The organisers need more _____ to open on Sundays. (ONE WORD)', 'volunteers', '星期日開放需要更多義工。', library],
  ]),
  ...makeQuestions('roof-gap', 'reading', 'reading-gap', 'B2', [
    ['The study took place during _____. (ONE WORD)', 'summer', '首句提到夏季研究。', roofs],
    ['Some roofs were covered with _____. (ONE WORD)', 'plants', '研究比較種植植物的屋頂。', roofs],
    ['The planted roofs stayed cooler in the _____. (ONE WORD)', 'afternoon', '文章指出下午較涼。', roofs],
    ['The researchers did not measure winter energy _____. (ONE WORD)', 'use', '文章指出沒有量度冬季能源使用。', roofs],
    ['Owners should consider local _____ when choosing plants. (ONE WORD)', 'rainfall', '研究員建議考慮當地降雨量。', roofs],
  ]),
  ...makeQuestions('listen-new-choice', 'listening', 'listening-choice', 'B1', [
    ['Where will the workshop take place?', 'room 6', '講者更正地點至六號室。', 'The workshop was planned for room four, but it will now be in room six.', ['room 4', 'room 6', 'room 8']],
    ['What time does registration close?', '10:15', '報名截止時間是十點十五分。', 'Doors open at ten. Registration closes at ten fifteen.', ['10:00', '10:15', '10:30']],
    ['What should participants bring?', 'an umbrella', '講者提醒帶雨傘。', 'We provide a map, but please bring an umbrella in case it rains.', ['a map', 'an umbrella', 'a lunch']],
    ['How will visitors travel to the site?', 'by train', '由於道路工程，改乘火車。', 'Because of roadworks, we will take the train instead of the coach.', ['by coach', 'by train', 'by ferry']],
    ['What is included in the price?', 'materials', '材料包含在費用內，飲品另付。', 'The price covers all materials. Drinks are available separately.', ['drinks', 'parking', 'materials']],
  ]),
  ...makeQuestions('listen-new-gap', 'listening', 'listening-gap', 'B1', [
    ['The course begins in _____. (ONE WORD)', 'April', '課程四月開始。', 'The course begins in April and finishes in June.'],
    ['The meeting is in room _____. (ONE NUMBER)', '305', '會議在三零五室。', 'Please come to room three oh five for the meeting.'],
    ['Bring a _____. (ONE WORD)', 'pencil', '講者請參加者帶鉛筆。', 'We supply paper, so just bring a pencil.'],
    ['The tour lasts _____ minutes. (ONE NUMBER)', '45', '導賞團長四十五分鐘。', 'Allow forty five minutes for the tour.'],
    ['The event takes place beside the _____. (ONE WORD)', 'river', '活動在河邊舉行。', 'The event will be held beside the river, near the old bridge.'],
  ]),

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
