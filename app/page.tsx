'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KakaoMap } from './components/KakaoMap';
import { getCurrentUser } from '@/lib/supabase';
import { getRestaurants } from '@/lib/supabase/restaurants';
import type { Restaurant, SearchParams } from '@/types';

export default function Page() {
    const router = useRouter();
    const mapRef = useRef<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<'전체' | '점심' | '회식' | '카페'>('전체');
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [mapCenter, setMapCenter] = useState({ lat: 37.494539299776, lng: 127.037856255205 });
    const [isLoading, setIsLoading] = useState(true);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // 인증 상태 체크
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const result = await getCurrentUser();
                if (!result.success) {
                    router.push('/login');
                    return;
                }
                setCurrentUser(result.data);
                await loadRestaurants();
                setIsLoading(false);
            } catch (error) {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    // 레스토랑 데이터 로드
    const loadRestaurants = async () => {
        try {
            const searchParams: SearchParams = {
                query: searchQuery,
                filters: {
                    type: selectedType === '전체' ? [] : [selectedType as any],
                },
                sort: { field: 'rating', order: 'desc' },
                pagination: { page: 1, limit: 100 }, // 지도에서는 많은 데이터를 표시
            };

            const result = await getRestaurants(searchParams);
            if (result.success && result.data) {
                setRestaurants(result.data);
            } else {
                console.error('레스토랑 데이터 로드 실패:', result.error);
                setRestaurants([]);
            }
        } catch (error) {
            console.error('레스토랑 데이터 로드 중 오류:', error);
            setRestaurants([]);
        }
    };

    // 검색어나 필터 변경 시 데이터 재로드
    useEffect(() => {
        if (!isLoading && currentUser) {
            loadRestaurants();
        }
    }, [searchQuery, selectedType, isLoading, currentUser]);

    // 지도에서 표시할 레스토랑 데이터 변환
    const mapRestaurants = restaurants.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        category: restaurant.category,
        type: restaurant.type,
        avgPrice: restaurant.avg_price,
        rating: restaurant.rating,
        reviewCount: restaurant.review_count,
        image: restaurant.main_image || 'https://via.placeholder.com/300x200',
        hasZeroPay: restaurant.has_zero_pay,
        lat: restaurant.latitude,
        lng: restaurant.longitude,
    }));

    // 마커 클릭 시 지도 중심 이동 및 선택된 식당 설정
    const handleMarkerClick = (restaurant: any) => {
        const originalRestaurant = restaurants.find((r) => r.id === restaurant.id);
        setSelectedRestaurant(originalRestaurant || null);
        setMapCenter({ lat: restaurant.lat, lng: restaurant.lng });
    };

    // 식당 리스트 클릭 시 지도 중심 이동
    const handleRestaurantClick = (restaurant: Restaurant) => {
        setMapCenter({ lat: restaurant.latitude, lng: restaurant.longitude });
        setSelectedRestaurant(restaurant);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            >
                ★
            </span>
        ));
    };

    // 로딩 중일 때 보여줄 컴포넌트
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 animate-pulse">
                        <img
                            src="/woochelin.png"
                            alt="우슐랭 로고"
                            className="w-8 h-8 rounded-lg object-cover"
                        />
                    </div>
                    <p className="text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex">
            {/* 메인 지도 영역 */}
            <div className="flex-1 relative">
                <KakaoMap
                    latitude={mapCenter.lat}
                    longitude={mapCenter.lng}
                    level={1}
                    restaurants={mapRestaurants}
                    onMarkerClick={handleMarkerClick}
                />

                {/* 선택된 식당 정보 팝업 */}
                {selectedRestaurant && (
                    <div className="absolute bottom-4 left-4 right-80 bg-white rounded-lg shadow-xl p-4 z-10">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-bold text-gray-800">
                                {selectedRestaurant.name}
                            </h3>
                            <button
                                onClick={() => setSelectedRestaurant(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <img
                                src={
                                    selectedRestaurant.main_image ||
                                    'https://via.placeholder.com/300x200'
                                }
                                alt={selectedRestaurant.name}
                                className="w-20 h-20 rounded-lg object-cover"
                            />

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded">
                                        {selectedRestaurant.category}
                                    </span>
                                    <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                        {selectedRestaurant.type}
                                    </span>
                                    {selectedRestaurant.has_zero_pay && (
                                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                            제로페이
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 mb-1">
                                    {renderStars(selectedRestaurant.rating)}
                                    <span className="text-sm text-gray-600 ml-1">
                                        {selectedRestaurant.rating} (
                                        {selectedRestaurant.review_count}개 리뷰)
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    평균 {selectedRestaurant.avg_price}
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/detail?id=${selectedRestaurant.id}`);
                                    }}
                                    className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                                >
                                    더보기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 플로팅 액션 버튼 */}
                <button
                    className="absolute bottom-6 right-6 bg-orange-500 text-white w-14 h-14 rounded-full shadow-lg hover:bg-orange-600 flex items-center justify-center text-2xl z-10"
                    onClick={() => router.push('/add')}
                >
                    +
                </button>
            </div>

            {/* 우측 사이드바 */}
            <div className="w-80 bg-white shadow-lg flex flex-col">
                {/* 헤더 */}
                <div className="p-4 border-b">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <img
                                src="/woochelin.png"
                                alt="우슐랭 로고"
                                className="w-8 h-8 rounded-lg object-cover"
                            />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">우슐랭</h1>
                        {currentUser && (
                            <span className="text-sm text-gray-600 ml-auto">
                                {currentUser.profile.name}님
                            </span>
                        )}
                    </div>

                    {/* 검색바 */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="식당명 또는 음식 종류 검색"
                        />

                        <div className="absolute right-3 top-2.5 text-gray-400">🔍</div>
                    </div>

                    {/* 카테고리 필터 */}
                    <div className="flex gap-2">
                        {['전체', '점심', '회식', '카페'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type as any)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                                    selectedType === type
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 식당 목록 */}
                <div className="flex-1 overflow-y-auto p-4">
                    {restaurants.length === 0 ? (
                        <div className="text-center text-gray-500 mt-8">
                            <p>등록된 식당이 없습니다.</p>
                            <p className="text-sm mt-2">첫 번째 식당을 등록해보세요!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {restaurants.map((restaurant) => (
                                <div
                                    key={restaurant.id}
                                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-all"
                                    onClick={() => handleRestaurantClick(restaurant)}
                                >
                                    <div className="flex gap-3">
                                        <img
                                            src={
                                                restaurant.main_image ||
                                                'https://via.placeholder.com/300x200'
                                            }
                                            alt={restaurant.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />

                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-800 mb-1">
                                                {restaurant.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                                                    {restaurant.category}
                                                </span>
                                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                                    {restaurant.type}
                                                </span>
                                                {restaurant.has_zero_pay && (
                                                    <span className="text-xs bg-green-100 text-green-600 px-1 py-0.5 rounded">
                                                        제로페이
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 mb-1">
                                                {renderStars(restaurant.rating)}
                                                <span className="text-xs text-gray-500 ml-1">
                                                    {restaurant.rating} ({restaurant.review_count})
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                평균 {restaurant.avg_price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 푸터 */}
                <div className="text-center p-4 border-t text-sm text-gray-500">
                    <p>© 2024 우슐랭. 모든 권리 보유.</p>
                </div>
            </div>
        </div>
    );
}
