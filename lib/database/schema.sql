-- 우슐랭 프로젝트 Supabase 데이터베이스 스키마

-- Users 테이블 (auth.users 확장)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    anonymous_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users 정책
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Restaurants 테이블
CREATE TABLE public.restaurants (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('한식', '중식', '일식', '양식', '카페', '패스트푸드', '기타')),
    type TEXT NOT NULL CHECK (type IN ('점심', '회식', '카페')),
    avg_price TEXT NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    main_image TEXT,
    has_zero_pay BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    address TEXT NOT NULL,
    road_address TEXT,
    phone TEXT,
    hours TEXT,
    description TEXT,
    kakao_category TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 지리적 인덱스 추가
CREATE INDEX idx_restaurants_location ON public.restaurants USING BTREE (latitude, longitude);
CREATE INDEX idx_restaurants_category ON public.restaurants (category);
CREATE INDEX idx_restaurants_type ON public.restaurants (type);
CREATE INDEX idx_restaurants_rating ON public.restaurants (rating);

-- RLS 활성화
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Restaurants 정책
CREATE POLICY "Anyone can view restaurants" ON public.restaurants
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create restaurants" ON public.restaurants
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own restaurants" ON public.restaurants
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own restaurants" ON public.restaurants
    FOR DELETE USING (auth.uid() = created_by);

-- Photos 테이블
CREATE TABLE public.photos (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES public.restaurants(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    uploaded_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Photos 정책
CREATE POLICY "Anyone can view photos" ON public.photos
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload photos" ON public.photos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete own photos" ON public.photos
    FOR DELETE USING (auth.uid() = uploaded_by);

-- Menu Items 테이블
CREATE TABLE public.menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Menu Items 정책
CREATE POLICY "Anyone can view menu items" ON public.menu_items
    FOR SELECT USING (true);

CREATE POLICY "Restaurant owners can manage menu items" ON public.menu_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.restaurants 
            WHERE id = menu_items.restaurant_id 
            AND created_by = auth.uid()
        )
    );

-- Reviews 테이블
CREATE TABLE public.reviews (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES public.restaurants(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.users(id),
    author_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0 CHECK (likes >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restaurant_id, author_id) -- 한 사용자당 레스토랑별 리뷰 하나만
);

-- 인덱스 추가
CREATE INDEX idx_reviews_restaurant ON public.reviews (restaurant_id);
CREATE INDEX idx_reviews_author ON public.reviews (author_id);
CREATE INDEX idx_reviews_rating ON public.reviews (rating);

-- RLS 활성화
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Reviews 정책
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own reviews" ON public.reviews
    FOR DELETE USING (auth.uid() = author_id);

-- Comments 테이블
CREATE TABLE public.comments (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES public.reviews(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.users(id),
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가
CREATE INDEX idx_comments_review ON public.comments (review_id);
CREATE INDEX idx_comments_author ON public.comments (author_id);

-- RLS 활성화
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Comments 정책
CREATE POLICY "Anyone can view comments" ON public.comments
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = author_id);

CREATE POLICY "Users can update own comments" ON public.comments
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments" ON public.comments
    FOR DELETE USING (auth.uid() = author_id);

-- Review Likes 테이블
CREATE TABLE public.review_likes (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES public.reviews(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, user_id) -- 한 사용자당 리뷰별 좋아요 하나만
);

-- 인덱스 추가
CREATE INDEX idx_review_likes_review ON public.review_likes (review_id);
CREATE INDEX idx_review_likes_user ON public.review_likes (user_id);

-- RLS 활성화
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

-- Review Likes 정책
CREATE POLICY "Anyone can view review likes" ON public.review_likes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like reviews" ON public.review_likes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can unlike reviews" ON public.review_likes
    FOR DELETE USING (auth.uid() = user_id);

-- 함수: 레스토랑 평점 및 리뷰 수 업데이트
CREATE OR REPLACE FUNCTION update_restaurant_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.restaurants 
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM public.reviews 
            WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM public.reviews 
            WHERE restaurant_id = COALESCE(NEW.restaurant_id, OLD.restaurant_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.restaurant_id, OLD.restaurant_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 트리거: 리뷰 변경 시 레스토랑 통계 업데이트
CREATE TRIGGER trigger_update_restaurant_stats
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_restaurant_stats();

-- 함수: 리뷰 좋아요 수 업데이트
CREATE OR REPLACE FUNCTION update_review_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.reviews 
    SET 
        likes = (
            SELECT COUNT(*) 
            FROM public.review_likes 
            WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.review_id, OLD.review_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 트리거: 좋아요 변경 시 리뷰 좋아요 수 업데이트
CREATE TRIGGER trigger_update_review_likes
    AFTER INSERT OR DELETE ON public.review_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_review_likes();

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거들
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_restaurants_updated_at
    BEFORE UPDATE ON public.restaurants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_menu_items_updated_at
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 뷰: 레스토랑 상세 정보 (조인된 데이터)
CREATE VIEW restaurant_details AS
SELECT 
    r.*,
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', p.id,
                'url', p.url,
                'alt', p.alt,
                'uploaded_by', p.uploaded_by,
                'created_at', p.created_at
            )
        ) FILTER (WHERE p.id IS NOT NULL), 
        '[]'
    ) as photos,
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', m.id,
                'name', m.name,
                'price', m.price,
                'description', m.description,
                'created_at', m.created_at,
                'updated_at', m.updated_at
            )
        ) FILTER (WHERE m.id IS NOT NULL), 
        '[]'
    ) as menu_items
FROM public.restaurants r
LEFT JOIN public.photos p ON r.id = p.restaurant_id
LEFT JOIN public.menu_items m ON r.id = m.restaurant_id
GROUP BY r.id;

-- 뷰: 리뷰 상세 정보 (댓글 포함)
CREATE VIEW review_details AS
SELECT 
    r.*,
    COALESCE(
        json_agg(
            DISTINCT jsonb_build_object(
                'id', c.id,
                'author_id', c.author_id,
                'author_name', c.author_name,
                'content', c.content,
                'created_at', c.created_at,
                'updated_at', c.updated_at
            )
        ) FILTER (WHERE c.id IS NOT NULL), 
        '[]'
    ) as comments
FROM public.reviews r
LEFT JOIN public.comments c ON r.id = c.review_id
GROUP BY r.id; 