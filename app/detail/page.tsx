'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase';
import { getRestaurantDetail } from '@/lib/supabase/restaurants';
import { createReview, getRestaurantReviews } from '@/lib/supabase/reviews';
import type { RestaurantDetail, Photo, Review, MenuItem, ReviewWithComments } from '@/types';

export default function DetailPage() {
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

    // 현재 사용자가 이미 리뷰를 작성했는지 확인
    const hasUserReviewed =
        currentUser && reviews.some((review) => review.author_id === currentUser.id);

    const renderStars = (
        rating: number,
        interactive: boolean = false,
        onRatingChange?: (rating: number) => void,
    ) => {
        return Array.from({ length: 5 }, (_, i) => {
            const filled = i < Math.floor(rating);
            return (
                <span
                    key={i}
                    className={`text-lg ${filled ? 'text-yellow-400' : 'text-gray-300'} ${
                        interactive ? 'cursor-pointer hover:text-yellow-300' : ''
                    }`}
                    onClick={
                        interactive && onRatingChange ? () => onRatingChange(i + 1) : undefined
                    }
                    data-oid="tw:sl_3"
                >
                    ★
                </span>
            );
        });
    };

    // 로딩 중일 때 보여줄 컴포넌트
    if (isLoading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-white"
                data-oid="-ki5hn:"
            >
                <div className="text-center" data-oid="7hx0giq">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 animate-pulse"
                        data-oid="h-37hgd"
                    >
                        <img
                            src="/woochelin.png"
                            alt="우슐랭 로고"
                            className="w-8 h-8 rounded-lg object-cover"
                            data-oid="76ltght"
                        />
                    </div>
                    <p className="text-gray-600" data-oid="r.n.u7g">
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
                data-oid="a1wgfam"
            >
                <div className="text-center" data-oid="07efltj">
                    <p className="text-gray-600" data-oid="p89cigd">
                        레스토랑을 찾을 수 없습니다.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                        data-oid="vvvaijx"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="pgxs2_j">
            {/* 헤더 */}
            <div className="bg-white shadow-sm border-b" data-oid="-h:9oa.">
                <div className="max-w-4xl mx-auto px-4 py-4" data-oid="24_rn_g">
                    <div className="flex items-center gap-4" data-oid=":26_rub">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-800 text-xl"
                            data-oid="mlfhlb_"
                        >
                            ← 뒤로가기
                        </button>
                        <div className="flex items-center gap-2" data-oid="o2tyepx">
                            <div
                                className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
                                data-oid="er4c6c9"
                            >
                                <img
                                    src="/woochelin.png"
                                    alt="우슐랭 로고"
                                    className="w-8 h-8 rounded-lg object-cover"
                                    data-oid="oeqamr-"
                                />{' '}
                            </div>
                            <h1 className="text-xl font-bold text-gray-800" data-oid="m9nvkzt">
                                우슐랭
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6" data-oid="-ptd6s6">
                {/* 가게 정보 섹션 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6" data-oid="eahnf6o">
                    <div className="flex gap-6" data-oid="ir1ciwa">
                        <img
                            src={restaurant.main_image || 'https://via.placeholder.com/400x300'}
                            alt={restaurant.name}
                            className="w-48 h-36 rounded-lg object-cover"
                            data-oid="wc9gk50"
                        />

                        <div className="flex-1" data-oid="q-udwfj">
                            <div className="flex items-center gap-3 mb-3" data-oid="d4c11nl">
                                <h1 className="text-2xl font-bold text-gray-800" data-oid="87uxwx8">
                                    {restaurant.name}
                                </h1>
                                <span
                                    className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm"
                                    data-oid="a9m.h30"
                                >
                                    {restaurant.category}
                                </span>
                                <span
                                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                                    data-oid="zbqhej3"
                                >
                                    {restaurant.type}
                                </span>
                                {restaurant.has_zero_pay && (
                                    <span
                                        className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm"
                                        data-oid="bfqmzdw"
                                    >
                                        제로페이
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 mb-3" data-oid="w4s61ap">
                                {renderStars(restaurant.rating)}
                                <span
                                    className="text-lg font-medium text-gray-700"
                                    data-oid="cbsjmlt"
                                >
                                    {restaurant.rating}
                                </span>
                                <span className="text-gray-500" data-oid="ns_8xl-">
                                    ({reviews.length}개 리뷰)
                                </span>
                            </div>

                            <div className="space-y-2 text-gray-600" data-oid="b6nnym2">
                                <p data-oid="5b-usq9">
                                    <span className="font-medium" data-oid="0viac9r">
                                        주소:
                                    </span>{' '}
                                    {restaurant.address}
                                </p>
                                {restaurant.phone && (
                                    <p data-oid="ok1nnr0">
                                        <span className="font-medium" data-oid="tyh8uy6">
                                            전화:
                                        </span>{' '}
                                        {restaurant.phone}
                                    </p>
                                )}
                                {restaurant.hours && (
                                    <p data-oid="w34r01i">
                                        <span className="font-medium" data-oid="h67rh:g">
                                            영업시간:
                                        </span>{' '}
                                        {restaurant.hours}
                                    </p>
                                )}
                                <p data-oid="2see:n_">
                                    <span className="font-medium" data-oid="on5jx_g">
                                        평균 가격:
                                    </span>{' '}
                                    {restaurant.avg_price}
                                </p>
                            </div>
                        </div>
                    </div>
                    {restaurant.description && (
                        <div className="mt-4 pt-4 border-t" data-oid="rsocvb-">
                            <p className="text-gray-700" data-oid="-c47ipa">
                                {restaurant.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* 탭 네비게이션 */}
                <div className="bg-white rounded-lg shadow-sm mb-6" data-oid="r-2x9on">
                    <div className="flex border-b" data-oid="0gszl2x">
                        <button
                            onClick={() => setActiveTab('photos')}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                activeTab === 'photos'
                                    ? 'text-orange-600 border-b-2 border-orange-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                            data-oid="m:xx1i:"
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
                            data-oid="pmg0u21"
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
                            data-oid="xxmjhcc"
                        >
                            메뉴 ({restaurant.menu_items.length})
                        </button>
                    </div>

                    <div className="p-6" data-oid="dl_ud8:">
                        {/* 사진 탭 */}
                        {activeTab === 'photos' && (
                            <div data-oid="t_9_hj9">
                                {restaurant.photos.length === 0 ? (
                                    <div
                                        className="text-center text-gray-500 py-8"
                                        data-oid="_qsu45p"
                                    >
                                        <p data-oid="1r.n1fu">등록된 사진이 없습니다.</p>
                                    </div>
                                ) : (
                                    <div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                        data-oid="qpnpdcb"
                                    >
                                        {restaurant.photos.map((photo) => (
                                            <div
                                                key={photo.id}
                                                className="aspect-video"
                                                data-oid="1rwxdrd"
                                            >
                                                <img
                                                    src={photo.url}
                                                    alt={photo.alt || restaurant.name}
                                                    className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                                    data-oid="dba4bwq"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 리뷰 탭 */}
                        {activeTab === 'reviews' && (
                            <div data-oid="-9kj0s1">
                                {/* 리뷰 작성 섹션 */}
                                <div className="mb-6" data-oid="qm.4o6.">
                                    {!hasUserReviewed ? (
                                        !showReviewForm ? (
                                            <button
                                                onClick={() => setShowReviewForm(true)}
                                                className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
                                                data-oid="akby097"
                                            >
                                                + 리뷰 작성하기
                                            </button>
                                        ) : (
                                            <form
                                                onSubmit={handleReviewSubmit}
                                                className="bg-gray-50 rounded-lg p-4"
                                                data-oid="h_u4cz_"
                                            >
                                                <h3
                                                    className="font-medium text-gray-800 mb-4"
                                                    data-oid="j44-gff"
                                                >
                                                    리뷰 작성
                                                </h3>

                                                {/* 별점 선택 */}
                                                <div className="mb-4" data-oid="xwaj41p">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700 mb-2"
                                                        data-oid="70:vskg"
                                                    >
                                                        별점
                                                    </label>
                                                    <div
                                                        className="flex items-center gap-1"
                                                        data-oid="5:m_jz3"
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
                                                            data-oid="1285vpx"
                                                        >
                                                            ({reviewForm.rating}점)
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* 리뷰 내용 */}
                                                <div className="mb-4" data-oid="2y.kqv4">
                                                    <label
                                                        className="block text-sm font-medium text-gray-700 mb-2"
                                                        data-oid="efv9q8w"
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
                                                        data-oid="p5.9p4k"
                                                    />
                                                </div>

                                                {/* 버튼 */}
                                                <div className="flex gap-2" data-oid="pcx5ts3">
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
                                                        data-oid="ra500.l"
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
                                                        data-oid="1wsuhsl"
                                                    >
                                                        {isSubmittingReview
                                                            ? '등록 중...'
                                                            : '리뷰 등록'}
                                                    </button>
                                                </div>
                                            </form>
                                        )
                                    ) : (
                                        <div
                                            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                                            data-oid="qmd46rl"
                                        >
                                            <p className="text-blue-800 text-sm" data-oid="-x2ctlu">
                                                이미 이 가게에 리뷰를 작성하셨습니다. 한 가게당
                                                하나의 리뷰만 작성할 수 있습니다.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* 리뷰 목록 */}
                                {reviews.length === 0 ? (
                                    <div
                                        className="text-center text-gray-500 py-8"
                                        data-oid="rv2fyid"
                                    >
                                        <p data-oid="txbu9f5">등록된 리뷰가 없습니다.</p>
                                        <p className="text-sm mt-2" data-oid="hyziwrl">
                                            첫 번째 리뷰를 작성해보세요!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-6" data-oid="1mi3:sh">
                                        {reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="border-b pb-6 last:border-b-0"
                                                data-oid="mup:9ew"
                                            >
                                                <div
                                                    className="flex items-center justify-between mb-3"
                                                    data-oid="dfzd1xd"
                                                >
                                                    <div
                                                        className="flex items-center gap-3"
                                                        data-oid="27jnq1y"
                                                    >
                                                        <div
                                                            className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"
                                                            data-oid="aztx5vw"
                                                        >
                                                            <span
                                                                className="text-gray-600 font-medium"
                                                                data-oid="b62p:rd"
                                                            >
                                                                {review.author_name[0]}
                                                            </span>
                                                        </div>
                                                        <div data-oid="mx805bk">
                                                            <p
                                                                className="font-medium text-gray-800"
                                                                data-oid="1x9h87w"
                                                            >
                                                                {review.author_name}
                                                            </p>
                                                            <p
                                                                className="text-sm text-gray-500"
                                                                data-oid="ny0rwh_"
                                                            >
                                                                {new Date(
                                                                    review.created_at,
                                                                ).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="flex items-center gap-2"
                                                        data-oid="f-r92gh"
                                                    >
                                                        {renderStars(review.rating)}
                                                    </div>
                                                </div>

                                                <p
                                                    className="text-gray-700 mb-3"
                                                    data-oid="f313g0y"
                                                >
                                                    {review.content}
                                                </p>

                                                <div
                                                    className="flex items-center gap-4 text-sm text-gray-500"
                                                    data-oid="_-sgh1q"
                                                >
                                                    <button
                                                        className="flex items-center gap-1 hover:text-orange-600"
                                                        data-oid="ltfezom"
                                                    >
                                                        👍 추천 {review.likes}
                                                    </button>
                                                </div>

                                                {/* 댓글 */}
                                                {review.comments && review.comments.length > 0 && (
                                                    <div
                                                        className="mt-4 pl-4 border-l-2 border-gray-100"
                                                        data-oid="4d9g5zy"
                                                    >
                                                        {review.comments.map((comment) => (
                                                            <div
                                                                key={comment.id}
                                                                className="mb-3 last:mb-0"
                                                                data-oid="7ig0x1c"
                                                            >
                                                                <div
                                                                    className="flex items-center gap-2 mb-1"
                                                                    data-oid="1ra-jrr"
                                                                >
                                                                    <span
                                                                        className="font-medium text-sm text-gray-700"
                                                                        data-oid="smqm-oj"
                                                                    >
                                                                        {comment.author_name}
                                                                    </span>
                                                                    <span
                                                                        className="text-xs text-gray-500"
                                                                        data-oid="8a_iri-"
                                                                    >
                                                                        {new Date(
                                                                            comment.created_at,
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                                <p
                                                                    className="text-sm text-gray-600"
                                                                    data-oid="5ac1ao."
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
                            <div data-oid="k5e:c:b">
                                {restaurant.menu_items.length === 0 ? (
                                    <div
                                        className="text-center text-gray-500 py-8"
                                        data-oid="s-y7dra"
                                    >
                                        <p data-oid="mmwwn03">등록된 메뉴가 없습니다.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4" data-oid="zhooe3f">
                                        {restaurant.menu_items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                                                data-oid="..gz682"
                                            >
                                                <div className="flex-1" data-oid="y8mgubs">
                                                    <h3
                                                        className="font-medium text-gray-800 mb-1"
                                                        data-oid="6buvy1q"
                                                    >
                                                        {item.name}
                                                    </h3>
                                                    {item.description && (
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="lw3_5w9"
                                                        >
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div
                                                    className="text-lg font-bold text-orange-600 ml-4"
                                                    data-oid="6_u_2pj"
                                                >
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
