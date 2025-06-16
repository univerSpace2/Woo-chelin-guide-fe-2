import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
    title: '우슐랭 - 우리 회사 맛집 가이드',
    description: '동료들과 함께 만드는 회사 주변 맛집 리뷰 서비스',
    keywords: ['맛집', '회사', '리뷰', '음식', '점심', '회식', '카페'],
    authors: [
        {
            name: '우슐랭팀',
        },
    ],
    creator: '우슐랭',
    publisher: '우슐랭',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://woochelin.com'),
    // 실제 도메인으로 변경 필요
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: '우슐랭 - 우리 회사 맛집 가이드',
        description: '동료들과 함께 만드는 회사 주변 맛집 리뷰 서비스',
        url: 'https://woochelin.com',
        // 실제 도메인으로 변경 필요
        siteName: '우슐랭',
        images: [
            {
                url: '/woochelin.png',
                width: 1200,
                height: 630,
                alt: '우슐랭 로고',
            },
        ],
        locale: 'ko_KR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '우슐랭 - 우리 회사 맛집 가이드',
        description: '동료들과 함께 만드는 회사 주변 맛집 리뷰 서비스',
        images: ['/woochelin.png'],
        creator: '@woochelin',
    },
    icons: {
        icon: [
            {
                url: '/woochelin.png',
            },
            {
                url: '/woochelin.png',
                sizes: '16x16',
                type: 'image/png',
            },
            {
                url: '/woochelin.png',
                sizes: '32x32',
                type: 'image/png',
            },
        ],
        shortcut: '/woochelin.png',
        apple: [
            {
                url: '/woochelin.png',
            },
            {
                url: '/woochelin.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
        other: [
            {
                rel: 'apple-touch-icon-precomposed',
                url: '/woochelin.png',
            },
        ],
    },
    manifest: '/manifest.json',
    appleWebApp: {
        title: '우슐랭',
        statusBarStyle: 'default',
        capable: true,
    },
    applicationName: '우슐랭',
    referrer: 'origin-when-cross-origin',
    category: 'food',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko" data-oid="p-f0jq0">
            <head data-oid="55-d-sl">
                <link rel="icon" href="/woochelin.png" sizes="any" data-oid="7j999d4" />
                <link rel="icon" href="/woochelin.png" type="image/png" data-oid=":ac:92f" />
                <link rel="apple-touch-icon" href="/woochelin.png" data-oid="-mzqxjl" />
            </head>
            <body data-oid="1333h4u">{children}</body>
        </html>
    );
}
