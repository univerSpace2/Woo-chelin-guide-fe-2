// 데이터베이스 테이블 타입 정의

export interface User {
    id: string; // UUID (Supabase auth.users.id 참조)
    email: string;
    name: string;
    department: string;
    anonymous_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface Restaurant {
    id: number;
    name: string;
    category: string; // 한식, 중식, 일식, 양식, 카페, 패스트푸드, 기타
    type: '점심' | '회식' | '카페';
    avg_price: string; // "8,000원" 형태
    rating: number; // 평균 평점 (계산된 값)
    review_count: number; // 리뷰 개수 (계산된 값)
    main_image: string; // 대표 이미지 URL
    has_zero_pay: boolean;

    // 위치 정보
    latitude: number;
    longitude: number;
    address: string;
    road_address: string;
    phone: string;
    hours: string; // 영업시간

    // 설명
    description: string;

    // 카카오 API 정보
    kakao_category: string;

    // 메타데이터
    created_by: string; // User.id 참조
    created_at: Date;
    updated_at: Date;
}

export interface Photo {
    id: number;
    restaurant_id: number; // Restaurant.id 참조
    url: string;
    alt: string;
    uploaded_by: string; // User.id 참조
    created_at: Date;
}

export interface MenuItem {
    id: number;
    restaurant_id: number; // Restaurant.id 참조
    name: string;
    price: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
}

export interface Review {
    id: number;
    restaurant_id: number; // Restaurant.id 참조
    author_id: string; // User.id 참조
    author_name: string; // User.anonymous_name 또는 실명
    rating: number; // 1-5점
    content: string;
    likes: number; // 좋아요 개수 (계산된 값)
    created_at: Date;
    updated_at: Date;
}

export interface Comment {
    id: number;
    review_id: number; // Review.id 참조
    author_id: string; // User.id 참조
    author_name: string; // User.anonymous_name 또는 실명
    content: string;
    created_at: Date;
    updated_at: Date;
}

export interface ReviewLike {
    id: number;
    review_id: number; // Review.id 참조
    user_id: string; // User.id 참조
    created_at: Date;
}

// 확장된 타입들 (JOIN 쿼리 결과용)
export interface RestaurantWithPhotos extends Restaurant {
    photos: Photo[];
}

export interface RestaurantWithMenuItems extends Restaurant {
    menu_items: MenuItem[];
}

export interface ReviewWithComments extends Review {
    comments: Comment[];
}

export interface RestaurantDetail extends Restaurant {
    photos: Photo[];
    menu_items: MenuItem[];
    reviews: ReviewWithComments[];
}
