/*
 * 학습 데이터
 * - SUGGESTION_LEVELS: 권유 문장 25개 × 3난이도(초급/중급/고급)
 *     · 초급(beginner): 교과서 수준 Let's + 동사
 *     · 중급(intermediate): 어휘 수준 ↑ + 1~2단어 추가
 *     · 고급(advanced): Let's 로 시작하되 어휘 수준 더 ↑ + 수식어/구를 더 추가
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
    { en: "Let's take photos.",            ko: "사진 찍자.",            emoji: "📸" },
    { en: "Let's go to a board game cafe.",ko: "보드게임 카페에 가자.", emoji: "🃏" },
    { en: "Let's eat tanghulu.",           ko: "탕후루 먹자.",          emoji: "🍡" },
    { en: "Let's go to an escape room.",   ko: "방탈출 카페에 가자.",   emoji: "🔓" },
    { en: "Let's play baseball.",      ko: "야구 하자.",         emoji: "⚾" },
    { en: "Let's go climbing.",        ko: "클라이밍 하러 가자.", emoji: "🧗" },
    { en: "Let's eat chicken.",        ko: "치킨 먹자.",         emoji: "🍗" },
    { en: "Let's eat tteokbokki.",     ko: "떡볶이 먹자.",       emoji: "🍢" },
    { en: "Let's eat ice cream.",      ko: "아이스크림 먹자.",   emoji: "🍦" },
    { en: "Let's eat hamburgers.",     ko: "햄버거 먹자.",       emoji: "🍔" },
    { en: "Let's drink bubble tea.",   ko: "버블티 마시자.",     emoji: "🧋" },
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
    { en: "Let's take photos at the photo booth.",   ko: "인생네컷 찍으러 가자.",        emoji: "📸" },
    { en: "Let's play games at the board game cafe.",ko: "보드게임 카페에서 게임 하자.", emoji: "🃏" },
    { en: "Let's eat sweet tanghulu together.",      ko: "같이 달콤한 탕후루 먹자.",     emoji: "🍡" },
    { en: "Let's solve puzzles at the escape room.", ko: "방탈출에서 퍼즐 풀자.",        emoji: "🔓" },
    { en: "Let's play baseball in the park.",       ko: "공원에서 야구 하자.",       emoji: "⚾" },
    { en: "Let's go climbing at the gym.",          ko: "체육관에서 클라이밍 하자.", emoji: "🧗" },
    { en: "Let's eat fried chicken tonight.",       ko: "오늘 밤에 치킨 먹자.",      emoji: "🍗" },
    { en: "Let's eat spicy tteokbokki together.",   ko: "같이 매운 떡볶이 먹자.",    emoji: "🍢" },
    { en: "Let's eat cold ice cream.",              ko: "시원한 아이스크림 먹자.",   emoji: "🍦" },
    { en: "Let's eat hamburgers for lunch.",        ko: "점심으로 햄버거 먹자.",     emoji: "🍔" },
    { en: "Let's drink sweet bubble tea.",          ko: "달콤한 버블티 마시자.",     emoji: "🧋" },
  ],

  advanced: [
    { en: "Let's go swimming at the outdoor pool.",      ko: "야외 수영장에 수영하러 가자.",   emoji: "🏊" },
    { en: "Let's watch a thrilling action movie.",       ko: "스릴 넘치는 액션 영화 보자.",    emoji: "🎬" },
    { en: "Let's play an exciting board game.",          ko: "신나는 보드게임 하자.",          emoji: "🎲" },
    { en: "Let's finish our difficult homework.",        ko: "어려운 숙제 끝내자.",            emoji: "📝" },
    { en: "Let's go shopping for new clothes.",          ko: "새 옷 사러 쇼핑하러 가자.",      emoji: "🛍️" },
    { en: "Let's read these amazing comic books.",       ko: "이 멋진 만화책들 읽자.",         emoji: "📚" },
    { en: "Let's play soccer at the stadium.",           ko: "경기장에서 축구 하자.",          emoji: "⚽" },
    { en: "Let's practice basketball with our friends.", ko: "친구들이랑 농구 연습하자.",      emoji: "🏀" },
    { en: "Let's ride bikes in the beautiful park.",     ko: "아름다운 공원에서 자전거 타자.", emoji: "🚲" },
    { en: "Let's order a delicious cheese pizza.",       ko: "맛있는 치즈 피자 시키자.",       emoji: "🍕" },
    { en: "Let's bake sweet chocolate cookies.",         ko: "달콤한 초콜릿 쿠키 굽자.",       emoji: "🍪" },
    { en: "Let's play badminton this sunny afternoon.",  ko: "화창한 오후에 배드민턴 치자.",   emoji: "🏸" },
    { en: "Let's relax at the quiet park.",              ko: "조용한 공원에서 쉬자.",          emoji: "🌳" },
    { en: "Let's play an exciting adventure game.",      ko: "신나는 모험 게임 하자.",         emoji: "🎮" },
    { en: "Let's draw a colorful picture of animals.",   ko: "동물들 알록달록한 그림 그리자.", emoji: "🎨" },
    { en: "Let's sing our favorite song on stage.",      ko: "무대에서 좋아하는 노래 부르자.", emoji: "🎤" },
    { en: "Let's dance to some exciting music.",         ko: "신나는 음악에 맞춰 춤추자.",     emoji: "💃" },
    { en: "Let's see wild animals at the zoo.",          ko: "동물원에서 야생 동물 보자.",     emoji: "🦁" },
    { en: "Let's fly a colorful kite on the hill.",      ko: "언덕에서 알록달록한 연 날리자.", emoji: "🪁" },
    { en: "Let's play hide-and-seek at the playground.", ko: "놀이터에서 숨바꼭질 하자.",      emoji: "🙈" },
    { en: "Let's go camping near the lake.",             ko: "호숫가로 캠핑 가자.",            emoji: "⛺" },
    { en: "Let's build a huge snowman.",                 ko: "커다란 눈사람 만들자.",          emoji: "⛄" },
    { en: "Let's take a peaceful walk on the beach.",    ko: "해변에서 한가로이 산책하자.",    emoji: "🚶" },
    { en: "Let's bake warm fresh bread.",                ko: "따뜻한 갓 구운 빵 굽자.",        emoji: "🍞" },
    { en: "Let's play table tennis at the club.",        ko: "클럽에서 탁구 치자.",            emoji: "🏓" },
    { en: "Let's take fun photos at the photo booth.",   ko: "인생네컷 재미있게 찍자.",        emoji: "📸" },
    { en: "Let's hang out at the board game cafe.",      ko: "보드게임 카페에서 놀자.",        emoji: "🃏" },
    { en: "Let's eat delicious tanghulu.",               ko: "맛있는 탕후루 먹자.",            emoji: "🍡" },
    { en: "Let's try an exciting escape room.",          ko: "신나는 방탈출 해보자.",          emoji: "🔓" },
    { en: "Let's play baseball at the field.",           ko: "운동장에서 야구 하자.",          emoji: "⚾" },
    { en: "Let's try indoor climbing.",                  ko: "실내 클라이밍 해보자.",          emoji: "🧗" },
    { en: "Let's order crispy fried chicken.",           ko: "바삭한 치킨 시키자.",            emoji: "🍗" },
    { en: "Let's eat hot tteokbokki.",                   ko: "뜨거운 떡볶이 먹자.",            emoji: "🍢" },
    { en: "Let's eat ice cream on a hot day.",           ko: "더운 날 아이스크림 먹자.",       emoji: "🍦" },
    { en: "Let's eat juicy hamburgers.",                 ko: "육즙 가득한 햄버거 먹자.",       emoji: "🍔" },
    { en: "Let's drink cold bubble tea.",                ko: "시원한 버블티 마시자.",          emoji: "🧋" },
  ],
};

/*
 * 활동 종류 분류
 * - CATEGORY_LIST: 필터 버튼 목록
 * - SUGGESTION_CATEGORIES: 각 문장(인덱스 순서)이 속한 종류 (세 난이도 모두 같은 순서)
 */
