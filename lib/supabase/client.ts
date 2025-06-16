import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// 환경변수 검증
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        '환경변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 .env.local 파일에 추가해주세요.',
    );
}

// Supabase 클라이언트 생성 (클라이언트 사이드)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
});

// 서버 사이드용 클라이언트 (Service Role Key 사용)
export const supabaseAdmin = createClient<Database>(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    },
);

// 타입 정의를 위한 export
export type SupabaseClient = typeof supabase;
