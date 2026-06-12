/*
 * 학습 데이터
 * - SUGGESTION_LEVELS: 권유 문장 25개 × 3난이도(초급/중급/고급)
 *     · 초급(beginner): 교과서 수준 Let's + 동사
 *     · 중급(intermediate): 어휘 수준 ↑ + 1~2단어 추가
 *     · 고급(advanced): 어휘 수준 더 ↑ + 권유 표현 다양화(How about / Shall we / Why don't we)
 * - POSITIVE_RESPONSES / REFUSAL_RESPONSES: 대답 문장
 * - WORD_MEANINGS: 단어 클릭 시 보여줄 뜻 사전
 *
 * 음원(mp3)/이미지(png) 는 저장소에 없으므로 음성합성·이모지로 대체합니다.
 */

const SUGGESTION_LEVELS = {
  beginner: [
    { en: "Let's go swimming.",         ko: "수영하러 가자.",        emoji: "🏊" },
    { en: "Let's go to the movies.",    ko: "영화 보러 가자.",       emoji: "🎬" },
    { en: "Let's play a board game.",   ko: "보드게임 하자.",        emoji: "🎲" },
    { en: "Let's do homework.",         ko: "숙제하자.",             emoji: "📝" },
    { en: "Let's go shopping.",         ko: "쇼핑하러 가자.",        emoji: "🛍️" },
    { en: "Let's read comic books.",    ko: "만화책 읽자.",          emoji: "📚" },
    { en: "Let's play soccer.",         ko: "축구 하자.",            emoji: "⚽" },
    { en: "Let's play basketball.",     ko: "농구 하자.",            emoji: "🏀" },
    { en: "Let's ride bikes.",          ko: "자전거 타자.",          emoji: "🚲" },
    { en: "Let's eat pizza.",           ko: "피자 먹자.",            emoji: "🍕" },
    { en: "Let's make cookies.",        ko: "쿠키 만들자.",          emoji: "🍪" },
    { en: "Let's play badminton.",      ko: "배드민턴 치자.",        emoji: "🏸" },
    { en: "Let's go to the park.",      ko: "공원에 가자.",          emoji: "🌳" },
    { en: "Let's play computer games.", ko: "컴퓨터 게임 하자.",     emoji: "🎮" },
    { en: "Let's draw pictures.",       ko: "그림 그리자.",          emoji: "🎨" },
    { en: "Let's sing a song.",         ko: "노래 부르자.",          emoji: "🎤" },
    { en: "Let's dance together.",      ko: "같이 춤추자.",          emoji: "💃" },
    { en: "Let's go to the zoo.",       ko: "동물원에 가자.",        emoji: "🦁" },
    { en: "Let's fly a kite.",          ko: "연 날리자.",            emoji: "🪁" },
    { en: "Let's play hide-and-seek.",  ko: "숨바꼭질 하자.",        emoji: "🙈" },
    { en: "Let's go camping.",          ko: "캠핑 가자.",            emoji: "⛺" },
    { en: "Let's make a snowman.",      ko: "눈사람 만들자.",        emoji: "⛄" },
    { en: "Let's take a walk.",         ko: "산책하자.",             emoji: "🚶" },
    { en: "Let's bake bread.",          ko: "빵 굽자.",              emoji: "🍞" },
    { en: "Let's play table tennis.",   ko: "탁구 치자.",            emoji: "🏓" },
  ],

  intermediate: [
    { en: "Let's go swimming this afternoon.",     ko: "오늘 오후에 수영하러 가자.",     emoji: "🏊" },
    { en: "Let's watch an action movie tonight.",  ko: "오늘 밤에 액션 영화 보자.",      emoji: "🎬" },
    { en: "Let's play a fun board game together.", ko: "같이 재미있는 보드게임 하자.",   emoji: "🎲" },
    { en: "Let's finish our homework first.",      ko: "우리 숙제 먼저 끝내자.",         emoji: "📝" },
    { en: "Let's go shopping at the mall.",        ko: "쇼핑몰에 쇼핑하러 가자.",        emoji: "🛍️" },
    { en: "Let's read some funny comic books.",    ko: "재미있는 만화책 좀 읽자.",       emoji: "📚" },
    { en: "Let's play soccer after school.",       ko: "방과 후에 축구 하자.",           emoji: "⚽" },
    { en: "Let's play basketball at the gym.",     ko: "체육관에서 농구 하자.",          emoji: "🏀" },
    { en: "Let's ride bikes along the river.",     ko: "강을 따라 자전거 타자.",         emoji: "🚲" },
    { en: "Let's order a cheese pizza.",           ko: "치즈 피자 시키자.",              emoji: "🍕" },
    { en: "Let's bake some chocolate cookies.",    ko: "초콜릿 쿠키 좀 굽자.",           emoji: "🍪" },
    { en: "Let's play badminton in the park.",     ko: "공원에서 배드민턴 치자.",        emoji: "🏸" },
    { en: "Let's take a walk in the park.",        ko: "공원에서 산책하자.",             emoji: "🌳" },
    { en: "Let's play computer games after dinner.",ko: "저녁 먹고 컴퓨터 게임 하자.",   emoji: "🎮" },
    { en: "Let's draw pictures of animals.",       ko: "동물 그림 그리자.",              emoji: "🎨" },
    { en: "Let's sing a song together.",           ko: "같이 노래 부르자.",              emoji: "🎤" },
    { en: "Let's dance to the music.",             ko: "음악에 맞춰 춤추자.",            emoji: "💃" },
    { en: "Let's visit the zoo this weekend.",     ko: "이번 주말에 동물원에 가자.",     emoji: "🦁" },
    { en: "Let's fly a kite in the field.",        ko: "들판에서 연 날리자.",            emoji: "🪁" },
    { en: "Let's play hide-and-seek outside.",     ko: "밖에서 숨바꼭질 하자.",          emoji: "🙈" },
    { en: "Let's go camping in the mountains.",    ko: "산으로 캠핑 가자.",              emoji: "⛺" },
    { en: "Let's make a big snowman.",             ko: "큰 눈사람 만들자.",              emoji: "⛄" },
    { en: "Let's take a walk after lunch.",        ko: "점심 먹고 산책하자.",            emoji: "🚶" },
    { en: "Let's bake some fresh bread.",          ko: "갓 구운 빵 좀 굽자.",            emoji: "🍞" },
    { en: "Let's play table tennis after class.",  ko: "수업 끝나고 탁구 치자.",         emoji: "🏓" },
  ],

  advanced: [
    { en: "Why don't we go swimming at the pool this weekend?", ko: "이번 주말에 수영장에 수영하러 가는 게 어때?",  emoji: "🏊" },
    { en: "How about watching a thrilling movie this evening?", ko: "오늘 저녁에 스릴 넘치는 영화 보는 게 어때?",   emoji: "🎬" },
    { en: "Shall we play an exciting board game after dinner?", ko: "저녁 먹고 신나는 보드게임 할까?",              emoji: "🎲" },
    { en: "Why don't we finish our difficult homework together?", ko: "어려운 숙제 같이 끝내는 게 어때?",           emoji: "📝" },
    { en: "How about going shopping for new clothes downtown?", ko: "시내에 새 옷 사러 쇼핑 가는 게 어때?",         emoji: "🛍️" },
    { en: "Why don't we read these amazing comic books together?", ko: "이 멋진 만화책들 같이 읽는 게 어때?",        emoji: "📚" },
    { en: "Shall we play soccer at the stadium this Saturday?", ko: "이번 토요일에 경기장에서 축구 할까?",          emoji: "⚽" },
    { en: "Why don't we practice basketball with our friends?", ko: "친구들이랑 농구 연습하는 게 어때?",            emoji: "🏀" },
    { en: "How about riding bikes through the beautiful park?", ko: "아름다운 공원을 가로질러 자전거 타는 게 어때?", emoji: "🚲" },
    { en: "Why don't we order a delicious pizza for lunch?",    ko: "점심으로 맛있는 피자 시키는 게 어때?",          emoji: "🍕" },
    { en: "How about baking sweet cookies for our family?",     ko: "가족을 위해 달콤한 쿠키 굽는 게 어때?",         emoji: "🍪" },
    { en: "Shall we play badminton outside this afternoon?",    ko: "오늘 오후에 밖에서 배드민턴 칠까?",            emoji: "🏸" },
    { en: "Why don't we relax at the quiet park nearby?",       ko: "근처 조용한 공원에서 쉬는 게 어때?",           emoji: "🌳" },
    { en: "How about playing an adventure game on the computer?",ko: "컴퓨터로 모험 게임 하는 게 어때?",            emoji: "🎮" },
    { en: "Why don't we draw a colorful picture together?",     ko: "알록달록한 그림 같이 그리는 게 어때?",          emoji: "🎨" },
    { en: "Shall we sing our favorite song on stage?",          ko: "무대에서 가장 좋아하는 노래 부를까?",          emoji: "🎤" },
    { en: "How about dancing to some exciting music tonight?",  ko: "오늘 밤 신나는 음악에 맞춰 춤추는 게 어때?",   emoji: "💃" },
    { en: "Why don't we visit the zoo to see the animals?",     ko: "동물들 보러 동물원에 가는 게 어때?",           emoji: "🦁" },
    { en: "How about flying a colorful kite on the hill?",      ko: "언덕에서 알록달록한 연 날리는 게 어때?",        emoji: "🪁" },
    { en: "Why don't we play hide-and-seek around the playground?", ko: "놀이터에서 숨바꼭질 하는 게 어때?",         emoji: "🙈" },
    { en: "Shall we go camping near the lake this summer?",     ko: "이번 여름에 호숫가로 캠핑 갈까?",              emoji: "⛺" },
    { en: "Why don't we build a huge snowman in the yard?",     ko: "마당에 커다란 눈사람 만드는 게 어때?",          emoji: "⛄" },
    { en: "How about taking a peaceful walk along the beach?",  ko: "해변을 따라 한가로이 산책하는 게 어때?",        emoji: "🚶" },
    { en: "Why don't we bake warm bread in the morning?",       ko: "아침에 따뜻한 빵 굽는 게 어때?",               emoji: "🍞" },
    { en: "Shall we play table tennis at the club today?",      ko: "오늘 클럽에서 탁구 칠까?",                     emoji: "🏓" },
  ],
};