const CATEGORY_LIST = [
  { id: "all",     label: "전체" },
  { id: "sports",  label: "⚽ 운동·스포츠" },
  { id: "indoor",  label: "🎮 실내 놀이" },
  { id: "food",    label: "🍪 먹거리" },
  { id: "outdoor", label: "🌳 나들이·카페" },
];

const SUGGESTION_CATEGORIES = [
  "sports",  // 0  swimming
  "indoor",  // 1  movies
  "indoor",  // 2  board game
  "indoor",  // 3  homework
  "outdoor", // 4  shopping
  "indoor",  // 5  comic books
  "sports",  // 6  soccer
  "sports",  // 7  basketball
  "sports",  // 8  bikes
  "food",    // 9  pizza
  "food",    // 10 cookies
  "sports",  // 11 badminton
  "outdoor", // 12 park
  "indoor",  // 13 computer games
  "indoor",  // 14 draw pictures
  "indoor",  // 15 sing a song
  "indoor",  // 16 dance
  "outdoor", // 17 zoo
  "outdoor", // 18 kite
  "sports",  // 19 hide-and-seek
  "outdoor", // 20 camping
  "outdoor", // 21 snowman
  "outdoor", // 22 walk
  "food",    // 23 bread
  "sports",  // 24 table tennis
  "outdoor", // 25 photo booth (인생네컷)
  "indoor",  // 26 board game cafe
  "food",    // 27 tanghulu (탕후루)
  "outdoor", // 28 escape room (방탈출)
  "sports",  // 29 baseball
  "sports",  // 30 climbing
  "food",    // 31 chicken
  "food",    // 32 tteokbokki
  "food",    // 33 ice cream
  "food",    // 34 hamburgers
  "food",    // 35 bubble tea
];

