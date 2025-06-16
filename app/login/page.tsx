'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/supabase';
import type { LoginFormData } from '@/types';

export default function Page() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // 에러 메시지 초기화
        if (error) {
            setError('');
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn(formData);

            if (result.success) {
                // 로그인 성공
                router.push('/');
            } else {
                setError(result.error || '로그인에 실패했습니다.');
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* 로고 및 타이틀 */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-orange-500 rounded-full mb-4">
                        <img
                            src="/woochelin.png"
                            alt="우슐랭 로고"
                            className="w-32 h-32 rounded-lg object-cover"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">우슐랭</h1>
                    <p className="text-gray-600">회사 맛집을 공유하고 발견하세요</p>
                </div>

                {/* 로그인 폼 */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* 에러 메시지 */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* 이메일 입력 */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                이메일
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                placeholder="이메일을 입력하세요"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                비밀번호
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                placeholder="비밀번호를 입력하세요"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* 로그인 정보 기억하기 */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                disabled={isLoading}
                            />

                            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                                로그인 정보 기억하기
                            </label>
                        </div>

                        {/* 로그인 버튼 */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? '로그인 중...' : '로그인'}
                        </button>
                    </form>

                    {/* 회원가입 링크 */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 mb-4">아직 계정이 없으신가요?</p>
                        <button
                            onClick={() => router.push('/join')}
                            disabled={isLoading}
                            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
                        >
                            회원가입하기
                        </button>
                    </div>
                </div>

                {/* 푸터 */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>© 2024 우슐랭. 모든 권리 보유.</p>
                </div>
            </div>
        </div>
    );
}
