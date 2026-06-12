/* =========================================================
 * Let's ~ 권유하기 · 듣고 따라 말하기 웹 앱
 * - 음성 출력: Web Speech API (SpeechSynthesis)
 * - 단어 클릭: 단어 발음 + 뜻 풍선(popup)
 * - 따라 말하기 채점: Web Speech API (SpeechRecognition)
 * ========================================================= */

/* ---------- 음성 합성 (TTS) ---------- */
const synth = window.speechSynthesis;
let enVoice = null;
let speakRate = 0.85;

function pickVoice() {
  const voices = synth.getVoices();
  enVoice =
    voices.find(v => /en[-_]US/i.test(v.lang)) ||
    voices.find(v => /^en/i.test(v.lang)) ||
    null;
  const status = document.getElementById("voice-status");
  if (status) {
    status.textContent = enVoice ? `음성: ${enVoice.name}` : "영어 음성을 찾는 중...";
  }
}
pickVoice();
if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = pickVoice;

function speak(text, rate, onStart, onEnd) {
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = rate || speakRate;
  u.pitch = 1.05;
  if (enVoice) u.voice = enVoice;
  if (onStart) u.onstart = onStart;
  if (onEnd) u.onend = onEnd;
  synth.speak(u);
}

/* ---------- 단어 뜻 풍선(popup) ---------- */
const popup = document.createElement("div");
popup.className = "word-popup hidden";
popup.innerHTML = `
  <div class="wp-word"></div>
  <div class="wp-meaning"></div>
  <button class="wp-listen">단어 다시 듣기</button>`;
document.body.appendChild(popup);

popup.querySelector(".wp-listen").addEventListener("click", e => {
  e.stopPropagation();
  if (popup.dataset.word) speak(popup.dataset.word, 0.8);
});

function showWordPopup(wordEl, rawWord) {
  const key = wordKey(rawWord);
  const meaning = WORD_MEANINGS[key] || "(뜻 정보 없음)";
  popup.dataset.word = key || rawWord;
  popup.querySelector(".wp-word").textContent = rawWord.replace(/[.,!?]+$/, "");
  popup.querySelector(".wp-meaning").textContent = meaning;

  popup.classList.remove("hidden");
  const r = wordEl.getBoundingClientRect();
  const pw = popup.offsetWidth;
  let left = r.left + r.width / 2 - pw / 2 + window.scrollX;
  left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
  let top = r.bottom + 8 + window.scrollY;
  popup.style.left = left + "px";
  popup.style.top = top + "px";

  speak(key || rawWord, 0.8);
}

function hidePopup() { popup.classList.add("hidden"); }
document.addEventListener("click", e => {
  if (!popup.contains(e.target) && !e.target.classList.contains("word")) hidePopup();
});

/* ---------- 클릭 가능한 단어로 문장 만들기 ---------- */
function buildWords(sentence) {
  const frag = document.createDocumentFragment();
  sentence.split(/\s+/).forEach((w, i) => {
    if (i > 0) frag.appendChild(document.createTextNode(" "));
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = w;
    span.addEventListener("click", e => {
      e.stopPropagation();
      showWordPopup(span, w);
    });
    frag.appendChild(span);
  });
  return frag;
}

/* ---------- 실사 이미지 ---------- */
let imageMode = true; // true: 실사 사진, false: 이모지
function hashSeed(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % 100000;
}
function imageUrl(prompt) {
  const p = encodeURIComponent("a bright, friendly, realistic photo of " + prompt + ", for kids");
  return `https://image.pollinations.ai/prompt/${p}?width=400&height=260&nologo=true&seed=${hashSeed(prompt)}`;
}

