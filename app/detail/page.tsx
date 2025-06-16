'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Restaurant {
    id: number;
    name: string;
    category: string;
    type: '점심' | '회식' | '카페';
    avgPrice: string;
    rating: number;
    reviewCount: number;
    image: string;
    hasZeroPay: boolean;
    address: string;
    phone: string;
    hours: string;
    description: string;
}

interface Photo {
    id: number;
    url: string;
    alt: string;
}

interface Review {
    id: number;
    author: string;
    rating: number;
    content: string;
    date: string;
    likes: number;
    comments: Comment[];
}

interface Comment {
    id: number;
    author: string;
    content: string;
    date: string;
}

interface MenuItem {
    id: number;
    name: string;
    price: string;
    description?: string;
}

export default function DetailPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'photos' | 'reviews' | 'menu'>('photos');

    // 샘플 데이터 (실제로는 URL 파라미터나 API에서 가져올 데이터)
    const restaurant: Restaurant = {
        id: 1,
        name: '맛있는 한식당',
        category: '한식',
        type: '점심',
        avgPrice: '8,000원',
        rating: 4.5,
        reviewCount: 127,
        image: 'https://via.placeholder.com/400x300',
        hasZeroPay: true,
        address: '서울시 강남구 테헤란로 123',
        phone: '02-1234-5678',
        hours: '11:00 - 22:00',
        description:
            '정통 한식을 맛볼 수 있는 맛있는 한식당입니다. 신선한 재료로 만든 다양한 한식 메뉴를 제공합니다.',
    };

    const photos: Photo[] = [
        { id: 1, url: 'https://via.placeholder.com/300x200', alt: '매장 외관' },
        { id: 2, url: 'https://via.placeholder.com/300x200', alt: '매장 내부' },
        { id: 3, url: 'https://via.placeholder.com/300x200', alt: '대표 메뉴' },
        { id: 4, url: 'https://via.placeholder.com/300x200', alt: '음식 사진' },
        { id: 5, url: 'https://via.placeholder.com/300x200', alt: '음식 사진 2' },
        { id: 6, url: 'https://via.placeholder.com/300x200', alt: '음식 사진 3' },
    ];

    const reviews: Review[] = [
        {
            id: 1,
            author: '김맛있',
            rating: 5,
            content:
                '정말 맛있어요! 김치찌개가 특히 일품입니다. 밑반찬도 정갈하고 양도 푸짐해서 만족스러웠습니다.',
            date: '2024-01-15',
            likes: 12,
            comments: [
                {
                    id: 1,
                    author: '사장님',
                    content: '감사합니다! 더 맛있는 음식으로 보답하겠습니다.',
                    date: '2024-01-16',
                },
            ],
        },
        {
            id: 2,
            author: '박고수',
            rating: 4,
            content:
                '가격 대비 괜찮은 한식당이에요. 점심시간에 가면 좀 붐비지만 음식은 맛있습니다.',
            date: '2024-01-10',
            likes: 8,
            comments: [],
        },
        {
            id: 3,
            author: '이미식',
            rating: 4,
            content: '집밥 같은 느낌의 한식당입니다. 된장찌개 추천해요!',
            date: '2024-01-05',
            likes: 5,
            comments: [
                { id: 2, author: '김맛있', content: '저도 된장찌개 좋아해요!', date: '2024-01-06' },
            ],
        },
    ];

    const menuItems: MenuItem[] = [
        {
            id: 1,
            name: '김치찌개',
            price: '8,000원',
            description: '돼지고기와 김치가 들어간 얼큰한 찌개',
        },
        {
            id: 2,
            name: '된장찌개',
            price: '7,000원',
            description: '집에서 끓인 듯한 구수한 된장찌개',
        },
        { id: 3, name: '불고기', price: '12,000원', description: '달콤한 양념에 재운 소불고기' },
        {
            id: 4,
            name: '비빔밥',
            price: '9,000원',
            description: '각종 나물과 고추장이 들어간 비빔밥',
        },
        { id: 5, name: '냉면', price: '8,000원', description: '시원한 물냉면' },
        { id: 6, name: '갈비탕', price: '13,000원', description: '진한 국물의 갈비탕' },
    ];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                data-oid="h8huy22"
            >
                ★
            </span>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50" data-oid="1g4:z6m">
            {/* 헤더 */}
            <div className="bg-white shadow-sm border-b" data-oid="zbjf8x3">
                <div className="max-w-4xl mx-auto px-4 py-4" data-oid="_i42y3a">
                    <div className="flex items-center gap-4" data-oid="p59:gh-">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-800 text-xl"
                            data-oid="pyb:6he"
                        >
                            ← 뒤로가기
                        </button>
                        <div className="flex items-center gap-2" data-oid="8y6gq5k">
                            <div
                                className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
                                data-oid="me37dv0"
                            >
                                <span className="text-white font-bold text-sm" data-oid="ars3g.2">
                                    우
                                </span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-800" data-oid="vy67rxc">
                                우슐랭
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6" data-oid="md:07hz">
                {/* 가게 정보 섹션 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6" data-oid="sdwwt3w">
                    <div className="flex gap-6" data-oid="_s36ek7">
                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-48 h-36 rounded-lg object-cover"
                            data-oid="9lf1tem"
                        />

                        <div className="flex-1" data-oid="ed2d:i1">
                            <div className="flex items-center gap-3 mb-3" data-oid="94b2xq6">
                                <h1 className="text-2xl font-bold text-gray-800" data-oid="7rz9hig">
                                    {restaurant.name}
                                </h1>
                                <span
                                    className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm"
                                    data-oid="4aash_v"
                                >
                                    {restaurant.category}
                                </span>
                                <span
                                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                                    data-oid="5_-_egx"
                                >
                                    {restaurant.type}
                                </span>
                                {restaurant.hasZeroPay && (
                                    <span
                                        className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm"
                                        data-oid="970q5-s"
                                    >
                                        제로페이
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 mb-3" data-oid="f93vu9:">
                                {renderStars(restaurant.rating)}
                                <span
                                    className="text-lg font-medium text-gray-700"
                                    data-oid="zt.7w-c"
                                >
                                    {restaurant.rating}
                                </span>
                                <span className="text-gray-500" data-oid="w.kj9x:">
                                    ({restaurant.reviewCount}개 리뷰)
                                </span>
                            </div>

                            <div className="space-y-2 text-gray-600" data-oid="72s-qc0">
                                <p data-oid="09fqvm.">
                                    <span className="font-medium" data-oid="qlxa8tc">
                                        주소:
                                    </span>{' '}
                                    {restaurant.address}
                                </p>
                                <p data-oid="oundjjf">
                                    <span className="font-medium" data-oid="_w2b03s">
                                        전화:
                                    </span>{' '}
                                    {restaurant.phone}
                                </p>
                                <p data-oid="yfvkk4q">
                                    <span className="font-medium" data-oid="jynw9oz">
                                        영업시간:
                                    </span>{' '}
                                    {restaurant.hours}
                                </p>
                                <p data-oid="9el:wrd">
                                    <span className="font-medium" data-oid="pv.ao1_">
                                        평균 가격:
                                    </span>{' '}
                                    {restaurant.avgPrice}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t" data-oid="ts15vdi">
                        <p className="text-gray-700" data-oid=".ikkpru">
                            {restaurant.description}
                        </p>
                    </div>
                </div>

                {/* 탭 네비게이션 */}
                <div className="bg-white rounded-lg shadow-sm mb-6" data-oid="tlfci5r">
                    <div className="flex border-b" data-oid="1b:cxl3">
                        <button
                            onClick={() => setActiveTab('photos')}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                activeTab === 'photos'
                                    ? 'text-orange-600 border-b-2 border-orange-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                            data-oid="dkdwza_"
                        >
                            사진 ({photos.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                                activeTab === 'reviews'
                                    ? 'text-orange-600 border-b-2 border-orange-600'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                            data-oid="9do956a"
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
                            data-oid="ais4amj"
                        >
                            메뉴 ({menuItems.length})
                        </button>
                    </div>

                    <div className="p-6" data-oid="ijpxcv2">
                        {/* 사진 탭 */}
                        {activeTab === 'photos' && (
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                data-oid="zha6b.t"
                            >
                                {photos.map((photo) => (
                                    <div key={photo.id} className="aspect-video" data-oid="70it92b">
                                        <img
                                            src={photo.url}
                                            alt={photo.alt}
                                            className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                            data-oid="x0skfzf"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 리뷰 탭 */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-6" data-oid="oe69f:s">
                                {reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="border-b pb-6 last:border-b-0"
                                        data-oid="s826s76"
                                    >
                                        <div
                                            className="flex items-center justify-between mb-3"
                                            data-oid="h1rl5.z"
                                        >
                                            <div
                                                className="flex items-center gap-3"
                                                data-oid="0hiijpd"
                                            >
                                                <div
                                                    className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center"
                                                    data-oid="..:nyrq"
                                                >
                                                    <span
                                                        className="text-gray-600 font-medium"
                                                        data-oid="d7tixov"
                                                    >
                                                        {review.author[0]}
                                                    </span>
                                                </div>
                                                <div data-oid=":mm8uld">
                                                    <p
                                                        className="font-medium text-gray-800"
                                                        data-oid="8r.jkov"
                                                    >
                                                        {review.author}
                                                    </p>
                                                    <p
                                                        className="text-sm text-gray-500"
                                                        data-oid="3c033m:"
                                                    >
                                                        {review.date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className="flex items-center gap-2"
                                                data-oid=".xl1nf1"
                                            >
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-3" data-oid="ldrw0n3">
                                            {review.content}
                                        </p>

                                        <div
                                            className="flex items-center gap-4 text-sm text-gray-500"
                                            data-oid="1:hn24i"
                                        >
                                            <button
                                                className="flex items-center gap-1 hover:text-orange-600"
                                                data-oid="nv2wq79"
                                            >
                                                👍 추천 {review.likes}
                                            </button>
                                        </div>

                                        {/* 댓글 */}
                                        {review.comments.length > 0 && (
                                            <div
                                                className="mt-4 pl-4 border-l-2 border-gray-100"
                                                data-oid=":16ff8:"
                                            >
                                                {review.comments.map((comment) => (
                                                    <div
                                                        key={comment.id}
                                                        className="mb-3 last:mb-0"
                                                        data-oid="gowr4c-"
                                                    >
                                                        <div
                                                            className="flex items-center gap-2 mb-1"
                                                            data-oid="feehla7"
                                                        >
                                                            <span
                                                                className="font-medium text-sm text-gray-700"
                                                                data-oid="-e5uzql"
                                                            >
                                                                {comment.author}
                                                            </span>
                                                            <span
                                                                className="text-xs text-gray-500"
                                                                data-oid="1-cauwv"
                                                            >
                                                                {comment.date}
                                                            </span>
                                                        </div>
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            data-oid="wva6f9a"
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

                        {/* 메뉴 탭 */}
                        {activeTab === 'menu' && (
                            <div className="space-y-4" data-oid="7-cfet8">
                                {menuItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                                        data-oid="jo0b7b4"
                                    >
                                        <div className="flex-1" data-oid="y0cbigg">
                                            <h3
                                                className="font-medium text-gray-800 mb-1"
                                                data-oid="5fjux6."
                                            >
                                                {item.name}
                                            </h3>
                                            {item.description && (
                                                <p
                                                    className="text-sm text-gray-600"
                                                    data-oid="pq9uaqg"
                                                >
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                        <div
                                            className="text-lg font-bold text-orange-600 ml-4"
                                            data-oid="fszxfeg"
                                        >
                                            {item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
