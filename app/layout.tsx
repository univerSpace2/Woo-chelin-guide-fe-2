import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: '우슐랭',
    description: '우리 회사 맛집 가이드',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <head></head>
            <body>{children}</body>
        </html>
    );
}
