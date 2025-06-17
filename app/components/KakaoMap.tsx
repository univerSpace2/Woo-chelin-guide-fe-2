'use client';

import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { Loader } from './Loader';
import { getDefaultRestaurantImage } from '@/lib/utils';

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

interface KakaoMapProps {
    latitude: number;
    longitude: number;
    level?: number;
    restaurants?: Restaurant[];
    onMarkerClick?: (restaurant: Restaurant) => void;
    onOverlayClose?: () => void;
}

export interface KakaoMapRef {
    selectRestaurant: (restaurant: Restaurant) => void;
}

export const KakaoMap = forwardRef<KakaoMapRef, KakaoMapProps>(
    ({ latitude, longitude, level = 3, restaurants = [], onMarkerClick, onOverlayClose }, ref) => {
        const [scriptLoad, setScriptLoad] = useState<boolean>(false);
        const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

        // ref를 통해 외부에서 호출할 수 있는 메서드 제공
        useImperativeHandle(ref, () => ({
            selectRestaurant: (restaurant: Restaurant) => {
                setSelectedRestaurant(restaurant);
            },
        }));

        useEffect(() => {
            // 카카오 지도 API가 이미 로드되어 있는지 확인
            if (window.kakao && window.kakao.maps) {
                setScriptLoad(true);
                return;
            }

            const script: HTMLScriptElement = document.createElement('script');
            script.async = true;
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_API_KEY}&autoload=false`;
            script.onload = () => {
                if (window.kakao && window.kakao.maps) {
                    window.kakao.maps.load(() => setScriptLoad(true));
                }
            };
            script.onerror = () => console.error('지도 불러오기 실패');
            document.head.appendChild(script);

            return () => {
                // 컴포넌트 언마운트 시 스크립트 제거
                const existingScript = document.querySelector(`script[src*="dapi.kakao.com"]`);
                if (existingScript && existingScript.parentNode) {
                    existingScript.parentNode.removeChild(existingScript);
                }
            };
        }, []);

        // 마커 클릭 핸들러
        const handleMarkerClick = (restaurant: Restaurant) => {
            setSelectedRestaurant(restaurant);
            onMarkerClick?.(restaurant);
        };

        // 오버레이 닫기 핸들러
        const handleOverlayClose = () => {
            setSelectedRestaurant(null);
            onOverlayClose?.();
        };

        // 별점 렌더링 함수
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

        // 카테고리별 마커 색상 반환 함수
        const getMarkerColor = (type: '점심' | '회식' | '카페') => {
            switch (type) {
                case '점심':
                    return 'bg-blue-500';
                case '회식':
                    return 'bg-purple-500';
                case '카페':
                    return 'bg-orange-500';
                default:
                    return 'bg-gray-500';
            }
        };

        // 카테고리별 마커 아이콘 반환 함수
        const getMarkerIcon = (type: '점심' | '회식' | '카페') => {
            switch (type) {
                case '점심':
                    return (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 32 32">
                            <path d="M20.6,12.8c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l5.4-5.4c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-5.4,5.4C20.2,11.8,20.2,12.4,20.6,12.8z" />
                            <path d="M30.1,10.1c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-4.9,4.9c-1.3,1.3-2.5,2-3.7,2c-0.2,0-0.5,0-0.7,0.1L17.7,14c0-0.2,0.1-0.5,0.1-0.7c0.1-1.1,0.8-2.4,2-3.7l4.9-4.9c0.4-0.4,0.4-1,0-1.4s-1-0.4-1.4,0l-4.9,4.9c-1.3,1.3-2.1,2.7-2.5,4L7.2,3.5c-0.4-0.4-1-0.4-1.4,0c-2.9,2.9-2.9,7.7,0,10.7l8.3,8.3c0.3,0.3,0.7,0.4,1.1,0.2c1.1-0.5,2.4-0.2,3.2,0.8l4.1,5.1c0.6,0.8,1.5,1.2,2.5,1.3c0.1,0,0.1,0,0.2,0c0.9,0,1.8-0.4,2.5-1c0.7-0.7,1-1.5,1-2.5s-0.4-1.8-1-2.5l-6.5-6.5c1.3-0.3,2.7-1.1,4-2.5L30.1,10.1z" />
                            <path d="M4.7,24.2c-0.7,0.6-1.2,1.4-1.3,2.3c-0.1,0.9,0.3,1.8,0.9,2.5C4.9,29.7,5.7,30,6.6,30c0.1,0,0.2,0,0.2,0c0.9-0.1,1.8-0.5,2.3-1.2l3.7-4.6l-3.6-3.6L4.7,24.2z" />
                        </svg>
                    );
                case '회식':
                    return (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 32 32">
                            <path d="M26.5,14c-0.5,0-1,0.1-1.5,0.4V14c0,0,0,0,0,0c0.2-0.2,0.4-0.3,0.6-0.5c1-1,1.4-2.3,1.4-3.7c-0.1-1.7-1.1-3.2-2.7-4.1C23.2,5,22.2,4.9,21,5.1c-0.2-0.2-0.4-0.4-0.7-0.6c-0.2-0.1-0.3-0.3-0.5-0.4L19.6,4c-0.2-0.1-0.3-0.2-0.5-0.3c-0.1,0-0.2-0.1-0.2-0.1c-0.2-0.1-0.3-0.1-0.5-0.2l-0.2-0.1c-0.2-0.1-0.3-0.1-0.5-0.2c-0.1,0-0.1,0-0.2-0.1c-0.2,0-0.3-0.1-0.6-0.1l-0.2,0c-0.5-0.1-1.1,0-1.6,0c-0.1,0-0.1,0-0.3,0c-0.2,0-0.4,0.1-0.7,0.1l-0.2,0C13.5,3.4,13,3.7,12.5,4c0,0-0.1,0-0.1,0.1c-0.6,0.4-1.2,0.9-1.7,1.4c-1-0.4-2-0.6-3.1-0.4C5.3,5.4,3.4,7.3,3.1,9.7c-0.3,2,0.4,3.9,1.9,5.1v4c0,1.7-0.6,3.3-1.7,4.4c-1.1,1.1-1.5,2.6-1.1,4.2c0.5,1.6,2.1,2.8,4,2.8c1.1,0,2-0.4,2.7-1.1c0.9,0.7,2,1.1,3.1,1.1h8c2.5,0,4.6-1.9,4.9-4.4c0.5,0.2,1,0.4,1.6,0.4c1.9,0,3.5-1.6,3.5-3.5v-5C30,15.6,28.4,14,26.5,14z M14,25c0,0.6-0.4,1-1,1s-1-0.4-1-1v-6c0-0.6,0.4-1,1-1s1,0.4,1,1V25z M20,25c0,0.6-0.4,1-1,1s-1-0.4-1-1v-6c0-0.6,0.4-1,1-1s1,0.4,1,1V25z" />
                        </svg>
                    );
                case '카페':
                    return (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M9.613,7.421c0.198,0 0.359,0.161 0.359,0.359c0,1.095 0,4.315 0,4.315c-0.004,0.44 -0.35,0.761 -0.781,0.915c-0.259,0.109 -0.04,0.565 -0.238,0.588c-1.664,0.148 -3.342,0.063 -5.011,0c-0.142,-0.009 -0.106,-0.224 -0.106,-0.393c-0.008,-0.14 -0.138,-0.195 -0.138,-0.195c-0.449,-0.16 -0.769,-0.476 -0.78,-0.898c-0.014,-1.444 -0.003,-2.888 -0.001,-4.332c0,-0.198 0.161,-0.359 0.359,-0.359c1.21,0 5.127,0 6.337,0Zm0.781,0.529c0,-0.046 0.032,-0.086 0.077,-0.096c0.075,-0.016 0.176,-0.037 0.231,-0.047c0.17,-0.031 0.369,-0.062 0.492,-0.06c0.652,0.024 1.214,0.574 1.239,1.238c0.007,0.58 0.053,1.272 -0.055,1.684c-0.127,0.484 -0.476,0.897 -0.936,1.113c-0.181,0.081 -0.533,0.252 -0.881,0.414c-0.036,0.017 -0.079,0.014 -0.113,-0.008c-0.034,-0.021 -0.054,-0.059 -0.054,-0.099c0,-0.071 0,-0.148 0,-0.203c0,-0.047 0.028,-0.089 0.071,-0.108c0.439,-0.191 0.942,-0.426 1.101,-0.561c0.558,-0.473 0.464,-1.382 0.453,-2.221c-0.018,-0.491 -0.5,-0.899 -0.973,-0.826c-0.171,0.03 -0.364,0.08 -0.528,0.113c0,0 -0.001,0 -0.003,0.001c-0.03,0.006 -0.06,-0.001 -0.084,-0.019c-0.023,-0.019 -0.037,-0.047 -0.037,-0.077c0,-0.076 0,-0.172 0,-0.238Z" />
                        </svg>
                    );
                default:
                    return null;
            }
        };

        return (
            <div className="w-full h-full flex justify-center items-center" data-oid="iq.jx_y">
                {scriptLoad ? (
                    <Map
                        center={{ lat: latitude, lng: longitude }}
                        level={level}
                        className="w-full h-full"
                        data-oid="1f2.:l4"
                    >
                        {restaurants.map((restaurant) => (
                            <CustomOverlayMap
                                key={restaurant.id}
                                position={{ lat: restaurant.lat, lng: restaurant.lng }}
                            >
                                <div
                                    onClick={() => handleMarkerClick(restaurant)}
                                    className={`w-8 h-8 ${getMarkerColor(restaurant.type)} rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform`}
                                    data-oid="gtti8j8"
                                >
                                    {getMarkerIcon(restaurant.type)}
                                </div>
                            </CustomOverlayMap>
                        ))}

                        {/* 커스텀 Z 마커 */}
                        <CustomOverlayMap
                            position={{ lat: 37.494539299776, lng: 127.037856255205 }}
                        >
                            <div className="w-10 h-10 bg-[#4A5B7C] rounded-full flex items-center justify-center shadow-lg border-2 border-gray-200 cursor-pointer hover:scale-110 transition-transform">
                                <span className="font-bold text-lg text-white">Z</span>
                            </div>
                        </CustomOverlayMap>

                        {selectedRestaurant && (
                            <CustomOverlayMap
                                position={{
                                    lat: selectedRestaurant.lat,
                                    lng: selectedRestaurant.lng,
                                }}
                            >
                                <div className="absolute left-0 bottom-5 w-80 ml-[-160px] text-left overflow-hidden text-xs font-sans leading-normal">
                                    <div className="w-full bg-white rounded-lg border border-gray-300 shadow-lg overflow-hidden">
                                        {/* 헤더 */}
                                        <div className="relative bg-orange-500 text-white p-4">
                                            <h3 className="font-bold text-base pr-6">
                                                {selectedRestaurant.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                                                    {selectedRestaurant.category}
                                                </span>
                                                <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                                                    {selectedRestaurant.type}
                                                </span>
                                                {selectedRestaurant.hasZeroPay && (
                                                    <span className="text-xs bg-green-500 px-2 py-1 rounded">
                                                        제로페이
                                                    </span>
                                                )}
                                            </div>

                                            {/* 닫기 버튼 */}
                                            <button
                                                onClick={handleOverlayClose}
                                                className="absolute top-3 right-3 w-5 h-5 bg-white bg-opacity-20 hover:bg-opacity-40 rounded-full flex items-center justify-center text-white text-sm transition-all cursor-pointer"
                                                title="닫기"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {/* 내용 */}
                                        <div className="p-4">
                                            <div className="flex gap-3">
                                                <img
                                                    src={selectedRestaurant.image}
                                                    alt={selectedRestaurant.name}
                                                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            getDefaultRestaurantImage(
                                                                selectedRestaurant.type,
                                                                selectedRestaurant.category,
                                                            );
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center mb-1">
                                                        {renderStars(selectedRestaurant.rating)}
                                                        <span className="text-xs text-gray-600 ml-1">
                                                            {selectedRestaurant.rating}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600 mb-1">
                                                        리뷰 {selectedRestaurant.reviewCount}개
                                                    </p>
                                                    <p className="text-sm text-gray-800 font-medium">
                                                        평균{' '}
                                                        {typeof selectedRestaurant.avgPrice ===
                                                            'string' &&
                                                        /^\d+$/.test(selectedRestaurant.avgPrice)
                                                            ? parseInt(
                                                                  selectedRestaurant.avgPrice,
                                                              ).toLocaleString()
                                                            : selectedRestaurant.avgPrice}{' '}
                                                        원
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = `/detail?id=${selectedRestaurant.id}`;
                                                }}
                                                className="w-full mt-3 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                                            >
                                                상세보기
                                            </button>
                                        </div>

                                        {/* 말풍선 꼬리 (마커를 가리키도록) */}
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                                            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white"></div>
                                        </div>
                                    </div>
                                </div>
                            </CustomOverlayMap>
                        )}
                    </Map>
                ) : (
                    <Loader data-oid="2yhzfz_" />
                )}
            </div>
        );
    },
);

KakaoMap.displayName = 'KakaoMap';
