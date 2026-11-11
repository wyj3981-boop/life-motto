(() => {
  const LIBRARY = window.LIBRARY;
  const $ = (id) => document.getElementById(id);

  // ───────── 분류 + 랜덤 ─────────
  function classify(worry) {
    const text = worry.toLowerCase();
    let best = "general", bestScore = 0;
    for (const [key, cat] of Object.entries(LIBRARY)) {
      const score = cat.keywords.filter((k) => text.includes(k)).length;
      if (score > bestScore) { best = key; bestScore = score; }
    }
    return best;
  }

  const lastShown = {};
  function pick(category) {
    const codes = LIBRARY[category].codes;
    let i;
    do { i = Math.floor(Math.random() * codes.length); }
    while (codes.length > 1 && i === lastShown[category]);
    lastShown[category] = i;
    return codes[i];
  }

  const fileName = (key) => LIBRARY[key].label + ".js";

  // ───────── 문법 하이라이트 (VS Code Dark+) ─────────
  const CONTROL = new Set(["if", "else", "while", "for", "do", "try", "catch", "finally", "return", "await", "break", "continue", "switch", "case", "throw"]);
  const KEYWORD = new Set(["const", "let", "var", "function", "new", "true", "false", "null", "undefined", "of", "in", "this", "class", "typeof", "async"]);

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const span = (cls, s) => `<span class="${cls}">${esc(s)}</span>`;

  function highlightLine(line) {
    const re = /(\/\/.*)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;
    let out = "", last = 0, m;
    while ((m = re.exec(line))) {
      out += esc(line.slice(last, m.index));
      if (m[1]) out += span("t-com", m[1]);
      else if (m[2]) out += span("t-str", m[2]);
      else if (m[3]) out += span("t-num", m[3]);
      else {
        const w = m[4];
        const next = line.slice(re.lastIndex).match(/^\s*(.)/);
        let cls = "t-var";
        if (CONTROL.has(w)) cls = "t-ctl";
        else if (KEYWORD.has(w)) cls = "t-kw";
        else if (w === "Infinity" || /^[A-Z][A-Z0-9_]+$/.test(w)) cls = "t-const";
        else if (next && next[1] === "(") cls = "t-fn";
        out += span(cls, w);
      }
      last = re.lastIndex;
    }
    return out + esc(line.slice(last));
  }

  // ───────── 에디터 ─────────
  const gutter = $("gutter"), lines = $("lines");
  let typingTimer = null;
  let lastCode = "";

  function paint(text, typing) {
    const rows = text.split("\n");
    const total = Math.max(rows.length, typing ? rows.length : 0);
    const cur = rows.length - 1;
    let g = "", l = "";
    for (let i = 0; i < total; i++) {
      const isCur = i === cur;
      g += `<div class="${isCur ? "cur" : ""}">${i + 1}</div>`;
      l += `<div class="${isCur ? "cur" : ""}">${highlightLine(rows[i])}${isCur ? '<span class="caret"></span>' : ""}</div>`;
    }
    gutter.innerHTML = g;
    lines.innerHTML = l;
    $("pos").textContent = `Ln ${cur + 1}, Col ${rows[cur].length + 1}`;
  }

  function openFile(name, catLabel, code, animate = true) {
    clearInterval(typingTimer);
    lastCode = code;
    $("tabName").textContent = name;
    $("crumbFile").textContent = name;
    $("winTitle").textContent = `${name} — life-motto`;
    $("cat").textContent = catLabel;
    document.querySelectorAll(".file").forEach((f) => f.classList.toggle("on", f.dataset.name === name));

    if (!animate) { paint(code); return; }
    let n = 0;
    typingTimer = setInterval(() => {
      n += 2;
      paint(code.slice(0, n), true);
      if (n >= code.length) clearInterval(typingTimer);
    }, 20);
  }

  // ───────── 탐색기 ─────────
  let currentCategory = "general";
  const WELCOME = `// 고민 컴파일러 v1.0
// 1. 아래 터미널에 고민을 적고 Enter
// 2. 왼쪽 파일을 누르면 그 주제의 랜덤 코드

const you = "enough";
compile(yourWorry);`;

  const filesEl = $("files");
  filesEl.innerHTML =
    `<button class="file" data-name="welcome.js" data-key=""><span class="md-ico">i</span>welcome.js</button>` +
    Object.keys(LIBRARY).map((key) =>
      `<button class="file" data-name="${fileName(key)}" data-key="${key}"><span class="js-ico">JS</span>${fileName(key)}</button>`
    ).join("");

  filesEl.addEventListener("click", (e) => {
    const f = e.target.closest(".file");
    if (!f) return;
    if (!f.dataset.key) { openFile("welcome.js", "life", WELCOME); return; }
    currentCategory = f.dataset.key;
    openFile(fileName(currentCategory), LIBRARY[currentCategory].label, pick(currentCategory));
  });

  // ───────── 터미널 ─────────
  const logEl = $("log"), termEl = $("term"), input = $("worry");

  function log(html) {
    logEl.insertAdjacentHTML("beforeend", html);
    while (logEl.children.length > 12) logEl.removeChild(logEl.firstChild);
    termEl.scrollTop = termEl.scrollHeight;
  }

  function compile(worry) {
    worry = (worry || "").trim();
    if (!worry) { input.focus(); return; }
    currentCategory = classify(worry);
    const name = fileName(currentCategory);
    log(`<div class="out"><span style="color:#e5e510">$ compile</span> ${esc(worry)}</div>`);
    log(`<div class="out"><span class="ok">✓</span> compiled → ${name} <span class="info">(0 errors, 0 warnings)</span></div>`);
    openFile(name, LIBRARY[currentCategory].label, pick(currentCategory));
    input.value = "";
  }

  $("form").addEventListener("submit", (e) => { e.preventDefault(); compile(input.value); });

  const SUGGESTIONS = ["시험 공부가 손에 안 잡혀요", "남들은 다 잘하는 것 같아요", "팀플에서 나만 일하는 느낌", "진로를 못 정하겠어요", "아무것도 하기 싫은 날"];
  $("sugg").innerHTML = SUGGESTIONS.map((s) => `<button type="button">${esc(s)}</button>`).join("");
  $("sugg").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) compile(b.textContent);
  });

  // ───────── 액션 ─────────
  const toast = $("toast");
  let toastTimer;
  function notify(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
  }

  $("again").addEventListener("click", () => {
    openFile(fileName(currentCategory), LIBRARY[currentCategory].label, pick(currentCategory));
  });

  $("copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(lastCode); notify("클립보드에 복사했어요"); }
    catch { notify("복사하지 못했어요"); }
  });

  const fs = $("fs");
  $("full").addEventListener("click", () => {
    $("fsCode").innerHTML = lastCode.split("\n").map(highlightLine).join("\n");
    fs.classList.add("show");
  });
  fs.addEventListener("click", () => fs.classList.remove("show"));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fs.classList.remove("show"); });

  // 시작 화면
  openFile("welcome.js", "life", WELCOME, false);
})();
