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

  // 받아쓰기용 짧은 답 (대답 카드에만)
  if (item.short) {
    const dict = document.createElement("div");
    dict.className = "dictation";
    dict.innerHTML = `<span class="dict-label">✏️ 받아쓰기</span><span class="dict-word"></span>`;
    dict.querySelector(".dict-word").textContent = item.short;
    div.append(dict);
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
  renderGrid("suggestion-grid", view, { tones: true });
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

renderSuggestions();
renderGrid("positive-grid", POSITIVE_RESPONSES, { extraClass: "pos" });
renderGrid("refusal-grid", REFUSAL_RESPONSES, { extraClass: "neg" });

/* ---------- 탭 전환 (권유 / 긍정 / 부정) ---------- */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    synth.cancel();
    hidePopup();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* ---------- 사진 / 이모지 토글 ---------- */
const imgToggle = document.getElementById("img-toggle");
function updateImgToggle() {
  imgToggle.textContent = imageMode ? "😀 이모지 보기" : "🖼️ 사진 보기";
  imgToggle.classList.toggle("on", imageMode);
}
updateImgToggle();
imgToggle.addEventListener("click", () => {
  imageMode = !imageMode;
  updateImgToggle();
  renderSuggestions();
});

/* ---------- 속도 조절 ---------- */
document.getElementById("rate").addEventListener("input", e => {
  speakRate = parseFloat(e.target.value);
});
