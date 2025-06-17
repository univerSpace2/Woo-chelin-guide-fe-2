import type {
    ApiResponse,
    MenuItem,
    PaginatedResponse,
    Restaurant,
    RestaurantDetail,
    RestaurantFormData,
    SearchParams,
} from '@/types';
import { DEFAULTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/types/constants';
import { supabase } from './client';

// 레스토랑 목록 조회 (필터링, 정렬, 페이지네이션 지원)
export async function getRestaurants(
    params: SearchParams = {},
): Promise<PaginatedResponse<Restaurant>> {
    try {
        const {
            query = '',
            filters = {},
            sort = { field: 'created_at', order: 'desc' },
            pagination = { page: 1, limit: DEFAULTS.PAGE_SIZE },
        } = params;

        let queryBuilder = supabase.from('restaurants').select('*', { count: 'exact' });

        // 검색어 필터링
        if (query) {
            queryBuilder = queryBuilder.or(`name.ilike.%${query}%,category.ilike.%${query}%`);
        }

        // 카테고리 필터링
        if (filters.category && filters.category.length > 0) {
            queryBuilder = queryBuilder.in('category', filters.category);
        }

        // 타입 필터링
        if (filters.type && filters.type.length > 0) {
            queryBuilder = queryBuilder.in('type', filters.type);
        }

        // 제로페이 필터링
        if (filters.hasZeroPay !== undefined) {
            queryBuilder = queryBuilder.eq('has_zero_pay', filters.hasZeroPay);
        }

        // 평점 필터링
        if (filters.minRating) {
            queryBuilder = queryBuilder.gte('rating', filters.minRating);
        }

        // 정렬
        queryBuilder = queryBuilder.order(sort.field, { ascending: sort.order === 'asc' });

        // 페이지네이션
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        queryBuilder = queryBuilder.range(from, to);

        const { data, error, count } = await queryBuilder;

        if (error) {
            throw new Error(error.message);
        }

        const totalPages = count ? Math.ceil(count / pagination.limit) : 0;

        return {
            success: true,
            data: data || [],
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total: count || 0,
                totalPages,
            },
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 레스토랑 상세 정보 조회 (사진, 메뉴, 리뷰 포함)
export async function getRestaurantDetail(id: number): Promise<ApiResponse<RestaurantDetail>> {
    try {
        // 레스토랑 기본 정보
        const { data: restaurant, error: restaurantError } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', id)
            .single();

        if (restaurantError) {
            throw new Error(restaurantError.message);
        }

        if (!restaurant) {
            return {
                success: false,
                error: ERROR_MESSAGES.NOT_FOUND,
            };
        }

        // 사진 정보
        const { data: photos, error: photosError } = await supabase
            .from('photos')
            .select('*')
            .eq('restaurant_id', id)
            .order('created_at', { ascending: false });

        if (photosError) {
            throw new Error(photosError.message);
        }

        // 메뉴 정보
        const { data: menuItems, error: menuError } = await supabase
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', id)
            .order('created_at', { ascending: true });

        if (menuError) {
            throw new Error(menuError.message);
        }

        // 리뷰 정보 (댓글 포함)
        const { data: reviews, error: reviewsError } = await supabase
            .from('reviews')
            .select(
                `
                *,
                comments (*)
            `,
            )
            .eq('restaurant_id', id)
            .order('created_at', { ascending: false });

        if (reviewsError) {
            throw new Error(reviewsError.message);
        }

        const restaurantDetail: RestaurantDetail = {
            ...restaurant,
            photos: photos || [],
            menu_items: menuItems || [],
            reviews: reviews || [],
        };

        return {
            success: true,
            data: restaurantDetail,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 레스토랑 생성
export async function createRestaurant(
    formData: RestaurantFormData,
    userId: string,
): Promise<ApiResponse<Restaurant>> {
    try {
        // 레스토랑 기본 정보 저장
        const restaurantData = {
            name: formData.name,
            category: formData.category,
            type: formData.type as '점심' | '회식' | '카페',
            avg_price: formData.avgPrice,
            has_zero_pay: formData.hasZeroPay,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            address: formData.address,
            road_address: formData.roadAddress,
            phone: formData.phone,
            description: formData.description,
            kakao_category: formData.kakaoCategory,
            created_by: userId,
        };

        const { data: restaurant, error: restaurantError } = await supabase
            .from('restaurants')
            .insert(restaurantData)
            .select()
            .single();

        if (restaurantError) {
            throw new Error(restaurantError.message);
        }

        // 메뉴 아이템 저장
        if (formData.menuItems.length > 0) {
            const menuItemsData = formData.menuItems
                .filter((item) => item.name && item.price)
                .map((item) => ({
                    restaurant_id: restaurant.id,
                    name: item.name,
                    price: item.price,
                    description: item.description || null,
                }));

            if (menuItemsData.length > 0) {
                const { error: menuError } = await supabase
                    .from('menu_items')
                    .insert(menuItemsData);

                if (menuError) {
                    throw new Error(menuError.message);
                }
            }
        }

        return {
            success: true,
            data: restaurant,
            message: SUCCESS_MESSAGES.RESTAURANT_CREATED,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 레스토랑 업데이트 (누구나 수정 가능)
export async function updateRestaurant(
    id: number,
    updates: Partial<RestaurantFormData>,
    userId: string,
): Promise<ApiResponse<Restaurant>> {
    try {
        // 인증된 사용자 확인만 진행 (권한 체크 제거)
        if (!userId) {
            return {
                success: false,
                error: '로그인이 필요합니다.',
            };
        }

        // 레스토랑 정보 업데이트
        const updateData: any = {};
        if (updates.name) updateData.name = updates.name;
        if (updates.category) updateData.category = updates.category;
        if (updates.type) updateData.type = updates.type;
        if (updates.avgPrice) updateData.avg_price = updates.avgPrice;
        if (updates.hasZeroPay !== undefined) updateData.has_zero_pay = updates.hasZeroPay;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.phone !== undefined) updateData.phone = updates.phone;

        const { data, error } = await supabase
            .from('restaurants')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: '레스토랑 정보가 업데이트되었습니다.',
            data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 레스토랑 삭제
export async function deleteRestaurant(id: number, userId: string): Promise<ApiResponse<null>> {
    try {
        // 권한 확인
        const { data: restaurant, error: checkError } = await supabase
            .from('restaurants')
            .select('created_by')
            .eq('id', id)
            .single();

        if (checkError) {
            throw new Error(checkError.message);
        }

        if (restaurant.created_by !== userId) {
            return {
                success: false,
                error: ERROR_MESSAGES.FORBIDDEN,
            };
        }

        // 레스토랑 삭제 (CASCADE로 관련 데이터도 함께 삭제됨)
        const { error } = await supabase.from('restaurants').delete().eq('id', id);

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: '레스토랑이 삭제되었습니다.',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 내 주변 레스토랑 조회 (위치 기반)
export async function getNearbyRestaurants(
    latitude: number,
    longitude: number,
    radiusKm: number = 5,
): Promise<ApiResponse<Restaurant[]>> {
    try {
        // PostGIS 함수를 사용한 거리 계산
        // 실제 구현시에는 PostGIS 확장이 필요하거나,
        // 클라이언트에서 거리 계산을 수행할 수 있습니다.
        const { data, error } = await supabase
            .from('restaurants')
            .select('*')
            .gte('latitude', latitude - radiusKm / 111.0) // 대략적인 위도 범위
            .lte('latitude', latitude + radiusKm / 111.0)
            .gte('longitude', longitude - radiusKm / (111.0 * Math.cos((latitude * Math.PI) / 180)))
            .lte('longitude', longitude + radiusKm / (111.0 * Math.cos((latitude * Math.PI) / 180)))
            .order('rating', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            data: data || [],
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 메뉴 아이템 추가
export async function addMenuItem(
    restaurantId: number,
    menuData: { name: string; price: string; description?: string },
): Promise<ApiResponse<MenuItem>> {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .insert({
                restaurant_id: restaurantId,
                name: menuData.name,
                price: menuData.price,
                description: menuData.description || null,
            })
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: '메뉴가 추가되었습니다.',
            data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 메뉴 아이템 삭제
export async function deleteMenuItem(menuItemId: number): Promise<ApiResponse<null>> {
    try {
        const { error } = await supabase.from('menu_items').delete().eq('id', menuItemId);

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: '메뉴가 삭제되었습니다.',
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 모든 레스토랑의 통계 재계산 (리뷰수, 평점)
export async function refreshAllRestaurantStats(): Promise<ApiResponse<null>> {
    try {
        // 모든 레스토랑 ID 가져오기
        const { data: restaurants, error: restaurantError } = await supabase
            .from('restaurants')
            .select('id');

        if (restaurantError) {
            throw new Error(restaurantError.message);
        }

        if (!restaurants || restaurants.length === 0) {
            return {
                success: true,
                data: null,
                message: '업데이트할 레스토랑이 없습니다.',
            };
        }

        // 각 레스토랑의 통계 재계산
        for (const restaurant of restaurants) {
            await refreshRestaurantStats(restaurant.id);
        }

        return {
            success: true,
            data: null,
            message: `${restaurants.length}개 레스토랑의 통계가 업데이트되었습니다.`,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 특정 레스토랑의 통계 재계산 (리뷰수, 평점)
export async function refreshRestaurantStats(restaurantId: number): Promise<ApiResponse<null>> {
    try {
        // 해당 레스토랑의 리뷰 통계 계산
        const { data: reviewStats, error: statsError } = await supabase
            .from('reviews')
            .select('rating')
            .eq('restaurant_id', restaurantId);

        if (statsError) {
            throw new Error(statsError.message);
        }

        const reviewCount = reviewStats?.length || 0;
        const averageRating =
            reviewCount > 0
                ? reviewStats.reduce((sum, review) => sum + review.rating, 0) / reviewCount
                : 0;

        // 레스토랑 테이블 업데이트
        const { error: updateError } = await supabase
            .from('restaurants')
            .update({
                rating: Math.round(averageRating * 10) / 10, // 소수점 첫째자리까지
                review_count: reviewCount,
                updated_at: new Date().toISOString(),
            })
            .eq('id', restaurantId);

        if (updateError) {
            throw new Error(updateError.message);
        }

        return {
            success: true,
            data: null,
            message: `레스토랑 ID ${restaurantId}의 통계가 업데이트되었습니다.`,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}
