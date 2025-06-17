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
            data-oid="aco-pk."
        >
            <div
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
                data-oid="z.zn8au"
            >
                <h1
                    className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8"
                    data-oid="05zjkbu"
                >
                    회원가입
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6" data-oid="h3w.ifr">
                    {/* 전역 에러 메시지 */}
                    {errors.general && (
                        <div
                            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                            data-oid="-e6xb9-"
                        >
                            {errors.general}
                        </div>
                    )}

                    {/* 이메일 */}
                    <div data-oid="vyosl_.">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="knn_0pd"
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
                            data-oid="r4yji7."
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600" data-oid="kvg15bj">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* 이름 */}
                    <div data-oid="rnajxck">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="lp.whp1"
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
                            data-oid="aibh42l"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600" data-oid="a8rkgzl">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* 부서 */}
                    <div data-oid="zdv.0an">
                        <label
                            htmlFor="department"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="0ctell6"
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
                            data-oid="qjgc_:c"
                        >
                            <option value="" data-oid="mq4wz3i">
                                부서를 선택하세요
                            </option>
                            {DEPARTMENTS.map((dept) => (
                                <option key={dept} value={dept} data-oid="b9ej42j">
                                    {dept}
                                </option>
                            ))}
                        </select>
                        {errors.department && (
                            <p className="mt-1 text-sm text-red-600" data-oid="lgzn:dd">
                                {errors.department}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 */}
                    <div data-oid="1a2:jn4">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="jxebh9a"
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
                            data-oid="uie:o8l"
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600" data-oid="c1bzmrz">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 재입력 */}
                    <div data-oid="w1ojkdh">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="x1.lmna"
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
                            data-oid="9dlw5px"
                        />

                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600" data-oid=".zfscvi">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* 익명 이름 */}
                    <div data-oid="_:m0gff">
                        <label
                            htmlFor="anonymousName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="3:3oeml"
                        >
                            익명 이름
                        </label>
                        <div className="flex gap-2" data-oid="fx7hpdg">
                            <input
                                type="text"
                                id="anonymousName"
                                name="anonymousName"
                                value={formData.anonymousName}
                                onChange={handleInputChange}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-gray-100"
                                placeholder="익명 이름을 입력하세요"
                                disabled={isLoading}
                                data-oid="azb_b6g"
                            />

                            <button
                                type="button"
                                onClick={generateAnonymousName}
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                data-oid="8-s--zq"
                            >
                                생성
                            </button>
                        </div>
                        {errors.anonymousName && (
                            <p className="mt-1 text-sm text-red-600" data-oid="-3gbes7">
                                {errors.anonymousName}
                            </p>
                        )}
                    </div>

                    {/* 제출 버튼 */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-oid="v6d:6r4"
                    >
                        {isLoading ? '회원가입 중...' : '회원가입'}
                    </button>
                </form>

                {/* 로그인 링크 */}
                <div className="mt-6 text-center" data-oid="_k1u9yd">
                    <p className="text-gray-600 dark:text-gray-400 mb-4" data-oid="4:n2kz9">
                        이미 계정이 있으신가요?
                    </p>
                    <button
                        onClick={() => router.push('/login')}
                        disabled={isLoading}
                        className="text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200 disabled:opacity-50"
                        data-oid="ftal8od"
                    >
                        로그인하기
                    </button>
                </div>
            </div>
        </div>
    );
}
