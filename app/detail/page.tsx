'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase';
import { getRestaurantDetail } from '@/lib/supabase/restaurants';
import type { RestaurantDetail, Photo, Review, MenuItem } from '@/types';

export default function DetailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'photos' | 'reviews' | 'menu'>('photos');
    const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const checkAuthAndLoadData = async () => {
            try {
                // 인증 체크
                const authResult = await getCurrentUser();
                if (!authResult.success) {
                    router.push('/login');
                    return;
                }
                setCurrentUser(authResult.data);

                // 레스토랑 ID 확인
                const restaurantId = searchParams.get('id');
                if (!restaurantId) {
                    alert('잘못된 접근입니다.');
                    router.push('/');
                    return;
                }

                // 레스토랑 상세 정보 로드
                const restaurantResult = await getRestaurantDetail(parseInt(restaurantId));
                if (restaurantResult.success && restaurantResult.data) {
                    setRestaurant(restaurantResult.data);
                } else {
                    alert('레스토랑 정보를 찾을 수 없습니다.');
                    router.push('/');
                    return;
                }

                setIsLoading(false);
            } catch (error) {
                console.error('데이터 로드 중 오류:', error);
                router.push('/login');
            }
        };

        checkAuthAndLoadData();
    }, [router, searchParams]);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
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
                        <span className="text-2xl font-bold text-white">우</span>
                    </div>
                    <p className="text-gray-600">레스토랑 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <p className="text-gray-600">레스토랑을 찾을 수 없습니다.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 헤더 */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-800 text-xl"
                        >
                            ← 뒤로가기
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">우</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-800">우슐랭</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* 가게 정보 섹션 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex gap-6">
                        <img
                            src={restaurant.main_image || 'https://via.placeholder.com/400x300'}
                            alt={restaurant.name}
                            className="w-48 h-36 rounded-lg object-cover"
                        />

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    {restaurant.name}
                                </h1>
                                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
                                    {restaurant.category}
                                </span>
                                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                                    {restaurant.type}
                                </span>
                                {restaurant.has_zero_pay && (
                                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                                        제로페이
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                {renderStars(restaurant.rating)}
                                <span className="text-lg font-medium text-gray-700">
                                    {restaurant.rating}
                                </span>
                                <span className="text-gray-500">
                                    ({restaurant.review_count}개 리뷰)
                                </span>
                            </div>

                            <div className="space-y-2 text-gray-600">
                                <p>
                                    <span className="font-medium">주소:</span> {restaurant.address}
                                </p>
                                {restaurant.phone && (
                                    <p>
                                        <span className="font-medium">전화:</span>{' '}
                                        {restaurant.phone}
                                    </p>
                                )}
                                {restaurant.hours && (
                                    <p>
                                        <span className="font-medium">영업시간:</span>{' '}
                                        {restaurant.hours}
                                    </p>
                                )}
                                <p>
                                    <span className="font-medium">평균 가격:</span>{' '}
                                    {restaurant.avg_price}
                                </p>
                            </div>
                        </div>
                    </div>
                    {restaurant.description && (
                        <div className="mt-4 pt-4 border-t">
                            <p className="text-gray-700">{restaurant.description}</p>
                        </div>
                    )}
                </div>

                {/* 탭 네비게이션 */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('photos')}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                activeTab === 'photos'
                                    ? 'text-orange-600 border-b-2 border-orange-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            사진 ({restaurant.photos.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                activeTab === 'reviews'
                                    ? 'text-orange-600 border-b-2 border-orange-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            리뷰 ({restaurant.reviews.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                activeTab === 'menu'
                                    ? 'text-orange-600 border-b-2 border-orange-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            메뉴 ({restaurant.menu_items.length})
                        </button>
                    </div>

                    <div className="p-6">
                        {/* 사진 탭 */}
                        {activeTab === 'photos' && (
                            <div>
                                {restaurant.photos.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        <p>등록된 사진이 없습니다.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {restaurant.photos.map((photo) => (
                                            <div key={photo.id} className="aspect-video">
                                                <img
                                                    src={photo.url}
                                                    alt={photo.alt || restaurant.name}
                                                    className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 리뷰 탭 */}
                        {activeTab === 'reviews' && (
                            <div>
                                {restaurant.reviews.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        <p>등록된 리뷰가 없습니다.</p>
                                        <p className="text-sm mt-2">첫 번째 리뷰를 작성해보세요!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {restaurant.reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="border-b pb-6 last:border-b-0"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                            <span className="text-gray-600 font-medium">
                                                                {review.author_name[0]}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800">
                                                                {review.author_name}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(
                                                                    review.created_at,
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                </div>

                                                <p className="text-gray-700 mb-3">
                                                    {review.content}
                                                </p>

                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <button className="flex items-center gap-1 hover:text-orange-600">
                                                        👍 추천 {review.likes}
                                                    </button>
                                                </div>

                                                {/* 댓글 */}
                                                {review.comments && review.comments.length > 0 && (
                                                    <div className="mt-4 pl-4 border-l-2 border-gray-100">
                                                        {review.comments.map((comment) => (
                                                            <div
                                                                key={comment.id}
                                                                className="mb-3 last:mb-0"
                                                            >
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-medium text-sm text-gray-700">
                                                                        {comment.author_name}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {new Date(
                                                                            comment.created_at,
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-600">
                                                                    {comment.content}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 메뉴 탭 */}
                        {activeTab === 'menu' && (
                            <div>
                                {restaurant.menu_items.length === 0 ? (
                                    <div className="text-center text-gray-500 py-8">
                                        <p>등록된 메뉴가 없습니다.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {restaurant.menu_items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-800 mb-1">
                                                        {item.name}
                                                    </h3>
                                                    {item.description && (
                                                        <p className="text-sm text-gray-600">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-lg font-bold text-orange-600 ml-4">
                                                    {item.price}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
