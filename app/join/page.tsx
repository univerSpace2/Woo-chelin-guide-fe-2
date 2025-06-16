'use client';

import { useState } from 'react';

export default function Page() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        department: '',
        password: '',
        confirmPassword: '',
        anonymousName: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const anonymousNames = [
        '신비한 고양이',
        '용감한 사자',
        '지혜로운 올빼미',
        '빠른 치타',
        '강한 곰',
        '우아한 백조',
        '영리한 여우',
        '친근한 강아지',
        '자유로운 독수리',
        '평화로운 비둘기',
        '활발한 다람쥐',
        '조용한 토끼',
        '멋진 늑대',
        '귀여운 팬더',
        '화려한 공작',
    ];

    const generateAnonymousName = () => {
        const randomName = anonymousNames[Math.floor(Math.random() * anonymousNames.length)];
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('회원가입 데이터:', formData);
            // 여기에 실제 회원가입 로직을 구현
            alert('회원가입이 완료되었습니다!');
        }
    };

    return (
        <div
            className="w-full min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-200 p-4"
            data-oid="ql4vgbx"
        >
            <div
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
                data-oid="bzo21-e"
            >
                <h1
                    className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8"
                    data-oid="yej0vty"
                >
                    회원가입
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6" data-oid="7ei4kgj">
                    {/* 이메일 */}
                    <div data-oid="dtovxmz">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="4m_9s6f"
                        >
                            이메일
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="이메일을 입력하세요"
                            data-oid="86uwpgs"
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600" data-oid="v1sp_i:">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* 이름 */}
                    <div data-oid="qw2i:g2">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="upjmi8o"
                        >
                            이름
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="이름을 입력하세요"
                            data-oid="sy1qa:r"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600" data-oid="v3sukrb">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* 부서 */}
                    <div data-oid="nc6st5d">
                        <label
                            htmlFor="department"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="8ugmu5j"
                        >
                            부서
                        </label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            data-oid="_oymaju"
                        >
                            <option value="" data-oid="r1d8r5:">
                                부서를 선택하세요
                            </option>
                            <option value="개발팀" data-oid="sol90pt">
                                개발팀
                            </option>
                            <option value="디자인팀" data-oid="ibnqb3y">
                                디자인팀
                            </option>
                            <option value="마케팅팀" data-oid="bgl8zhm">
                                마케팅팀
                            </option>
                            <option value="영업팀" data-oid="t5:16j9">
                                영업팀
                            </option>
                            <option value="인사팀" data-oid="is-oopw">
                                인사팀
                            </option>
                            <option value="재무팀" data-oid="58fwecj">
                                재무팀
                            </option>
                            <option value="기타" data-oid="3j792pp">
                                기타
                            </option>
                        </select>
                        {errors.department && (
                            <p className="mt-1 text-sm text-red-600" data-oid="p09_4i:">
                                {errors.department}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 */}
                    <div data-oid="8b9:nti">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="32ph-tc"
                        >
                            비밀번호
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="비밀번호를 입력하세요"
                            data-oid="vk2--67"
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600" data-oid="ev70prs">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 재입력 */}
                    <div data-oid="ej54rvz">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid=".1nq:be"
                        >
                            비밀번호 재입력
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="비밀번호를 다시 입력하세요"
                            data-oid="dfhb1cr"
                        />

                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600" data-oid="qwaupiw">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* 익명 이름 */}
                    <div data-oid="nw5evks">
                        <label
                            htmlFor="anonymousName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="jipxx-7"
                        >
                            익명 이름
                        </label>
                        <div className="flex gap-2" data-oid="er-jhhv">
                            <input
                                type="text"
                                id="anonymousName"
                                name="anonymousName"
                                value={formData.anonymousName}
                                onChange={handleInputChange}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                placeholder="익명 이름을 입력하세요"
                                data-oid="z1nfvoj"
                            />

                            <button
                                type="button"
                                onClick={generateAnonymousName}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                data-oid="ooaen8f"
                            >
                                생성
                            </button>
                        </div>
                        {errors.anonymousName && (
                            <p className="mt-1 text-sm text-red-600" data-oid="2ia.38k">
                                {errors.anonymousName}
                            </p>
                        )}
                    </div>

                    {/* 제출 버튼 */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        data-oid="w5i7ot5"
                    >
                        회원가입
                    </button>
                </form>
            </div>
        </div>
    );
}
