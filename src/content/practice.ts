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

const facts = ['TRUE', 'FALSE', 'NOT GIVEN']
const repair = 'The Hillview Repair Café opens on the first Saturday of each month. Visitors must book in advance and may bring one item to a 25-minute appointment. Volunteers show them how to fix small appliances and clothes. The service is free, although visitors pay for replacement parts. For safety, volunteers do not accept petrol-powered equipment. The waiting area is in the courtyard.'
const light = 'A pilot study examined street lighting on 12 residential streets. On six streets, lamps were dimmed after midnight. On the other six, lamp settings were unchanged. The team used meters to take readings at ground level and counted insects near each lamp. More moths were recorded near dimmed lamps. The authors recommend repeating the trial on busier roads and in other neighbourhoods before changing lighting across the city.'

const market = 'Welcome to the evening market. We usually set up in the square, but the paving there is being repaired, so tonight we are using the old railway station. The doors open at five, although stalls will not serve customers until half past five. If you want to make a textile bookmark, head to platform two. The musicians are setting up on platform one. Our cook will demonstrate three ways of using leftover bread on platform three. Registration for the workshop closes at six in the evening. You can refill a bottle for free at any of the drinking fountains. Food stalls ask for a two dollar deposit on reusable plates, which you get back when you return them. If you lose anything, ask at the information desk. The last shuttle from the station goes to the town hall rather than the library.'

