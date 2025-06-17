'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase';
import { getRestaurantDetail } from '@/lib/supabase/restaurants';
import {
    createReview,
    getRestaurantReviews,
    updateReview,
    deleteReview,
} from '@/lib/supabase/reviews';
import { addMenuItem, deleteMenuItem, updateRestaurant } from '@/lib/supabase/restaurants';
import type { RestaurantDetail, Photo, Review, MenuItem, ReviewWithComments } from '@/types';

function DetailPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'photos' | 'reviews' | 'menu'>('photos');
    const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
    const [reviews, setReviews] = useState<ReviewWithComments[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // 리뷰 작성 관련 상태
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        content: '',
    });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // 리뷰 수정 관련 상태
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [editReviewForm, setEditReviewForm] = useState({
        rating: 5,
        content: '',
    });
    const [isUpdatingReview, setIsUpdatingReview] = useState(false);

    // 메뉴 관련 상태
    const [showMenuForm, setShowMenuForm] = useState(false);
    const [menuForm, setMenuForm] = useState({
        name: '',
        price: '',
        description: '',
    });
    const [isSubmittingMenu, setIsSubmittingMenu] = useState(false);

    // 가게 정보 수정 관련 상태
    const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);
    const [restaurantForm, setRestaurantForm] = useState({
        avgPrice: '',
        description: '',
        phone: '',
        hasZeroPay: false,
    });
    const [isUpdatingRestaurant, setIsUpdatingRestaurant] = useState(false);

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
                    // 레스토랑 데이터에서 리뷰 정보 추출
                    if (restaurantResult.data.reviews) {
                        setReviews(restaurantResult.data.reviews);
                    }
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

    // 레스토랑 데이터 새로고침 (평점, 리뷰 개수 등 포함)
    const refreshRestaurantData = async () => {
        if (!restaurant) return;

        try {
            // 레스토랑 상세 정보 다시 로드 (평점, 리뷰 개수 업데이트됨)
            const restaurantResult = await getRestaurantDetail(restaurant.id);
            if (restaurantResult.success && restaurantResult.data) {
                setRestaurant(restaurantResult.data);
                // 레스토랑 데이터에서 리뷰 정보 추출
                if (restaurantResult.data.reviews) {
                    setReviews(restaurantResult.data.reviews);
                }
            }
        } catch (error) {
            console.error('레스토랑 데이터 새로고침 오류:', error);
        }
    };

    // 리뷰 제출
    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!restaurant || !currentUser) return;

        if (!reviewForm.content.trim()) {
            alert('리뷰 내용을 입력해주세요.');
            return;
        }

        setIsSubmittingReview(true);

        try {
            const result = await createReview(
                {
                    restaurantId: restaurant.id,
                    rating: reviewForm.rating,
                    content: reviewForm.content.trim(),
                },
                currentUser.id,
                currentUser.profile.anonymous_name,
            );

            if (result.success) {
                alert('리뷰가 등록되었습니다!');
                setShowReviewForm(false);
                setReviewForm({ rating: 5, content: '' });
                // 레스토랑 데이터 새로고침 (평점, 리뷰 개수 등 업데이트)
                await refreshRestaurantData();
            } else {
                alert(result.error || '리뷰 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('리뷰 등록 오류:', error);
            alert('네트워크 오류가 발생했습니다.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // 리뷰 수정 시작
    const handleEditReview = (review: ReviewWithComments) => {
        setEditingReviewId(review.id);
        setEditReviewForm({
            rating: review.rating,
            content: review.content,
        });
    };

    // 리뷰 수정 취소
    const handleCancelEdit = () => {
        setEditingReviewId(null);
        setEditReviewForm({ rating: 5, content: '' });
    };

    // 리뷰 수정 제출
    const handleEditReviewSubmit = async (e: React.FormEvent, reviewId: number) => {
        e.preventDefault();

        if (!currentUser) return;

        if (!editReviewForm.content.trim()) {
            alert('리뷰 내용을 입력해주세요.');
            return;
        }

        setIsUpdatingReview(true);

        try {
            const result = await updateReview(
                reviewId,
                {
                    rating: editReviewForm.rating,
                    content: editReviewForm.content.trim(),
                },
                currentUser.id,
            );

            if (result.success) {
                alert('리뷰가 수정되었습니다!');
                setEditingReviewId(null);
                setEditReviewForm({ rating: 5, content: '' });
                // 레스토랑 데이터 새로고침
                await refreshRestaurantData();
            } else {
                alert(result.error || '리뷰 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('리뷰 수정 오류:', error);
            alert('네트워크 오류가 발생했습니다.');
        } finally {
            setIsUpdatingReview(false);
        }
    };

    // 리뷰 삭제
    const handleDeleteReview = async (reviewId: number, reviewContent: string) => {
        if (!currentUser) return;

        const truncatedContent =
            reviewContent.length > 20 ? reviewContent.substring(0, 20) + '...' : reviewContent;

        if (!confirm(`'${truncatedContent}' 리뷰를 삭제하시겠습니까?`)) {
            return;
        }

        try {
            const result = await deleteReview(reviewId, currentUser.id);

            if (result.success) {
                alert('리뷰가 삭제되었습니다!');
                // 레스토랑 데이터 새로고침
                await refreshRestaurantData();
            } else {
                alert(result.error || '리뷰 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('리뷰 삭제 오류:', error);
            alert('네트워크 오류가 발생했습니다.');
        }
    };

    // 메뉴 추가 제출
    const handleMenuSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!restaurant) return;

        if (!menuForm.name.trim() || !menuForm.price.trim()) {
            alert('메뉴명과 가격을 입력해주세요.');
            return;
        }

        setIsSubmittingMenu(true);

        try {
            const result = await addMenuItem(restaurant.id, {
                name: menuForm.name.trim(),
                price: menuForm.price.trim(),
                description: menuForm.description.trim() || undefined,
            });

            if (result.success) {
                alert('메뉴가 추가되었습니다!');
                setShowMenuForm(false);
                setMenuForm({ name: '', price: '', description: '' });
                // 레스토랑 데이터 새로고침
                await refreshRestaurantData();
            } else {
                alert(result.error || '메뉴 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('메뉴 추가 오류:', error);
            alert('네트워크 오류가 발생했습니다.');
        } finally {
            setIsSubmittingMenu(false);
        }
    };

    // 메뉴 삭제
    const handleMenuDelete = async (menuItemId: number, menuName: string) => {
        if (!confirm(`'${menuName}' 메뉴를 삭제하시겠습니까?`)) {
            return;
        }

        try {
            const result = await deleteMenuItem(menuItemId);

            if (result.success) {
                alert('메뉴가 삭제되었습니다!');
                // 레스토랑 데이터 새로고침
                await refreshRestaurantData();
            } else {
                alert(result.error || '메뉴 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('메뉴 삭제 오류:', error);
            alert('네트워크 오류가 발생했습니다.');
        }
    };

    // 가게 정보 수정 시작
    const handleEditRestaurant = () => {
        if (!restaurant) return;

        setRestaurantForm({
            avgPrice: restaurant.avg_price,
            description: restaurant.description || '',
            phone: restaurant.phone || '',
            hasZeroPay: restaurant.has_zero_pay,
        });
        setIsEditingRestaurant(true);
    };

    // 가게 정보 수정 취소
    const handleCancelRestaurantEdit = () => {
        setIsEditingRestaurant(false);
        setRestaurantForm({
            avgPrice: '',
            description: '',
            phone: '',
            hasZeroPay: false,
        });
    };

    // 가게 정보 수정 제출
    const handleRestaurantSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!restaurant || !currentUser) return;

        if (!restaurantForm.avgPrice.trim()) {
            alert('평균 가격을 입력해주세요.');
            return;
        }

        setIsUpdatingRestaurant(true);

        try {
            const result = await updateRestaurant(
                restaurant.id,
                {
                    avgPrice: restaurantForm.avgPrice.trim(),
                    description: restaurantForm.description.trim(),
                    phone: restaurantForm.phone.trim(),
                    hasZeroPay: restaurantForm.hasZeroPay,
                },
                currentUser.id,
            );

            if (result.success) {
                alert('가게 정보가 수정되었습니다!');
                setIsEditingRestaurant(false);
                // 레스토랑 데이터 새로고침
                await refreshRestaurantData();
            } else {
                alert(result.error || '가게 정보 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('가게 정보 수정 오류:', error);
            alert('네트워크 오류가 발생했습니다.');
        } finally {
            setIsUpdatingRestaurant(false);
        }
    };

    // 리뷰 평점 평균 계산
    const calculateAverageRating = (reviewList: ReviewWithComments[]) => {
        if (reviewList.length === 0) return 0;
        const total = reviewList.reduce((sum, review) => sum + review.rating, 0);
        const average = total / reviewList.length;
        return Math.round(average * 10) / 10; // 소수점 첫째자리까지
    };

    // 현재 리뷰들의 평균 평점
    const averageRating = calculateAverageRating(reviews);

    // 디버깅을 위한 콘솔 로그 (개발 중에만 사용)
    React.useEffect(() => {
        if (process.env.NODE_ENV === 'development' && reviews.length > 0) {
            console.log(
                '리뷰 목록:',
                reviews.map((r) => ({ id: r.id, rating: r.rating })),
            );
            console.log('계산된 평균 평점:', averageRating);
            console.log('데이터베이스 평점:', restaurant?.rating);
        }
    }, [reviews, averageRating, restaurant?.rating]);

    // 여러 리뷰 작성 가능하므로 hasUserReviewed 체크 제거

    const renderStars = (
        rating: number,
        interactive: boolean = false,
        onRatingChange?: (rating: number) => void,
    ) => {
        return Array.from({ length: 5 }, (_, i) => {
            const starNumber = i + 1;
            const filled = rating >= starNumber;
            const halfFilled = rating >= starNumber - 0.5 && rating < starNumber;

            return (
                <span
                    key={i}
                    className={`text-lg ${
                        filled
                            ? 'text-yellow-400'
                            : halfFilled
                              ? 'text-yellow-300'
                              : 'text-gray-300'
                    } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
                    onClick={
                        interactive && onRatingChange ? () => onRatingChange(starNumber) : undefined
                    }
                    data-oid="_269w7r"
                >
                    {filled ? '★' : halfFilled ? '★' : '☆'}
                </span>
            );
        });
    };

    // 로딩 중일 때 보여줄 컴포넌트
    if (isLoading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-white"
                data-oid=":39-5cq"
            >
                <div className="text-center" data-oid="n6q8lon">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 animate-pulse"
                        data-oid="k2nzs:8"
                    >
                        <img
                            src="/woochelin.png"
                            alt="우슐랭 로고"
                            className="w-8 h-8 rounded-lg object-cover"
                            data-oid="bc4.um-"
                        />
                    </div>
                    <p className="text-gray-600" data-oid="hy8w4or">
                        레스토랑 정보를 불러오는 중...
                    </p>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-white"
                data-oid="bzgc7-k"
            >
                <div className="text-center" data-oid="d:zgrwu">
                    <p className="text-gray-600" data-oid="9lgbyen">
                        레스토랑을 찾을 수 없습니다.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        data-oid="kv2fcul"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="7hfky3p">
            {/* 헤더 */}
            <div className="bg-white shadow-sm border-b" data-oid="dlun-_5">
                <div className="max-w-4xl mx-auto px-4 py-4" data-oid="4g-1.y5">
                    <div className="flex items-center gap-4" data-oid="8et_bkv">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-800 text-xl"
                            data-oid="-8jcfh:"
                        >
                            ← 뒤로가기
                        </button>
                        <div className="flex items-center gap-2" data-oid="z-5.kvg">
                            <div
                                className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
                                data-oid="0c79yx8"
                            >
                                <img
                                    src="/woochelin.png"
                                    alt="우슐랭 로고"
                                    className="w-8 h-8 rounded-lg object-cover"
                                    data-oid="t6:21m9"
                                />{' '}
                            </div>
                            <h1 className="text-xl font-bold text-gray-800" data-oid="zxaj37u">
                                우슐랭
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6" data-oid="601o4p6">
                {/* 가게 정보 섹션 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6" data-oid="ev5cl2c">
                    {!isEditingRestaurant ? (
                        // 일반 가게 정보 표시
                        <>
                            <div className="flex gap-6" data-oid="8j8c4fc">
                                <img
                                    src={
                                        restaurant.main_image ||
                                        'https://via.placeholder.com/400x300'
                                    }
                                    alt={restaurant.name}
                                    className="w-48 h-36 rounded-lg object-cover"
                                    data-oid="juahzob"
                                />

                                <div className="flex-1" data-oid="xh_f51.">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <h1
                                                className="text-2xl font-bold text-gray-800"
                                                data-oid="l9r:8_t"
                                            >
                                                {restaurant.name}
                                            </h1>
                                            <span
                                                className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm"
                                                data-oid="w9pmkf6"
                                            >
                                                {restaurant.category}
                                            </span>
                                            <span
                                                className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                                                data-oid="6frz7ul"
                                            >
                                                {restaurant.type}
                                            </span>
                                            {restaurant.has_zero_pay && (
                                                <span
                                                    className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm"
                                                    data-oid="qkhr:7m"
                                                >
                                                    제로페이
                                                </span>
                                            )}
                                        </div>
                                        {/* 수정 버튼 */}
                                        <button
                                            onClick={handleEditRestaurant}
                                            className="px-3 py-1 text-sm text-orange-600 hover:text-orange-800 border border-orange-300 rounded hover:bg-orange-50"
                                        >
                                            가게 정보 수정
                                        </button>
                                    </div>

                                    <div
                                        className="flex items-center gap-2 mb-3"
                                        data-oid="m1x_0zz"
                                    >
                                        {renderStars(averageRating)}
                                        <span
                                            className="text-lg font-medium text-gray-700"
                                            data-oid=".u91x-d"
                                        >
                                            {reviews.length > 0
                                                ? averageRating.toFixed(1)
                                                : '평점 없음'}
                                        </span>
                                        <span className="text-gray-500" data-oid="l.scx1u">
                                            ({reviews.length}개 리뷰)
                                        </span>
                                        {reviews.length > 0 && (
                                            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                                실시간 평균
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2 text-gray-600" data-oid="jgsdkp5">
                                        <p data-oid="lt-qds.">
                                            <span className="font-medium" data-oid=".xf2s0e">
                                                주소:
                                            </span>{' '}
                                            {restaurant.address}
                                        </p>
                                        {restaurant.phone && (
                                            <p data-oid="cd2oek8">
                                                <span className="font-medium" data-oid="gc070mz">
                                                    전화:
                                                </span>{' '}
                                                {restaurant.phone}
                                            </p>
                                        )}
                                        {restaurant.hours && (
                                            <p data-oid="8vg98t4">
                                                <span className="font-medium" data-oid="nazth-a">
                                                    영업시간:
                                                </span>{' '}
                                                {restaurant.hours}
                                            </p>
                                        )}
                                        <p data-oid="o81eld-">
                                            <span className="font-medium" data-oid="-:nbkbs">
                                                평균 가격:
                                            </span>{' '}
                                            {restaurant.avg_price}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {restaurant.description && (
                                <div className="mt-4 pt-4 border-t" data-oid="uh8o.ec">
                                    <p className="text-gray-700" data-oid=":i8ft69">
                                        {restaurant.description}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        // 가게 정보 수정 폼
                        <form onSubmit={handleRestaurantSubmit} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800">가게 정보 수정</h2>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCancelRestaurantEdit}
                                        disabled={isUpdatingRestaurant}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={
                                            isUpdatingRestaurant || !restaurantForm.avgPrice.trim()
                                        }
                                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                                    >
                                        {isUpdatingRestaurant ? '저장 중...' : '저장'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 평균 가격 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        평균 가격 *
                                    </label>
                                    <input
                                        type="text"
                                        value={restaurantForm.avgPrice}
                                        onChange={(e) =>
                                            setRestaurantForm((prev) => ({
                                                ...prev,
                                                avgPrice: e.target.value,
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        placeholder="예: 8,000원"
                                        disabled={isUpdatingRestaurant}
                                    />
                                </div>

                                {/* 전화번호 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        전화번호
                                    </label>
                                    <input
                                        type="text"
                                        value={restaurantForm.phone}
                                        onChange={(e) =>
                                            setRestaurantForm((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            }))
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        placeholder="예: 02-123-4567"
                                        disabled={isUpdatingRestaurant}
                                    />
                                </div>
                            </div>

                            {/* 설명 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    가게 설명
                                </label>
                                <textarea
                                    value={restaurantForm.description}
                                    onChange={(e) =>
                                        setRestaurantForm((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                    rows={4}
                                    placeholder="가게에 대한 간단한 설명을 입력해주세요..."
                                    disabled={isUpdatingRestaurant}
                                />
                            </div>

                            {/* 제로페이 */}
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={restaurantForm.hasZeroPay}
                                        onChange={(e) =>
                                            setRestaurantForm((prev) => ({
                                                ...prev,
                                                hasZeroPay: e.target.checked,
                                            }))
                                        }
                                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                                        disabled={isUpdatingRestaurant}
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        제로페이 사용 가능
                                    </span>
                                </label>
                            </div>
                        </form>
                    )}
                </div>

                {/* 탭 네비게이션 */}
                <div className="bg-white rounded-lg shadow-sm mb-6" data-oid="p8wunxh">
                    <div className="flex border-b" data-oid="hj8.ez-">
                        <button
                            onClick={() => setActiveTab('photos')}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                activeTab === 'photos'
                                    ? 'text-orange-600 border-b-2 border-orange-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                            data-oid="501z4v6"
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
                            data-oid="hz4mmv2"
                        >
                            리뷰 ({reviews.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('menu')}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                activeTab === 'menu'
                                    ? 'text-orange-600 border-b-2 border-orange-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                            data-oid="uc_-4mc"
                        >
                            메뉴 ({restaurant.menu_items.length})
                        </button>
                    </div>

                    <div className="p-6" data-oid="pl-f5fd">
                        {/* 사진 탭 */}
                        {activeTab === 'photos' && (
                            <div data-oid="y1dievm">
                                {restaurant.photos.length === 0 ? (
                                    <div
                                        className="text-center text-gray-500 py-8"
                                        data-oid="tn0snzy"
                                    >
                                        <p data-oid="5z:bvt6">등록된 사진이 없습니다.</p>
                                    </div>
                                ) : (
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                        data-oid="gb8p.71"
                                    >
                                        {restaurant.photos.map((photo) => (
                                            <div
                                                key={photo.id}
                                                className="aspect-video"
                                                data-oid="8n1bnz."
                                            >
                                                <img
                                                    src={photo.url}
                                                    alt={photo.alt || restaurant.name}
                                                    className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                                    data-oid="ulytpxq"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 리뷰 탭 */}
                        {activeTab === 'reviews' && (
                            <div data-oid="ry6tcir">
                                {/* 리뷰 작성 섹션 */}
                                <div className="mb-6" data-oid=".b9rf8i">
                                    {!showReviewForm ? (
                                        <button
                                            onClick={() => setShowReviewForm(true)}
                                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
                                            data-oid="rqq.jzc"
                                        >
                                            + 리뷰 작성하기
                                        </button>
                                    ) : (
                                        <form
                                            onSubmit={handleReviewSubmit}
                                            className="bg-gray-50 rounded-lg p-4"
                                            data-oid="np5r3u1"
                                        >
                                            <h3
                                                className="font-medium text-gray-800 mb-4"
                                                data-oid="uls6fax"
                                            >
                                                리뷰 작성
                                            </h3>

                                            {/* 별점 선택 */}
                                            <div className="mb-4" data-oid="6oizi:1">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                    data-oid="rdu1.cw"
                                                >
                                                    별점
                                                </label>
                                                <div
                                                    className="flex items-center gap-1"
                                                    data-oid="msx3cio"
                                                >
                                                    {renderStars(
                                                        reviewForm.rating,
                                                        true,
                                                        (rating) =>
                                                            setReviewForm((prev) => ({
                                                                ...prev,
                                                                rating,
                                                            })),
                                                    )}
                                                    <span
                                                        className="ml-2 text-sm text-gray-600"
                                                        data-oid="2u3cwn4"
                                                    >
                                                        ({reviewForm.rating}점)
                                                    </span>
                                                </div>
                                            </div>

                                            {/* 리뷰 내용 */}
                                            <div className="mb-4" data-oid="ext52d2">
                                                <label
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                    data-oid="k3s1me-"
                                                >
                                                    리뷰 내용
                                                </label>
                                                <textarea
                                                    value={reviewForm.content}
                                                    onChange={(e) =>
                                                        setReviewForm((prev) => ({
                                                            ...prev,
                                                            content: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                                    rows={4}
                                                    placeholder="이 가게에 대한 솔직한 리뷰를 작성해주세요..."
                                                    disabled={isSubmittingReview}
                                                    data-oid="d6tig2a"
                                                />
                                            </div>

                                            {/* 버튼 */}
                                            <div className="flex gap-2" data-oid="6fa4y3.">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowReviewForm(false);
                                                        setReviewForm({
                                                            rating: 5,
                                                            content: '',
                                                        });
                                                    }}
                                                    disabled={isSubmittingReview}
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                                    data-oid="ak.3as5"
                                                >
                                                    취소
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        isSubmittingReview ||
                                                        !reviewForm.content.trim()
                                                    }
                                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                                                    data-oid=".v7cksi"
                                                >
                                                    {isSubmittingReview
                                                        ? '등록 중...'
                                                        : '리뷰 등록'}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>

                                {/* 리뷰 목록 */}
                                {reviews.length === 0 ? (
                                    <div
                                        className="text-center text-gray-500 py-8"
                                        data-oid="3ugc2hp"
                                    >
                                        <p data-oid="739bpog">등록된 리뷰가 없습니다.</p>
                                        <p className="text-sm mt-2" data-oid="rksubcr">
                                            첫 번째 리뷰를 작성해보세요!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6" data-oid="y2_7_80">
                                        {reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="border-b pb-6 last:border-b-0"
                                                data-oid="sz:nhau"
                                            >
                                                {editingReviewId === review.id ? (
                                                    // 리뷰 수정 폼
                                                    <form
                                                        onSubmit={(e) =>
                                                            handleEditReviewSubmit(e, review.id)
                                                        }
                                                        className="bg-gray-50 rounded-lg p-4"
                                                    >
                                                        <h3 className="font-medium text-gray-800 mb-4">
                                                            리뷰 수정
                                                        </h3>

                                                        {/* 별점 선택 */}
                                                        <div className="mb-4">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                별점
                                                            </label>
                                                            <div className="flex items-center gap-1">
                                                                {renderStars(
                                                                    editReviewForm.rating,
                                                                    true,
                                                                    (rating) =>
                                                                        setEditReviewForm(
                                                                            (prev) => ({
                                                                                ...prev,
                                                                                rating,
                                                                            }),
                                                                        ),
                                                                )}
                                                                <span className="ml-2 text-sm text-gray-600">
                                                                    ({editReviewForm.rating}점)
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* 리뷰 내용 */}
                                                        <div className="mb-4">
                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                리뷰 내용
                                                            </label>
                                                            <textarea
                                                                value={editReviewForm.content}
                                                                onChange={(e) =>
                                                                    setEditReviewForm((prev) => ({
                                                                        ...prev,
                                                                        content: e.target.value,
                                                                    }))
                                                                }
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                                                rows={4}
                                                                placeholder="이 가게에 대한 솔직한 리뷰를 작성해주세요..."
                                                                disabled={isUpdatingReview}
                                                            />
                                                        </div>

                                                        {/* 버튼 */}
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={handleCancelEdit}
                                                                disabled={isUpdatingReview}
                                                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                                            >
                                                                취소
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                disabled={
                                                                    isUpdatingReview ||
                                                                    !editReviewForm.content.trim()
                                                                }
                                                                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                                                            >
                                                                {isUpdatingReview
                                                                    ? '수정 중...'
                                                                    : '리뷰 수정'}
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    // 일반 리뷰 표시
                                                    <>
                                                        <div
                                                            className="flex items-center justify-between mb-3"
                                                            data-oid="5qh8j-7"
                                                        >
                                                            <div
                                                                className="flex items-center gap-3"
                                                                data-oid="523l564"
                                                            >
                                                                <div
                                                                    className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"
                                                                    data-oid="n6ncs-e"
                                                                >
                                                                    <span
                                                                        className="text-gray-600 font-medium"
                                                                        data-oid="-aps1k3"
                                                                    >
                                                                        {review.author_name[0]}
                                                                    </span>
                                                                </div>
                                                                <div data-oid="8w3in2e">
                                                                    <p
                                                                        className="font-medium text-gray-800"
                                                                        data-oid="pvax-t3"
                                                                    >
                                                                        {review.author_name}
                                                                    </p>
                                                                    <p
                                                                        className="text-sm text-gray-500"
                                                                        data-oid="d.1rc-z"
                                                                    >
                                                                        {new Date(
                                                                            review.created_at,
                                                                        ).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="flex items-center gap-2"
                                                                data-oid="cudbbe9"
                                                            >
                                                                {renderStars(review.rating)}
                                                                {/* 수정/삭제 버튼 - 본인 리뷰만 */}
                                                                {currentUser &&
                                                                    review.author_id ===
                                                                        currentUser.id && (
                                                                        <div className="flex gap-1 ml-2">
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleEditReview(
                                                                                        review,
                                                                                    )
                                                                                }
                                                                                className="px-2 py-1 text-xs text-orange-600 hover:text-orange-800 border border-orange-300 rounded hover:bg-orange-50"
                                                                            >
                                                                                수정
                                                                            </button>
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleDeleteReview(
                                                                                        review.id,
                                                                                        review.content,
                                                                                    )
                                                                                }
                                                                                className="px-2 py-1 text-xs text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
                                                                            >
                                                                                삭제
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        </div>

                                                        <p
                                                            className="text-gray-700 mb-3"
                                                            data-oid="elj7f6k"
                                                        >
                                                            {review.content}
                                                        </p>

                                                        <div
                                                            className="flex items-center gap-4 text-sm text-gray-500"
                                                            data-oid="jwj8t.d"
                                                        >
                                                            <button
                                                                className="flex items-center gap-1 hover:text-orange-600"
                                                                data-oid="c34bh9h"
                                                            >
                                                                👍 추천 {review.likes}
                                                            </button>
                                                        </div>
                                                    </>
                                                )}

                                                {/* 댓글 */}
                                                {review.comments && review.comments.length > 0 && (
                                                    <div
                                                        className="mt-4 pl-4 border-l-2 border-gray-100"
                                                        data-oid="6vmgl64"
                                                    >
                                                        {review.comments.map((comment) => (
                                                            <div
                                                                key={comment.id}
                                                                className="mb-3 last:mb-0"
                                                                data-oid="y6s7kv_"
                                                            >
                                                                <div
                                                                    className="flex items-center gap-2 mb-1"
                                                                    data-oid="hwluydp"
                                                                >
                                                                    <span
                                                                        className="font-medium text-sm text-gray-700"
                                                                        data-oid="ntw51p6"
                                                                    >
                                                                        {comment.author_name}
                                                                    </span>
                                                                    <span
                                                                        className="text-xs text-gray-500"
                                                                        data-oid="m.3qqy8"
                                                                    >
                                                                        {new Date(
                                                                            comment.created_at,
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <p
                                                                    className="text-sm text-gray-600"
                                                                    data-oid="3s4nub2"
                                                                >
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
                            <div data-oid="y_l5oua">
                                {/* 메뉴 추가 섹션 */}
                                <div className="mb-6">
                                    {!showMenuForm ? (
                                        <button
                                            onClick={() => setShowMenuForm(true)}
                                            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
                                        >
                                            + 메뉴 추가하기
                                        </button>
                                    ) : (
                                        <form
                                            onSubmit={handleMenuSubmit}
                                            className="bg-gray-50 rounded-lg p-4"
                                        >
                                            <h3 className="font-medium text-gray-800 mb-4">
                                                메뉴 추가
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                {/* 메뉴명 */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        메뉴명 *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={menuForm.name}
                                                        onChange={(e) =>
                                                            setMenuForm((prev) => ({
                                                                ...prev,
                                                                name: e.target.value,
                                                            }))
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                                        placeholder="메뉴명을 입력하세요"
                                                        disabled={isSubmittingMenu}
                                                    />
                                                </div>

                                                {/* 가격 */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        가격 *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={menuForm.price}
                                                        onChange={(e) =>
                                                            setMenuForm((prev) => ({
                                                                ...prev,
                                                                price: e.target.value,
                                                            }))
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                                        placeholder="예: 8,000원"
                                                        disabled={isSubmittingMenu}
                                                    />
                                                </div>

                                                {/* 설명 */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        설명
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={menuForm.description}
                                                        onChange={(e) =>
                                                            setMenuForm((prev) => ({
                                                                ...prev,
                                                                description: e.target.value,
                                                            }))
                                                        }
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                                        placeholder="메뉴 설명 (선택사항)"
                                                        disabled={isSubmittingMenu}
                                                    />
                                                </div>
                                            </div>

                                            {/* 버튼 */}
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowMenuForm(false);
                                                        setMenuForm({
                                                            name: '',
                                                            price: '',
                                                            description: '',
                                                        });
                                                    }}
                                                    disabled={isSubmittingMenu}
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    취소
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        isSubmittingMenu ||
                                                        !menuForm.name.trim() ||
                                                        !menuForm.price.trim()
                                                    }
                                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                                                >
                                                    {isSubmittingMenu ? '추가 중...' : '메뉴 추가'}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>

                                {/* 메뉴 목록 */}
                                {restaurant.menu_items.length === 0 ? (
                                    <div
                                        className="text-center text-gray-500 py-8"
                                        data-oid="a97yyg0"
                                    >
                                        <p data-oid="h1ypikg">등록된 메뉴가 없습니다.</p>
                                        <p className="text-sm mt-2">첫 번째 메뉴를 추가해보세요!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4" data-oid="shmj8az">
                                        {restaurant.menu_items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                                                data-oid="ud16uut"
                                            >
                                                <div className="flex-1" data-oid="f1j.al4">
                                                    <h3
                                                        className="font-medium text-gray-800 mb-1"
                                                        data-oid="e-kcqke"
                                                    >
                                                        {item.name}
                                                    </h3>
                                                    {item.description && (
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="vcazc7:"
                                                        >
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="text-lg font-bold text-orange-600"
                                                        data-oid="4a8rt98"
                                                    >
                                                        {item.price}
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            handleMenuDelete(item.id, item.name)
                                                        }
                                                        className="px-2 py-1 text-xs text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
                                                    >
                                                        삭제
                                                    </button>
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

function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white" data-oid="kxg3vj4">
            <div className="text-center" data-oid="3yr7xc.">
                <div
                    className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 animate-pulse"
                    data-oid="ukntkx-"
                >
                    <img
                        src="/woochelin.png"
                        alt="우슐랭 로고"
                        className="w-12 h-12 rounded-lg object-cover"
                        data-oid="tw7m1d9"
                    />
                </div>
                <p className="text-gray-600" data-oid="0b.ptyu">
                    페이지를 불러오는 중...
                </p>
            </div>
        </div>
    );
}

export default function DetailPage() {
    return (
        <Suspense fallback={<LoadingFallback data-oid="0:b5jug" />} data-oid="ocg90uu">
            <DetailPageContent data-oid="-w1bpwz" />
        </Suspense>
    );
}
