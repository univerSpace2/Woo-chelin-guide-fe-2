// 폼 데이터 타입 정의

// 회원가입 폼
export interface SignUpFormData {
    email: string;
    name: string;
    department: string;
    password: string;
    confirmPassword: string;
    anonymousName: string;
}

// 로그인 폼
export interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

// 레스토랑 추가 폼
export interface RestaurantFormData {
    // 카카오 API에서 가져온 정보
    name: string;
    address: string;
    roadAddress: string;
    phone: string;
    latitude: string;
    longitude: string;
    kakaoCategory: string;

    // 사용자 입력 정보
    category: string;
    type: '점심' | '회식' | '카페' | '';
    avgPrice: string;
    hasZeroPay: boolean;
    description: string;
    photos: File[];
    menuItems: MenuItemFormData[];
}

// 메뉴 아이템 폼
export interface MenuItemFormData {
    name: string;
    price: string;
    description: string;
}

// 리뷰 작성 폼
export interface ReviewFormData {
    restaurantId: number;
    rating: number;
    content: string;
}

// 댓글 작성 폼
export interface CommentFormData {
    reviewId: number;
    content: string;
}

// 폼 에러 타입
export interface FormErrors {
    [key: string]: string;
}

// 검색 폼
export interface SearchFormData {
    query: string;
    type: '전체' | '점심' | '회식' | '카페';
}
