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

                <form onSubmit={handleSubmit} className="space-y-6" data-oid="fk5fm6t">
                    {/* 이메일 */}
                    <div data-oid="i3inrpk">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="kj1at65"
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
                            data-oid="vr0i:57"
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600" data-oid="8rie0e1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* 이름 */}
                    <div data-oid="uxxct2h">
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="zfr:lop"
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
                            data-oid="9ev5tww"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600" data-oid="w7jssf7">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* 부서 */}
                    <div data-oid="evd5:1v">
                        <label
                            htmlFor="department"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="15-jtx:"
                        >
                            부서
                        </label>
                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            data-oid="2sqj7mp"
                        >
                            <option value="" data-oid="43le-cl">
                                부서를 선택하세요
                            </option>
                            <option value="개발팀" data-oid="vkxbulw">
                                개발팀
                            </option>
                            <option value="디자인팀" data-oid="6-b.k_-">
                                디자인팀
                            </option>
                            <option value="마케팅팀" data-oid="alrwk2u">
                                마케팅팀
                            </option>
                            <option value="영업팀" data-oid="48pq1h8">
                                영업팀
                            </option>
                            <option value="인사팀" data-oid="zn5ul24">
                                인사팀
                            </option>
                            <option value="재무팀" data-oid="s4eg47z">
                                재무팀
                            </option>
                            <option value="기타" data-oid="2xhc792">
                                기타
                            </option>
                        </select>
                        {errors.department && (
                            <p className="mt-1 text-sm text-red-600" data-oid="0.sp-in">
                                {errors.department}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 */}
                    <div data-oid="z9:uent">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="zwq-a4h"
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
                            data-oid="wu5i:e."
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600" data-oid="e8z8w4t">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 재입력 */}
                    <div data-oid="l8_rjo.">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="rd7c1l1"
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
                            data-oid="vh-wi24"
                        />

                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600" data-oid="ucak:y0">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* 익명 이름 */}
                    <div data-oid="h34_9e9">
                        <label
                            htmlFor="anonymousName"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                            data-oid="q.lz-f2"
                        >
                            익명 이름
                        </label>
                        <div className="flex gap-2" data-oid="0vf-4.z">
                            <input
                                type="text"
                                id="anonymousName"
                                name="anonymousName"
                                value={formData.anonymousName}
                                onChange={handleInputChange}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                placeholder="익명 이름을 입력하세요"
                                data-oid="vr2--q3"
                            />

                            <button
                                type="button"
                                onClick={generateAnonymousName}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                data-oid="0zfevp-"
                            >
                                생성
                            </button>
                        </div>
                        {errors.anonymousName && (
                            <p className="mt-1 text-sm text-red-600" data-oid="ka:9n.2">
                                {errors.anonymousName}
                            </p>
                        )}
                    </div>

                    {/* 제출 버튼 */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        data-oid="jugdmrx"
                    >
                        회원가입
                    </button>
                </form>
            </div>
        </div>
    );
}