const seeds = 'Our project examined whether the way seeds are stored affects how many eventually germinate. We were less interested in which species grew fastest. For this pilot we used seeds from a single harvest so that differences in age could not distort the comparison. The storage team divided the seeds into batches and kept one batch at room temperature for comparison. Once the batches were planted, the testing team counted the seedlings each week. The records team checked the spreadsheets and followed up on missing readings. Across the repeat trials, results were most stable for seeds kept in the cool cabinet. We excluded one batch after its container developed a crack. In the next trial we plan to include more species. We will also monitor humidity inside each container instead of relying on a room reading. Once we finish, we will share our findings with local growers.'

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
  ...makeQuestions('repair-tf-b1', 'reading', 'true-false-not-given', 'B1', [
    ['The café runs twice a month.', 'FALSE', '活動每月一次。', repair, facts],
    ['Visitors must book a place.', 'TRUE', '文中說明須提前預約。', repair, facts],
    ['Visitors pay for any replacement parts used.', 'TRUE', '維修服務免費，但零件須自費。', repair, facts],
    ['Most volunteers are retired engineers.', 'NOT GIVEN', '短文沒有交代義工的職業背景。', repair, facts],
    ['Volunteers will accept petrol-powered equipment.', 'FALSE', '文中說明不收汽油動力設備。', repair, facts],
  ]),
  ...makeQuestions('repair-gap-b1', 'reading', 'reading-gap', 'B1', [
    ['The café opens on the first _____ of each month. (ONE WORD)', 'Saturday', '活動在每月第一個星期六舉行。', repair],
    ['Each appointment lasts _____ minutes. (ONE NUMBER)', '25', '每節預約時段為 25 分鐘。', repair],
    ['Volunteers show visitors how to repair small appliances and _____. (ONE WORD)', 'clothes', '可維修小型電器及衣物。', repair],
    ['Visitors cover the cost of replacement _____. (ONE WORD)', 'parts', '免費維修不包括零件費。', repair],
    ['The waiting area is in the _____. (ONE WORD)', 'courtyard', '等候區設於庭院。', repair],
  ]),
  ...makeQuestions('light-tf-b2', 'reading', 'true-false-not-given', 'B2', [
    ['All trial streets had their lamps turned off after midnight.', 'FALSE', '只有六條街調暗街燈，另外六條沒有調整。', light, facts],
    ['Researchers used meters to measure light at ground level.', 'TRUE', '研究員以儀器量度地面光度。', light, facts],
    ['More moths were recorded near lamps that had been dimmed.', 'TRUE', '調暗街燈附近錄得較多飛蛾。', light, facts],
    ['Residents on the trial streets reported fewer collisions.', 'NOT GIVEN', '研究沒有提到居民報告的碰撞數目。', light, facts],
    ['The authors said the results alone were enough to support a citywide change.', 'FALSE', '研究員認為需要在更多環境測試。', light, facts],
  ]),
  ...makeQuestions('light-gap-b2', 'reading', 'reading-gap', 'B2', [
    ['The trial involved _____ streets. (ONE NUMBER)', '12', '研究涵蓋 12 條街。', light],
    ['The lamps were dimmed after _____. (ONE WORD)', 'midnight', '調暗街燈的時間是午夜後。', light],
    ['Light readings were taken at _____ level. (ONE WORD)', 'ground', '光度在地面高度量度。', light],
    ['Researchers recorded more _____ near dimmed lamps. (ONE WORD)', 'moths', '較暗的街燈附近錄得較多飛蛾。', light],
    ['The team called for further testing on _____ roads. (ONE WORD)', 'busier', '作者建議在更繁忙的道路重做研究。', light],
  ]),
  ...makeQuestions('museum-choice-b1', 'listening', 'listening-choice', 'B1', [
    ['Which entrance should the group use?', 'the side entrance', '正門正在維修，改用側門。', 'The front entrance is being repaired. Use the side entrance, next to the bicycle racks.', ['the front entrance', 'the side entrance', 'the staff entrance']],
    ['When should the group arrive?', '11:20', '十一點半開場，須提早十分鐘到達。', 'The guide starts at eleven thirty, but arrive ten minutes before that.', ['11:10', '11:30', '11:20']],
    ['Where can visitors leave their coats?', 'at reception', '外套可寄放在接待處。', 'There are lockers for bags. You can leave your coat at reception.', ['at reception', 'in the lockers', 'in the café']],
    ['Which gallery is closed today?', 'the pottery gallery', '陶藝展廳因更換展品而關閉。', 'You can visit the photography gallery as usual. The pottery gallery is closed while we change the display.', ['the photography gallery', 'the pottery gallery', 'the transport gallery']],
    ['What discount can visitors get?', 'a discount on postcards', '折扣只適用於明信片。', 'Your ticket gives you ten percent off postcards. Books and refreshments are full price.', ['a discount on books', 'a discount on drinks', 'a discount on postcards']],
  ]),
  ...makeQuestions('walk-gap-b1', 'listening', 'listening-gap', 'B1', [
    ['Meeting point: beside the _____. (ONE WORD)', 'fountain', '集合地點在噴泉旁。', 'Please meet beside the fountain, rather than at the gate.'],
    ['Group size: up to _____ people. (ONE NUMBER)', '16', '每組最多 16 人。', 'We can take up to sixteen people in each group.'],
    ['Bring a bottle of _____. (ONE WORD)', 'water', '參加者要自備清水。', 'We will hand out maps, but please bring a bottle of water.'],
    ['Lunch stop: the _____. (ONE WORD)', 'orchard', '午餐在果園休息。', 'We will stop for lunch in the orchard before continuing uphill.'],
    ['Walk finishes at the _____. (ONE WORD)', 'station', '終點是車站。', 'The walk ends at the station, where you can catch a train home.'],
  ]),
  ...makeQuestions('soil-choice-b2', 'listening', 'listening-choice', 'B2', [
    ['Why did the team abandon its first sampling site?', 'Access was unreliable.', '主要問題是下雨時不能進入。', 'The first field was large enough, and we had the owner’s permission. The problem was getting to it after rain.', ['The field was too small.', 'Access was unreliable.', 'The owner refused permission.']],
    ['Why did the team collect two samples at each point?', 'to check consistency', '重複取樣可核對讀數是否一致。', 'We took a second sample at each point to see whether the readings agreed. It was not a backup in case one went missing.', ['to replace missing samples', 'to test different depths', 'to check consistency']],
    ['Which measurement varied most?', 'moisture', '酸鹼度相近，變動最大的是濕度。', 'Acidity stayed fairly stable across the site. Colour varied a little, but moisture showed the biggest differences.', ['moisture', 'acidity', 'colour']],
    ['What limited the researchers’ conclusions?', 'The trial covered one season.', '研究時間只涵蓋一季。', 'We had enough sites for the comparison. The limitation was time: we sampled during spring only.', ['There were too few sites.', 'The trial covered one season.', 'The instruments failed.']],
    ['What will the team do next?', 'repeat the survey in autumn', '下一步是秋季重做調查。', 'We discussed adding a second region, but our priority is to repeat the survey at the same locations this autumn.', ['buy new equipment', 'add a second region', 'repeat the survey in autumn']],
  ]),
  ...makeQuestions('archive-gap-b2', 'listening', 'listening-gap', 'B2', [
    ['Initial check: look for signs of _____. (ONE WORD)', 'mould', '先檢查有沒有發霉。', 'Before scanning a document, examine its edges for mould, which can spread in storage.'],
    ['Clean the scanner with a _____ cloth. (ONE WORD)', 'microfibre', '要用超細纖維布清潔掃描器。', 'Use a microfibre cloth on the glass. Paper tissues leave fibres behind.'],
    ['Place a _____ beside unusually large items when scanning. (ONE WORD)', 'ruler', '尺可讓觀眾知道原件尺寸。', 'For oversized items, put a ruler next to the document so viewers can judge its original size.'],
    ['File names begin with the collection _____. (ONE WORD)', 'code', '檔名先填館藏代碼。', 'Unlike the old system, each file name starts with the collection code rather than the year.'],
    ['A second volunteer checks the _____. (ONE WORD)', 'metadata', '另一位義工檢查描述資料。', 'Once a scan has been saved, ask a second volunteer to review its metadata, especially the date and location fields.'],
  ]),
  ...makeQuestions('market-mini-b1', 'listening', 'listening-mini', 'B1', [
    ['Why was the night market moved?', 'The original site is under repair.', '廣場正維修，所以搬到舊車站。', market, ['The market needs more space.', 'The original site is under repair.', 'The market received noise complaints.']],
    ['What time do stalls begin serving customers?', '5:30 pm', '五點開門，五點半開始營業。', market, ['5:00 pm', '5:30 pm', '6:00 pm']],
    ['Where should visitors go for the textile workshop?', 'Platform 2', '紡織工作坊設於二號月台。', market, ['Platform 1', 'Platform 2', 'Platform 3']],
    ['Where will the musicians perform?', 'Platform 1', '樂手會在一號月台演出。', market, ['Platform 1', 'Platform 2', 'Platform 3']],
    ['Where can visitors get cooking advice?', 'Platform 3', '烹飪示範在三號月台。', market, ['Platform 1', 'Platform 2', 'Platform 3']],
    ['Workshop registration closes at _____ pm. (ONE NUMBER)', '6', '工作坊報名晚上六點截止。', market],
    ['Visitors should bring a _____ for water. (ONE WORD)', 'bottle', '自備水樽便可免費添水。', market],
    ['The deposit for a reusable plate is _____ dollars. (ONE NUMBER)', '2', '餐碟按金是兩元。', market],
    ['Lost property: ask at the _____ desk. (ONE WORD)', 'information', '失物可到詢問處查詢。', market],
    ['Last shuttle destination: the _____ hall. (ONE WORD)', 'town', '末班接駁車前往市政廳。', market],
  ]),
  ...makeQuestions('seeds-mini-b2', 'listening', 'listening-mini', 'B2', [
    ['What question did the project mainly investigate?', 'How storage conditions affect germination.', '研究重點是儲存條件對發芽率的影響。', seeds, ['Which species grows fastest.', 'How storage conditions affect germination.', 'Whether larger seeds cost more to collect.']],
    ['Why did the team use seeds from one harvest?', 'To keep their age comparable.', '同一批收成可避免種子年齡影響結果。', seeds, ['To keep their age comparable.', 'To avoid weighing each batch.', 'To increase the number of species.']],
    ['Which team prepared a comparison batch?', 'Storage team', '儲存組在室溫下保留一組以作比較。', seeds, ['Storage team', 'Testing team', 'Records team']],
    ['Which team counted the seedlings?', 'Testing team', '測試組每星期點算幼苗。', seeds, ['Storage team', 'Testing team', 'Records team']],
    ['Which team checked for gaps in the data?', 'Records team', '紀錄組發現並跟進缺失讀數。', seeds, ['Storage team', 'Testing team', 'Records team']],
    ['The most stable results came from the _____ cabinet. (ONE WORD)', 'cool', '低溫櫃的結果最穩定。', seeds],
    ['One batch was excluded after its container developed a _____. (ONE WORD)', 'crack', '容器出現裂縫，該組樣本因此被排除。', seeds],
    ['The team will increase the number of _____ in the next trial. (ONE WORD)', 'species', '下一輪會加入更多品種。', seeds],
    ['The researchers will track _____ inside each container. (ONE WORD)', 'humidity', '下次會直接量度容器內濕度。', seeds],
    ['The results will be shared with local _____. (ONE WORD)', 'growers', '研究結果會與本地種植者分享。', seeds],
  ]),
]