/*
 * 활동별 실사 이미지 키워드 (인덱스 순서, 세 난이도 공통)
 * 브라우저에서 이미지 생성 서비스로 실사풍 그림을 불러올 때 사용합니다.
 */
const IMAGE_PROMPTS = [
  "children swimming in a pool",          // 0  swimming
  "movie theater with a big screen",      // 1  movies
  "children playing a board game",        // 2  board game
  "a child doing homework at a desk",     // 3  homework
  "a shopping mall",                      // 4  shopping
  "a stack of comic books",               // 5  comic books
  "children playing soccer",              // 6  soccer
  "children playing basketball",          // 7  basketball
  "a child riding a bicycle",             // 8  bikes
  "a delicious pizza",                    // 9  pizza
  "freshly baked cookies",                // 10 cookies
  "children playing badminton",           // 11 badminton
  "a green city park",                    // 12 park
  "a child playing a computer game",      // 13 computer games
  "a child drawing a picture",            // 14 draw pictures
  "a child singing with a microphone",    // 15 sing a song
  "children dancing happily",             // 16 dance
  "zoo animals like a lion and giraffe",  // 17 zoo
  "a child flying a colorful kite",       // 18 kite
  "children playing hide and seek",       // 19 hide-and-seek
  "a camping tent in nature",             // 20 camping
  "a cute snowman in the snow",           // 21 snowman
  "a child taking a walk on a path",      // 22 walk
  "a loaf of fresh bread",                // 23 bread
  "playing table tennis ping pong",       // 24 table tennis
  "a cute photo booth (인생네컷)",          // 25 photo booth
  "a board game cafe",                    // 26 board game cafe
  "tanghulu candied fruit skewers",       // 27 tanghulu
  "an escape room with puzzles",          // 28 escape room
  "children playing baseball",            // 29 baseball
  "an indoor rock climbing wall",         // 30 climbing
  "crispy fried chicken",                 // 31 chicken
  "korean spicy tteokbokki rice cakes",   // 32 tteokbokki
  "an ice cream cone",                    // 33 ice cream
  "a tasty hamburger",                    // 34 hamburgers
  "a cup of bubble tea",                  // 35 bubble tea
];

