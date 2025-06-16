import type { LoginFormData, SignUpFormData } from '@/types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/types/constants';
import { supabase } from './client';

// 회원가입
export async function signUp(formData: SignUpFormData) {
    try {
        // 1. 사용자 인증 계정 생성
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
        });

        if (authError) {
            throw new Error(authError.message);
        }

        if (!authData.user) {
            throw new Error('사용자 생성에 실패했습니다.');
        }

        // 2. 사용자 프로필 정보 저장
        const { error: profileError } = await supabase.from('users').insert({
            id: authData.user.id,
            email: formData.email,
            name: formData.name,
            department: formData.department,
            anonymous_name: formData.anonymousName,
        });

        if (profileError) {
            throw new Error(profileError.message);
        }

        return {
            success: true,
            message: SUCCESS_MESSAGES.SIGNUP_SUCCESS,
            data: authData.user,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 로그인
export async function signIn(formData: LoginFormData) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        });

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
            data: data.user,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 로그아웃
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 현재 사용자 정보 가져오기
export async function getCurrentUser() {
    try {
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
            throw new Error(authError.message);
        }

        if (!user) {
            return {
                success: false,
                error: ERROR_MESSAGES.UNAUTHORIZED,
            };
        }

        // 사용자 프로필 정보 가져오기
        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            throw new Error(profileError.message);
        }

        return {
            success: true,
            data: {
                ...user,
                profile,
            },
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 사용자 프로필 업데이트
export async function updateUserProfile(
    userId: string,
    updates: Partial<{
        name: string;
        department: string;
        anonymous_name: string;
    }>,
) {
    try {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: SUCCESS_MESSAGES.PROFILE_UPDATED,
            data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 비밀번호 변경
export async function updatePassword(newPassword: string) {
    try {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: SUCCESS_MESSAGES.PASSWORD_CHANGED,
            data,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || ERROR_MESSAGES.SERVER_ERROR,
        };
    }
}

// 인증 상태 변화 리스너
export function onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
}
