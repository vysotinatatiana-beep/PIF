// ════════════════════════════════════════════════════════════
// PiF-STYLE ASSESSMENT — shared data + scoring engine
// 4 blocks: Анализ (cognitive test), Коммуникация, Изменения, Драйв (self-report)
// ════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────
// BLOCK 1: АНАЛИЗ — REAL COGNITIVE TEST (correct/incorrect answers, timed)
// ───────────────────────────────────────────────────────────

// Скорость мышления: быстрая обработка типовой информации, жёсткий тайминг (15 сек/задание)
var SPEED_TASKS = [
  {id:'sp1', timeLimit:15, q:'Какое число продолжает последовательность: 2, 4, 8, 16, ?', options:['20','24','32','30'], correct:'32'},
  {id:'sp2', timeLimit:15, q:'Если А больше Б, а Б больше В, кто меньше всех?', options:['А','Б','В','Нельзя определить'], correct:'В'},
  {id:'sp3', timeLimit:12, q:'Сколько будет 17 + 28?', options:['44','45','46','43'], correct:'45'},
  {id:'sp4', timeLimit:15, q:'Какое слово не подходит к остальным: яблоко, груша, морковь, банан?', options:['яблоко','груша','морковь','банан'], correct:'морковь'},
  {id:'sp5', timeLimit:12, q:'Продолжите ряд: 1, 3, 6, 10, 15, ?', options:['18','20','21','19'], correct:'21'},
  {id:'sp6', timeLimit:15, q:'В корзине было 24 яблока. Продали половину, потом ещё 5. Сколько осталось?', options:['7','12','17','9'], correct:'7'},
  {id:'sp7', timeLimit:12, q:'Какая буква идёт после буквы, которая на 3 позиции после Б в алфавите?', options:['Д','Е','Ж','З'], correct:'Е'},
  {id:'sp8', timeLimit:15, q:'Поезд проезжает 60 км за 40 минут. Сколько км он проедет за час при той же скорости?', options:['80','90','75','100'], correct:'90'},
];

// Критическое мышление: причинно-следственные выводы, выявление логических ошибок (без жёсткого тайминга)
var CRITICAL_TASKS = [
  {id:'cr1', timeLimit:60,
   q:'Исследование показало: в городах с большим числом пожарных случается больше пожаров. Вывод сделан: "Чем больше пожарных в городе, тем выше риск пожара — нужно сокращать штат пожарных." Что неверно в этом выводе?',
   options:['Вывод верный, нужно сокращать штат','Перепутаны причина и следствие — большие города имеют больше пожарных И больше пожаров одновременно','Данных недостаточно для любого вывода','Пожарные сами вызывают пожары'],
   correct:'Перепутаны причина и следствие — большие города имеют больше пожарных И больше пожаров одновременно'},
  {id:'cr2', timeLimit:60,
   q:'Компания внедрила новую систему мотивации, и через полгода продажи выросли на 15%. Менеджер утверждает: "Система мотивации точно сработала". Какой фактор стоит проверить, прежде чем согласиться с этим выводом?',
   options:['Не нужно проверять, всё очевидно','Не изменился ли рынок или сезонность за этот период','Сколько стоила система мотивации','Сколько сотрудников уволилось'],
   correct:'Не изменился ли рынок или сезонность за этот период'},
  {id:'cr3', timeLimit:60,
   q:'В рассуждении: "Все успешные руководители много работают. Иван много работает. Значит, Иван — успешный руководитель." В чём логическая ошибка?',
   options:['Ошибки нет, вывод верный','Из того, что все А — это Б, не следует, что все Б — это А','Иван не руководитель','Нужно больше данных об Иване'],
   correct:'Из того, что все А — это Б, не следует, что все Б — это А'},
  {id:'cr4', timeLimit:60,
   q:'Какая информация из перечисленного НЕ важна для решения "стоит ли запускать новый продукт на рынке"?',
   options:['Размер потенциального рынка','Цвет логотипа конкурента','Себестоимость производства','Наличие похожих продуктов у конкурентов'],
   correct:'Цвет логотипа конкурента'},
  {id:'cr5', timeLimit:60,
   q:'Сотрудник отказался от повышения. Руководитель сделал вывод: "Он не амбициозен и не хочет расти." Какое альтернативное объяснение стоит рассмотреть первым?',
   options:['Других объяснений быть не может','Возможно, у него есть личные обстоятельства, не связанные с амбициями (семья, здоровье, переезд)','Нужно сразу его уволить','Стоит публично обсудить это с командой'],
   correct:'Возможно, у него есть личные обстоятельства, не связанные с амбициями (семья, здоровье, переезд)'},
  {id:'cr6', timeLimit:60,
   q:'В отчёте написано: "90% клиентов довольны нашим сервисом" — но опрос проходили только клиенты, которые сами написали в поддержку с похвалой. Что не так с этим выводом?',
   options:['Всё корректно, 90% — это много','Выборка смещена — недовольные клиенты, скорее всего, не пишут похвалу, значит, выборка не отражает всех клиентов','Нужно было опросить ещё больше людей','90% — это слишком высокий показатель, наверное, ошибка'],
   correct:'Выборка смещена — недовольные клиенты, скорее всего, не пишут похвалу, значит, выборка не отражает всех клиентов'},
];