// 긍정적으로 대답하는 문장
const POSITIVE_RESPONSES = [
  { en: "Sounds good.",     ko: "좋아.",       emoji: "😄" },
  { en: "Sure!",            ko: "물론이지!",   emoji: "👍" },
  { en: "That sounds fun!", ko: "재미있겠다!", emoji: "🤩" },
  { en: "Okay, let's go!",  ko: "좋아, 가자!", emoji: "🙌" },
];

// 거절하는 문장
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
  "games": "게임들", "draw": "그리다", "pictures": "그림들", "picture": "그림", "sing": "노래하다",
  "song": "노래", "dance": "춤추다", "together": "함께", "zoo": "동물원",
  "fly": "날리다, 날다", "kite": "연", "hide-and-seek": "숨바꼭질", "camping": "캠핑",
  "snowman": "눈사람", "take": "하다, 찍다 (take a walk: 산책하다 / take photos: 사진 찍다)", "walk": "걷기, 산책",
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
  "club": "클럽, 동아리", "today": "오늘", "outdoor": "야외의",
  "quickly": "빨리", "sunny": "화창한", "wild": "야생의", "windy": "바람 부는",
  "indoor": "실내의",
  "why": "왜 (Why don't we ~: ~하는 게 어때)", "don't": "~하지 않다 (do not)",

  // 대답 문장 단어
  "sounds": "~하게 들리다", "good": "좋은", "sure": "물론이지", "that": "그것",
  "fun": "재미, 재미있는", "okay": "좋아, 알겠어", "sorry": "미안해", "but": "하지만",
  "i'm": "나는 ~이다 (I am)", "busy": "바쁜", "tired": "피곤한", "maybe": "아마, 어쩌면",
  "next": "다음의", "time": "시간, 번 (next time: 다음에)", "i": "나",
  "can't": "할 수 없다 (cannot)", "right": "바로 (right now: 지금 당장)", "now": "지금",
  "great": "멋진, 훌륭한", "idea": "생각, 아이디어", "course": "(of course: 당연하지)",
  "yes": "응, 그래", "i'd": "나는 ~하고 싶다 (I would)", "love": "무척 좋아하다, 정말 ~하고 싶다",
  "not": "~아니다, ~않다", "feeling": "느끼는, 기분", "well": "잘, 건강한 (feeling well: 컨디션이 좋은)",
  "have": "가지다, 있다 (have to: ~해야 한다)", "other": "다른", "plans": "계획, 약속",
  "study": "공부하다", "another": "또 다른", "day": "날, 하루",

  // 요즘 인기 활동 단어
  "at": "~에서, ~에", "photos": "사진들", "photo": "사진",
  "booth": "부스 (photo booth: 인생네컷 부스)", "cafe": "카페", "hang": "(hang out: 어울려 놀다)",
  "out": "밖으로 (hang out: 놀다)", "solve": "풀다, 해결하다", "puzzles": "퍼즐들",
  "try": "해보다, 시도하다", "tanghulu": "탕후루 (과일 사탕 꼬치)",
  "escape": "탈출 (escape room: 방탈출)", "room": "방",
  "baseball": "야구", "sunday": "일요일", "climbing": "클라이밍, 암벽 등반",
  "chicken": "치킨, 닭고기", "fried": "튀긴 (fried chicken: 치킨)", "crispy": "바삭한",
  "tteokbokki": "떡볶이", "spicy": "매운", "hot": "뜨거운, 더운, 매운",
  "ice": "얼음 (ice cream: 아이스크림)", "cream": "크림", "cold": "차가운, 시원한",
  "hamburgers": "햄버거", "juicy": "육즙이 많은", "drink": "마시다",
  "bubble": "거품, 버블 (bubble tea: 버블티)", "tea": "차",
};

// 단어를 사전 key 형태로 정규화 (양 끝 문장부호 제거, 내부 -/' 유지)
function wordKey(raw) {
  return raw.toLowerCase().replace(/^[^a-z']+|[^a-z'-]+$/g, "");
}
