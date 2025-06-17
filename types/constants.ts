// 상수 타입 정의

// 음식 카테고리
export const FOOD_CATEGORIES = [
    '한식',
    '중식',
    '일식',
    '양식',
    '카페',
    '패스트푸드',
    '편의점',
    '주점',
    '치킨',
    '피자',
    '디저트',
    '기타',
] as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[number];

// 레스토랑 타입
export const RESTAURANT_TYPES = ['점심', '회식', '카페'] as const;

export type RestaurantType = (typeof RESTAURANT_TYPES)[number];

// 부서 목록
export const DEPARTMENTS = [
    '개발팀',
    '상담팀',
    'CM팀',
    '매니징팀',
    '원격팀',
    '경영기획팀',
    '사업전략부',
    '교육사업부',
    '온라인사업부',
] as const;

export type Department = (typeof DEPARTMENTS)[number];

// 정렬 필드
export const SORT_FIELDS = ['rating', 'review_count', 'created_at', 'name'] as const;

export type SortField = (typeof SORT_FIELDS)[number];

// 정렬 순서
export const SORT_ORDERS = ['asc', 'desc'] as const;

export type SortOrder = (typeof SORT_ORDERS)[number];

// 페이지 사이즈 옵션
export const PAGE_SIZES = [10, 20, 50, 100] as const;

export type PageSize = (typeof PAGE_SIZES)[number];

// 기본값들
export const DEFAULTS = {
    PAGE_SIZE: 20,
    MAP_LEVEL: 3,
    MAP_CENTER: { lat: 37.5665, lng: 126.978 }, // 서울 시청
    RATING_MAX: 5,
    RATING_MIN: 1,
} as const;

// 파일 업로드 제한
export const FILE_CONSTRAINTS = {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    MAX_FILES_COUNT: 10,
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

export const FRONT_PART = [
    '수줍은',
    '명랑한',
    '똑똑한',
    '용감한',
    '다정한',
    '수상한',
    '엉뚱한',
    '멍한',
    '새침한',
    '발랄한',
    '느긋한',
    '유쾌한',
    '철학적인',
    '고요한',
    '차분한',
    '건방진',
    '재치있는',
    '시크한',
    '능청스러운',
    '덤덤한',
    '반짝이는',
    '무지개빛',
    '별빛나는',
    '어두컴컴한',
    '꿈꾸는',
    '우주에서온',
    '4차원의',
    '예언하는',
    '순간이동하는',
    '투명한',
    '미지의',
    '환상의',
    '이상한',
    '빛보다빠른',
    '평행우주의',
    '비밀스러운',
    '초코맛.',
    '치즈향나는',
    '고소한',
    '소금뿌린',
    '부드러운',
    '기름진',
    '뜨끈한',
    '시원한',
    '단짠단짠한',
    '설탕폭탄',
    '비눗방울같은',
    '라면먹는',
    '베개속',
    '이불밖',
    '수학하는',
    '코딩하는',
    '독서광',
    '논리적인',
    '통계에집착하는',
    '계산빠른',
    '다국어구사하는',
    '철학하는',
    '기술자같은',
    '수집벽있는',
] as const;

export const BACK_PART = [
    '고양이',
    '강아지',
    '여우',
    '늑대',
    '팬더',
    '토끼',
    '다람쥐',
    '사자',
    '호랑이',
    '곰',
    '치타',
    '공작',
    '두더지',
    '캥거루',
    '펭귄',
    '독수리',
    '올빼미',
    '고래',
    '두루미',
    '오소리',
    '두꺼비',
    '앵무새',
    '도마뱀',
    '지우개',
    '샤프심',
    '이불',
    '베개',
    '전등',
    '우산',
    '망원경',
    '냉장고',
    '커피잔',
    '연필',
    '종이컵',
    '노트북',
    '창문',
    '빨대',
    '텀블러',
    '물병',
    '고무장갑',
    '바람개비',
    '양말',
    '택배박스',
    '마법사',
    '기사',
    '요리사',
    '우주비행사',
    '과학자',
    '시인',
    '화가',
    '도둑',
    '탐험가',
    '괴도',
    '정원사',
    '바텐더',
    '해적',
    '연금술사',
    '시간여행자',
    '해커',
    '도서관사서',
    '소방관',
    '감시자',
    '잠입요원',
] as const;
// 익명 이름 목록
export const ANONYMOUS_NAMES = [
    '신비한 고양이',
    '용감한 사자',
    '지혜로운 올빼미',
    '빠른 치타',
    '강한 곰',
    '우아한 백조',
    '영리한 여우',
    '친근한 강아지',
    '자유로운 독수리',
    '평화로운 비둘기',
    '활발한 다람쥐',
    '조용한 토끼',
    '멋진 늑대',
    '귀여운 팬더',
    '화려한 공작',
] as const;

export type AnonymousName = (typeof ANONYMOUS_NAMES)[number];

// 에러 메시지
export const ERROR_MESSAGES = {
    REQUIRED_FIELD: '필수 항목입니다.',
    INVALID_EMAIL: '올바른 이메일 형식을 입력해주세요.',
    PASSWORD_TOO_SHORT: '비밀번호는 6자 이상이어야 합니다.',
    PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
    FILE_TOO_LARGE: '파일 크기는 5MB 이하여야 합니다.',
    INVALID_FILE_TYPE: '지원하지 않는 파일 형식입니다.',
    TOO_MANY_FILES: '최대 10개의 파일만 업로드할 수 있습니다.',
    NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
    UNAUTHORIZED: '로그인이 필요합니다.',
    FORBIDDEN: '권한이 없습니다.',
    NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
    SERVER_ERROR: '서버 오류가 발생했습니다.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
    SIGNUP_SUCCESS: '회원가입이 완료되었습니다!',
    LOGIN_SUCCESS: '로그인되었습니다.',
    LOGOUT_SUCCESS: '로그아웃되었습니다.',
    RESTAURANT_CREATED: '가게가 성공적으로 등록되었습니다!',
    REVIEW_CREATED: '리뷰가 성공적으로 등록되었습니다!',
    COMMENT_CREATED: '댓글이 성공적으로 등록되었습니다!',
    PROFILE_UPDATED: '프로필이 업데이트되었습니다.',
    PASSWORD_CHANGED: '비밀번호가 변경되었습니다.',
} as const;
