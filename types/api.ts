// API 관련 타입 정의

// 카카오 검색 결과
export interface KakaoSearchResult {
    id: string;
    place_name: string;
    address_name: string;
    road_address_name: string;
    phone: string;
    x: string; // longitude
    y: string; // latitude
    category_name: string;
}

// API 응답 기본 타입
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// 페이지네이션 타입
export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

// 페이지네이션된 응답
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination?: Pagination;
}

// 지도 관련 타입
export interface MapCenter {
    lat: number;
    lng: number;
}

export interface MapMarker {
    id: number;
    position: MapCenter;
    title: string;
    content?: string;
}

// 카카오 지도 Props
export interface KakaoMapProps {
    latitude: number;
    longitude: number;
    level?: number;
    restaurants?: RestaurantMapData[];
    onMarkerClick?: (restaurant: RestaurantMapData) => void;
}

// 지도용 레스토랑 데이터 (가벼운 버전)
export interface RestaurantMapData {
    id: number;
    name: string;
    category: string;
    type: '점심' | '회식' | '카페';
    avgPrice: string;
    rating: number;
    reviewCount: number;
    image: string;
    hasZeroPay: boolean;
    lat: number;
    lng: number;
}

// 필터 옵션
export interface FilterOptions {
    category?: string[];
    type?: ('점심' | '회식' | '카페')[];
    hasZeroPay?: boolean;
    minRating?: number;
    maxPrice?: number;
}

// 정렬 옵션
export interface SortOptions {
    field: 'rating' | 'review_count' | 'created_at' | 'name';
    order: 'asc' | 'desc';
}

// 검색 쿼리 파라미터
export interface SearchParams {
    query?: string;
    filters?: FilterOptions;
    sort?: SortOptions;
    pagination?: Pick<Pagination, 'page' | 'limit'>;
}

// 파일 업로드 관련
export interface FileUploadResponse {
    url: string;
    key: string;
    size: number;
    type: string;
}

// 사용자 통계
export interface UserStats {
    totalReviews: number;
    totalRestaurants: number;
    averageRating: number;
    totalLikes: number;
}

// 레스토랑 통계
export interface RestaurantStats {
    totalRestaurants: number;
    averageRating: number;
    totalReviews: number;
    categoryDistribution: { [category: string]: number };
    typeDistribution: { [type: string]: number };
}
