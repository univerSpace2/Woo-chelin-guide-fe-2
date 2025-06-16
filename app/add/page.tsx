'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase';
import { createRestaurant } from '@/lib/supabase/restaurants';
import { searchRestaurants, type KakaoPlace } from '@/lib/kakao/places';
import type { RestaurantFormData } from '@/types';

export default function AddPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<KakaoPlace[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<KakaoPlace | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [searchError, setSearchError] = useState<string>('');

    const [formData, setFormData] = useState<RestaurantFormData>({
        name: '',
        address: '',
        roadAddress: '',
        phone: '',
        latitude: '',
        longitude: '',
        kakaoCategory: '',
        category: '',
        type: '',
        avgPrice: '',
        hasZeroPay: false,
        description: '',
        photos: [],
        menuItems: [{ name: '', price: '', description: '' }],
    });

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
                setIsLoading(false);
            } catch (error) {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    // 카카오 로컬 API를 사용한 실제 장소 검색
    const searchPlaces = async () => {
        if (!searchQuery.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }

        setIsSearching(true);
        setSearchError('');

        try {
            const result = await searchRestaurants({
                query: searchQuery,
                size: 15, // 최대 15개 결과
                x: '127.037856255205',
                y: '37.494539299776',
                radius: 1000,
                sort: 'distance',
            });

            if (result.success && result.data) {
                setSearchResults(result.data);
                if (result.data.length === 0) {
                    setSearchError('검색 결과가 없습니다. 다른 키워드로 검색해보세요.');
                }
            } else {
                setSearchError(result.error || '검색 중 오류가 발생했습니다.');
                setSearchResults([]);
            }
        } catch (error) {
            console.error('검색 오류:', error);
            setSearchError('검색 중 오류가 발생했습니다.');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const selectPlace = (place: KakaoPlace) => {
        setSelectedPlace(place);
        setFormData({
            ...formData,
            name: place.place_name,
            address: place.address_name,
            roadAddress: place.road_address_name || place.address_name,
            phone: place.phone || '',
            latitude: place.y,
            longitude: place.x,
            kakaoCategory: place.category_name,
        });
        setShowForm(true);
    };

    const addMenuItem = () => {
        setFormData({
            ...formData,
            menuItems: [...formData.menuItems, { name: '', price: '', description: '' }],
        });
    };

    const removeMenuItem = (index: number) => {
        const newMenuItems = formData.menuItems.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            menuItems:
                newMenuItems.length > 0 ? newMenuItems : [{ name: '', price: '', description: '' }],
        });
    };

    const updateMenuItem = (index: number, field: string, value: string) => {
        const newMenuItems = [...formData.menuItems];
        newMenuItems[index] = { ...newMenuItems[index], [field]: value };
        setFormData({
            ...formData,
            menuItems: newMenuItems,
        });
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newPhotos = Array.from(e.target.files);
            setFormData({
                ...formData,
                photos: [...formData.photos, ...newPhotos],
            });
        }
    };

    const removePhoto = (index: number) => {
        const newPhotos = formData.photos.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            photos: newPhotos,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 필수 필드 검증
        if (!formData.name || !formData.category || !formData.type || !formData.avgPrice) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }

        if (!currentUser) {
            alert('로그인이 필요합니다.');
            router.push('/login');
            return;
        }

        setIsSubmitting(true);

        try {
            // Supabase를 통해 레스토랑 생성
            const result = await createRestaurant(formData, currentUser.id);

            if (result.success) {
                alert('가게가 성공적으로 등록되었습니다!');
                router.push('/');
            } else {
                alert(`등록 실패: ${result.error}`);
            }
        } catch (error) {
            console.error('레스토랑 등록 중 오류:', error);
            alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (confirm('작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?')) {
            router.push('/');
        }
    };

    // 로딩 중일 때 보여줄 컴포넌트
    if (isLoading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-white"
                data-oid="e9d.l1s"
            >
                <div className="text-center" data-oid="an2hjsz">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4 animate-pulse"
                        data-oid=".6fnwas"
                    >
                        <img
                            src="/woochelin.png"
                            alt="우슐랭 로고"
                            className="w-8 h-8 rounded-lg object-cover"
                            data-oid="v3e0o92"
                        />
                    </div>
                    <p className="text-gray-600" data-oid="-m1whi9">
                        로딩 중...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" data-oid="_xc5f8-">
            {/* 헤더 */}
            <div className="bg-white shadow-sm border-b" data-oid="iyavav4">
                <div className="max-w-4xl mx-auto px-4 py-4" data-oid="_ll9u8r">
                    <div className="flex items-center gap-4" data-oid="jftoykz">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-800 text-xl"
                            data-oid="tg-y38e"
                        >
                            ← 뒤로가기
                        </button>
                        <div className="flex items-center gap-2" data-oid="ojedql1">
                            <div
                                className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
                                data-oid="cbr_mkf"
                            >
                                <img
                                    src="/woochelin.png"
                                    alt="우슐랭 로고"
                                    className="w-8 h-8 rounded-lg object-cover"
                                    data-oid="f5r7gzi"
                                />
                            </div>
                            <h1 className="text-xl font-bold text-gray-800" data-oid="i:8lpdi">
                                우슐랭 - 가게 추가하기
                            </h1>
                        </div>
                        {currentUser && (
                            <span className="text-sm text-gray-600 ml-auto" data-oid="hxjclnu">
                                {currentUser.profile.name}님
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6" data-oid="htmk_wa">
                {!showForm ? (
                    /* 가게 검색 섹션 */
                    <div className="bg-white rounded-lg shadow-sm p-6" data-oid="0yl_n-d">
                        <h2 className="text-xl font-bold text-gray-800 mb-4" data-oid="wuw:w6q">
                            가게 검색
                        </h2>
                        <p className="text-gray-600 mb-6" data-oid="vmk2vp8">
                            카카오 지도에서 가게를 검색하여 기본 정보를 가져옵니다.
                        </p>

                        <div className="flex gap-3 mb-6" data-oid="_g6:oy.">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && searchPlaces()}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                placeholder="가게명을 입력하세요 (예: 맛있는 한식당, 스타벅스)"
                                disabled={isSearching}
                                data-oid=":pr2oyg"
                            />

                            <button
                                onClick={searchPlaces}
                                disabled={isSearching || !searchQuery.trim()}
                                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="gjpzt7g"
                            >
                                {isSearching ? '검색 중...' : '검색'}
                            </button>
                        </div>

                        {/* 검색 오류 메시지 */}
                        {searchError && (
                            <div
                                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                                data-oid="94pu5bl"
                            >
                                <p className="text-red-600" data-oid="f92stci">
                                    {searchError}
                                </p>
                                <p className="text-red-500 text-sm mt-1" data-oid=".gyjzy_">
                                    💡 팁: 카카오 API 키가 설정되지 않았다면 .env.local 파일에
                                    NEXT_PUBLIC_KAKAO_REST_API_KEY를 추가해주세요.
                                </p>
                            </div>
                        )}

                        {/* 검색 결과 */}
                        {searchResults.length > 0 && (
                            <div className="space-y-3" data-oid="bphxjac">
                                <h3 className="font-medium text-gray-800" data-oid="sv0g9lj">
                                    검색 결과 ({searchResults.length}개)
                                </h3>
                                {searchResults.map((result) => (
                                    <div
                                        key={result.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 cursor-pointer transition-all"
                                        onClick={() => selectPlace(result)}
                                        data-oid="eexywli"
                                    >
                                        <div
                                            className="flex justify-between items-start"
                                            data-oid="wqvf:-g"
                                        >
                                            <div className="flex-1" data-oid="vuh5-g3">
                                                <h4
                                                    className="font-medium text-gray-800 mb-2"
                                                    data-oid=":7o19eo"
                                                >
                                                    {result.place_name}
                                                </h4>
                                                <div
                                                    className="text-sm text-gray-600 space-y-1"
                                                    data-oid="q5i3.0r"
                                                >
                                                    <p data-oid="khvx1vb">
                                                        📍{' '}
                                                        {result.road_address_name ||
                                                            result.address_name}
                                                    </p>
                                                    {result.phone && (
                                                        <p data-oid="_vtsh._">📞 {result.phone}</p>
                                                    )}
                                                    <p data-oid="hl:aqiz">
                                                        🏷️ {result.category_name}
                                                    </p>
                                                </div>
                                            </div>
                                            {result.category_group_name && (
                                                <span
                                                    className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs"
                                                    data-oid="r7_-3z_"
                                                >
                                                    {result.category_group_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 직접 입력 옵션 */}
                        <div className="mt-8 pt-6 border-t border-gray-200" data-oid="a8eo9-x">
                            <p className="text-gray-600 mb-4" data-oid="4hffsq7">
                                원하는 가게가 검색되지 않나요?
                            </p>
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setFormData({
                                        ...formData,
                                        name: '',
                                        address: '',
                                        roadAddress: '',
                                        phone: '',
                                        latitude: '',
                                        longitude: '',
                                        kakaoCategory: '',
                                    });
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                data-oid="2zy42y4"
                            >
                                직접 입력하기
                            </button>
                        </div>
                    </div>
                ) : (
                    /* 가게 정보 입력 폼 */
                    <form onSubmit={handleSubmit} className="space-y-6" data-oid="h8wqt-.">
                        {/* 선택된 장소 정보 표시 */}
                        {selectedPlace && (
                            <div
                                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                                data-oid="5_m4nzn"
                            >
                                <div
                                    className="flex justify-between items-start mb-2"
                                    data-oid="qw5h:3b"
                                >
                                    <h3 className="font-medium text-blue-800" data-oid="5o.1c-v">
                                        선택된 장소
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setSelectedPlace(null);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                        data-oid="02augv5"
                                    >
                                        다시 검색하기
                                    </button>
                                </div>
                                <p className="text-blue-700 font-medium" data-oid="gji-tqu">
                                    {selectedPlace.place_name}
                                </p>
                                <p className="text-blue-600 text-sm" data-oid="_7vdpn1">
                                    {selectedPlace.road_address_name || selectedPlace.address_name}
                                </p>
                            </div>
                        )}

                        {/* 기본 정보 */}
                        <div className="bg-white rounded-lg shadow-sm p-6" data-oid="jrcuqq.">
                            <h2 className="text-xl font-bold text-gray-800 mb-4" data-oid="tvw8fys">
                                기본 정보
                            </h2>
                            <div
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                data-oid="4ughvxf"
                            >
                                <div data-oid="88noct:">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="gp_lnam"
                                    >
                                        가게명 *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        required
                                        placeholder="가게 이름을 입력하세요"
                                        data-oid="68pij9h"
                                    />
                                </div>
                                <div data-oid="3j7sse_">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="eci71b2"
                                    >
                                        전화번호
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({ ...formData, phone: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        placeholder="전화번호를 입력하세요"
                                        data-oid="odi-4df"
                                    />
                                </div>
                                <div className="md:col-span-2" data-oid="m4l2-vx">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="uugjm4n"
                                    >
                                        주소 {selectedPlace ? '' : '*'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.roadAddress || formData.address}
                                        onChange={(e) =>
                                            setFormData({ ...formData, address: e.target.value })
                                        }
                                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                                            selectedPlace ? 'bg-gray-50' : ''
                                        }`}
                                        readOnly={!!selectedPlace}
                                        required={!selectedPlace}
                                        placeholder="주소를 입력하세요"
                                        data-oid="6xu.0wl"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 분류 정보 */}
                        <div className="bg-white rounded-lg shadow-sm p-6" data-oid="ior2zzy">
                            <h2 className="text-xl font-bold text-gray-800 mb-4" data-oid="8chfdrn">
                                분류 정보
                            </h2>
                            <div
                                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                data-oid="zpvykw3"
                            >
                                <div data-oid="4ysusnx">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="b9xe5o1"
                                    >
                                        음식 카테고리 *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) =>
                                            setFormData({ ...formData, category: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        required
                                        data-oid=".1:gmak"
                                    >
                                        <option value="" data-oid=":qhoog4">
                                            선택하세요
                                        </option>
                                        <option value="한식" data-oid="7gxnjws">
                                            한식
                                        </option>
                                        <option value="중식" data-oid="xy2_92n">
                                            중식
                                        </option>
                                        <option value="일식" data-oid="6brte:8">
                                            일식
                                        </option>
                                        <option value="양식" data-oid="pfincv8">
                                            양식
                                        </option>
                                        <option value="카페" data-oid="0bnsflk">
                                            카페
                                        </option>
                                        <option value="패스트푸드" data-oid="ojckq1y">
                                            패스트푸드
                                        </option>
                                        <option value="기타" data-oid="zmjb2x2">
                                            기타
                                        </option>
                                    </select>
                                </div>
                                <div data-oid="x.8va:b">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="4bvi04y"
                                    >
                                        타입 *
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                type: e.target.value as any,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        required
                                        data-oid="_q-e_zp"
                                    >
                                        <option value="" data-oid="fwc88fp">
                                            선택하세요
                                        </option>
                                        <option value="점심" data-oid=":7nvfkv">
                                            점심
                                        </option>
                                        <option value="회식" data-oid="naut-88">
                                            회식
                                        </option>
                                        <option value="카페" data-oid="on-vtwz">
                                            카페
                                        </option>
                                    </select>
                                </div>
                                <div data-oid="oanv5su">
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                        data-oid="lyiyjks"
                                    >
                                        평균 가격대 *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.avgPrice}
                                        onChange={(e) =>
                                            setFormData({ ...formData, avgPrice: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        placeholder="예: 8,000원"
                                        required
                                        data-oid="fjn.-l-"
                                    />
                                </div>
                            </div>

                            <div className="mt-4" data-oid="243um_u">
                                <label className="flex items-center gap-2" data-oid="e:i3g7z">
                                    <input
                                        type="checkbox"
                                        checked={formData.hasZeroPay}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                hasZeroPay: e.target.checked,
                                            })
                                        }
                                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                        data-oid="w4.mjla"
                                    />

                                    <span
                                        className="text-sm font-medium text-gray-700"
                                        data-oid="6q.hh-r"
                                    >
                                        제로페이 사용 가능
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* 가게 설명 */}
                        <div className="bg-white rounded-lg shadow-sm p-6" data-oid="linx.za">
                            <h2 className="text-xl font-bold text-gray-800 mb-4" data-oid="wtmyeh0">
                                가게 설명
                            </h2>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                rows={4}
                                placeholder="가게에 대한 간단한 설명을 입력하세요..."
                                data-oid="boyv91y"
                            />
                        </div>

                        {/* 사진 업로드 (현재는 파일 업로드만 가능, 실제 업로드는 별도 구현 필요) */}
                        <div className="bg-white rounded-lg shadow-sm p-6" data-oid="24zod7g">
                            <h2 className="text-xl font-bold text-gray-800 mb-4" data-oid="txev.rr">
                                사진 (선택사항)
                            </h2>
                            <div className="mb-4" data-oid="g2v-0g:">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                    data-oid=":oxarl1"
                                />
                            </div>
                            {formData.photos.length > 0 && (
                                <div
                                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                    data-oid="7em761-"
                                >
                                    {formData.photos.map((photo, index) => (
                                        <div key={index} className="relative" data-oid="dcj3nt_">
                                            <img
                                                src={URL.createObjectURL(photo)}
                                                alt={`업로드된 사진 ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                                data-oid="ibhk6nj"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                                                data-oid="1tm5d_5"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 메뉴 정보 */}
                        <div className="bg-white rounded-lg shadow-sm p-6" data-oid="i1pdy5t">
                            <div
                                className="flex justify-between items-center mb-4"
                                data-oid="pj1.q69"
                            >
                                <h2 className="text-xl font-bold text-gray-800" data-oid="bkxgdki">
                                    메뉴 정보
                                </h2>
                                <button
                                    type="button"
                                    onClick={addMenuItem}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                                    data-oid="rubyq:-"
                                >
                                    메뉴 추가
                                </button>
                            </div>
                            <div className="space-y-4" data-oid="pom1-_4">
                                {formData.menuItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="border border-gray-200 rounded-lg p-4"
                                        data-oid="0464k_g"
                                    >
                                        <div
                                            className="flex justify-between items-center mb-3"
                                            data-oid="qnw2gr4"
                                        >
                                            <span
                                                className="font-medium text-gray-700"
                                                data-oid="egrdkmm"
                                            >
                                                메뉴 {index + 1}
                                            </span>
                                            {formData.menuItems.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMenuItem(index)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                    data-oid="xcq03oa"
                                                >
                                                    삭제
                                                </button>
                                            )}
                                        </div>
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-3 gap-3"
                                            data-oid="v9he326"
                                        >
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) =>
                                                    updateMenuItem(index, 'name', e.target.value)
                                                }
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                                placeholder="메뉴명"
                                                data-oid="i3bkj3_"
                                            />

                                            <input
                                                type="text"
                                                value={item.price}
                                                onChange={(e) =>
                                                    updateMenuItem(index, 'price', e.target.value)
                                                }
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                                placeholder="가격 (예: 8,000원)"
                                                data-oid="ol:_doh"
                                            />

                                            <input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateMenuItem(
                                                        index,
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
                                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                                placeholder="메뉴 설명 (선택사항)"
                                                data-oid="m.x4utd"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 버튼 */}
                        <div className="flex gap-4 justify-center" data-oid="pm4vefm">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                                data-oid=":z-uxqs"
                            >
                                취소하기
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium disabled:opacity-50"
                                data-oid="c2y6_vj"
                            >
                                {isSubmitting ? '등록 중...' : '등록하기'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
