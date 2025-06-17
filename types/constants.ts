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
