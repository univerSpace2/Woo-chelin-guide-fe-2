# 우슐랭 (Woosullang) 🍽️

회사 맛집을 공유하고 발견하는 플랫폼

## 📋 프로젝트 개요

우슐랭은 직장인들이 회사 주변의 맛집을 공유하고 리뷰할 수 있는 웹 애플리케이션입니다. 카카오 지도 API를 활용하여 위치 기반 맛집 정보를 제공하고, Supabase를 백엔드로 사용하여 실시간 데이터 관리를 지원합니다.

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Map**: Kakao Map API
- **UI**: React Components, Custom Design System

## 📦 설치 및 설정

### 1. 프로젝트 클론

```bash
git clone [repository-url]
cd project-1750083098017
npm install
```

### 2. Supabase 프로젝트 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 데이터베이스 설정:
    ```bash
    # Supabase SQL Editor에서 다음 파일 실행
    lib/database/schema.sql
    ```
3. 스토리지 버킷 생성:
    - 버킷명: `photos`
    - 공개 접근: 활성화
    - 허용 파일 타입: `image/jpeg`, `image/png`, `image/webp`

### 3. 환경변수 설정

`.env.local` 파일을 생성하고 다음 값들을 설정하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 카카오 지도 API
NEXT_PUBLIC_KAKAO_API_KEY=your_kakao_api_key

# 파일 업로드 설정
NEXT_PUBLIC_STORAGE_BUCKET=photos
```

### 4. 카카오 개발자 설정

1. [Kakao Developers](https://developers.kakao.com)에서 앱 생성
2. Web 플랫폼 추가 및 도메인 등록
3. JavaScript 키를 환경변수에 설정

### 5. 개발 서버 실행

```bash
npm run dev
```

## 🗂️ 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 페이지 (지도 + 레스토랑 목록)
│   ├── login/             # 로그인 페이지
│   ├── join/              # 회원가입 페이지
│   ├── detail/            # 레스토랑 상세 페이지
│   ├── add/               # 레스토랑 추가 페이지
│   └── components/        # 공통 컴포넌트
├── lib/                   # 유틸리티 및 설정
│   ├── supabase/          # Supabase 관련
│   │   ├── client.ts      # 클라이언트 설정
│   │   ├── auth.ts        # 인증 함수
│   │   ├── restaurants.ts # 레스토랑 CRUD
│   │   ├── reviews.ts     # 리뷰/댓글 CRUD
│   │   ├── storage.ts     # 파일 업로드
│   │   └── database.types.ts # DB 타입 정의
│   └── database/
│       └── schema.sql     # 데이터베이스 스키마
├── types/                 # TypeScript 타입 정의
│   ├── database.ts        # DB 타입
│   ├── forms.ts           # 폼 타입
│   ├── api.ts             # API 타입
│   ├── constants.ts       # 상수 및 열거형
│   └── index.ts           # 통합 export
└── README.md
```

## 🚀 주요 기능

### 👤 사용자 관리

- 회원가입/로그인
- 익명 이름 시스템
- 프로필 관리

### 🍽️ 레스토랑 관리

- 카카오 지도 연동 레스토랑 검색
- 레스토랑 정보 등록/수정/삭제
- 사진 업로드
- 메뉴 정보 관리

### 📝 리뷰 시스템

- 별점 및 텍스트 리뷰
- 댓글 기능
- 좋아요 시스템
- 리뷰 수정/삭제

### 🗺️ 지도 기능

- 카카오 지도 연동
- 마커 표시
- 위치 기반 검색
- 실시간 위치 추적

### 🔍 검색 및 필터링

- 텍스트 검색
- 카테고리 필터
- 타입별 필터 (점심/회식/카페)
- 제로페이 필터
- 평점 기반 정렬

## 📊 데이터베이스 스키마

### 주요 테이블

- `users`: 사용자 정보
- `restaurants`: 레스토랑 정보
- `reviews`: 리뷰 데이터
- `comments`: 댓글 데이터
- `photos`: 사진 정보
- `menu_items`: 메뉴 정보
- `review_likes`: 리뷰 좋아요

### 보안 정책 (RLS)

- 사용자별 데이터 접근 제어
- 레스토랑 소유자 권한 관리
- 공개/비공개 데이터 분리

## 🔧 개발 도구

### 타입 안전성

- TypeScript로 모든 컴포넌트 타입 정의
- Supabase 타입 자동 생성
- 폼 검증 및 에러 처리

### 코드 품질

- ESLint 설정
- Prettier 코드 포맷팅
- 컴포넌트 재사용성 고려

## 📱 반응형 디자인

- 모바일 퍼스트 접근
- Tailwind CSS 활용
- 터치 친화적 UI

## 🔐 보안 고려사항

- Supabase RLS 정책 적용
- 파일 업로드 검증
- XSS 방지
- 사용자 입력 검증

## 🚀 배포

### Vercel 배포

```bash
npm run build
# Vercel에 연결 후 자동 배포
```

### 환경변수 설정

- Vercel 대시보드에서 환경변수 설정
- 프로덕션/개발 환경 분리

## 📚 API 문서

### 인증 API

- `signUp()`: 회원가입
- `signIn()`: 로그인
- `signOut()`: 로그아웃
- `getCurrentUser()`: 현재 사용자 정보

### 레스토랑 API

- `getRestaurants()`: 레스토랑 목록 조회
- `getRestaurantDetail()`: 레스토랑 상세 정보
- `createRestaurant()`: 레스토랑 등록
- `updateRestaurant()`: 레스토랑 수정
- `deleteRestaurant()`: 레스토랑 삭제

### 리뷰 API

- `createReview()`: 리뷰 작성
- `updateReview()`: 리뷰 수정
- `deleteReview()`: 리뷰 삭제
- `toggleReviewLike()`: 좋아요 토글

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## 📞 연락처

프로젝트 문의: [your-email@example.com]

프로젝트 링크: [https://github.com/yourusername/woosullang]
