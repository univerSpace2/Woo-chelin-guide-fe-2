'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/supabase';
import type { SignUpFormData, FormErrors } from '@/types';
import { DEPARTMENTS, ANONYMOUS_NAMES } from '@/types/constants';

export default function Page() {
    const router = useRouter();
    const [formData, setFormData] = useState<SignUpFormData>({
        email: '',
        name: '',
        department: '',
        password: '',
        confirmPassword: '',
        anonymousName: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const generateAnonymousName = () => {
        const randomName = ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
        setFormData((prev) => ({ ...prev, anonymousName: randomName }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.email) {
            newErrors.email = '이메일을 입력해주세요.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = '올바른 이메일 형식을 입력해주세요.';
        }

        if (!formData.name) {
            newErrors.name = '이름을 입력해주세요.';
        }

        if (!formData.department) {
            newErrors.department = '부서를 선택해주세요.';
        }

        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요.';
        } else if (formData.password.length < 6) {
            newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }

        if (!formData.anonymousName) {
            newErrors.anonymousName = '익명 이름을 입력하거나 생성해주세요.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const result = await signUp(formData);

            if (result.success) {
                alert('회원가입이 완료되었습니다! 이메일을 확인해주세요.');
                router.push('/login');
            } else {
                // 서버 에러를 적절한 필드에 표시
                if (result.error?.includes('email')) {
                    setErrors({ email: result.error });
                } else {
                    setErrors({ general: result.error || '회원가입에 실패했습니다.' });
                }
            }
        } catch (err) {
            setErrors({ general: '네트워크 오류가 발생했습니다.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="w-full min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-200 p-4"
            data-oid=".46yfhu"
        >
            <div
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
                data-oid="._a_4wv"
            >
                <h1
                    className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8"
                    data-oid="z69.bdb"
                >
                    회원가입
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6" data-oid="1t_ohll">
                    {/* 전역 에러 메시지 */}
                    {errors.general && (
                        <div
                            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                            data-oid="z1rmmno"
                        >
                            {errors.general}
                        </div>
                    )}

                    {/* 이메일 */}
                    <div data-oid="-.0t21z">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="095_sto"
                        >
                            이메일
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="이메일을 입력하세요"
                            disabled={isLoading}
                            data-oid="edjm0p8"
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600" data-oid="1q2:8iy">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* 이름 */}
                    <div data-oid="nsc5x8r">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="kuk8wiw"
                        >
                            이름
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="이름을 입력하세요"
                            disabled={isLoading}
                            data-oid="r9k6u.h"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600" data-oid="fnj0s0-">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* 부서 */}
                    <div data-oid="xo8cu18">
                        <label
                            htmlFor="department"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="gukwa5f"
                        >
                            부서
                        </label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                            disabled={isLoading}
                            data-oid=".1gavcx"
                        >
                            <option value="" data-oid="r_6s07:">
                                부서를 선택하세요
                            </option>
                            {DEPARTMENTS.map((dept) => (
                                <option key={dept} value={dept} data-oid="65mlz9p">
                                    {dept}
                                </option>
                            ))}
                        </select>
                        {errors.department && (
                            <p className="mt-1 text-sm text-red-600" data-oid="5afgx_b">
                                {errors.department}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 */}
                    <div data-oid="qyhkkqj">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="-ihwj-y"
                        >
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="비밀번호를 입력하세요"
                            disabled={isLoading}
                            data-oid="s1n99dt"
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600" data-oid="nehyedc">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 재입력 */}
                    <div data-oid="uja4ury">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="jj3h-yz"
                        >
                            비밀번호 재입력
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="비밀번호를 다시 입력하세요"
                            disabled={isLoading}
                            data-oid="4w-4sr8"
                        />

                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600" data-oid="l-pqa73">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* 익명 이름 */}
                    <div data-oid="-sh_709">
                        <label
                            htmlFor="anonymousName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="_5qrfoy"
                        >
                            익명 이름
                        </label>
                        <div className="flex gap-2" data-oid="lbqa_xs">
                            <input
                                type="text"
                                id="anonymousName"
                                name="anonymousName"
                                value={formData.anonymousName}
                                onChange={handleInputChange}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                                placeholder="익명 이름을 입력하세요"
                                disabled={isLoading}
                                data-oid="2ep8dmf"
                            />

                            <button
                                type="button"
                                onClick={generateAnonymousName}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="gnue0gg"
                            >
                                생성
                            </button>
                        </div>
                        {errors.anonymousName && (
                            <p className="mt-1 text-sm text-red-600" data-oid="w0wh8cg">
                                {errors.anonymousName}
                            </p>
                        )}
                    </div>

                    {/* 제출 버튼 */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-oid="wcdvr4k"
                    >
                        {isLoading ? '회원가입 중...' : '회원가입'}
                    </button>
                </form>

                {/* 로그인 링크 */}
                <div className="mt-6 text-center" data-oid="yiys_bt">
                    <p className="text-gray-600 dark:text-gray-400 mb-4" data-oid="hbzd1y4">
                        이미 계정이 있으신가요?
                    </p>
                    <button
                        onClick={() => router.push('/login')}
                        disabled={isLoading}
                        className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200 disabled:opacity-50"
                        data-oid="k8mm1xi"
                    >
                        로그인하기
                    </button>
                </div>
            </div>
        </div>
    );
}