/* ---------- 카드 만들기 ---------- */
function makeCard(item, opts) {
  opts = opts || {};
  const div = document.createElement("div");
  div.className = "card"
    + (opts.extraClass ? " " + opts.extraClass : "")
    + (opts.tone != null ? " tone-" + opts.tone : "");

  function speakSentence() {
    speak(item.en, null,
      () => div.classList.add("speaking"),
      () => div.classList.remove("speaking"));
  }

  // 윗줄: 태그 + 듣기
  const top = document.createElement("div");
  top.className = "card-top";
  const tag = document.createElement("span");
  tag.className = "card-tag";
  if (opts.index != null) tag.textContent = "CARD " + opts.index;
  else if (opts.extraClass === "pos") tag.textContent = "GOOD";
  else if (opts.extraClass === "neg") tag.textContent = "SORRY";
  const listenAll = document.createElement("button");
  listenAll.className = "listen-all";
  listenAll.textContent = "듣기 ▶";
  listenAll.addEventListener("click", e => { e.stopPropagation(); speakSentence(); });
  top.append(tag, listenAll);

  // 이모지 또는 실사 이미지 (사진 모드 & 키워드가 있을 때만 이미지)
  let visual;
  if (imageMode && item.imgPrompt) {
    visual = document.createElement("img");
    visual.className = "photo";
    visual.loading = "lazy";
    visual.alt = item.en;
    visual.src = imageUrl(item.imgPrompt);
    // 이미지 로딩 실패 시 이모지로 자동 대체
    visual.addEventListener("error", () => {
      const em = document.createElement("div");
      em.className = "emoji";
      em.textContent = item.emoji;
      visual.replaceWith(em);
    });
  } else {
    visual = document.createElement("div");
    visual.className = "emoji";
    visual.textContent = item.emoji;
  }

  // 안쪽 문장 박스: 문장 + 한글 + 스피커
  const box = document.createElement("div");
  box.className = "sentence-box";
  const txt = document.createElement("div");
  txt.className = "sentence-text";
  const en = document.createElement("div");
  en.className = "en";
  en.appendChild(buildWords(item.en));
  const ko = document.createElement("div");
  ko.className = "ko";
  ko.textContent = item.ko;
  txt.append(en, ko);
  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  speakBtn.setAttribute("aria-label", "문장 듣기");
  speakBtn.textContent = "🔊";
  speakBtn.addEventListener("click", e => { e.stopPropagation(); speakSentence(); });
  box.append(txt, speakBtn);

  div.append(top, visual, box);

  // ⭐ 연습 목록 담기 버튼 (권유 문장 카드에만)
  if (opts.selectable) {
    const sel = document.createElement("button");
    sel.className = "select-btn";
    const on = isSelected(item.en);
    sel.classList.toggle("on", on);
    sel.textContent = on ? "✓ 연습 목록에 있음" : "⭐ 연습 목록에 추가";
    sel.addEventListener("click", e => {
      e.stopPropagation();
      toggleSelect(item);
    });
    div.append(sel);
  }
  return div;
}

function renderGrid(id, list, opts) {
  opts = opts || {};
  const grid = document.getElementById(id);
  grid.innerHTML = "";
  list.forEach((item, i) => {
    const cardOpts = { extraClass: opts.extraClass || "" };
    if (opts.tones) { cardOpts.tone = i % 6; cardOpts.index = i + 1; }
    if (opts.selectable) cardOpts.selectable = true;
    grid.appendChild(makeCard(item, cardOpts));
  });
}

/* ---------- 난이도(초급/중급/고급) + 활동 종류 ---------- */
let currentLevel = "beginner";
let currentCategory = "all";
function currentSuggestions() { return SUGGESTION_LEVELS[currentLevel]; }

function renderSuggestions() {
  const lvl = currentSuggestions();
  const view = [];
  lvl.forEach((item, i) => {
    if (currentCategory === "all" || SUGGESTION_CATEGORIES[i] === currentCategory) {
      // 원래 인덱스의 이미지 키워드를 붙여서 전달
      view.push(Object.assign({}, item, { imgPrompt: IMAGE_PROMPTS[i] }));
    }
  });
  renderGrid("suggestion-grid", view, { tones: true, selectable: true });
}

document.querySelectorAll(".level-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentLevel = btn.dataset.level;
    synth.cancel();
    hidePopup();
    renderSuggestions();
  });
});

document.querySelectorAll(".cat-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.cat;
    synth.cancel();
    hidePopup();
    renderSuggestions();
  });
});

/* ===========================================================
 * 내 문장 연습 (선택 → 말하기/녹음 → 정확도 → 연습 횟수)
 * =========================================================== */

/* ---- 선택/기록 상태 (브라우저에 저장) ---- */
let selected = new Map();
let stats = {};
try { (JSON.parse(localStorage.getItem("lets_selected") || "[]") || []).forEach(it => selected.set(it.en, it)); } catch (e) {}
try { stats = JSON.parse(localStorage.getItem("lets_stats") || "{}") || {}; } catch (e) {}