// ───────────────────────────────────────────────────────────
// BLOCK 2: КОММУНИКАЦИЯ — self-report (forced choice + scenarios)
// Факторы: Социальный интеллект, Мотивация к лидерству
// ───────────────────────────────────────────────────────────

var COMM_FC = [
  {id:'co_fc1', lbl:'В сложной командной ситуации мне проще:',
   a:{t:'Понять, что на самом деле чувствуют и хотят разные люди в команде',d:'social_iq'},
   b:{t:'Взять управление на себя и сказать, что делать дальше',d:'lead_motiv'}},
  {id:'co_fc2', lbl:'Что мне даётся легче:',
   a:{t:'Почувствовать настроение человека ещё до того, как он что-то скажет',d:'social_iq'},
   b:{t:'Принять непопулярное решение и нести за него ответственность',d:'lead_motiv'}},
  {id:'co_fc3', lbl:'Что я делаю чаще:',
   a:{t:'Подбираю слова и тон в зависимости от того, кто передо мной',d:'social_iq'},
   b:{t:'Беру инициативу в новой группе людей, даже если меня не просили',d:'lead_motiv'}},
];

var COMM_SCENARIOS = [
  {id:'co_s1', dim:'social_iq', rev:false,
   sc:'На встрече коллега формально согласился с планом, но вы заметили, что он напряжён и почти не задаёт вопросов.',
   q:'«Я отмечаю это и нахожу момент уточнить его реальное мнение, а не полагаюсь только на сказанное вслух».'},
  {id:'co_s2', dim:'social_iq', rev:false,
   sc:'В команде нарастает напряжение, но никто открыто об этом не говорит.',
   q:'«Я обычно замечаю такое напряжение раньше, чем оно выливается в открытый конфликт».'},
  {id:'co_s3', dim:'lead_motiv', rev:false,
   sc:'Команде нужно принять непопулярное решение, которое расстроит часть людей.',
   q:'«Я готов(а) взять на себя ответственность за такое решение, даже если это создаст временное недовольство в команде».'},
  {id:'co_s4', dim:'lead_motiv', rev:false,
   sc:'Возникла неопределённость: руководителя нет на месте, а команде нужно решение прямо сейчас.',
   q:'«Я возьму инициативу и предложу решение, даже если формально это не моя зона ответственности».'},
  {id:'co_s5', dim:'social_iq', rev:false,
   sc:'Коллега резко отвечает на ваше предложение, хотя раньше был дружелюбен.',
   q:'«Я стараюсь понять, что стоит за этой реакцией, прежде чем реагировать на сам тон».'},
  {id:'co_s6', dim:'lead_motiv', rev:false,
   sc:'Вам предлагают руководящую роль, которая означает больше конфликтов и сложных разговоров с людьми.',
   q:'«Эта перспектива меня скорее привлекает, чем отталкивает».'},
];

// ───────────────────────────────────────────────────────────
// BLOCK 3: ИЗМЕНЕНИЯ — self-report
// Факторы: Открытость мышления, Мотивация к развитию
// ───────────────────────────────────────────────────────────

var CHANGE_FC = [
  {id:'ch_fc1', lbl:'Когда привычный подход больше не работает:',
   a:{t:'Мне интересно поискать совершенно новый способ, даже если он непривычен',d:'openness'},
   b:{t:'Мне важно понимать, что я двигаюсь к мастерству, а не просто меняю методы',d:'growth_motiv'}},
  {id:'ch_fc2', lbl:'Что ближе:',
   a:{t:'Я легко пересматриваю свою точку зрения, если появились новые факты',d:'openness'},
   b:{t:'Я выбираю задачи, в которых точно чему-то научусь, даже если они сложнее привычных',d:'growth_motiv'}},
];

