/*
 * 학습 데이터
 * - suggestions: 권유 문장 25개 (교과서 6개 + 추가 19개)
 * - positiveResponses: 긍정 대답 4개
 * - refusalResponses: 거절 대답 4개
 *
 * 원본 JSON 의 음원(mp3)/이미지(png) 는 저장소에 없으므로
 * 브라우저 음성합성(Web Speech API)으로 소리를 내고,
 * 이미지 대신 이모지를 사용합니다.
 */

const SUGGESTIONS = [
  // ── 교과서 6개 표현 (Chunjae_Ham G5 Unit05) ─────────────────
  { en: "Let's go swimming.",        ko: "수영하러 가자.",        emoji: "🏊", textbook: true },
  { en: "Let's go to the movies.",   ko: "영화 보러 가자.",       emoji: "🎬", textbook: true },
  { en: "Let's play a board game.",  ko: "보드게임 하자.",        emoji: "🎲", textbook: true },
  { en: "Let's do homework.",        ko: "숙제하자.",             emoji: "📝", textbook: true },
  { en: "Let's go shopping.",        ko: "쇼핑하러 가자.",        emoji: "🛍️", textbook: true },
  { en: "Let's read comic books.",   ko: "만화책 읽자.",          emoji: "📚", textbook: true },

  // ── 추가 19개 표현 (초등학생이 좋아할 만한 활동) ─────────────
  { en: "Let's play soccer.",        ko: "축구 하자.",            emoji: "⚽", textbook: false },
  { en: "Let's play basketball.",    ko: "농구 하자.",            emoji: "🏀", textbook: false },
  { en: "Let's ride bikes.",         ko: "자전거 타자.",          emoji: "🚲", textbook: false },
  { en: "Let's eat pizza.",          ko: "피자 먹자.",            emoji: "🍕", textbook: false },
  { en: "Let's make cookies.",       ko: "쿠키 만들자.",          emoji: "🍪", textbook: false },
  { en: "Let's play badminton.",     ko: "배드민턴 치자.",        emoji: "🏸", textbook: false },
  { en: "Let's go to the park.",     ko: "공원에 가자.",          emoji: "🌳", textbook: false },
  { en: "Let's play computer games.",ko: "컴퓨터 게임 하자.",     emoji: "🎮", textbook: false },
  { en: "Let's draw pictures.",      ko: "그림 그리자.",          emoji: "🎨", textbook: false },
  { en: "Let's sing a song.",        ko: "노래 부르자.",          emoji: "🎤", textbook: false },
  { en: "Let's dance together.",     ko: "같이 춤추자.",          emoji: "💃", textbook: false },
  { en: "Let's go to the zoo.",      ko: "동물원에 가자.",        emoji: "🦁", textbook: false },
  { en: "Let's fly a kite.",         ko: "연 날리자.",            emoji: "🪁", textbook: false },
  { en: "Let's play hide-and-seek.", ko: "숨바꼭질 하자.",        emoji: "🙈", textbook: false },
  { en: "Let's go camping.",         ko: "캠핑 가자.",            emoji: "⛺", textbook: false },
  { en: "Let's make a snowman.",     ko: "눈사람 만들자.",        emoji: "⛄", textbook: false },
  { en: "Let's take a walk.",        ko: "산책하자.",             emoji: "🚶", textbook: false },
  { en: "Let's bake bread.",         ko: "빵 굽자.",              emoji: "🍞", textbook: false },
  { en: "Let's play table tennis.",  ko: "탁구 치자.",            emoji: "🏓", textbook: false },
];

// 긍정적으로 대답하는 문장 (교과서 Sounds good. + 추가 3개)
const POSITIVE_RESPONSES = [
  { en: "Sounds good.",       ko: "좋아.",            emoji: "😄", textbook: true },
  { en: "Sure!",              ko: "물론이지!",        emoji: "👍", textbook: false },
  { en: "That sounds fun!",   ko: "재미있겠다!",      emoji: "🤩", textbook: false },
  { en: "Okay, let's go!",    ko: "좋아, 가자!",      emoji: "🙌", textbook: false },
];

// 거절하는 문장 (교과서 Sorry, but I'm busy. + 추가 3개)
const REFUSAL_RESPONSES = [
  { en: "Sorry, but I'm busy.",     ko: "미안하지만, 나는 바빠.",   emoji: "😅", textbook: true },
  { en: "Sorry, but I'm tired.",    ko: "미안하지만, 나는 피곤해.", emoji: "😴", textbook: false },
  { en: "Sorry, maybe next time.",  ko: "미안, 다음에 하자.",       emoji: "🙏", textbook: false },
  { en: "Sorry, I can't right now.",ko: "미안, 지금은 안 돼.",      emoji: "😣", textbook: false },
];

/*
 * 단어 뜻 사전 (단어 클릭 시 표시)
 * key 는 소문자, 양 끝 문장부호 제거, 내부 -/' 는 유지한 형태로 맞춥니다.
 */
const WORD_MEANINGS = {
  "let's": "~하자 (Let us)",
  "go": "가다",
  "swimming": "수영",
  "to": "~로, ~에",
  "the": "그 (정관사)",
  "movies": "영화관, 영화",
  "play": "(놀이·운동을) 하다",
  "a": "하나의",
  "an": "하나의",
  "board": "판",
  "game": "게임, 놀이",
  "do": "하다",
  "homework": "숙제",
  "shopping": "쇼핑",
  "read": "읽다",
  "comic": "만화의",
  "books": "책들",
  "soccer": "축구",
  "basketball": "농구",
  "ride": "타다",
  "bikes": "자전거들",
  "eat": "먹다",
  "pizza": "피자",
  "make": "만들다",
  "cookies": "쿠키",
  "badminton": "배드민턴",
  "park": "공원",
  "computer": "컴퓨터",
  "games": "게임들",
  "draw": "그리다",
  "pictures": "그림들",
  "sing": "노래하다",
  "song": "노래",
  "dance": "춤추다",
  "together": "함께",
  "zoo": "동물원",
  "fly": "날리다, 날다",
  "kite": "연",
  "hide-and-seek": "숨바꼭질",
  "camping": "캠핑",
  "snowman": "눈사람",
  "take": "하다, 가지다 (take a walk: 산책하다)",
  "walk": "걷기, 산책",
  "bake": "(빵을) 굽다",
  "bread": "빵",
  "table": "탁자 (table tennis: 탁구)",
  "tennis": "테니스",
  // 대답 문장 단어
  "sounds": "~하게 들리다",
  "good": "좋은",
  "sure": "물론이지",
  "that": "그것",
  "fun": "재미, 재미있는",
  "okay": "좋아, 알겠어",
  "sorry": "미안해",
  "but": "하지만",
  "i'm": "나는 ~이다 (I am)",
  "busy": "바쁜",
  "tired": "피곤한",
  "maybe": "아마, 어쩌면",
  "next": "다음의",
  "time": "시간, 번 (next time: 다음에)",
  "i": "나",
  "can't": "할 수 없다 (cannot)",
  "right": "바로 (right now: 지금 당장)",
  "now": "지금",
};

// 단어를 사전 key 형태로 정규화 (양 끝 문장부호 제거, 내부 -/' 유지)
function wordKey(raw) {
  return raw.toLowerCase().replace(/^[^a-z']+|[^a-z'-]+$/g, "");
}
