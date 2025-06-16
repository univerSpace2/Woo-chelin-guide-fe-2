'use client';

import { useEffect, useState } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { Loader } from './Loader';

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
}

export const KakaoMap = ({
    latitude,
    longitude,
    level = 3,
    restaurants = [],
    onMarkerClick,
}: KakaoMapProps) => {
    const [scriptLoad, setScriptLoad] = useState<boolean>(false);

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

    // API 키가 없는 경우 에러 메시지 표시
    if (!process.env.NEXT_PUBLIC_KAKAO_API_KEY) {
        return (
            <div
                className="w-full h-full flex justify-center items-center bg-gray-100 rounded-lg"
                data-oid="xffpz4q"
            >
                <p className="text-gray-600" data-oid="cr81ntd">
                    Kakao API 키가 설정되지 않았습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex justify-center items-center" data-oid="b1ega_t">
            {scriptLoad ? (
                <Map
                    center={{ lat: latitude, lng: longitude }}
                    level={level}
                    className="w-full h-full"
                    data-oid="mf08p87"
                >
                    {restaurants.map((restaurant) => (
                        <MapMarker
                            key={restaurant.id}
                            position={{ lat: restaurant.lat, lng: restaurant.lng }}
                            onClick={() => onMarkerClick?.(restaurant)}
                            clickable={true}
                            data-oid="zvb75i7"
                        >
                            <div
                                className="bg-white border border-gray-300 rounded-lg p-2 shadow-md"
                                data-oid=".f2r52x"
                            >
                                <div
                                    className="text-xs font-medium text-gray-800"
                                    data-oid="j7.ce8:"
                                >
                                    {restaurant.name}
                                </div>
                                <div className="text-xs text-gray-600" data-oid="cu0-:68">
                                    {restaurant.category}
                                </div>
                            </div>
                        </MapMarker>
                    ))}
                </Map>
            ) : (
                <Loader data-oid="n7dyv9z" />
            )}
        </div>
    );
};
