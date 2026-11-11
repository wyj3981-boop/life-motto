// 코드 라이브러리 — 카테고리별 keywords(분류용)와 codes(랜덤으로 띄울 코드)
// 새 코드를 추가하려면 해당 카테고리 codes 배열에 문자열을 하나 넣으면 됩니다.
window.LIBRARY = {
  study: {
    label: "study",
    keywords: ["시험", "공부", "과제", "학점", "성적", "중간", "기말", "레포트", "리포트", "수업", "자격증", "jlpt", "토익", "수능", "암기", "도서관"],
    codes: [
`// exam season
while (exam.daysLeft > 0) {
  study(25);
  rest(5);
}
pass();`,
`// study motto
if (motivation === null) {
  openBook();
  readOnePage();
  // it shows up later
}`,
`// before the test
try {
  remember(everything);
} catch (blank) {
  breathe();
  doYourBest();
}`,
`// assignment.js
const deadline = tomorrow;
procrastinate = false;
start(now);
// future you says thanks`,
`// grade !== worth
if (grade < expected) {
  learn(fromIt);
  you.value = unchanged;
}`,
    ],
  },

  compare: {
    label: "compare",
    keywords: ["비교", "남들", "다른 사람", "다들", "잘하는", "부럽", "열등", "뒤처", "자존감", "못난", "나만 못", "나만 느"],
    codes: [
`// life motto
if (compare(me, others)) {
  others.highlights.close();
  me.progress.open();
}`,
`// own pace
const myPace = "mine";
others.timeline !== mine;
keepGoing(myPace);`,
`// comparison.js
const target = yesterdayMe;
if (me > target) {
  celebrate();
}`,
`// self worth
function worth(me) {
  return Infinity;
}
// no params required`,
`// bloom later
if (others.bloomed) {
  me.season = "coming";
  wait(patiently);
}`,
    ],
  },

  people: {
    label: "people",
    keywords: ["팀플", "팀원", "친구", "사람들", "관계", "싸웠", "싸움", "눈치", "무시", "서운", "외로", "혼자", "가족", "부모", "엄마", "아빠", "동기", "선배"],
    codes: [
`// team project
if (onlyMeWorking()) {
  speakUp(kindly);
  divide(tasks);
  logEverything();
}`,
`// relationships
for (const p of people) {
  if (p.drainsYou) {
    p.distance++;
  }
}`,
`// lonely mode
if (alone === true) {
  callSomeone();
  // or: enjoy(me);
}`,
`// after a fight
try {
  sorry.send();
} finally {
  friendship.keep();
}`,
`// people pleaser
const yes = sometimes;
const no = allowed;
you.boundaries.set();`,
    ],
  },

  career: {
    label: "career",
    keywords: ["진로", "취업", "취직", "미래", "꿈", "전공", "회사", "면접", "자소서", "진학", "직업", "인턴", "포트폴리오", "이직"],
    codes: [
`// future.js
let path = undefined;
explore();
tryThings();
// paths are built,
// not found`,
`// career motto
if (dream.unclear) {
  doNextSmallThing();
  dream.refresh();
}`,
`// job hunting
while (!hired) {
  apply();
  improve();
}
// reject(cv) !== reject(you)`,
`// life.git
commit("tried it");
checkout("new-path");
// history is never wasted`,
`// not linear
career.map(step =>
  step.learn()
);
// every step counts`,
    ],
  },

  lazy: {
    label: "motivation",
    keywords: ["하기 싫", "하기싫", "귀찮", "무기력", "의욕", "미루", "게으", "아무것도", "손에 안", "집중"],
    codes: [
`// lazy day
if (wantToDoNothing) {
  doOneTinyThing();
  return proud;
}`,
`// motivation.js
await motivation;
// never resolves
start(); // instead`,
`// procrastination
const later = "never";
doIt().now();`,
`// low battery
if (energy < 10) {
  mode = "save";
  skip(guilt);
}`,
`// 2 minute rule
start();
setTimeout(() => {
  stillGoing = true;
}, 2 * 60 * 1000);`,
    ],
  },

  tired: {
    label: "rest",
    keywords: ["피곤", "지쳤", "지친", "번아웃", "힘들", "잠", "졸려", "쉬고", "체력", "바빠", "바쁘"],
    codes: [
`// burnout
if (tired === true) {
  rest();
  // not quit()
}`,
`// sleep.exe
while (overthinking) {
  phone.down();
  eyes.close();
}`,
`// overheating
cpu.load = 100;
you.restart();
// restarts fix
// most bugs`,
`// recharge
you.charge({
  sleep: true,
  snacks: true,
  guilt: false
});`,
`// rest is productive
schedule.push(rest);
rest.priority = HIGH;`,
    ],
  },

  love: {
    label: "love",
    keywords: ["연애", "짝사랑", "헤어", "이별", "고백", "썸", "좋아하는", "애인", "여친", "남친", "답장", "카톡"],
    codes: [
`// heartbreak
if (heart.broken) {
  heart.repair(time);
  you.love = you;
}`,
`// crush.js
if (likeThem) {
  courage++;
  say("hi");
}`,
`// waiting for reply
while (!replied) {
  phone.down();
  liveLife();
}`,
`// letting go
memories.keep();
person.release();
next.loading();`,
`// self first
const love = new Love();
love.give(me);
love.share();`,
    ],
  },

  money: {
    label: "money",
    keywords: ["돈", "알바", "월세", "용돈", "통장", "생활비", "카드값", "월급"],
    codes: [
`// budget
if (wallet.empty) {
  spend(less);
  worry(less);
}`,
`// money.js
const rich = later;
const smart = now;
save(aLittle);`,
`// part-time job
work(hard);
rest(harder);
payday++;`,
`// worth
you.value
  !== account.balance;`,
    ],
  },

  anxiety: {
    label: "anxiety",
    keywords: ["불안", "걱정", "긴장", "무서", "두려", "실수", "실패", "망할", "망했", "떨려"],
    codes: [
`// anxiety
if (whatIf()) {
  return now;
}
// whatIf is not real`,
`// mistakes
try {
  attempt();
} catch (mistake) {
  learn(mistake);
}`,
`// overthinking
while (thinking > needed) {
  thinking--;
  doing++;
}`,
`// fear.js
const scary = true;
const doItAnyway = true;
go();`,
`// breathe
for (let i = 0; i < 4; i++) {
  inhale(); exhale();
}
calm = true;`,
    ],
  },

  general: {
    label: "life",
    keywords: [],
    codes: [
`// life motto
if (bad(today)) {
  today.end();
  tomorrow.retry();
}`,
`// keep going
while (alive) {
  tryAgain();
  smile();
}`,
`// bugs happen
if (life.hasBug) {
  debug(slowly);
  // not a failure
}`,
`// one day at a time
today.handle();
tomorrow = later;`,
`// error handling
try {
  life();
} catch (hard) {
  you.survive();
}`,
`// reminder
const you = "enough";
return you;`,
    ],
  },
};
