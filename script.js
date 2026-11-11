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

  // 한 줄을 [{ cls, text }] 토큰 목록으로 쪼갬 (화면 표시와 PNG 그리기에서 같이 사용)
  function tokenize(line) {
    const re = /(\/\/.*)|("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;
    const tokens = [];
    let last = 0, m;
    while ((m = re.exec(line))) {
      if (m.index > last) tokens.push({ cls: "", text: line.slice(last, m.index) });
      let cls;
      if (m[1]) cls = "t-com";
      else if (m[2]) cls = "t-str";
      else if (m[3]) cls = "t-num";
      else {
        const w = m[4];
        const next = line.slice(re.lastIndex).match(/^\s*(.)/);
        cls = "t-var";
        if (CONTROL.has(w)) cls = "t-ctl";
        else if (KEYWORD.has(w)) cls = "t-kw";
        else if (w === "Infinity" || /^[A-Z][A-Z0-9_]+$/.test(w)) cls = "t-const";
        else if (next && next[1] === "(") cls = "t-fn";
      }
      tokens.push({ cls, text: m[0] });
      last = re.lastIndex;
    }
    if (last < line.length) tokens.push({ cls: "", text: line.slice(last) });
    return tokens;
  }

  function highlightLine(line) {
    return tokenize(line).map((t) => (t.cls ? span(t.cls, t.text) : esc(t.text))).join("");
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

  // ───────── 배경화면 PNG 저장 ─────────
  const COLORS = {
    "": "#d4d4d4", "t-com": "#6a9955", "t-str": "#ce9178", "t-num": "#b5cea8",
    "t-ctl": "#c586c0", "t-kw": "#569cd6", "t-fn": "#dcdcaa", "t-var": "#9cdcfe", "t-const": "#4fc1ff",
  };

  async function renderWallpaper(code) {
    const W = 1170, H = 2532; // 아이폰 화면 비율
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, W, H);

    const rows = code.split("\n");
    const longest = Math.max(...rows.map((r) => r.length), 1);
    // 가장 긴 줄이 화면 폭의 약 80%에 들어가도록 글자 크기 결정
    let size = Math.min(64, Math.floor((W * 0.8) / (longest * 0.6)));
    const font = `500 ${size}px "JetBrains Mono", Menlo, monospace`;
    try { await document.fonts.load(font); } catch {}
    ctx.font = font;
    ctx.textBaseline = "top";

    const charW = ctx.measureText("M").width;
    const lineH = Math.round(size * 1.5);
    const blockW = longest * charW;
    const x0 = Math.round((W - blockW) / 2);
    const y0 = Math.round(H * 0.42 - (rows.length * lineH) / 2);

    rows.forEach((row, i) => {
      let x = x0;
      for (const t of tokenize(row)) {
        ctx.fillStyle = COLORS[t.cls] || COLORS[""];
        ctx.fillText(t.text, x, y0 + i * lineH);
        x += ctx.measureText(t.text).width;
      }
    });

    return new Promise((res) => canvas.toBlob(res, "image/png"));
  }

  async function saveWallpaper() {
    if (!lastCode) return;
    const blob = await renderWallpaper(lastCode);
    if (!blob) { notify("이미지를 만들지 못했어요"); return; }
    const file = new File([blob], "life-motto.png", { type: "image/png" });

    // 휴대폰: 공유 시트로 열어서 '이미지 저장' 가능
    if (navigator.canShare && navigator.canShare({ files: [file] }) && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      try { await navigator.share({ files: [file] }); return; }
      catch (e) { if (e && e.name === "AbortError") return; }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "life-motto.png";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    notify("배경화면 이미지를 저장했어요");
  }

  $("save").addEventListener("click", saveWallpaper);

  // 시작 화면
  openFile("welcome.js", "life", WELCOME, false);
})();
