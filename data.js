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
