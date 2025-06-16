'use client';

import { useState, useEffect } from 'react';

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
    lat: number;
    lng: number;
}

export default function Page() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<'전체' | '점심' | '회식' | '카페'>('전체');
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [map, setMap] = useState<any>(null);

    // 샘플 데이터
    const restaurants: Restaurant[] = [
        {
            id: 1,
            name: '맛있는 한식당',
            category: '한식',
            type: '점심',
            avgPrice: '8,000원',
            rating: 4.5,
            reviewCount: 127,
            image: 'https://via.placeholder.com/300x200',
            hasZeroPay: true,
            lat: 37.5665,
            lng: 126.978,
        },
        {
            id: 2,
            name: '이탈리안 레스토랑',
            category: '양식',
            type: '회식',
            avgPrice: '25,000원',
            rating: 4.2,
            reviewCount: 89,
            image: 'https://via.placeholder.com/300x200',
            hasZeroPay: false,
            lat: 37.5675,
            lng: 126.9785,
        },
        {
            id: 3,
            name: '스타벅스',
            category: '카페',
            type: '카페',
            avgPrice: '5,000원',
            rating: 4.0,
            reviewCount: 234,
            image: 'https://via.placeholder.com/300x200',
            hasZeroPay: true,
            lat: 37.5655,
            lng: 126.9775,
        },
    ];

    const filteredRestaurants = restaurants.filter((restaurant) => {
        const matchesSearch =
            restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            restaurant.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === '전체' || restaurant.type === selectedType;
        return matchesSearch && matchesType;
    });

    useEffect(() => {
        // 카카오 지도 초기화 (실제 구현시 카카오 지도 API 키 필요)
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            // 임시로 지도 영역 표시
            mapContainer.innerHTML =
                '<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">카카오 지도 영역 (API 키 필요)</div>';
        }
    }, []);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                data-oid=".5:7tb7"
            >
                ★
            </span>
        ));
    };

    return (
        <div className="h-screen flex" data-oid="kl8m-m8">
            {/* 메인 지도 영역 */}
            <div className="flex-1 relative" data-oid="60m:uqk">
                <div id="map" className="w-full h-full bg-gray-200" data-oid="jd35s8a"></div>

                {/* 선택된 식당 정보 팝업 */}
                {selectedRestaurant && (
                    <div
                        className="absolute bottom-4 left-4 right-80 bg-white rounded-lg shadow-xl p-4 z-10"
                        data-oid="d5guqxj"
                    >
                        <div className="flex justify-between items-start mb-3" data-oid="gn2z-kv">
                            <h3 className="text-lg font-bold text-gray-800" data-oid="3jh2_zy">
                                {selectedRestaurant.name}
                            </h3>
                            <button
                                onClick={() => setSelectedRestaurant(null)}
                                className="text-gray-400 hover:text-gray-600"
                                data-oid="0ga9gwy"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex gap-4" data-oid="qc:gi.n">
                            <img
                                src={selectedRestaurant.image}
                                alt={selectedRestaurant.name}
                                className="w-20 h-20 rounded-lg object-cover"
                                data-oid="5t7kd3_"
                            />

                            <div className="flex-1" data-oid="bnurm.0">
                                <div className="flex items-center gap-2 mb-1" data-oid="psb7eke">
                                    <span
                                        className="text-sm bg-orange-100 text-orange-600 px-2 py-1 rounded"
                                        data-oid="epss0.9"
                                    >
                                        {selectedRestaurant.category}
                                    </span>
                                    <span
                                        className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded"
                                        data-oid="h6vj975"
                                    >
                                        {selectedRestaurant.type}
                                    </span>
                                    {selectedRestaurant.hasZeroPay && (
                                        <span
                                            className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded"
                                            data-oid="a2n4l.u"
                                        >
                                            제로페이
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 mb-1" data-oid="x44pbvj">
                                    {renderStars(selectedRestaurant.rating)}
                                    <span className="text-sm text-gray-600 ml-1" data-oid="3:u8k37">
                                        {selectedRestaurant.rating} (
                                        {selectedRestaurant.reviewCount}개 리뷰)
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2" data-oid="8lia-2:">
                                    평균 {selectedRestaurant.avgPrice}
                                </p>
                                <button
                                    className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                                    data-oid="edaow:i"
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
                    onClick={() => console.log('Navigate to add restaurant page')}
                    data-oid="-903lg7"
                >
                    +
                </button>
            </div>

            {/* 우측 사이드바 */}
            <div className="w-80 bg-white shadow-lg flex flex-col" data-oid="pnwg:mg">
                {/* 헤더 */}
                <div className="p-4 border-b" data-oid="rx0:q0h">
                    <div className="flex items-center gap-2 mb-4" data-oid="mlkulet">
                        <div
                            className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
                            data-oid="blhmdxr"
                        >
                            <span className="text-white font-bold text-sm" data-oid="qcpfbj7">
                                우
                            </span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800" data-oid="metbh0y">
                            우슐랭
                        </h1>
                    </div>

                    {/* 검색바 */}
                    <div className="relative mb-4" data-oid="6e0y2eb">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="식당명 또는 음식 종류 검색"
                            data-oid="mdj.kvx"
                        />

                        <div className="absolute right-3 top-2.5 text-gray-400" data-oid="4te2-gc">
                            🔍
                        </div>
                    </div>

                    {/* 카테고리 필터 */}
                    <div className="flex gap-2" data-oid="221fivq">
                        {['전체', '점심', '회식', '카페'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type as any)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                                    selectedType === type
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                data-oid="c3ein5_"
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 식당 목록 */}
                <div className="flex-1 overflow-y-auto p-4" data-oid="6.t-qnn">
                    <div className="space-y-4" data-oid="ud4ee0g">
                        {filteredRestaurants.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-all"
                                onClick={() => setSelectedRestaurant(restaurant)}
                                data-oid="2aufgsu"
                            >
                                <div className="flex gap-3" data-oid="jt_ws26">
                                    <img
                                        src={restaurant.image}
                                        alt={restaurant.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                        data-oid="mlnef-s"
                                    />

                                    <div className="flex-1" data-oid="qk:_2vz">
                                        <h3
                                            className="font-medium text-gray-800 mb-1"
                                            data-oid="43bl7wp"
                                        >
                                            {restaurant.name}
                                        </h3>
                                        <div
                                            className="flex items-center gap-2 mb-1"
                                            data-oid="i160.pp"
                                        >
                                            <span
                                                className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded"
                                                data-oid="-d:00-d"
                                            >
                                                {restaurant.category}
                                            </span>
                                            <span
                                                className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
                                                data-oid="lg2xk-_"
                                            >
                                                {restaurant.type}
                                            </span>
                                            {restaurant.hasZeroPay && (
                                                <span
                                                    className="text-xs bg-green-100 text-green-600 px-1 py-0.5 rounded"
                                                    data-oid="5iqsqn4"
                                                >
                                                    제로페이
                                                </span>
                                            )}
                                        </div>
                                        <div
                                            className="flex items-center gap-1 mb-1"
                                            data-oid="j3scbho"
                                        >
                                            {renderStars(restaurant.rating)}
                                            <span
                                                className="text-xs text-gray-500 ml-1"
                                                data-oid="s.6ugn."
                                            >
                                                {restaurant.rating} ({restaurant.reviewCount})
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600" data-oid="f_.2oi_">
                                            평균 {restaurant.avgPrice}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 푸터 */}
                <div className="text-center p-4 border-t text-sm text-gray-500" data-oid="o-f3gb8">
                    <p data-oid="6ohovgi">© 2024 우슐랭. 모든 권리 보유.</p>
                </div>
            </div>
        </div>
    );
}