function persist() {
  try {
    localStorage.setItem("lets_selected", JSON.stringify([...selected.values()]));
    localStorage.setItem("lets_stats", JSON.stringify(stats));
  } catch (e) {}
}
function isSelected(en) { return selected.has(en); }
function toggleSelect(item) {
  if (selected.has(item.en)) selected.delete(item.en);
  else selected.set(item.en, { en: item.en, ko: item.ko, emoji: item.emoji, imgPrompt: item.imgPrompt });
  persist();
  updatePracticeBadge();
  renderSuggestions();
  if (document.getElementById("tab-practice").classList.contains("active")) renderPractice();
}
function updatePracticeBadge() {
  const c = document.getElementById("practice-count");
  if (c) c.textContent = selected.size;
}

/* ---- 음성 인식 (정확도 측정) ---- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const srSupported = !!SR;
let rec = srSupported ? new SR() : null;
if (rec) { rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 5; }
let recBusy = false;

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z\s']/g, "").replace(/\s+/g, " ").trim();
}
// 두 단어가 충분히 비슷한지 (복수형/철자 1개 차이 등 너그럽게 인정)
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
function wordsClose(a, b) {
  if (a === b) return true;
  if (a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a))) return true; // 복수형/어간
  return Math.abs(a.length - b.length) <= 1 && levenshtein(a, b) <= 1;          // 철자 1개 차이
}
const STOPWORDS = new Set(["a", "an", "the", "to", "of", "on", "in", "at", "for", "but", "i", "i'm", "let's", "lets"]);
// 0~1 정확도 (조금 관대하게: 기능어 제외, 비슷한 단어 인정, 많이 맞으면 약간 보정)
function scoreMatch(target, heard) {
  const t = normalize(target).split(" ").filter(Boolean);
  const h = normalize(heard).split(" ").filter(Boolean);
  let content = t.filter(w => !STOPWORDS.has(w));
  if (!content.length) content = t;
  let hit = 0;
  content.forEach(w => { if (h.some(x => wordsClose(x, w))) hit++; });
  let score = hit / content.length;
  if (score >= 0.5) score = Math.min(1, score + 0.12); // 절반 이상 맞으면 살짝 후하게
  return score;
}

/* 한 번 말하기: 음성 인식으로 채점 + (가능하면) 음성 녹음으로 재생본 생성 */
function practiceAttempt(target, cb) {
  if (!rec || recBusy) { cb.onend && cb.onend(); return; }
  recBusy = true;
  let score = 0, heard = "", errCode = null;
  rec.onresult = e => {
    const alts = e.results[0];
    for (let i = 0; i < alts.length; i++) {
      const s = scoreMatch(target, alts[i].transcript);
      if (s > score) { score = s; heard = alts[i].transcript; }
    }
  };
  rec.onerror = ev => { errCode = ev.error; };
  rec.onend = () => {
    recBusy = false;
    if (errCode && score === 0) cb.onerror && cb.onerror(errCode);
    else cb.onresult && cb.onresult(Math.round(score * 100), heard);
    cb.onend && cb.onend();
  };
  try { rec.start(); } catch (e) { recBusy = false; cb.onend && cb.onend(); }
}