var CHANGE_SCENARIOS = [
  {id:'ch_s1', dim:'openness', rev:false,
   sc:'Вы были уверены в своём подходе к задаче, но новые данные показывают, что он не оптимален.',
   q:'«Я быстро пересматриваю подход, не держусь за прежнее решение из принципа».'},
  {id:'ch_s2', dim:'openness', rev:false,
   sc:'Коллега предлагает радикально иной способ работы, который противоречит привычным процессам команды.',
   q:'«Я готов(а) серьёзно рассмотреть это, а не отклонять просто потому, что "мы всегда делали иначе"».'},
  {id:'ch_s3', dim:'openness', rev:true,
   sc:'Ситуация в проекте стала неопределённой — нет чёткого плана, правила могут поменяться.',
   q:'«Мне некомфортно работать в таких условиях, я предпочитаю дождаться большей ясности».'},
  {id:'ch_s4', dim:'growth_motiv', rev:false,
   sc:'У вас есть выбор между знакомой задачей, которую вы сделаете быстро и без риска, и новой, в которой придётся осваивать незнакомое.',
   q:'«Я скорее выберу новую задачу, даже если результат не гарантирован».'},
  {id:'ch_s5', dim:'growth_motiv', rev:false,
   sc:'Вам предлагают курс или программу обучения, которая не даст немедленной выгоды, но расширит навыки на будущее.',
   q:'«Я охотно берусь за такое, даже если эффект не сразу виден».'},
];

// ───────────────────────────────────────────────────────────
// BLOCK 4: ДРАЙВ — self-report
// Факторы: Инициативность, Настойчивость, Амбициозность
// ───────────────────────────────────────────────────────────

var DRIVE_FC = [
  {id:'dr_fc1', lbl:'Что точнее описывает вас:',
   a:{t:'Я предлагаю улучшения и новые задачи сам, не дожидаясь, когда меня попросят',d:'initiative'},
   b:{t:'Я ставлю себе высокие цели, даже когда никто этого не требует',d:'ambition'}},
  {id:'dr_fc2', lbl:'Что ближе:',
   a:{t:'Я довожу дело до конца, даже когда оно перестало быть интересным',d:'persistence'},
   b:{t:'Я предпочитаю замечать проблему и предлагать решение раньше, чем меня попросят',d:'initiative'}},
  {id:'dr_fc3', lbl:'При столкновении с серьёзным препятствием:',
   a:{t:'Я ищу обходной путь и продолжаю двигаться к цели',d:'persistence'},
   b:{t:'Я пересматриваю цель в сторону более амбициозной, а не более скромной',d:'ambition'}},
];

var DRIVE_SCENARIOS = [
  {id:'dr_s1', dim:'initiative', rev:false,
   sc:'Вы заметили неэффективность в процессе, который формально не входит в вашу зону ответственности.',
   q:'«Я предложу улучшение, не дожидаясь, что это сделает кто-то другой».'},
  {id:'dr_s2', dim:'initiative', rev:true,
   sc:'Задача в целом понятна, но в деталях есть пробелы.',
   q:'«Я предпочитаю дождаться более точных инструкций, прежде чем начинать действовать».'},
  {id:'dr_s3', dim:'persistence', rev:false,
   sc:'Проект застопорился из-за серьёзного препятствия, которое не было предусмотрено.',
   q:'«Я продолжаю искать решение, даже если первые несколько попыток не сработали».'},
  {id:'dr_s4', dim:'persistence', rev:true,
   sc:'Препятствие на пути к цели оказалось серьёзнее, чем ожидалось.',
   q:'«В такой ситуации я скорее склонен(на) пересмотреть цель в сторону более достижимой, чем продолжать бороться»'},
  {id:'dr_s5', dim:'ambition', rev:false,
   sc:'Вам нужно сформулировать цель на следующий квартал. Никто не задаёт жёстких рамок.',
   q:'«Я ставлю себе цель выше той, что от меня формально ожидают».'},
  {id:'dr_s6', dim:'ambition', rev:false,
   sc:'Перед вами выбор между комфортным результатом и амбициозным, но рискованным.',
   q:'«Я скорее выберу амбициозный вариант, даже с риском не достичь его полностью».'},
];

