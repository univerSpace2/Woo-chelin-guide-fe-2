'use client';

import { useState } from 'react';

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // 로그인 로직 구현
        console.log('Login attempt:', { email, password, rememberMe });
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4"
            data-oid="kl8m-m8"
        >
            <div className="w-full max-w-md" data-oid="60m:uqk">
                {/* 로고 및 타이틀 */}
                <div className="text-center mb-8" data-oid="d5guqxj">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4"
                        data-oid="gn2z-kv"
                    >
                        <span className="text-2xl font-bold text-white" data-oid="3jh2_zy">
                            우
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2" data-oid="0ga9gwy">
                        우슐랭
                    </h1>
                    <p className="text-gray-600" data-oid="qc:gi.n">
                        회사 맛집을 공유하고 발견하세요
                    </p>
                </div>

                {/* 로그인 폼 */}
                <div className="bg-white rounded-2xl shadow-xl p-8" data-oid="pnwg:mg">
                    <form onSubmit={handleLogin} className="space-y-6" data-oid="rx0:q0h">
                        {/* 이메일 입력 */}
                        <div data-oid="mlkulet">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="blhmdxr"
                            >
                                이메일
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                placeholder="이메일을 입력하세요"
                                required
                                data-oid="qcpfbj7"
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div data-oid="6e0y2eb">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                                data-oid="mdj.kvx"
                            >
                                비밀번호
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                placeholder="비밀번호를 입력하세요"
                                required
                                data-oid="4te2-gc"
                            />
                        </div>

                        {/* 로그인 정보 기억하기 */}
                        <div className="flex items-center" data-oid="221fivq">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                data-oid="c3ein5_"
                            />

                            <label
                                htmlFor="remember"
                                className="ml-2 text-sm text-gray-600"
                                data-oid="6.t-qnn"
                            >
                                로그인 정보 기억하기
                            </label>
                        </div>

                        {/* 로그인 버튼 */}
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02]"
                            data-oid="ud4ee0g"
                        >
                            로그인
                        </button>
                    </form>

                    {/* 회원가입 링크 */}
                    <div className="mt-6 text-center" data-oid="2aufgsu">
                        <p className="text-gray-600 mb-4" data-oid="jt_ws26">
                            아직 계정이 없으신가요?
                        </p>
                        <button
                            onClick={() => {
                                // 회원가입 페이지로 이동 로직
                                console.log('Navigate to join page');
                            }}
                            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all"
                            data-oid="mlnef-s"
                        >
                            회원가입하기
                        </button>
                    </div>
                </div>

                {/* 푸터 */}
                <div className="text-center mt-8 text-sm text-gray-500" data-oid="o-f3gb8">
                    <p data-oid="6ohovgi">© 2024 우슐랭. 모든 권리 보유.</p>
                </div>
            </div>
        </div>
    );
}