// 긍정적으로 대답하는 문장 (교과서 Sounds good. + 추가 3개)
const POSITIVE_RESPONSES = [
  { en: "Sounds good.",     ko: "좋아.",       emoji: "😄" },
  { en: "Sure!",            ko: "물론이지!",   emoji: "👍" },
  { en: "That sounds fun!", ko: "재미있겠다!", emoji: "🤩" },
  { en: "Okay, let's go!",  ko: "좋아, 가자!", emoji: "🙌" },
];

// 거절하는 문장 (교과서 Sorry, but I'm busy. + 추가 3개)
const REFUSAL_RESPONSES = [
  { en: "Sorry, but I'm busy.",      ko: "미안하지만, 나는 바빠.",   emoji: "😅" },
  { en: "Sorry, but I'm tired.",     ko: "미안하지만, 나는 피곤해.", emoji: "😴" },
  { en: "Sorry, maybe next time.",   ko: "미안, 다음에 하자.",       emoji: "🙏" },
  { en: "Sorry, I can't right now.", ko: "미안, 지금은 안 돼.",      emoji: "😣" },
];

/*
 * 단어 뜻 사전 (단어 클릭 시 표시)
 * key 는 소문자, 양 끝 문장부호 제거, 내부 -/' 는 유지한 형태로 맞춥니다.
 */