// ════════════════════════════════════════════════════════════
// SECTION METADATA
// ════════════════════════════════════════════════════════════

var SECTIONS_META = [
  {key:'speed',    title:'Анализ — Скорость мышления',     desc:'На каждое задание отведено ограниченное время. Отвечайте быстро и точно — таймер виден на экране.', type:'cognitive_timed'},
  {key:'critical', title:'Анализ — Критическое мышление',  desc:'Внимательно прочитайте каждую ситуацию. Жёсткого лимита времени нет, но старайтесь не затягивать.', type:'cognitive'},
  {key:'comm_fc',  title:'Коммуникация — выбор',           desc:'Нет правильных ответов — выбирайте то, что ближе именно вам.', type:'fc'},
  {key:'comm_sc',  title:'Коммуникация — ситуации',        desc:'Оцените, насколько точно описанная реакция соответствует вашей типичной.', type:'likert'},
  {key:'change_fc',title:'Изменения — выбор',              desc:'Нет правильных ответов — выбирайте то, что ближе именно вам.', type:'fc'},
  {key:'change_sc',title:'Изменения — ситуации',           desc:'Оцените, насколько точно описанная реакция соответствует вашей типичной.', type:'likert'},
  {key:'drive_fc', title:'Драйв — выбор',                  desc:'Нет правильных ответов — выбирайте то, что ближе именно вам.', type:'fc'},
  {key:'drive_sc', title:'Драйв — ситуации',               desc:'Оцените, насколько точно описанная реакция соответствует вашей типичной.', type:'likert'},
];

function getSectionData(idx) {
  var map = [SPEED_TASKS, CRITICAL_TASKS, COMM_FC, COMM_SCENARIOS, CHANGE_FC, CHANGE_SCENARIOS, DRIVE_FC, DRIVE_SCENARIOS];
  return map[idx];
}

// ════════════════════════════════════════════════════════════
// SCORING
// ════════════════════════════════════════════════════════════

function toS(raw, rev) {
  var v = parseInt(raw, 10);
  return rev ? Math.round((6-v)/4*100) : Math.round((v-1)/4*100);
}

// answers structure:
// answers.cognitive = { sp1: {selected:'32', timeMs:4200}, cr1: {selected:'...', timeMs:12000}, ... }
// answers.likert = { co_s1: 4, ch_s2: 5, ... }
// answers.fc = { co_fc1: 'a', dr_fc2: 'b', ... }

function scoreCognitive(answers) {
  // Speed: correctness AND time pressure factored in
  var speedCorrect = 0, speedTotal = SPEED_TASKS.length, speedTimeScore = 0;
  SPEED_TASKS.forEach(function(t) {
    var a = answers.cognitive[t.id];
    if (!a) return;
    if (a.selected === t.correct) {
      speedCorrect++;
      // time bonus: faster correct answers score higher, within the time limit
      var frac = Math.max(0, 1 - (a.timeMs / 1000) / t.timeLimit);
      speedTimeScore += 0.5 + 0.5 * frac; // 0.5 base for correct, up to +0.5 for speed
    }
  });
  var speedScore = Math.round((speedTimeScore / speedTotal) * 100);

  // Critical thinking: correctness only, no time pressure
  var critCorrect = 0, critTotal = CRITICAL_TASKS.length;
  CRITICAL_TASKS.forEach(function(t) {
    var a = answers.cognitive[t.id];
    if (a && a.selected === t.correct) critCorrect++;
  });
  var criticalScore = Math.round((critCorrect / critTotal) * 100);

  return {
    speedScore: speedScore,
    speedCorrect: speedCorrect,
    speedTotal: speedTotal,
    criticalScore: criticalScore,
    critCorrect: critCorrect,
    critTotal: critTotal,
  };
}

