// Supabase 데이터베이스 타입 정의
// 이 파일은 Supabase CLI로 자동 생성되거나 수동으로 정의할 수 있습니다.

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    name: string;
                    department: string;
                    anonymous_name: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    name: string;
                    department: string;
                    anonymous_name: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    name?: string;
                    department?: string;
                    anonymous_name?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            restaurants: {
                Row: {
                    id: number;
                    name: string;
                    category: string;
                    type: '점심' | '회식' | '카페';
                    avg_price: string;
                    rating: number;
                    review_count: number;
                    main_image: string | null;
                    has_zero_pay: boolean;
                    latitude: number;
                    longitude: number;
                    address: string;
                    road_address: string | null;
                    phone: string | null;
                    hours: string | null;
                    description: string | null;
                    kakao_category: string | null;
                    created_by: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: number;
                    name: string;
                    category: string;
                    type: '점심' | '회식' | '카페';
                    avg_price: string;
                    rating?: number;
                    review_count?: number;
                    main_image?: string | null;
                    has_zero_pay?: boolean;
                    latitude: number;
                    longitude: number;
                    address: string;
                    road_address?: string | null;
                    phone?: string | null;
                    hours?: string | null;
                    description?: string | null;
                    kakao_category?: string | null;
                    created_by: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: number;
                    name?: string;
                    category?: string;
                    type?: '점심' | '회식' | '카페';
                    avg_price?: string;
                    rating?: number;
                    review_count?: number;
                    main_image?: string | null;
                    has_zero_pay?: boolean;
                    latitude?: number;
                    longitude?: number;
                    address?: string;
                    road_address?: string | null;
                    phone?: string | null;
                    hours?: string | null;
                    description?: string | null;
                    kakao_category?: string | null;
                    created_by?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            photos: {
                Row: {
                    id: number;
                    restaurant_id: number;
                    url: string;
                    alt: string | null;
                    uploaded_by: string;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    restaurant_id: number;
                    url: string;
                    alt?: string | null;
                    uploaded_by: string;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    restaurant_id?: number;
                    url?: string;
                    alt?: string | null;
                    uploaded_by?: string;
                    created_at?: string;
                };
            };
            menu_items: {
                Row: {
                    id: number;
                    restaurant_id: number;
                    name: string;
                    price: string;
                    description: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: number;
                    restaurant_id: number;
                    name: string;
                    price: string;
                    description?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: number;
                    restaurant_id?: number;
                    name?: string;
                    price?: string;
                    description?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            reviews: {
                Row: {
                    id: number;
                    restaurant_id: number;
                    author_id: string;
                    author_name: string;
                    rating: number;
                    content: string;
                    likes: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: number;
                    restaurant_id: number;
                    author_id: string;
                    author_name: string;
                    rating: number;
                    content: string;
                    likes?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: number;
                    restaurant_id?: number;
                    author_id?: string;
                    author_name?: string;
                    rating?: number;
                    content?: string;
                    likes?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            comments: {
                Row: {
                    id: number;
                    review_id: number;
                    author_id: string;
                    author_name: string;
                    content: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: number;
                    review_id: number;
                    author_id: string;
                    author_name: string;
                    content: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: number;
                    review_id?: number;
                    author_id?: string;
                    author_name?: string;
                    content?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            review_likes: {
                Row: {
                    id: number;
                    review_id: number;
                    user_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    review_id: number;
                    user_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    review_id?: number;
                    user_id?: string;
                    created_at?: string;
                };
            };
        };
        Views: {
            restaurant_details: {
                Row: {
                    id: number;
                    name: string;
                    category: string;
                    type: '점심' | '회식' | '카페';
                    avg_price: string;
                    rating: number;
                    review_count: number;
                    main_image: string | null;
                    has_zero_pay: boolean;
                    latitude: number;
                    longitude: number;
                    address: string;
                    road_address: string | null;
                    phone: string | null;
                    hours: string | null;
                    description: string | null;
                    kakao_category: string | null;
                    created_by: string;
                    created_at: string;
                    updated_at: string;
                    photos: any[];
                    menu_items: any[];
                };
            };
            review_details: {
                Row: {
                    id: number;
                    restaurant_id: number;
                    author_id: string;
                    author_name: string;
                    rating: number;
                    content: string;
                    likes: number;
                    created_at: string;
                    updated_at: string;
                    comments: any[];
                };
            };
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}
