// 카카오 로컬 API 타입 정의
export interface KakaoPlace {
    id: string;
    place_name: string;
    category_name: string;
    category_group_code: string;
    category_group_name: string;
    phone: string;
    address_name: string;
    road_address_name: string;
    x: string; // longitude
    y: string; // latitude
    place_url: string;
    distance: string;
}

export interface KakaoPlaceSearchResponse {
    meta: {
        total_count: number;
        pageable_count: number;
        is_end: boolean;
        same_name?: {
            region: string[];
            keyword: string;
            selected_region: string;
        };
    };
    documents: KakaoPlace[];
}

export interface KakaoSearchParams {
    query: string;
    category_group_code?: string;
    x?: string;
    y?: string;
    radius?: number;
    rect?: string;
    page?: number;
    size?: number;
    sort?: 'distance' | 'accuracy';
}

// 카카오 로컬 API 장소 검색
export async function searchKakaoPlaces(params: KakaoSearchParams): Promise<{
    success: boolean;
    data?: KakaoPlace[];
    error?: string;
}> {
    try {
        const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

        if (!kakaoApiKey) {
            throw new Error(
                '카카오 API 키가 설정되지 않았습니다. NEXT_PUBLIC_KAKAO_REST_API_KEY를 .env.local에 추가해주세요.',
            );
        }

        // URL 파라미터 구성
        const searchParams = new URLSearchParams();
        searchParams.append('query', params.query);

        if (params.category_group_code) {
            searchParams.append('category_group_code', params.category_group_code);
        }
        if (params.x) {
            searchParams.append('x', params.x);
        }
        if (params.y) {
            searchParams.append('y', params.y);
        }
        if (params.radius) {
            searchParams.append('radius', params.radius.toString());
        }
        if (params.rect) {
            searchParams.append('rect', params.rect);
        }
        if (params.page) {
            searchParams.append('page', params.page.toString());
        }
        if (params.size) {
            searchParams.append('size', params.size.toString());
        }
        if (params.sort) {
            searchParams.append('sort', params.sort);
        }

        const response = await fetch(
            `https://dapi.kakao.com/v2/local/search/keyword.json?${searchParams.toString()}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `KakaoAK ${kakaoApiKey}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`카카오 API 호출 실패: ${response.status} ${errorText}`);
        }

        const data: KakaoPlaceSearchResponse = await response.json();

        return {
            success: true,
            data: data.documents,
        };
    } catch (error: any) {
        console.error('카카오 장소 검색 오류:', error);
        return {
            success: false,
            error: error.message || '장소 검색 중 오류가 발생했습니다.',
        };
    }
}

// 음식점 카테고리로 필터링하여 검색
export async function searchRestaurants(
    params: Omit<KakaoSearchParams, 'category_group_code'>,
): Promise<{
    success: boolean;
    data?: KakaoPlace[];
    error?: string;
}> {
    return searchKakaoPlaces({
        ...params,
    });
}