function scoreSelfReport(answers) {
  // FC dims tally
  function fcTally(fcList) {
    var counts = {}, max = {};
    fcList.forEach(function(p) {
      max[p.a.d] = (max[p.a.d]||0) + 1;
      max[p.b.d] = (max[p.b.d]||0) + 1;
      var sel = answers.fc[p.id];
      if (sel === 'a') counts[p.a.d] = (counts[p.a.d]||0) + 1;
      if (sel === 'b') counts[p.b.d] = (counts[p.b.d]||0) + 1;
    });
    return {counts: counts, max: max};
  }

  function scenarioAvg(scenarioList, dim) {
    var vals = [];
    scenarioList.forEach(function(s) {
      if (s.dim === dim) {
        var raw = answers.likert[s.id];
        if (raw) vals.push(toS(raw, s.rev));
      }
    });
    return vals.length ? Math.round(vals.reduce(function(a,b){return a+b;},0)/vals.length) : null;
  }

  // Each factor combines FC tally (weight 30%) + scenario average (weight 70%) when both exist
  function combineFactor(dim, fcResult, scenarioList) {
    var fcPct = fcResult.max[dim] ? Math.round((fcResult.counts[dim]||0)/fcResult.max[dim]*100) : null;
    var scAvg = scenarioAvg(scenarioList, dim);
    if (fcPct !== null && scAvg !== null) return Math.round(fcPct*0.3 + scAvg*0.7);
    if (scAvg !== null) return scAvg;
    if (fcPct !== null) return fcPct;
    return 50;
  }

  var commFcResult = fcTally(COMM_FC);
  var changeFcResult = fcTally(CHANGE_FC);
  var driveFcResult = fcTally(DRIVE_FC);

  return {
    social_iq:    combineFactor('social_iq', commFcResult, COMM_SCENARIOS),
    lead_motiv:   combineFactor('lead_motiv', commFcResult, COMM_SCENARIOS),
    openness:     combineFactor('openness', changeFcResult, CHANGE_SCENARIOS),
    growth_motiv: combineFactor('growth_motiv', changeFcResult, CHANGE_SCENARIOS),
    initiative:   combineFactor('initiative', driveFcResult, DRIVE_SCENARIOS),
    persistence:  combineFactor('persistence', driveFcResult, DRIVE_SCENARIOS),
    ambition:     combineFactor('ambition', driveFcResult, DRIVE_SCENARIOS),
  };
}

// ── CONSISTENCY CHECK (for self-report parts only) ──
function checkConsistency(answers) {
  var allLikert = [];
  COMM_SCENARIOS.concat(CHANGE_SCENARIOS).concat(DRIVE_SCENARIOS).forEach(function(s) {
    if (answers.likert[s.id]) allLikert.push(parseInt(answers.likert[s.id], 10));
  });
  if (allLikert.length === 0) return { acqBias:false, extreme:false, acqMean:0, acqSD:0, reliabilityScore:100 };

  var mean = allLikert.reduce(function(a,b){return a+b;},0) / allLikert.length;
  var variance = allLikert.reduce(function(a,b){return a+Math.pow(b-mean,2);},0) / allLikert.length;
  var sd = Math.sqrt(variance);
  var acqBias = sd < 0.7;
  var extreme = mean >= 4.5 || mean <= 1.5;

  var score = 100;
  if (acqBias) score -= 25;
  if (extreme) score -= 15;
  return { acqBias:acqBias, extreme:extreme, acqMean:Math.round(mean*10)/10, acqSD:Math.round(sd*10)/10, reliabilityScore: Math.max(0, score) };
}

function computeAll(answers) {
  var cog = scoreCognitive(answers);
  var sr = scoreSelfReport(answers);
  var cons = checkConsistency(answers);

  var analysisScore = Math.round((cog.speedScore + cog.criticalScore) / 2);
  var commScore = Math.round((sr.social_iq + sr.lead_motiv) / 2);
  var changeScore = Math.round((sr.openness + sr.growth_motiv) / 2);
  var driveScore = Math.round((sr.initiative + sr.persistence + sr.ambition) / 3);

  return {
    cog: cog, sr: sr, cons: cons,
    blocks: { analysis: analysisScore, communication: commScore, change: changeScore, drive: driveScore },
  };
}

function colorByScore(s) { if (s>=71) return '#18b070'; if (s>=30) return '#e8a020'; return '#e04060'; }
function levelLabel(s) { if (s>=71) return 'Выше нормы'; if (s>=30) return 'Норма'; return 'Ниже нормы'; }

function reliabilityLabel(score) {
  if (score >= 80) return {label:'Высокая достоверность', cls:'badge-ok'};
  if (score >= 55) return {label:'Умеренная достоверность', cls:'badge-warn'};
  return {label:'Низкая достоверность', cls:'badge-bad'};
}
