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

/* ---------- 카드 만들기 ---------- */
function makeCard(item, extraClass) {
  const div = document.createElement("div");
  div.className = "card" + (extraClass ? " " + extraClass : "");

  const emoji = document.createElement("div");
  emoji.className = "emoji";
  emoji.textContent = item.emoji;

  const en = document.createElement("div");
  en.className = "en";
  en.appendChild(buildWords(item.en));

  const ko = document.createElement("div");
  ko.className = "ko";
  ko.textContent = item.ko;

  const listen = document.createElement("button");
  listen.className = "listen-btn";
  listen.textContent = "문장 듣기";
  listen.addEventListener("click", e => {
    e.stopPropagation();
    speak(item.en, null,
      () => div.classList.add("speaking"),
      () => div.classList.remove("speaking"));
  });

  div.append(emoji, en, ko, listen);
  return div;
}

function renderGrid(id, list, extraClass) {
  const grid = document.getElementById(id);
  list.forEach(item => grid.appendChild(makeCard(item, extraClass)));
}

renderGrid("suggestion-grid", SUGGESTIONS);
renderGrid("positive-grid", POSITIVE_RESPONSES, "pos");
renderGrid("refusal-grid", REFUSAL_RESPONSES, "neg");

/* ---------- 탭 전환 ---------- */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
    synth.cancel();
    hidePopup();
  });
});

/* ---------- 속도 조절 ---------- */
document.getElementById("rate").addEventListener("input", e => {
  speakRate = parseFloat(e.target.value);
});

/* ---------- 대화 연습 ---------- */
const practiceCard = document.getElementById("practice-card");
const practiceEmoji = practiceCard.querySelector(".practice-emoji");
const practiceEn = practiceCard.querySelector(".practice-en");
const practiceKo = practiceCard.querySelector(".practice-ko");
const btnNew = document.getElementById("btn-new");
const btnListen = document.getElementById("btn-listen");
const btnMic = document.getElementById("btn-mic");
const micResult = document.getElementById("mic-result");
const responseBox = document.getElementById("response-box");
const responseCard = document.getElementById("response-card");
const responseEmoji = responseCard.querySelector(".response-emoji");
const responseEn = responseCard.querySelector(".response-en");
const responseKo = responseCard.querySelector(".response-ko");
const btnListenResponse = document.getElementById("btn-listen-response");

let current = null;
let currentResponse = null;

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function newSentence() {
  current = pick(SUGGESTIONS);
  practiceEmoji.textContent = current.emoji;
  practiceEn.innerHTML = "";
  practiceEn.appendChild(buildWords(current.en));
  practiceKo.textContent = current.ko;
  btnListen.disabled = false;
  btnMic.disabled = !recognitionSupported;
  micResult.textContent = "";
  micResult.className = "mic-result";
  responseBox.classList.add("hidden");
  speak(current.en, null,
    () => practiceCard.classList.add("speaking"),
    () => practiceCard.classList.remove("speaking"));
}

btnNew.addEventListener("click", newSentence);
btnListen.addEventListener("click", () => { if (current) speak(current.en); });

/* 친구의 대답을 무작위로 (긍정/거절 50:50) */
function showResponse() {
  const positive = Math.random() < 0.5;
  const pool = positive ? POSITIVE_RESPONSES : REFUSAL_RESPONSES;
  currentResponse = pick(pool);
  responseCard.className = "response-card " + (positive ? "pos" : "neg");
  responseEmoji.textContent = currentResponse.emoji;
  responseEn.innerHTML = "";
  responseEn.appendChild(buildWords(currentResponse.en));
  responseKo.textContent = currentResponse.ko;
  responseBox.classList.remove("hidden");
  setTimeout(() => speak(currentResponse.en), 500);
}

btnListenResponse.addEventListener("click", () => {
  if (currentResponse) speak(currentResponse.en);
});

/* ---------- 따라 말하기 (음성 인식) ---------- */
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognitionSupported = !!SpeechRecognition;
let recognition = null;

if (recognitionSupported) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;
}

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
}
function scoreMatch(target, heard) {
  const t = normalize(target).split(" ").filter(Boolean);
  const h = new Set(normalize(heard).split(" ").filter(Boolean));
  if (!t.length) return 0;
  return t.filter(w => h.has(w)).length / t.length;
}

if (btnMic) btnMic.addEventListener("click", () => {
  if (!recognition || !current) return;
  micResult.textContent = "듣는 중... 말해 보세요!";
  micResult.className = "mic-result";
  btnMic.disabled = true;

  recognition.onresult = e => {
    let best = 0, heard = "";
    for (let i = 0; i < e.results[0].length; i++) {
      const alt = e.results[0][i].transcript;
      const s = scoreMatch(current.en, alt);
      if (s > best) { best = s; heard = alt; }
    }
    if (best >= 0.7) {
      micResult.className = "mic-result good";
      micResult.innerHTML = `잘했어요! (${Math.round(best * 100)}% 일치)<br><span class="heard">들린 말: ${heard}</span>`;
      setTimeout(showResponse, 800);
    } else if (best >= 0.4) {
      micResult.className = "mic-result good";
      micResult.innerHTML = `좋아요! 한 번 더 또박또박! (${Math.round(best * 100)}%)<br><span class="heard">들린 말: ${heard}</span>`;
    } else {
      micResult.className = "mic-result bad";
      micResult.innerHTML = `다시 해볼까요?<br><span class="heard">들린 말: ${heard || "(못 들었어요)"}</span>`;
    }
  };
  recognition.onerror = ev => {
    micResult.className = "mic-result bad";
    micResult.textContent = ev.error === "not-allowed"
      ? "마이크 권한을 허용해 주세요." : "다시 시도해 주세요.";
  };
  recognition.onend = () => { btnMic.disabled = false; };

  try { recognition.start(); } catch { btnMic.disabled = false; }
});

if (!recognitionSupported && btnMic) {
  btnMic.title = "이 브라우저는 음성 인식을 지원하지 않아요 (Chrome 권장)";
}