/* ---- 연습 카드 ---- */
function makePracticeCard(item) {
  const div = document.createElement("div");
  div.className = "card pcard";

  const top = document.createElement("div");
  top.className = "card-top";
  const tag = document.createElement("span");
  tag.className = "card-tag";
  tag.textContent = "연습";
  const remove = document.createElement("button");
  remove.className = "premove";
  remove.setAttribute("aria-label", "목록에서 빼기");
  remove.textContent = "✕";
  remove.addEventListener("click", () => {
    selected.delete(item.en);
    persist();
    updatePracticeBadge();
    renderPractice();
    renderSuggestions();
  });
  top.append(tag, remove);

  let visual;
  if (imageMode && item.imgPrompt) {
    visual = document.createElement("img");
    visual.className = "photo";
    visual.loading = "lazy";
    visual.alt = item.en;
    visual.src = imageUrl(item.imgPrompt);
    visual.addEventListener("error", () => {
      const em = document.createElement("div");
      em.className = "emoji";
      em.textContent = item.emoji;
      visual.replaceWith(em);
    });
  } else {
    visual = document.createElement("div");
    visual.className = "emoji";
    visual.textContent = item.emoji;
  }

  const box = document.createElement("div");
  box.className = "sentence-box";
  const txt = document.createElement("div");
  txt.className = "sentence-text";
  const en = document.createElement("div");
  en.className = "en";
  en.appendChild(buildWords(item.en));
  const ko = document.createElement("div");
  ko.className = "ko";
  ko.textContent = item.ko;
  txt.append(en, ko);
  const speakBtn = document.createElement("button");
  speakBtn.className = "speak-btn";
  speakBtn.textContent = "🔊";
  speakBtn.addEventListener("click", () => speak(item.en));
  box.append(txt, speakBtn);

  const micArea = document.createElement("div");
  micArea.className = "mic-area";
  const mic = document.createElement("button");
  mic.className = "mic-btn";
  mic.setAttribute("aria-label", "말하기");
  mic.innerHTML = '<span class="mic-ico">🎙️</span>';
  const micLabel = document.createElement("div");
  micLabel.className = "mic-label";
  micLabel.textContent = "마이크를 누르고 말해보세요";
  micArea.append(mic, micLabel);

  const statsEl = document.createElement("div");
  statsEl.className = "pstats";
  const fb = document.createElement("div");
  fb.className = "mic-feedback";

  function renderStats(last) {
    const s = stats[item.en] || { attempts: 0, best: 0 };
    statsEl.innerHTML =
      `정확도 <b class="acc">${last != null ? last + "%" : "--"}</b>` +
      ` · 최고 <b class="best">${s.best ? s.best + "%" : "--"}</b>` +
      ` · 연습 <b>${s.attempts}</b>회`;
  }
  renderStats(null);

  if (!srSupported) { mic.disabled = true; mic.title = "이 브라우저는 음성 인식을 지원하지 않아요 (Chrome 권장)"; }

  mic.addEventListener("click", () => {
    if (recBusy || !srSupported) return;
    mic.classList.add("recording");
    micLabel.textContent = "🔴 녹음 중... 말해보세요";
    fb.textContent = "또박또박 말해보세요!";
    fb.className = "mic-feedback";
    practiceAttempt(item.en, {
      onresult: (score, heard) => {
        const s = stats[item.en] || { attempts: 0, best: 0 };
        s.attempts++;
        s.best = Math.max(s.best, score);
        stats[item.en] = s;
        persist();
        renderStats(score);
        if (score >= 75) { fb.className = "mic-feedback good"; fb.innerHTML = `⭐ 훌륭해요! (${score}%)<br><span class="heard">내가 한 발음: ${heard}</span>`; }
        else if (score >= 45) { fb.className = "mic-feedback good"; fb.innerHTML = `👍 좋아요! 한 번 더! (${score}%)<br><span class="heard">내가 한 발음: ${heard}</span>`; }
        else { fb.className = "mic-feedback bad"; fb.innerHTML = `🔁 다시 또박또박! (${score}%)<br><span class="heard">내가 한 발음: ${heard || "(못 들었어요)"}</span>`; }
      },
      onerror: err => {
        fb.className = "mic-feedback bad";
        fb.textContent = err === "not-allowed" ? "마이크 권한을 허용해 주세요." : "다시 시도해 주세요.";
      },
      onend: () => {
        mic.classList.remove("recording");
        micLabel.textContent = "마이크를 누르고 말해보세요";
      }
    });
  });

  div.append(top, visual, box, micArea, statsEl, fb);
  return div;
}

function renderPractice() {
  const list = document.getElementById("practice-list");
  const empty = document.getElementById("practice-empty");
  const items = [...selected.values()];
  if (!items.length) { empty.style.display = "block"; list.innerHTML = ""; return; }
  empty.style.display = "none";
  list.innerHTML = "";
  items.forEach(it => list.appendChild(makePracticeCard(it)));
}

renderSuggestions();
renderGrid("positive-grid", POSITIVE_RESPONSES, { extraClass: "pos" });
renderGrid("refusal-grid", REFUSAL_RESPONSES, { extraClass: "neg" });
updatePracticeBadge();

/* ---------- 탭 전환 (권유 / 긍정 / 부정) ---------- */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    synth.cancel();
    hidePopup();
    if (btn.dataset.tab === "practice") renderPractice();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* ---------- 속도 조절 ---------- */
document.getElementById("rate").addEventListener("input", e => {
  speakRate = parseFloat(e.target.value);
});