const WORD_MEANINGS = {
  // 기본
  "let's": "~하자 (Let us)", "go": "가다", "swimming": "수영", "to": "~로, ~에",
  "the": "그 (정관사)", "movies": "영화관, 영화", "play": "(놀이·운동을) 하다",
  "a": "하나의", "an": "하나의", "board": "판", "game": "게임, 놀이", "do": "하다",
  "homework": "숙제", "shopping": "쇼핑", "read": "읽다", "comic": "만화의",
  "books": "책들", "soccer": "축구", "basketball": "농구", "ride": "타다",
  "bikes": "자전거들", "eat": "먹다", "pizza": "피자", "make": "만들다",
  "cookies": "쿠키", "badminton": "배드민턴", "park": "공원", "computer": "컴퓨터",
  "games": "게임들", "draw": "그리다", "pictures": "그림들", "sing": "노래하다",
  "song": "노래", "dance": "춤추다", "together": "함께", "zoo": "동물원",
  "fly": "날리다, 날다", "kite": "연", "hide-and-seek": "숨바꼭질", "camping": "캠핑",
  "snowman": "눈사람", "take": "하다, 가지다 (take a walk: 산책하다)", "walk": "걷기, 산책",
  "bake": "(빵을) 굽다", "bread": "빵", "table": "탁자 (table tennis: 탁구)", "tennis": "테니스",

  // 중급/고급 추가 단어
  "this": "이, 오늘 (this afternoon: 오늘 오후)", "afternoon": "오후", "pool": "수영장",
  "weekend": "주말", "watch": "보다, 시청하다", "action": "액션, 활동", "movie": "영화",
  "tonight": "오늘 밤", "how": "어떻게 (How about ~: ~하는 게 어때)", "about": "~에 대해",
  "watching": "보는 것 (watch)", "thrilling": "스릴 넘치는", "evening": "저녁",
  "shall": "~할까 (Shall we ~: 우리 ~할까)", "we": "우리", "exciting": "신나는",
  "after": "~한 후에", "dinner": "저녁 식사", "finish": "끝내다", "our": "우리의",
  "first": "먼저, 첫 번째", "difficult": "어려운", "mall": "쇼핑몰", "new": "새로운",
  "clothes": "옷", "downtown": "시내, 도심", "going": "가는 것 (go)", "some": "조금, 약간의",
  "funny": "웃긴, 재미있는", "these": "이것들", "amazing": "멋진, 놀라운",
  "school": "학교 (after school: 방과 후)", "gym": "체육관", "stadium": "경기장",
  "saturday": "토요일", "practice": "연습하다", "with": "~와 함께", "friends": "친구들",
  "along": "~을 따라", "river": "강", "riding": "타는 것 (ride)", "through": "~을 통과하여",
  "beautiful": "아름다운", "order": "주문하다", "cheese": "치즈", "delicious": "맛있는",
  "for": "~을 위해", "lunch": "점심", "baking": "굽는 것 (bake)", "chocolate": "초콜릿",
  "sweet": "달콤한", "family": "가족", "in": "~안에서", "outside": "밖에서",
  "relax": "쉬다, 휴식하다", "quiet": "조용한", "nearby": "근처의", "playing": "하는 것 (play)",
  "adventure": "모험", "on": "~위에, ~으로", "of": "~의", "animals": "동물들",
  "colorful": "알록달록한", "favorite": "가장 좋아하는", "stage": "무대", "music": "음악",
  "dancing": "춤추는 것 (dance)", "visit": "방문하다, 가다", "see": "보다", "field": "들판",
  "hill": "언덕", "around": "~주위에", "playground": "놀이터", "mountains": "산",
  "near": "~가까이에", "lake": "호수", "summer": "여름", "big": "큰", "build": "짓다, 만들다",
  "huge": "거대한", "yard": "마당", "peaceful": "평화로운, 한가로운", "beach": "해변",
  "fresh": "신선한, 갓 만든", "warm": "따뜻한", "morning": "아침", "class": "수업",
  "club": "클럽, 동아리", "today": "오늘",
  "why": "왜 (Why don't we ~: ~하는 게 어때)", "don't": "~하지 않다 (do not)",

  // 대답 문장 단어
  "sounds": "~하게 들리다", "good": "좋은", "sure": "물론이지", "that": "그것",
  "fun": "재미, 재미있는", "okay": "좋아, 알겠어", "sorry": "미안해", "but": "하지만",
  "i'm": "나는 ~이다 (I am)", "busy": "바쁜", "tired": "피곤한", "maybe": "아마, 어쩌면",
  "next": "다음의", "time": "시간, 번 (next time: 다음에)", "i": "나",
  "can't": "할 수 없다 (cannot)", "right": "바로 (right now: 지금 당장)", "now": "지금",
};

// 단어를 사전 key 형태로 정규화 (양 끝 문장부호 제거, 내부 -/' 유지)
function wordKey(raw) {
  return raw.toLowerCase().replace(/^[^a-z']+|[^a-z'-]+$/g, "");
}
